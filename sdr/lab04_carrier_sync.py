"""
Lab 4 – Carrier synchronization: frequency offset, Costas loop / digital PLL
Dr. Eyal Magory, JCT – Lev Academic Center

Two oscillators are never exactly equal. A carrier frequency offset (CFO)
of df Hz rotates the constellation by 2*pi*df*Ts radians every symbol.

  Step 1 – coarse CFO from the repeated preamble (feed-forward, Framer)
  Step 2 – fine tracking with a decision-directed PLL (a Costas loop for QPSK):
           phase detector  e[k] = Im{ y[k] * conj(decision(y[k])) }
           PI loop filter  -> NCO that rotates the next symbol
The same structure as the analog PLL from the communication course,
only digital.

On the Pluto we create a real offset by tuning TX and RX LOs apart:
  python lab04_carrier_sync.py --pluto --cfo 700
Simulation:
  python lab04_carrier_sync.py --cfo 700 --bn 0.02 --phase-noise 0.004   # stronger oscillator noise
"""
import matplotlib.pyplot as plt
import numpy as np

from pluto_common import (Framer, bits_to_symbols, constellation, dd_pll, finish, get_args,
                          make_radio, symbols_to_bits)


def extra(p):
    p.add_argument("--bn", type=float, default=0.01, help="loop noise bandwidth (normalized to symbol rate)")
    p.add_argument("--nsym", type=int, default=3000)
    p.add_argument("--phase-noise", type=float, default=0.002, help="sim oscillator phase noise [rad/sqrt(sample)]")


args = get_args("Lab 4 – carrier synchronization", snr=18, cfo=700, extra=extra)
rng = np.random.default_rng(args.seed)
const, k = constellation("qpsk")
fr = Framer(sps=8)
bits = rng.integers(0, 2, args.nsym * k).astype(np.uint8)
x = fr.build(bits_to_symbols(bits, const, k))

radio = make_radio(args, phase_noise=args.phase_noise)
if args.pluto:
    radio.sdr.tx_lo = int(args.fc + args.cfo)       # real oscillator offset
y = radio.txrx(x, 2 * len(x))

raw = fr.receive(y, args.fs, fix_cfo=False)          # phase fixed at the preamble only
raw["sym"] = raw["sym"] * abs(raw["gain"]) / np.mean(np.abs(raw["sym"] * raw["gain"]))   # keep unit amplitude
coarse = fr.receive(y, args.fs, fix_cfo=True)
print(f"true CFO {args.cfo:.0f} Hz, coarse estimate {coarse['cfo']:.1f} Hz")


fine, track = dd_pll(coarse["sym"], const, args.bn)   # see pluto_common.py
for name, s in [("no CFO correction", raw["sym"]), ("coarse only", coarse["sym"]), ("coarse + PLL", fine)]:
    print(f"  {name:18s} BER {np.mean(symbols_to_bits(s, const, k) != bits):.2e}")

fig, ax = plt.subplots(1, 4, figsize=(17, 4.2))
for a, (title, s) in zip(ax[:3], [("No correction", raw["sym"]), ("Coarse CFO only", coarse["sym"]),
                                    ("Coarse + PLL", fine)]):
    a.scatter(s.real, s.imag, c=np.arange(len(s)), s=2, cmap="viridis")
    a.set(title=title, xlim=(-1.8, 1.8), ylim=(-1.8, 1.8), xlabel="I", ylabel="Q")
    a.set_aspect("equal")
Ts = fr.sps / args.fs
ax[3].plot(track, lw=1)
res = np.polyfit(np.arange(len(track)), track, 1)[0] / (2 * np.pi * Ts)
print(f"  residual CFO tracked by the PLL: {res:.1f} Hz")
ax[3].set(title="PLL phase estimate (residual CFO = slope)", xlabel="symbol", ylabel="rad")
finish(fig, "lab04_carrier_sync", args)
