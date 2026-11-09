"""Block and wiring diagrams for the Lab 3 guide (SVG). Run: python make_diagrams.py"""
import pathlib

OUT = pathlib.Path(__file__).parent
NAVY, BLUE, ORANGE, GREEN, GREY = "#15315a", "#1f5fa8", "#e8892b", "#2e9e5b", "#5b6676"
FONT = "font-family='Helvetica, Arial, sans-serif'"


class SVG:
    def __init__(self, w, h):
        self.w, self.h, self.items = w, h, []

    def box(self, x, y, w, h, label, sub="", fill="#eef3fa", stroke=NAVY, top=False):
        self.items.append(f"<rect x='{x}' y='{y}' width='{w}' height='{h}' rx='8' fill='{fill}' stroke='{stroke}' stroke-width='1.6'/>")
        cy = y + 28 if top else y + h / 2 + (-6 if sub else 5)
        self.items.append(f"<text x='{x+w/2}' y='{cy}' text-anchor='middle' font-size='15' font-weight='bold' fill='{NAVY}' {FONT}>{label}</text>")
        if sub:
            for i, line in enumerate(sub.split("|")):
                self.items.append(f"<text x='{x+w/2}' y='{cy+18+i*15}' text-anchor='middle' font-size='12' fill='{GREY}' {FONT}>{line}</text>")

    def mixer(self, cx, cy, r=22):
        self.items.append(f"<circle cx='{cx}' cy='{cy}' r='{r}' fill='white' stroke='{NAVY}' stroke-width='1.8'/>")
        d = r * 0.6
        self.items.append(f"<path d='M{cx-d},{cy-d} L{cx+d},{cy+d} M{cx-d},{cy+d} L{cx+d},{cy-d}' stroke='{NAVY}' stroke-width='1.8'/>")

    def adder(self, cx, cy, r=20):
        self.items.append(f"<circle cx='{cx}' cy='{cy}' r='{r}' fill='white' stroke='{NAVY}' stroke-width='1.8'/>")
        self.items.append(f"<text x='{cx}' y='{cy+7}' text-anchor='middle' font-size='22' fill='{NAVY}' {FONT}>Σ</text>")

    def wire(self, pts, color=GREY, arrow=True, dash=False):
        d = " ".join(f"{'M' if i == 0 else 'L'}{x},{y}" for i, (x, y) in enumerate(pts))
        self.items.append(f"<path d='{d}' fill='none' stroke='{color}' stroke-width='2' {'stroke-dasharray=\"6 4\"' if dash else ''} {'marker-end=\"url(#a)\"' if arrow else ''}/>")

    def text(self, x, y, s, size=13, color=NAVY, anchor="middle", bold=False):
        self.items.append(f"<text x='{x}' y='{y}' text-anchor='{anchor}' font-size='{size}' fill='{color}' {'font-weight=\"bold\"' if bold else ''} {FONT}>{s}</text>")

    def point(self, x, y, n):
        self.items.append(f"<circle cx='{x}' cy='{y}' r='11' fill='{ORANGE}'/>")
        self.text(x, y + 5, n, 13, "white", bold=True)

    def save(self, name):
        head = (f"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 {self.w} {self.h}' width='{self.w}' height='{self.h}'>"
                f"<defs><marker id='a' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto'>"
                f"<path d='M0,0 L10,5 L0,10 z' fill='{GREY}'/></marker></defs>"
                f"<rect width='100%' height='100%' fill='white'/>")
        (OUT / name).write_text(head + "".join(self.items) + "</svg>", encoding="utf-8")
        print("saved", name)


# transmitter: DSB-SC and AM
s = SVG(760, 230)
s.text(30, 92, "m(t)", 16, anchor="start", bold=True)
s.wire([(75, 87), (208, 87)])
s.mixer(230, 87)
s.box(170, 160, 120, 50, "LO", "Ac·cos(2π fc t)")
s.wire([(230, 160), (230, 111)])
s.wire([(252, 87), (448, 87)])
s.text(350, 77, "DSB-SC", 14, BLUE, bold=True)
s.adder(470, 87)
s.wire([(290, 185), (470, 185), (470, 109)], dash=True)
s.text(380, 202, "carrier (only for AM)", 12, GREY)
s.wire([(490, 87), (640, 87)])
s.text(690, 92, "AM", 16, ORANGE, bold=True)
s.save("tx.svg")

# coherent receiver
s = SVG(760, 230)
s.text(30, 92, "s(t)", 16, anchor="start", bold=True)
s.wire([(70, 87), (218, 87)])
s.mixer(240, 87)
s.box(170, 160, 140, 50, "LO", "cos(2π fc t + φ)")
s.wire([(240, 160), (240, 111)])
s.wire([(262, 87), (390, 87)])
s.box(392, 57, 120, 60, "LPF", "removes 2fc")
s.wire([(512, 87), (640, 87)])
s.text(690, 92, "m̂(t)", 16, ORANGE, bold=True)
s.save("rx.svg")

# setup 1: DSB-SC with a mixer
s = SVG(820, 270)
s.box(30, 40, 230, 190, "Generator 33500", "", top=True)
s.box(50, 95, 190, 52, "Output 1", "100 kHz · 200 mVpp (message)", "white")
s.box(50, 160, 190, 52, "Output 2", "10 MHz · 350 mVpp (carrier)", "white")
s.mixer(420, 121, 28)
s.text(375, 112, "R", 14, bold=True)
s.text(404, 162, "L", 14, bold=True)
s.text(470, 112, "I", 14, bold=True)
s.text(420, 78, "Mixer", 14, GREY)
s.wire([(240, 121), (390, 121)])
s.wire([(240, 186), (420, 186), (420, 151)])
s.wire([(450, 121), (590, 121)])
s.box(592, 66, 200, 110, "Spectrum analyzer", "or oscilloscope|(steps 3–5)")
s.save("setup1.svg")

