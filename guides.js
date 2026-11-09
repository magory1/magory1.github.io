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
      { h: "מחולל, מיקסר ומפצל", h_en: "Generator, mixer and splitter",
        body: "למחולל 33500 שתי יציאות ואפשרות אפנון פנימי (Modulate). למיקסר שלוש כניסות: R ו-L נכנסים ו-I יוצא – במוצא מתקבלים סכום והפרש התדרים. המפצל מחלק אות אחד לשניים (S → 1, 2), ובכיוון ההפוך מחבר שני אותות לאחד (1, 2 → S).",
        body_en: "The 33500 has two outputs and internal modulation (Modulate). The mixer has three ports: R and L in, I out – the output holds the sum and difference frequencies. A splitter divides one signal into two (S → 1, 2) and, in reverse, combines two signals into one (1, 2 → S)." },
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
            q: ["אילו תדרים מופיעים על המסך ובאיזו עוצמה?"], q_en: ["Which frequencies appear on the screen, and at what level?"], rec: "צילום מסך של הספקטרום", rec_en: "Screenshot of the spectrum" },
          { do: "הסבירו את התוצאה.", do_en: "Explain the result.",
            q: ["למה רואים דווקא את התדרים האלה? השתמשו בזהות למכפלת קוסינוסים.", "האם רואים קו ב-10 MHz? אם כן – מאיפה הוא מגיע?"], q_en: ["Why exactly these frequencies? Use the product-of-cosines identity.", "Is there a line at 10 MHz? If so, where does it come from?"],
            hint: "מיקסר אמיתי אינו מכפל מושלם: חלק מאות ה-LO 'דולף' למוצא (LO leakage), ולכן יופיע קו קטן בתדר הגל הנושא. כמה dB הוא נמוך מפסי הצד?", hint_en: "A real mixer is not a perfect multiplier: some LO signal leaks to the output, so a small line appears at the carrier frequency. How many dB below the sidebands is it?" },
          { do: "העבירו את המוצא I לסקופ ועצרו את התצוגה (Run/Stop).", do_en: "Move the I output to the scope and stop the acquisition (Run/Stop).",
            q: ["מהו תדר המעטפת? (קראו מהמשבצות ומבסיס הזמן)", "מהו תדר הגל הנושא?", "האם זה מתאים לציפייה? שימו לב למה שקורה למעטפת כשהמידע עובר דרך אפס."], q_en: ["What is the envelope frequency? (read it from the divisions and the time base)", "What is the carrier frequency?", "Does it match what you expected? Look at what happens to the envelope when the message crosses zero."],
            rec: "צילום מסך של הסקופ", rec_en: "Scope screenshot",
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
            rec: "צילום מסך של הסקופ", rec_en: "Scope screenshot" },
          { do: "העבירו את המוצא לנתח הספקטרום.", do_en: "Move the output to the spectrum analyzer.",
            q: ["אילו תדרים רואים? השוו לחלק 1.", "מה המרחק בין הקווים?", "מופיעים גם קווים לא צפויים – ציינו אותם ונסו להסביר (אי-לינאריות של המיקסר, הרמוניות)."], q_en: ["Which frequencies do you see? Compare with Part 1.", "What is the spacing between the lines?", "Some unexpected lines also appear – list them and try to explain them (mixer nonlinearity, harmonics)."],
            rec: "צילום מסך של הספקטרום", rec_en: "Screenshot of the spectrum" },
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
            rec: "4 צילומי מסך (30/50/70/100%)", rec_en: "4 screenshots (30/50/70/100%)", sim: true },
          { do: "כבו את Modulate וחברו את המחולל לנתח הספקטרום. העבירו את ציר Y ל-Volts.", do_en: "Turn Modulate off and connect the generator to the spectrum analyzer. Switch the Y axis to Volts.",
            q: ["כמה מתח נותן המחולל? (זה הגל הנושא בלבד)"], q_en: ["What voltage does the generator give? (carrier only)"] },
          { do: "הדליקו את Modulate בעומק 100%.", do_en: "Turn Modulate on at 100% depth.",
            q: ["אילו תדרים רואים?", "מדדו את המתח של שלושת הקווים. מה סכומם? השוו לסעיף הקודם.", "כמה מתח יש בסך הכול, וכמה ממנו במידע (פסי הצד)?"], q_en: ["Which frequencies do you see?", "Measure the voltage of the three lines. What is their sum? Compare with the previous step.", "How much voltage is there in total, and how much of it is in the message (sidebands)?"], table: true },
          { do: "חזרו על המדידה בעומק 30%, 50% ו-70%, ומלאו את הטבלה.", do_en: "Repeat the measurement at 30%, 50% and 70% depth and fill in the table.",
            q: ["מה המסקנה? השוו ליעילות התאורטית \\(\\eta = k_a^2/(2+k_a^2)\\) – שימו לב שהיא מחושבת מהספקים, לא ממתחים."], q_en: ["What do you conclude? Compare with the theoretical efficiency \\(\\eta = k_a^2/(2+k_a^2)\\) – note that it is a power ratio, not a voltage ratio."], table: true },
          { do: "עברו ל-DSB-SC: More → DSSC On, והחזירו את העומק ל-100%.", do_en: "Switch to DSB-SC: More → DSSC On, and set the depth back to 100%.",
            q: ["מה רואים בספקטרום? כמה מתח יש עכשיו במידע?"], q_en: ["What do you see on the spectrum? How much voltage is in the message now?"] },
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
            q: ["אילו תדרים יש בנקודות 1, 2, 3 ו-4? הסבירו כל אחד מהם."], q_en: ["Which frequencies are present at points 1, 2, 3 and 4? Explain each one."],
            hint: "בנקודה 3 מצפים לרכיבים סביב 0 (המידע) וסביב 20 MHz. בנקודה 4 ה-LPF השאיר רק את החלק הנמוך. 1 kHz קרוב מאוד ל-0 – בחרו Span מתאים.", hint_en: "At point 3 expect components near 0 (the message) and near 20 MHz. At point 4 the LPF kept only the low part. 1 kHz is very close to 0 – choose a suitable span." },
          { do: "חברו את מוצא המקלט (נקודה 4) לסקופ.", do_en: "Connect the receiver output (point 4) to the scope.",
            q: ["מה רואים? האם שחזרנו את המידע? מה התדר והמשרעת שלו?"], q_en: ["What do you see? Did we recover the message? What are its frequency and amplitude?"], rec: "צילום מסך", rec_en: "Screenshot" },
          { do: "שנו את הפאזה של Output 2. קודם מצאו את הפאזה שבה המידע במשרעת מקסימלית והגדירו אותה כ-0° (הפאזה שמוצגת במחולל אינה הפאזה האמיתית בין האותות). משם הזיזו ל-30°, 60° ו-90°.", do_en: "Change the phase of Output 2. First find the phase at which the message amplitude is largest and call it 0° (the phase shown on the generator is not the true phase between the signals). From there, move to 30°, 60° and 90°.",
            q: ["מה קורה למידע בכל אחד מהפרשי הפאזה?", "הסבירו מתמטית: הראו שהמשרעת פרופורציונית ל-\\(\\cos\\phi\\) והשוו למדידה."], q_en: ["What happens to the message at each phase difference?", "Explain mathematically: show that the amplitude is proportional to \\(\\cos\\phi\\) and compare with your measurement."],
            rec: "צילום מסך לכל פאזה", rec_en: "A screenshot for each phase", sim: "rx" },
          { do: "החזירו את הפאזה ל-0° ושנו את התדר של Output 2 ל-10.000002 MHz.", do_en: "Set the phase back to 0° and change the Output 2 frequency to 10.000002 MHz.",
            q: ["מה קורה עכשיו למידע? באיזה קצב?", "הסבירו מתמטית למה זה קורה."], q_en: ["What happens to the message now? At what rate?", "Explain mathematically why this happens."],
            hint: "הפרש התדרים הוא 2 Hz, ולכן הפאזה בין המשדר למקלט מסתובבת פעמיים בשנייה – והמידע מוכפל ב-\\(\\cos(2\\pi\\cdot 2\\cdot t)\\).", hint_en: "The frequency difference is 2 Hz, so the phase between transmitter and receiver rotates twice per second – and the message is multiplied by \\(\\cos(2\\pi\\cdot 2\\cdot t)\\)." },
          { do: "סכמו.", do_en: "Conclude.",
            q: ["מה המסקנה לגבי תכנון מקלט סינכרוני? איך מקלט אמיתי פותר את הבעיה?"], q_en: ["What do you conclude about designing a synchronous receiver? How does a real receiver solve the problem?"] },
        ],
      },
    ],

    report: [
      "תשובות לשאלות ההכנה (להגיש לפני המעבדה).",
      "לכל שלב: צילומי המסך שסומנו ב'לדוח', והתשובות לשאלות.",
      "טבלת המתחים מחלק 3, עם השוואה לתאוריה.",
      "מסקנות: AM מול DSB-SC, והדרישות ממקלט סינכרוני.",
    ],
    report_en: [
      "Answers to the preparation questions (submit before the lab).",
      "For each step: the screenshots marked 'for the report', and the answers to the questions.",
      "The voltage table from Part 3, compared with theory.",
      "Conclusions: AM versus DSB-SC, and the requirements of a synchronous receiver.",
    ],

    files: [
      { file: "lab03_am_explore.m", d: "לפני המעבדה: מייצר AM ו-DSB-SC, מציג זמן ותדר ומחשב את חלוקת ההספק. שנו את \\(k_a\\) ובדקו את שאלת הכנה 2.", d_en: "Before the lab: generates AM and DSB-SC, plots time and frequency and computes the power split. Change \\(k_a\\) and check preparation question 2." },
      { file: "lab03_coherent_receiver.m", d: "סימולציה של חלק 4: מקלט סינכרוני עם שגיאת פאזה ושגיאת תדר. השוו לסקופ.", d_en: "Simulation of Part 4: a synchronous receiver with phase and frequency errors. Compare with the scope." },
      { file: "lab03_scope_analysis.m", d: "אחרי המעבדה: טוען קובץ CSV מהסקופ, מוצא את המעטפת, מחשב \\(V_{max}, V_{min}\\) ועומק אפנון ומציג ספקטרום.", d_en: "After the lab: loads a scope CSV file, finds the envelope, computes \\(V_{max}, V_{min}\\) and the depth, and plots the spectrum." },
    ],
  },
];
