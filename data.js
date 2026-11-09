/*
 * כל התוכן של האתר נמצא בקובץ הזה, בשתי שפות.
 * כל שדה עם הסיומת _en הוא הגרסה האנגלית. אם חסר תרגום, מוצג הטקסט העברי.
 *
 * שיעור:  { id, title, en, dur, tags, kind }
 *   id    = מזהה הסרטון ב-YouTube (מה שבא אחרי watch?v=)
 *   title = כותרת בעברית לאתר (לא משנה את YouTube)
 *   en    = כותרת באנגלית
 *   dur   = אורך הסרטון
 *   tags  = נושאים (המפתחות מתוך TOPICS)
 *   kind  = "practice" לתרגול, "solution" לפתרון, "review" לחזרה (לא חובה)
 */

window.SITE = {
  owner: "ד״ר אייל מגורי",
  owner_en: "Dr. Eyal Magory",
  tagline: "שיעורים מלאים, תרגולים ומעבדות בהנדסת חשמל ותקשורת – בחינם",
  tagline_en: "Full lectures, tutorials and labs in electrical and communication engineering – free",
  email: "magory@g.jct.ac.il",
  youtube: "https://www.youtube.com/@JCT_1",
  photo: "img/eyal.jpg",   // תמונת פרופיל: שמים קובץ ב-img/ וכותבים כאן את הנתיב, למשל "img/eyal.jpg"
};

window.TOPICS = {
  intro:        { label: "מבוא למערכות תקשורת",    en: "Intro to communication systems", group: "analog" },
  modulation:   { label: "אפנון",                   en: "Modulation",                    group: "analog" },
  am:           { label: "אפנון AM",                en: "AM modulation",                 group: "analog" },
  fm:           { label: "אפנון FM",                en: "FM modulation",                 group: "analog" },
  pll:          { label: "PLL – חוג נעילת מופע",     en: "PLL – phase-locked loop",       group: "analog" },
  receivers:    { label: "מקלטים והטרודיין",          en: "Superheterodyne receivers",     group: "analog" },
  hilbert:      { label: "התמרת הילברט",             en: "Hilbert transform",             group: "signals" },
  fourier:      { label: "התמרת פורייה וספקטרום",     en: "Fourier transform & spectrum",  group: "signals" },
  sampling:     { label: "דגימה",                     en: "Sampling",                      group: "signals" },
  matlab:       { label: "MATLAB",                   en: "MATLAB",                        group: "tools" },
  scope:        { label: "סקופ ומכשור מעבדה",         en: "Oscilloscope & lab instruments", group: "tools" },
  latex:        { label: "LaTeX וכתיבה אקדמית",       en: "LaTeX & academic writing",      group: "tools" },
  digital:      { label: "תקשורת דיגיטלית",          en: "Digital communication",         group: "digital" },
  matched:      { label: "מסנן מתואם ו-ISI",         en: "Matched filter & ISI",          group: "digital" },
  qam:          { label: "QAM ואותות I/Q",           en: "QAM and I/Q signals",           group: "digital" },
  quantization: { label: "קוונטיזציה ו-SQNR",        en: "Quantization & SQNR",           group: "digital" },
  linecode:     { label: "קודי קו",                  en: "Line codes",                    group: "digital" },
  sdr:          { label: "SDR",                       en: "SDR",                           group: "digital" },
  infotheory:   { label: "תורת האינפורמציה",          en: "Information theory",            group: "info" },
  sourcecoding: { label: "קידוד מקור, הופמן ו-LZ77",  en: "Source coding, Huffman & LZ77", group: "info" },
  channelcoding:{ label: "קידוד ערוץ",                en: "Channel coding",                group: "info" },
  linearcodes:  { label: "קודים לינאריים וציקליים",    en: "Linear & cyclic codes",         group: "info" },
  antennas:     { label: "אנטנות",                    en: "Antennas",                      group: "rf" },
  optical:      { label: "תקשורת אופטית",             en: "Optical communication",         group: "rf" },
  radar:        { label: "מכ״ם",                      en: "Radar",                         group: "rf" },
  exam:         { label: "הכנה למבחנים",              en: "Exam preparation",              group: "exam" },
};

