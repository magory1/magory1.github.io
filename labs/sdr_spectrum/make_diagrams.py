"""Figures for the SDR spectrum lab guide: receiver block diagram (SVG) and band map (PNG).
Run: python3 make_diagrams.py"""
import pathlib
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

OUT = pathlib.Path(__file__).parent
NAVY, BLUE, ORANGE, GREEN, GREY = "#15315a", "#1f5fa8", "#e8892b", "#2e9e5b", "#5b6676"
FONT = "font-family='Helvetica, Arial, sans-serif'"

# ---------------- block diagram of the Pluto receiver ----------------
items = []
def box(x, y, w, h, t, sub="", fill="#eef3fa", stroke=NAVY):
    items.append(f"<rect x='{x}' y='{y}' width='{w}' height='{h}' rx='8' fill='{fill}' stroke='{stroke}' stroke-width='1.6'/>")
    cy = y + h/2 + (-5 if sub else 5)
    items.append(f"<text x='{x+w/2}' y='{cy}' text-anchor='middle' font-size='14' font-weight='bold' fill='{NAVY}' {FONT}>{t}</text>")
    for i, line in enumerate(sub.split("|") if sub else []):
        items.append(f"<text x='{x+w/2}' y='{cy+16+i*14}' text-anchor='middle' font-size='11.5' fill='{GREY}' {FONT}>{line}</text>")
def wire(pts, dash=False, color=GREY):
    d = " ".join(f"{'M' if i == 0 else 'L'}{x},{y}" for i, (x, y) in enumerate(pts))
    items.append(f"<path d='{d}' fill='none' stroke='{color}' stroke-width='2' {'stroke-dasharray=\"5 4\"' if dash else ''} marker-end='url(#a)'/>")
def text(x, y, s, size=12, color=NAVY, anchor="middle", bold=False):
    items.append(f"<text x='{x}' y='{y}' text-anchor='{anchor}' font-size='{size}' fill='{color}' {'font-weight=\"bold\"' if bold else ''} {FONT}>{s}</text>")
def mixer(cx, cy, r=17):
    items.append(f"<circle cx='{cx}' cy='{cy}' r='{r}' fill='white' stroke='{NAVY}' stroke-width='1.8'/>")
    d = r*0.6
    items.append(f"<path d='M{cx-d},{cy-d} L{cx+d},{cy+d} M{cx-d},{cy+d} L{cx+d},{cy-d}' stroke='{NAVY}' stroke-width='1.8'/>")
def param(x, y, s):
    items.append(f"<rect x='{x-4}' y='{y-13}' width='{len(s)*7.1+8}' height='19' rx='4' fill='#fff6ea' stroke='{ORANGE}'/>")
    text(x, y, s, 11.5, "#a0521a", "start")

