function r = sdr_measure_bw(f, P, f0, searchHz)
%SDR_MEASURE_BW  Measure the bandwidth of the signal nearest to f0.
%   r = sdr_measure_bw(f, P, f0)            f [Hz], P [dB], f0 [Hz]
%   r = sdr_measure_bw(f, P, f0, searchHz)  look for the peak within +-searchHz
%
%   r.fPeak, r.pPeak   frequency [Hz] and level [dB] of the peak
%   r.floor            noise floor estimate [dB] (20th percentile of P)
%   r.isSignal         false if the peak could just be a noise spike
%   r.snr              peak above the noise floor [dB]
%   r.bw(k), r.edges(k,:)   width and edges [Hz] at r.levels(k) dB below
%                      the peak (3, 6, 20, 26 dB)
%   r.obw, r.obwEdges  occupied bandwidth: the band that holds 99% of the
%                      signal power (0.5% left out on each side)
%   r.center           center of the occupied band [Hz]
%
%   Use x dB bandwidths for signals with a clear peak (FM, AM, tones). For
%   flat digital signals (LTE, Wi-Fi) the 99% occupied bandwidth is the
%   number that matches the standard, because their top is noisy and flat.
%
%   Communication Lab - JCT

f = f(:); P = P(:);
if nargin < 4 || isempty(searchHz), searchHz = 0.02*(f(end) - f(1)); end
r.levels = [3 6 20 26];
r.floor = prctile_(P, 20);
spread = r.floor - prctile_(P, 5);          % how much the noise itself fluctuates

in = find(abs(f - f0) <= searchHz);
if isempty(in), [~, in] = min(abs(f - f0)); end
[r.pPeak, k] = max(P(in)); k = in(k); r.fPeak = f(k);
r.snr = r.pPeak - r.floor;
r.isSignal = r.snr > 2.4*spread + 3.5;            % calibrated on pure noise, 1-64 averages

% x dB bandwidth: walk out from the peak until the level drops by x dB
r.bw = nan(size(r.levels)); r.edges = nan(numel(r.levels), 2);
for j = 1:numel(r.levels)
    th = r.pPeak - r.levels(j);
    if th <= r.floor + 1, continue, end      % below the noise: cannot measure
    a = k; while a > 1 && P(a-1) > th, a = a - 1; end
    b = k; while b < numel(P) && P(b+1) > th, b = b + 1; end
    fl = cross(f, P, a - 1, a, th); fr = cross(f, P, b + 1, b, th);
    r.edges(j,:) = [fl fr]; r.bw(j) = fr - fl;
end

% occupied bandwidth: contiguous region above floor+6 dB, then 99% of power
th = r.floor + 6;
a = k; while a > 1 && P(a-1) > th, a = a - 1; end
b = k; while b < numel(P) && P(b+1) > th, b = b + 1; end
lin = 10.^(P(a:b)/10) - 10^(r.floor/10); lin(lin < 0) = 0;
c = cumsum(lin)/max(sum(lin), eps);
il = find(c >= 0.005, 1); ir = find(c >= 0.995, 1);
df = median(diff(f));
r.obwEdges = [f(a + il - 1) - df/2, f(a + ir - 1) + df/2];
r.obw = diff(r.obwEdges);
r.center = mean(r.obwEdges);
end

function fx = cross(f, P, i1, i2, th)
% frequency where P crosses th between bins i1 and i2 (linear interpolation)
if i1 < 1 || i1 > numel(P), fx = f(i2); return, end
fx = f(i1) + (th - P(i1))*(f(i2) - f(i1))/(P(i2) - P(i1));
end

function q = prctile_(v, p)
v = sort(v(:)); q = v(max(1, round(p/100*numel(v))));
end
