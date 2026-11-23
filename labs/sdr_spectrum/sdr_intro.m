%% SDR intro - first contact with the ADALM-Pluto
% Communication Lab - JCT
% The simplest possible start: you set only TWO numbers -
%   fc = where you look (center frequency)
%   fs = how wide you look (sample rate)
% Run one section at a time: put the cursor in it and press Ctrl+Enter
% (Mac: Cmd+Enter). The figures are saved as PNG for the report.

%% 1. Settings - the only two numbers you change
USE_PLUTO = true;      % false = simulator (at home, without a radio)
fc = 433.5e6;          % center frequency [Hz]  - remotes are at 433.92 MHz; we tune
                       %   a little below, so the radio's own center line is not on them
fs = 2e6;              % sample rate [Hz]       - you see fc +- fs/2
fprintf('You will see %.2f - %.2f MHz\n', (fc - fs/2)/1e6, (fc + fs/2)/1e6);

%% 2. Connect to the radio
% The gain is set automatically (AGC), so for now only fc and fs matter.
N = 4096;                                       % samples per frame
if USE_PLUTO
    rx = comm.SDRRxPluto('CenterFrequency', fc, 'BasebandSampleRate', fs, ...
        'SamplesPerFrame', N, 'OutputDataType', 'single', ...
        'GainSource', 'AGC Slow Attack');
    rx(); rx();                                 % throw away old data
    disp('Connected.');
else
    rx = [];
    disp('Simulator mode (no radio).');
end

