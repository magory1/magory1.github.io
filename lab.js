/*
 * המעבדה: מעבדת SDR, קורס ידע כללי ב-RF ונושאים לשיתוף פעולה.
 * שדות עם הסיומת _en הם הגרסה האנגלית.
 */

window.LAB = {
  name: "מעבדת תקשורת, RF ומכ״ם",
  name_en: "Communication, RF & Radar Lab",
  inst: "המרכז האקדמי לב (JCT) – מכון לב, ירושלים",
  inst_en: "Jerusalem College of Technology (JCT) – Lev Academic Center, Jerusalem",
  inst_short: "JCT · מכון לב",
  inst_short_en: "JCT · Lev Academic Center",
  logo: "",          // לוגו רשמי: שמים את הקובץ ב-img/ וכותבים כאן את הנתיב, למשל "img/jct-logo.png"
  vision: [
    "המטרה: לבנות במכון לב מעבדה פתוחה לתקשורת, RF ומכ״ם, שבה סטודנטים לומדים על ציוד אמיתי – מהאות הראשון ועד מערכת עובדת.",
    "המעבדה משלבת הוראה, פרויקטי גמר ומחקר: אותם כלים משמשים בתרגילי הקורס, בפרויקטים של הסטודנטים ובמחקר במכ״ם mmWave.",
  ],
  vision_en: [
    "The goal: to build an open communication, RF and radar lab at JCT, where students learn on real hardware – from the first signal to a working system.",
    "The lab connects teaching, final-year projects and research: the same tools are used in course labs, in student projects and in mmWave radar research.",
  ],
  equipment: [
    { he: "ADALM-Pluto SDR (Analog Devices) – משדר-מקלט 325 MHz עד 3.8 GHz", en: "ADALM-Pluto SDR (Analog Devices) – 325 MHz to 3.8 GHz transceiver" },
    { he: "מכ״ם TI IWR1843BOOST + DCA1000 – FMCW בתדר 77 GHz", en: "TI IWR1843BOOST + DCA1000 – 77 GHz FMCW radar" },
    { he: "אוסצילוסקופים, מחוללי אותות וציוד מעבדה בסיסי", en: "Oscilloscopes, signal generators and basic lab instruments" },
  ],
};

/*
 * ניסויי SDR. הקוד נמצא בתיקייה sdr/, והגרפים ב-sdr/figures/.
 * hw: תוצאות מהחומרה – יתעדכן אחרי ההרצה על ה-Pluto במעבדה.
 */
