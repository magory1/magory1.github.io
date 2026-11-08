"""
pluto_common.py – shared helpers for the ADALM-Pluto SDR lab
Dr. Eyal Magory, JCT – Lev Academic Center

Every experiment runs in one of two modes:
  * simulation (default)  – a software channel that imitates the Pluto loopback
  * hardware  (--pluto)    – a real ADALM-Pluto, TX connected to RX with an SMA
                             cable and a 30 dB attenuator

Requirements:  pip install numpy scipy matplotlib
Hardware only: pip install pyadi-iio   (and libiio from Analog Devices)

SAFETY / LEGAL: transmit only through a cable + attenuator, or at very low
power inside an ISM band permitted by your local regulator.
"""
import argparse
import os

import numpy as np


# ----------------------------------------------------------------------------
# command line
# ----------------------------------------------------------------------------
def get_args(description, fc=915e6, fs=1e6, snr=25.0, cfo=0.0, extra=None):
    p = argparse.ArgumentParser(description=description)
    p.add_argument("--pluto", nargs="?", const="ip:192.168.2.1", default=None,
                   help="use real hardware (optional URI, default ip:192.168.2.1)")
    p.add_argument("--fc", type=float, default=fc, help="carrier frequency [Hz]")
    p.add_argument("--fs", type=float, default=fs, help="sample rate [Hz]")
    p.add_argument("--snr", type=float, default=snr, help="simulation SNR [dB]")
    p.add_argument("--cfo", type=float, default=cfo, help="simulation carrier offset [Hz]")
    p.add_argument("--tx-gain", type=float, default=-30, help="Pluto TX gain [dB], -89..0")
    p.add_argument("--rx-gain", type=float, default=30, help="Pluto RX gain [dB], 0..70")
    p.add_argument("--seed", type=int, default=1, help="random seed (simulation)")
    p.add_argument("--save", action="store_true", help="save the figure to figures/")
    p.add_argument("--no-show", action="store_true", help="do not open a plot window")
    if extra:
        extra(p)
    return p.parse_args()


# ----------------------------------------------------------------------------
# radio front-end: real Pluto or simulated loopback
# ----------------------------------------------------------------------------
class PlutoRadio:
    """Thin wrapper around pyadi-iio for a TX->RX loopback experiment."""

    def __init__(self, uri, fc, fs, tx_gain=-30, rx_gain=30, bw=None):
        import adi  # imported here so simulation works without pyadi-iio

        self.sdr = adi.Pluto(uri)
        self.fs = fs
        s = self.sdr
        s.sample_rate = int(fs)
        s.rx_lo = int(fc)
        s.tx_lo = int(fc)
        s.rx_rf_bandwidth = int(bw or fs)
        s.tx_rf_bandwidth = int(bw or fs)
        s.gain_control_mode_chan0 = "manual"
        s.rx_hardwaregain_chan0 = rx_gain
        s.tx_hardwaregain_chan0 = tx_gain
        s.tx_cyclic_buffer = True

    def txrx(self, x, n_rx=None):
        """Transmit x repeatedly (cyclic) and capture n_rx samples."""
        s = self.sdr
        n_rx = int(n_rx or 2 * len(x))
        x = np.asarray(x, dtype=complex)
        x = x / (np.max(np.abs(x)) + 1e-12) * 2**14 * 0.5   # DAC full scale = 2**14
        s.tx_destroy_buffer()
        s.rx_buffer_size = n_rx
        s.tx(x)
        for _ in range(4):           # flush stale buffers
            s.rx()
        y = s.rx() / 2**11           # ADC full scale = 2**11
        s.tx_destroy_buffer()
        return y

    def rx_only(self, n_rx):
        s = self.sdr
        s.rx_buffer_size = int(n_rx)
        for _ in range(2):
            s.rx()
        return s.rx() / 2**11