# setup 2: AM = DSB-SC + carrier through two splitters
s = SVG(900, 330)
s.box(30, 40, 230, 250, "Generator 33500", "", top=True)
s.box(50, 95, 190, 52, "Output 1", "100 kHz · 200 mVpp", "white")
s.box(50, 205, 190, 52, "Output 2", "10 MHz · 700 mVpp", "white")
s.mixer(440, 121, 28)
s.text(395, 112, "R", 14, bold=True)
s.text(424, 162, "L", 14, bold=True)
s.text(490, 112, "I", 14, bold=True)
s.wire([(240, 121), (410, 121)])
s.box(320, 205, 90, 52, "Splitter 1", "S → 1, 2", "#fff6ea", ORANGE)
s.wire([(240, 231), (318, 231)])
s.wire([(365, 205), (365, 186), (440, 186), (440, 151)])
s.text(388, 182, "1", 12, GREY)
s.box(560, 150, 90, 52, "Splitter 2", "1, 2 → S", "#fff6ea", ORANGE)
s.wire([(470, 121), (605, 121), (605, 148)])
s.text(615, 140, "1", 12, GREY, anchor="start")
s.wire([(410, 245), (605, 245), (605, 204)])
s.text(470, 262, "2  (carrier)", 12, GREY)
s.wire([(650, 176), (700, 176)])
s.box(702, 120, 180, 112, "Scope / Spectrum", "AM signal|(steps 6–7)")
s.save("setup2.svg")

# setup 4: synchronous receiver with measurement points
s = SVG(900, 300)
s.box(20, 30, 250, 240, "Generator 33500", "", top=True)
s.box(40, 80, 210, 62, "Output 1  (TX)", "AM · 10 MHz · 200 mVpp|depth 50% · AM freq 1 kHz", "white")
s.box(40, 180, 210, 62, "Output 2  (LO)", "10 MHz · 350 mVpp|phase adjustable", "white")
s.wire([(250, 111), (430, 111)])
s.point(320, 111, "1")
s.mixer(460, 111, 28)
s.text(415, 102, "R", 14, bold=True)
s.text(444, 152, "L", 14, bold=True)
s.text(510, 102, "I", 14, bold=True)
s.wire([(250, 211), (460, 211), (460, 141)])
s.point(360, 211, "2")
s.wire([(490, 111), (578, 111)])
s.point(540, 111, "3")
s.box(580, 81, 110, 60, "LPF", "1.9 MHz")
s.wire([(690, 111), (760, 111)])
s.point(725, 111, "4")
s.box(762, 76, 120, 70, "Scope", "message out")
s.save("setup4.svg")

# component symbols for the "components" section (same style as the diagrams)
s = SVG(300, 170)
s.box(40, 25, 220, 120, "Generator 33500", "", top=True)
s.box(60, 70, 85, 50, "Out 1", "", "white"); s.box(155, 70, 85, 50, "Out 2", "", "white")
s.save("comp_gen.svg")

s = SVG(300, 170)
s.box(30, 20, 240, 130, "", "", "#f4f7fb")
s.items.append(f"<rect x='45' y='35' width='150' height='100' fill='white' stroke='{GREY}'/>")
s.items.append(f"<path d='M45,85 " + " ".join(f"L{45+i*1.5:.1f},{85-30*__import__('math').sin(i*0.42)*(0.6+0.4*__import__('math').cos(i*0.042)):.1f}" for i in range(101)) + f"' fill='none' stroke='{BLUE}' stroke-width='1.6'/>")
s.text(232, 70, "CH1", 12, GREY); s.text(232, 100, "CH2", 12, GREY)
s.save("comp_scope.svg")

s = SVG(300, 170)
s.box(30, 20, 240, 130, "", "", "#f4f7fb")
s.items.append(f"<rect x='45' y='35' width='150' height='100' fill='white' stroke='{GREY}'/>")
s.items.append(f"<path d='M50,128 L95,128 L98,95 L101,128 L117,128 L120,50 L123,128 L139,128 L142,95 L145,128 L190,128' fill='none' stroke='{ORANGE}' stroke-width='1.8'/>")
s.text(232, 85, "RF in", 12, GREY)
s.save("comp_sa.svg")

s = SVG(300, 170)
s.box(105, 45, 90, 80, "Splitter", "S ↔ 1, 2", "#fff6ea", ORANGE)
s.wire([(30, 85), (103, 85)], arrow=False); s.text(30, 75, "S", 14, anchor="start", bold=True)
s.wire([(197, 65), (270, 65)], arrow=False); s.text(270, 57, "1", 14, anchor="end", bold=True)
s.wire([(197, 105), (270, 105)], arrow=False); s.text(270, 125, "2", 14, anchor="end", bold=True)
s.save("comp_splitter.svg")

s = SVG(300, 170)
s.box(95, 50, 110, 70, "LPF", "1.9 MHz")
s.wire([(30, 85), (93, 85)], arrow=False); s.wire([(207, 85), (270, 85)], arrow=False)
s.items.append(f"<path d='M110,140 L160,140 Q172,140 180,158' fill='none' stroke='{BLUE}' stroke-width='2'/>")
s.save("comp_lpf.svg")
