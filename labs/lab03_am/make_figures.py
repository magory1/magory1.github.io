"""Figures for the online Lab 3 guide (AM / DSB-SC). Run: python make_figures.py"""
import pathlib

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

OUT = pathlib.Path(__file__).parent
plt.rcParams.update({"font.size": 11, "axes.grid": True, "grid.alpha": 0.3, "figure.dpi": 130,
                     "axes.spines.top": False, "axes.spines.right": False})
BLUE, ORANGE, GREEN, RED, GREY = "#1f5fa8", "#e8892b", "#2e9e5b", "#c0392b", "#888888"


def save(fig, name):
    fig.tight_layout()
    fig.savefig(OUT / name, bbox_inches="tight")
    plt.close(fig)
    print("saved", name)


# 1. AM in time: carrier, envelope and the quantities Vmax, Vmin, Ac, Am
fc, fm, Ac, Am = 20e3, 1e3, 1.0, 0.6
t = np.linspace(0, 2.2e-3, 6000)
env = Ac + Am * np.cos(2 * np.pi * fm * t)
x = env * np.cos(2 * np.pi * fc * t)
fig, ax = plt.subplots(figsize=(9, 3.6))
ax.plot(t * 1e3, x, color=BLUE, lw=0.9, label="AM signal  $x_{AM}(t)$")
ax.plot(t * 1e3, env, color=ORANGE, lw=2, label="envelope  $A_c+A_m\\cos(2\\pi f_m t)$")
ax.plot(t * 1e3, -env, color=ORANGE, lw=2)
ax.axhline(Ac, color=GREY, ls="--", lw=1)
ax.annotate("", xy=(0.05, Ac + Am), xytext=(0.05, 0), arrowprops=dict(arrowstyle="<->", color=GREEN))
box = dict(boxstyle="round,pad=0.25", fc="white", ec="none", alpha=0.95)
ax.text(0.1, 1.72, "$V_{max}=A_c+A_m$", color=GREEN, bbox=box)
ax.annotate("", xy=(0.55, Ac - Am), xytext=(0.55, 0), arrowprops=dict(arrowstyle="<->", color=RED))
ax.text(0.62, -0.05, "$V_{min}=A_c-A_m$", color=RED, bbox=box)
ax.annotate("", xy=(1.0, 0), xytext=(2.0, 0), arrowprops=dict(arrowstyle="<->", color="k"))
ax.text(1.35, 0.06, "$T_m = 1/f_m$", bbox=box)
ax.set(xlabel="time [ms]", ylabel="voltage [V]", ylim=(-1.9, 2.1))
ax.legend(loc="lower right", fontsize=9, framealpha=0.95)
save(fig, "am_time.png")

# 2. Prep question 1: read values off the scope-like plot (answers not printed)
fc, fm, Ac, Am = 50e3, 2.5e3, 1.5, 0.9
t = np.linspace(0, 1.2e-3, 8000)
x = (Ac + Am * np.cos(2 * np.pi * fm * t)) * np.cos(2 * np.pi * fc * t)
fig, ax = plt.subplots(figsize=(9, 3.6))
ax.plot(t * 1e3, x, color=BLUE, lw=0.9)
ax.set(xlabel="time [ms]", ylabel="voltage [V]", ylim=(-2.75, 2.75), yticks=np.arange(-2.5, 2.6, 0.5),
       xticks=np.arange(0, 1.21, 0.1))
ax.grid(True, alpha=0.6)
save(fig, "prep1_scope.png")

# 3. AM spectrum (one-sided, as on a spectrum analyzer)
fig, ax = plt.subplots(figsize=(8, 3.2))
fcs, fms = 10.0, 1.0
for f, a, c, lab in [(fcs, 1.0, BLUE, "$A_c$\ncarrier"), (fcs - fms, 0.3, GREEN, "$A_m/2$\nLSB"), (fcs + fms, 0.3, GREEN, "$A_m/2$\nUSB")]:
    ax.vlines(f, 0, a, color=c, lw=3)
    ax.plot(f, a, "o", color=c)
    ax.text(f, a + 0.06, lab, ha="center", va="bottom", fontsize=10)
ax.set(xlim=(7.5, 12.5), ylim=(0, 1.45), ylabel="amplitude", yticks=[],
       xticks=[fcs - fms, fcs, fcs + fms], xticklabels=["$f_c-f_m$", "$f_c$", "$f_c+f_m$"])
