"""
Lab 1 – First contact: a complex tone, the spectrum and I/Q impairments
Dr. Eyal Magory, JCT – Lev Academic Center

We transmit a single complex exponential  x[n] = exp(j*2*pi*f0*n/fs)
and look at what comes back: the wanted tone, the DC spike (LO leakage)
and the image at -f0 caused by I/Q gain/phase imbalance.

Run:
  python lab01_tone_spectrum.py                  # simulation
  python lab01_tone_spectrum.py --pluto          # real Pluto, TX->RX cable + 30 dB attenuator
  python lab01_tone_spectrum.py --iq-gain 1 --iq-phase 5     # stronger simulated imbalance
"""
import matplotlib.pyplot as plt
import numpy as np

from pluto_common import finish, get_args, make_radio, spectrum_db


def extra(p):
    p.add_argument("--f0", type=float, default=100e3, help="tone frequency [Hz]")
    p.add_argument("--iq-gain", type=float, default=0.5, help="sim I/Q gain imbalance [dB]")
    p.add_argument("--iq-phase", type=float, default=3.0, help="sim I/Q phase imbalance [deg]")
    p.add_argument("--dc", type=float, default=0.01, help="sim DC offset")


args = get_args("Lab 1 – tone, spectrum, I/Q imbalance", extra=extra)
radio = make_radio(args, dc=args.dc, iq_gain_db=args.iq_gain, iq_phase_deg=args.iq_phase)

N = 4096
f0 = round(args.f0 * N / args.fs) * args.fs / N        # put the tone exactly on an FFT bin
n = np.arange(N)
x = np.exp(2j * np.pi * f0 * n / args.fs)
y = radio.txrx(x, 8 * N)

f, P = spectrum_db(y, args.fs, nfft=N)
P -= P.max()
k_sig = np.argmin(np.abs(f - f0))
k_img = np.argmin(np.abs(f + f0))
k_dc = np.argmin(np.abs(f))
irr = P[k_sig] - P[k_img]
print(f"tone at {f0/1e3:.1f} kHz   image rejection ratio (IRR) = {irr:.1f} dB   DC = {P[k_dc]:.1f} dBc")

# simple I/Q imbalance correction (blind, second-order statistics)
yc = y - np.mean(y)
i, q = yc.real, yc.imag
q = q - np.mean(i * q) / np.mean(i * i) * i               # remove I leakage in Q (phase error)
q = q * np.sqrt(np.mean(i * i) / np.mean(q * q))         # equalize amplitude
yc = i + 1j * q
_, Pc = spectrum_db(yc, args.fs, nfft=N)
Pc -= Pc.max()
print(f"after correction: IRR = {Pc[k_sig] - Pc[k_img]:.1f} dB")

fig, ax = plt.subplots(1, 3, figsize=(14, 4))
ax[0].plot(y[:200].real, label="I")
ax[0].plot(y[:200].imag, label="Q")
ax[0].set(title="Received I and Q (time)", xlabel="sample")
ax[0].legend()
ax[1].plot(f / 1e3, P, lw=0.8, label="received")
ax[1].plot(f / 1e3, Pc, lw=0.8, alpha=0.8, label="after I/Q correction")
ax[1].annotate("tone", (f0 / 1e3, P[k_sig]), xytext=(10, -15), textcoords="offset points")
ax[1].annotate("image", (-f0 / 1e3, P[k_img]), xytext=(10, 5), textcoords="offset points")
ax[1].annotate("DC / LO leakage", (0, P[k_dc]), xytext=(10, 5), textcoords="offset points")
ax[1].set(title=f"Spectrum  (IRR {irr:.0f} dB)", xlabel="frequency [kHz]", ylabel="dBc", ylim=(-110, 5))
ax[1].legend(loc="lower right")
ax[2].plot(y[:2000].real, y[:2000].imag, ".", ms=1)
ax[2].set(title="I/Q plane – ideal is a circle", xlabel="I", ylabel="Q")
ax[2].set_aspect("equal")
finish(fig, "lab01_tone_spectrum", args)