window.TOPIC_GROUPS = {
  analog:  { label: "תקשורת אנלוגית",       en: "Analog communication" },
  digital: { label: "תקשורת דיגיטלית",      en: "Digital communication" },
  info:    { label: "תורת האינפורמציה",      en: "Information theory" },
  signals: { label: "אותות ומערכות",        en: "Signals and systems" },
  rf:      { label: "אלקטרומגנטיות ו-RF",    en: "Electromagnetics & RF" },
  tools:   { label: "כלים",                  en: "Tools" },
  exam:    { label: "הכנה למבחנים",          en: "Exam preparation" },
};

window.COURSES = [
  {
    id: "comm",
    code: "130557",
    title: "יסודות התקשורת",
    title_en: "Fundamentals of Communication",
    year: "תשפ״ה", year_en: "2024–25",
    color: "#5fd3f3",
    summary: "מבוא למערכות תקשורת, אפנון AM ו-FM, מקלטים, PLL, תקשורת דיגיטלית ותורת האינפורמציה.",
    summary_en: "Introduction to communication systems, AM and FM modulation, receivers, PLL, digital communication and information theory.",
    playlist: "PLP3rzyCjo-mU3Vxopw3iN4Bzuh2Jdv55d",
    units: [
      { title: "אפנון אנלוגי ומקלטים", title_en: "Analog modulation and receivers", lessons: [
        { id: "62RUByK92iQ", title: "שיעור 1 – מבוא למערכות תקשורת", en: "Lecture 1 – Introduction to communication systems", dur: "1:14:17", tags: ["intro"] },
        { id: "QiALR-jPE68", title: "שיעור 2 – מבוא לאפנון", en: "Lecture 2 – Introduction to modulation", dur: "52:23", tags: ["modulation"] },
        { id: "L8bJGr18qGM", title: "אפנון AM – הסבר מלא במישור הזמן והתדר", en: "AM modulation in the time and frequency domains", dur: "1:22:01", tags: ["am", "modulation"] },
        { id: "A6vBu0o7J0Q", title: "מקלט הטרודיין וסופר-הטרודיין", en: "Heterodyne and superheterodyne receivers", dur: "25:20", tags: ["receivers"] },
        { id: "2wL1nX7KFPc", title: "התמרת הילברט + תרגול (הרצאה 5)", en: "Hilbert transform + tutorial (Lecture 5)", dur: "1:07:46", tags: ["hilbert"] },
        { id: "yhFEh1ASDyA", title: "אפנון FM – שיעור מלא", en: "FM modulation – full lecture", dur: "57:10", tags: ["fm", "modulation"] },
        { id: "dH8FtkFdXnk", title: "אפנון FM וחוג נעילת מופע (PLL)", en: "FM modulation and the phase-locked loop (PLL)", dur: "1:56:36", tags: ["fm", "pll"] },
        { id: "U2bJrFxNU8s", title: "PLL – חוג נעילת מופע: הסבר מלא", en: "PLL – the phase-locked loop explained", dur: "49:56", tags: ["pll"] },
      ]},
      { title: "תקשורת דיגיטלית", title_en: "Digital communication", lessons: [
        { id: "niLmD_z1aTI", title: "מבוא לתקשורת דיגיטלית", en: "Introduction to digital communication", dur: "57:59", tags: ["digital"] },
        { id: "PFnOF616Mfw", title: "תרגול בתקשורת דיגיטלית – פתרון שאלות", en: "Digital communication – solved problems", dur: "29:46", tags: ["digital", "exam"], kind: "practice" },
        { id: "1Ojnm1OZJR8", title: "שיטות אפנון דיגיטליות וקידוד ערוץ", en: "Digital modulation schemes and channel coding", dur: "1:18:32", tags: ["digital", "channelcoding"] },
        { id: "X1yP-4kQ_5s", title: "תרגול: SQNR ורעש קוונטיזציה", en: "Tutorial: SQNR and quantization noise", dur: "22:15", tags: ["quantization", "exam"], kind: "practice" },
        { id: "ACINbv6cZkU", title: "המסנן המתואם (Matched Filter)", en: "The matched filter", dur: "38:54", tags: ["matched"] },
        { id: "ie1zfSAgAjw", title: "מסנן מתואם ו-ISI", en: "Matched filter and intersymbol interference (ISI)", dur: "1:07:10", tags: ["matched"] },
        { id: "XmWzYSSivBY", title: "אפנון QAM ואותות I/Q", en: "QAM and I/Q signals", dur: "1:32:23", tags: ["qam", "digital"] },
        { id: "gMqdyv1wBQI", title: "קיבולת ערוץ ותרגילים", en: "Channel capacity and exercises", dur: "1:00:09", tags: ["digital", "exam"], kind: "practice" },
      ]},
      { title: "תורת האינפורמציה", title_en: "Information theory", lessons: [
        { id: "tCPDDJIrJzQ", title: "תורת האינפורמציה – שיעור 1", en: "Information theory – Lecture 1", dur: "1:17:50", tags: ["infotheory"] },
        { id: "8h2ZchzSu1U", title: "שיעור 2 – קוד הופמן מורחב, קנוני ו-LZ77", en: "Lecture 2 – Extended and canonical Huffman codes, LZ77", dur: "50:15", tags: ["infotheory", "sourcecoding"] },
        { id: "NBNS8LsxgCQ", title: "שיעור 3 – קידוד ערוץ", en: "Lecture 3 – Channel coding", dur: "1:33:38", tags: ["infotheory", "channelcoding"] },
        { id: "5w8mFHxMpVw", title: "תרגול קידוד ערוץ", en: "Tutorial: channel coding", dur: "24:32", tags: ["channelcoding", "exam"], kind: "practice" },
        { id: "C_n4aXgLkXo", title: "קודים לינאריים בצורה מטריציונית", en: "Linear codes in matrix form", dur: "55:43", tags: ["linearcodes"] },
        { id: "y-FBDLiEVRE", title: "קודים לינאריים ומרחק המינג", en: "Linear codes and Hamming distance", dur: "1:00:29", tags: ["linearcodes"] },
        { id: "vQ0Ehf482b4", title: "תרגול מטריצת G וקוד LZ77", en: "Tutorial: generator matrix G and LZ77", dur: "25:23", tags: ["linearcodes", "sourcecoding", "exam"], kind: "practice" },
        { id: "nckCyIhFp6M", title: "קודים ציקליים", en: "Cyclic codes", dur: "59:14", tags: ["linearcodes"] },
      ]},
      { title: "חזרה למבחן", title_en: "Exam review", lessons: [
        { id: "HWsq0aCTtqc", title: "שיעור חזרה – תקשורת דיגיטלית ותורת האינפורמציה", en: "Review – digital communication and information theory", dur: "1:13:50", tags: ["exam", "digital", "infotheory"], kind: "review" },
      ]},
    ],
  },
  {
    id: "signals-lab",
    code: "130606",
    title: "מעבדה באותות ומערכות",
    title_en: "Signals and Systems Lab",
    year: "תשפ״ה", year_en: "2024–25",
    color: "#f2b544",
    summary: "מבוא ל-MATLAB, התמרת פורייה אנליטית ומעשית, עבודה עם סקופ, יבוא נתונים וכתיבה אקדמית.",
    summary_en: "MATLAB fundamentals, analytical and practical Fourier analysis, oscilloscope measurements, data import and academic writing.",
    playlist: "PLP3rzyCjo-mXgbABHL8AuQu8VdVIBrAaN",
    units: [
      { title: "שיעורי המעבדה", title_en: "Lab sessions", lessons: [
        { id: "Lrh-VBx49GQ", title: "שיעור 1 – מבוא ל-MATLAB", en: "Session 1 – Introduction to MATLAB", dur: "27:39", tags: ["matlab"] },
        { id: "wUGHB4QXgz8", title: "שיעור 2", en: "Session 2", dur: "1:00:23", tags: ["matlab"] },
        { id: "lVvEs3_2_CU", title: "שיעור 3", en: "Session 3", dur: "44:47", tags: ["matlab"] },
        { id: "UBb2xZs1csY", title: "שיעור 4", en: "Session 4", dur: "45:52", tags: ["matlab"] },
        { id: "gT1HzZaWRj8", title: "מעבדה 5", en: "Lab 5", dur: "49:44", tags: ["matlab"] },
        { id: "WdDTA9Fu6Yg", title: "שיעור 6", en: "Session 6", dur: "40:30", tags: ["matlab"] },
        { id: "CuPHECw6xPU", title: "מעבדה 7 – יבוא נתונים ב-MATLAB וכתיבה אקדמית", en: "Lab 7 – Importing data in MATLAB and academic writing", dur: "52:58", tags: ["matlab", "latex"] },
        { id: "y1m-QpsqgRA", title: "מעבדה 8 – התמרת פורייה בצורה אנליטית", en: "Lab 8 – Analytical Fourier transform", dur: "41:03", tags: ["fourier"] },
        { id: "r5yWT2wJDlU", title: "מעבדה 9 – התמרת פורייה מעשית", en: "Lab 9 – Practical Fourier analysis", dur: "58:41", tags: ["fourier", "matlab"] },
        { id: "oZWPGdDM34M", title: "מעבדה 10 – חיבור לסקופ והתמרת פורייה עם הסקופ", en: "Lab 10 – Oscilloscope connection and FFT on the scope", dur: "29:16", tags: ["fourier", "scope"] },
        { id: "uy0v7Jv-t-o", title: "שיעור מסכם לעבודת הסיכום", en: "Wrap-up session for the final project", dur: "40:06", tags: ["matlab", "exam"], kind: "review" },
      ]},
      { title: "פתרונות תרגילי בית", title_en: "Homework solutions", lessons: [
        { id: "6AjK1xdpeXw", title: "פתרון תרגיל בית 1", en: "Homework 1 – solution", dur: "40:41", tags: ["matlab", "exam"], kind: "solution" },
        { id: "6OfM-Hxap5Q", title: "פתרון תרגיל בית 2", en: "Homework 2 – solution", dur: "25:27", tags: ["matlab", "exam"], kind: "solution" },
        { id: "g9ZTdUS4Y4U", title: "פתרון תרגיל בית 3", en: "Homework 3 – solution", dur: "24:19", tags: ["matlab", "exam"], kind: "solution" },
        { id: "TEi8Lo3XIXo", title: "פתרון תרגיל בית 4", en: "Homework 4 – solution", dur: "35:15", tags: ["matlab", "exam"], kind: "solution" },
      ]},
      { title: "כלים", title_en: "Tools", lessons: [
        { id: "mae1-t_TQWo", title: "מבוא ל-Overleaf ו-LaTeX", en: "Introduction to Overleaf and LaTeX", dur: "41:56", tags: ["latex"] },
      ]},
    ],
  },
  {
    id: "antennas-lab",
    code: "130833",
    title: "מעבדת אנטנות",
    title_en: "Antennas Laboratory",
    year: "תשפ״ו", year_en: "2025–26",
    color: "#7ee0a0",
    summary: "עקרונות פעולה של אנטנות, Dipole ו-Yagi, סימולציות ב-MATLAB וב-Antenna Designer, בנייה ומדידה עם Network Analyzer.",
    summary_en: "Antenna principles, dipole and Yagi antennas, simulation in MATLAB and Antenna Designer, construction and measurement with a network analyzer.",
    playlist: "PLP3rzyCjo-mWldAnZ0XXZKVDMCDEPuoFr",
    units: [
      { title: "מעבדות", title_en: "Labs", lessons: [
        { id: "tEsZgDqIJtA", title: "מעבדה 1", en: "Lab 1", dur: "1:14:46", tags: ["antennas"] },
        { id: "1-yikGyHqIg", title: "מעבדה 2", en: "Lab 2", dur: "1:02:34", tags: ["antennas"] },
        { id: "G4mBBiFSB-8", title: "מעבדה 3", en: "Lab 3", dur: "1:04:42", tags: ["antennas"] },
        { id: "0n0yl6kFnXw", title: "מעבדה 4", en: "Lab 4", dur: "57:53", tags: ["antennas"] },
        { id: "-WFdSuuxFyQ", title: "מעבדה 5", en: "Lab 5", dur: "33:21", tags: ["antennas"] },
        { id: "G4ZznuSo6DM", title: "מעבדה 7 – אנטנות Dipole ו-Yagi: חישוב, סימולציה ומדידה", en: "Lab 7 – Dipole and Yagi antennas: theory, simulation and measurement", dur: "42:26", tags: ["antennas", "matlab"] },
        { id: "p0P3heXt2a8", title: "מעבדה 8", en: "Lab 8", dur: "41:36", tags: ["antennas"] },
      ]},
    ],
  },
  {
    id: "comm-lab",
    code: "130661",
    title: "מעבדה בתקשורת",
    title_en: "Communication Lab",
    year: "תשפ״ה", year_en: "2024–25",
    color: "#c39bff",
    summary: "התמרת פורייה ו-PSD, אפנון AM על סקופ ונתח ספקטרום, דגימת נייקוויסט ועוד.",
    summary_en: "Fourier transform and PSD, AM modulation on the oscilloscope and spectrum analyzer, Nyquist sampling and more.",
    playlist: "PLP3rzyCjo-mVmP2uGusr_95a8Ntj-gvhy",
    units: [
      { title: "מעבדות", title_en: "Labs", lessons: [
        { id: "6-Ohdv2aQYU", title: "מעבדה 1", en: "Lab 1", dur: "45:29", tags: ["scope"] },
        { id: "XDqWTOd3eAg", title: "מעבדה 2 – התמרת פורייה ו-PSD", en: "Lab 2 – Fourier transform and PSD", dur: "42:10", tags: ["fourier"] },
        { id: "QP2_i-U-CNQ", title: "מעבדה 3 – אפנון AM: סקופ, נתח ספקטרום ומחולל אותות", en: "Lab 3 – AM modulation: oscilloscope, spectrum analyzer and signal generator", dur: "45:53", tags: ["am", "scope"] },
        { id: "e-r8XIxm--s", title: "מעבדה 4", en: "Lab 4", dur: "22:57", tags: ["scope"] },
        { id: "S2yMyF_aWxc", title: "מעבדה 5 – דגימה לפי נייקוויסט", en: "Lab 5 – Nyquist sampling", dur: "33:32", tags: ["sampling"] },
        { id: "HYQXYR2yJBY", title: "מעבדה 6", en: "Lab 6", dur: "46:51", tags: ["scope"] },
        { id: "siMfkTyMtgo", title: "מעבדה 7", en: "Lab 7", dur: "28:44", tags: ["scope"] },
      ]},
    ],
  },
  {
    id: "optical",
    code: "140712",
    title: "Electronic and Optical Communication",
    title_en: "Electronic and Optical Communication",
    year: "תשפ״ז", year_en: "2026–27",
    color: "#ff8fa3",
    lang: "en",
    summary: "מערכות תקשורת אופטית: עקרונות הסיב, הנחתה ונפיצה, משדרים ומקלטים אופטיים, מגברים, DWDM ו-OTDR.",
    summary_en: "Optical communication systems: fiber principles, attenuation and dispersion, optical transmitters and receivers, amplifiers, DWDM and OTDR.",
    playlist: "PLd61vYISMuMc",
    units: [
      { title: "הרצאות", title_en: "Lectures", lessons: [
        { id: "CAMb3RnO-sE", title: "Electronic and Optical Communication 1", en: "Electronic and Optical Communication 1", dur: "1:26:58", tags: ["optical"] },
        { id: "pyRX9WstwbM", title: "Optical Communication Practice 2", en: "Optical Communication Practice 2", dur: "1:16:44", tags: ["optical", "fourier"], kind: "practice" },
      ]},
    ],
  },
];

