"""
Lab 2 – Analog modulation: AM and FM, transmitted and demodulated
Dr. Eyal Magory, JCT – Lev Academic Center

The message is a sum of two audio tones. We build the complex baseband
AM and FM signals, send them through the radio and demodulate:
  AM : envelope detector   m_hat = |y| - mean(|y|)
  FM : phase discriminator m_hat = angle( y[n] * conj(y[n-1]) ) * fs / (2*pi*kf)

Bonus with real hardware (receive only, legal everywhere):
  python lab02_am_fm.py --pluto --broadcast 99.0e6     # listen to an FM station

Run:
  python lab02_am_fm.py            # simulation
  python lab02_am_fm.py --pluto    # loopback on the Pluto
"""
import matplotlib.pyplot as plt
import numpy as np
from scipy import signal

from pluto_common import finish, get_args, make_radio, spectrum_db


def extra(p):
    p.add_argument("--mu", type=float, default=0.6, help="AM modulation index")
    p.add_argument("--kf", type=float, default=5e3, help="FM peak deviation [Hz]")
    p.add_argument("--broadcast", type=float, default=None, help="receive a real FM station at this frequency [Hz]")


args = get_args("Lab 2 – AM and FM", fs=240e3, snr=30, cfo=300, extra=extra)
fs = args.fs
radio = make_radio(args)

if args.broadcast:                                    # ------- real FM radio --------
    radio.sdr.rx_lo = int(args.broadcast)
    y = radio.rx_only(int(fs))                         # 1 second
    d = np.angle(y[1:] * np.conj(y[:-1]))
    b, a = signal.butter(5, 15e3 / (fs / 2))
    audio = signal.lfilter(b, a, d)[:: int(fs // 48000)]
    audio /= np.max(np.abs(audio))
    from scipy.io import wavfile
    wavfile.write("fm_broadcast.wav", 48000, (audio * 32767).astype(np.int16))
    print("saved fm_broadcast.wav")
    raise SystemExit

N = 2 ** 15
t = np.arange(N) / fs
m = 0.6 * np.sin(2 * np.pi * 1e3 * t) + 0.4 * np.sin(2 * np.pi * 2.5e3 * t)   # message, |m| <= 1

x_am = 1 + args.mu * m                                                # AM (complex baseband = real)
x_fm = np.exp(2j * np.pi * args.kf * np.cumsum(m) / fs)              # FM

y_am = radio.txrx(x_am, N)
y_fm = radio.txrx(x_fm, N)

b, a = signal.butter(5, 5e3 / (fs / 2))
am_hat = signal.filtfilt(b, a, np.abs(y_am))
am_hat = am_hat - np.mean(am_hat)
d = np.angle(y_fm[1:] * np.conj(y_fm[:-1])) * fs / (2 * np.pi * args.kf)
fm_hat = signal.filtfilt(b, a, d)
fm_hat = fm_hat - np.mean(fm_hat)       # removes the CFO (a constant frequency shift)


def best_align(ref, est):
    """Find the circular shift of ref that best matches est (TX is cyclic)."""
    c = np.fft.ifft(np.fft.fft(est, len(ref)) * np.conj(np.fft.fft(ref)))
    s = int(np.argmax(np.abs(c)))
    r = np.roll(ref, s)[: len(est)]
    g = np.dot(est, r) / np.dot(r, r)
    snr = 10 * np.log10(np.sum((g * r) ** 2) / np.sum((est - g * r) ** 2))
    return r, g, snr


r_am, g_am, snr_am = best_align(m, am_hat)
r_fm, g_fm, snr_fm = best_align(m, fm_hat)
print(f"output SNR:  AM {snr_am:.1f} dB   FM {snr_fm:.1f} dB   (channel SNR {args.snr} dB)")
print(f"FM bandwidth by Carson's rule: 2*(kf+fm) = {2*(args.kf+2.5e3)/1e3:.1f} kHz")

fig, ax = plt.subplots(2, 2, figsize=(13, 7))
k = slice(1000, 1000 + int(4e-3 * fs))
ms = 1e3 * t[k]
for row, (name, y, est, r, g, snr) in enumerate(
        [("AM", y_am, am_hat, r_am, g_am, snr_am), ("FM", y_fm, fm_hat, r_fm, g_fm, snr_fm)]):
    f, P = spectrum_db(y, fs, 2048)
    ax[row, 0].plot(f / 1e3, P - P.max(), lw=0.8)
    ax[row, 0].set(title=f"{name} – received spectrum", xlabel="kHz", ylabel="dB", xlim=(-30, 30), ylim=(-80, 5))
    ax[row, 1].plot(ms, g * r[k], lw=2, label="message")
    ax[row, 1].plot(ms, est[k], "--", label=f"demodulated (SNR {snr:.0f} dB)")
    ax[row, 1].set(title=f"{name} – demodulation", xlabel="ms")
    ax[row, 1].legend(loc="upper right")
finish(fig, "lab02_am_fm", args)
