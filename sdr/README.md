# ADALM-Pluto SDR lab – Dr. Eyal Magory, JCT – Lev Academic Center

Seven experiments that build a full radio, from a single tone to OFDM and radar.
Each script runs **in simulation by default**, and on a real ADALM-Pluto with `--pluto`.

| # | Script | Topic |
|---|---|---|
| 1 | `lab01_tone_spectrum.py` | Complex tone, spectrum, DC offset, I/Q imbalance |
| 2 | `lab02_am_fm.py` | AM and FM modulation and demodulation, FM broadcast receiver |
| 3 | `lab03_digital_mod.py` | BPSK/QPSK/16-QAM, RRC pulses, matched filter, eye, BER |
| 4 | `lab04_carrier_sync.py` | Carrier frequency offset, Costas loop / digital PLL |
| 5 | `lab05_text_link_coding.py` | Sending text, Hamming(7,4) channel coding |
| 6 | `lab06_ofdm.py` | OFDM, cyclic prefix, multipath, 1-tap equalizer |
| 7 | `lab07_radar_chirp.py` | Chirp radar, pulse compression, range resolution |

`pluto_common.py` holds the shared code: Pluto wrapper, simulated loopback channel,
frame synchronization (`Framer`), RRC filter, constellations and the PLL.

## Install

```bash
pip install numpy scipy matplotlib
pip install pyadi-iio          # hardware only, plus libiio from Analog Devices
```

## Run

```bash
python lab03_digital_mod.py --mod 16qam --snr 22     # simulation
python lab03_digital_mod.py --pluto                  # hardware (default ip:192.168.2.1)
python lab03_digital_mod.py --help                   # all options
```

`--save` writes the figure to `figures/`.

## Hardware setup

Connect TX to RX with an SMA cable **through a 30 dB attenuator**. Start with
`--tx-gain -30 --rx-gain 30` and adjust so the received signal is not clipped.

Transmit over the air only at very low power, inside a band your local regulator
allows. Receiving (for example FM broadcast in Lab 2) is always fine.
