function app = sdr_spectrum_explorer(varargin)
%SDR_SPECTRUM_EXPLORER  Spectrum analyzer and waterfall for the ADALM-Pluto.
%   sdr_spectrum_explorer                    % starts with the simulator
%   sdr_spectrum_explorer('Source','pluto')  % starts with the real radio
%
%   What you can do:
%   - choose a ready band (Preset) or set the center frequency, sample rate,
%     FFT size, averaging and gain yourself, and watch what changes;
%   - Run: live spectrum + waterfall.  Sweep: stitch many captures to see a
%     band wider than the sample rate (e.g. the whole FM band, 87.5-108 MHz);
%   - click on a signal to measure its bandwidth (3/6/20/26 dB and 99%);
%   - Listen FM: demodulate the station you clicked;
%   - Save PNG (for the report) and Save I/Q (.mat, for later analysis).
%
%   The status line shows what limits you: span (= sample rate), resolution
%   bandwidth (RBW = 1.5 fs/N), capture time, ADC peak and clipping.
%
%   Needs: MATLAB R2021a or newer. Real radio: Communications Toolbox and
%   "Communications Toolbox Support Package for Analog Devices ADALM-Pluto
%   Radio". The simulator needs no toolbox.
%
%   Communication Lab - JCT

p = inputParser;
p.addParameter('Source', 'sim');
p.addParameter('Visible', 'on');
p.parse(varargin{:});

PRESETS = { ...  name, fc MHz, fs MSPS, Nfft, sweep [f1 f2] MHz, gain dB
    'Custom',                          NaN,   NaN,  NaN,   [],          NaN
    'FM broadcast 87.5-108 MHz (sweep)', 98,  4,    4096,  [87.5 108],  30
    'FM - one station',                99.0,  1.92, 8192,  [],          30
    'Airband AM 118-137 MHz (sweep)',  127,   4,    8192,  [118 137],   50
    'PMR446 narrow FM',                446.1, 0.96, 16384, [],          50
    'ISM 433.92 MHz remotes',          433.92, 1.92, 4096, [],          40
    'ADS-B aircraft 1090 MHz',         1089,  4,    4096,  [],          50
    'LTE band 3 downlink (sweep)',     1842,  20,   2048,  [1800 1885], 55
    'Wi-Fi 2.4 GHz (sweep)',           2442,  20,   1024,  [2400 2484], 30
    '5G NR n78 3.5 GHz (sweep)',       3550,  20,   1024,  [3400 3700], 55 };
RATES = [0.96 1.92 2.4 4 8 10 20 30.72 61.44];
FFTS  = 2.^(8:15);
WROWS = 150;                                  % waterfall history

src = sdr_source(p.Results.Source);
S = struct('f', [], 'P', [], 'maxP', [], 'W', [], 'Wf', [], 'x', [], 'fc', NaN, 'fs', NaN, ...
           'meas', [], 'fMark', NaN, 'sweep', false, 'busy', false, 'overflows', 0);

% ---------------- layout ----------------
fig = uifigure('Name', 'SDR Spectrum Explorer - ADALM-Pluto | JCT', ...
    'Position', [60 60 1320 800], 'Visible', p.Results.Visible, 'CloseRequestFcn', @onClose);
g = uigridlayout(fig, [1 2]); g.ColumnWidth = {310, '1x'}; g.Padding = [8 8 8 8];

L = uigridlayout(g, [29 2]); L.Scrollable = 'on';
L.RowHeight = repmat({24}, 1, 29); L.ColumnWidth = {130, '1x'}; L.RowSpacing = 5;
row = 0;

head('Source');
ui.src = add('Radio', uidropdown(L, 'Items', {'Simulator', 'ADALM-Pluto'}, ...
    'Value', ternary(strcmp(src.kind, 'sim'), 'Simulator', 'ADALM-Pluto'), 'ValueChangedFcn', @onSource));
