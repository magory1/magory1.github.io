%% SDR lab - part 1: first capture with the ADALM-Pluto, step by step
% Communication Lab - JCT
% Run one section at a time (Ctrl+Enter / Cmd+Enter) and read the comments.
% Every parameter you give the radio is explained where it is set.

%% 1. Settings - change these
USE_PLUTO = true;          % false = simulator (at home, no radio)
fc  = 99.0e6;              % center frequency [Hz]: an FM station (needs AD9364 mode)
                           %   in AD9363 mode use e.g. 433.92e6 or 1090e6
fs  = 1.92e6;              % sample rate [Hz]: you see the band fc +- fs/2
N   = 8192;                % samples per frame = FFT size
gain = 30;                 % RX gain [dB], 0..71

%% 2. Find the radio
% findPlutoRadio lists every Pluto connected over USB.
if USE_PLUTO
    radios = findPlutoRadio;
    if isempty(radios), error('No Pluto found - run sdr_setup_check'); end
    disp(radios(1))
end

%% 3. Create the receiver object and look at its parameters
% CenterFrequency    - the LO frequency: the middle of what you see
% BasebandSampleRate - complex samples per second = the width you see
% SamplesPerFrame    - how many samples one call returns
% GainSource/Gain    - 'Manual' = you choose; 'AGC ...' = the radio chooses
% OutputDataType     - 'single' scales the 12-bit ADC to +-1 (full scale)
if USE_PLUTO
    rx = comm.SDRRxPluto('RadioID', radios(1).RadioID, ...
        'CenterFrequency', fc, 'BasebandSampleRate', fs, ...
        'SamplesPerFrame', N, 'GainSource', 'Manual', 'Gain', gain, ...
        'OutputDataType', 'single');
    disp(rx)
end

%% 4. Receive one frame
% The first frames after a change may be old data still in the buffer, so
% we throw away two. "overflow" = 1 means samples were lost on the way.
if USE_PLUTO
    rx(); rx();
    [x, valid, overflow] = rx();
    fprintf('received %d samples, valid=%d, overflow=%d\n', numel(x), valid, overflow);
else
    x = sdr_sim_band(fc, fs, N, gain, 0);
end

%% 5. Time domain: I and Q
% x is complex: I = real(x), Q = imag(x). Full scale is +-1.
t = (0:N-1)/fs;
figure('Name', 'Part 1 - I/Q', 'Color', 'w');
subplot(2,1,1); plot(t*1e6, real(x), t*1e6, imag(x)); grid on; xlim([0 200]);
xlabel('Time [\mus]'); ylabel('Amplitude [FS]'); legend('I', 'Q'); title('First 200 \mus of I and Q');
subplot(2,1,2); histogram(real(x), 100); grid on;
xlabel('I value [FS]'); ylabel('Count'); title('How much of the ADC range do we use?');
fprintf('peak = %.1f dBFS  (close to 0 = clipping risk, below -40 = gain too low)\n', ...
    20*log10(max(abs([real(x); imag(x)]))));

%% 6. Spectrum "by hand"
% The FFT of N complex samples gives N bins from -fs/2 to +fs/2.
% Bin spacing = fs/N. With a Hann window the resolution bandwidth is 1.5*fs/N.
w = 0.5 - 0.5*cos(2*pi*(0:N-1).'/N);              % Hann window
X = fftshift(fft(double(x).*w));
P = 10*log10(abs(X).^2/sum(w)^2 + 1e-20);          % dBFS per bin
f = fc + ((0:N-1).' - N/2)*fs/N;
figure('Name', 'Part 1 - spectrum', 'Color', 'w');
plot(f/1e6, P); grid on; xlabel('Frequency [MHz]'); ylabel('Power per bin [dBFS]');
title(sprintf('fc = %.3f MHz, fs = %.2f MSPS, N = %d', fc/1e6, fs/1e6, N));
xline(fc/1e6, ':', 'fc (DC)');

%% 7. The numbers that describe this capture - write them in the report
fprintf('\nSpan            = fs          = %.3f MHz\n', fs/1e6);
fprintf('Bin spacing     = fs/N        = %.2f kHz\n', fs/N/1e3);
fprintf('RBW (Hann)      = 1.5 fs/N    = %.2f kHz\n', 1.5*fs/N/1e3);
fprintf('Frame duration  = N/fs        = %.2f ms\n', N/fs*1e3);
fprintf('Data rate       = 2 x 16 bit x fs = %.1f Mbit/s over USB (12-bit samples in 16-bit words)\n\n', 2*16*fs/1e6);

%% 8. Free the radio (always, before you open the GUI)
if USE_PLUTO, release(rx); end
