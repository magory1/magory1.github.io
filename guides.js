/*
 * מדריכי מעבדה אינטרנטיים – שלב אחר שלב.
 * כל מדריך: רקע, הכנה, חלקי ניסוי עם שלבים, טבלת תוצאות, קבצי MATLAB.
 * נוסחאות נכתבות ב-LaTeX בין \( \) (בתוך שורה) או $$ $$ (בשורה נפרדת).
 * קבצים (תמונות, סכמות, קוד) נמצאים בתיקייה labs/<dir>/.
 */
window.GUIDES = [
  {
    id: "am",
    course: "comm-lab",
    num: 3,
    dir: "labs/lab03_am",
    amTables: true,
    title: "מעבדה 3 – אפנון AM ו-DSB-SC",
    title_en: "Lab 3 – AM and DSB-SC modulation",
    summary: "בונים משדר AM ממיקסר ומפצלים, רואים את האות במישור הזמן והתדר, משווים ל-DSB-SC ומפענחים את המידע במקלט סינכרוני.",
    summary_en: "Build an AM transmitter from a mixer and splitters, see the signal in time and frequency, compare it with DSB-SC and recover the message with a synchronous receiver.",
    time: "3 שעות", time_en: "3 hours",
    tags: ["am", "modulation", "scope"],
    goals: [
      "להכיר את מבנה האות המאופנן AM במישור הזמן ובמישור התדר.",
      "להבין את ההבדל בין AM לבין DSB-SC, ואיפה הולך ההספק.",
      "לבנות משדר AM פשוט ממיקסר ומפצלים.",
      "לבנות מקלט סינכרוני ולראות מה קורה כשהמתנד המקומי לא מסונכרן בפאזה או בתדר.",
    ],
    goals_en: [
      "Understand the AM signal in the time and frequency domains.",
      "Understand the difference between AM and DSB-SC, and where the power goes.",
      "Build a simple AM transmitter from a mixer and splitters.",
      "Build a synchronous receiver and see what happens when the local oscillator is off in phase or frequency.",
    ],
    equipment: ["אוסילוסקופ, 2 ערוצים לפחות", "נתח ספקטרום Keysight N9320", "מחולל אותות Keysight 33500 (2 יציאות)", "2 מיקסרים", "2 מפצלים (splitters)", "2 מסנני LPF", "כבלי BNC ומתאמים"],
    equipment_en: ["Oscilloscope, at least 2 channels", "Keysight N9320 spectrum analyzer", "Keysight 33500 signal generator (2 outputs)", "2 mixers", "2 power splitters", "2 low-pass filters", "BNC cables and adapters"],

    theory: [
      {
        h: "אפנון AM במישור הזמן", h_en: "AM in the time domain",
        fig: "am_time.png",
        body: String.raw`<p>אותות מידע כמו קול הם אותות <b>baseband</b> – רוחב הסרט שלהם נמוך, ואי אפשר לשדר אותם ביעילות דרך האוויר. לכן מעלים אותם לתדר גבוה (<b>passband</b>): לוקחים גל נושא בתדר \(f_c\) ומשנים אחת מהתכונות שלו לפי המידע. באפנון משרעת (AM) המשרעת של הגל הנושא עוקבת אחרי המתח הרגעי של המידע.</p>
<p>עבור מידע סינוסי בתדר \(f_m\) ובמשרעת \(A_m\):</p>
$$x_{AM}(t) = \big(A_c + A_m\cos 2\pi f_m t\big)\cos 2\pi f_c t = A_c\big[1 + k_a\cos 2\pi f_m t\big]\cos 2\pi f_c t$$
<p>\(k_a = A_m/A_c\) הוא <b>מקדם (עומק) האפנון</b>, בין 0 ל-1. הקו הכתום באיור הוא המעטפת – והיא בדיוק המידע. מהסקופ קל למדוד את המקסימום והמינימום של המעטפת, ומהם:</p>
$$k_a = \frac{V_{max}-V_{min}}{V_{max}+V_{min}},\qquad A_c = \frac{V_{max}+V_{min}}{2},\qquad A_m = \frac{V_{max}-V_{min}}{2}$$
<p class="note">יש ספרים שמגדירים \(x_{AM}=A_c[1+k_a m(t)]\cos 2\pi f_c t\) ואז עומק האפנון הוא \(k_a\max|m(t)|\). בשתי ההגדרות עומק האפנון הוא המקדם של \(\cos 2\pi f_m t\). במעבדה נשתמש בהגדרה הראשונה.</p>`,
        body_en: String.raw`<p>Message signals such as speech are <b>baseband</b> signals: their bandwidth is low and they cannot be radiated efficiently. We therefore shift them to a high frequency (<b>passband</b>): take a carrier at \(f_c\) and vary one of its properties with the message. In amplitude modulation (AM) the carrier amplitude follows the instantaneous message voltage.</p>
<p>For a sinusoidal message at \(f_m\) with amplitude \(A_m\):</p>
$$x_{AM}(t) = \big(A_c + A_m\cos 2\pi f_m t\big)\cos 2\pi f_c t = A_c\big[1 + k_a\cos 2\pi f_m t\big]\cos 2\pi f_c t$$
<p>\(k_a = A_m/A_c\) is the <b>modulation index (depth)</b>, between 0 and 1. The orange line in the figure is the envelope – and it is exactly the message. On the scope it is easy to read the envelope maximum and minimum, and from them:</p>
$$k_a = \frac{V_{max}-V_{min}}{V_{max}+V_{min}},\qquad A_c = \frac{V_{max}+V_{min}}{2},\qquad A_m = \frac{V_{max}-V_{min}}{2}$$
<p class="note">Some books define \(x_{AM}=A_c[1+k_a m(t)]\cos 2\pi f_c t\), so the depth is \(k_a\max|m(t)|\). In both cases the depth is the coefficient of \(\cos 2\pi f_m t\). This lab uses the first definition.</p>`,
      },
      {
        h: "אפנון AM במישור התדר", h_en: "AM in the frequency domain", sim: "am",
        fig: "am_spectrum.png",
        body: String.raw`<p>בעזרת הזהות \(\cos\alpha\cos\beta = \tfrac12[\cos(\alpha-\beta)+\cos(\alpha+\beta)]\):</p>
$$x_{AM}(t) = A_c\cos 2\pi f_c t + \frac{A_m}{2}\cos 2\pi (f_c-f_m)t + \frac{A_m}{2}\cos 2\pi (f_c+f_m)t$$
<ol><li><b>הגל הנושא</b> ב-\(f_c\) במשרעת \(A_c\) – לא מכיל מידע.</li>
<li><b>פס צד עליון (USB)</b> ב-\(f_c+f_m\) במשרעת \(A_m/2\) – מכיל את המידע.</li>
<li><b>פס צד תחתון (LSB)</b> ב-\(f_c-f_m\) במשרעת \(A_m/2\) – מכיל את המידע.</li></ol>
<p>רוחב הסרט הוא \(2f_m\) – כפול מרוחב הסרט של המידע. נתח ספקטרום מציג את הצד החיובי בלבד (התדרים השליליים "מקופלים" עליו), ולכן רואים בדיוק את שלושת הקווים האלה.</p>
<p><b>איפה ההספק?</b> הספק הגל הנושא \(A_c^2/2\), והספק שני פסי הצד יחד \(A_c^2k_a^2/4\). היעילות – החלק מההספק שנושא מידע:</p>
$$\eta = \frac{k_a^2}{2+k_a^2}\quad\Rightarrow\quad \eta \le 33\%\ \text{(at } k_a=1\text{)}$$`,
        body_en: String.raw`<p>Using \(\cos\alpha\cos\beta = \tfrac12[\cos(\alpha-\beta)+\cos(\alpha+\beta)]\):</p>
$$x_{AM}(t) = A_c\cos 2\pi f_c t + \frac{A_m}{2}\cos 2\pi (f_c-f_m)t + \frac{A_m}{2}\cos 2\pi (f_c+f_m)t$$
<ol><li>The <b>carrier</b> at \(f_c\) with amplitude \(A_c\) – carries no information.</li>
<li>The <b>upper sideband (USB)</b> at \(f_c+f_m\) with amplitude \(A_m/2\) – carries the message.</li>
<li>The <b>lower sideband (LSB)</b> at \(f_c-f_m\) with amplitude \(A_m/2\) – carries the message.</li></ol>
<p>The bandwidth is \(2f_m\) – twice the message bandwidth. A spectrum analyzer shows only positive frequencies (the negative ones are folded onto them), so you see exactly these three lines.</p>
<p><b>Where is the power?</b> The carrier power is \(A_c^2/2\) and both sidebands together carry \(A_c^2k_a^2/4\). The efficiency – the fraction of power that carries information – is:</p>
$$\eta = \frac{k_a^2}{2+k_a^2}\quad\Rightarrow\quad \eta \le 33\%\ \text{(at } k_a=1\text{)}$$`,
      },
      {
        h: "DSB-SC – בלי גל נושא", h_en: "DSB-SC – no carrier",
        fig: "am_vs_dsbsc.png",
        body: String.raw`<p>ב-DSB-SC (Double Sideband – Suppressed Carrier) משדרים רק את שני פסי הצד:</p>
$$x_{DSB}(t) = A_m\cos 2\pi f_m t\,\cos 2\pi f_c t$$
<p>ההבדל היחיד מ-AM הוא האיבר \(A_c\cos 2\pi f_c t\). כל ההספק הולך למידע (יעילות 100%), אבל המעטפת היא \(|m(t)|\) ולא \(m(t)\): בכל מעבר של המידע דרך אפס הפאזה של הגל הנושא מתהפכת. לכן גלאי מעטפת פשוט לא יעבוד, וצריך מקלט סינכרוני.</p>`,
        body_en: String.raw`<p>In DSB-SC (Double Sideband – Suppressed Carrier) only the two sidebands are transmitted:</p>
$$x_{DSB}(t) = A_m\cos 2\pi f_m t\,\cos 2\pi f_c t$$
<p>The only difference from AM is the term \(A_c\cos 2\pi f_c t\). All the power goes into the message (100% efficiency), but the envelope is \(|m(t)|\), not \(m(t)\): every time the message crosses zero the carrier phase flips. A simple envelope detector therefore fails, and a synchronous receiver is needed.</p>`,
      },
      {
        h: "המשדר", h_en: "The transmitter",
        fig: "tx.svg",
        body: String.raw`<p>לפי המשוואה של DSB-SC, המשדר הוא <b>מיקסר</b> (מכפל) שמכפיל את המידע \(m(t)\) בגל נושא שמייצר מתנד מקומי (LO). במוצא המיקסר מתקבל DSB-SC. כשמוסיפים לו את הגל הנושא עצמו (במחבר – במעבדה זה מפצל שעובד הפוך) מתקבל AM.</p>`,
        body_en: String.raw`<p>From the DSB-SC equation, the transmitter is a <b>mixer</b> (multiplier) that multiplies the message \(m(t)\) by a carrier from a local oscillator (LO). The mixer output is DSB-SC. Adding the carrier itself (with a combiner – in the lab, a splitter used in reverse) gives AM.</p>`,
      },
      {
        h: "המקלט הסינכרוני (קוהרנטי)", h_en: "The synchronous (coherent) receiver", sim: "rx",
        fig: "rx.svg",
        body: String.raw`<p>המקלט מכפיל את האות שהתקבל במתנד מקומי בתדר הגל הנושא, ואחר כך מסנן LPF משאיר רק את תדר ההפרש. עבור DSB-SC עם שגיאת פאזה \(\phi\):</p>
$$m(t)\cos(2\pi f_c t)\cdot\cos(2\pi f_c t+\phi) = \tfrac12 m(t)\cos\phi + \underbrace{\tfrac12 m(t)\cos(4\pi f_c t+\phi)}_{\text{removed by the LPF}}$$
<p>כלומר המידע יוצא מוכפל ב-\(\cos\phi\): ב-\(\phi=0\) מקסימום, וב-\(\phi=90^\circ\) – אפס. אם תדר המתנד שונה ב-\(\Delta f\), הפאזה גדלה עם הזמן \(\phi = 2\pi\Delta f\,t\), והמידע "נושם" בקצב \(\Delta f\):</p>
$$\hat m(t) = \tfrac12 m(t)\cos(2\pi\Delta f\, t)$$
<p>זו הסיבה שבמקלט אמיתי צריך לשחזר את הגל הנושא בדיוק (למשל עם PLL או לולאת Costas).</p>`,
        body_en: String.raw`<p>The receiver multiplies the incoming signal by a local oscillator at the carrier frequency, then a low-pass filter keeps only the difference frequency. For DSB-SC with a phase error \(\phi\):</p>
$$m(t)\cos(2\pi f_c t)\cdot\cos(2\pi f_c t+\phi) = \tfrac12 m(t)\cos\phi + \underbrace{\tfrac12 m(t)\cos(4\pi f_c t+\phi)}_{\text{removed by the LPF}}$$
<p>The message comes out multiplied by \(\cos\phi\): maximum at \(\phi=0\), zero at \(\phi=90^\circ\). If the LO is off by \(\Delta f\), the phase grows with time, \(\phi = 2\pi\Delta f\,t\), and the message "breathes" at \(\Delta f\):</p>
$$\hat m(t) = \tfrac12 m(t)\cos(2\pi\Delta f\, t)$$
<p>This is why a real receiver must recover the carrier exactly (for example with a PLL or a Costas loop).</p>`,
        fig2: "coherent.png",
      },
    ],

    /* הרכיבים: תמונה מהמעבדה (jpg) או הסמל שמופיע בסכמות (svg) */
    components: [
      { img: ["mixer.jpg", "mixer_ports.jpg"], name: "מיקסר (מערבל)", name_en: "Mixer", model: "Mini-Circuits ZAD-6+ · 3 kHz–100 MHz", parts: "1, 2, 4",
        role: "מכפיל שני אותות: במוצא מתקבלים תדרי הסכום וההפרש \\(f_L \\pm f_R\\). זה הלב של המשדר (חלק 1) ושל המקלט (חלק 4).",
        role_en: "Multiplies two signals: the output holds the sum and difference frequencies \\(f_L \\pm f_R\\). It is the heart of the transmitter (Part 1) and of the receiver (Part 4).",
        ports: [["L", "הגל הנושא / המתנד המקומי (LO)", "carrier / local oscillator (LO)"], ["R", "המידע (או האות שהתקבל, בחלק 4)", "the message (or the received signal, in Part 4)"], ["I", "המוצא", "output"]],
        tip: "מיקסר פסיבי (דיודות): המוצא חלש מהכניסה בכ-5 dB, והאות ב-L צריך להיות החזק מבין השניים. אל תחברו אות DC או אות גדול מ-1 Vpp.",
        tip_en: "A passive (diode) mixer: the output is about 5 dB weaker than the input, and the L signal should be the stronger of the two. Do not apply DC or signals larger than 1 Vpp." },
      { img: ["comp_splitter.svg"], name: "מפצל / מחבר הספק", name_en: "Power splitter / combiner", model: "2-way, 0°", parts: "2",
        role: "מחלק אות אחד לשניים (<bdi dir='ltr'>S → 1, 2</bdi>). בכיוון ההפוך הוא מחבר שני אותות לאחד (<bdi dir='ltr'>1, 2 → S</bdi>) – כך מוסיפים את הגל הנושא ל-DSB-SC ומקבלים AM.",
        role_en: "Divides one signal into two (S → 1, 2). Used in reverse it combines two signals into one (1, 2 → S) – this is how the carrier is added to DSB-SC to get AM.",
        ports: [["S", "הכניסה המשותפת (Sum)", "common port (Sum)"], ["1, 2", "היציאות", "the branches"]],
        tip: "כל מעבר דרך המפצל מחליש את האות בכ-3 dB (חצי הספק). לכן בחלק 2 הגל הנושא מוגדל ל-700 mVpp.",
        tip_en: "Every pass through the splitter costs about 3 dB (half the power). That is why the carrier is raised to 700 mVpp in Part 2." },
      { img: ["comp_lpf.svg"], name: "מסנן מעביר נמוכים (LPF)", name_en: "Low-pass filter (LPF)", model: "≈1.9 MHz", parts: "4",
        role: "מעביר תדרים נמוכים וחוסם גבוהים. במקלט הוא משאיר את המידע (1 kHz) ומסלק את הרכיב ב-\\(2f_c\\) = 20 MHz.",
        role_en: "Passes low frequencies and blocks high ones. In the receiver it keeps the message (1 kHz) and removes the \\(2f_c\\) = 20 MHz component.",
        ports: [["IN / OUT", "סימטרי – אפשר לחבר בכל כיוון", "symmetric – either way round"]],
        tip: "בדקו את תדר הקיטעון שכתוב על המסנן: הוא צריך להיות הרבה מעל תדר המידע והרבה מתחת ל-20 MHz.",
        tip_en: "Check the cutoff printed on the filter: it must be far above the message frequency and far below 20 MHz." },
      { img: ["tee.jpg"], name: "מחבר T (BNC)", name_en: "BNC T-connector", model: "BNC", parts: "1–4",
        role: "מפצל חיבור אחד לשניים בלי לנתק את המעגל – למשל כדי לראות את אותה נקודה בסקופ ובנתח הספקטרום בבת אחת, או למדוד את המתנד בנקודה 2.",
        role_en: "Splits one connection into two without breaking the circuit – for example to watch the same point on the scope and the spectrum analyzer at once, or to probe the LO at point 2.",
        ports: [], tip: "הסקופ (1 MΩ) כמעט לא מעמיס על המעגל. אל תחברו שני עומסים של 50 Ω על אותו T – המתח ירד בחצי.",
        tip_en: "The scope (1 MΩ) barely loads the circuit. Do not hang two 50 Ω loads on one T – the voltage drops by half." },
      { img: ["comp_gen.svg"], name: "מחולל אותות", name_en: "Signal generator", model: "Keysight 33500", parts: "1–4",
        role: "שתי יציאות עצמאיות: אחת למידע ואחת לגל הנושא (או המשדר והמתנד המקומי בחלק 4), ואפנון AM פנימי לחלק 3.",
        role_en: "Two independent outputs: one for the message and one for the carrier (or the transmitter and the local oscillator in Part 4), plus internal AM modulation for Part 3.",
        ports: [["Output 1, 2", "BNC, 50 Ω", "BNC, 50 Ω"]],
        tip: "המחולל מניח עומס של 50 Ω. בסקופ (1 MΩ) תראו מתח כפול מהמוצג במחולל – זה לא תקלה. אם צריך, קבעו Output Load → High Z.",
        tip_en: "The generator assumes a 50 Ω load. On the scope (1 MΩ) you will see twice the voltage shown on the generator – that is not a fault. If needed, set Output Load → High Z." },
      { img: ["comp_scope.svg"], name: "אוסילוסקופ", name_en: "Oscilloscope", model: "2–4 ch", parts: "1–4",
        role: "מתח כפונקציה של זמן: מעטפת, עומק אפנון, ומדידת המידע המשוחזר במוצא המקלט.",
        role_en: "Voltage versus time: the envelope, the modulation depth, and the recovered message at the receiver output.",
        ports: [["CH1, CH2", "BNC, 1 MΩ", "BNC, 1 MΩ"]],
        tip: "ל-Math → FFT יש גם ספקטרום – שימושי לתדרים נמוכים מ-9 kHz, שנתח הספקטרום לא מגיע אליהם.",
        tip_en: "Math → FFT gives a spectrum too – useful below 9 kHz, where the spectrum analyzer does not reach." },
      { img: ["comp_sa.svg"], name: "נתח ספקטרום", name_en: "Spectrum analyzer", model: "Keysight N9320 · 9 kHz–3 GHz", parts: "1–4",
        role: "עוצמה כפונקציה של תדר: רואים את הגל הנושא ואת פסי הצד כקווים נפרדים ומודדים את גובהם.",
        role_en: "Power versus frequency: the carrier and the sidebands appear as separate lines whose heights you can measure.",
        ports: [["RF IN", "N, 50 Ω – צריך מתאם BNC ל-N", "N-type, 50 Ω – needs a BNC-to-N adapter"]],
        tip: "לעולם לא מתח DC בכניסה. השאירו Attenuation → Auto, ובדקו את הרמה בסקופ לפני שמחברים אות לא מוכר.",
        tip_en: "Never put DC on the input. Keep Attenuation → Auto, and check the level on the scope before connecting an unknown signal." },
    ],

    instruments: [
      { h: "לפני שמתחילים", h_en: "Before you start",
        body: "בדקו את כבלי ה-BNC: הרבה תקלות במעבדה הן מגע רופף. הכניסו אות ידוע מהמחולל ובדקו שהסקופ מציג אותו נכון, ונענעו בעדינות את הכבלים כדי לוודא שהתמונה יציבה.",
        body_en: "Check the BNC cables: many lab problems are loose contacts. Feed a known signal from the generator, check that the scope shows it correctly, and gently wiggle the cables to make sure the picture is stable." },
      { h: "אוסילוסקופ", h_en: "Oscilloscope",
        body: "מציג מתח כפונקציה של זמן. Auto-Setup נותן נקודת התחלה טובה; אחר כך כוונו בסיס זמן (time/div) כך שיראו 2–3 מחזורים של המעטפת, ו-Trigger על הערוץ הנכון. כדי לקרוא ערכים עצרו (Run/Stop) והשתמשו ב-Cursors. לדוח: Save → Image (PNG), ולניתוח ב-MATLAB: Save → Waveform Data (CSV).",
        body_en: "Shows voltage versus time. Auto-Setup is a good starting point; then set the time base so that 2–3 envelope periods are visible and trigger on the right channel. To read values, stop the acquisition (Run/Stop) and use the cursors. For the report: Save → Image (PNG); for MATLAB analysis: Save → Waveform Data (CSV)." },
      { h: "נתח ספקטרום", h_en: "Spectrum analyzer",
        body: "מציג עוצמה כפונקציה של תדר. קבעו Center Frequency על הגל הנושא ו-Span שיכלול את פסי הצד. Peak Search ו-Markers נותנים תדר ועוצמה מדויקים. RBW קטן מפריד בין קווים קרובים אבל מאט את הסריקה. ברירת המחדל היא dBm; למדידת מתחים העבירו את ציר ה-Y ל-Volts.",
        body_en: "Shows power versus frequency. Set the Center Frequency to the carrier and a Span that includes the sidebands. Peak Search and Markers give accurate frequency and level. A small RBW separates close lines but slows the sweep. The default unit is dBm; to measure voltages switch the Y axis to Volts." },
      { h: "מחולל האותות", h_en: "Signal generator",
        body: "לכל יציאה תפריט משלה (Channel 1 / Channel 2): צורת גל, תדר, משרעת ופאזה. האפנון הפנימי נמצא ב-Modulate. לפני שמשנים פאזה בין היציאות, ודאו ששתיהן באותו תדר ולחצו Sync / Align Phase, כדי שהפאזה תימדד מנקודת התחלה משותפת.",
        body_en: "Each output has its own menu (Channel 1 / Channel 2): waveform, frequency, amplitude and phase. The internal modulation is under Modulate. Before changing the phase between the outputs, make sure both are at the same frequency and press Sync / Align Phase, so the phase is measured from a common start." },
    ],

    prep: [
      { q: "באיור הבא אות AM כפי שהוא נראה בסקופ. קבעו:", q_en: "The figure shows an AM signal as seen on a scope. Find:",
        fig: "prep1_scope.png",
        items: ["מהי המשרעת של הגל הנושא \\(A_c\\)?", "מהי המשרעת של המידע \\(A_m\\)?", "מהו התדר של המידע \\(f_m\\)? ומה תדר הגל הנושא?", "מהו מקדם האפנון באחוזים?"],
        items_en: ["What is the carrier amplitude \\(A_c\\)?", "What is the message amplitude \\(A_m\\)?", "What is the message frequency \\(f_m\\)? And the carrier frequency?", "What is the modulation depth in percent?"] },
      { q: "נתון אות AM: גל נושא בתדר 1 MHz ובמשרעת 400 mVpp, עומק אפנון 50%, תדר מידע 20 kHz. שרטטו את הספקטרום (תדרים ומשרעות של כל הקווים).",
        q_en: "An AM signal has a 1 MHz carrier at 400 mVpp, 50% depth and a 20 kHz message. Sketch its spectrum (frequency and amplitude of every line).",
        items: [], items_en: [] },
    ],

    parts: [
      {
        title: "חלק 1 – אות DSB-SC עם מיקסר", title_en: "Part 1 – DSB-SC with a mixer",
        goal: "מכפילים את המידע בגל הנושא במיקסר ומקבלים DSB-SC.", goal_en: "Multiply the message by the carrier in a mixer to get DSB-SC.",
        diagram: "setup1.svg",
        steps: [
          { do: "כוונו את המחולל:", do_en: "Set up the generator:",
            set: [["Output 1", "Sine · 100 kHz · 200 mVpp (מידע)", "Sine · 100 kHz · 200 mVpp (message)"], ["Output 2", "Sine · 10 MHz · 350 mVpp (גל נושא)", "Sine · 10 MHz · 350 mVpp (carrier)"]] },
          { do: "חברו את Output 1 לכניסה R של המיקסר ואת Output 2 לכניסה L, כמו בסכמה. את המוצא I חברו לנתח הספקטרום.", do_en: "Connect Output 1 to the mixer R port and Output 2 to the L port, as in the diagram. Connect the I port to the spectrum analyzer.",
            set: [["Spectrum", "Frequency → Center 10 MHz · Span 500 kHz", "Frequency → Center 10 MHz · Span 500 kHz"]] },
          { do: "לחצו Peak Search והזיזו את ה-Marker בין הקווים.", do_en: "Press Peak Search and move the marker between the lines.",
            q: ["אילו תדרים מופיעים על המסך ובאיזו עוצמה?"], q_en: ["Which frequencies appear on the screen, and at what level?"], fig: [1] },
          { do: "הסבירו את התוצאה.", do_en: "Explain the result.",
            q: ["למה רואים דווקא את התדרים האלה? השתמשו בזהות למכפלת קוסינוסים.", "האם רואים קו ב-10 MHz? אם כן – מאיפה הוא מגיע?"], q_en: ["Why exactly these frequencies? Use the product-of-cosines identity.", "Is there a line at 10 MHz? If so, where does it come from?"],
            hint: "מיקסר אמיתי אינו מכפל מושלם: חלק מאות ה-LO 'דולף' למוצא (LO leakage), ולכן יופיע קו קטן בתדר הגל הנושא. כמה dB הוא נמוך מפסי הצד?", hint_en: "A real mixer is not a perfect multiplier: some LO signal leaks to the output, so a small line appears at the carrier frequency. How many dB below the sidebands is it?" },
          { do: "העבירו את המוצא I לסקופ ועצרו את התצוגה (Run/Stop).", do_en: "Move the I output to the scope and stop the acquisition (Run/Stop).",
            q: ["מהו תדר המעטפת? (קראו מהמשבצות ומבסיס הזמן)", "מהו תדר הגל הנושא?", "האם זה מתאים לציפייה? שימו לב למה שקורה למעטפת כשהמידע עובר דרך אפס."], q_en: ["What is the envelope frequency? (read it from the divisions and the time base)", "What is the carrier frequency?", "Does it match what you expected? Look at what happens to the envelope when the message crosses zero."],
            set: [["Scope", "Time 2 µs/div · Trigger CH1 · Run/Stop", "Time 2 µs/div · Trigger CH1 · Run/Stop"]], fig: [2],
            hint: "מעטפת של DSB-SC היא \\(|m(t)|\\): היא חוזרת על עצמה פעמיים בכל מחזור של המידע. אל תתבלבלו – תדר המידע הוא 100 kHz גם אם 'נראה' 200 kHz.", hint_en: "The DSB-SC envelope is \\(|m(t)|\\): it repeats twice per message period. Don't be fooled – the message is 100 kHz even if it 'looks like' 200 kHz." },
        ],
      },
      {
        title: "חלק 2 – אות AM: מוסיפים את הגל הנושא", title_en: "Part 2 – AM: adding the carrier",
        goal: "מוסיפים למוצא המיקסר את הגל הנושא בעזרת מפצלים, ומקבלים AM.", goal_en: "Add the carrier to the mixer output with splitters to get AM.",
        diagram: "setup2.svg",
        steps: [
          { do: "חברו את המעגל לפי הסכמה. מפצל 1 מחלק את הגל הנושא: חלק אחד למיקסר וחלק אחד ישירות למפצל 2, שמחבר אותו עם מוצא המיקסר. שימו לב: הגל הנושא עכשיו 700 mVpp, כי המפצל מחלק את ההספק.", do_en: "Wire the circuit as in the diagram. Splitter 1 divides the carrier: one branch to the mixer and one straight to splitter 2, which combines it with the mixer output. Note: the carrier is now 700 mVpp because the splitter divides the power.",
            set: [["Output 1", "Sine · 100 kHz · 200 mVpp", "Sine · 100 kHz · 200 mVpp"], ["Output 2", "Sine · 10 MHz · 700 mVpp", "Sine · 10 MHz · 700 mVpp"]] },
          { do: "חברו את מוצא המשדר (S של מפצל 2) לסקופ.", do_en: "Connect the transmitter output (S of splitter 2) to the scope.",
            q: ["מה ההבדל בין האות שקיבלתם כאן לבין DSB-SC מחלק 1?", "מדדו \\(V_{max}\\) ו-\\(V_{min}\\) וחשבו את עומק האפנון."], q_en: ["How does this signal differ from the DSB-SC of Part 1?", "Measure \\(V_{max}\\) and \\(V_{min}\\) and compute the modulation depth."],
            set: [["Scope", "Cursors → Y1 = Vmax · Y2 = Vmin", "Cursors → Y1 = Vmax · Y2 = Vmin"]], fig: [3] },
          { do: "העבירו את המוצא לנתח הספקטרום.", do_en: "Move the output to the spectrum analyzer.",
            q: ["אילו תדרים רואים? השוו לחלק 1.", "מה המרחק בין הקווים?", "מופיעים גם קווים לא צפויים – ציינו אותם ונסו להסביר (אי-לינאריות של המיקסר, הרמוניות)."], q_en: ["Which frequencies do you see? Compare with Part 1.", "What is the spacing between the lines?", "Some unexpected lines also appear – list them and try to explain them (mixer nonlinearity, harmonics)."],
            fig: [4] },
        ],
      },
      {
        title: "חלק 3 – AM מהמחולל: עומק אפנון והספק", title_en: "Part 3 – AM from the generator: depth and power",
        goal: "מייצרים AM עם האפנון הפנימי של המחולל (בלי מיקסר), משנים את עומק האפנון ומודדים איך מתחלק ההספק.", goal_en: "Generate AM with the generator's internal modulation (no mixer), vary the depth and measure how the power is split.",
        steps: [
          { do: "הכינו את נתח הספקטרום למדידת מתחים גבוהים:", do_en: "Prepare the spectrum analyzer for higher voltages:",
            set: [["Spectrum", "Amplitude → Attenuation → Auto", "Amplitude → Attenuation → Auto"], ["Spectrum", "Amplitude → Reference Level → 2 V", "Amplitude → Reference Level → 2 V"]] },
          { do: "השתמשו ביציאה אחת בלבד וחברו אותה לסקופ. עצרו את התצוגה.", do_en: "Use a single output and connect it to the scope. Stop the acquisition.",
            set: [["Output 1", "Sine · 10 MHz · 1 Vrms", "Sine · 10 MHz · 1 Vrms"], ["Modulate", "On · Type AM · Depth 50% · AM Freq 100 kHz", "On · Type AM · Depth 50% · AM Freq 100 kHz"]] },
          { do: "שנו את עומק האפנון ל-30%, 70% ו-100%. בכל פעם הריצו ועצרו את הסקופ.", do_en: "Change the depth to 30%, 70% and 100%. Each time, run and stop the scope.",
            q: ["מה קורה לאות כשהעומק גדל? מה קורה ב-100%?", "מדדו בכל מקרה \\(V_{max}, V_{min}\\) ובדקו שהנוסחה לעומק האפנון נותנת את הערך שקבעתם."], q_en: ["What happens to the signal as the depth increases? What happens at 100%?", "For each case measure \\(V_{max}, V_{min}\\) and check that the depth formula gives the value you set."],
            fig: [5], sim: true },
          { do: "כבו את Modulate וחברו את המחולל לנתח הספקטרום. העבירו את ציר Y ל-Volts.", do_en: "Turn Modulate off and connect the generator to the spectrum analyzer. Switch the Y axis to Volts.",
            q: ["כמה מתח נותן המחולל? (זה הגל הנושא בלבד)"], q_en: ["What voltage does the generator give? (carrier only)"] },
          { do: "הדליקו את Modulate בעומק 100%.", do_en: "Turn Modulate on at 100% depth.",
            fig: [7],
            q: ["אילו תדרים רואים?", "מדדו את המתח של שלושת הקווים. מה סכומם? השוו לסעיף הקודם.", "כמה מתח יש בסך הכול, וכמה ממנו במידע (פסי הצד)?"], q_en: ["Which frequencies do you see?", "Measure the voltage of the three lines. What is their sum? Compare with the previous step.", "How much voltage is there in total, and how much of it is in the message (sidebands)?"], table: true },
          { do: "חזרו על המדידה בעומק 30%, 50% ו-70%, ומלאו את הטבלה.", do_en: "Repeat the measurement at 30%, 50% and 70% depth and fill in the table.",
            q: ["מה המסקנה? השוו ליעילות התאורטית \\(\\eta = k_a^2/(2+k_a^2)\\) – שימו לב שהיא מחושבת מהספקים, לא ממתחים."], q_en: ["What do you conclude? Compare with the theoretical efficiency \\(\\eta = k_a^2/(2+k_a^2)\\) – note that it is a power ratio, not a voltage ratio."], table: true, fig: [6] },
          { do: "עברו ל-DSB-SC: More → DSSC On, והחזירו את העומק ל-100%.", do_en: "Switch to DSB-SC: More → DSSC On, and set the depth back to 100%.",
            q: ["מה רואים בספקטרום? כמה מתח יש עכשיו במידע?"], q_en: ["What do you see on the spectrum? How much voltage is in the message now?"], fig: [7] },
          { do: "סכמו את ההשוואה בין שתי השיטות.", do_en: "Summarize the comparison between the two methods.",
            q: ["איזו שיטת אפנון יעילה יותר מבחינת ניצול ההספק? נמקו.", "אם כך, למה משתמשים גם בשיטה הפחות יעילה? (רמז: מה צריך המקלט?)"], q_en: ["Which method uses power more efficiently? Explain.", "Then why is the less efficient method used at all? (Hint: what does the receiver need?)"] },
        ],
      },
      {
        title: "חלק 4 – המקלט הסינכרוני", title_en: "Part 4 – The synchronous receiver",
        goal: "מכפילים את אות ה-AM במתנד מקומי ומסננים – ורואים איך פאזה ותדר של המתנד משפיעים על המידע.", goal_en: "Multiply the AM signal by a local oscillator and filter it – and see how the LO phase and frequency affect the message.",
        diagram: "setup4.svg",
        steps: [
          { do: "חברו את המערכת לפי הסכמה. Output 1 משמש כמשדר (אות AM) ו-Output 2 כמתנד המקומי של המקלט. אנחנו משדרים מידע של 1 kHz על גל נושא של 10 MHz.", do_en: "Wire the system as in the diagram. Output 1 is the transmitter (AM signal) and Output 2 is the receiver's local oscillator. We send a 1 kHz message on a 10 MHz carrier.",
            set: [["Output 1", "10 MHz · 200 mVpp · Modulate On · AM · Depth 50% · AM Freq 1 kHz", "10 MHz · 200 mVpp · Modulate On · AM · Depth 50% · AM Freq 1 kHz"], ["Output 2", "Sine · 10 MHz · 350 mVpp", "Sine · 10 MHz · 350 mVpp"]] },
          { do: "בעזרת נתח הספקטרום מדדו את התדרים בכל אחת מ-4 הנקודות המסומנות בסכמה.", do_en: "Use the spectrum analyzer to measure the frequencies at each of the 4 marked points.",
            set: [["Points 1–2", "Center 10 MHz · Span 20 kHz", "Center 10 MHz · Span 20 kHz"], ["Point 3", "Start 9 kHz · Stop 25 MHz", "Start 9 kHz · Stop 25 MHz"]],
            q: ["אילו תדרים יש בנקודות 1, 2 ו-3? הסבירו כל אחד מהם.", "מה צפוי בנקודה 4, ולמה מודדים אותה בסקופ?"], q_en: ["Which frequencies are present at points 1, 2 and 3? Explain each one.", "What do you expect at point 4, and why is it measured with the scope?"], fig: [8],
            hint: "בנקודה 3 מצפים לרכיבים סביב 0 (המידע) וסביב 20 MHz. נתח הספקטרום מתחיל ב-9 kHz, ולכן את המידע ב-1 kHz (נקודה 4) מודדים בסקופ – או ב-FFT של הסקופ (Math → FFT).", hint_en: "At point 3 expect components near 0 (the message) and near 20 MHz. The spectrum analyzer starts at 9 kHz, so the 1 kHz message (point 4) is measured on the scope – or with the scope's FFT (Math → FFT)." },
          { do: "חברו את מוצא המקלט (נקודה 4) לסקופ.", do_en: "Connect the receiver output (point 4) to the scope.",
            set: [["Scope", "Time 500 µs/div · Measure → Frequency, Pk-Pk", "Time 500 µs/div · Measure → Frequency, Pk-Pk"]],
            q: ["מה רואים? האם שחזרנו את המידע? מה התדר והמשרעת שלו?"], q_en: ["What do you see? Did we recover the message? What are its frequency and amplitude?"], fig: [9] },
          { do: "שנו את הפאזה של Output 2. קודם מצאו את הפאזה שבה המידע במשרעת מקסימלית והגדירו אותה כ-0° (הפאזה שמוצגת במחולל אינה הפאזה האמיתית בין האותות). משם הזיזו ל-30°, 60° ו-90°.", do_en: "Change the phase of Output 2. First find the phase at which the message amplitude is largest and call it 0° (the phase shown on the generator is not the true phase between the signals). From there, move to 30°, 60° and 90°.",
            q: ["מה קורה למידע בכל אחד מהפרשי הפאזה?", "הסבירו מתמטית: הראו שהמשרעת פרופורציונית ל-\\(\\cos\\phi\\) והשוו למדידה."], q_en: ["What happens to the message at each phase difference?", "Explain mathematically: show that the amplitude is proportional to \\(\\cos\\phi\\) and compare with your measurement."],
            fig: [10], table2: true, sim: "rx" },
          { do: "החזירו את הפאזה ל-0° ושנו את התדר של Output 2 ל-10.000002 MHz. בסקופ ספרו כמה פעמים בשנייה המידע נעלם.", do_en: "Set the phase back to 0° and change the Output 2 frequency to 10.000002 MHz. On the scope, count how many times per second the message vanishes.",
            set: [["Scope", "Time 100 ms/div · Roll mode", "Time 100 ms/div · Roll mode"]], fig: [11],
            q: ["מה קורה עכשיו למידע? באיזה קצב?", "הסבירו מתמטית למה זה קורה."], q_en: ["What happens to the message now? At what rate?", "Explain mathematically why this happens."],
            hint: "הפרש התדרים הוא 2 Hz, ולכן הפאזה בין המשדר למקלט מסתובבת פעמיים בשנייה – והמידע מוכפל ב-\\(\\cos(2\\pi\\cdot 2\\cdot t)\\). למכפלה הזו 4 נקודות אפס בשנייה.", hint_en: "The frequency difference is 2 Hz, so the phase between transmitter and receiver rotates twice per second – and the message is multiplied by \\(\\cos(2\\pi\\cdot 2\\cdot t)\\), which has 4 nulls per second." },
          { do: "סכמו.", do_en: "Conclude.",
            q: ["מה המסקנה לגבי תכנון מקלט סינכרוני? איך מקלט אמיתי פותר את הבעיה?"], q_en: ["What do you conclude about designing a synchronous receiver? How does a real receiver solve the problem?"] },
        ],
      },
    ],

    /* האיורים שמגישים: מספר, חלק, מה רואים, הגדרות, ומה בודקים מול התאוריה */
    figRules: [
      "כל איור ממוספר ועם כיתוב: מה רואים ובאילו הגדרות (Span, RBW, time/div, V/div).",
      "צילומי מסך נשמרים מהמכשיר (Save → Image), לא מצולמים בטלפון.",
      "כשמשווים כמה מצבים – אותו קנה מידה בכל התמונות.",
      "בגרפים מ-MATLAB: כותרת, צירים עם יחידות, מקרא ורשת. מדידות כנקודות, תאוריה כקו.",
      "ליד כל איור: משפט אחד שמשווה לתאוריה, עם מספרים.",
    ],
    figRules_en: [
      "Every figure is numbered and has a caption: what it shows and the settings (Span, RBW, time/div, V/div).",
      "Screenshots are saved from the instrument (Save → Image), not photographed with a phone.",
      "When comparing several cases – use the same scale in every image.",
      "MATLAB graphs: title, axes with units, legend and grid. Measurements as markers, theory as a line.",
      "Next to every figure: one sentence that compares it with theory, with numbers.",
    ],
    figures: [
      { n: 1, part: 1, kind: "spec", t: "ספקטרום DSB-SC במוצא המיקסר", t_en: "DSB-SC spectrum at the mixer output",
        set: "Center 10 MHz · Span 500 kHz", show: "Markers על 9.9 MHz ו-10.1 MHz עם הרמה ב-dBm, וגם על הקו ב-10 MHz (דליפת LO).", show_en: "Markers on 9.9 MHz and 10.1 MHz with their level in dBm, and on the 10 MHz line (LO leakage).",
        check: "שני קווים שווים ב-\\(f_c \\pm f_m\\). בכמה dB נמוכה דליפת ה-LO מפסי הצד?", check_en: "Two equal lines at \\(f_c \\pm f_m\\). How many dB below the sidebands is the LO leakage?" },
      { n: 2, part: 1, kind: "scope", t: "DSB-SC בסקופ", t_en: "DSB-SC on the scope",
        set: "2 µs/div", show: "2 מחזורים של המידע. סמנו נקודה שבה המעטפת נוגעת באפס.", show_en: "Two message periods. Mark a point where the envelope touches zero.",
        check: "המעטפת היא \\(|m(t)|\\) וחוזרת כל 5 µs, אבל תדר המידע הוא 100 kHz.", check_en: "The envelope is \\(|m(t)|\\) and repeats every 5 µs, but the message is 100 kHz." },
      { n: 3, part: 2, kind: "scope", t: "AM מהמשדר שבניתם", t_en: "AM from the transmitter you built",
        set: "2 µs/div · Cursors", show: "Cursors על \\(V_{max}\\) ו-\\(V_{min}\\) של המעטפת, עם הערכים בכיתוב.", show_en: "Cursors on the envelope \\(V_{max}\\) and \\(V_{min}\\), with the values in the caption.",
        check: "עומק האפנון \\(k_a\\) מהנוסחה.", check_en: "The depth \\(k_a\\) from the formula." },
      { n: 4, part: 2, kind: "spec", t: "ספקטרום ה-AM מהמשדר שבניתם", t_en: "Spectrum of the AM from your transmitter",
        set: "Center 10 MHz · Span 500 kHz", show: "Markers על שלושת הקווים. סמנו בחץ קווים לא צפויים.", show_en: "Markers on the three lines. Point out any unexpected lines with an arrow.",
        check: "היחס בין פס צד לגל הנושא צריך להיות \\(20\\log_{10}(k_a/2)\\) dB. האם זה מתאים ל-\\(k_a\\) מאיור 3?", check_en: "The sideband-to-carrier ratio should be \\(20\\log_{10}(k_a/2)\\) dB. Does it match \\(k_a\\) from Figure 3?" },
      { n: 5, part: 3, kind: "scope", t: "עומק אפנון 30%, 50%, 70%, 100% – לוח 2×2", t_en: "Depth 30%, 50%, 70%, 100% – a 2×2 panel",
        set: "אותו V/div ו-time/div בכל הארבעה", set_en: "Same V/div and time/div in all four", show: "בכל תמונה: \\(V_{max}\\), \\(V_{min}\\) והעומק שחישבתם.", show_en: "In each image: \\(V_{max}\\), \\(V_{min}\\) and the depth you computed.",
        check: "העומק המחושב מול העומק שהוגדר במחולל. מה קורה למעטפת ב-100%?", check_en: "Computed depth versus the depth set on the generator. What happens to the envelope at 100%?" },
      { n: 6, part: 3, kind: "graph", t: "גרף: חלק ההספק בפסי הצד מול עומק האפנון", t_en: "Graph: power fraction in the sidebands versus depth",
        set: "lab03_report_plots.m", show: "4 נקודות מדידה מטבלה 1, ועקומת התאוריה \\(\\eta = k_a^2/(2+k_a^2)\\) מ-0 עד 100%.", show_en: "4 measured points from Table 1, and the theory curve \\(\\eta = k_a^2/(2+k_a^2)\\) from 0 to 100%.",
        check: "המקסימום 33% ב-100%. מה השגיאה היחסית בכל נקודה?", check_en: "Maximum 33% at 100%. What is the relative error at each point?" },
      { n: 7, part: 3, kind: "spec", t: "AM מול DSB-SC בנתח הספקטרום, זה לצד זה", t_en: "AM versus DSB-SC on the analyzer, side by side",
        set: "Y axis: Volts · אותו Ref Level", set_en: "Y axis: Volts · same Ref Level", show: "AM בעומק 100%, ו-DSB-SC (DSSC On). Markers על כל הקווים.", show_en: "AM at 100% depth, and DSB-SC (DSSC On). Markers on every line.",
        check: "ב-DSB-SC הגל הנושא נעלם וכל המתח בפסי הצד.", check_en: "In DSB-SC the carrier disappears and all the voltage is in the sidebands." },
      { n: 8, part: 4, kind: "spec", t: "הספקטרום בנקודות 1–3 של המקלט", t_en: "The spectrum at receiver points 1–3",
        set: "1–2: Span 20 kHz · 3: 9 kHz–25 MHz", show: "שלוש תמונות. בנקודה 3 סמנו את הרכיב סביב 20 MHz.", show_en: "Three images. At point 3 mark the component around 20 MHz.",
        check: "בנקודה 3: \\(2f_c\\) ופסי הצד שלו, והמידע ליד 0 (מתחת לטווח של הנתח).", check_en: "At point 3: \\(2f_c\\) with its sidebands, and the message near 0 (below the analyzer's range)." },
      { n: 9, part: 4, kind: "scope", t: "המידע המשוחזר במוצא המקלט (נקודה 4)", t_en: "The recovered message at the receiver output (point 4)",
        set: "500 µs/div · Measure", show: "Measure של Frequency ו-Pk-Pk על המסך.", show_en: "Frequency and Pk-Pk measurements on the screen.",
        check: "תדר 1 kHz. מה המשרעת הצפויה לפי \\(\\tfrac12 m(t)\\cos\\phi\\) ואיבודי המיקסר?", check_en: "1 kHz. What amplitude do you expect from \\(\\tfrac12 m(t)\\cos\\phi\\) and the mixer loss?" },
      { n: 10, part: 4, kind: "graph", t: "גרף: משרעת המידע מול פאזת המתנד", t_en: "Graph: message amplitude versus LO phase",
        set: "lab03_report_plots.m", show: "4 נקודות מטבלה 2 (מנורמלות ל-0°) ועקומת \\(\\cos\\phi\\) מ-0° עד 90°. מצרפים גם 4 צילומי מסך בלוח אחד.", show_en: "4 points from Table 2 (normalized to 0°) and the \\(\\cos\\phi\\) curve from 0° to 90°. Attach the 4 screenshots as one panel too.",
        check: "ב-90° המידע כמעט נעלם. כמה רחוקה כל נקודה מ-\\(\\cos\\phi\\)?", check_en: "At 90° the message almost vanishes. How far is each point from \\(\\cos\\phi\\)?" },
      { n: 11, part: 4, kind: "scope", t: "המידע עם שגיאת תדר של 2 Hz", t_en: "The message with a 2 Hz frequency error",
        set: "100 ms/div · Roll", show: "שנייה אחת על המסך. סמנו את נקודות האפס של המעטפת.", show_en: "One second on the screen. Mark the envelope nulls.",
        check: "4 נקודות אפס בשנייה: המעטפת היא \\(|\\cos(2\\pi\\Delta f\\,t)|\\) עם \\(\\Delta f\\) = 2 Hz.", check_en: "4 nulls per second: the envelope is \\(|\\cos(2\\pi\\Delta f\\,t)|\\) with \\(\\Delta f\\) = 2 Hz." },
    ],

    /* כתיבת הדוח והגשה במודל */
    report: {
      lead: "הדוח הוא דוח מעבדה אקדמי: מי שלא היה במעבדה צריך להבין ממנו מה נבדק, איך נמדד, מה יצא ומה זה אומר. כותבים במילים שלכם, בעברית או באנגלית, ומגישים קובץ PDF אחד במודל של הקורס.",
      lead_en: "The report is an academic lab report: someone who was not in the lab must be able to understand what was tested, how it was measured, what came out and what it means. Write in your own words, in Hebrew or English, and submit a single PDF file on the course Moodle.",
      sections: [
        ["עמוד שער", "שם המוסד והמחלקה, שם הקורס ומספרו (130661), מספר המעבדה ושמה, שמות המגישים ומספרי ת״ז, מספר קבוצה, תאריך הביצוע ותאריך ההגשה, ושם המרצה.",
         "Title page", "Institution and department, course name and number (130661), lab number and title, names and ID numbers of the authors, group number, date of the lab and of submission, and the lecturer's name."],
        ["תקציר", "5–8 שורות: מה נבדק, באיזו שיטה, התוצאות העיקריות במספרים (למשל: חלק ההספק בפסי הצד ב-100% נמדד 32.0% מול 33.3% בתאוריה), ומסקנה אחת. כותבים אותו אחרון.",
         "Abstract", "5–8 lines: what was tested, how, the main results with numbers (for example: the sideband power share at 100% was measured as 32.0% versus 33.3% in theory), and one conclusion. Write it last."],
        ["מבוא ורקע תאורטי", "מטרות הניסוי, ורקע קצר במילים שלכם: אות AM במישור הזמן והתדר, DSB-SC, חלוקת ההספק והמקלט הסינכרוני. משוואות ממוספרות – (1), (2) – ומפנים אליהן בטקסט. לא מעתיקים את המדריך.",
         "Introduction and background", "The goals, and a short background in your own words: AM in time and frequency, DSB-SC, the power split and the synchronous receiver. Number the equations – (1), (2) – and refer to them in the text. Do not copy the guide."],
        ["מערך הניסוי ושיטת המדידה", "רשימת הציוד עם דגמים, סכמת חיבורים לכל חלק (אפשר להשתמש בסכמות מהמדריך עם הפניה), וההגדרות של המחולל, הסקופ ונתח הספקטרום.",
         "Setup and method", "The equipment with model numbers, a wiring diagram for each part (you may reuse the guide's diagrams with a reference), and the settings of the generator, scope and spectrum analyzer."],
        ["תוצאות", "לפי חלקים 1–4 בסדר: איורים 1–11 עם כיתוב, טבלאות 1–2, וגרפי MATLAB (איורים 6 ו-10). התשובות לשאלות שמסומנות 'לדוח' נכתבות ליד האיור המתאים. כל איור וטבלה מוזכרים בטקסט.",
         "Results", "Part by part, in order: Figures 1–11 with captions, Tables 1–2 and the MATLAB graphs (Figures 6 and 10). Answer the questions marked 'for the report' next to the relevant figure. Every figure and table is mentioned in the text."],
        ["דיון", "השוואה בין המדידה לתאוריה עם שגיאה יחסית באחוזים \\(\\varepsilon = |x_{meas}-x_{th}|/x_{th}\\cdot 100\\%\\). הסבירו את מקורות השגיאה: דליפת LO, אי-לינאריות של המיקסר, איבודי המפצלים, עומסים, דיוק הקריאה. מה הפתיע אתכם?",
         "Discussion", "Compare measurement with theory, with the relative error in percent \\(\\varepsilon = |x_{meas}-x_{th}|/x_{th}\\cdot 100\\%\\). Explain the error sources: LO leakage, mixer nonlinearity, splitter loss, loading, reading accuracy. What surprised you?"],
        ["מסקנות", "4–6 נקודות קצרות שעונות על מטרות הניסוי: AM מול DSB-SC, יעילות ההספק, והדרישות ממקלט סינכרוני.",
         "Conclusions", "4–6 short points that answer the lab goals: AM versus DSB-SC, power efficiency, and the requirements of a synchronous receiver."],
        ["מקורות", "רשימה ממוספרת בסגנון IEEE, והפניות בטקסט בסוגריים מרובעים [1]. למשל: [1] S. Haykin and M. Moher, <i>Introduction to Analog and Digital Communications</i>, 2nd ed. Wiley, 2007. ‏[2] Mini-Circuits, ZAD-6+ mixer datasheet.",
         "References", "A numbered list in IEEE style, cited in the text in square brackets [1]. For example: [1] S. Haykin and M. Moher, <i>Introduction to Analog and Digital Communications</i>, 2nd ed. Wiley, 2007. [2] Mini-Circuits, ZAD-6+ mixer datasheet."],
        ["נספחים", "קוד MATLAB שכתבתם או שיניתם, קובצי הנתונים (CSV) וחישובים ארוכים. לא חלק ממגבלת העמודים.",
         "Appendices", "MATLAB code you wrote or changed, the data files (CSV) and long calculations. Not counted in the page limit."],
      ],
      style: [
        "עד 12 עמודים בלי הנספחים. גופן 12, ריווח 1.5, שוליים 2.5 ס״מ, מספרי עמודים.",
        "איור – כיתוב מתחת לאיור (\"איור 3: אות AM בסקופ, 2 µs/div\"). טבלה – כותרת מעל הטבלה.",
        "כל מספר עם יחידות SI ובדיוק סביר (2–3 ספרות משמעותיות).",
        "משוואות בעורך משוואות (Word או LaTeX), לא צילום של כתב יד.",
        "כותבים בזמן עבר על מה שנעשה, ובזמן הווה על התאוריה.",
        "כל מה שלקוח ממקור – עם הפניה. דוחות של קבוצות אחרות אינם מקור.",
      ],
      style_en: [
        "Up to 12 pages without the appendices. 12 pt font, 1.5 line spacing, 2.5 cm margins, page numbers.",
        "Figures – caption below the figure (\"Figure 3: AM signal on the scope, 2 µs/div\"). Tables – title above the table.",
        "Every number with SI units and sensible precision (2–3 significant digits).",
        "Equations with an equation editor (Word or LaTeX), not a photo of handwriting.",
        "Use the past tense for what you did and the present tense for theory.",
        "Anything taken from a source needs a citation. Other groups' reports are not a source.",
      ],
      submit: [
        ["ייצאו את הדוח ל-PDF: ב-Word – File → Save As → PDF; ב-Overleaf – Download PDF. לא מגישים docx או תמונות.", "Export the report to PDF: in Word – File → Save As → PDF; in Overleaf – Download PDF. Do not submit docx or images."],
        ["תנו לקובץ שם לפי התבנית:", "Name the file using this pattern:", "Lab03_AM_<ID1>_<ID2>.pdf"],
        ["פתחו את ה-PDF ובדקו: האיורים קריאים, העברית והנוסחאות תקינות, וכל העמודים שם.", "Open the PDF and check: the figures are readable, the text and equations render correctly, and every page is there."],
        ["במודל של הקורס היכנסו למטלה \"דוח מעבדה 3\", לחצו \"הוספת הגשה\", גררו את הקובץ ולחצו \"שמירת שינויים\". אם מופיע כפתור \"הגשה לבדיקה\" – לחצו גם עליו.", "On the course Moodle open the assignment \"Lab report 3\", click \"Add submission\", drag in the file and click \"Save changes\". If there is a \"Submit assignment\" button, click it too."],
        ["ודאו שהסטטוס הוא \"הוגש לציון\". מגישים עד המועד שמופיע במטלה במודל.", "Make sure the status reads \"Submitted for grading\". Submit by the deadline shown in the Moodle assignment."],
      ],
      check: [
        ["עמוד שער מלא, כולל ת״ז ומספר קבוצה", "Complete title page, including IDs and group number"],
        ["תקציר עם התוצאות העיקריות במספרים", "Abstract with the main results in numbers"],
        ["משוואות ממוספרות ומוזכרות בטקסט", "Equations numbered and referred to in the text"],
        ["כל 11 האיורים, עם כיתוב, ומוזכרים בטקסט", "All 11 figures, with captions, referred to in the text"],
        ["טבלאות 1 ו-2 עם כותרות ויחידות", "Tables 1 and 2 with titles and units"],
        ["שני גרפי MATLAB – מדידה מול תאוריה", "Both MATLAB graphs – measurement versus theory"],
        ["תשובות לכל השאלות שמסומנות 'לדוח'", "Answers to every question marked 'for the report'"],
        ["דיון עם שגיאות באחוזים ומקורות שגיאה", "Discussion with percent errors and error sources"],
        ["מסקנות ורשימת מקורות", "Conclusions and a reference list"],
        ["קובץ PDF אחד בשם הנכון, הועלה למודל", "One PDF with the right name, uploaded to Moodle"],
      ],
    },

    files: [
      { file: "lab03_am_explore.m", d: "לפני המעבדה: מייצר AM ו-DSB-SC, מציג זמן ותדר ומחשב את חלוקת ההספק. שנו את \\(k_a\\) ובדקו את שאלת הכנה 2.", d_en: "Before the lab: generates AM and DSB-SC, plots time and frequency and computes the power split. Change \\(k_a\\) and check preparation question 2." },
      { file: "lab03_coherent_receiver.m", d: "סימולציה של חלק 4: מקלט סינכרוני עם שגיאת פאזה ושגיאת תדר. השוו לסקופ.", d_en: "Simulation of Part 4: a synchronous receiver with phase and frequency errors. Compare with the scope." },
      { file: "lab03_report_plots.m", d: "אחרי המעבדה: קורא את שתי טבלאות ה-CSV מהאתר ומצייר את איורים 6 ו-10 – מדידה מול תאוריה – ושומר אותם כ-PNG לדוח.", d_en: "After the lab: reads the two CSV tables from the site, draws Figures 6 and 10 – measurement versus theory – and saves them as PNG for the report." },
      { file: "lab03_scope_analysis.m", d: "אחרי המעבדה: טוען קובץ CSV מהסקופ, מוצא את המעטפת, מחשב \\(V_{max}, V_{min}\\) ועומק אפנון ומציג ספקטרום.", d_en: "After the lab: loads a scope CSV file, finds the envelope, computes \\(V_{max}, V_{min}\\) and the depth, and plots the spectrum." },
    ],
  },
  {
    id: "sdr-intro",
    course: "comm-lab",
    dir: "labs/sdr_spectrum",
    title: "ניסוי מקדים: היכרות עם ה-SDR – מה רואים באוויר",
    title_en: "Pre-lab: Meet the SDR – what you can see on the air",
    summary: "החיבור הראשון ל-ADALM-Pluto: קובעים רק תדר מרכזי וקצב דגימה, רואים ספקטרום ו-waterfall, מודדים רוחב סרט של תחנות במישור הזמן והתדר, ומקליטים את השלט של הרכב – בלי לפענח.",
    summary_en: "The first connection to the ADALM-Pluto: set only the center frequency and the sample rate, see a spectrum and a waterfall, measure the bandwidth of stations in time and frequency, and record a car remote – without decoding it.",
    time: "שעה", time_en: "1 hour",
    tags: ["sdr", "spectrum"],
    goals: [
      "להתחבר ל-SDR ולקבוע את שתי ההגדרות הבסיסיות: תדר מרכזי וקצב דגימה.",
      "לקרוא ספקטרום ו-waterfall: איפה יש אות, האם הוא רציף או בפרצים, ובערך כמה הוא רחב.",
      "להכיר את המפה: אילו שירותים נמצאים איפה בספקטרום, ומה מהם אפשר לפענח.",
      "למדוד רוחב סרט של תחנות שונות (FM ועוד) ולצלם כל אחת במישור הזמן ובמישור התדר.",
      "להקליט שלט של רכב או שער ולראות את הלחיצות – בלי לפענח ובלי לשדר.",
    ],
    goals_en: [
      "Connect to the SDR and set the two basic settings: center frequency and sample rate.",
      "Read a spectrum and a waterfall: where there is a signal, whether it is continuous or bursty, and roughly how wide it is.",
      "Learn the map: which services sit where in the spectrum, and which of them can be decoded.",
      "Measure the bandwidth of different stations (FM and more) and capture each one in the time and frequency domains.",
      "Record a car or gate remote and see the presses – without decoding and without transmitting.",
    ],
    equipment: ["ADALM-Pluto עם אנטנה", "כבל micro-USB לנתונים", "מחשב עם MATLAB וחבילת התמיכה ל-ADALM-Pluto", "שלט של רכב או של שער (שלכם)"],
    equipment_en: ["ADALM-Pluto with an antenna", "micro-USB data cable", "Computer with MATLAB and the ADALM-Pluto support package", "A car or gate remote (your own)"],
    prepNote: "הכול בקובץ אחד: <code dir='ltr'>sdr_intro.m</code>. בבית אפשר להריץ אותו <b>בלי רדיו</b> – משנים בשורה הראשונה ל-<code dir='ltr'>USE_PLUTO = false</code> ורואים סימולציה של אותו מסך.",
    prepNote_en: "Everything is in one file: <code>sdr_intro.m</code>. At home you can run it <b>without a radio</b> – change the first line to <code>USE_PLUTO = false</code> and you see a simulation of the same screen.",

    theory: [
      {
        h: "SDR בשני מספרים", h_en: "An SDR in two numbers",
        fig: "pluto_rx.svg",
        body: String.raw`<p><b>SDR</b> (Software Defined Radio) הוא מקלט שהחומרה שלו רק קולטת ודוגמת את האות – וכל השאר נעשה במחשב. בניסוי הזה קובעים רק שני מספרים:</p>
<ul><li><b>תדר מרכזי \(f_c\)</b> – איפה מסתכלים. זה אמצע המסך.</li>
<li><b>קצב דגימה \(f_s\)</b> – כמה רחב מסתכלים. המסך מראה בדיוק \(f_s\).</li></ul>
$$f_c - \tfrac{f_s}{2} \quad \longrightarrow \quad f_c + \tfrac{f_s}{2}$$
<p>דוגמה: \(f_c\) = ⁦433.5 MHz⁩ ו-\(f_s\) = ⁦2 MSPS⁩ ← רואים מ-⁦432.5⁩ עד ⁦434.5 MHz⁩. את ההגבר הרדיו קובע לבד (AGC), אז בינתיים לא צריך לחשוב עליו.</p>
<p class="note">קו קבוע בדיוק באמצע המסך הוא של הרדיו עצמו (DC), לא אות מהאוויר. לכן מכוונים קצת לצד של מה שרוצים לראות.</p>`,
        body_en: String.raw`<p>An <b>SDR</b> (Software Defined Radio) is a receiver whose hardware only picks up and samples the signal – everything else happens in the computer. In this pre-lab you set only two numbers:</p>
<ul><li><b>Center frequency \(f_c\)</b> – where you look. It is the middle of the screen.</li>
<li><b>Sample rate \(f_s\)</b> – how wide you look. The screen shows exactly \(f_s\).</li></ul>
$$f_c - \tfrac{f_s}{2} \quad \longrightarrow \quad f_c + \tfrac{f_s}{2}$$
<p>Example: \(f_c\) = 433.5 MHz and \(f_s\) = 2 MSPS → you see 432.5 to 434.5 MHz. The radio sets the gain by itself (AGC), so you don't need to think about it yet.</p>
<p class="note">A fixed line exactly in the middle of the screen belongs to the radio itself (DC), not to the air. That is why you tune a little to the side of what you want to see.</p>`,
      },
      {
        h: "איך קוראים את המסך", h_en: "How to read the screen",
        fig: "intro_live.png",
        body: String.raw`<p><b>למעלה – ספקטרום:</b> עוצמה כפונקציה של תדר, ברגע הזה. "גבעה" = אות. ככל שהיא רחבה יותר, האות תופס יותר רוחב סרט.</p>
<p><b>למטה – waterfall:</b> כל שורה היא רגע אחד, החדש למעלה, והצבע הוא העוצמה. אות רציף (רדיו, סלולר) הוא פס אנכי קבוע. אות בפרצים (שלט, Wi-Fi) מופיע כמקפים קצרים שבאים והולכים.</p>
<p>באיור (סימולציה): השלט ב-⁦433.92 MHz⁩ בזמן לחיצה, הקו של הרדיו באמצע (⁦433.5 MHz⁩), והעתק חלש שלו בצד השני (image).</p>`,
        body_en: String.raw`<p><b>Top – spectrum:</b> power versus frequency, right now. A "hill" = a signal. The wider it is, the more bandwidth the signal takes.</p>
<p><b>Bottom – waterfall:</b> each row is one moment, newest on top, and the color is the power. A continuous signal (radio, cellular) is a steady vertical stripe. A bursty signal (a remote, Wi-Fi) appears as short dashes that come and go.</p>
<p>In the figure (simulation): the remote at 433.92 MHz while pressed, the radio's own line in the middle (433.5 MHz), and a weak copy of the remote on the other side (the image).</p>`,
      },
      {
        h: "רוחב סרט, במישור הזמן ובמישור התדר", h_en: "Bandwidth, in the time and frequency domains",
        fig: "intro_station.png",
        body: String.raw`<p>סעיף 4 בסקריפט מצלם תחנה אחת בשני מישורים ומודד את רוחב הסרט שלה:</p>
<ul><li><b>במישור הזמן</b> (למעלה): I, ‏Q ו-\(|x|\). מכוונים ⁦300 kHz⁩ מתחת לתחנה, ולכן I ו-Q מסתובבים ב-⁦300 kHz⁩. ב-FM המשרעת \(|x|\) כמעט קבועה – המידע נמצא בתדר ולא בעוצמה.</li>
<li><b>במישור התדר</b> (למטה): הספקטרום, ועליו שני מדדים לרוחב הסרט: <b>‎-26 dB</b> – הרוחב שבו הספקטרום יורד ⁦26 dB⁩ מתחת לשיא (אדום), ו-<b>99%</b> – הרצועה שמכילה 99% מההספק (ירוק).</li></ul>
<p>לתחנת FM מצפים לרוחב לפי כלל קרסון:</p>
$$B \approx 2(\Delta f + W) = 2(75 + 15) = 180\ \text{kHz}$$
<p>בפועל רואים בדרך כלל ⁦150–200 kHz⁩, וזה משתנה עם התוכן. למכשיר קשר PMR446: \(\Delta f\) = ⁦2.5 kHz⁩, \(W\) = ⁦3 kHz⁩ ← בערך ⁦11 kHz⁩.</p>`,
        body_en: String.raw`<p>Section 4 of the script captures one station in two domains and measures its bandwidth:</p>
<ul><li><b>Time domain</b> (top): I, Q and \(|x|\). We tune 300 kHz below the station, so I and Q rotate at 300 kHz. In FM the amplitude \(|x|\) is almost constant – the information is in the frequency, not the strength.</li>
<li><b>Frequency domain</b> (bottom): the spectrum, with two measures of bandwidth: <b>-26 dB</b> – the width where the spectrum drops 26 dB below its peak (red), and <b>99%</b> – the band that holds 99% of the power (green).</li></ul>
<p>For an FM station, Carson's rule predicts:</p>
$$B \approx 2(\Delta f + W) = 2(75 + 15) = 180\ \text{kHz}$$
<p>In practice you usually see 150–200 kHz, and it changes with the content. A PMR446 radio: \(\Delta f\) = 2.5 kHz, \(W\) = 3 kHz → about 11 kHz.</p>`,
      },
      {
        h: "מה יש באוויר – ומה אפשר לפענח", h_en: "What is on the air – and what can be decoded",
        fig: "band_map.png",
        body: String.raw`<ul>
<li><b>שידורי FM</b> (⁦87.5–108 MHz⁩) – אנלוגי, פתוח: אפשר להאזין. דורש רדיו במצב AD9364.</li>
<li><b>תעופה AM</b> (⁦118–137 MHz⁩) ו-<b>PMR446</b> (⁦446 MHz⁩) – דיבור אנלוגי, פתוח.</li>
<li><b>שלטים</b> (⁦433.92 MHz⁩) – דיגיטלי, בפרצים קצרים. משתמשים בקוד מתגלגל (rolling code): <b>רק רואים ומקליטים</b>.</li>
<li><b>ADS-B</b> (⁦1090 MHz⁩) – מטוסים משדרים מיקום, דיגיטלי ופתוח: אפשר לפענח בתוכנה.</li>
<li><b>סלולר (LTE/5G)</b> ו-<b>Wi-Fi</b> (⁦2.4 GHz⁩) – דיגיטלי ומוצפן: רואים את הצורה בלבד.</li>
</ul>
<p class="note">קליטה מותרת בכל תדר. משדרים רק עם רישיון – ובמעבדה הזאת לא משדרים בכלל.</p>`,
        body_en: String.raw`<ul>
<li><b>FM broadcast</b> (87.5–108 MHz) – analog, open: you can listen. Needs the radio in AD9364 mode.</li>
<li><b>Airband AM</b> (118–137 MHz) and <b>PMR446</b> (446 MHz) – analog voice, open.</li>
<li><b>Remotes</b> (433.92 MHz) – digital, short bursts. They use a rolling code: <b>look and record only</b>.</li>
<li><b>ADS-B</b> (1090 MHz) – aircraft broadcast their position, digital and open: it can be decoded in software.</li>
<li><b>Cellular (LTE/5G)</b> and <b>Wi-Fi</b> (2.4 GHz) – digital and encrypted: you see the shape only.</li>
</ul>
<p class="note">Receiving is allowed on any frequency. Transmitting needs a license – and in this lab we do not transmit at all.</p>`,
      },
    ],

    components: [
      { name: "ADALM-Pluto", name_en: "ADALM-Pluto", model: "325 MHz – 3.8 GHz (AD9363)", parts: "1–3",
        role: "הרדיו. מחברים אנטנה לשקע RX ואת הכבל לשקע ה-USB.", role_en: "The radio. Antenna to the RX connector, cable to the USB port.",
        ports: [["RX", "אנטנה", "antenna"], ["USB", "למחשב (השקע עם סמל ה-USB)", "to the computer (the port with the USB symbol)"]],
        tip: "TX לא מחובר. במעבדה הזאת לא משדרים.", tip_en: "TX stays unconnected. We do not transmit in this lab." },
      { name: "שלט של רכב או שער", name_en: "Car or gate remote", model: "433.92 MHz", parts: "3",
        role: "מקור אות שאתם שולטים בו: כל לחיצה היא פרץ קצר של שידור.", role_en: "A signal source you control: every press is a short burst of transmission.",
        ports: [], tip: "רק השלט שלכם, ורק מקליטים. לא משדרים חזרה אות שהוקלט.", tip_en: "Only your own remote, and only record. Never transmit a recorded signal back." },
    ],

    instruments: [
      { h: "הרצה לפי סעיפים", h_en: "Running section by section",
        body: "הקובץ sdr_intro.m מחולק לסעיפים שמתחילים ב-%%. עומדים בתוך סעיף ולוחצים Ctrl+Enter (ב-Mac: Cmd+Enter). כדי להסתכל על תדר אחר: משנים את fc בסעיף 1 ומריצים שוב את סעיפים 1–3.",
        body_en: "The file sdr_intro.m is split into sections that start with %%. Put the cursor inside a section and press Ctrl+Enter (Mac: Cmd+Enter). To look at another frequency: change fc in section 1 and run sections 1–3 again." },
      { h: "אם משהו לא עובד", h_en: "If something does not work",
        body: "'No devices found': בדקו שהכבל בשקע הנכון ושהנורית LED1 מהבהבת, או הריצו sdr_setup_check. 'Radio busy': הריצו release(rx). תדר מתחת ל-325 MHz לא עובד: הרדיו במצב AD9363 – זה תקין לניסוי הזה.",
        body_en: "'No devices found': check the cable is in the right port and LED1 blinks, or run sdr_setup_check. 'Radio busy': run release(rx). A frequency below 325 MHz fails: the radio is in AD9363 mode – that is fine for this pre-lab." },
    ],

    prep: [
      { q: "המקלט מכוון ל-\\(f_c\\) = 433.5 MHz עם \\(f_s\\) = 2 MSPS. איזה תחום תדרים רואים? האם שלט ב-433.92 MHz יופיע על המסך, ובאיזה צד של המרכז?",
        q_en: "The receiver is tuned to \\(f_c\\) = 433.5 MHz with \\(f_s\\) = 2 MSPS. Which frequency range do you see? Will a remote at 433.92 MHz appear, and on which side of the center?", items: [], items_en: [] },
      { q: "רוצים לראות את כל רצועת ה-Wi-Fi, 2400–2483.5 MHz, בתמונה אחת. איזה \\(f_c\\) ואיזה \\(f_s\\) מינימלי צריך?",
        q_en: "You want to see the whole Wi-Fi band, 2400–2483.5 MHz, in one picture. Which \\(f_c\\) and which minimum \\(f_s\\) do you need?", items: [], items_en: [] },
      { q: "לפי כלל קרסון, מה רוחב הסרט הצפוי של תחנת FM (\\(\\Delta f\\) = 75 kHz, \\(W\\) = 15 kHz) ושל מכשיר קשר PMR446 (\\(\\Delta f\\) = 2.5 kHz, \\(W\\) = 3 kHz)?",
        q_en: "Using Carson's rule, what bandwidth do you expect for an FM station (\\(\\Delta f\\) = 75 kHz, \\(W\\) = 15 kHz) and for a PMR446 radio (\\(\\Delta f\\) = 2.5 kHz, \\(W\\) = 3 kHz)?", items: [], items_en: [] },
      { q: "לפי המפה למעלה: לאילו שירותים אפשר להאזין או לפענח, ואילו אפשר רק לראות? למה?",
        q_en: "Using the map above: which services can you listen to or decode, and which can you only see? Why?", items: [], items_en: [] },
    ],

    parts: [
      {
        title: "חלק 1 – חיבור (5 דק׳)", title_en: "Part 1 – Connect (5 min)",
        goal: "מחברים את הרדיו וקובעים את שני המספרים.", goal_en: "Connect the radio and set the two numbers.",
        steps: [
          { do: "חברו אנטנה ל-RX ואת הכבל ל-USB. חכו כ-20 שניות עד ש-LED1 מהבהב.", do_en: "Connect the antenna to RX and the cable to USB. Wait about 20 s until LED1 blinks." },
          { do: "פתחו את sdr_intro.m והריצו את סעיפים 1 ו-2.", do_en: "Open sdr_intro.m and run sections 1 and 2.",
            set: [["fc", "433.5 MHz", "433.5 MHz"], ["fs", "2 MSPS", "2 MSPS"]],
            q: ["איזה תחום תדרים MATLAB הדפיס? האם הוא מתאים לחישוב בשאלת הכנה 1?"], q_en: ["Which frequency range did MATLAB print? Does it match your answer to preparation question 1?"] },
        ],
      },
      {
        title: "חלק 2 – מסתכלים על האוויר (15 דק׳)", title_en: "Part 2 – Look at the air (15 min)",
        goal: "משנים רק את fc (ולפעמים את fs) ומגלים מה יש בכל מקום.", goal_en: "Change only fc (and sometimes fs) and find out what is in each place.",
        steps: [
          { do: "הריצו את סעיף 3 (30 שניות של ספקטרום ו-waterfall חיים). מה רואים ב-⁦433.5 MHz⁩ כשאף אחד לא לוחץ על שלט?", do_en: "Run section 3 (30 seconds of live spectrum and waterfall). What do you see at 433.5 MHz when nobody presses a remote?",
            q: ["מצאו את הקו של הרדיו באמצע המסך. איך יודעים שהוא לא אות מהאוויר?"], q_en: ["Find the radio's line in the middle of the screen. How do you know it is not a signal from the air?"] },
          { do: "עברו בין התדרים: בכל פעם שנו את fc ו-fs בסעיף 1 והריצו שוב את סעיפים 1–3. האיור נשמר לבד כ-live_<fc>MHz.png.", do_en: "Go through the frequencies: each time change fc and fs in section 1 and run sections 1–3 again. The figure is saved by itself as live_<fc>MHz.png.",
            set: [["PMR446", "fc 446.1 MHz · fs 1 MSPS", "fc 446.1 MHz · fs 1 MSPS"], ["ADS-B", "fc 1089 MHz · fs 4 MSPS", "fc 1089 MHz · fs 4 MSPS"], ["LTE", "fc 1842 MHz · fs 20 MSPS", "fc 1842 MHz · fs 20 MSPS"], ["Wi-Fi", "fc 2437 MHz · fs 20 MSPS", "fc 2437 MHz · fs 20 MSPS"]],
            fig: [1, 2],
            q: ["באיזה תדר יש אות רציף, ובאיזה אות בפרצים?", "בערך כמה רחב כל אות? (קראו מציר התדר)"], q_en: ["Where is there a continuous signal, and where a bursty one?", "Roughly how wide is each signal? (read it from the frequency axis)"] },
        ],
      },
      {
        title: "חלק 3 – רוחב סרט של תחנות: זמן ותדר (15 דק׳)", title_en: "Part 3 – Bandwidth of stations: time and frequency (15 min)",
        goal: "מצלמים שלוש תחנות במישור הזמן ובמישור התדר ומודדים את רוחב הסרט של כל אחת.", goal_en: "Capture three stations in the time and frequency domains and measure the bandwidth of each one.",
        diagram: "intro_station.png",
        steps: [
          { do: "בסעיף 4 קבעו את fStation לתחנת FM חזקה והריצו אותו. האיור נשמר לבד כ-station_<f>MHz.png, והמדידה מודפסת.", do_en: "In section 4 set fStation to a strong FM station and run it. The figure is saved by itself as station_<f>MHz.png, and the measurement is printed.",
            set: [["fStation", "FM: ⁦87.5–108 MHz⁩ (AD9364) · אחרת PMR446: ⁦446.05625 MHz⁩", "FM: 87.5–108 MHz (AD9364) · else PMR446: 446.05625 MHz"]],
            fig: [3], table: true,
            q: ["מה רואים במישור הזמן? למה \\(|x|\\) כמעט קבוע?", "מה רוחב הסרט ב-‎-⁦26 dB⁩ וב-99%? השוו לקרסון (שאלת הכנה 3)."], q_en: ["What do you see in the time domain? Why is \\(|x|\\) almost constant?", "What is the -26 dB and the 99% bandwidth? Compare with Carson (preparation question 3)."] },
          { do: "חזרו על סעיף 4 עם עוד שתי תחנות: אחת חלשה, ואחת מסוג אחר (למשל PMR446 או תחנת FM נוספת).", do_en: "Repeat section 4 with two more stations: a weak one, and one of another kind (for example PMR446 or another FM station).",
            fig: [4, 5], table: true,
            q: ["למה תחנה חלשה נראית צרה יותר?", "במה שונה ה-PMR446 מתחנת FM, בזמן ובתדר?"], q_en: ["Why does a weak station look narrower?", "How does PMR446 differ from an FM station, in time and in frequency?"] },
        ],
      },
      {
        title: "חלק 4 – מקליטים שלט (15 דק׳)", title_en: "Part 4 – Record a remote (15 min)",
        goal: "רואים את השלט באוויר, מקליטים שלוש שניות ומסתכלים על הלחיצות. לא מפענחים ולא משדרים.", goal_en: "See the remote on the air, record three seconds and look at the presses. No decoding, no transmitting.",
        steps: [
          { do: "החזירו את fc ל-⁦433.5 MHz⁩ והריצו את סעיפים 1–3. בזמן שהמסך רץ, לחצו על השלט ליד האנטנה.", do_en: "Set fc back to 433.5 MHz and run sections 1–3. While the screen runs, press the remote near the antenna.",
            fig: [6], q: ["באיזה תדר מופיע השלט? (אם לא רואים כלום – אולי השלט ב-315 או ב-⁦868 MHz⁩: נסו)", "איך נראית לחיצה ב-waterfall?"], q_en: ["At which frequency does the remote appear? (If you see nothing – the remote may be at 315 or 868 MHz: try)", "What does a press look like in the waterfall?"] },
          { do: "הריצו את סעיף 5: לחצו Enter ואז לחצו על השלט פעם או פעמיים במשך 3 השניות. ההקלטה נשמרת ב-my_recording.mat.", do_en: "Run section 5: press Enter, then press the remote once or twice during the 3 seconds. The recording is saved to my_recording.mat." },
          { do: "הריצו את סעיף 6 והסתכלו על ההקלטה. הגדילו (zoom) על לחיצה אחת. האיור נשמר כ-remote_recording.png.", do_en: "Run section 6 and look at the recording. Zoom in on one press. The figure is saved as remote_recording.png.",
            fig: [7], q: ["כמה זמן נמשכת לחיצה? כמה פעמים חוזר בה אותו \"מקטע\"?", "השלט משנה את הקוד בכל לחיצה (rolling code). למה זה מונע ממישהו להקליט ולשדר חזרה?"], q_en: ["How long does a press last? How many times does the same \"burst\" repeat inside it?", "The remote changes its code with every press (rolling code). Why does that stop someone from recording and transmitting it back?"] },
          { do: "הריצו את סעיף 7 – שחרור הרדיו. סיימתם.", do_en: "Run section 7 – release the radio. Done." },
        ],
      },
    ],

    figRules: ["כל איור ממוספר ועם כיתוב: מה רואים, ובאיזה fc ו-fs.", "הסקריפט שומר את האיורים כ-PNG בתיקייה שלכם – משתמשים בהם כמו שהם.", "ליד כל איור: משפט אחד עם מספר (תדר, רוחב, משך)."],
    figRules_en: ["Every figure is numbered and has a caption: what it shows, and at which fc and fs.", "The script saves the figures as PNG in your folder – use them as they are.", "Next to every figure: one sentence with a number (frequency, width, duration)."],
    figures: [
      { n: 1, part: 2, kind: "graph", t: "אות רציף", t_en: "A continuous signal", set: "LTE · fc 1842 MHz · fs 20 MSPS",
        show: "ספקטרום ו-waterfall עם פס קבוע.", show_en: "Spectrum and waterfall with a steady stripe.", check: "רוחב משוער של האות.", check_en: "The approximate width of the signal." },
      { n: 2, part: 2, kind: "graph", t: "אות בפרצים", t_en: "A bursty signal", set: "Wi-Fi 2437 MHz / ADS-B 1089 MHz",
        show: "waterfall עם מקפים קצרים.", show_en: "A waterfall with short dashes.", check: "מה ההבדל מאיור 1?", check_en: "How does it differ from Figure 1?" },
      { n: 3, part: 3, kind: "graph", t: "תחנה 1 – זמן ותדר", t_en: "Station 1 – time and frequency", set: "sdr_intro · section 4",
        show: "I, Q ו-|x| בזמן; ספקטרום עם רוחב ‎-⁦26 dB⁩ ו-99%.", show_en: "I, Q and |x| in time; spectrum with the -26 dB and 99% widths.", check: "הרוחב מול קרסון.", check_en: "The width versus Carson." },
      { n: 4, part: 3, kind: "graph", t: "תחנה 2 (חלשה) – זמן ותדר", t_en: "Station 2 (weak) – time and frequency", set: "sdr_intro · section 4",
        show: "כמו איור 3.", show_en: "As in Figure 3.", check: "למה הרוחב שנמדד קטן יותר?", check_en: "Why is the measured width smaller?" },
      { n: 5, part: 3, kind: "graph", t: "תחנה 3 (סוג אחר) – זמן ותדר", t_en: "Station 3 (another kind) – time and frequency", set: "sdr_intro · section 4",
        show: "כמו איור 3.", show_en: "As in Figure 3.", check: "ההבדל מ-FM בזמן ובתדר.", check_en: "The difference from FM in time and frequency." },
      { n: 6, part: 4, kind: "graph", t: "השלט בזמן לחיצה", t_en: "The remote while pressed", set: "fc 433.5 MHz · fs 2 MSPS",
        show: "השלט ב-⁦433.92 MHz⁩ והקו של הרדיו באמצע.", show_en: "The remote at 433.92 MHz and the radio's line in the middle.", check: "תדר השלט מול הצפוי.", check_en: "The remote's frequency versus the expected one." },
      { n: 7, part: 4, kind: "graph", t: "הקלטת השלט", t_en: "The remote recording", set: "sdr_intro · section 6",
        show: "תדר מול זמן, ועוצמה מול זמן.", show_en: "Frequency versus time, and strength versus time.", check: "משך לחיצה ומספר החזרות.", check_en: "Press length and number of repeats." },
    ],

    tables: [
      { id: "map", title: "טבלה 1 – מה מצאתם באוויר", title_en: "Table 1 – what you found on the air",
        lead: "שורה לכל תדר שבדקתם בחלק 2. נשמר בדפדפן; אפשר להוריד כ-CSV.", lead_en: "One row per frequency you checked in Part 2. Saved in your browser; download as CSV.",
        rowHead: ["שירות", "Service"],
        cols: [["fc [MHz]", "fc [MHz]", "num"], ["fs [MSPS]", "fs [MSPS]", "num"], ["רציף / בפרצים", "Continuous / bursty", "text"], ["רוחב משוער [kHz]", "Approx. width [kHz]", "num"], ["אפשר לפענח?", "Decodable?", "text"]],
        rows: [["שלט 433.92", "Remote 433.92"], ["PMR446", "PMR446"], ["ADS-B", "ADS-B"], ["LTE", "LTE"], ["Wi-Fi", "Wi-Fi"]] },
      { id: "bw", title: "טבלה 2 – רוחב הסרט של התחנות", title_en: "Table 2 – the bandwidth of the stations",
        lead: "מהמדידה של סעיף 4. בעמודת 'צפוי' – לפי קרסון.", lead_en: "From the section 4 measurement. In the 'expected' column – from Carson.",
        rowHead: ["תחנה", "Station"],
        cols: [["תדר [MHz]", "Freq [MHz]", "num"], ["סוג", "Type", "text"], ["-26 dB [kHz]", "-26 dB [kHz]", "num"], ["99% [kHz]", "99% [kHz]", "num"], ["צפוי [kHz]", "Expected [kHz]", "num"], ["SNR [dB]", "SNR [dB]", "num"]],
        rows: [["תחנה 1", "Station 1"], ["תחנה 2 (חלשה)", "Station 2 (weak)"], ["תחנה 3 (סוג אחר)", "Station 3 (another kind)"]] },
    ],

    report: {
      lead: "דוח מסודר וקצר: מי שלא היה במעבדה צריך להבין ממנו מה עשיתם, מה ראיתם ומה זה אומר. קובץ PDF אחד במודל.",
      lead_en: "A short, organized report: someone who was not in the lab must understand what you did, what you saw and what it means. One PDF on Moodle.",
      sections: [
        ["עמוד שער", "שם הקורס, שם הניסוי, שמות ומספרי ת״ז, מספר קבוצה ותאריך.", "Title page", "Course, experiment name, names and ID numbers, group number and date."],
        ["מבוא ורקע", "חצי עמוד במילים שלכם: מה זה SDR, מה קובעים fc ו-fs, ומה מודדים רוחב סרט (‎-⁦26 dB⁩, ‏99%, קרסון).", "Introduction and background", "Half a page in your own words: what an SDR is, what fc and fs set, and how bandwidth is measured (-26 dB, 99%, Carson)."],
        ["מערך ושיטה", "הציוד, והגדרות כל מדידה (fc, ‏fs) בטבלה קטנה.", "Setup and method", "The equipment, and the settings of every measurement (fc, fs) in a small table."],
        ["תוצאות", "לפי החלקים: איורים 1–7 עם כיתוב, טבלאות 1 ו-2, והתשובות לשאלות שמסומנות 'לדוח'.", "Results", "Part by part: Figures 1–7 with captions, Tables 1 and 2, and the answers to the questions marked 'for the report'."],
        ["דיון", "רוחב הסרט שמדדתם מול קרסון, באחוזים. מה ההבדל בין רציף לפרצים, ובין FM ל-PMR במישור הזמן והתדר. מה אפשר לפענח ומה לא – ולמה.", "Discussion", "Your measured bandwidth versus Carson, in percent. The difference between continuous and bursty, and between FM and PMR in time and frequency. What can and cannot be decoded – and why."],
        ["מסקנות", "3–5 נקודות קצרות.", "Conclusions", "3–5 short points."],
        ["מקורות", "בסגנון IEEE, למשל: [1] Analog Devices, \"ADALM-PLUTO SDR Active Learning Module\". ‏[2] MathWorks, \"Communications Toolbox Support Package for ADALM-Pluto Radio\".", "References", "IEEE style, for example: [1] Analog Devices, \"ADALM-PLUTO SDR Active Learning Module\". [2] MathWorks, \"Communications Toolbox Support Package for ADALM-Pluto Radio\"."],
      ],
      style: ["עד 6 עמודים.", "איור – כיתוב מתחת; טבלה – כותרת מעל.", "כל מספר עם יחידות (MHz, kHz, dB).", "כותבים במילים שלכם; כל מקור עם הפניה."],
      style_en: ["Up to 6 pages.", "Figures – caption below; tables – title above.", "Every number with units (MHz, kHz, dB).", "Write in your own words; cite every source."],
      submit: [
        ["ייצאו ל-PDF (ב-Word: File → Save As → PDF).", "Export to PDF (in Word: File → Save As → PDF)."],
        ["תנו לקובץ שם לפי התבנית:", "Name the file using this pattern:", "Lab_SDR0_<ID1>_<ID2>.pdf"],
        ["פתחו את ה-PDF ובדקו שהאיורים קריאים.", "Open the PDF and check that the figures are readable."],
        ["העלו למטלה במודל של הקורס, עד המועד שמופיע שם, וודאו שהסטטוס \"הוגש לציון\".", "Upload it to the assignment on the course Moodle by the deadline shown there, and check the status reads \"Submitted for grading\"."],
      ],
      check: [
        ["עמוד שער מלא", "Complete title page"],
        ["7 איורים עם כיתוב ומספרים", "7 figures with captions and numbers"],
        ["טבלאות 1 ו-2 מלאות", "Tables 1 and 2 complete"],
        ["השוואה לקרסון באחוזים", "Comparison with Carson in percent"],
        ["תשובות לכל השאלות", "Answers to every question"],
        ["קובץ PDF בשם הנכון, הועלה למודל", "A PDF with the right name, uploaded to Moodle"],
      ],
    },

    files: [
      { file: "sdr_intro_lab.zip", d: "כל מה שצריך: sdr_intro.m, מדידת רוחב הסרט והסימולטור. פרסו לתיקייה אחת.", d_en: "Everything you need: sdr_intro.m, the bandwidth measurement and the simulator. Unzip into one folder." },
      { file: "sdr_intro.m", d: "הניסוי כולו בקובץ אחד, ב-7 סעיפים: הגדרות, חיבור, צפייה חיה, מדידת תחנה, הקלטה, הצגת ההקלטה ושחרור.", d_en: "The whole pre-lab in one file, 7 sections: settings, connect, live view, measure a station, record, show the recording and release." },
      { file: "sdr_measure_bw.m", d: "מודד רוחב סרט: ‎-⁦26 dB⁩ ו-99%.", d_en: "Measures bandwidth: -26 dB and 99%." },
      { file: "sdr_setup_check.m", d: "אם הרדיו לא מתחבר: בודק את MATLAB, את חבילת התמיכה ואת הרדיו.", d_en: "If the radio does not connect: checks MATLAB, the support package and the radio." },
    ],
  },
  {
    id: "sdr",
    course: "comm-lab",
    dir: "labs/sdr_spectrum",
    title: "מעבדת SDR – מה יש באוויר? רוחב סרט של אותות אמיתיים",
    title_en: "SDR lab – What is on the air? The bandwidth of real signals",
    summary: "עם ADALM-Pluto ו-MATLAB סורקים את הספקטרום, לומדים מה כל פרמטר של ה-SDR עושה ומה המגבלות שלו, מאזינים לתחנת FM ומודדים את רוחב הסרט של אותות אנלוגיים ודיגיטליים.",
    summary_en: "With an ADALM-Pluto and MATLAB you scan the spectrum, learn what every SDR parameter does and where its limits are, listen to an FM station and measure the bandwidth of analog and digital signals.",
    time: "שעה במעבדה + חצי שעה הכנה", time_en: "1 hour in the lab + 30 min preparation",
    tags: ["sdr", "fm", "spectrum"],
    goals: [
      "להבין את מבנה מקלט ה-SDR ואת הפרמטרים שלו: תדר מרכזי, קצב דגימה, גודל FFT והגבר.",
      "לראות בעיניים את המגבלות: רוחב התמונה, רזולוציה, רצפת רעש, רוויה של ה-ADC, ה-DC spike וה-image.",
      "לסרוק את רצועת ה-FM, למדוד רוחב סרט של תחנה ולהאזין לה – כולל הפירוק של אות ה-MPX.",
      "להשוות צורת ספקטרום של אותות אנלוגיים (FM, AM) ודיגיטליים (LTE, Wi-Fi, ADS-B) ולמדוד את רוחב הסרט שלהם.",
    ],
    goals_en: [
      "Understand the structure of an SDR receiver and its parameters: center frequency, sample rate, FFT size and gain.",
      "See the limits with your own eyes: span, resolution, noise floor, ADC saturation, the DC spike and the image.",
      "Scan the FM band, measure the bandwidth of a station and listen to it – including the parts of the MPX signal.",
      "Compare the spectrum shapes of analog (FM, AM) and digital (LTE, Wi-Fi, ADS-B) signals and measure their bandwidth.",
    ],
    equipment: ["ADALM-Pluto עם 2 אנטנות", "כבל micro-USB לנתונים", "מחשב עם MATLAB R2021a ומעלה, Communications Toolbox וחבילת התמיכה ל-ADALM-Pluto", "קבצי המעבדה (ZIP למטה)"],
    equipment_en: ["ADALM-Pluto with 2 antennas", "micro-USB data cable", "Computer with MATLAB R2021a or newer, Communications Toolbox and the ADALM-Pluto support package", "The lab files (ZIP below)"],
    prepNote: "את כל התוכנות אפשר להריץ בבית <b>בלי רדיו</b>: הורידו את ה-ZIP, פתחו ב-MATLAB והריצו <code dir='ltr'>sdr_spectrum_explorer</code>. הסימולטור מייצר את אותם אותות ואת אותן מגבלות (רעש, רוויה, DC spike) כמו הרדיו האמיתי.",
    prepNote_en: "You can run all the software at home <b>without a radio</b>: download the ZIP, open MATLAB and run <code>sdr_spectrum_explorer</code>. The simulator produces the same signals and the same limits (noise, saturation, DC spike) as the real radio.",

    theory: [
      {
        h: "מה זה SDR, ומה קורה בתוך ה-Pluto", h_en: "What an SDR is, and what happens inside the Pluto",
        fig: "pluto_rx.svg",
        body: String.raw`<p>ב-<b>Software Defined Radio</b> רק החלק הראשון של המקלט הוא חומרה: מגבר (LNA), מערבל שמוריד את האות לסביבת ⁦0 Hz⁩, מסנן ו-ADC. כל השאר – סינון, גילוי, פענוח – נעשה בתוכנה, ולכן אותו רדיו יכול לקלוט FM, LTE או מכ״ם.</p>
<p>ה-Pluto הוא <b>מקלט המרה ישירה</b> (zero-IF): המתנד המקומי (LO) מכוון לתדר המרכזי \(f_c\), ושני מערבלים – עם \(\cos\) ועם \(\sin\) – נותנים שני ערוצים, I ו-Q. יחד הם אות מרוכב אחד:</p>
$$x[n] = I[n] + jQ[n],\qquad s_{RF}(t) = \mathrm{Re}\{x(t)\,e^{j2\pi f_c t}\}$$
<p>כלומר הספקטרום של \(x\) הוא הספקטרום של האוויר, מוזז ב-\(f_c\): קו בתדר \(f_{RF}\) מופיע ב-\(f_{bb} = f_{RF} - f_c\). בגלל שהאות מרוכב, יש לו תדרים חיוביים <b>ושליליים</b> שונים זה מזה – ולכן רואים את כל הרצועה \(f_c \pm f_s/2\), ברוחב \(f_s\) שלם (ולא \(f_s/2\) כמו בדגימה ממשית).</p>
<p>בתרשים מסומנים בכתום ארבעת הפרמטרים שנותנים ל-<code dir="ltr">comm.SDRRxPluto</code>, ליד החלק במקלט שהם קובעים.</p>`,
        body_en: String.raw`<p>In a <b>Software Defined Radio</b> only the first part of the receiver is hardware: an amplifier (LNA), a mixer that brings the signal down to around 0 Hz, a filter and an ADC. Everything else – filtering, detection, decoding – is software, so the same radio can receive FM, LTE or radar.</p>
<p>The Pluto is a <b>direct-conversion</b> (zero-IF) receiver: the local oscillator (LO) is tuned to the center frequency \(f_c\), and two mixers – with \(\cos\) and with \(\sin\) – give two channels, I and Q. Together they form one complex signal:</p>
$$x[n] = I[n] + jQ[n],\qquad s_{RF}(t) = \mathrm{Re}\{x(t)\,e^{j2\pi f_c t}\}$$
<p>So the spectrum of \(x\) is the spectrum of the air shifted by \(f_c\): a line at \(f_{RF}\) appears at \(f_{bb} = f_{RF} - f_c\). Because the signal is complex, its positive and <b>negative</b> frequencies are different – so you see the whole band \(f_c \pm f_s/2\), a full \(f_s\) wide (not \(f_s/2\) as with real sampling).</p>
<p>The diagram marks in orange the four parameters you give <code>comm.SDRRxPluto</code>, next to the part of the receiver they control.</p>`,
      },
      {
        h: "ארבעת הפרמטרים, ומה כל אחד קובע", h_en: "The four parameters, and what each one sets",
        fig: "band_map.png",
        body: String.raw`<ol>
<li><b>CenterFrequency</b> \(f_c\) – אמצע התמונה. במצב המקורי (AD9363) הטווח ⁦325 MHz–3.8 GHz⁩; במצב AD9364 – ⁦70 MHz–6 GHz⁩, וזה מה שצריך בשביל רצועת ה-FM.</li>
<li><b>BasebandSampleRate</b> \(f_s\) – רוחב התמונה. ה-Pluto דוגם עד ⁦61.44 MSPS⁩, אבל דרך USB 2.0 עובר ברצף רק בערך ⁦4 MSPS⁩. מעל זה הלכידות עדיין טובות לספקטרום, אבל יש "חורים" בין מסגרות (overflow) – אסור לרצף אודיו.</li>
<li><b>SamplesPerFrame</b> \(N\) = גודל ה-FFT – הרזולוציה. כל bin רוחבו \(f_s/N\), וזמן הלכידה \(N/f_s\). רזולוציה טובה בתדר = לכידה ארוכה בזמן.</li>
<li><b>Gain</b> (⁦0–71 dB⁩) – כמה מגבירים לפני ה-ADC. מעט מדי: האותות החלשים נבלעים ברעש של ה-ADC. יותר מדי: ה-ADC נכנס לרוויה, ומופיעים אותות שלא קיימים.</li>
</ol>
$$\text{span} = f_s,\qquad \Delta f_{bin} = \frac{f_s}{N},\qquad RBW_{Hann} \approx 1.5\,\frac{f_s}{N},\qquad T = \frac{N}{f_s}$$
<p>ל-ADC של 12 ביט יש תחום דינמי של בערך \(6.02\cdot 12 + 1.76 \approx 74\) dB. כדי לנצל אותו, מכוונים את ההגבר כך שהאות החזק ביותר יגיע ל-⁦10–20 dB⁩ מתחת ל-full scale (⁦0 dBFS⁩).</p>
<p class="note">רצפת הרעש ב-dBFS לכל bin תלויה ב-\(N\): הרעש מתפזר על כל ה-bins, ולכן כשמכפילים את \(N\) הרעש בכל bin יורד ב-⁦3 dB⁩ – וקו צר (טון) נשאר באותה רמה. לכן משווים רמות רק באותן הגדרות.</p>`,
        body_en: String.raw`<ol>
<li><b>CenterFrequency</b> \(f_c\) – the middle of the picture. In the original mode (AD9363) the range is 325 MHz–3.8 GHz; in AD9364 mode it is 70 MHz–6 GHz, which you need for the FM band.</li>
<li><b>BasebandSampleRate</b> \(f_s\) – the width of the picture. The Pluto samples up to 61.44 MSPS, but USB 2.0 carries only about 4 MSPS continuously. Above that, captures are still fine for spectra, but there are gaps between frames (overflow) – no continuous audio.</li>
<li><b>SamplesPerFrame</b> \(N\) = the FFT size – the resolution. Each bin is \(f_s/N\) wide and the capture lasts \(N/f_s\). Fine frequency resolution = a long capture in time.</li>
<li><b>Gain</b> (0–71 dB) – how much you amplify before the ADC. Too little: weak signals drown in the ADC noise. Too much: the ADC saturates and signals that do not exist appear.</li>
</ol>
$$\text{span} = f_s,\qquad \Delta f_{bin} = \frac{f_s}{N},\qquad RBW_{Hann} \approx 1.5\,\frac{f_s}{N},\qquad T = \frac{N}{f_s}$$
<p>A 12-bit ADC has a dynamic range of about \(6.02\cdot 12 + 1.76 \approx 74\) dB. To use it, set the gain so the strongest signal sits 10–20 dB below full scale (0 dBFS).</p>
<p class="note">The noise floor in dBFS per bin depends on \(N\): the noise spreads over all bins, so doubling \(N\) lowers the noise in each bin by 3 dB – while a narrow line (a tone) stays at the same level. So compare levels only with the same settings.</p>`,
      },
      {
        h: "מגבלות ותופעות שתראו על המסך", h_en: "Limits and effects you will see on the screen",
        fig: "theory_gain.png", fig2: "theory_dc.png",
        body: String.raw`<ul>
<li><b>DC spike</b> – קו קבוע בדיוק באמצע התמונה: דליפה של ה-LO לכניסה. זה לא אות! הפתרון: <b>offset tuning</b> – מכוונים קצת לצד של האות ומזיזים אותו בחזרה בתוכנה.</li>
<li><b>Image</b> – העתק חלש של אות חזק, בצד השני של המרכז (\(f_c - \Delta\) במקום \(f_c + \Delta\)), כי ערוצי I ו-Q לא מאוזנים בדיוק. בערך ⁦40 dB⁩ מתחת לאות.</li>
<li><b>שוליים</b> – המסננים מנחיתים את ה-10% החיצוניים בכל צד, ואותות קצת מחוץ לתחום יכולים "להתקפל" פנימה (aliasing). סומכים רק על 80% האמצעיים – כך גם עובדת הסריקה (Sweep) בממשק.</li>
<li><b>רוויה (clipping)</b> – כשהאות מגיע ל-⁦0 dBFS⁩, הרצפה עולה ומופיעים קווים מזויפים (מוצרי אי-לינאריות). הממשק מתריע באדום.</li>
<li><b>דיוק תדר</b> – המתנד של ה-Pluto מדויק לבערך ⁦±25 ppm⁩: ב-⁦100 MHz⁩ זה עד ⁦±2.5 kHz⁩, וב-⁦2.4 GHz⁩ עד ⁦±60 kHz⁩. לכן תחנה יכולה להופיע קצת זזה.</li>
</ul>
<p>שני האיורים נוצרו בסימולטור עם <code dir="ltr">sdr_lab2_parameters</code>: למעלה – רמות ו-SNR כפונקציה של ההגבר; למטה – ה-DC spike, וה-image של התחנה (ב-⁦98.2 MHz⁩) כשמכוונים ⁦400 kHz⁩ מתחתיה.</p>`,
        body_en: String.raw`<ul>
<li><b>DC spike</b> – a constant line exactly in the middle: LO leakage into the input. It is not a signal! The fix: <b>offset tuning</b> – tune a little to the side of the signal and shift it back in software.</li>
<li><b>Image</b> – a weak copy of a strong signal on the other side of the center (\(f_c - \Delta\) instead of \(f_c + \Delta\)), because the I and Q channels are not perfectly balanced. About 40 dB below the signal.</li>
<li><b>Edges</b> – the filters attenuate the outer 10% on each side, and signals just outside the span can fold in (aliasing). Trust only the middle 80% – this is also how the Sweep in the GUI works.</li>
<li><b>Saturation (clipping)</b> – when the signal reaches 0 dBFS, the floor rises and false lines (nonlinear products) appear. The GUI warns in red.</li>
<li><b>Frequency accuracy</b> – the Pluto's oscillator is accurate to about ±25 ppm: at 100 MHz that is up to ±2.5 kHz, at 2.4 GHz up to ±60 kHz. So a station may appear slightly shifted.</li>
</ul>
<p>Both figures were made in the simulator with <code>sdr_lab2_parameters</code>: top – levels and SNR versus gain; bottom – the DC spike, and the station's image (at 98.2 MHz) when tuned 400 kHz below it.</p>`,
      },
      {
        h: "רוחב סרט: איך מודדים, ולמה אנלוגי ודיגיטלי נראים שונה", h_en: "Bandwidth: how to measure it, and why analog and digital look different",
        fig: "shapes.png",
        body: String.raw`<p>יש שתי הגדרות מקובלות. <b>רוחב x dB</b> – המרחק בין שתי הנקודות שבהן הספקטרום יורד x dB מתחת לשיא (‎-3, ‎-⁦26 dB⁩). <b>רוחב סרט תפוס (99%)</b> – הרוחב שמכיל 99% מההספק, כש-0.5% נשארים בחוץ בכל צד (ההגדרה של ITU). לאותות עם קו נושא חזק (AM, ADS-B) רוחב x dB מטעה – הוא מודד את הקו ולא את האות – ולכן ה-99% הוא המדד האמין.</p>
<p><b>אנלוגי:</b> הצורה תלויה בתוכן ומשתנה כל הזמן. ל-AM: \(B = 2W\) (קול ⁦3 kHz⁩ ← ⁦6 kHz⁩). ל-FM כלל קרסון:</p>
$$B_{FM} \approx 2(\Delta f + W)$$
<p>שידור FM מסחרי: \(\Delta f = 75\) kHz. במונו \(W = 15\) kHz ← ⁦180 kHz⁩; בסטריאו אות ה-MPX מגיע ל-⁦53 kHz⁩ ← עד ⁦256 kHz⁩. בפועל רוב הזמן התחנה תופסת ⁦150–200 kHz⁩. PMR446: \(\Delta f = 2.5\), \(W = 3\) kHz ← ⁦11 kHz⁩.</p>
<p><b>דיגיטלי:</b> הצורה קבועה ונקבעת בתקן, לא בתוכן – "קוביה" שטוחה עם קצוות חדים (OFDM), או צורת פולס. ב-OFDM:</p>
$$B \approx N_{sc}\cdot\Delta f_{sc}$$
<p>LTE ⁦20 MHz⁩: \(1200 \times 15\) kHz = ⁦18 MHz⁩. Wi-Fi ⁦20 MHz⁩: \(52 \times 312.5\) kHz = ⁦16.25 MHz⁩. ADS-B: פולסים של ⁦0.5 µs⁩ ← אונה ראשית ברוחב \(2/T\) = ⁦4 MHz⁩.</p>`,
        body_en: String.raw`<p>There are two common definitions. <b>x dB bandwidth</b> – the distance between the two points where the spectrum drops x dB below its peak (-3, -26 dB). <b>Occupied (99%) bandwidth</b> – the width that holds 99% of the power, with 0.5% left outside on each side (the ITU definition). For signals with a strong carrier line (AM, ADS-B) the x dB width is misleading – it measures the line, not the signal – so the 99% width is the reliable number.</p>
<p><b>Analog:</b> the shape depends on the content and changes all the time. AM: \(B = 2W\) (3 kHz voice → 6 kHz). FM, Carson's rule:</p>
$$B_{FM} \approx 2(\Delta f + W)$$
<p>Commercial FM broadcast: \(\Delta f = 75\) kHz. Mono \(W = 15\) kHz → 180 kHz; stereo MPX reaches 53 kHz → up to 256 kHz. In practice a station occupies 150–200 kHz most of the time. PMR446: \(\Delta f = 2.5\), \(W = 3\) kHz → 11 kHz.</p>
<p><b>Digital:</b> the shape is fixed by the standard, not by the content – a flat "block" with sharp edges (OFDM), or a pulse shape. For OFDM:</p>
$$B \approx N_{sc}\cdot\Delta f_{sc}$$
<p>LTE 20 MHz: \(1200 \times 15\) kHz = 18 MHz. Wi-Fi 20 MHz: \(52 \times 312.5\) kHz = 16.25 MHz. ADS-B: 0.5 µs pulses → main lobe \(2/T\) = 4 MHz wide.</p>`,
      },
      {
        h: "בתוך שידור FM: מה המקלט עושה", h_en: "Inside an FM broadcast: what the receiver does",
        fig: "fm_listen.png",
        body: String.raw`<p>הפונקציה <code dir="ltr">sdr_fm_listen</code> עושה את כל המקלט בכמה שורות: מכוונת ⁦200 kHz⁩ מתחת לתחנה (offset tuning), מזיזה את התחנה ל-⁦0 Hz⁩, מסננת ⁦±120 kHz⁩, ואז מגלה FM – התדר הרגעי הוא שינוי הפאזה בין דגימות:</p>
$$f_{inst}[n] = \frac{f_s}{2\pi}\,\arg\!\big(x[n]\,x^*[n-1]\big)$$
<p>התוצאה היא אות ה-<b>MPX</b>, ובו רואים את המבנה של שידור סטריאו: L+R (מונו) ב-⁦0–15 kHz⁩, <b>פיילוט</b> ב-⁦19 kHz⁩, L−R ב-DSB-SC סביב ⁦38 kHz⁩ (⁦23–53 kHz⁩) ונתוני <b>RDS</b> ב-⁦57 kHz⁩. בשביל אודיו מונו מסננים ⁦15 kHz⁩, יורדים ל-⁦48 kHz⁩ ומפעילים de-emphasis של ⁦50 µs⁩ (התקן באירופה ובישראל).</p>
<p class="note">זה בדיוק ה-DSB-SC ממעבדה 3: ה-L−R משודר בלי נושא, והפיילוט ב-⁦19 kHz⁩ הוא מה שמאפשר למקלט לשחזר את הנושא ב-⁦38 kHz⁩ (פי 2).</p>`,
        body_en: String.raw`<p>The function <code>sdr_fm_listen</code> is the whole receiver in a few lines: it tunes 200 kHz below the station (offset tuning), shifts the station to 0 Hz, filters ±120 kHz, then demodulates FM – the instantaneous frequency is the phase change between samples:</p>
$$f_{inst}[n] = \frac{f_s}{2\pi}\,\arg\!\big(x[n]\,x^*[n-1]\big)$$
<p>The result is the <b>MPX</b> signal, which shows the structure of a stereo broadcast: L+R (mono) at 0–15 kHz, the <b>pilot</b> at 19 kHz, L−R as DSB-SC around 38 kHz (23–53 kHz) and <b>RDS</b> data at 57 kHz. For mono audio: filter at 15 kHz, go down to 48 kHz and apply 50 µs de-emphasis (the European and Israeli standard).</p>
<p class="note">This is exactly the DSB-SC from Lab 3: L−R is sent without a carrier, and the 19 kHz pilot is what lets the receiver rebuild the 38 kHz carrier (×2).</p>`,
      },
    ],

    components: [
      { name: "ADALM-Pluto", name_en: "ADALM-Pluto", model: "Analog Devices · AD9363/AD9364 · 12 bit", parts: "1–4",
        role: "מקלט ומשדר SDR קטן: מקלט המרה ישירה עם ADC של 12 ביט, שמחובר למחשב ב-USB. במעבדה הזאת משתמשים רק במקלט (RX).",
        role_en: "A small SDR transceiver: a direct-conversion receiver with a 12-bit ADC, connected to the computer over USB. This lab uses the receiver (RX) only.",
        ports: [["RX", "כניסת אנטנה (SMA) – כאן מחברים את האנטנה", "antenna input (SMA) – connect the antenna here"], ["TX", "מוצא שידור – לא בשימוש. לא משדרים!", "transmit output – not used. Do not transmit!"], ["USB", "נתונים ומתח (השקע עם סמל ה-USB)", "data and power (the port with the USB symbol)"]],
        tip: "מחברים ומנתקים אנטנות רק כשהרדיו כבוי מ-USB, וסוגרים את MATLAB או קוראים release(rx) לפני שמנתקים את הכבל.",
        tip_en: "Connect and disconnect antennas only with the radio unplugged, and close MATLAB or call release(rx) before unplugging the cable." },
      { name: "אנטנות", name_en: "Antennas", model: "SMA whip", parts: "1–4",
        role: "האנטנות הקטנות שמגיעות עם ה-Pluto מותאמות לתדרים הסלולריים (⁦~800–900 MHz⁩ ו-⁦1.8–2.1 GHz⁩). ב-FM (⁦100 MHz⁩) הן קצרות מדי, אבל התחנות חזקות מספיק.",
        role_en: "The small antennas that come with the Pluto are tuned to cellular frequencies (~800–900 MHz and 1.8–2.1 GHz). At FM (100 MHz) they are too short, but the stations are strong enough.",
        ports: [], tip: "אנטנה טובה ל-FM היא חוט באורך רבע גל: \\(\\lambda/4 = c/(4f) \\approx 75\\) ס״מ. ליד החלון הקליטה טובה יותר.",
        tip_en: "A good FM antenna is a quarter-wave wire: \\(\\lambda/4 = c/(4f) \\approx 75\\) cm. Reception is better near the window." },
      { name: "המחשב והתוכנה", name_en: "Computer and software", model: "MATLAB R2021a+", parts: "1–4",
        role: "MATLAB עם Communications Toolbox וחבילת התמיכה ל-ADALM-Pluto. כל קבצי המעבדה באותה תיקייה. הסקריפט sdr_setup_check בודק הכול.",
        role_en: "MATLAB with Communications Toolbox and the ADALM-Pluto support package. All lab files in one folder. The script sdr_setup_check checks everything.",
        ports: [], tip: "רק תוכנה אחת יכולה להשתמש ברדיו בכל רגע. לפני שפותחים את הממשק, שחררו את הרדיו בסקריפט (release).",
        tip_en: "Only one program can use the radio at a time. Before you open the GUI, release the radio in your script (release)." },
    ],

    instruments: [
      { h: "לפני שמתחילים", h_en: "Before you start",
        body: "במעבדה הזאת רק קולטים – לא משדרים. קליטה מותרת בכל תדר; שידור מחייב רישיון. אל תחברו את ה-TX לאנטנה. לפני שמחליפים סקריפט, הריצו release(rx) או סגרו את הממשק – אחרת תקבלו שגיאה שהרדיו תפוס.",
        body_en: "In this lab you only receive – never transmit. Receiving is allowed on any frequency; transmitting needs a license. Do not connect TX to an antenna. Before switching scripts, run release(rx) or close the GUI – otherwise you get an error that the radio is busy." },
      { h: "הממשק sdr_spectrum_explorer", h_en: "The GUI sdr_spectrum_explorer",
        body: "בצד שמאל: מקור (סימולטור או Pluto), Preset לכל רצועה, הפרמטרים של המקלט, תצוגה ופעולות. Run מציג ספקטרום ו-waterfall חיים; Sweep מחבר כמה לכידות לרצועה רחבה; לחיצה על אות מודדת את רוחב הסרט (‎-3/-6/-20/-⁦26 dB⁩ ו-99%). בשורת הסטטוס: Span, RBW, זמן לכידה, שיא ה-ADC ואזהרות. Save PNG שומר את כל החלון לדוח.",
        body_en: "On the left: source (simulator or Pluto), a Preset for each band, the receiver parameters, display and actions. Run shows a live spectrum and waterfall; Sweep joins several captures into a wide band; clicking a signal measures its bandwidth (-3/-6/-20/-26 dB and 99%). The status line shows span, RBW, capture time, ADC peak and warnings. Save PNG saves the whole window for the report." },
      { h: "הרצת סקריפט לפי סעיפים", h_en: "Running a script section by section",
        body: "הסקריפטים מחולקים לסעיפים שמתחילים ב-%%. עומדים בתוך סעיף ולוחצים Ctrl+Enter (ב-Mac: Cmd+Enter) – רק הסעיף הזה רץ. כך אפשר לשנות פרמטר ולהריץ שוב בלי להתחיל מהתחלה.",
        body_en: "The scripts are split into sections that start with %%. Put the cursor inside a section and press Ctrl+Enter (Mac: Cmd+Enter) – only that section runs. This way you can change a parameter and run again without starting over." },
      { h: "למדריך המעבדה: מצב AD9364", h_en: "For the instructor: AD9364 mode",
        body: "Pluto חדש מגיע במצב AD9363 (⁦325 MHz–3.8 GHz⁩) ולא קולט FM. פעם אחת לכל רדיו: ב-MATLAB הריצו configurePlutoRadio('AD9364'), או דרך SSH: fw_setenv attr_name compatible; fw_setenv attr_val ad9364; reboot. אחרי זה הטווח ⁦70 MHz–6 GHz⁩. sdr_setup_check מראה באיזה מצב כל רדיו.",
        body_en: "A new Pluto ships in AD9363 mode (325 MHz–3.8 GHz) and cannot receive FM. Once per radio: in MATLAB run configurePlutoRadio('AD9364'), or over SSH: fw_setenv attr_name compatible; fw_setenv attr_val ad9364; reboot. After that the range is 70 MHz–6 GHz. sdr_setup_check shows which mode each radio is in." },
    ],

    prep: [
      { q: "ה-Pluto מכוון ל-\\(f_c\\) = ⁦100 MHz⁩ עם \\(f_s\\) = ⁦4 MSPS⁩ ו-\\(N\\) = 4096. מצאו:", q_en: "The Pluto is tuned to \\(f_c\\) = 100 MHz with \\(f_s\\) = 4 MSPS and \\(N\\) = 4096. Find:",
        items: ["את תחום התדרים שרואים על המסך.", "את רוחב ה-bin ואת ה-RBW (חלון Hann).", "כמה זמן נמשכת לכידה של FFT אחד.", "כמה Mbit/s עוברים ב-USB (דגימות של 16 ביט ל-I ול-Q)."],
        items_en: ["The frequency range you see on the screen.", "The bin width and the RBW (Hann window).", "How long one FFT capture lasts.", "How many Mbit/s go over USB (16-bit samples for I and for Q)."] },
      { q: "רוצים לראות את כל רצועת ה-FM, ⁦87.5–108 MHz⁩, עם \\(f_s\\) = ⁦4 MSPS⁩, ומשתמשים רק ב-80% האמצעיים של כל לכידה. כמה לכידות צריך? ומה היתרון של \\(f_s\\) = ⁦20 MSPS⁩? מה המחיר?",
        q_en: "You want to see the whole FM band, 87.5–108 MHz, with \\(f_s\\) = 4 MSPS, using only the middle 80% of each capture. How many captures do you need? What is the advantage of \\(f_s\\) = 20 MSPS? What does it cost?", items: [], items_en: [] },
      { q: "לפי כלל קרסון, חשבו את רוחב הסרט של:", q_en: "Using Carson's rule, compute the bandwidth of:",
        items: ["שידור FM במונו (\\(\\Delta f\\) = ⁦75 kHz⁩, \\(W\\) = ⁦15 kHz⁩).", "שידור FM בסטריאו (\\(W\\) = ⁦53 kHz⁩).", "מכשיר קשר PMR446 (\\(\\Delta f\\) = ⁦2.5 kHz⁩, \\(W\\) = ⁦3 kHz⁩)."],
        items_en: ["Mono FM broadcast (\\(\\Delta f\\) = 75 kHz, \\(W\\) = 15 kHz).", "Stereo FM broadcast (\\(W\\) = 53 kHz).", "A PMR446 radio (\\(\\Delta f\\) = 2.5 kHz, \\(W\\) = 3 kHz)."] },
      { q: "ערוץ LTE של ⁦20 MHz⁩ משתמש ב-1200 תת-נושאים ברווח ⁦15 kHz⁩. מה רוחב הסרט התפוס? איזה \\(f_s\\) מינימלי צריך כדי לראות אותו שלם בלכידה אחת (80% שימושיים)?",
        q_en: "A 20 MHz LTE channel uses 1200 subcarriers spaced 15 kHz. What is the occupied bandwidth? What minimum \\(f_s\\) do you need to see it whole in one capture (80% usable)?", items: [], items_en: [] },
      { q: "למה רצפת הרעש ב-dBFS לכל bin יורדת ב-⁦3 dB⁩ כשמכפילים את \\(N\\), אבל רמה של טון נשארת? מה זה אומר כשמשווים שני צילומי מסך?",
        q_en: "Why does the noise floor in dBFS per bin drop by 3 dB when \\(N\\) doubles, while a tone stays at the same level? What does this mean when you compare two screenshots?", items: [], items_en: [] },
      { q: "בבית, בלי רדיו: הריצו sdr_spectrum_explorer, בחרו Preset של FM broadcast, לחצו על תחנה וצרפו צילום מסך עם המדידה.",
        q_en: "At home, without a radio: run sdr_spectrum_explorer, choose the FM broadcast preset, click a station and attach a screenshot with the measurement.", items: [], items_en: [] },
    ],

    parts: [
      {
        title: "חלק 1 – חיבור ולכידה ראשונה (10 דק׳)", title_en: "Part 1 – Connect and first capture (10 min)",
        goal: "מחברים את ה-Pluto, בודקים שהכול עובד ולוכדים מסגרת ראשונה – ומבינים מה יצא.", goal_en: "Connect the Pluto, check that everything works and capture a first frame – and understand what came out.",
        steps: [
          { do: "חברו את האנטנה ל-RX ואת הכבל לשקע ה-USB של ה-Pluto. חכו כ-20 שניות עד ש-LED1 מהבהב. בתיקיית קבצי המעבדה הריצו:", do_en: "Connect the antenna to RX and the cable to the Pluto's USB port. Wait about 20 s until LED1 blinks. In the lab files folder run:",
            set: [["MATLAB", "sdr_setup_check", "sdr_setup_check"]],
            q: ["באיזה מצב הרדיו – AD9363 או AD9364? מה טווח התדרים שלו?"], q_en: ["Which mode is the radio in – AD9363 or AD9364? What is its frequency range?"] },
          { do: "פתחו את sdr_lab1_first_steps והריצו את סעיפים 1–4 אחד אחד. קראו את ההערות ליד כל פרמטר.", do_en: "Open sdr_lab1_first_steps and run sections 1–4 one at a time. Read the comment next to each parameter.",
            set: [["fc", "99.0 MHz  (AD9363: 433.92 MHz)", "99.0 MHz (in AD9363: 433.92 MHz)"], ["fs · N · gain", "1.92 MSPS · 8192 · 30 dB", "1.92 MSPS · 8192 · 30 dB"]],
            q: ["מה מדפיס disp(rx)? אילו פרמטרים נוספים יש לאובייקט?", "האם היה overflow?"], q_en: ["What does disp(rx) print? Which other parameters does the object have?", "Was there an overflow?"] },
          { do: "הריצו את סעיף 5: I ו-Q בזמן, והיסטוגרמה של ערכי I.", do_en: "Run section 5: I and Q in time, and a histogram of the I values.",
            q: ["מה שיא האות ב-dBFS? איזה חלק מהתחום של ה-ADC מנוצל?", "למה I ו-Q נראים כמו רעש ולא כמו גל סינוס?"], q_en: ["What is the signal peak in dBFS? How much of the ADC range is used?", "Why do I and Q look like noise rather than a sine wave?"] },
          { do: "הריצו את סעיפים 6–8: ספקטרום \"ביד\" עם FFT, והמספרים שמתארים את הלכידה. בסוף הרדיו משתחרר.", do_en: "Run sections 6–8: a spectrum \"by hand\" with an FFT, and the numbers that describe the capture. At the end the radio is released.",
            fig: [1], q: ["השוו את Span, ה-bin, ה-RBW וזמן הלכידה לחישוב בשאלת הכנה 1."], q_en: ["Compare the span, bin, RBW and capture time with your answer to preparation question 1."] },
        ],
      },
      {
        title: "חלק 2 – הפרמטרים והמגבלות (15 דק׳)", title_en: "Part 2 – The parameters and the limits (15 min)",
        goal: "משנים פרמטר אחד בכל פעם ורואים מה הוא עושה: רוחב, רזולוציה, הגבר ו-DC spike.", goal_en: "Change one parameter at a time and see what it does: width, resolution, gain and the DC spike.",
        diagram: "gui_station.png",
        steps: [
          { do: "פתחו את sdr_lab2_parameters. בסעיף Settings קבעו את fStation לתחנה החזקה מחלק 1, והריצו את סעיף A (קצב דגימה).", do_en: "Open sdr_lab2_parameters. In the Settings section set fStation to the strong station from Part 1, and run section A (sample rate).",
            fig: [2], q: ["מה רוחב התמונה בכל אחד משלושת המקרים?", "מה קורה לאותות ליד הקצוות (מעבר לקו 0.4 fs)?"], q_en: ["How wide is the picture in each of the three cases?", "What happens to signals near the edges (beyond the 0.4 fs line)?"] },
          { do: "הריצו את סעיף B (גודל FFT): אותן דגימות, שלושה ערכים של N.", do_en: "Run section B (FFT size): the same samples, three values of N.",
            fig: [3], q: ["רשמו את ה-RBW ואת רצפת הרעש בכל N. בכמה dB ירדה הרצפה? השוו ל-\\(10\\log_{10}(N_2/N_1)\\).", "האם גובה התחנה השתנה באותה מידה? למה?"], q_en: ["Write down the RBW and the noise floor for each N. By how many dB did the floor drop? Compare with \\(10\\log_{10}(N_2/N_1)\\).", "Did the station's level change by the same amount? Why?"] },
          { do: "הריצו את סעיף C (הגבר): סריקה של ההגבר מ-0 עד ⁦70 dB⁩.", do_en: "Run section C (gain): a sweep of the gain from 0 to 70 dB.",
            fig: [4], q: ["מה ההגבר הטוב ביותר? באיזה הגבר ה-ADC נכנס לרוויה?", "מה קורה לרצפת הרעש ול-SNR מעל נקודת הרוויה? הסבירו."], q_en: ["What is the best gain? At which gain does the ADC saturate?", "What happens to the noise floor and the SNR above the saturation point? Explain."] },
          { do: "הריצו את סעיף D (DC spike ו-offset tuning).", do_en: "Run section D (DC spike and offset tuning).",
            fig: [5], q: ["איפה ה-DC spike בכל אחד מהמקרים? למה הוא לא אות אמיתי?", "חפשו העתק חלש של התחנה בצד השני של המרכז. מה זה, וכמה dB הוא מתחת לתחנה?"], q_en: ["Where is the DC spike in each case? Why is it not a real signal?", "Look for a weak copy of the station on the other side of the center. What is it, and how many dB below the station is it?"] },
          { do: "פתחו את הממשק עם הרדיו ולחצו Run. הגדילו בהדרגה את קצב הדגימה והסתכלו על שורת הסטטוס.", do_en: "Open the GUI with the radio and press Run. Raise the sample rate step by step and watch the status line.",
            set: [["MATLAB", "sdr_spectrum_explorer('Source','pluto')", "sdr_spectrum_explorer('Source','pluto')"]],
            q: ["מאיזה קצב דגימה מופיעים overflows? מה המגבלה כאן – הרדיו או ה-USB?"], q_en: ["From which sample rate do overflows appear? What is the limit here – the radio or the USB?"] },
        ],
      },
      {
        title: "חלק 3 – רצועת ה-FM: לראות, למדוד ולהאזין (15 דק׳)", title_en: "Part 3 – The FM band: see, measure and listen (15 min)",
        goal: "סורקים את כל רצועת ה-FM, מודדים רוחב סרט של תחנות, מאזינים לאחת ורואים מה יש בתוך אות ה-MPX.", goal_en: "Scan the whole FM band, measure the bandwidth of stations, listen to one and see what is inside the MPX signal.",
        diagram: "gui_band.png",
        steps: [
          { do: "בממשק בחרו Preset \"FM broadcast ⁦87.5-108 MHz⁩ (sweep)\". סמנו Max hold ולחצו Sweep once שלוש פעמים.", do_en: "In the GUI choose the preset \"FM broadcast 87.5-108 MHz (sweep)\". Tick Max hold and press Sweep once three times.",
            set: [["Sweep", "87.5–108 MHz · fs 4 MSPS · N 4096 · gain 30 dB", "87.5–108 MHz · fs 4 MSPS · N 4096 · gain 30 dB"]],
            fig: [6], q: ["כמה תחנות רואים? מה המרווח הקטן ביותר בין שתי תחנות שכנות?", "כמה לכידות עשתה הסריקה? (שורת הסטטוס) השוו לשאלת הכנה 2."], q_en: ["How many stations do you see? What is the smallest spacing between two neighbouring stations?", "How many captures did the sweep take? (status line) Compare with preparation question 2."] },
          { do: "לחצו על שלוש תחנות – חזקה, בינונית וחלשה – ורשמו בטבלה את הרוחב ב-‎-⁦26 dB⁩ וב-99%.", do_en: "Click three stations – strong, medium and weak – and write the -26 dB and 99% bandwidth in the table.",
            table: true, q: ["השוו לכלל קרסון (שאלת הכנה 3). האם התחנות במונו או בסטריאו?", "למה התחנה החלשה נראית צרה יותר? (רמז: מה קורה לשוליים מתחת לרעש?)"], q_en: ["Compare with Carson's rule (preparation question 3). Are the stations mono or stereo?", "Why does the weak station look narrower? (Hint: what happens to the skirts below the noise?)"] },
          { do: "לחצו על התחנה החזקה ואז על Listen FM at marker. אפשר גם מהשורה:", do_en: "Click the strong station, then Listen FM at marker. You can also use the command line:",
            set: [["MATLAB", "sdr_fm_listen(99.0e6, 'Source', 'pluto')", "sdr_fm_listen(99.0e6, 'Source', 'pluto')"]],
            fig: [7], q: ["מצאו באות ה-MPX את הפיילוט (⁦19 kHz⁩), את L−R (⁦23–53 kHz⁩) ואת ה-RDS (⁦57 kHz⁩). האם יש בכולם?", "מה קורה לאודיו כשמנסים תחנה חלשה מאוד?"], q_en: ["Find in the MPX signal the pilot (19 kHz), L−R (23–53 kHz) and RDS (57 kHz). Are they all there?", "What happens to the audio when you try a very weak station?"] },
          { do: "חזרו ל-Preset \"FM - one station\", לחצו Run והסתכלו על ה-waterfall כ-30 שניות.", do_en: "Go back to the preset \"FM - one station\", press Run and watch the waterfall for about 30 seconds.",
            q: ["האם רוחב התחנה קבוע? מה משנה אותו? (מוזיקה, דיבור, שקט)"], q_en: ["Is the station's width constant? What changes it? (music, speech, silence)"] },
        ],
      },
      {
        title: "חלק 4 – אנלוגי מול דיגיטלי (15 דק׳)", title_en: "Part 4 – Analog versus digital (15 min)",
        goal: "מסתכלים על אותות דיגיטליים אמיתיים – סלולר, Wi-Fi ומטוסים – ומשווים את צורת הספקטרום שלהם לאותות האנלוגיים.", goal_en: "Look at real digital signals – cellular, Wi-Fi and aircraft – and compare their spectrum shape with the analog signals.",
        diagram: "gui_adsb.png",
        steps: [
          { do: "בחרו Preset \"LTE band 3 downlink (sweep)\". לחצו על כל \"קוביה\" ומדדו את רוחב ה-99%.", do_en: "Choose the preset \"LTE band 3 downlink (sweep)\". Click each \"block\" and measure its 99% bandwidth.",
            set: [["Sweep", "1800–1885 MHz · fs 20 MSPS · N 2048 · gain 55 dB", "1800–1885 MHz · fs 20 MSPS · N 2048 · gain 55 dB"]],
            fig: [8], table: true, q: ["כמה ערוצים יש, ומה הרוחב של כל אחד? לאיזה רוחב תקני (5/10/15/⁦20 MHz⁩) הוא מתאים?", "השוו לשאלת הכנה 4. למה הצורה שטוחה והקצוות חדים?"], q_en: ["How many channels are there, and how wide is each? Which standard width (5/10/15/20 MHz) does it match?", "Compare with preparation question 4. Why is the shape flat with sharp edges?"] },
          { do: "בחרו Preset \"Wi-Fi ⁦2.4 GHz⁩ (sweep)\", העבירו את Run mode ל-Repeated sweep ולחצו Run. חכו שה-waterfall יתמלא.", do_en: "Choose the preset \"Wi-Fi 2.4 GHz (sweep)\", set Run mode to Repeated sweep and press Run. Wait for the waterfall to fill.",
            fig: [9], q: ["באילו ערוצים יש פעילות? מה רוחב ערוץ Wi-Fi?", "מה ההבדל בזמן בין Wi-Fi ל-LTE? (רמז: מי משדר רק כשיש מה לשלוח?)"], q_en: ["Which channels are active? How wide is a Wi-Fi channel?", "What is the difference in time between Wi-Fi and LTE? (Hint: who transmits only when there is something to send?)"] },
          { do: "בחרו Preset \"ADS-B aircraft ⁦1090 MHz⁩\" ו-Lower plot = Time: envelope |x|. לחצו Single capture כמה פעמים עד שרואים פולסים. (אם אין מטוסים בסביבה – נסו ISM ⁦433.92 MHz⁩ ולחצו על שלט של שער/רכב.)", do_en: "Choose the preset \"ADS-B aircraft 1090 MHz\" and Lower plot = Time: envelope |x|. Press Single capture a few times until you see pulses. (If no aircraft are around – try ISM 433.92 MHz and press a gate/car remote.)",
            fig: [10], q: ["מה משך הודעה אחת? מה רוחב הפולס? הגדילו (zoom) על הודעה אחת.", "איך נראה הספקטרום של פולסים קצרים, ולמה יש קו חזק באמצע?"], q_en: ["How long is one message? How wide is a pulse? Zoom in on one message.", "What does the spectrum of short pulses look like, and why is there a strong line in the middle?"] },
          { do: "סכמו: מלאו בדוח טבלה שמשווה אנלוגי לדיגיטלי. בסוף סגרו את הממשק (הרדיו משתחרר) ונתקו.", do_en: "Summarize: fill in a table in the report that compares analog and digital. Then close the GUI (the radio is released) and unplug.",
            q: ["לכל סוג אות: צורת הספקטרום, האם הרוחב תלוי בתוכן, האם יש קו נושא, האם הוא רציף או בפרצים, ואיזה מדד רוחב סרט מתאים לו."], q_en: ["For each type of signal: the spectrum shape, whether the width depends on the content, whether there is a carrier line, whether it is continuous or bursty, and which bandwidth measure suits it."] },
        ],
      },
    ],

    figRules: [
      "כל איור ממוספר ועם כיתוב: מה רואים ובאילו הגדרות (fc, fs, N, הגבר).",
      "צילומי מסך מהממשק נשמרים עם Save PNG; גרפים מהסקריפטים נשמרים אוטומטית כ-PNG.",
      "כשמשווים כמה מצבים – אותו ציר Y (Y range בממשק).",
      "סמנו על האיור את המדידה: הסמן, קווי הרוחב והערכים.",
      "ליד כל איור: משפט אחד שמשווה לתאוריה, עם מספרים.",
    ],
    figRules_en: [
      "Every figure is numbered and has a caption: what it shows and the settings (fc, fs, N, gain).",
      "GUI screenshots are saved with Save PNG; script plots are saved automatically as PNG.",
      "When comparing several cases – use the same Y axis (Y range in the GUI).",
      "Show the measurement on the figure: the marker, the width lines and the values.",
      "Next to every figure: one sentence that compares it with theory, with numbers.",
    ],
    figures: [
      { n: 1, part: 1, kind: "graph", t: "הספקטרום הראשון \"ביד\"", t_en: "The first spectrum \"by hand\"",
        set: "sdr_lab1_first_steps · section 6", show: "ציר תדר ב-MHz, ציר Y ב-dBFS, הקו של fc מסומן.", show_en: "Frequency axis in MHz, Y axis in dBFS, the fc line marked.",
        check: "Span = \\(f_s\\), bin = \\(f_s/N\\). איפה ה-DC spike?", check_en: "Span = \\(f_s\\), bin = \\(f_s/N\\). Where is the DC spike?" },
      { n: 2, part: 2, kind: "graph", t: "קצב דגימה = רוחב התמונה", t_en: "Sample rate = width of the picture",
        set: "fig2_span.png", show: "שלושה ספקטרומים: 0.96, 4 ו-⁦20 MSPS⁩, עם קווי 0.4 fs.", show_en: "Three spectra: 0.96, 4 and 20 MSPS, with the 0.4 fs lines.",
        check: "ה-Span שווה ל-\\(f_s\\). מה קורה מעבר ל-0.4 fs?", check_en: "The span equals \\(f_s\\). What happens beyond 0.4 fs?" },
      { n: 3, part: 2, kind: "graph", t: "גודל FFT = רזולוציה", t_en: "FFT size = resolution",
        set: "fig3_rbw.png", show: "שלושה ערכי N על אותו ציר, עם RBW ורצפה במקרא.", show_en: "Three values of N on one axis, with RBW and floor in the legend.",
        check: "הרצפה יורדת \\(10\\log_{10}(N_2/N_1)\\) dB, ופסגת התחנה כמעט לא.", check_en: "The floor drops \\(10\\log_{10}(N_2/N_1)\\) dB, the station's peak hardly at all." },
      { n: 4, part: 2, kind: "graph", t: "רמות ו-SNR כפונקציה של ההגבר", t_en: "Levels and SNR versus gain",
        set: "fig4_gain.png", show: "שיא התחנה, רצפת הרעש ושיא ה-ADC, ו-SNR, עם ההגבר הטוב ביותר מסומן.", show_en: "Station peak, noise floor and ADC peak, and the SNR, with the best gain marked.",
        check: "באיזה הגבר הרצפה מתחילה לעלות? מה הקשר לנקודה שבה שיא ה-ADC מגיע ל-⁦0 dBFS⁩?", check_en: "At which gain does the floor start to rise? How does it relate to where the ADC peak reaches 0 dBFS?" },
      { n: 5, part: 2, kind: "graph", t: "DC spike ו-offset tuning", t_en: "DC spike and offset tuning",
        set: "fig5_dc.png", show: "מכוון על התחנה מול מכוון ⁦400 kHz⁩ מתחת. סמנו את ה-spike ואת ה-image.", show_en: "Tuned on the station versus tuned 400 kHz below. Mark the spike and the image.",
        check: "ה-image נמצא ב-\\(2f_c - f_{station}\\). כמה dBc?", check_en: "The image sits at \\(2f_c - f_{station}\\). How many dBc?" },
      { n: 6, part: 3, kind: "gui", t: "כל רצועת ה-FM (Sweep + Max hold)", t_en: "The whole FM band (Sweep + Max hold)",
        set: "87.5–108 MHz · 4 MSPS · N 4096", show: "כל התחנות, ומדידה על תחנה אחת.", show_en: "All the stations, and a measurement on one station.",
        check: "מספר התחנות והמרווח המינימלי ביניהן.", check_en: "The number of stations and the minimum spacing between them." },
      { n: 7, part: 3, kind: "graph", t: "מקלט FM: RF, MPX ואודיו", t_en: "FM receiver: RF, MPX and audio",
        set: "sdr_fm_listen", show: "ארבעת החלונות. סמנו את הפיילוט, L−R ו-RDS.", show_en: "All four panels. Mark the pilot, L−R and RDS.",
        check: "רוחב ה-99% של התחנה מול קרסון; תדרי הרכיבים מול 19/38/⁦57 kHz⁩.", check_en: "The station's 99% width versus Carson; the component frequencies versus 19/38/57 kHz." },
      { n: 8, part: 4, kind: "gui", t: "ערוצי LTE ברצועה 3", t_en: "LTE channels in band 3",
        set: "1800–1885 MHz · 20 MSPS · N 2048", show: "מדידת 99% על ערוץ אחד לפחות.", show_en: "A 99% measurement on at least one channel.",
        check: "הרוחב מול \\(N_{sc}\\cdot 15\\) kHz של הרוחב התקני הקרוב.", check_en: "The width versus \\(N_{sc}\\cdot 15\\) kHz of the nearest standard width." },
      { n: 9, part: 4, kind: "gui", t: "Wi-Fi ⁦2.4 GHz⁩ – waterfall של סריקות", t_en: "Wi-Fi 2.4 GHz – waterfall of sweeps",
        set: "2400–2484 MHz · Repeated sweep", show: "ה-waterfall מלא, עם מדידת 99% על ערוץ פעיל.", show_en: "A full waterfall, with a 99% measurement on an active channel.",
        check: "רוחב ערוץ מול ⁦16.25 MHz⁩, ופרצים בזמן לעומת LTE.", check_en: "Channel width versus 16.25 MHz, and bursts in time compared with LTE." },
      { n: 10, part: 4, kind: "gui", t: "ADS-B (או שלט ⁦433 MHz⁩) בזמן", t_en: "ADS-B (or a 433 MHz remote) in time",
        set: "1089 MHz · 4 MSPS · Time: envelope |x|", show: "הודעות בזמן, ו-zoom על הודעה אחת.", show_en: "Messages in time, and a zoom on one message.",
        check: "משך הודעה (⁦~120 µs⁩) ורוחב פולס (⁦0.5 µs⁩) מול הספקטרום.", check_en: "Message length (~120 µs) and pulse width (0.5 µs) versus the spectrum." },
    ],

    tables: [
      { id: "bw", title: "טבלה 1 – רוחב הסרט שמדדתם", title_en: "Table 1 – the bandwidth you measured",
        lead: "מלאו מתוך המדידה בממשק. בעמודת 'צפוי' – לפי קרסון או לפי התקן. נשמר בדפדפן; אפשר להוריד כ-CSV.",
        lead_en: "Fill in from the GUI measurement. In the 'expected' column – from Carson or from the standard. Saved in your browser; download as CSV.",
        rowHead: ["אות", "Signal"],
        cols: [["תדר [MHz]", "Freq [MHz]", "num"], ["-26 dB [kHz]", "-26 dB [kHz]", "num"], ["99% [kHz]", "99% [kHz]", "num"], ["צפוי [kHz]", "Expected [kHz]", "num"], ["הערות", "Notes", "text"]],
        rows: [["FM – תחנה חזקה", "FM – strong station"], ["FM – תחנה בינונית", "FM – medium station"], ["FM – תחנה חלשה", "FM – weak station"],
               ["LTE – ערוץ 1", "LTE – channel 1"], ["LTE – ערוץ 2", "LTE – channel 2"], ["LTE – ערוץ 3", "LTE – channel 3"],
               ["Wi-Fi – ערוץ פעיל", "Wi-Fi – active channel"], ["ADS-B / 433 MHz", "ADS-B / 433 MHz"]] },
    ],

    report: {
      lead: "הדוח הוא דוח מעבדה אקדמי: מי שלא היה במעבדה צריך להבין ממנו מה נבדק, איך נמדד, מה יצא ומה זה אומר. כותבים במילים שלכם, בעברית או באנגלית, ומגישים קובץ PDF אחד במודל של הקורס.",
      lead_en: "The report is an academic lab report: someone who was not in the lab must be able to understand what was tested, how it was measured, what came out and what it means. Write in your own words, in Hebrew or English, and submit a single PDF file on the course Moodle.",
      sections: [
        ["עמוד שער", "שם המוסד והמחלקה, שם הקורס ומספרו, שם המעבדה, שמות המגישים ומספרי ת״ז, מספר קבוצה, תאריך הביצוע ותאריך ההגשה, ושם המרצה.",
         "Title page", "Institution and department, course name and number, lab title, names and ID numbers of the authors, group number, date of the lab and of submission, and the lecturer's name."],
        ["תקציר", "5–8 שורות: מה נבדק, באיזה ציוד, התוצאות העיקריות במספרים (למשל: רוחב 99% של תחנת FM נמדד ⁦160 kHz⁩ מול ⁦180 kHz⁩ לפי קרסון), ומסקנה אחת. כותבים אותו אחרון.",
         "Abstract", "5–8 lines: what was tested, with which equipment, the main results with numbers (for example: the 99% width of an FM station was 160 kHz versus 180 kHz from Carson), and one conclusion. Write it last."],
        ["מבוא ורקע תאורטי", "מטרות המעבדה, ורקע קצר במילים שלכם: מקלט SDR והאות המרוכב, ארבעת הפרמטרים והקשר ביניהם, הגדרות רוחב סרט, קרסון ו-OFDM. משוואות ממוספרות ומוזכרות בטקסט.",
         "Introduction and background", "The goals, and a short background in your own words: the SDR receiver and the complex signal, the four parameters and how they relate, bandwidth definitions, Carson and OFDM. Equations numbered and referred to in the text."],
        ["מערך הניסוי ושיטת המדידה", "הרדיו (דגם ומצב AD9363/AD9364), האנטנה, התוכנה, וההגדרות של כל מדידה (fc, fs, N, הגבר, ממוצעים). איך מדדתם רוחב סרט.",
         "Setup and method", "The radio (model and AD9363/AD9364 mode), the antenna, the software, and the settings of every measurement (fc, fs, N, gain, averages). How you measured bandwidth."],
        ["תוצאות", "לפי חלקים 1–4: איורים 1–10 עם כיתוב, טבלה 1, והתשובות לשאלות שמסומנות 'לדוח' ליד האיור המתאים.",
         "Results", "Part by part: Figures 1–10 with captions, Table 1, and the answers to the questions marked 'for the report' next to the relevant figure."],
        ["דיון", "השוואה למספרים התאורטיים (RBW, רצפה, קרסון, רוחב תקני) עם שגיאה באחוזים. מה הגביל אתכם: רעש, רוויה, DC spike, image, USB, דיוק תדר. טבלת השוואה אנלוגי מול דיגיטלי.",
         "Discussion", "Compare with the theoretical numbers (RBW, floor, Carson, standard widths) with percent errors. What limited you: noise, saturation, DC spike, image, USB, frequency accuracy. A comparison table of analog versus digital."],
        ["מסקנות", "4–6 נקודות קצרות: איך לבחור פרמטרים ל-SDR, ומה מבדיל ספקטרום של אות אנלוגי מדיגיטלי.",
         "Conclusions", "4–6 short points: how to choose SDR parameters, and what tells an analog spectrum from a digital one."],
        ["מקורות", "רשימה ממוספרת בסגנון IEEE. למשל: [1] Analog Devices, \"ADALM-PLUTO SDR Active Learning Module\", wiki.analog.com. ‏[2] MathWorks, \"Communications Toolbox Support Package for ADALM-Pluto Radio\". ‏[3] S. Haykin and M. Moher, <i>Introduction to Analog and Digital Communications</i>, 2nd ed. Wiley, 2007.",
         "References", "A numbered list in IEEE style. For example: [1] Analog Devices, \"ADALM-PLUTO SDR Active Learning Module\", wiki.analog.com. [2] MathWorks, \"Communications Toolbox Support Package for ADALM-Pluto Radio\". [3] S. Haykin and M. Moher, <i>Introduction to Analog and Digital Communications</i>, 2nd ed. Wiley, 2007."],
        ["נספחים", "קוד MATLAB שכתבתם או שיניתם, וקבצי הנתונים (CSV, I/Q). לא חלק ממגבלת העמודים.",
         "Appendices", "MATLAB code you wrote or changed, and the data files (CSV, I/Q). Not counted in the page limit."],
      ],
      style: [
        "עד 12 עמודים בלי הנספחים. גופן 12, ריווח 1.5, שוליים 2.5 ס״מ, מספרי עמודים.",
        "איור – כיתוב מתחת לאיור. טבלה – כותרת מעל הטבלה.",
        "כל מספר עם יחידות (MHz, kHz, dBFS, dB) ובדיוק סביר.",
        "משוואות בעורך משוואות (Word או LaTeX), לא צילום של כתב יד.",
        "כותבים בזמן עבר על מה שנעשה, ובזמן הווה על התאוריה.",
        "כל מה שלקוח ממקור – עם הפניה. דוחות של קבוצות אחרות אינם מקור.",
      ],
      style_en: [
        "Up to 12 pages without the appendices. 12 pt font, 1.5 line spacing, 2.5 cm margins, page numbers.",
        "Figures – caption below the figure. Tables – title above the table.",
        "Every number with units (MHz, kHz, dBFS, dB) and sensible precision.",
        "Equations with an equation editor (Word or LaTeX), not a photo of handwriting.",
        "Use the past tense for what you did and the present tense for theory.",
        "Anything taken from a source needs a citation. Other groups' reports are not a source.",
      ],
      submit: [
        ["ייצאו את הדוח ל-PDF: ב-Word – File → Save As → PDF; ב-Overleaf – Download PDF. לא מגישים docx או תמונות.", "Export the report to PDF: in Word – File → Save As → PDF; in Overleaf – Download PDF. Do not submit docx or images."],
        ["תנו לקובץ שם לפי התבנית:", "Name the file using this pattern:", "Lab_SDR_<ID1>_<ID2>.pdf"],
        ["פתחו את ה-PDF ובדקו: האיורים קריאים, העברית והנוסחאות תקינות, וכל העמודים שם.", "Open the PDF and check: the figures are readable, the text and equations render correctly, and every page is there."],
        ["במודל של הקורס היכנסו למטלה \"דוח מעבדת SDR\", לחצו \"הוספת הגשה\", גררו את הקובץ ולחצו \"שמירת שינויים\". אם מופיע כפתור \"הגשה לבדיקה\" – לחצו גם עליו.", "On the course Moodle open the assignment \"SDR lab report\", click \"Add submission\", drag in the file and click \"Save changes\". If there is a \"Submit assignment\" button, click it too."],
        ["ודאו שהסטטוס הוא \"הוגש לציון\". מגישים עד המועד שמופיע במטלה במודל.", "Make sure the status reads \"Submitted for grading\". Submit by the deadline shown in the Moodle assignment."],
      ],
      check: [
        ["עמוד שער מלא, כולל ת״ז ומספר קבוצה", "Complete title page, including IDs and group number"],
        ["תקציר עם התוצאות העיקריות במספרים", "Abstract with the main results in numbers"],
        ["ההגדרות (fc, fs, N, הגבר) של כל מדידה", "The settings (fc, fs, N, gain) of every measurement"],
        ["כל 10 האיורים, עם כיתוב, ומוזכרים בטקסט", "All 10 figures, with captions, referred to in the text"],
        ["טבלה 1 מלאה, עם הערך הצפוי", "Table 1 complete, with the expected values"],
        ["תשובות לכל השאלות שמסומנות 'לדוח'", "Answers to every question marked 'for the report'"],
        ["טבלת השוואה אנלוגי מול דיגיטלי", "A comparison table of analog versus digital"],
        ["דיון במגבלות ה-SDR ובשגיאות", "Discussion of the SDR limits and the errors"],
        ["מסקנות ורשימת מקורות", "Conclusions and a reference list"],
        ["קובץ PDF אחד בשם הנכון, הועלה למודל", "One PDF with the right name, uploaded to Moodle"],
      ],
    },

    files: [
      { file: "sdr_spectrum_lab.zip", d: "כל קבצי המעבדה בקובץ אחד – פרסו לתיקייה אחת ופתחו אותה ב-MATLAB.", d_en: "All the lab files in one archive – unzip into one folder and open it in MATLAB." },
      { file: "sdr_setup_check.m", d: "לפני הכול: בודק את MATLAB, את חבילת התמיכה, את הרדיו ואת מצב ה-AD9363/AD9364.", d_en: "First of all: checks MATLAB, the support package, the radio and the AD9363/AD9364 mode." },
      { file: "sdr_lab1_first_steps.m", d: "חלק 1: יצירת המקלט, לכידה ראשונה, I/Q בזמן וספקטרום \"ביד\".", d_en: "Part 1: creating the receiver, a first capture, I/Q in time and a spectrum \"by hand\"." },
      { file: "sdr_lab2_parameters.m", d: "חלק 2: ארבעה ניסויים – קצב דגימה, גודל FFT, הגבר ו-DC spike. שומר את איורים 2–5.", d_en: "Part 2: four experiments – sample rate, FFT size, gain and DC spike. Saves Figures 2–5." },
      { file: "sdr_spectrum_explorer.m", d: "הממשק: ספקטרום, waterfall, סריקה, Presets לכל רצועה, מדידת רוחב סרט, האזנה ל-FM ושמירה.", d_en: "The GUI: spectrum, waterfall, sweep, presets for each band, bandwidth measurement, FM listening and saving." },
      { file: "sdr_fm_listen.m", d: "מקלט FM שלם: offset tuning, מסנן ערוץ, גלאי FM, אות MPX, de-emphasis ואודיו.", d_en: "A complete FM receiver: offset tuning, channel filter, FM discriminator, MPX, de-emphasis and audio." },
      { file: "sdr_measure_bw.m", d: "מדידת רוחב סרט: ‎-3/-6/-20/-⁦26 dB⁩ ו-99% (ההגדרה של ITU).", d_en: "Bandwidth measurement: -3/-6/-20/-26 dB and 99% (the ITU definition)." },
      { file: "sdr_psd.m", d: "ספקטרום ממוצע ב-dBFS לכל bin, עם חלון Hann, בלי Toolbox.", d_en: "Averaged spectrum in dBFS per bin, Hann window, no toolbox needed." },
      { file: "sdr_source.m", d: "ממשק אחד לרדיו האמיתי ולסימולטור – אותה פקודה בשניהם.", d_en: "One interface for the real radio and the simulator – the same command for both." },
      { file: "sdr_sim_band.m", d: "הסימולטור: FM, AM, PMR, ⁦433 MHz⁩, ADS-B, LTE, Wi-Fi ו-5G, עם רעש, ADC של 12 ביט, DC spike ו-image.", d_en: "The simulator: FM, AM, PMR, 433 MHz, ADS-B, LTE, Wi-Fi and 5G, with noise, a 12-bit ADC, DC spike and image." },
    ],
  },
];
