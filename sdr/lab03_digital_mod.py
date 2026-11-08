"""
Lab 3 – Digital modulation: pulse shaping, matched filter, eye diagram and BER
Dr. Eyal Magory, JCT – Lev Academic Center

Transmitter : bits -> BPSK/QPSK/16-QAM symbols -> root-raised-cosine (RRC) pulses
Receiver    : frame sync + CFO + phase (Framer, see pluto_common.py)
              -> RRC matched filter -> sample once per symbol -> decide
RRC * RRC = raised cosine, a Nyquist pulse: zero ISI at the sampling instants.

Part A: one frame through the radio – eye diagram, constellation, EVM, BER.
Part B: BER vs Eb/N0 sweep (simulation) compared with theory.

Run:
  python lab03_digital_mod.py --mod qpsk
  python lab03_digital_mod.py --mod 16qam --snr 22
  python lab03_digital_mod.py --mod qpsk --pluto
"""
import matplotlib.pyplot as plt
import numpy as np

from pluto_common import (Framer, SimRadio, ber_theory, bits_to_symbols, constellation,
                          finish, get_args, make_radio, symbols_to_bits)


def extra(p):
    p.add_argument("--mod", default="qpsk", choices=["bpsk", "qpsk", "16qam"])
    p.add_argument("--nsym", type=int, default=2000, help="data symbols per frame")
    p.add_argument("--beta", type=float, default=0.35, help="RRC roll-off")


args = get_args("Lab 3 – digital modulation", snr=20, cfo=150, extra=extra)
rng = np.random.default_rng(args.seed)
const, k = constellation(args.mod)
fr = Framer(sps=8, beta=args.beta)

# ---------------- Part A: one frame ----------------
bits = rng.integers(0, 2, args.nsym * k).astype(np.uint8)
x = fr.build(bits_to_symbols(bits, const, k))
radio = make_radio(args)
y = radio.txrx(x, 2 * len(x))
rx = fr.receive(y, args.fs)
s = rx["sym"]
bits_hat = symbols_to_bits(s, const, k)
ber = np.mean(bits_hat != bits)
ideal = const[np.argmin(np.abs(s[:, None] - const[None, :]), axis=1)]
evm = np.sqrt(np.mean(np.abs(s - ideal) ** 2) / np.mean(np.abs(ideal) ** 2))
print(f"{args.mod.upper()}: frame at {rx['start']}, CFO estimate {rx['cfo']:.1f} Hz, "
      f"EVM {100*evm:.1f}% ({20*np.log10(evm):.1f} dB), BER {ber:.2e} ({int(ber*len(bits))} errors)")

# ---------------- Part B: BER sweep (simulation) ----------------
ebn0 = np.arange(0, 15 if args.mod != "16qam" else 19, 2)
ber_sim = []
for e in ebn0:
    es_n0 = e + 10 * np.log10(k)               # SNR per symbol
    # the sampled MF output has SNR = Es/N0 ; channel SNR per sample is Es/N0 - 10log10(sps)
    sim = SimRadio(args.fs, snr_db=es_n0 - 10 * np.log10(fr.sps), seed=int(e) + 7)
    nb = 0
    ne = 0
    while ne < 200 and nb < 4e5:
        b = rng.integers(0, 2, 4000 * k).astype(np.uint8)
        # AWGN only, no CFO: we switch the CFO estimator off. At low SNR its small
        # error accumulates into a large phase drift over a long frame – Lab 4 fixes
        # exactly this with a phase-tracking loop.
        r = fr.receive(sim.txrx(fr.build(bits_to_symbols(b, const, k))), args.fs, fix_cfo=False)
        ne += np.sum(symbols_to_bits(r["sym"], const, k) != b)
        nb += len(b)
    ber_sim.append(ne / nb if ne else np.nan)    # no errors -> not plotted
    print(f"  Eb/N0 {e:4.1f} dB   BER {ne/nb:.2e}")

# ---------------- plots ----------------
fig, ax = plt.subplots(1, 3, figsize=(15, 4.5))
mf = rx["mf"].real
sps = fr.sps
o = 2 * fr.d + 2 * fr.lp * sps                    # first data sample
for i in range(200):
    seg = mf[o + i * sps - sps: o + i * sps + sps + 1]
    if len(seg) == 2 * sps + 1:
        ax[0].plot(np.arange(-sps, sps + 1) / sps, seg, "b", alpha=0.15, lw=0.8)
ax[0].axvline(0, color="r", ls="--")
ax[0].set(title="Eye diagram (I) after matched filter", xlabel="time [symbols]")
ax[1].plot(s.real, s.imag, ".", ms=2, alpha=0.5)
ax[1].plot(const.real, const.imag, "r+", ms=12, mew=2)
ax[1].set(title=f"{args.mod.upper()} constellation  EVM {100*evm:.1f}%", xlabel="I", ylabel="Q")
ax[1].set_aspect("equal")
ee = np.linspace(0, ebn0[-1], 100)
ax[2].semilogy(ee, ber_theory(args.mod, ee), "k-", label="theory")
ax[2].semilogy(ebn0, ber_sim, "o", label="simulation (full receiver)")
ax[2].set(title="BER vs Eb/N0", xlabel="Eb/N0 [dB]", ylabel="BER", ylim=(1e-6, 0.5))
ax[2].grid(True, which="both", alpha=0.3)
ax[2].legend()
finish(fig, f"lab03_digital_mod_{args.mod}", args)
