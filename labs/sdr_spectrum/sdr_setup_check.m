%% SDR lab - step 0: check the computer and the ADALM-Pluto
% Communication Lab - JCT
% Run this first. It checks, one by one, everything the lab needs and tells
% you what to fix. Takes about 30 seconds.

fprintf('\n=== SDR lab setup check ===\n');
ok = true;

% 1. MATLAB version (uifigure apps need R2021a or newer)
v = ver('MATLAB');
fprintf('1. MATLAB %s ... ', v.Version);
if verLessThan('matlab', '9.10'), fprintf('too old, need R2021a+\n'); ok = false; else, fprintf('OK\n'); end %#ok<VERLESSMATLAB>

% 2. Communications Toolbox and the Pluto support package
fprintf('2. Communications Toolbox ... ');
if isempty(ver('comm')), fprintf('MISSING (simulator still works)\n'); ok = false; else, fprintf('OK\n'); end
fprintf('3. ADALM-Pluto support package ... ');
if exist('comm.SDRRxPluto', 'class') ~= 8
    fprintf(['MISSING\n   Install: Home > Add-Ons > search "ADALM-Pluto" >\n' ...
             '   "Communications Toolbox Support Package for Analog Devices ADALM-Pluto Radio"\n']);
    ok = false;
else
    fprintf('OK\n');
end

% 3. the radio itself
radio = [];
if exist('findPlutoRadio', 'file')
    fprintf('4. Looking for a Pluto on USB ... ');
    radio = findPlutoRadio;
    if isempty(radio)
        fprintf(['NOT FOUND\n   - use the micro-USB port marked with the USB symbol (not "PWR only")\n' ...
                 '   - use a data cable (some cables only charge)\n' ...
                 '   - wait ~20 s after plugging in: LED1 must blink\n' ...
                 '   - a drive called PlutoSDR should appear on the computer\n']);
        ok = false;
    else
        fprintf('found %s (serial %s)\n', radio(1).RadioID, radio(1).SerialNum);
    end
end

% 4. a test capture, and the frequency range (AD9363 vs AD9364 mode)
if ~isempty(radio)
    try
        rx = comm.SDRRxPluto('RadioID', radio(1).RadioID, 'CenterFrequency', 433.92e6, ...
            'BasebandSampleRate', 1e6, 'SamplesPerFrame', 4096, 'OutputDataType', 'single');
        x = rx(); x = rx(); release(rx);
        fprintf('5. Test capture at 433.92 MHz ... OK (peak %.1f dBFS)\n', 20*log10(max(abs(x)) + eps));
    catch err
        fprintf('5. Test capture FAILED: %s\n', err.message); ok = false;
    end
    try
        rx = comm.SDRRxPluto('RadioID', radio(1).RadioID, 'CenterFrequency', 99e6, ...
            'BasebandSampleRate', 1e6, 'SamplesPerFrame', 4096, 'OutputDataType', 'single');
        x = rx(); release(rx); %#ok<NASGU>
        fprintf('6. FM band (99 MHz) ... OK - the radio is in AD9364 mode (70 MHz - 6 GHz)\n');
    catch
        fprintf(['6. FM band (99 MHz) ... NOT AVAILABLE: the radio is in AD9363 mode (325 MHz - 3.8 GHz).\n' ...
                 '   Instructor, once per radio: configurePlutoRadio(''AD9364'')  (the radio reboots)\n']);
        ok = false;
    end
end

% 5. the lab files
fprintf('7. Lab files ... ');
need = {'sdr_source', 'sdr_sim_band', 'sdr_psd', 'sdr_measure_bw', 'sdr_spectrum_explorer', 'sdr_fm_listen'};
miss = need(cellfun(@(f) exist(f, 'file') == 0, need));
if isempty(miss), fprintf('OK\n'); else, fprintf('missing: %s (unzip all files into one folder)\n', strjoin(miss, ', ')); ok = false; end

if ok
    fprintf('\nAll good. Next: sdr_lab1_first_steps\n\n');
else
    fprintf('\nFix the items above. Without a radio you can still run everything with the simulator.\n\n');
end