window.SDR_LABS = [
  {
    id: "tone", file: "lab01_tone_spectrum.py", fig: "lab01_tone_spectrum.png", tags: ["sdr", "fourier", "qam"],
    title: "ניסוי 1 – אות ראשון: טון מרוכב, ספקטרום ופגמי I/Q",
    title_en: "Lab 1 – First signal: complex tone, spectrum and I/Q impairments",
    theory: [
      "ה-SDR עובד עם אות מרוכב בפס הבסיס: x[n] = I[n] + jQ[n]. טון מרוכב exp(j2πf₀n/fs) מופיע בספקטרום כקו אחד בתדר +f₀ בלבד – בניגוד לקוסינוס ממשי, שמופיע ב-±f₀.",
      "מקלט אמיתי לא מושלם: דליפת מתנד (LO) יוצרת קו ב-DC, וחוסר איזון בין הענפים I ו-Q (הגבר ופאזה) יוצר \"תמונה\" ב-−f₀. היחס בין האות לתמונה נקרא IRR (Image Rejection Ratio).",
    ],
    theory_en: [
      "An SDR works with a complex baseband signal: x[n] = I[n] + jQ[n]. A complex tone exp(j2πf₀n/fs) appears as a single line at +f₀ only – unlike a real cosine, which appears at ±f₀.",
      "A real receiver is imperfect: LO leakage creates a line at DC, and gain/phase imbalance between the I and Q branches creates an \"image\" at −f₀. The signal-to-image ratio is the IRR (Image Rejection Ratio).",
    ],
    tasks: [
      "שנו את f₀ ואת קצב הדגימה. מה קורה כש-f₀ עובר את fs/2?",
      "הגדילו את חוסר האיזון (--iq-gain, --iq-phase) ומדדו את ה-IRR. השוו לנוסחה IRR ≈ 4/(ε² + φ²).",
      "על ה-Pluto: מדדו את ה-IRR ואת קו ה-DC בכמה תדרי נושא. האם התיקון העיוור בקוד עובד גם על החומרה?",
      "הסבירו מדוע מישור ה-I/Q של טון אידאלי הוא מעגל, ומה הופך אותו לאליפסה.",
    ],
    tasks_en: [
      "Change f₀ and the sample rate. What happens when f₀ goes above fs/2?",
      "Increase the imbalance (--iq-gain, --iq-phase) and measure the IRR. Compare with IRR ≈ 4/(ε² + φ²).",
      "On the Pluto: measure the IRR and the DC line at several carrier frequencies. Does the blind correction in the code work on hardware too?",
      "Explain why the I/Q plot of an ideal tone is a circle, and what turns it into an ellipse.",
    ],
    sim: "IRR של 28 dB לפני התיקון ו-57 dB אחריו (0.5 dB ו-3° חוסר איזון).",
    sim_en: "IRR of 28 dB before correction and 57 dB after (0.5 dB, 3° imbalance).",
  },
  {
    id: "amfm", file: "lab02_am_fm.py", fig: "lab02_am_fm.png", tags: ["sdr", "am", "fm"],
    title: "ניסוי 2 – אפנון אנלוגי: AM ו-FM, שידור וגילוי",
    title_en: "Lab 2 – Analog modulation: AM and FM, transmit and demodulate",
    theory: [
      "AM: האות בפס הבסיס הוא 1 + μ·m(t). גלאי מעטפה פשוט – |y| – משחזר את ההודעה, והוא לא רגיש לפאזת הנושא.",
      "FM: המידע נמצא בתדר הרגעי. האות הוא exp(j2πk_f∫m). הגלאי הדיגיטלי מחשב את הפרש הפאזה בין דגימות סמוכות: angle(y[n]·y*[n−1]). רוחב הסרט לפי כלל קרסון: B ≈ 2(Δf + f_m).",
    ],
    theory_en: [
      "AM: the baseband signal is 1 + μ·m(t). A simple envelope detector – |y| – recovers the message and does not care about the carrier phase.",
      "FM: the information is in the instantaneous frequency. The signal is exp(j2πk_f∫m). The digital discriminator computes the phase difference between adjacent samples: angle(y[n]·y*[n−1]). Bandwidth by Carson's rule: B ≈ 2(Δf + f_m).",
    ],
    tasks: [
      "שנו את μ מעל 1 (אפנון יתר). מה קורה לגלאי המעטפה?",
      "שנו את k_f ומדדו את רוחב הסרט. השוו לכלל קרסון.",
      "הורידו את ה-SNR ומצאו את סף ה-FM: מתחת ל-SNR מסוים, איכות ה-FM צונחת מהר יותר מזו של AM. למה?",
      "על ה-Pluto: הקליטו תחנת FM אמיתית (--broadcast 99.0e6) ושמעו את קובץ ה-WAV.",
    ],
    tasks_en: [
      "Set μ above 1 (overmodulation). What happens to the envelope detector?",
      "Change k_f and measure the bandwidth. Compare with Carson's rule.",
      "Lower the SNR and find the FM threshold: below some SNR, FM quality drops faster than AM. Why?",
      "On the Pluto: record a real FM station (--broadcast 99.0e6) and listen to the WAV file.",
    ],
    sim: "SNR במוצא: AM ‏35 dB, ‏FM ‏35 dB (SNR ערוץ 30 dB). רוחב סרט FM לפי קרסון: 15 kHz.",
    sim_en: "Output SNR: AM 35 dB, FM 35 dB (channel SNR 30 dB). FM bandwidth by Carson: 15 kHz.",
  },
  {
    id: "digital", file: "lab03_digital_mod.py", fig: "lab03_digital_mod_16qam.png", tags: ["sdr", "digital", "matched", "qam"],
    title: "ניסוי 3 – אפנון דיגיטלי: עיצוב פולסים, מסנן מתואם ו-BER",
    title_en: "Lab 3 – Digital modulation: pulse shaping, matched filter and BER",
    theory: [
      "כל סימבול נשלח כפולס root-raised-cosine (RRC). במקלט עובר האות שוב דרך RRC – המסנן המתואם – והתוצאה היא פולס raised-cosine, שמקיים את תנאי ניקוויסט: אפס ISI ברגעי הדגימה.",
      "המסנן המתואם ממקסם את ה-SNR ברגע הדגימה: SNR = Es/N0. לכן ה-BER תלוי רק ב-Eb/N0. ל-BPSK/QPSK: ‏BER = Q(√(2Eb/N0)).",
      "המקלט המלא כולל גם סנכרון מסגרת (קורלציה עם רצף Zadoff-Chu ידוע), הערכת היסט תדר והערכת פאזה.",
    ],
    theory_en: [
      "Each symbol is sent as a root-raised-cosine (RRC) pulse. The receiver filters again with an RRC – the matched filter – and the result is a raised-cosine pulse, which satisfies the Nyquist criterion: zero ISI at the sampling instants.",
      "The matched filter maximizes the SNR at the sampling instant: SNR = Es/N0. Therefore the BER depends only on Eb/N0. For BPSK/QPSK: BER = Q(√(2Eb/N0)).",
      "The full receiver also performs frame synchronization (correlation with a known Zadoff-Chu sequence), frequency-offset estimation and phase estimation.",
    ],
    tasks: [
      "שנו את ה-roll-off ‏(--beta) בין 0.1 ל-1. איך משתנים דיאגרמת העין ורוחב הסרט?",
      "השוו BPSK, ‏QPSK ו-16-QAM באותו Eb/N0. מה המחיר של יותר ביטים לסימבול?",
      "דגמו את האות לא במרכז העין (שנו את אינדקס הדגימה בקוד). כמה רגיש ה-BER לשגיאת תזמון?",
      "על ה-Pluto: מדדו EVM כפונקציה של הגבר המשדר. מאיזה הגבר המקלט נכנס לרוויה?",
    ],
    tasks_en: [
      "Change the roll-off (--beta) between 0.1 and 1. How do the eye diagram and the bandwidth change?",
      "Compare BPSK, QPSK and 16-QAM at the same Eb/N0. What is the price of more bits per symbol?",
      "Sample away from the eye center (change the sampling index in the code). How sensitive is the BER to timing error?",
      "On the Pluto: measure EVM versus TX gain. At what gain does the receiver saturate?",
    ],
    sim: "עקומת ה-BER של המקלט המלא מתלכדת עם התאוריה, גם ל-QPSK וגם ל-16-QAM. ‏EVM של 4.7% ב-16-QAM.",
    sim_en: "The BER of the full receiver matches theory for both QPSK and 16-QAM. EVM of 4.7% for 16-QAM.",
  },
  {
    id: "sync", file: "lab04_carrier_sync.py", fig: "lab04_carrier_sync.png", tags: ["sdr", "pll", "qam"],
    title: "ניסוי 4 – סנכרון נושא: היסט תדר ו-PLL דיגיטלי",
    title_en: "Lab 4 – Carrier synchronization: frequency offset and a digital PLL",
    theory: [
      "שני מתנדים אף פעם לא זהים. היסט תדר Δf מסובב את הקונסטלציה ב-2πΔf·Ts בכל סימבול, והיא הופכת לטבעת.",
      "שלב 1 – הערכה גסה: משווים בין שני עותקים זהים של הפריאמבל. הפאזה ביניהם נותנת את Δf.",
      "שלב 2 – עקיבה: PLL מונחה החלטות (לולאת Costas). גלאי הפאזה הוא e = Im{y·d*}, ומסנן לולאה PI מזין NCO. זה אותו PLL מקורס התקשורת – רק דיגיטלי.",
    ],
    theory_en: [
      "Two oscillators are never identical. A frequency offset Δf rotates the constellation by 2πΔf·Ts every symbol, turning it into a ring.",
      "Step 1 – coarse estimate: compare two identical preamble copies. The phase between them gives Δf.",
      "Step 2 – tracking: a decision-directed PLL (Costas loop). The phase detector is e = Im{y·d*}, and a PI loop filter drives an NCO. It is the same PLL as in the communication course – only digital.",
    ],
    tasks: [
      "מה ההיסט המקסימלי שההערכה הגסה יכולה למדוד? בדקו בניסוי (--cfo) והסבירו מהנוסחה.",
      "שנו את רוחב הסרט של הלולאה (--bn). מה ההבדל בין לולאה צרה לרחבה, ברעש ובמהירות הנעילה?",
      "הגדילו את רעש הפאזה של המתנד (--phase-noise). מתי ה-PLL מאבד נעילה (cycle slip)?",
      "על ה-Pluto: כוונו את ה-TX וה-RX לתדרים שונים ובדקו שהמקלט ננעל.",
    ],
    tasks_en: [
      "What is the largest offset the coarse estimator can measure? Test it (--cfo) and explain from the formula.",
      "Change the loop bandwidth (--bn). What is the difference between a narrow and a wide loop, in noise and in lock speed?",
      "Increase the oscillator phase noise (--phase-noise). When does the PLL lose lock (cycle slip)?",
      "On the Pluto: tune TX and RX to different frequencies and check that the receiver locks.",
    ],
    sim: "היסט של 700 Hz מוערך כ-700.4 Hz. עם הערכה גסה בלבד ה-BER הוא 0.31 בגלל רעש פאזה. עם PLL ה-BER הוא 0.",
    sim_en: "A 700 Hz offset is estimated as 700.4 Hz. With the coarse estimate alone the BER is 0.31 because of phase noise. With the PLL the BER is 0.",
  },
  {
    id: "link", file: "lab05_text_link_coding.py", fig: "lab05_text_link_coding.png", tags: ["sdr", "channelcoding", "linearcodes"],
    title: "ניסוי 5 – קישור שלם: שליחת הודעת טקסט וקידוד ערוץ",
    title_en: "Lab 5 – A complete link: sending a text message with channel coding",
    theory: [
      "מחברים את הכול: טקסט → ביטים → קוד Hamming(7,4) → QPSK → מסגרת → רדיו, ובחזרה. זה הגשר בין הקורס בתורת האינפורמציה לרדיו אמיתי.",
      "קוד Hamming(7,4) מוסיף 3 ביטי זוגיות לכל 4 ביטי מידע ומתקן כל שגיאה בודדת במילה, בעזרת הסינדרום s = H·r. המחיר: קצב 4/7, ולכן בהשוואה הוגנת לכל ביט מועבר יש פחות אנרגיה (Ec = 4/7·Eb).",
    ],
    theory_en: [
      "Everything comes together: text → bits → Hamming(7,4) code → QPSK → frame → radio, and back. This is the bridge between the information theory course and a real radio.",
      "The Hamming(7,4) code adds 3 parity bits to every 4 information bits and corrects any single error in a word using the syndrome s = H·r. The price: rate 4/7, so in a fair comparison each transmitted bit has less energy (Ec = 4/7·Eb).",
    ],
    tasks: [
      "שלחו הודעה משלכם והחלישו את הקישור עד שמופיעות שגיאות. כמה מהן הקוד מתקן?",
      "מדוע ב-Eb/N0 נמוך הקוד דווקא מזיק? מהי \"נקודת החצייה\" בגרף?",
      "חשבו את הקיבולת של ערוץ BSC עם הסתברות השגיאה שמדדתם, והשוו לקצב 4/7.",
      "אתגר: החליפו את Hamming בקוד חזק יותר (קוד קונבולוציה עם Viterbi) ומדדו את רווח הקידוד.",
    ],
    tasks_en: [
      "Send your own message and weaken the link until errors appear. How many does the code correct?",
      "Why does the code actually hurt at low Eb/N0? Where is the crossover point in the plot?",
      "Compute the capacity of a BSC with the error probability you measured, and compare it with rate 4/7.",
      "Challenge: replace Hamming with a stronger code (a convolutional code with Viterbi decoding) and measure the coding gain.",
    ],
    sim: "באותו הספק שידור: 7 שגיאות בטקסט ללא קידוד, 0 שגיאות עם Hamming. באותו Eb/N0 הרווח קטן – כ-0.5 dB ב-BER של ‎10⁻⁵‎.",
    sim_en: "At the same transmit power: 7 errors in the text uncoded, 0 with Hamming. At equal Eb/N0 the gain is small – about 0.5 dB at a BER of 10⁻⁵.",
  },
  {
    id: "ofdm", file: "lab06_ofdm.py", fig: "lab06_ofdm.png", tags: ["sdr", "digital", "fourier"],
    title: "ניסוי 6 – OFDM: התמודדות עם ריבוי נתיבים",
    title_en: "Lab 6 – OFDM: dealing with multipath",
    theory: [
      "OFDM – הבסיס של Wi-Fi, ‏LTE ו-5G – שולח הרבה סימבולים במקביל על תת-נושאים צרים: האות בזמן הוא IFFT של הסימבולים, ולפניו קידומת מחזורית (CP).",
      "אם פיזור ההשהיות של הערוץ קצר מה-CP, כל תת-נושא רואה הגבר מרוכב אחד: Y[k] = H[k]·X[k] + W[k]. לכן האקווליזציה היא חילוק אחד לכל תת-נושא.",
      "תת-נושאים שנופלים ב\"גומה\" של הערוץ מקבלים SNR נמוך – וזו הסיבה שב-OFDM תמיד משלבים קידוד ערוץ.",
    ],
    theory_en: [
      "OFDM – the basis of Wi-Fi, LTE and 5G – sends many symbols in parallel on narrow subcarriers: the time signal is the IFFT of the symbols, preceded by a cyclic prefix (CP).",
      "If the channel delay spread is shorter than the CP, each subcarrier sees a single complex gain: Y[k] = H[k]·X[k] + W[k]. Equalization is therefore one division per subcarrier.",
      "Subcarriers that fall into a channel notch get a low SNR – which is why OFDM is always combined with channel coding.",
    ],
    tasks: [
      "קצרו את ה-CP מתחת לפיזור ההשהיות (--cp 4). מה קורה ל-EVM, ולמה?",
      "מצאו את תת-הנושאים עם ה-SNR הנמוך ביותר. איך תתכננו הקצאת ביטים (bit loading) שמתחשבת בהם?",
      "שנו את ה-CFO. מה הגבול שבו ההערכה מהאימון נכשלת? הסבירו בעזרת ריווח תת-הנושאים.",
      "על ה-Pluto: הוסיפו ערוץ ריבוי נתיבים משלכם (שנו את h בקוד) והשוו לאומדן.",
    ],
    tasks_en: [
      "Shorten the CP below the delay spread (--cp 4). What happens to the EVM, and why?",
      "Find the subcarriers with the lowest SNR. How would you design bit loading that takes them into account?",
      "Change the CFO. Where does the training-based estimate fail? Explain using the subcarrier spacing.",
      "On the Pluto: add your own multipath channel (change h in the code) and compare with the estimate.",
    ],
    sim: "אומדן הערוץ מתלכד עם הערוץ האמיתי. 16-QAM עם CP של 16: ‏BER ‏‎8.5·10⁻³‎, כמעט כולו מתת-נושא אחד בגומה של ‎−22 dB‎.",
    sim_en: "The channel estimate matches the true channel. 16-QAM with CP 16: BER 8.5·10⁻³, almost all from one subcarrier in a −22 dB notch.",
  },
  {
    id: "radar", file: "lab07_radar_chirp.py", fig: "lab07_radar_chirp.png", tags: ["sdr", "radar", "matched"],
    title: "ניסוי 7 – מכ״ם: צ׳ירפ, דחיסת פולס ומדידת טווח",
    title_en: "Lab 7 – Radar: chirps, pulse compression and range",
    theory: [
      "מכ״ם מודד את זמן ההלוך-חזור τ של ההד: R = cτ/2. פולס קצר נותן רזולוציה טובה אבל מעט אנרגיה.",
      "צ׳ירפ ליניארי (LFM) ארוך נותן את שניהם: אחרי המסנן המתואם (\"דחיסת פולס\") הרוחב הוא כ-1/B, ולכן רזולוציית הטווח היא ΔR = c/(2B). רווח הדחיסה הוא מכפלת זמן-רוחב סרט, BT.",
      "חלון (Hamming) מנמיך את האונות הצדדיות, במחיר הרחבה קלה של השיא. זו בדיוק הנקודה שבה מתחיל המחקר במכ״ם FMCW בתדר 77 GHz במעבדה.",
    ],
    theory_en: [
      "A radar measures the round-trip delay τ of an echo: R = cτ/2. A short pulse gives good resolution but little energy.",
      "A long linear chirp (LFM) gives both: after the matched filter (\"pulse compression\") the width is about 1/B, so the range resolution is ΔR = c/(2B). The compression gain is the time-bandwidth product BT.",
      "A window (Hamming) lowers the sidelobes at the cost of a slightly wider peak. This is exactly where the lab's 77 GHz FMCW radar research begins.",
    ],
    tasks: [
      "קרבו שתי מטרות (למשל 300 ו-312 מ׳). מתי אי אפשר להפריד ביניהן? השוו ל-c/(2B).",
      "השוו חלון מלבני ו-Hamming: גובה האונה הצדדית מול רוחב השיא. מתי מטרה חלשה \"נבלעת\"?",
      "הוסיפו מהירות למטרה (הזזת דופלר בכל פולס) ובנו מפת טווח-דופלר עם FFT על פני הפולסים.",
      "על ה-Pluto: מדדו את ההשהיה של הכבל עצמו. כמה מטרים \"אורכו\" במונחי מכ״ם?",
    ],
    tasks_en: [
      "Move two targets closer (e.g. 300 and 312 m). When can they no longer be separated? Compare with c/(2B).",
      "Compare a rectangular and a Hamming window: sidelobe level versus peak width. When does a weak target get \"masked\"?",
      "Give a target a velocity (a Doppler shift on each pulse) and build a range-Doppler map with an FFT across pulses.",
      "On the Pluto: measure the delay of the cable itself. How many meters \"long\" is it in radar terms?",
    ],
    sim: "B ‏= 16 MHz: רזולוציה של 9.4 מ׳ ורווח דחיסה של 29 dB. שלוש המטרות (300, 345 ו-900 מ׳) נמדדו בדיוק בטווח הנכון.",
    sim_en: "B = 16 MHz: 9.4 m resolution and 29 dB compression gain. All three targets (300, 345 and 900 m) were measured at the correct range.",
  },
];