class SimRadio:
    """Software loopback that imitates what the Pluto does to a signal.

    Impairments: cyclic repetition, random delay, carrier phase, carrier
    frequency offset (CFO), AWGN, optional multipath, DC offset, IQ imbalance,
    oscillator phase noise.
    """

    def __init__(self, fs, snr_db=25, cfo=0.0, seed=1, multipath=None,
                 dc=0.0, iq_gain_db=0.0, iq_phase_deg=0.0, delay=None, phase_noise=0.0):
        self.fs = fs
        self.snr_db = snr_db
        self.cfo = cfo
        self.rng = np.random.default_rng(seed)
        self.multipath = multipath
        self.dc = dc
        self.iq_gain = 10 ** (iq_gain_db / 20)
        self.iq_phase = np.deg2rad(iq_phase_deg)
        self.delay = delay
        self.phase_noise = phase_noise      # oscillator phase random walk [rad/sqrt(sample)]

    def txrx(self, x, n_rx=None):
        x = np.asarray(x, dtype=complex)
        x = x / (np.max(np.abs(x)) + 1e-12) * 0.5
        n_rx = int(n_rx or 2 * len(x))
        reps = int(np.ceil(n_rx / len(x))) + 2
        y = np.tile(x, reps)
        if self.multipath is not None:
            y = np.convolve(y, self.multipath)[: len(y)]
        d = self.delay if self.delay is not None else int(self.rng.integers(0, len(x)))
        y = y[d: d + n_rx]
        n = np.arange(n_rx)
        ph = 2 * np.pi * self.cfo * n / self.fs + self.rng.uniform(0, 2 * np.pi)
        if self.phase_noise:
            ph = ph + np.cumsum(self.phase_noise * self.rng.standard_normal(n_rx))
        y = y * np.exp(1j * ph)
        p = np.mean(np.abs(y) ** 2)
        noise = np.sqrt(p / 10 ** (self.snr_db / 10) / 2) * (
            self.rng.standard_normal(n_rx) + 1j * self.rng.standard_normal(n_rx))
        y = y + noise
        # IQ imbalance: Q branch has gain/phase error
        i, q = y.real, y.imag
        q2 = self.iq_gain * (q * np.cos(self.iq_phase) + i * np.sin(self.iq_phase))
        return i + 1j * q2 + self.dc

    def rx_only(self, n_rx):
        raise RuntimeError("rx_only needs real hardware (--pluto)")


def make_radio(args, **sim_kwargs):
    if args.pluto:
        print(f"[hardware] ADALM-Pluto at {args.pluto}, fc={args.fc/1e6:.3f} MHz, fs={args.fs/1e6:.3f} MS/s")
        return PlutoRadio(args.pluto, args.fc, args.fs, args.tx_gain, args.rx_gain)
    print(f"[simulation] SNR={args.snr} dB, CFO={args.cfo} Hz (use --pluto for hardware)")
    return SimRadio(args.fs, args.snr, args.cfo, args.seed, **sim_kwargs)


# ----------------------------------------------------------------------------
# DSP helpers
# ----------------------------------------------------------------------------
def rrc(beta, sps, span):
    """Root-raised-cosine filter taps, unit energy."""
    t = np.arange(-span * sps, span * sps + 1) / sps
    h = np.zeros_like(t)
    for k, tk in enumerate(t):
        if abs(tk) < 1e-9:
            h[k] = 1 - beta + 4 * beta / np.pi
        elif beta and abs(abs(4 * beta * tk) - 1) < 1e-9:
            h[k] = beta / np.sqrt(2) * ((1 + 2 / np.pi) * np.sin(np.pi / (4 * beta))
                                        + (1 - 2 / np.pi) * np.cos(np.pi / (4 * beta)))
        else:
            h[k] = (np.sin(np.pi * tk * (1 - beta)) + 4 * beta * tk * np.cos(np.pi * tk * (1 + beta))) / (
                np.pi * tk * (1 - (4 * beta * tk) ** 2))
    return h / np.sqrt(np.sum(h ** 2))


def constellation(name):
    """Unit-average-power constellations and bits per symbol."""
    name = name.lower()
    if name == "bpsk":
        c = np.array([-1, 1], dtype=complex)
    elif name == "qpsk":
        c = np.array([1 + 1j, -1 + 1j, 1 - 1j, -1 - 1j]) / np.sqrt(2)   # Gray: first bit -> Q sign, second -> I sign
    elif name == "16qam":
        lv = np.array([-3, -1, 3, 1])                                  # Gray per axis: 00,01,10,11
        c = np.array([lv[i] + 1j * lv[q] for i in range(4) for q in range(4)]) / np.sqrt(10)
    else:
        raise ValueError(name)
    return c, int(np.log2(len(c)))


def bits_to_symbols(bits, const, k):
    idx = bits.reshape(-1, k) @ (1 << np.arange(k)[::-1])
    return const[idx]


def symbols_to_bits(sym, const, k):
    idx = np.argmin(np.abs(sym[:, None] - const[None, :]), axis=1)
    return ((idx[:, None] >> np.arange(k)[::-1]) & 1).astype(np.uint8).ravel()