/* הרצאות והדגמות שלא שייכות לקורס מסוים */
window.SPECIALS = [
  { id: "J9J_FMDAgaY", title: "Nuclear Electromagnetic Pulse (EMP)", en: "Nuclear Electromagnetic Pulse (EMP)", dur: "34:47", tags: ["radar"] },
  { id: "gjVbqlQ8B88", title: "מכ״ם IWR1843BOOST – היכרות ועבודה", en: "TI IWR1843BOOST mmWave radar – getting started", dur: "26:56", tags: ["radar"] },
  { id: "PIP7Lk2rBdU", title: "Car Key Signal Sniffer – SDR", en: "Car key signal sniffer with SDR", dur: "7:58", tags: ["sdr"] },
];

/* תחומי מחקר – טיוטה, לעדכן */
window.RESEARCH = [
  {
    title: "ניטור סימנים חיוניים ללא מגע במכ״ם mmWave",
    title_en: "Contactless vital-sign monitoring with mmWave radar",
    text: "מדידת נשימה ודופק ממרחק באמצעות מכ״ם FMCW בתדר 77 GHz (TI IWR1843 + DCA1000), כולל עיבוד אותות בזמן אמת.",
    text_en: "Remote measurement of respiration and heart rate with a 77 GHz FMCW radar (TI IWR1843 + DCA1000), including real-time signal processing.",
    tags: ["radar"],
  },
  {
    title: "הדמיית מכ״ם בשדה קרוב (SAR)",
    title_en: "Near-field radar imaging (SAR)",
    text: "סריקה מכנית ושחזור תמונה ברזולוציה מילימטרית, כולל זיהוי שינויים ברמת המיקרון מתוך פאזת האות.",
    text_en: "Mechanical scanning and millimeter-resolution image reconstruction, including micron-level change detection from the signal phase.",
    tags: ["radar"],
  },
  {
    title: "מדידת רעידות ושמע במכ״ם",
    title_en: "Radar-based vibration and audio sensing",
    text: "שחזור רעידות של מיתרים ומקורות קול מתוך האות המוחזר, ללא מיקרופון.",
    text_en: "Recovering string vibrations and sound sources from the reflected radar signal, without a microphone.",
    tags: ["radar"],
  },
];