/* קורס ידע כללי ב-RF – לכל מי שמתעניין, בלי דרישות קדם */
window.RF_COURSE = {
  title: "עולם ה-RF – קורס ידע כללי",
  title_en: "The World of RF – a general introduction",
  lead: "קורס קצר לכל מי שרוצה להבין איך עובדים רדיו, סלולר, Wi-Fi, GPS ומכ״ם – בלי מתמטיקה מסובכת. מתאים לתלמידי תיכון, לסטודנטים בתחילת הדרך ולאנשי מקצוע מתחומים אחרים.",
  lead_en: "A short course for anyone who wants to understand how radio, cellular, Wi-Fi, GPS and radar work – without heavy math. Suitable for high-school students, early-stage students and professionals from other fields.",
  modules: [
    { he: "מהו גל אלקטרומגנטי? תדר, אורך גל והספקטרום", en: "What is an electromagnetic wave? Frequency, wavelength and the spectrum",
      d: "מגלי רדיו ועד אור: למה כל מערכת יושבת בתדר אחר, ומי מחלק את הספקטרום.", d_en: "From radio waves to light: why each system uses a different frequency, and who allocates the spectrum." },
    { he: "דציבלים בלי פחד", en: "Decibels without fear",
      d: "dB, ‏dBm ו-dBi – השפה של מהנדסי RF, ואיך מחשבים תקציב קישור בראש.", d_en: "dB, dBm and dBi – the language of RF engineers, and how to do a link budget in your head." },
    { he: "אנטנות: איך מתכת קטנה משדרת לכל העולם", en: "Antennas: how a piece of metal talks to the world",
      d: "דיפול, Yagi, צלחת ומערך פאזות – הגבר, כיווניות ואורך גל.", d_en: "Dipole, Yagi, dish and phased array – gain, directivity and wavelength." },
    { he: "התפשטות גלים: מרחק, מכשולים והחזרות", en: "Propagation: distance, obstacles and reflections",
      d: "למה הקליטה נעלמת במעלית, ומה זה ריבוי נתיבים.", d_en: "Why reception disappears in an elevator, and what multipath is." },
    { he: "אפנון: איך מכניסים מידע לגל", en: "Modulation: putting information on a wave",
      d: "AM, ‏FM ואפנון דיגיטלי – מהרדיו של סבא ועד 5G.", d_en: "AM, FM and digital modulation – from grandpa's radio to 5G." },
    { he: "מבפנים: משדר ומקלט", en: "Inside a transmitter and a receiver",
      d: "מגבר, מערבל, מתנד ומסנן – אבני הבניין של כל מכשיר רדיו.", d_en: "Amplifier, mixer, oscillator and filter – the building blocks of every radio." },
    { he: "רדיו מוגדר תוכנה (SDR)", en: "Software-defined radio (SDR)",
      d: "איך מחשב ו-Pluto קטן מחליפים ארון של ציוד. הדגמה חיה.", d_en: "How a computer and a small Pluto replace a rack of equipment. Live demo." },
    { he: "סלולר, Wi-Fi ו-Bluetooth", en: "Cellular, Wi-Fi and Bluetooth",
      d: "תאים, ערוצים ו-OFDM – מה קורה כשאתם פותחים סרטון בטלפון.", d_en: "Cells, channels and OFDM – what happens when you open a video on your phone." },
    { he: "GPS ותקשורת לוויינים", en: "GPS and satellite communication",
      d: "איך אות חלש מאוד מגיע מ-20,000 ק״מ ונותן מיקום מדויק.", d_en: "How a very weak signal from 20,000 km gives an accurate position." },
    { he: "מכ״ם: לראות בעזרת גלי רדיו", en: "Radar: seeing with radio waves",
      d: "מכ״ם בכביש, במכונית ובבית – כולל מדידת נשימה ודופק ממרחק.", d_en: "Radar on the road, in cars and at home – including measuring breathing and heart rate remotely." },
    { he: "בטיחות קרינה ותקינה", en: "RF safety and regulation",
      d: "מה באמת ידוע על קרינה מסלולר, ומה מותר לשדר.", d_en: "What is actually known about radiation from phones, and what you are allowed to transmit." },
    { he: "קריירה ב-RF", en: "A career in RF",
      d: "תפקידים, חברות, ומה כדאי ללמוד כדי להיכנס לתחום.", d_en: "Roles, companies, and what to study to get into the field." },
  ],
};

