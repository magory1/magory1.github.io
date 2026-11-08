"""
Lab 6 – OFDM: beating multipath with many narrow subcarriers
Dr. Eyal Magory, JCT – Lev Academic Center

OFDM (Wi-Fi, LTE, 5G, DVB) sends N symbols in parallel on N subcarriers:
    time signal = IFFT{X[k]}, then a cyclic prefix (CP) is prepended.
If the channel delay spread is shorter than the CP, the channel becomes a
single complex gain per subcarrier:   Y[k] = H[k] X[k] + W[k]
so equalization is one division per subcarrier.

Frame: [gap | training | training | data symbols | gap]
  * two identical training symbols -> timing, CFO and H[k] estimation
  * 4 pilot subcarriers in every data symbol -> residual phase tracking

The multipath channel is applied in software before transmission,
so the same experiment works on a Pluto with a loopback cable.

Run:
  python lab06_ofdm.py                      # 16-QAM, 3-path channel
  python lab06_ofdm.py --cp 4               # CP shorter than the delay spread -> ISI
  python lab06_ofdm.py --pluto
"""
import matplotlib.pyplot as plt
import numpy as np

from pluto_common import constellation, finish, get_args, make_radio, bits_to_symbols, symbols_to_bits


def extra(p):
    p.add_argument("--nfft", type=int, default=64)
    p.add_argument("--cp", type=int, default=16, help="cyclic prefix length [samples]")
    p.add_argument("--nsym", type=int, default=60, help="OFDM data symbols")
    p.add_argument("--mod", default="16qam", choices=["qpsk", "16qam"])


args = get_args("Lab 6 – OFDM", snr=28, cfo=1500, extra=extra)
rng = np.random.default_rng(args.seed)
N, CP = args.nfft, args.cp
const, k = constellation(args.mod)

# subcarrier plan (Wi-Fi like): DC and edges unused, 4 pilots
used = np.r_[-26:0, 1:27] % N
pilots = np.array([-21, -7, 7, 21]) % N
data_sc = np.array([s for s in used if s not in pilots])
train = np.exp(2j * np.pi * rng.random(N))                     # known training values
train[np.setdiff1d(np.arange(N), used)] = 0


def ofdm_symbol(X):
    t = np.fft.ifft(X) * np.sqrt(N)
    return np.concatenate([t[-CP:], t])


bits = rng.integers(0, 2, len(data_sc) * args.nsym * k).astype(np.uint8)
D = bits_to_symbols(bits, const, k).reshape(args.nsym, len(data_sc))
syms = []
for m in range(args.nsym):
    X = np.zeros(N, complex)
    X[data_sc] = D[m]
    X[pilots] = 1.0
    syms.append(ofdm_symbol(X))
tw = ofdm_symbol(train)
gap = np.zeros(300, complex)
x = np.concatenate([gap, tw, tw, *syms, gap])

h = np.array([1, 0, 0, 0.6j, 0, 0, 0, 0, 0.35 - 0.2j])        # 3-path channel, spread 8 samples
x_ch = np.convolve(x, h)[: len(x)]                              # applied before the radio

radio = make_radio(args)
y = radio.txrx(x_ch, 2 * len(x))

# ---- timing: non-coherent segmented correlation with the training pair ----
ref = np.concatenate([tw, tw])
L = len(ref)
frame_len = L + args.nsym * (N + CP)
search = y[: len(y) - frame_len + L]
nseg, ls = 8, L // 8
c = np.zeros(len(search) - L + 1)
for i in range(nseg):
    c += np.abs(np.correlate(search[i * ls:], ref[i * ls:(i + 1) * ls], "valid"))[: len(c)]
start = int(np.argmax(c))
r = y[start: start + frame_len]

# ---- CFO from the two training symbols (N+CP apart) ----
a, b = r[CP: CP + N], r[2 * CP + N: 2 * CP + 2 * N]
cfo = np.angle(np.vdot(a, b)) * args.fs / (2 * np.pi * (N + CP))
r = r * np.exp(-2j * np.pi * cfo * np.arange(len(r)) / args.fs)
print(f"frame start {start}, CFO estimate {cfo:.1f} Hz (true {args.cfo if not args.pluto else '?'} Hz)")

# ---- channel estimate per subcarrier ----
fft = lambda s: np.fft.fft(s) / np.sqrt(N)
Y1, Y2 = fft(r[CP: CP + N]), fft(r[2 * CP + N: 2 * (CP + N)])
H = np.zeros(N, complex)
H[used] = (Y1[used] + Y2[used]) / 2 / train[used]

# ---- data ----
eq, raw = [], []
o = 2 * (N + CP)
for m in range(args.nsym):
    Y = fft(r[o + m * (N + CP) + CP: o + (m + 1) * (N + CP)])
    Z = Y / np.where(H == 0, 1, H)
    ph = np.angle(np.sum(Z[pilots]))                        # common phase error from pilots
    eq.append(Z[data_sc] * np.exp(-1j * ph))
    raw.append(Y[data_sc] / np.mean(np.abs(H[used])))
eq, raw = np.concatenate(eq), np.concatenate(raw)
ber = np.mean(symbols_to_bits(eq, const, k) != bits)
ideal = const[np.argmin(np.abs(eq[:, None] - const[None, :]), axis=1)]
evm = np.sqrt(np.mean(np.abs(eq - ideal) ** 2))
print(f"{args.mod.upper()} OFDM: CP {CP}, BER {ber:.2e}, EVM {20*np.log10(evm):.1f} dB")

# ---- plots ----
fig, ax = plt.subplots(1, 3, figsize=(15, 4.3))
f_sc = np.fft.fftshift(np.fft.fftfreq(N, 1 / N))
Htrue = np.fft.fft(h, N)
g = np.vdot(Htrue[used], H[used]) / np.vdot(Htrue[used], Htrue[used])   # unknown radio gain/phase
ax[0].plot(f_sc, np.fft.fftshift(20 * np.log10(np.abs(Htrue) + 1e-9)), "k-", label="true channel")
Hs = np.fft.fftshift(H / g)
ax[0].plot(f_sc[Hs != 0], 20 * np.log10(np.abs(Hs[Hs != 0])), "o", ms=4, label="estimate")
ax[0].set(title="|H[k]| per subcarrier", xlabel="subcarrier", ylabel="dB")
ax[0].legend()
ax[1].plot(raw.real, raw.imag, ".", ms=2, alpha=0.4)
ax[1].set(title="Before equalization", xlabel="I", ylabel="Q")
ax[1].set_aspect("equal")
ax[2].plot(eq.real, eq.imag, ".", ms=2, alpha=0.4)
ax[2].plot(const.real, const.imag, "r+", ms=10, mew=2)
ax[2].set(title=f"After 1-tap equalizer  BER {ber:.1e}", xlabel="I", ylabel="Q")
ax[2].set_aspect("equal")
finish(fig, "lab06_ofdm", args)