/*
 * פרויקטי סטודנטים – דוגמאות, לעדכן לפי המציאות.
 * status: "done" | "active" | "open" (פרויקט פתוח להצטרפות)
 */
window.PROJECTS = [
  {
    title: "יירוט וניתוח אות של שלט רכב עם SDR",
    title_en: "Intercepting and analyzing a car key fob signal with SDR",
    status: "done",
    text: "קליטת האות של שלט רכב, ניתוח האפנון וזיהוי מבנה ההודעה בעזרת רדיו מוגדר תוכנה.",
    text_en: "Capturing a car key fob transmission, analyzing its modulation and identifying the message structure with a software-defined radio.",
    video: "PIP7Lk2rBdU",
    tags: ["sdr"],
  },
  {
    title: "מערכת ניטור נשימה ודופק במכ״ם",
    title_en: "Radar-based respiration and heart-rate monitor",
    status: "open",
    text: "בניית ממשק בזמן אמת למכ״ם IWR1843 ושיפור האלגוריתם להפרדת נשימה ודופק. מתאים לפרויקט גמר.",
    text_en: "A real-time interface for the IWR1843 radar and an improved algorithm for separating respiration and heartbeat. Suitable as a final-year project.",
    video: "gjVbqlQ8B88",
    tags: ["radar"],
  },
  {
    title: "תכנון ובנייה של אנטנת Yagi",
    title_en: "Design and construction of a Yagi antenna",
    status: "open",
    text: "תכנון בסימולציה, בנייה ומדידה ב-Network Analyzer, והשוואה בין תאוריה, סימולציה ומדידה.",
    text_en: "Simulation-based design, construction and network-analyzer measurement, comparing theory, simulation and measurement.",
    video: "G4ZznuSo6DM",
    tags: ["antennas"],
  },
];
