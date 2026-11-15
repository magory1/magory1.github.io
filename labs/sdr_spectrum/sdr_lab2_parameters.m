%% SDR lab - part 2: what each receiver parameter does, and the limits
% Communication Lab - JCT
% Four short experiments. Each makes one figure and saves it as PNG for the
% report (Figures 2-5). Run the whole file, or one section at a time.

%% Settings
USE_PLUTO = true;           % false = simulator
fStation  = 99.0e6;         % a strong FM station you found in part 1
                            %   AD9363 mode: use a signal above 325 MHz instead
src = sdr_source(ternaryStr(USE_PLUTO, 'pluto', 'sim'));
cleanup = onCleanup(@() src.release());
gain0 = 30;

%% A. Sample rate = how much you see  (Figure 2)
% Same center, three sample rates. The span is exactly fs; the edges roll
% off (the last ~10% on each side are not reliable).
rates = [0.96e6 4e6 20e6];
figure('Name', 'A - span', 'Color', 'w', 'Position', [60 60 1100 700]);
for k = 1:3
    fs = rates(k);
    x = src.get(fStation, fs, 4096*8, 'Manual', gain0);
    [f, P] = sdr_psd(x, fs, 4096, fStation);
    subplot(3,1,k); plot(f/1e6, P); grid on; xlim(fStation/1e6 + [-1 1]*fs/2e6);
    xline((fStation + [-0.4 0.4]*fs)/1e6, 'r:', {'0.4 fs', '0.4 fs'});
    ylabel('dBFS/bin'); title(sprintf('fs = %.2f MSPS  ->  span %.2f MHz', fs/1e6, fs/1e6));
end
xlabel('Frequency [MHz]');
exportgraphics(gcf, 'fig2_span.png', 'Resolution', 150);

%% B. FFT size = how fine you see  (Figure 3)
% Bigger N: narrower bins (RBW = 1.5 fs/N). A wideband signal or noise
% spreads over more bins, so its level per bin DROPS by 3 dB per doubling
% of N. That is why the noise floor moves when you change N.
fs = 4e6; Ns = [256 2048 16384];
x = src.get(fStation, fs, 16384*8, 'Manual', gain0);
figure('Name', 'B - RBW', 'Color', 'w', 'Position', [60 60 1100 450]); hold on
for k = 1:3
    [f, P] = sdr_psd(x, fs, Ns(k), fStation);
    plot(f/1e6, P, 'DisplayName', sprintf('N = %d, RBW = %.2f kHz, floor %.1f dBFS', ...
        Ns(k), 1.5*fs/Ns(k)/1e3, prctile20(P)));
end
grid on; legend('Location', 'northeast'); xlabel('Frequency [MHz]'); ylabel('dBFS/bin');
title('Same samples, three FFT sizes: the noise floor drops 10 log_{10}(N_2/N_1) dB');
exportgraphics(gcf, 'fig3_rbw.png', 'Resolution', 150);

%% C. Gain: too little, just right, too much  (Figure 4)
% Low gain: the receiver noise is below the ADC noise - the floor is set by
% the ADC and weak signals disappear. High gain: the ADC clips - the floor
% rises and false signals (spurs) appear. In between there is a best gain.
fs = 1.92e6; G = 0:5:70; R = nan(numel(G), 4);
for k = 1:numel(G)
    [x, info] = src.get(fStation - 300e3, fs, 8192*4, 'Manual', G(k));
    [f, P] = sdr_psd(x, fs, 8192, fStation - 300e3);
    r = sdr_measure_bw(f, P, fStation, 50e3);
    R(k,:) = [r.pPeak, r.floor, r.snr, info.peakDbfs];
end
[~, best] = max(R(:,3));
figure('Name', 'C - gain', 'Color', 'w', 'Position', [60 60 1100 500]);
subplot(1,2,1);
plot(G, R(:,1), 'o-', G, R(:,2), 's-', G, R(:,4), '^-', 'LineWidth', 1.4); grid on
yline(0, 'r--', 'ADC full scale'); xline(G(best), 'g-', 'best SNR');
xlabel('Gain [dB]'); ylabel('dBFS'); legend('station peak', 'noise floor', 'ADC peak', 'Location', 'northwest');
title('Levels vs. gain');
subplot(1,2,2); plot(G, R(:,3), 'o-', 'LineWidth', 1.4); grid on
xline(G(best), 'g-', sprintf('%d dB', G(best)));
xlabel('Gain [dB]'); ylabel('SNR [dB]'); title('Signal-to-noise ratio vs. gain');
exportgraphics(gcf, 'fig4_gain.png', 'Resolution', 150);
fprintf('Best gain for this station: %d dB (SNR %.1f dB)\n', G(best), R(best,3));

%% D. The DC spike and offset tuning  (Figure 5)
% A direct-conversion receiver leaks a little LO to its own input, so there
% is always a line at 0 Hz (the center). Tune a bit off the signal and move
% it back digitally - the signal is no longer on top of the spike.
fs = 1.92e6;
figure('Name', 'D - DC spike', 'Color', 'w', 'Position', [60 60 1100 450]);
x1 = src.get(fStation, fs, 8192*8, 'Manual', G(best));
[f1, P1] = sdr_psd(x1, fs, 8192, fStation);
x2 = src.get(fStation - 400e3, fs, 8192*8, 'Manual', G(best));
[f2, P2] = sdr_psd(x2, fs, 8192, fStation - 400e3);
subplot(1,2,1); plot(f1/1e6, P1); grid on; xline(fStation/1e6, 'r:', 'DC');
title('Tuned exactly on the station'); xlabel('Frequency [MHz]'); ylabel('dBFS/bin');
subplot(1,2,2); plot(f2/1e6, P2); grid on; xline((fStation - 400e3)/1e6, 'r:', 'DC');
title('Tuned 400 kHz below (offset tuning)'); xlabel('Frequency [MHz]');
exportgraphics(gcf, 'fig5_dc.png', 'Resolution', 150);

function s = ternaryStr(c, a, b), if c, s = a; else, s = b; end, end
function q = prctile20(P), P = sort(P); q = P(round(0.2*numel(P))); end