ui.preset = add('Preset', uidropdown(L, 'Items', PRESETS(:,1), 'ValueChangedFcn', @onPreset));
head('Receiver parameters');
ui.fc   = add('Center freq [MHz]', uieditfield(L, 'numeric', 'Value', 99.0, 'Limits', [70 6000], ...
    'ValueDisplayFormat', '%.4f', 'ValueChangedFcn', @onParam));
ui.fs   = add('Sample rate [MSPS]', uidropdown(L, 'Items', string(RATES), 'Value', "1.92", 'ValueChangedFcn', @onParam));
ui.gm   = add('Gain mode', uidropdown(L, 'Items', {'Manual', 'AGC Slow Attack', 'AGC Fast Attack'}, 'ValueChangedFcn', @onParam));
ui.gain = add('Gain [dB]', uispinner(L, 'Value', 30, 'Limits', [0 71], 'Step', 5, 'ValueChangedFcn', @onParam));
head('Display');
ui.nfft = add('FFT size N', uidropdown(L, 'Items', string(FFTS), 'Value', "8192", 'ValueChangedFcn', @onParam));
ui.avg  = add('Averages', uispinner(L, 'Value', 4, 'Limits', [1 64], 'ValueChangedFcn', @onParam));
ui.max  = add('', uicheckbox(L, 'Text', 'Max hold (orange)', 'ValueChangedFcn', @(~,~) clearMax()));
ui.lower = add('Lower plot', uidropdown(L, 'Items', {'Waterfall', 'Time: envelope |x|', 'Time: I and Q'}, 'ValueChangedFcn', @(~,~) drawLower()));
ui.ylim = add('Y range [dBFS]', uidropdown(L, 'Items', {'Auto', '-120 .. 0', '-110 .. -30', '-100 .. -50'}, 'ValueChangedFcn', @(~,~) applyY()));
head('Acquire');
ui.mode = add('Run mode', uidropdown(L, 'Items', {'Live capture', 'Repeated sweep'}));
ui.run  = add('', uibutton(L, 'state', 'Text', 'Run (live)', 'ValueChangedFcn', @onRun, 'BackgroundColor', [0.85 0.95 0.87]));
ui.one  = add('', uibutton(L, 'Text', 'Single capture', 'ButtonPushedFcn', @(~,~) safe(@acquire)));
ui.wclr = add('', uibutton(L, 'Text', 'Clear waterfall', 'ButtonPushedFcn', @(~,~) clearWaterfall()));
ui.s1   = add('Sweep start [MHz]', uieditfield(L, 'numeric', 'Value', 87.5, 'Limits', [70 6000]));
ui.s2   = add('Sweep stop [MHz]', uieditfield(L, 'numeric', 'Value', 108, 'Limits', [70 6000]));
ui.sw   = add('', uibutton(L, 'Text', 'Sweep once', 'ButtonPushedFcn', @(~,~) safe(@() sweep(true))));
head('Measure (click a signal)');
ui.lvl  = add('Show level', uidropdown(L, 'Items', {'-3 dB', '-6 dB', '-20 dB', '-26 dB'}, 'Value', '-26 dB', 'ValueChangedFcn', @(~,~) redrawMeas()));
ui.fm   = add('', uibutton(L, 'Text', 'Listen FM at marker', 'ButtonPushedFcn', @(~,~) safe(@listen)));
head('Save');
ui.png  = add('', uibutton(L, 'Text', 'Save PNG (for the report)', 'ButtonPushedFcn', @(~,~) safe(@savePng)));
ui.iq   = add('', uibutton(L, 'Text', 'Save I/Q (.mat)', 'ButtonPushedFcn', @(~,~) safe(@saveIq)));

