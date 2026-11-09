%% Lab 3 - report graphs: Figure 6 (power split) and Figure 10 (phase)
% Communication Lab 130661 - JCT
% Reads the two tables downloaded from the online guide and draws the
% measurement against theory. Without files it runs on example numbers.
%
% Usage:  lab03_report_plots                               % example data
%         lab03_report_plots('am_power.csv', 'am_phase.csv') % your tables
%
% The figures are saved as fig06_power.png and fig10_phase.png (300 dpi).

function lab03_report_plots(powerFile, phaseFile)
if nargin < 1, powerFile = ''; end
if nargin < 2, phaseFile = ''; end

%% Table 1: line voltages at each depth -> power fraction in the sidebands
if isempty(powerFile)
    depth = [30 50 70 100];                      % example: theory plus small errors
    ka = depth/100;
    Vc = 0.70*ones(size(ka));  Vs = 0.70*ka/2 .* [1.03 0.98 1.02 0.97];
    left = Vs; center = Vc; right = Vs;
    src1 = 'example data';
else
    T = readmatrix(powerFile, 'NumHeaderLines', 1);  % depth, left, center, right, ...
    T = T(all(isfinite(T(:,1:4)), 2), :);
    depth = T(:,1).'; left = T(:,2).'; center = T(:,3).'; right = T(:,4).';
    src1 = powerFile;
end
Pinfo = 100*(left.^2 + right.^2) ./ (left.^2 + center.^2 + right.^2);
k = linspace(0, 1, 201);
Ptheory = 100*k.^2 ./ (2 + k.^2);
Pexp = 100*(depth/100).^2 ./ (2 + (depth/100).^2);

f6 = figure('Name', 'Figure 6', 'Color', 'w', 'Position', [100 100 640 420]);
plot(100*k, Ptheory, 'LineWidth', 1.8); hold on
plot(depth, Pinfo, 'o', 'MarkerSize', 8, 'LineWidth', 1.6, 'MarkerFaceColor', [0.91 0.54 0.17], 'Color', [0.91 0.54 0.17]);
for i = 1:numel(depth)
    text(depth(i), Pinfo(i) + 1.6, sprintf('%.1f%%', Pinfo(i)), 'HorizontalAlignment', 'center');
end
grid on; xlim([0 105]); ylim([0 40]);
xlabel('Modulation depth k_a [%]'); ylabel('Power in the sidebands [%]');
title('Figure 6 - Power fraction in the sidebands vs. depth');
legend('Theory  \eta = k_a^2/(2+k_a^2)', 'Measured (Table 1)', 'Location', 'northwest');
subtitle(['Source: ' strrep(src1, '_', '\_')]);

fprintf('\nTable 1 - power in the sidebands\n  depth   measured   theory   error\n');
fprintf('  %3d%%    %6.2f%%   %6.2f%%  %+6.1f%%\n', [depth; Pinfo; Pexp; 100*(Pinfo - Pexp)./Pexp]);

%% Table 2: recovered amplitude at each LO phase -> compare with cos(phi)
if isempty(phaseFile)
    phi = [0 30 60 90];
    amp = 0.120*cosd(phi) + [0 0.003 -0.002 0.004];  % example: Vpp
    src2 = 'example data';
else
    T = readmatrix(phaseFile, 'NumHeaderLines', 1); % phase, amp, ...
    T = T(all(isfinite(T(:,1:2)), 2), :);
    phi = T(:,1).'; amp = T(:,2).';
    src2 = phaseFile;
end
nrm = amp / amp(phi == 0);
p = linspace(0, 90, 181);

f10 = figure('Name', 'Figure 10', 'Color', 'w', 'Position', [760 100 640 420]);
plot(p, cosd(p), 'LineWidth', 1.8); hold on
plot(phi, nrm, 's', 'MarkerSize', 8, 'LineWidth', 1.6, 'MarkerFaceColor', [0.91 0.54 0.17], 'Color', [0.91 0.54 0.17]);
grid on; xlim([-3 93]); ylim([-0.05 1.15]); xticks(0:15:90);
xlabel('LO phase \phi [deg]'); ylabel('Message amplitude / amplitude at 0^\circ');
title('Figure 10 - Recovered message vs. LO phase');
legend('Theory  cos\phi', 'Measured (Table 2)', 'Location', 'southwest');
subtitle(['Source: ' strrep(src2, '_', '\_')]);

fprintf('\nTable 2 - normalized amplitude\n  phase   measured   cos(phi)\n');
fprintf('  %3d°    %6.3f     %6.3f\n', [phi; nrm; cosd(phi)]);

%% save for the report
exportgraphics(f6,  'fig06_power.png', 'Resolution', 300);
exportgraphics(f10, 'fig10_phase.png', 'Resolution', 300);
fprintf('\nSaved fig06_power.png and fig10_phase.png\n');
end