%% 3. Look: live spectrum and waterfall for 30 seconds
% Top: power versus frequency now. Bottom: the waterfall - each row is one
% moment, newest on top, color = power. Short bursts (a remote, Wi-Fi)
% show up as short dashes in the waterfall.
% Change fc (and fs) in section 1, run sections 1-3 again, and explore.
seconds = 30;
f = (fc + ((0:N-1) - N/2)*fs/N)/1e6;            % frequency axis [MHz]
w = 0.5 - 0.5*cos(2*pi*(0:N-1).'/N);            % Hann window
W = nan(100, N);                                % waterfall memory
fig = figure('Name', 'SDR intro - live', 'Color', 'w');
ax1 = subplot(2,1,1); h = plot(ax1, f, nan(1, N)); grid(ax1, 'on');
xlabel(ax1, 'Frequency [MHz]'); ylabel(ax1, 'Power [dBFS]'); ylim(ax1, [-120 0]); xlim(ax1, f([1 end]));
ax2 = subplot(2,1,2); im = imagesc(ax2, f, 1:100, W); colormap(ax2, turbo); colorbar(ax2);
xlabel(ax2, 'Frequency [MHz]'); ylabel(ax2, 'Time (newest on top)'); ax2.YDir = 'normal';
t0 = tic; k = 0;
while toc(t0) < seconds && isvalid(fig)
    x = grab(rx, fc, fs, N, k*N/fs);  k = k + 1;
    P = 10*log10(abs(fftshift(fft(double(x).*w))).^2/sum(w)^2 + 1e-20);
    W = [W(2:end, :); P.'];                     % newest row at the top
    set(h, 'YData', P); set(im, 'CData', W); clim(ax2, [max(P) - 60, max(P)]);
    title(ax1, sprintf('fc = %.3f MHz, fs = %.1f MSPS', fc/1e6, fs/1e6));
    drawnow limitrate
end
if isvalid(fig), exportgraphics(fig, sprintf('live_%.0fMHz.png', fc/1e6)); end

%% 4. Measure one station: time domain, frequency domain and bandwidth
% Choose a station you saw. FM broadcast (87.5-108 MHz) needs the radio in
% AD9364 mode; in AD9363 mode use PMR446 (446.1 MHz) instead.
% We tune 300 kHz below the station, so the radio's center line is not on it.
fStation = 99.0e6;                              % the station [Hz] - change and run again
fsM = 2e6; NM = 8192; avg = 16;                 % sample rate, FFT size, averages
fcM = fStation - 300e3;
if USE_PLUTO
    release(rx); rx.CenterFrequency = fcM; rx.BasebandSampleRate = fsM; rx.SamplesPerFrame = NM;
    rx(); rx();
end
xs = zeros(NM*avg, 1);
for i = 1:avg, xs((i-1)*NM + (1:NM)) = grab(rx, fcM, fsM, NM, 200 + i*NM/fsM); end
wM = 0.5 - 0.5*cos(2*pi*(0:NM-1).'/NM);
P = 10*log10(mean(abs(fftshift(fft(reshape(xs, NM, avg).*wM), 1)).^2, 2)/sum(wM)^2 + 1e-20);
fM = fcM + ((0:NM-1).' - NM/2)*fsM/NM;
r = sdr_measure_bw(fM, P, fStation, 100e3);     % -26 dB and 99% bandwidth
fig = figure('Name', 'SDR intro - station', 'Color', 'w', 'Position', [80 80 1000 700]);
subplot(2,1,1); tt = (0:399)/fsM*1e6;
plot(tt, real(xs(1:400)), tt, imag(xs(1:400)), tt, abs(xs(1:400)), 'k', 'LineWidth', 1); grid on
xlabel('Time [\mus]'); ylabel('Amplitude [FS]'); legend('I', 'Q', '|x|', 'Location', 'eastoutside');
title(sprintf('Time domain: %.2f MHz (first 200 \\mus)', fStation/1e6));
subplot(2,1,2); plot((fM - fStation)/1e3, P); grid on; hold on
xline((r.obwEdges - fStation)/1e3, 'g--', 'LineWidth', 1.5);
if ~isnan(r.bw(4)), plot((r.edges(4,:) - fStation)/1e3, (r.pPeak - 26)*[1 1], 'r-', 'LineWidth', 2); end
xlim([-400 400]); xlabel('Offset from the station [kHz]'); ylabel('Power [dBFS]');
title(sprintf('Frequency domain: -26 dB width = %.0f kHz (red), 99%% width = %.0f kHz (green)', r.bw(4)/1e3, r.obw/1e3));
exportgraphics(fig, sprintf('station_%.2fMHz.png', fStation/1e6));
fprintf('%.2f MHz:  -26 dB = %.1f kHz   99%% = %.1f kHz   SNR = %.0f dB\n', fStation/1e6, r.bw(4)/1e3, r.obw/1e3, r.snr);
if USE_PLUTO                                    % back to the settings of section 1
    release(rx); rx.CenterFrequency = fc; rx.BasebandSampleRate = fs; rx.SamplesPerFrame = N;
end

%% 5. Record 3 seconds - press the car or gate remote while it records
% We only RECORD the signal - we do not decode it. Remotes use rolling
% codes, and transmitting them back is not allowed. We only look.
fcR = 433.5e6; fsR = 2e6;                       % the remote band (433.92 MHz)
recSeconds = 3;
Nrec = round(recSeconds*fsR);
input('Hold the remote near the antenna, press Enter, then press the remote... ', 's');
if USE_PLUTO
    release(rx);                                % record without gaps (burst mode)
    rx.CenterFrequency = fcR; rx.BasebandSampleRate = fsR;
    rx.SamplesPerFrame = 2^16; rx.EnableBurstMode = true;
    rx.NumFramesInBurst = ceil(Nrec/2^16);
    rec = complex(zeros(rx.NumFramesInBurst*2^16, 1, 'single'));
    for i = 1:rx.NumFramesInBurst, rec((i-1)*2^16 + (1:2^16)) = rx(); end
    rec = rec(1:Nrec);
    release(rx); rx.EnableBurstMode = false; rx.SamplesPerFrame = N;
else
    rec = grab([], fcR, fsR, Nrec, 100);
end
save('my_recording.mat', 'rec', 'fcR', 'fsR');
fprintf('Recorded %.1f s (%d samples) -> my_recording.mat\n', recSeconds, Nrec);

%% 6. Look at the recording
% Top: the waterfall of the recording - where in frequency and when.
% Bottom: the strength |x| versus time - the on/off bursts of the remote.
% Zoom in (magnifier) on one burst to see the individual pulses.
M = 1024; nb = floor(numel(rec)/M);
S = abs(fftshift(fft(reshape(double(rec(1:nb*M)), M, nb).*(0.5 - 0.5*cos(2*pi*(0:M-1).'/M))), 1)).^2;
fr = (fcR + ((0:M-1) - M/2)*fsR/M)/1e6; tr = (0:nb-1)*M/fsR;
fig = figure('Name', 'SDR intro - recording', 'Color', 'w');
subplot(2,1,1); imagesc(tr, fr, 10*log10(S + 1e-12)); axis xy; colormap(turbo); colorbar;
xlabel('Time [s]'); ylabel('Frequency [MHz]'); title('Recording: frequency versus time');
subplot(2,1,2); plot((0:numel(rec)-1)/fsR, abs(rec)); grid on;
xlabel('Time [s]'); ylabel('|x|'); title('Signal strength versus time');
exportgraphics(fig, 'remote_recording.png');

%% 7. Free the radio (always at the end)
if USE_PLUTO, release(rx); end
disp('Done.');

% -------------------------------------------------------------------------
function x = grab(rx, fc, fs, n, t)
% one frame from the radio, or from the simulator when rx is empty
if isempty(rx)
    x = sdr_sim_band(fc, fs, n, 35, t);
else
    x = rx();
end
end