W, H = 1060, 330
# antenna
items.append(f"<path d='M40,60 L40,150 M22,60 L40,90 L58,60' fill='none' stroke='{NAVY}' stroke-width='2'/>")
wire([(40, 150), (40, 165), (78, 165)])
box(80, 140, 80, 50, "LNA", "amplifier")
wire([(160, 165), (200, 165), (200, 105), (243, 105)]); wire([(200, 165), (200, 225), (243, 225)])
mixer(260, 105); mixer(260, 225)
box(205, 265, 110, 46, "LO  fc", "cos / sin (90°)", "#fff", NAVY)
wire([(245, 265), (245, 250), (260, 250), (260, 244)])
wire([(275, 265), (275, 258), (290, 258), (290, 140), (260, 140), (260, 124)], dash=True)
text(222, 98, "I", 14, BLUE, bold=True); text(222, 218, "Q", 14, ORANGE, bold=True)
wire([(277, 105), (338, 105)]); wire([(277, 225), (338, 225)])
box(340, 82, 90, 46, "LPF", "analog"); box(340, 202, 90, 46, "LPF", "analog")
wire([(430, 105), (468, 105)]); wire([(430, 225), (468, 225)])
box(470, 82, 90, 46, "ADC", "12 bit"); box(470, 202, 90, 46, "ADC", "12 bit")
wire([(560, 105), (598, 105), (598, 140), (618, 140)]); wire([(560, 225), (598, 225), (598, 190), (618, 190)])
box(620, 118, 150, 94, "Digital filter", "DC + I/Q correction|FIR, decimation|-> fs", "#eef7f1", GREEN)
wire([(770, 165), (806, 165)])
box(808, 140, 100, 50, "USB 2.0", "~4 MSPS steady")
wire([(908, 165), (928, 165)])
box(930, 125, 115, 80, "MATLAB", "comm.SDRRxPluto|x = rx()", "#fff", BLUE)
text(530, 30, "ADALM-Pluto (AD936x)", 15, NAVY, bold=True)
items.append(f"<rect x='70' y='40' width='718' height='285' rx='12' fill='none' stroke='{GREY}' stroke-dasharray='6 5'/>")
param(85, 128, "Gain")
param(214, 330-8, "CenterFrequency")
param(632, 108, "BasebandSampleRate")
param(932, 222, "SamplesPerFrame")
head = (f"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 {W} {H+12}' width='{W}' height='{H+12}'>"
        f"<defs><marker id='a' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto'>"
        f"<path d='M0,0 L10,5 L0,10 z' fill='{GREY}'/></marker></defs><rect width='100%' height='100%' fill='white'/>")
(OUT / "pluto_rx.svg").write_text(head + "".join(items) + "</svg>", encoding="utf-8")
print("saved pluto_rx.svg")

# ---------------- band map ----------------
bands = [  # name, f1, f2 [MHz], kind
    ("FM broadcast", 87.5, 108, "a"), ("Airband AM", 118, 137, "a"), ("ISM 433", 433.05, 434.79, "d"),
    ("PMR446", 446.0, 446.2, "a"), ("LTE 800 DL", 791, 821, "d"), ("LTE/5G 900 DL", 925, 960, "d"),
    ("ADS-B", 1089, 1091, "d"), ("GPS L1", 1574, 1576, "d"), ("LTE 1800 DL", 1805, 1880, "d"),
    ("3G/LTE 2100 DL", 2110, 2170, "d"), ("Wi-Fi 2.4", 2400, 2483.5, "d"), ("LTE 2600 DL", 2620, 2690, "d"),
    ("5G n78", 3400, 3800, "d"), ("Wi-Fi 5", 5150, 5850, "d")]
fig, ax = plt.subplots(figsize=(11, 3.6), dpi=130)
ax.set_xscale("log"); ax.set_xlim(60, 7000); ax.set_ylim(0, 4.2)
ax.axvspan(70, 6000, ymin=0.02, ymax=0.10, color="#d8e6f5"); ax.text(75, 0.22, "AD9364 mode: 70 MHz - 6 GHz", fontsize=9, color=NAVY)
ax.axvspan(325, 3800, ymin=0.12, ymax=0.20, color="#b9d1ec"); ax.text(340, 0.63, "AD9363 (stock): 325 MHz - 3.8 GHz", fontsize=9, color=NAVY)
for i, (n, f1, f2, k) in enumerate(bands):
    y = 1.15 + (i % 3)*0.95
    c = BLUE if k == "a" else ORANGE
    ax.add_patch(plt.Rectangle((f1, y), max(f2 - f1, f1*0.012), 0.42, color=c, alpha=0.85))
    ax.text(f1*1.0, y + 0.52, n, fontsize=8.5, color=c, fontweight="bold")
ax.set_yticks([]); ax.set_xlabel("Frequency [MHz] (log scale)")
ax.set_xticks([70, 100, 200, 300, 500, 1000, 2000, 3000, 6000]); ax.set_xticklabels(["70", "100", "200", "300", "500", "1000", "2000", "3000", "6000"])
for s in ("top", "right", "left"): ax.spines[s].set_visible(False)
ax.set_title("What you can find in the air with an ADALM-Pluto  (blue = analog, orange = digital)", fontsize=11, color=NAVY)
fig.tight_layout(); fig.savefig(OUT / "band_map.png"); print("saved band_map.png")
