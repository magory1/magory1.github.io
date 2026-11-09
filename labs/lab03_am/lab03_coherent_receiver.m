%% Lab 3 - the synchronous (coherent) receiver: phase and frequency errors
% Communication Lab 130661 - JCT
% Simulates part 4 of the lab: an AM signal is multiplied by a local
% oscillator (LO) and low-pass filtered. Try different LO phase and
% frequency errors and compare with what you saw on the scope.

clear; close all;

%% Parameters (part 4 of the lab, scaled down so it runs fast)
fc   = 20e3;         % carrier [Hz]   (10 MHz in the lab - same physics)
fm   = 1e3;          % message [Hz]
ka   = 0.5;          % modulation depth
fs   = 400e3;        % sample rate [Hz]
T    = 2;            % seconds of signal
phis = [0 30 60 90]; % LO phase errors [deg]  (step 19)
df   = 2;            % LO frequency error [Hz] (step 20: 10.000002 MHz -> 2 Hz)

t  = 0:1/fs:T-1/fs;
s  = (1 + ka*cos(2*pi*fm*t)).*cos(2*pi*fc*t);   % received AM
lpf = @(x) ideal_lpf(x, fs, 5*fm);              % LPF: keeps the message, removes 2fc

%% Step 19: LO phase error
figure('Name','LO phase','Color','w');
show = t < 3/fm;
for i = 1:numel(phis)
    lo  = cos(2*pi*fc*t + deg2rad(phis(i)));
    out = lpf(s.*lo);
    out = out - mean(out);                       % remove the DC term (Ac/2 cos phi)
    subplot(numel(phis),1,i); plot(t(show)*1e3, out(show), 'LineWidth', 1.2); grid on;
    ylim([-0.3 0.3]); ylabel('V');
    title(sprintf('\\phi = %d deg:  message amplitude %.3f  (theory %.3f)', ...
        phis(i), (max(out(show))-min(out(show)))/2, ka/2*cosd(phis(i))));
end
xlabel('time [ms]');

%% Step 20: LO frequency error
lo  = cos(2*pi*(fc+df)*t);
out = lpf(s.*lo);
figure('Name','LO frequency error','Color','w');
plot(t, out); hold on; grid on;
env = (0.5 + ka/2)*cos(2*pi*df*t);
plot(t, env, 'r', 'LineWidth', 1.5); plot(t, -env, 'r', 'LineWidth', 1.5, 'HandleVisibility', 'off');
title(sprintf('LO off by %g Hz: the output is multiplied by cos(2\\pi\\cdot%g\\cdot t)', df, df));
xlabel('time [s]'); ylabel('V'); legend('receiver output', 'envelope', 'Location', 'southeast');

%% helper: ideal low-pass filter in the frequency domain (no toolbox needed)
function y = ideal_lpf(x, fs, fcut)
    N = numel(x); f = (0:N-1)*fs/N; f = min(f, fs - f);
    X = fft(x); X(f > fcut) = 0;
    y = real(ifft(X));
end
