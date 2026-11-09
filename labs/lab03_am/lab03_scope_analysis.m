%% Lab 3 - analyze a waveform saved from the oscilloscope
% Communication Lab 130661 - JCT
% Loads a CSV saved from the scope (Save -> Waveform Data -> CSV), finds the
% envelope, measures Vmax, Vmin and the modulation depth, and plots the
% spectrum. Without a file it runs on a simulated AM signal.
%
% Usage:  lab03_scope_analysis                 % demo
%         lab03_scope_analysis('scope_0.csv')  % your measurement

function lab03_scope_analysis(file)
if nargin < 1 || isempty(file)
    fs = 250e6; t = (0:1/fs:40e-6-1/fs).';                 % demo: 10 MHz, 100 kHz, 50%
    v  = 0.5*(1 + 0.5*cos(2*pi*100e3*t)).*cos(2*pi*10e6*t) + 0.01*randn(size(t));
    src = 'simulated AM (no file given)';
else
    d  = readmatrix(file, 'NumHeaderLines', 2);           % Keysight CSV: time, ch1, ...
    d  = d(all(isfinite(d(:,1:2)),2), :);
    t  = d(:,1); v = d(:,2);
    fs = 1/median(diff(t));
    src = file;
end

% envelope with the analytic signal (Hilbert transform), then smooth
env = abs(analytic(v - mean(v)));
env = movmean(env, max(3, round(fs/1e6)));                % ~1 us smoothing
core = env(round(0.05*end):round(0.95*end));             % ignore the edges
Vmax = max(core); Vmin = min(core);
ka = (Vmax - Vmin)/(Vmax + Vmin);

% spectrum
N = numel(v); w = 0.5 - 0.5*cos(2*pi*(0:N-1).'/(N-1));     % Hann window
A = 2*abs(fft((v - mean(v)).*w))/sum(w);
f = (0:N-1).'*fs/N; half = f < fs/2;
[~, ic] = max(A(half)); fc = f(ic);

fprintf('\nFile: %s\n', src);
fprintf('  sample rate      : %.1f MS/s\n', fs/1e6);
fprintf('  carrier frequency: %.4f MHz\n', fc/1e6);
fprintf('  Vmax = %.3f V, Vmin = %.3f V\n', Vmax, Vmin);
fprintf('  modulation depth k_a = (Vmax-Vmin)/(Vmax+Vmin) = %.1f%%\n', 100*ka);

figure('Name','Scope analysis','Color','w');
subplot(2,1,1); plot(t*1e6, v); hold on; plot(t*1e6, env, 'LineWidth', 1.5);
title(sprintf('Signal and envelope   k_a = %.1f%%', 100*ka)); xlabel('time [\mus]'); ylabel('V'); grid on;
subplot(2,1,2); plot(f(half)/1e6, 20*log10(A(half) + 1e-9)); grid on;
xlim(fc/1e6 + [-0.5 0.5]); xlabel('f [MHz]'); ylabel('dBV');
title('Spectrum around the carrier');
end

function z = analytic(x)
% analytic signal x + j*Hilbert{x}, computed with the FFT (no toolbox needed)
N = numel(x); X = fft(x(:));
h = zeros(N,1); h(1) = 1;
if mod(N,2) == 0, h(N/2+1) = 1; h(2:N/2) = 2; else, h(2:(N+1)/2) = 2; end
z = ifft(X.*h);
end