/* נושאים למחקר ולשיתוף פעולה – הצעות, לעדכן */
window.COLLAB = [
  { he: "ניטור סימנים חיוניים במכ״ם mmWave", en: "Vital-sign monitoring with mmWave radar",
    d: "נשימה ודופק ללא מגע לבתי חולים, בתי אבות ורכב (זיהוי נהג עייף או ילד שנשכח).", d_en: "Contactless respiration and heart rate for hospitals, elderly care and vehicles (driver fatigue, child-presence detection).",
    who: "מכשור רפואי, רכב, TI, ‏Infineon", who_en: "Medical devices, automotive, TI, Infineon" },
  { he: "בדיקה לא הורסת (NDT) והדמיה בשדה קרוב", en: "Non-destructive testing (NDT) and near-field imaging",
    d: "הדמיית SAR ברזולוציה מילימטרית לזיהוי פגמים בחומרים, באריזות ובמזון.", d_en: "Millimeter-resolution SAR imaging to detect defects in materials, packaging and food.",
    who: "תעשייה, מזון וחקלאות, ביטחון", who_en: "Manufacturing, food and agriculture, defense" },
  { he: "חישה ב-Wi-Fi וב-5G (ISAC)", en: "Wi-Fi and 5G sensing (ISAC)",
    d: "שימוש באותות תקשורת קיימים לזיהוי תנועה ונוכחות – תקשורת וחישה משולבות.", d_en: "Using existing communication signals to detect motion and presence – integrated sensing and communication.",
    who: "חברות תקשורת וסלולר", who_en: "Telecom and cellular companies" },
  { he: "ניטור ספקטרום וזיהוי אותות בלמידת מכונה", en: "Spectrum monitoring and ML-based signal classification",
    d: "זיהוי אוטומטי של סוג האפנון ושל משדרים חריגים בעזרת SDR ורשתות נוירונים.", d_en: "Automatic recognition of modulation types and rogue transmitters with SDR and neural networks.",
    who: "ביטחון, רגולציה, אבטחת סייבר", who_en: "Defense, regulators, cybersecurity" },
  { he: "אבטחת שכבה פיזית ו-RF", en: "Physical-layer and RF security",
    d: "ניתוח פגיעויות בשלטים, בתגי RFID ובמכשירי IoT, וזיהוי מכשיר לפי \"טביעת האצבע\" של המשדר שלו.", d_en: "Vulnerability analysis of key fobs, RFID tags and IoT devices, and device identification by its transmitter \"fingerprint\".",
    who: "סייבר, רכב, IoT", who_en: "Cyber, automotive, IoT" },
  { he: "אנטנות ומערכי אנטנות מודפסים", en: "Printed antennas and antenna arrays",
    d: "תכנון, סימולציה ומדידה של אנטנות ומערכי פאזות זולים למכ״ם ולתקשורת.", d_en: "Design, simulation and measurement of low-cost antennas and phased arrays for radar and communication.",
    who: "חברות RF ואנטנות", who_en: "RF and antenna companies" },
  { he: "ערכות מעבדה להוראה", en: "Teaching lab kits",
    d: "פיתוח משותף של ניסויי SDR ומכ״ם לאוניברסיטאות, על בסיס חומרה של החברה.", d_en: "Joint development of SDR and radar labs for universities, based on the company's hardware.",
    who: "ADI, ‏TI ותוכניות אוניברסיטאות", who_en: "ADI, TI and university programs" },
];
