%% Lab 3 - AM and DSB-SC: explore before the lab
% Communication Lab 130661 - JCT
% Generates AM and DSB-SC signals, plots them in time and frequency, and
% computes how the power splits between the carrier and the sidebands.
% Change the parameters below and run again (F5).

clear; close all;

%% Parameters (the values used in the lab)
fc  = 10e6;      % carrier frequency [Hz]
fm  = 100e3;     % message frequency [Hz]
Ac  = 1;         % carrier amplitude [V]
ka  = 0.5;       % modulation depth (0..1)
fs  = 200e6;     % simulation sample rate [Hz]
T   = 40/fm;     % 40 message periods

t  = 0:1/fs:T-1/fs;
m  = cos(2*pi*fm*t);                         % message, peak 1
am = Ac*(1 + ka*m).*cos(2*pi*fc*t);          % AM
ds = Ac*ka*m.*cos(2*pi*fc*t);                % DSB-SC (same sidebands, no carrier)

%% Time domain
figure('Name','Time domain','Color','w');
show = t < 3/fm;
subplot(2,1,1); plot(t(show)*1e6, am(show)); hold on;
plot(t(show)*1e6, Ac*(1+ka*m(show)), 'LineWidth', 1.5);
title(sprintf('AM, k_a = %d%%', round(100*ka))); xlabel('time [\mus]'); ylabel('V'); grid on;
subplot(2,1,2); plot(t(show)*1e6, ds(show)); hold on;
plot(t(show)*1e6, Ac*ka*m(show), 'LineWidth', 1.5);
title('DSB-SC'); xlabel('time [\mus]'); ylabel('V'); grid on;

%% Frequency domain (one-sided amplitude, as on the spectrum analyzer)
N  = numel(t);
w  = 0.5 - 0.5*cos(2*pi*(0:N-1)/(N-1));      % Hann window: cleaner lines
f  = (0:N-1)*fs/N;
A  = @(x) 2*abs(fft(x.*w))/sum(w);
figure('Name','Spectrum','Color','w');
band = f > fc-4*fm & f < fc+4*fm;
Aam = A(am); Ads = A(ds);
subplot(2,1,1); plot(f(band)/1e6, Aam(band), 'LineWidth', 1.2); xlim([fc-4*fm fc+4*fm]/1e6);
title('AM spectrum'); xlabel('f [MHz]'); ylabel('amplitude [V]'); grid on;
subplot(2,1,2); plot(f(band)/1e6, Ads(band), 'LineWidth', 1.2); xlim([fc-4*fm fc+4*fm]/1e6);
title('DSB-SC spectrum'); xlabel('f [MHz]'); ylabel('amplitude [V]'); grid on;

%% Line amplitudes and power split
Pc  = Ac^2/2;                    % carrier power (1 ohm)
Psb = 2*(Ac*ka/2)^2/2;           % both sidebands
fprintf('\nAM with k_a = %.0f%%\n', 100*ka);
fprintf('  carrier line  : %.3f V   at %.3f MHz\n', Ac, fc/1e6);
fprintf('  sideband lines: %.3f V   at %.3f and %.3f MHz\n', Ac*ka/2, (fc-fm)/1e6, (fc+fm)/1e6);
fprintf('  power efficiency (sidebands / total) = %.1f%%\n', 100*Psb/(Pc+Psb));

%% Efficiency vs depth
k = 0:0.01:1;
figure('Name','Efficiency','Color','w');
plot(100*k, 100*k.^2./(2+k.^2), 'LineWidth', 1.5); grid on;
xlabel('modulation depth k_a [%]'); ylabel('power in sidebands [%]');
title('AM power efficiency  \eta = k_a^2 / (2 + k_a^2)');