ax.annotate("", xy=(fcs - fms, 0.7), xytext=(fcs + fms, 0.7), arrowprops=dict(arrowstyle="<->"))
ax.text(fcs + 0.08, 0.73, "bandwidth $2f_m$", fontsize=10)
ax.grid(False)
save(fig, "am_spectrum.png")

# 4. AM vs DSB-SC: time and frequency
fc, fm = 20e3, 1e3
t = np.linspace(0, 2e-3, 6000)
m = 0.8 * np.cos(2 * np.pi * fm * t)
c = np.cos(2 * np.pi * fc * t)
fig, ax = plt.subplots(2, 2, figsize=(11, 5.4), gridspec_kw={"width_ratios": [2, 1]})
for row, (sig, name) in enumerate([((1 + m) * c, "AM"), (m * c, "DSB-SC")]):
    ax[row, 0].plot(t * 1e3, sig, color=BLUE, lw=0.8)
    e = (1 + m) if name == "AM" else m
    ax[row, 0].plot(t * 1e3, e, color=ORANGE, lw=1.6)
    ax[row, 0].plot(t * 1e3, -e, color=ORANGE, lw=1.6)
    ax[row, 0].set(title=f"{name} – time", xlabel="time [ms]" if row else "", ylim=(-2, 2))
    lines = [(-1, 0.4), (1, 0.4)] + ([(0, 1.0)] if name == "AM" else [])
    for f, a in lines:
        ax[row, 1].vlines(f, 0, a, color=BLUE if f == 0 else GREEN, lw=3)
    ax[row, 1].set(title=f"{name} – spectrum", xlim=(-2.2, 2.2), ylim=(0, 1.2), yticks=[],
                   xticks=[-1, 0, 1], xticklabels=["$f_c-f_m$", "$f_c$", "$f_c+f_m$"])
ax[1, 0].annotate("phase reversal\nat zero crossings", xy=(0.25, 0), xytext=(0.5, 1.4), fontsize=9,
                  arrowprops=dict(arrowstyle="->", color=RED), color=RED)
save(fig, "am_vs_dsbsc.png")

# 5. Modulation depth
fig, axs = plt.subplots(1, 5, figsize=(14, 2.8), sharey=True)
t = np.linspace(0, 2e-3, 5000)
for ax, k in zip(axs, [0.3, 0.5, 0.7, 1.0, 1.3]):
    e = 1 + k * np.cos(2 * np.pi * 1e3 * t)
    ax.plot(t * 1e3, e * np.cos(2 * np.pi * 15e3 * t), color=RED if k > 1 else BLUE, lw=0.7)
    ax.plot(t * 1e3, np.abs(e), color=ORANGE, lw=1.4)
    ax.set(title=f"$k_a$ = {int(k*100)}%" + ("  (over-mod.)" if k > 1 else ""), xticks=[], ylim=(-2.5, 2.5))
save(fig, "depth.png")

# 6. Coherent receiver: effect of LO phase and of LO frequency offset
fs = 200e3
t = np.arange(0, 0.02, 1 / fs)
fig, ax = plt.subplots(1, 2, figsize=(12, 3.6))
for ph, col in zip([0, 30, 60, 90], [BLUE, GREEN, ORANGE, RED]):
    ax[0].plot(t * 1e3, np.cos(np.deg2rad(ph)) * np.cos(2 * np.pi * 200 * t), color=col, label=f"$\\phi$ = {ph}°")
ax[0].set(title="Output vs LO phase:  $\\frac{1}{2}m(t)\\cos\\phi$", xlabel="time [ms]", ylim=(-1.2, 1.2))
ax[0].legend(fontsize=9, ncol=4, loc="upper center", bbox_to_anchor=(0.5, -0.2))
t2 = np.linspace(0, 1.0, 20000)
out = np.cos(2 * np.pi * 2 * t2) * np.cos(2 * np.pi * 40 * t2)
ax[1].plot(t2, out, color=BLUE, lw=0.6)
ax[1].plot(t2, np.cos(2 * np.pi * 2 * t2), color=ORANGE, lw=1.6, label="$\\cos(2\\pi\\,\\Delta f\\, t)$")
ax[1].plot(t2, -np.cos(2 * np.pi * 2 * t2), color=ORANGE, lw=1.6)
ax[1].set(title="Output with LO offset $\\Delta f$ = 2 Hz: the message 'breathes'", xlabel="time [s]", ylim=(-1.3, 1.3))
ax[1].legend(fontsize=9, loc="lower right")
save(fig, "coherent.png")
