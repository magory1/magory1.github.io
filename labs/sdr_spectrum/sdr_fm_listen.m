function out = sdr_fm_listen(fStation, varargin)
%SDR_FM_LISTEN  Receive an FM broadcast station, show its parts and play it.
%   sdr_fm_listen(99.0e6)                         % simulator
%   sdr_fm_listen(99.0e6, 'Source', 'pluto')      % real ADALM-Pluto
%   out = sdr_fm_listen(f, 'Seconds', 4, 'Gain', 30, 'Play', false)
%
%   Options: 'Source' ('sim' | 'pluto' | a struct from sdr_source),
%            'Seconds' (3), 'GainMode' ('AGC Slow Attack'), 'Gain' (30),
%            'Play' (true), 'Plot' (true)
%
%   What happens, step by step:
%   1. Offset tuning: the radio is tuned 200 kHz below the station, so the
%      DC/LO spike of the radio is not on top of the signal.
%   2. Capture at 960 kSPS - enough for the 200 kHz wide channel.
%   3. Shift the station to 0 Hz and keep only +-120 kHz (channel filter).
%   4. FM discriminator: the phase change between samples is the
%      instantaneous frequency = the multiplex (MPX) signal.
%   5. MPX spectrum: mono L+R (0-15 kHz), pilot (19 kHz), stereo L-R
%      (23-53 kHz) and RDS data (57 kHz).
%   6. Mono audio: low-pass 15 kHz, decimate to 48 kHz, de-emphasis 50 us.
%
%   Communication Lab - JCT

p = inputParser;
p.addParameter('Source', 'sim');
p.addParameter('Seconds', 3);
p.addParameter('GainMode', 'AGC Slow Attack');
p.addParameter('Gain', 30);
p.addParameter('Play', true);
p.addParameter('Plot', true);
p.parse(varargin{:}); o = p.Results;
src = o.Source; if ischar(src) || isstring(src), src = sdr_source(char(src)); end

fs   = 960e3;                 % sample rate [Hz]
off  = 200e3;                 % offset tuning [Hz]
fsA  = 48e3;                  % audio rate [Hz]
fdev = 75e3;                  % FM broadcast peak deviation [Hz]
N    = round(o.Seconds*fs);

% 1-2. capture (contiguous, no gaps)
[x, info] = src.get(fStation - off, fs, N, o.GainMode, o.Gain, true);
x = double(x);
if info.overflow > 0
    warning('sdr:overflow', '%d overflow(s): samples were lost - audio may click.', info.overflow);
end

% 3. shift the station to 0 Hz and filter the channel
n = (0:N-1).';
y = x.*exp(-1j*2*pi*off/fs*n);
y = filter(lpfir(127, 120e3, fs), 1, y);

% 4. FM discriminator: angle of y(n)*conj(y(n-1)) = 2*pi*f_inst/fs
mpx = angle(y(2:end).*conj(y(1:end-1)))*fs/(2*pi*fdev);   % 1 = 75 kHz

% 6. mono audio, in two stages: 960 -> 192 kHz, then 192 -> 48 kHz
a = filter(lpfir(127, 40e3, fs), 1, mpx);
a = a(1:5:end);
a = filter(lpfir(255, 15e3, fs/5), 1, a);
a = a(1:4:end);
alpha = exp(-1/(fsA*50e-6));                                % de-emphasis, 50 us
a = filter(1 - alpha, [1 -alpha], a);
a = a - mean(a); a = 0.9*a/max(abs(a) + eps);

out = struct('fStation', fStation, 'fs', fs, 'iq', x, 'mpx', mpx, ...
             'audio', a, 'fsAudio', fsA, 'gain', info.gain, 'peakDbfs', info.peakDbfs);

if o.Plot
    fig = figure('Name', sprintf('FM %.1f MHz', fStation/1e6), 'Color', 'w', 'Position', [80 80 1100 720]);
    t = tiledlayout(fig, 2, 2, 'TileSpacing', 'compact', 'Padding', 'compact');
    title(t, sprintf('FM broadcast at %.2f MHz  (offset tuning %.0f kHz, fs = %.0f kSPS)', fStation/1e6, off/1e3, fs/1e3));

    nexttile; [f, P] = sdr_psd(x, fs, 4096, fStation - off);
    plot((f - fStation)/1e3, P, 'LineWidth', 1); grid on; hold on
    xline(0, '--', 'station'); xline(-off/1e3, ':', 'DC (tuned here)');
    r = sdr_measure_bw(f, P, fStation, 50e3);
    xline((r.obwEdges - fStation)/1e3, 'r-', {'99%', '99%'});
    xlabel('Offset from station [kHz]'); ylabel('dBFS / bin');
    title(sprintf('RF spectrum: 99%% bandwidth = %.0f kHz', r.obw/1e3));

    nexttile; [fm, Pm] = sdr_psd(complex(mpx - mean(mpx)), fs, 8192, 0);
    k = fm >= 0 & fm <= 80e3;
    plot(fm(k)/1e3, Pm(k), 'LineWidth', 1); grid on; hold on
    yl = ylim;
    patch([0 15 15 0], yl([1 1 2 2]), [0.2 0.5 0.9], 'FaceAlpha', 0.08, 'EdgeColor', 'none');
    patch([23 53 53 23], yl([1 1 2 2]), [0.9 0.5 0.2], 'FaceAlpha', 0.08, 'EdgeColor', 'none');
    xline(19, 'k--', 'pilot 19 kHz'); xline(57, 'k--', 'RDS 57 kHz');
    text(7.5, yl(2) - 5, 'L+R', 'HorizontalAlignment', 'center');
    text(38, yl(2) - 5, 'L-R (stereo)', 'HorizontalAlignment', 'center');
    xlabel('Frequency [kHz]'); ylabel('dB'); title('After the FM discriminator: the MPX signal');

    nexttile; ta = (0:numel(a)-1)/fsA;
    plot(ta, a); grid on; xlabel('Time [s]'); ylabel('Audio'); title('Mono audio (48 kHz, de-emphasis 50 \mus)');

    nexttile; [fa, Pa] = sdr_psd(complex(a), fsA, 2048, 0);
    k = fa >= 0; plot(fa(k)/1e3, Pa(k)); grid on
    xlabel('Frequency [kHz]'); ylabel('dB'); title('Audio spectrum'); xlim([0 20]);
end

if o.Play
    sound(a, fsA);
end
end

function h = lpfir(n, fc, fs)
% windowed-sinc low-pass FIR (Hamming), n taps, cutoff fc [Hz]
m = (0:n-1) - (n-1)/2;
h = 2*fc/fs*sinc_(2*fc/fs*m).*(0.54 - 0.46*cos(2*pi*(0:n-1)/(n-1)));
h = h/sum(h);
end

function y = sinc_(x)
y = ones(size(x)); k = x ~= 0; y(k) = sin(pi*x(k))./(pi*x(k));
end