def spectrum_db(x, fs, nfft=4096):
    x = x[: (len(x) // nfft) * nfft].reshape(-1, nfft) if len(x) >= nfft else x[None, :]
    w = np.hanning(x.shape[1])
    X = np.fft.fftshift(np.fft.fft(x * w, axis=1), axes=1)
    P = np.mean(np.abs(X) ** 2, axis=0) / np.sum(w ** 2)
    f = np.fft.fftshift(np.fft.fftfreq(x.shape[1], 1 / fs))
    return f, 10 * np.log10(P + 1e-20)


def zadoff_chu(n=63, root=25):
    k = np.arange(n)
    return np.exp(-1j * np.pi * root * k * (k + 1) / n)


# ----------------------------------------------------------------------------
# a simple single-carrier frame:  [gap | preamble | preamble | data | gap]
# ----------------------------------------------------------------------------
class Framer:
    """Pulse-shaped frame with a repeated Zadoff-Chu preamble.

    The receiver:
      1. correlates with the preamble waveform  -> frame start (timing)
      2. compares the two preamble copies       -> carrier frequency offset
      3. divides by the known preamble          -> channel gain and phase
      4. matched filter (RRC) and sampling      -> data symbols
    """

    def __init__(self, sps=8, beta=0.35, span=6, lp=63, gap=200):
        self.sps, self.beta, self.lp, self.gap = sps, beta, lp, gap
        self.h = rrc(beta, sps, span)
        self.pre = zadoff_chu(lp)
        self.d = (len(self.h) - 1) // 2          # filter group delay [samples]

    def shape(self, sym):
        up = np.zeros(len(sym) * self.sps, dtype=complex)
        up[:: self.sps] = sym
        return np.convolve(up, self.h)

    def build(self, data_sym):
        sym = np.concatenate([self.pre, self.pre, data_sym])
        x = self.shape(sym)
        z = np.zeros(self.gap, dtype=complex)
        self.n_data = len(data_sym)
        return np.concatenate([z, x, z])

    def receive(self, y, fs, n_data=None, fix_cfo=True, fix_phase=True):
        n_data = n_data or self.n_data
        sps, lp = self.sps, self.lp
        ref = self.shape(np.concatenate([self.pre, self.pre]))   # both preamble copies
        span = (2 * lp + n_data) * sps + 2 * self.d + 1
        search = y[: len(y) - span + len(ref)]        # every start that leaves a full frame
        # Correlate in 8 short segments and add the magnitudes (non-coherent).
        # A single long correlation would be smeared by a carrier offset.
        nseg = 8
        ls = len(ref) // nseg
        nc = len(search) - len(ref) + 1
        c = np.zeros(nc)
        for i in range(nseg):
            seg = ref[i * ls:(i + 1) * ls]
            c += np.abs(np.correlate(search[i * ls:], seg, mode="valid"))[:nc]
        start = int(np.argmax(c))                     # first sample of the frame
        r = y[start: start + span].copy()

        # CFO from the two identical preamble copies (they are lp*sps samples apart)
        L = lp * sps
        a = r[2 * self.d: L]                          # interior samples of copy 1
        b = r[L + 2 * self.d: 2 * L]                  # same samples of copy 2
        cfo = np.angle(np.sum(b * np.conj(a))) * fs / (2 * np.pi * L) if fix_cfo else 0.0
        r = r * np.exp(-2j * np.pi * cfo * np.arange(len(r)) / fs)

        mf = np.convolve(r, self.h)                   # matched filter
        sym = mf[2 * self.d:: sps][: 2 * lp + n_data]
        g = np.vdot(self.pre, sym[:lp] + sym[lp: 2 * lp]) / (2 * lp) if fix_phase else 1.0
        sym = sym / g
        return dict(sym=sym[2 * lp:], pre=sym[: 2 * lp], start=start, cfo=cfo, gain=g,
                    mf=mf / g, corr=c)


def dd_pll(s, const, bn=0.01, zeta=0.707):
    """Second-order decision-directed PLL (Costas loop for PSK/QAM).

    Returns the de-rotated symbols and the phase track [rad]."""
    th = bn / (zeta + 1 / (4 * zeta))
    kp = 4 * zeta * th / (1 + 2 * zeta * th + th * th)   # proportional gain
    ki = 4 * th * th / (1 + 2 * zeta * th + th * th)     # integral gain
    phi, integ = 0.0, 0.0
    out = np.empty_like(s)
    track = np.empty(len(s))
    for n, v in enumerate(s):
        z = v * np.exp(-1j * phi)
        d = const[np.argmin(np.abs(z - const))]
        e = np.imag(z * np.conj(d)) / (abs(d) ** 2)      # phase detector
        integ += ki * e
        phi += kp * e + integ                            # NCO
        out[n], track[n] = z, phi
    return out, track


def ber_theory(name, ebn0_db):
    from scipy.special import erfc

    g = 10 ** (np.asarray(ebn0_db) / 10)
    Q = lambda x: 0.5 * erfc(x / np.sqrt(2))
    if name in ("bpsk", "qpsk"):
        return Q(np.sqrt(2 * g))
    if name == "16qam":
        return 0.75 * Q(np.sqrt(0.8 * g))          # Gray-coded 16-QAM (nearest-neighbour approx.)
    raise ValueError(name)


def finish(fig, name, args):
    """Save to figures/<name>.png when --save, then show unless --no-show."""
    import matplotlib.pyplot as plt

    fig.tight_layout()
    if args.save:
        out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "figures")
        os.makedirs(out, exist_ok=True)
        path = os.path.join(out, name + ".png")
        fig.savefig(path, dpi=110)
        print("saved", path)
    if not args.no_show:
        plt.show()
