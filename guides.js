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
        h: "אפנון AM במישור התדר", h_en: "AM in the frequency domain",
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
        h: "המקלט הסינכרוני (קוהרנטי)", h_en: "The synchronous (coherent) receiver",
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

    report: [
      "תשובות לשאלות ההכנה (להגיש לפני המעבדה).",
      "לכל חלק לפי הסדר: האיורים של החלק (1–11) עם כיתוב, והתשובות לשאלות של השלבים.",
      "טבלה 1 (חלק 3) וטבלה 2 (חלק 4) – אפשר להוריד מהאתר כ-CSV.",
      "שני הגרפים מ-MATLAB (איורים 6 ו-10), עם השוואה מספרית לתאוריה.",
      "מסקנות: AM מול DSB-SC, והדרישות ממקלט סינכרוני – בחצי עמוד.",
    ],
    report_en: [
      "Answers to the preparation questions (submit before the lab).",
      "For each part, in order: its figures (1–11) with captions, and the answers to the step questions.",
      "Table 1 (Part 3) and Table 2 (Part 4) – download them from the site as CSV.",
      "The two MATLAB graphs (Figures 6 and 10), with a numerical comparison with theory.",
      "Conclusions: AM versus DSB-SC, and the requirements of a synchronous receiver – half a page.",
    ],

    files: [
      { file: "lab03_am_explore.m", d: "לפני המעבדה: מייצר AM ו-DSB-SC, מציג זמן ותדר ומחשב את חלוקת ההספק. שנו את \\(k_a\\) ובדקו את שאלת הכנה 2.", d_en: "Before the lab: generates AM and DSB-SC, plots time and frequency and computes the power split. Change \\(k_a\\) and check preparation question 2." },
      { file: "lab03_coherent_receiver.m", d: "סימולציה של חלק 4: מקלט סינכרוני עם שגיאת פאזה ושגיאת תדר. השוו לסקופ.", d_en: "Simulation of Part 4: a synchronous receiver with phase and frequency errors. Compare with the scope." },
      { file: "lab03_report_plots.m", d: "אחרי המעבדה: קורא את שתי טבלאות ה-CSV מהאתר ומצייר את איורים 6 ו-10 – מדידה מול תאוריה – ושומר אותם כ-PNG לדוח.", d_en: "After the lab: reads the two CSV tables from the site, draws Figures 6 and 10 – measurement versus theory – and saves them as PNG for the report." },
      { file: "lab03_scope_analysis.m", d: "אחרי המעבדה: טוען קובץ CSV מהסקופ, מוצא את המעטפת, מחשב \\(V_{max}, V_{min}\\) ועומק אפנון ומציג ספקטרום.", d_en: "After the lab: loads a scope CSV file, finds the envelope, computes \\(V_{max}, V_{min}\\) and the depth, and plots the spectrum." },
    ],
  },
];