R = uigridlayout(g, [3 1]); R.RowHeight = {'1.35x', '1x', 54}; R.Padding = [0 0 0 0];
axS = uiaxes(R); axW = uiaxes(R);
ui.info = uitextarea(R, 'Editable', 'off', 'FontName', 'Menlo', 'FontSize', 12);
grid(axS, 'on'); hold(axS, 'on');
xlabel(axS, 'Frequency [MHz]'); ylabel(axS, 'Power per bin [dBFS]');
hMax  = plot(axS, NaN, NaN, 'Color', [0.91 0.54 0.17], 'LineWidth', 0.8, 'HitTest', 'off');
hLine = plot(axS, NaN, NaN, 'Color', [0.12 0.37 0.66], 'LineWidth', 1, 'HitTest', 'off');
hMeas = gobjects(0);
axS.ButtonDownFcn = @onClick;
hImg = imagesc(axW, [0 1], [0 1], nan(2)); axW.YDir = 'normal';
colormap(axW, turbo); xlabel(axW, 'Frequency [MHz]'); ylabel(axW, 'Capture # (newest on top)');
title(axW, 'Waterfall: time goes up, color = power'); cb = colorbar(axW);
hold(axW, 'on');
hT1 = plot(axW, NaN, NaN, 'Color', [0.12 0.37 0.66], 'Visible', 'off');
hT2 = plot(axW, NaN, NaN, 'Color', [0.91 0.54 0.17], 'Visible', 'off');

tmr = timer('ExecutionMode', 'fixedSpacing', 'Period', 0.15, 'BusyMode', 'drop', ...
            'TimerFcn', @(~,~) safe(@tick));

onPreset([], struct('Value', 'FM - one station'));
ui.preset.Value = 'FM - one station';

app = struct('fig', fig, 'single', @acquire, 'sweep', @sweep, 'measure', @measureAt, ...
             'set', @setParam, 'state', @() S, 'close', @() onClose([], []), 'listen', @listen);
if nargout == 0, clear app, end

