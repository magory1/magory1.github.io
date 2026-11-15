function [f, P, rbw] = sdr_psd(x, fs, Nfft, fc)
%SDR_PSD  Averaged spectrum of complex I/Q samples, in dBFS per FFT bin.
%   [f, P, rbw] = sdr_psd(x, fs, Nfft, fc)
%   x     complex samples (length = Nfft * number of averages)
%   fs    sample rate [Hz];  Nfft  FFT size;  fc  center frequency [Hz]
%   f     absolute frequency of each bin [Hz], from fc - fs/2 to fc + fs/2
%   P     power per bin [dBFS]: a full-scale tone reads 0 dBFS
%   rbw   resolution bandwidth [Hz] = 1.5*fs/Nfft (Hann window)
%
%   Each block of Nfft samples is windowed (Hann), transformed, and the
%   powers are averaged. Averaging smooths the noise; it does not lower it.
%   A longer FFT makes the bins narrower: the noise per bin drops by 3 dB
%   each time Nfft doubles, while a pure tone stays at the same level.
%
%   Communication Lab - JCT

if nargin < 4, fc = 0; end
x = double(x(:));
K = floor(numel(x)/Nfft);
if K < 1, error('sdr_psd: need at least Nfft = %d samples', Nfft); end
w = 0.5 - 0.5*cos(2*pi*(0:Nfft-1).'/Nfft);       % Hann window, no toolbox needed
X = fft(reshape(x(1:K*Nfft), Nfft, K).*w);
P = mean(abs(X).^2, 2)/sum(w)^2;
P = 10*log10(fftshift(P) + 1e-20);
f = fc + ((0:Nfft-1).' - floor(Nfft/2))*fs/Nfft;
rbw = 1.5*fs/Nfft;
end
