"""
Lab 5 – A complete digital link: send a text message, protect it with a channel code
Dr. Eyal Magory, JCT – Lev Academic Center

Transmitter : text -> bits -> [Hamming(7,4) encoder] -> QPSK -> frame -> Pluto
Receiver    : sync -> QPSK decisions -> [Hamming(7,4) syndrome decoder] -> text

Hamming(7,4): 4 data bits + 3 parity bits, corrects any single error in a
7-bit codeword (minimum distance 3). Rate 4/7, so for a fair comparison
the energy per *information* bit is the same:  Ec = (4/7) Eb.

This connects the Information Theory course (linear codes, syndrome
decoding, capacity) to a real radio link.

Run:
  python lab05_text_link_coding.py --text "Hello from JCT" --snr -1
  python lab05_text_link_coding.py --pluto --tx-gain -60     # weak link -> errors
"""
import matplotlib.pyplot as plt
import numpy as np

from pluto_common import (Framer, SimRadio, ber_theory, bits_to_symbols, constellation,
                          dd_pll, finish, get_args, make_radio, symbols_to_bits)

# ---------------- Hamming(7,4) ----------------
G = np.array([[1, 0, 0, 0, 1, 1, 0],
              [0, 1, 0, 0, 1, 0, 1],
              [0, 0, 1, 0, 0, 1, 1],
              [0, 0, 0, 1, 1, 1, 1]], dtype=np.uint8)          # systematic generator
H = np.array([[1, 1, 0, 1, 1, 0, 0],
              [1, 0, 1, 1, 0, 1, 0],
              [0, 1, 1, 1, 0, 0, 1]], dtype=np.uint8)          # parity-check, G @ H.T = 0
SYND = {tuple(H[:, i]): i for i in range(7)}                   # syndrome -> error position


def hamming_encode(bits):
    return (bits.reshape(-1, 4) @ G % 2).astype(np.uint8).ravel()


def hamming_decode(code):
    c = code.reshape(-1, 7).copy()
    s = c @ H.T % 2
    for row, syn in enumerate(map(tuple, s)):
        if any(syn):
            c[row, SYND[syn]] ^= 1                              # flip the erroneous bit
    return c[:, :4].ravel()


def text_to_bits(t):
    return np.unpackbits(np.frombuffer(t.encode("utf-8"), dtype=np.uint8))


def bits_to_text(b):
    return np.packbits(b[: len(b) // 8 * 8]).tobytes().decode("utf-8", errors="replace")


def extra(p):
    p.add_argument("--text", default="Communication lab, JCT - Lev Academic Center. " * 4)
    p.add_argument("--no-coding", action="store_true")


args = get_args("Lab 5 – text link with channel coding", snr=-1, cfo=200, extra=extra)
assert not (G @ H.T % 2).any()
const, k = constellation("qpsk")
fr = Framer(sps=8)

# ---------------- Part A: send the message ----------------
# Same transmit power and symbol rate for both: the coded message takes 7/4 longer,
# so each information bit gets 7/4 more energy. (Part B compares at equal Eb/N0.)
info = text_to_bits(args.text)
pad = (-len(info)) % 8
info = np.concatenate([info, np.zeros(pad, np.uint8)])
radio = make_radio(args)
for coded in ([False] if args.no_coding else [False, True]):
    tx_bits = hamming_encode(info) if coded else info
    tx_bits = np.concatenate([tx_bits, np.zeros((-len(tx_bits)) % k, np.uint8)])
    y = radio.txrx(fr.build(bits_to_symbols(tx_bits, const, k)))
    sym, _ = dd_pll(fr.receive(y, args.fs)["sym"], const)      # carrier tracking (Lab 4)
    rx_bits = symbols_to_bits(sym, const, k)
    raw_err = int(np.sum(rx_bits != tx_bits))
    out = hamming_decode(rx_bits[: len(info) // 4 * 7]) if coded else rx_bits[: len(info)]
    err = int(np.sum(out != info))
    print(f"\n{'Hamming(7,4)' if coded else 'uncoded':13s}: channel bit errors {raw_err}, "
          f"information bit errors {err}/{len(info)}")
    print("  received text:", bits_to_text(out[: len(info) - pad]))

# ---------------- Part B: BER sweep, coded vs uncoded (simulation) ----------------
rng = np.random.default_rng(args.seed)
ebn0 = np.arange(0, 11, 1.0)
res = {"uncoded": [], "Hamming(7,4)": []}
for e in ebn0:
    for name, rate in [("uncoded", 1.0), ("Hamming(7,4)", 4 / 7)]:
        es_n0 = e + 10 * np.log10(k * rate)
        sim = SimRadio(args.fs, snr_db=es_n0 - 10 * np.log10(fr.sps), seed=int(10 * e) + 3)
        ne = nb = 0
        while ne < 150 and nb < 3e5:
            ib = rng.integers(0, 2, 4000).astype(np.uint8)
            tb = hamming_encode(ib) if rate < 1 else ib
            tb = np.concatenate([tb, np.zeros((-len(tb)) % k, np.uint8)])
            r = fr.receive(sim.txrx(fr.build(bits_to_symbols(tb, const, k))), args.fs, fix_cfo=False)
            rb = symbols_to_bits(r["sym"], const, k)
            ob = hamming_decode(rb[: 7000]) if rate < 1 else rb[:4000]
            ne += np.sum(ob != ib)
            nb += len(ib)
        res[name].append(ne / nb if ne else np.nan)
    print(f"  Eb/N0 {e:4.1f} dB   uncoded {res['uncoded'][-1]:.2e}   Hamming {res['Hamming(7,4)'][-1]:.2e}")

# theory for the coded curve: channel bit error p at Ec/N0 = (4/7) Eb/N0.
# A word with j >= 2 errors is mis-decoded and ends up with about j+1 wrong bits:
#   Pb ~ sum_{j=2..7} min(j+1, 7)/7 * C(7,j) p^j (1-p)^(7-j)
from math import comb

ee = np.linspace(0, 10, 100)
p = ber_theory("qpsk", ee + 10 * np.log10(4 / 7))
coded_th = sum(min(j + 1, 7) / 7 * comb(7, j) * p ** j * (1 - p) ** (7 - j) for j in range(2, 8))

fig, ax = plt.subplots(figsize=(7, 4.5))
ax.semilogy(ee, ber_theory("qpsk", ee), "k-", label="uncoded – theory")
ax.semilogy(ee, coded_th, "k--", label="Hamming(7,4) – approximation")
ax.semilogy(ebn0, res["uncoded"], "o", label="uncoded – simulation")
ax.semilogy(ebn0, res["Hamming(7,4)"], "s", label="Hamming(7,4) – simulation")
ax.set(title="QPSK over the radio: coded vs uncoded", xlabel="Eb/N0 per information bit [dB]",
       ylabel="information BER", ylim=(1e-6, 0.5))
ax.grid(True, which="both", alpha=0.3)
ax.legend()
finish(fig, "lab05_text_link_coding", args)
