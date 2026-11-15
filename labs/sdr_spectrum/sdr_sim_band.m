function [x, info] = sdr_sim_band(fc, fs, N, gainDb, t0)
%SDR_SIM_BAND  Simulated ADALM-Pluto receiver output (no hardware needed).
%   x = sdr_sim_band(fc, fs, N, gainDb, t0) returns N complex samples, as
%   the Pluto would deliver them (scaled to +-1 = ADC full scale), when it is
%   tuned to fc [Hz] with sample rate fs [Hz] and RX gain gainDb [dB].
%   t0 [s] is the capture start time, so bursty signals change over time.
%
%   The scene contains signals you can find in the lab: FM broadcast,
%   airband AM, PMR446 narrow FM, a 433.92 MHz remote (OOK), ADS-B pulses
%   at 1090 MHz, LTE (band 3 and 7), Wi-Fi 2.4 GHz and 5G NR at 3.5 GHz.
%   Power levels are typical, not measured at JCT.
%
%   The receiver model includes what you will meet on the real radio:
%   thermal noise, a 12-bit ADC (clipping and quantization), the DC/LO
%   spike at the center, an I/Q-imbalance image and the filter roll-off
%   near the band edges, with aliasing of signals just outside it.
%
%   Communication Lab - JCT

if nargin < 5, t0 = 0; end
N  = round(N);
t  = t0 + (0:N-1).'/fs;
fb = ((0:N-1).' - floor(N/2))*fs/N;          % baseband grid, fftshift order
x  = complex(zeros(N,1));

for e = scene()
    df = e.f - fc;                          % offset from the tuned frequency
    if abs(df) > 1.5*fs + e.bw, continue, end
    A  = 10^((e.p + gainDb + 10)/20);       % 0 dBFS = -10 dBm - gain
    switch e.type
        case 'ofdm'                         % flat-top digital signal, built in frequency
            s = ofdm(e, df, fs, N, fb, t, t0);
            x = x + A*s;
        otherwise                           % time-domain signal at offset df
            [s, on] = waveform(e, t, t0, fs);
            if ~on, continue, end
            [h, dfa] = response(df, fs);
            x = x + A*h*s.*exp(1j*2*pi*dfa*t);
    end
end

% receiver noise: thermal (noise figure grows at low gain) + ADC noise
nf   = 4 + max(0, 40 - gainDb)*0.6;                     % dB
nTh  = 10^((-174 + nf + gainDb + 10)/10)*fs;            % total power, FS^2
nAdc = 10^(-66/10);                                     % ~11 effective bits
x = x + sqrt((nTh + nAdc)/2)*complex(randn(N,1), randn(N,1));

x = x + 10^(-50/20)*(0.8 + 0.6j);                       % DC offset / LO leakage
x = x + 10^(-42/20)*conj(x);                            % I/Q imbalance -> image

% 12-bit ADC: clip I and Q at full scale, then quantize
info.peakDbfs = 20*log10(max(abs([real(x); imag(x)])) + eps);
xi = min(max(real(x), -1), 1 - 2^-11);
xq = min(max(imag(x), -1), 1 - 2^-11);
info.clipFraction = mean(abs(real(x)) > 1 | abs(imag(x)) > 1);
x = single(complex(round(xi*2^11), round(xq*2^11))/2^11);
end

% ------------------------------------------------------------------------
function [h, dfa] = response(df, fs)
% gain of the RX filter chain at offset df, and the frequency at which the
% signal appears (aliased if it is outside +-fs/2)
dfa = mod(df + fs/2, fs) - fs/2;
a = abs(df)/fs;
if a <= 0.40
    g = 0;
elseif a <= 0.50
    g = -12*(a - 0.40)/0.10;                 % roll-off near the edge
else
    g = -50;                                 % outside: strongly attenuated alias
end
h = 10^(g/20);
end

function s = ofdm(e, df, fs, N, fb, t, t0)
% flat spectrum of width e.bw around df, random QPSK on every bin
s = complex(zeros(N,1));
rng(mod(e.seed*7919 + floor(t0*1e3), 2^31));
fk = df + fb;                                % true offset of each grid bin
k  = find(abs(fk - df) <= e.bw/2 & abs(fk) < 1.5*fs);
if isempty(k), return, end
k(abs(fk(k) - df) < fs/N) = [];              % LTE/NR keep the DC subcarrier empty
G = complex(zeros(N,1));
% place each bin (with aliasing) on the received grid
fa  = mod(fk(k) + fs/2, fs) - fs/2;
idx = mod(round(fa/(fs/N)) + floor(N/2), N) + 1;
g   = arrayfun(@(f) response(f, fs), fk(k));
G(idx) = G(idx) + g.*exp(1j*pi/2*randi(4, numel(k), 1) + 1j*pi/4);
s = ifft(ifftshift(G))*N/sqrt(numel(k));     % total power 1 (before gating)
if e.burst > 0                               % Wi-Fi: packets switch on and off
    gate = zeros(N,1); tt = t - t0; T = N/fs; p = -rand*(1 + e.burst)*1e-3;
    while p < T
        len = (0.2 + 1.3*rand)*1e-3; gap = (0.1 + e.burst*rand)*1e-3;
        gate(tt >= p & tt < p + len) = 1; p = p + len + gap;
    end
    s = s.*gate;
end
end

function [s, on] = waveform(e, t, t0, fs)
% complex baseband of one emitter, at 0 Hz, power 1 when on
on = true;
switch e.type
    case 'fm'                                % stereo FM broadcast, 75 kHz deviation
        mono  = music(t, e.seed);
        diffs = music(t + 0.37, e.seed + 11);
        mpx = 0.60*mono + 0.09*cos(2*pi*19e3*t) + 0.30*diffs.*cos(2*pi*38e3*t) ...
            + 0.03*rdsBits(t).*cos(2*pi*57e3*t);
        s = exp(1j*(2*pi*75e3*cumsum(mpx)/fs + e.seed));
    case 'nfm'                               % narrow FM (PMR446), 2.5 kHz deviation
        on = burstOn(e, t0, 0.6);
        s = exp(1j*2*pi*2.5e3*cumsum(voice(t, e.seed))/fs);
    case 'am'                                % airband AM voice
        on = burstOn(e, t0, 0.65);
        s = (1 + 0.7*voice(t, e.seed))/sqrt(1.25);
    case 'ook'                               % 433.92 MHz remote control
        on = burstOn(e, t0, 0.4);
        bits = mod(floor((t - t0)*2e3) * 2654435761 + e.seed, 7) > 2;
        s = complex(double(bits));
    case 'adsb'                              % 1090 MHz: 0.5 us pulses, 1 Mbit/s PPM
        s = complex(zeros(size(t))); T = t(end) - t0;
        rng(mod(e.seed + floor(t0*1e4), 2^31));
        nMsg = poissrnd_(T/1e-3);            % a message every ~1 ms (busy sky)
        for m = 1:nMsg
            st = rand*T; tt = t - t0 - st;
            pre = (tt>=0 & tt<0.5e-6) | (tt>=1e-6 & tt<1.5e-6) | (tt>=3.5e-6 & tt<4e-6) | (tt>=4.5e-6 & tt<5e-6);
            b = rand(112,1) > 0.5; k = floor((tt - 8e-6)/1e-6) + 1; ok = k >= 1 & k <= 112;
            half = mod(tt - 8e-6, 1e-6) < 0.5e-6;
            dat = false(size(tt)); dat(ok) = b(k(ok)) == half(ok);
            s = s + (pre | dat);
        end
        s = s*sqrt(2);
    otherwise
        s = complex(zeros(size(t)));
end
end

function m = melody(t, seed)
% a simple tune (different for every seed): notes of 0.25 s with decay
notes = 220*2.^([0 2 4 5 7 9 11 12 14 16]/12);
k  = floor(t/0.25);
ix = mod(k*7 + seed*3 + floor(k/4)*5, numel(notes)) + 1;
f  = notes(ix).';
env = exp(-mod(t, 0.25)*3);
ph = 2*pi*f.*mod(t, 0.25);
m  = env.*(0.75*sin(ph) + 0.25*sin(2*ph));
end

function m = music(t, seed)
% broadcast audio: the tune plus a band of 'instruments' up to 15 kHz,
% compressed so the level stays high (as radio stations do)
k  = (1:24).';
fk = 80*(15e3/80).^((k - 1 + 0.5*sin(seed*k))/23);
ph = mod(seed*k*2.399, 2*pi);
b  = zeros(size(t));
for i = 1:numel(k), b = b + sin(2*pi*fk(i)*t + ph(i))/sqrt(k(i)); end
b  = b/2.2;
m  = 0.6*melody(t, seed) + 0.4*b;
m  = tanh(3*m)/tanh(3);
end

function m = voice(t, seed)
% speech-like audio for two-way radio: 300-3000 Hz, compressed
k  = (1:16).';
fk = 300*(3000/300).^((k - 1 + 0.5*sin(seed*k))/15);
ph = mod(seed*k*1.618, 2*pi);
b  = zeros(size(t));
for i = 1:numel(k), b = b + sin(2*pi*fk(i)*t + ph(i))/sqrt(k(i)); end
syl = 0.5 + 0.5*sin(2*pi*4*t + seed);          % ~4 syllables per second
m  = tanh(2.5*(0.5*melody(t, seed) + 0.5*b/2).*syl)/tanh(2.5);
end

function r = rdsBits(t)
k = floor(t*1187.5);
r = 2*double(mod(k*2654435761, 5) > 1) - 1;
end

function on = burstOn(e, t0, duty)
slot = floor(t0/0.8);
on = mod(slot*2654435761 + e.seed*97, 1000)/1000 < duty;
end

function n = poissrnd_(lambda)
% Poisson random number without the Statistics Toolbox
L = exp(-lambda); n = 0; p = rand;
while p > L, n = n + 1; p = p*rand; end
end

function E = scene()
persistent S
if ~isempty(S), E = S; return, end
add = @(type, f, p, bw, seed, burst) struct('type', type, 'f', f, 'p', p, 'bw', bw, 'seed', seed, 'burst', burst);
S = add('fm', 88.2e6, -62, 200e3, 1, 0);
fmF = [89.6 90.8 91.8 93.3 94.6 96.0 97.2 99.0 100.3 101.5 102.5 104.0 105.5 106.4 107.5];
fmP = [-74 -66 -58 -70 -61 -77 -64 -57 -68 -60 -72 -63 -75 -67 -59];
for i = 1:numel(fmF), S(end+1) = add('fm', fmF(i)*1e6, fmP(i), 200e3, i + 1, 0); end %#ok<AGROW>
air = [118.7 -82; 120.5 -78; 125.35 -86; 128.1 -80; 132.1 -84];
for i = 1:size(air,1), S(end+1) = add('am', air(i,1)*1e6, air(i,2), 8e3, 40 + i, 0); end %#ok<AGROW>
S(end+1) = add('nfm', 446.05625e6, -72, 11e3, 60, 0);
S(end+1) = add('nfm', 446.08125e6, -80, 11e3, 61, 0);
S(end+1) = add('ook', 433.92e6, -58, 20e3, 70, 0);
S(end+1) = add('adsb', 1090e6, -64, 2e6, 80, 0);
lte = [1815 18e6 -78; 1845 9e6 -80; 1870 13.5e6 -83; 2640 18e6 -84; 2665 9e6 -86];
for i = 1:size(lte,1), S(end+1) = add('ofdm', lte(i,1)*1e6, lte(i,3), lte(i,2), 90 + i, 0); end %#ok<AGROW>
wifi = [2412 -58 3; 2437 -70 8; 2462 -64 5];
for i = 1:size(wifi,1), S(end+1) = add('ofdm', wifi(i,1)*1e6, wifi(i,2), 16.6e6, 100 + i, wifi(i,3)); end %#ok<AGROW>
S(end+1) = add('ofdm', 3550e6, -84, 98e6, 110, 0);
E = S;
end
