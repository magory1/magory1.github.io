"""
Lab 7 – Radar basics with the Pluto: chirp pulses, pulse compression and range
Dr. Eyal Magory, JCT – Lev Academic Center

A radar measures the round-trip delay tau of an echo:  R = c * tau / 2.
A short pulse gives good resolution but little energy. A long linear
chirp (LFM) has both: after the matched filter ("pulse compression") its
width is ~1/B, so the range resolution is  dR = c / (2B).

We emulate targets in software (delayed, attenuated copies of the chirp,
added before transmission). The direct path is the zero-range reference,
so the experiment also works over a Pluto loopback cable, where TX and RX
buffers have an unknown time offset.

Run:
  python lab07_radar_chirp.py
  python lab07_radar_chirp.py --targets 300 312 900 --bw 8e6     # can you resolve 300/312 m?
  python lab07_radar_chirp.py --pluto --fs 20e6
This is the starting point for the lab's mmWave FMCW radar research (TI IWR1843).
"""
import matplotlib.pyplot as plt
import numpy as np

from pluto_common import finish, get_args, make_radio

C = 3e8


def extra(p):
    p.add_argument("--bw", type=float, default=16e6, help="chirp bandwidth [Hz]")
    p.add_argument("--tp", type=float, default=50e-6, help="chirp duration [s]")
    p.add_argument("--pri", type=float, default=200e-6, help="pulse repetition interval [s]")
    p.add_argument("--targets", type=float, nargs="+", default=[300, 345, 900], help="ranges [m]")
    p.add_argument("--rcs-db", type=float, nargs="+", default=[-20, -26, -32], help="echo levels [dB]")


args = get_args("Lab 7 – chirp radar", fs=20e6, snr=10, extra=extra)
fs, B, Tp = args.fs, args.bw, args.tp
n = np.arange(int(Tp * fs))
t = n / fs
chirp = np.exp(1j * np.pi * (B / Tp) * (t - Tp / 2) ** 2)          # LFM from -B/2 to +B/2
Npri = int(args.pri * fs)
pulse = np.zeros(Npri, complex)
pulse[: len(chirp)] = chirp


def delay(x, tau):
    """Delay by tau seconds (fractional, via the frequency domain; cyclic)."""
    f = np.fft.fftfreq(len(x), 1 / fs)
    return np.fft.ifft(np.fft.fft(x) * np.exp(-2j * np.pi * f * tau))


scene = pulse.copy()                                               # direct path = range 0
for R, a in zip(args.targets, args.rcs_db + [-30] * len(args.targets)):
    scene += 10 ** (a / 20) * delay(pulse, 2 * R / C)

radio = make_radio(args)
y = radio.txrx(scene, 8 * Npri)

# pulse compression = matched filter, done per PRI and averaged (coherent integration)
Y = y[: (len(y) // Npri) * Npri].reshape(-1, Npri)
results = {}
for name, w in [("rectangular", np.ones(len(chirp))), ("Hamming window", np.hamming(len(chirp)))]:
    ref = np.zeros(Npri, complex)
    ref[: len(chirp)] = chirp * w
    mf = np.fft.ifft(np.fft.fft(Y, axis=1) * np.conj(np.fft.fft(ref)), axis=1)
    p = np.abs(mf.mean(axis=0)) ** 2
    k0 = int(np.argmax(p))                                          # direct path
    p = np.roll(p, -k0)
    results[name] = 10 * np.log10(p / p.max() + 1e-12)

rng_axis = np.arange(Npri) / fs * C / 2
print(f"range resolution c/2B = {C/(2*B):.1f} m, bin = {C/(2*fs):.1f} m, "
      f"max unambiguous range = {C*args.pri/2/1e3:.1f} km")
print(f"time-bandwidth product BT = {B*Tp:.0f}  (compression gain {10*np.log10(B*Tp):.0f} dB)")
p = results["Hamming window"]
for R in args.targets:
    kk = int(round(2 * R / C * fs))
    win = slice(max(kk - 3, 1), kk + 4)
    est = rng_axis[win][np.argmax(p[win])]
    print(f"  target {R:7.1f} m -> peak at {est:7.1f} m, level {p[win].max():6.1f} dB")

fig, ax = plt.subplots(1, 2, figsize=(14, 4.3))
finst = np.diff(np.unwrap(np.angle(chirp))) * fs / (2 * np.pi)
ax[0].plot(t[1:] * 1e6, finst / 1e6)
ax[0].set(title=f"Chirp instantaneous frequency  B={B/1e6:.0f} MHz, T={Tp*1e6:.0f} us",
          xlabel="time [us]", ylabel="MHz")
for name, p in results.items():
    ax[1].plot(rng_axis, p, lw=1, label=name)
for R in args.targets:
    ax[1].axvline(R, color="r", ls=":", lw=1)
ax[1].set(title="Range profile after pulse compression", xlabel="range [m]", ylabel="dB",
          xlim=(-50, max(args.targets) * 1.2), ylim=(-70, 3))
ax[1].legend()
finish(fig, "lab07_radar_chirp", args)
