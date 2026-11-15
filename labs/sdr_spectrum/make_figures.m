%% make_figures - figures for the online guide (run from this folder)
% Uses only the simulator, so the figures are reproducible.
% Communication Lab - JCT
here = fileparts(mfilename('fullpath')); if isempty(here), here = pwd; end
src = sdr_source('sim');

%% gallery: spectrum shapes of analog and digital signals
S = { 'FM broadcast (analog)',       99.0e6,    0.96e6, 8192, 30, 'analog', 64
      'Airband AM voice (analog)',   118.7e6,   0.12e6, 4096, 50, 'analog', 64
      'PMR446 narrow FM (analog)',   446.05625e6, 0.06e6, 2048, 50, 'analog', 64
      'LTE 20 MHz (digital OFDM)',   1815e6,    61.44e6, 4096, 55, 'digital', 32
      'Wi-Fi 20 MHz (digital OFDM)', 2412e6,    61.44e6, 4096, 30, 'digital', 32
      'ADS-B 1090 MHz (digital pulses)', 1090e6, 20e6,  2048, 45, 'pulses', 256 };
fig = figure('Color', 'w', 'Position', [50 50 1300 700]);
tl = tiledlayout(fig, 2, 3, 'TileSpacing', 'compact', 'Padding', 'compact');
for k = 1:size(S,1)
    [name, f0, fs, N, g, kind, avg] = S{k,:};
    off = 0.2*fs*~strcmp(kind, 'digital');            % offset tuning: keep the DC spike away
    fc = f0 - off;
    best = []; bestE = -Inf;
    for rep = 1:40                                     % bursty signals: keep a capture where it is on
        x = src.get(fc, fs, N*avg, 'Manual', g);
        [f, P] = sdr_psd(x, fs, N, fc);
        e = max(P(abs(f - f0) < 0.1*fs));
        if e > bestE, bestE = e; best = {f, P}; end
        if k == 1 || k == 4, break, end            % FM and LTE are always on
    end
    [f, P] = best{:};
    r = sdr_measure_bw(f, P, f0, 0.05*fs);
    u = 1e3; un = 'kHz'; if fs > 5e6, u = 1e6; un = 'MHz'; end
    ax = nexttile; plot(ax, (f - f0)/u, P, 'Color', ternary(strcmp(kind, 'analog'), [0.12 0.37 0.66], [0.85 0.4 0.1])); grid on; hold on
    xline(ax, (r.obwEdges - f0)/u, ':', 'Color', [0.18 0.62 0.36], 'LineWidth', 1.5);
    xlim(ax, [-0.19 0.19]*fs/u);
    title(ax, name); xlabel(ax, ['Offset from the signal [' un ']']); ylabel(ax, 'dBFS/bin');
    if isnan(r.bw(4)), s = sprintf('99%%: %s', fmtHz(r.obw));
    else, s = sprintf('99%%: %s\n-26 dB: %s', fmtHz(r.obw), fmtHz(r.bw(4))); end
    text(ax, 0.03, 0.95, s, 'Units', 'normalized', 'VerticalAlignment', 'top', 'BackgroundColor', 'w', 'FontWeight', 'bold');
end
title(tl, 'Spectrum shapes: analog (blue) changes with the content; digital (orange) is a fixed "block" or pulse shape');
exportgraphics(fig, fullfile(here, 'shapes.png'), 'Resolution', 110); close(fig);

%% FM receiver output (RF, MPX, audio)
o = sdr_fm_listen(99.0e6, 'Play', false); %#ok<NASGU>
exportgraphics(gcf, fullfile(here, 'fm_listen.png'), 'Resolution', 100); close(gcf);

%% GUI screenshots
app = sdr_spectrum_explorer('Visible', 'on');
app.set('preset', 'FM - one station'); for k = 1:60, app.single(); end
app.measure(99.0); drawnow; exportapp(app.fig, fullfile(here, 'gui_station.png'));
app.set('preset', 'FM broadcast 87.5-108 MHz (sweep)'); app.measure(99.0); drawnow;
exportapp(app.fig, fullfile(here, 'gui_band.png'));
app.set('preset', 'ADS-B aircraft 1090 MHz'); app.set('avg', 1); app.set('lower', 'Time: envelope |x|');
for k = 1:30, app.single(); s = app.state(); if max(abs(s.x)) > 0.3, break, end, end
drawnow; exportapp(app.fig, fullfile(here, 'gui_adsb.png'));
app.close();

function v = ternary(c, a, b), if c, v = a; else, v = b; end, end
function s = fmtHz(b), if b >= 1e6, s = sprintf('%.1f MHz', b/1e6); else, s = sprintf('%.1f kHz', b/1e3); end, end