% ---------------- acquisition ----------------
    function [fc, fs, N, avg, gm, gn] = params()
        fc = ui.fc.Value*1e6; fs = str2double(ui.fs.Value)*1e6;
        N = str2double(ui.nfft.Value); avg = ui.avg.Value;
        gm = ui.gm.Value; gn = ui.gain.Value;
        ui.gain.Enable = matlab.lang.OnOffSwitchState(strcmp(gm, 'Manual'));
    end

    function acquire()
        if S.busy, return, end
        S.busy = true; c = onCleanup(@() setBusy(false));
        [fc, fs, N, avg, gm, gn] = params();
        [x, info] = src.get(fc, fs, N*avg, gm, gn);
        [f, P, rbw] = sdr_psd(x, fs, N, fc);
        newGrid = S.sweep || numel(S.f) ~= numel(f) || S.fc ~= fc || S.fs ~= fs;
        S.sweep = false; S.x = x; S.fc = fc; S.fs = fs; S.f = f; S.P = P;
        if newGrid || ~ui.max.Value || isempty(S.maxP), S.maxP = P; else, S.maxP = max(S.maxP, P); end
        S.overflows = S.overflows + info.overflow;
        draw(f, P, ternary(ui.max.Value, S.maxP, []));
        pushRow(f, P);
        status(fs, N, avg, rbw, info);
        if ~isnan(S.fMark), measureAt(S.fMark/1e6, false); end
    end

    function tick()
        if strcmp(ui.mode.Value, 'Repeated sweep'), sweep(false); else, acquire(); end
    end

    function pushRow(f, P)
        % add one line to the waterfall (new grid -> start a new waterfall)
        if isempty(S.W) || numel(S.Wf) ~= numel(f) || S.Wf(1) ~= f(1) || S.Wf(end) ~= f(end)
            S.W = nan(WROWS, numel(f)); S.Wf = f;
        end
        S.W = [P.'; S.W(1:end-1, :)];
        drawLower();
    end

    function clearWaterfall(), S.W = []; S.Wf = []; drawLower(); end

    function drawLower()
        wf = strcmp(ui.lower.Value, 'Waterfall');
        set(hImg, 'Visible', wf); cb.Visible = wf; set([hT1 hT2], 'Visible', ~wf);
        if wf
            title(axW, 'Waterfall: time goes up, color = power');
            xlabel(axW, 'Frequency [MHz]'); ylabel(axW, 'Capture # (newest on top)');
            if isempty(S.W), set(hImg, 'CData', nan(2)); return, end
            set(hImg, 'XData', S.Wf([1 end])/1e6, 'YData', [1 WROWS], 'CData', flipud(S.W), 'AlphaData', double(isfinite(flipud(S.W))));
            axW.XLim = S.Wf([1 end]).'/1e6; axW.YLim = [0.5 WROWS + 0.5];
            v = S.W(isfinite(S.W)); if ~isempty(v), axW.CLim = [prctile_(v, 10) - 3, max(v) + 0.1]; end
            return
        end
        xlabel(axW, 'Time [ms]');
        if isempty(S.x)
            set([hT1 hT2], 'XData', NaN, 'YData', NaN); title(axW, 'Time view needs a live capture (not a sweep)'); return
        end
        n = min(numel(S.x), 2^16); t = (0:n-1)/S.fs*1e3; x = double(S.x(1:n));
        if strcmp(ui.lower.Value, 'Time: envelope |x|')
            set(hT1, 'XData', t, 'YData', abs(x)); set(hT2, 'XData', NaN, 'YData', NaN);
            ylabel(axW, '|x| [full scale = 1]'); title(axW, 'Envelope: bursts, pulses and on/off keying show up here');
        else
            set(hT1, 'XData', t, 'YData', real(x)); set(hT2, 'XData', t, 'YData', imag(x));
            ylabel(axW, 'I (blue), Q (orange)'); title(axW, 'I and Q samples');
        end
        axW.XLim = [0 t(end) + eps]; axW.YLimMode = 'auto';
    end

    function sweep(showProgress)
        if nargin < 1, showProgress = true; end
        if showProgress && ui.run.Value, ui.run.Value = false; stop(tmr); ui.run.Text = 'Run (live)'; end
        [~, fs, N, avg, gm, gn] = params();
        f1 = ui.s1.Value*1e6; f2 = ui.s2.Value*1e6;
        if f2 <= f1, error('Sweep stop must be above sweep start.'); end
        step = 0.4*fs; df = fs/N;
        fg = (f1:df:f2).'; acc = zeros(size(fg)); cnt = zeros(size(fg));
        centers = (f1 - 0.2*fs):step:(f2 + 0.2*fs);
        d = [];
        if showProgress
            d = uiprogressdlg(fig, 'Title', 'Sweep', 'Message', sprintf('%d captures of %.2f MHz', numel(centers), fs/1e6));
            c = onCleanup(@() close(d));
        end
        info = struct('peakDbfs', -Inf, 'clipFraction', 0, 'overflow', 0, 'gain', gn);
        for k = 1:numel(centers)
            if ~isempty(d), d.Value = k/numel(centers); end
            [x, ik] = src.get(centers(k), fs, N*avg, gm, gn);
            [f, P] = sdr_psd(x, fs, N, centers(k));
            ok = abs(f - centers(k)) <= 0.42*fs & abs(f - centers(k)) >= 0.02*fs;   % flat part, no DC spike
            pi_ = interp1(f(ok), 10.^(P(ok)/10), fg, 'linear', NaN);
            m = ~isnan(pi_); acc(m) = acc(m) + pi_(m); cnt(m) = cnt(m) + 1;
            info.peakDbfs = max(info.peakDbfs, ik.peakDbfs);
            info.clipFraction = max(info.clipFraction, ik.clipFraction);
            info.overflow = info.overflow + ik.overflow;
        end
        P = 10*log10(acc./max(cnt, 1) + 1e-20); P(cnt == 0) = NaN;
        newGrid = ~S.sweep || numel(S.f) ~= numel(fg) || S.f(1) ~= fg(1);
        if newGrid || ~ui.max.Value || isempty(S.maxP), S.maxP = P; else, S.maxP = max(S.maxP, P); end
        S.sweep = true; S.f = fg; S.P = P; S.x = []; S.fc = (f1 + f2)/2; S.fs = f2 - f1;
        draw(fg, P, ternary(ui.max.Value, S.maxP, []));
        pushRow(fg, P);
        status(fs, N, avg, 1.5*fs/N, info, numel(centers));
        if ~isnan(S.fMark), measureAt(S.fMark/1e6, false); end
    end

    function draw(f, P, Pmax)
        set(hLine, 'XData', f/1e6, 'YData', P);
        if isempty(Pmax), set(hMax, 'XData', NaN, 'YData', NaN); else, set(hMax, 'XData', f/1e6, 'YData', Pmax); end
        axS.XLim = [f(1) f(end)]/1e6;
        if S.sweep
            title(axS, sprintf('Sweep %.1f - %.1f MHz', f(1)/1e6, f(end)/1e6));
        else
            title(axS, sprintf('Center %.4f MHz, span %.2f MHz', S.fc/1e6, S.fs/1e6));
        end
        applyY();
    end

    function applyY()
        switch ui.ylim.Value
            case 'Auto'
                P = S.P(isfinite(S.P)); if isempty(P), return, end
                axS.YLim = [prctile_(P, 2) - 5, max(P) + 8];
            otherwise
                v = sscanf(strrep(ui.ylim.Value, '..', ' '), '%f'); axS.YLim = v(:).';
        end
    end

    function status(fs, N, avg, rbw, info, nSweep)
        if nargin < 6, nSweep = 0; end
        warn = '';
        if info.clipFraction > 1e-4 || info.peakDbfs > -1, warn = '  <<< ADC CLIPPING: lower the gain'; end
        if info.peakDbfs < -45, warn = '  <<< weak: raise the gain'; end
        gs = ternary(isnan(info.gain), 'AGC', sprintf('%g dB', info.gain));
        l1 = sprintf('Span %.3f MHz | RBW %.2f kHz (1.5 fs/N) | bin %.2f kHz | capture %.2f ms x %d avg | gain %s', ...
            fs/1e6, rbw/1e3, fs/N/1e3, N/fs*1e3, avg, gs);
        l2 = sprintf('ADC peak %.1f dBFS | clipped %.2f%% | overflows %d%s%s', info.peakDbfs, 100*info.clipFraction, ...
            S.overflows + info.overflow, ternary(nSweep > 0, sprintf(' | sweep of %d captures', nSweep), ''), warn);
        ui.info.Value = {l1; l2};
        ui.info.FontColor = ternary(isempty(warn), [0 0 0], [0.75 0.1 0.1]);
    end

% ---------------- measurement ----------------
    function onClick(~, ~)
        cp = axS.CurrentPoint; measureAt(cp(1,1));
    end

    function r = measureAt(fMHz, recenter)
        if nargin < 2, recenter = true; end
        r = [];
        if isempty(S.f), return, end
        ok = isfinite(S.P);
        search = ternary(recenter, max(3*(S.f(2) - S.f(1)), 0.01*(S.f(end) - S.f(1))), 2*(S.f(2) - S.f(1)));
        r = sdr_measure_bw(S.f(ok), S.P(ok), fMHz*1e6, search);
        S.meas = r; S.fMark = r.fPeak;
        redrawMeas();
    end

    function redrawMeas()
        delete(hMeas); hMeas = gobjects(0);
        r = S.meas; if isempty(r), return, end
        j = find(r.levels == -sscanf(ui.lvl.Value, '%f'));
        lv = r.pPeak - r.levels(j);
        hMeas(end+1) = plot(axS, r.fPeak/1e6, r.pPeak, 'v', 'MarkerSize', 9, 'MarkerFaceColor', [0.8 0.1 0.1], 'Color', [0.8 0.1 0.1], 'HitTest', 'off');
        if ~isnan(r.bw(j))
            hMeas(end+1) = plot(axS, r.edges(j,:)/1e6, [lv lv], '-', 'Color', [0.8 0.1 0.1], 'LineWidth', 1.6, 'HitTest', 'off');
        end
        hMeas(end+1) = xline(axS, r.obwEdges(1)/1e6, ':', 'Color', [0.18 0.62 0.36], 'LineWidth', 1.4, 'HitTest', 'off');
        hMeas(end+1) = xline(axS, r.obwEdges(2)/1e6, ':', 'Color', [0.18 0.62 0.36], 'LineWidth', 1.4, 'HitTest', 'off');
        hMeas(end+1) = yline(axS, r.floor, '--', 'noise floor', 'Color', [0.5 0.5 0.5], 'HitTest', 'off', 'LabelHorizontalAlignment', 'left');
        if ~r.isSignal
            hMeas(end+1) = text(axS, 0.01, 0.98, sprintf('%.4f MHz: looks like noise, no clear signal here (%.1f dB above floor)', r.fPeak/1e6, r.snr), ...
                'Units', 'normalized', 'VerticalAlignment', 'top', 'FontName', 'Menlo', 'FontSize', 11, ...
                'BackgroundColor', [1 1 1 0.85], 'EdgeColor', [0.8 0.8 0.8], 'HitTest', 'off');
            return
        end
        txt = sprintf(['%.4f MHz   %.1f dBFS   SNR %.1f dB\n' ...
            '-3 dB: %s   -6 dB: %s\n-20 dB: %s   -26 dB: %s\n99%% power (green): %s'], ...
            r.fPeak/1e6, r.pPeak, r.snr, bwStr(r.bw(1)), bwStr(r.bw(2)), bwStr(r.bw(3)), bwStr(r.bw(4)), bwStr(r.obw));
        hMeas(end+1) = text(axS, 0.01, 0.98, txt, 'Units', 'normalized', 'VerticalAlignment', 'top', ...
            'FontName', 'Menlo', 'FontSize', 11, 'BackgroundColor', [1 1 1 0.85], 'EdgeColor', [0.8 0.8 0.8], 'HitTest', 'off');
    end

    function s = bwStr(b)
        if isnan(b), s = '  -  '; elseif b >= 1e6, s = sprintf('%.2f MHz', b/1e6); else, s = sprintf('%.1f kHz', b/1e3); end
    end

% ---------------- actions ----------------
    function listen()
        f = S.fMark; if isnan(f), f = ui.fc.Value*1e6; end
        if f < 87e6 || f > 108.5e6
            uialert(fig, 'Click on an FM broadcast station (87.5-108 MHz) first.', 'Listen FM'); return
        end
        wasRunning = ui.run.Value; if wasRunning, stop(tmr); end
        d = uiprogressdlg(fig, 'Title', 'Listen FM', 'Message', sprintf('Receiving %.2f MHz for 4 s ...', f/1e6), 'Indeterminate', 'on');
        sdr_fm_listen(f, 'Source', src, 'Seconds', 4, 'GainMode', ui.gm.Value, 'Gain', ui.gain.Value);
        close(d);
        if wasRunning, start(tmr); end
    end

    function savePng()
        [fn, pth] = uiputfile('*.png', 'Save the window as PNG', sprintf('spectrum_%s.png', datestr(now, 'HHMMSS'))); %#ok<TNOW1,DATST>
        if isequal(fn, 0), return, end
        exportapp(fig, fullfile(pth, fn));
    end

    function saveIq()
        if isempty(S.x), uialert(fig, 'Make a single capture first (not a sweep).', 'Save I/Q'); return, end
        [fn, pth] = uiputfile('*.mat', 'Save I/Q samples', sprintf('iq_%.3fMHz.mat', S.fc/1e6));
        if isequal(fn, 0), return, end
        iq = S.x; fc = S.fc; fs = S.fs; gainMode = ui.gm.Value; gain = ui.gain.Value; when = datetime('now'); %#ok<NASGU>
        save(fullfile(pth, fn), 'iq', 'fc', 'fs', 'gainMode', 'gain', 'when');
    end

% ---------------- callbacks ----------------
    function onRun(b, ~)
        if b.Value, b.Text = 'Stop'; start(tmr); else, stop(tmr); b.Text = 'Run (live)'; end
    end

    function onParam(~, ~)
        ui.preset.Value = 'Custom'; params(); clearMax();
        if ~ui.run.Value, safe(@acquire); end
    end

    function onPreset(~, ev)
        k = find(strcmp(PRESETS(:,1), ev.Value)); if isempty(k) || k == 1, return, end
        P = PRESETS(k,:);
        ui.fc.Value = P{2}; ui.fs.Value = string(P{3}); ui.nfft.Value = string(P{4});
        ui.gm.Value = 'Manual'; ui.gain.Value = P{6};
        S.fMark = NaN; S.meas = []; redrawMeas(); clearMax();
        if isempty(P{5})
            if ~ui.run.Value, safe(@acquire); end
        else
            ui.s1.Value = P{5}(1); ui.s2.Value = P{5}(2);
            if ~ui.run.Value, safe(@() sweep(true)); end
        end
    end

    function onSource(dd, ~)
        wasRunning = ui.run.Value; if wasRunning, stop(tmr); end
        src.release();
        if strcmp(dd.Value, 'ADALM-Pluto')
            try
                if exist('findPlutoRadio', 'file')
                    r = findPlutoRadio; if isempty(r), error('No ADALM-Pluto found on USB.'); end
                end
                src = sdr_source('pluto', 'usb:0');
            catch err
                dd.Value = 'Simulator'; src = sdr_source('sim');
                uialert(fig, err.message, 'ADALM-Pluto'); return
            end
        else
            src = sdr_source('sim');
        end
        S.overflows = 0;
        if wasRunning, start(tmr); else, safe(@acquire); end
    end

    function setParam(name, value)
        switch name
            case 'fc', ui.fc.Value = value;
            case 'fs', ui.fs.Value = string(value);
            case 'nfft', ui.nfft.Value = string(value);
            case 'avg', ui.avg.Value = value;
            case 'gain', ui.gm.Value = 'Manual'; ui.gain.Value = value;
            case 'gainMode', ui.gm.Value = value;
            case 'maxhold', ui.max.Value = value;
            case 'level', ui.lvl.Value = value; redrawMeas();
            case 'sweep', ui.s1.Value = value(1); ui.s2.Value = value(2);
            case 'preset', ui.preset.Value = value; onPreset([], struct('Value', value));
            case 'lower', ui.lower.Value = value; drawLower();
            case 'mode', ui.mode.Value = value;
        end
    end

    function clearMax(), S.maxP = []; end
    function setBusy(v), S.busy = v; end

    function safe(fn)
        try
            fn();
        catch err
            if ui.run.Value, ui.run.Value = false; stop(tmr); ui.run.Text = 'Run (live)'; end
            if isvalid(fig), uialert(fig, err.message, 'Error'); else, rethrow(err); end
        end
    end

% ---------------- layout helpers ----------------
    function c = add(label, ctrl)
        row = row + 1;
        if isempty(label)
            c = ctrl; c.Layout.Row = row; c.Layout.Column = [1 2];
        else
            lb = uilabel(L, 'Text', label); lb.Layout.Row = row; lb.Layout.Column = 1;
            c = ctrl; c.Layout.Row = row; c.Layout.Column = 2;
        end
    end
    function h = head(txt)
        h = add('', uilabel(L, 'Text', txt, 'FontWeight', 'bold', 'FontColor', [0.08 0.19 0.35]));
    end

    function onClose(~, ~)
        try, stop(tmr); delete(tmr); catch, end
        try, src.release(); catch, end
        delete(fig);
    end
end

function v = ternary(c, a, b)
if c, v = a; else, v = b; end
end

function q = prctile_(v, p)
v = sort(v(isfinite(v))); q = v(max(1, round(p/100*numel(v))));
end
