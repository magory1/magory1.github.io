function src = sdr_source(kind, radioID)
%SDR_SOURCE  One interface for the real ADALM-Pluto and for the simulator.
%   src = sdr_source('pluto')         % real radio (usb:0)
%   src = sdr_source('pluto','ip:192.168.2.1')
%   src = sdr_source('sim')           % no hardware: sdr_sim_band
%
%   [x, info] = src.get(fc, fs, N, gainMode, gainDb, contiguous)
%       fc        center frequency [Hz]
%       fs        sample rate [Hz] = the width of the band you see
%       N         number of complex samples to return
%       gainMode  'Manual', 'AGC Slow Attack' or 'AGC Fast Attack'
%       gainDb    RX gain [dB] (Manual only), 0..71
%       contiguous  true = no gaps between frames (needed for audio)
%   info: .gain .peakDbfs .clipFraction .overflow
%   src.release()  frees the radio.
%
%   Communication Lab - JCT

if nargin < 1, kind = 'sim'; end
if nargin < 2, radioID = 'usb:0'; end
kind = lower(kind);
rx = []; cfg = struct('fs', NaN, 'spf', NaN, 'burst', NaN, 'mode', '', 'nb', NaN);
tSim = 0;

src.kind = kind;
src.get = @get;
src.release = @release_;
src.radioID = radioID;

    function [x, info] = get(fc, fs, N, gainMode, gainDb, contiguous)
        if nargin < 4 || isempty(gainMode), gainMode = 'Manual'; end
        if nargin < 5 || isempty(gainDb), gainDb = 40; end
        if nargin < 6, contiguous = false; end
        gainDb = min(max(gainDb, 0), 71);
        if strcmp(kind, 'sim')
            [x, info] = getSim(fc, fs, N, gainMode, gainDb);
        else
            [x, info] = getPluto(fc, fs, N, gainMode, gainDb, contiguous);
        end
    end

    function [x, info] = getSim(fc, fs, N, gainMode, gainDb)
        if ~strcmpi(gainMode, 'Manual')          % AGC: aim the peak at -12 dBFS
            [~, i0] = sdr_sim_band(fc, fs, min(N, 4096), 40, tSim);
            gainDb = min(max(round(40 - 12 - i0.peakDbfs), 0), 71);
        end
        [x, info] = sdr_sim_band(fc, fs, N, gainDb, tSim);
        tSim = tSim + N/fs + 0.05;               % time moves on between captures
        info.gain = gainDb; info.overflow = 0;
    end

    function [x, info] = getPluto(fc, fs, N, gainMode, gainDb, contiguous)
        spf = N; nb = 1;
        if contiguous, spf = min(N, 2^16); nb = ceil(N/spf); end
        rebuild = isempty(rx) || cfg.fs ~= fs || cfg.spf ~= spf || cfg.burst ~= contiguous ...
            || ~strcmp(cfg.mode, gainMode) || (contiguous && cfg.nb ~= nb);
        settle = false;
        try
            if rebuild
                release_();
                rx = comm.SDRRxPluto('RadioID', radioID, 'CenterFrequency', fc, ...
                    'BasebandSampleRate', fs, 'SamplesPerFrame', spf, ...
                    'OutputDataType', 'single', 'GainSource', gainMode);
                if strcmpi(gainMode, 'Manual'), rx.Gain = gainDb; end
                if contiguous
                    rx.EnableBurstMode = true; rx.NumFramesInBurst = nb;
                end
                cfg = struct('fs', fs, 'spf', spf, 'burst', contiguous, 'mode', gainMode, 'nb', nb);
                settle = ~contiguous;
            else
                if rx.CenterFrequency ~= fc, rx.CenterFrequency = fc; settle = true; end
                if strcmpi(gainMode, 'Manual') && rx.Gain ~= gainDb, rx.Gain = gainDb; settle = true; end
            end
            if settle                             % old samples are still in the buffer
                for k = 1:2, rx(); end
            end
            x = complex(zeros(spf*nb, 1, 'single')); ovf = 0;
            for k = 1:nb
                [d, ~, o] = rx();
                x((k-1)*spf + (1:spf)) = d; ovf = ovf + double(o);
            end
            x = x(1:N);
        catch err
            msg = err.message;
            if fc < 325e6
                msg = sprintf(['%s\n\nBelow 325 MHz the Pluto must run in AD9364 mode ' ...
                    '(70 MHz - 6 GHz). Ask the instructor, or run once: configurePlutoRadio(''AD9364'')'], msg);
            end
            error('sdr:pluto', '%s', msg);
        end
        info.gain = gainDb;
        if ~strcmpi(gainMode, 'Manual'), info.gain = NaN; end
        info.peakDbfs = 20*log10(double(max(abs([real(x); imag(x)]))) + eps);
        info.clipFraction = mean(abs(real(x)) > 0.999 | abs(imag(x)) > 0.999);
        info.overflow = ovf;
    end

    function release_()
        if ~isempty(rx)
            try, release(rx); catch, end
            rx = [];
        end
    end
end
