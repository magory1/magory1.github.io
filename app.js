(() => {
  "use strict";

  const app = document.getElementById("app");
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const thumb = (id, q = "mqdefault") => `https://i.ytimg.com/vi/${encodeURIComponent(id)}/${q}.jpg`;
  const ytWatch = (id) => `https://www.youtube.com/watch?v=${encodeURIComponent(id)}`;
  const ytList = (id) => `https://www.youtube.com/playlist?list=${encodeURIComponent(id)}`;

  /* ---------- language ---------- */
  let EN = false;               // set by the router from the URL (#/en/...)
  const P = () => (EN ? "#/en" : "#");   // link prefix
  const tr = (obj, key) => (EN && obj?.[key + "_en"]) || obj?.[key] || "";
  const lessonTitle = (l) => (EN && l.en) || l.title;
  const topicLabel = (t) => (EN ? t.en : t.label);

  const UI = {
    he: {
      nav: { home: "בית", courses: "קורסים", topics: "נושאים", exam: "הכנה למבחנים", lab: "מעבדה", research: "מחקר", projects: "פרויקטים", about: "אודות" },
      labLead: "ניסויים מעשיים ב-SDR, קורס ידע כללי ב-RF ומחקר – במרכז האקדמי לב.",
      vision: "החזון", equipment: "ציוד", sdrTitle: "מעבדת SDR – ניסויים עם ADALM-Pluto",
      sdrLead: "שבעה ניסויים שבונים רדיו שלם, מטון ראשון ועד OFDM ומכ״ם. כל ניסוי כולל תאוריה קצרה, קוד Python ומשימות מחקר. הקוד רץ בסימולציה גם בלי חומרה.",
      theory: "רקע תאורטי", tasks: "מה לחקור", simResult: "תוצאות סימולציה", hwResult: "תוצאות מהחומרה",
      hwSoon: "יתעדכן אחרי ההרצה על ה-ADALM-Pluto במעבדה.", code: "הקוד", download: "הורדה", showCode: "הצגת הקוד", hideCode: "הסתרת הקוד",
      common: "קובץ משותף (חובה)", allCode: "כל הקוד ב-GitHub ↗", runIt: "הרצה", related: "שיעורים קשורים",
      prevLab: "לניסוי הקודם", nextLab: "לניסוי הבא", allLabs: "כל הניסויים", toLab: "למעבדה",
      rfModules: "נושאי הקורס", rfSoon: "הסרטונים בהכנה. רוצים לקבל עדכון כשהקורס עולה?", notify: "עדכנו אותי", rfSubject: "קורס RF – עדכון",
      collabTitle: "נושאים למחקר ולשיתוף פעולה", collabLead: "כיווני מחקר שהמעבדה מציעה לחברות ולמוסדות. כל נושא יכול להתחיל כפרויקט סטודנטים ולהתפתח למחקר משותף.",
      partners: "מתאים ל", labCta: "המעבדה במכון לב", labCtaText: "ניסויי SDR מעשיים עם קוד מלא, קורס ידע כללי ב-RF ונושאים לשיתוף פעולה.",
      rfCard: "קורס חדש",
      courses: "קורסים", allCourses: "כל הקורסים", byTopic: "לפי נושא", allTopics: "כל הנושאים", featured: "שיעורים מומלצים",
      lessons: "שיעורים", videos: "סרטונים", hours: "שעות", hoursLearning: "שעות לימוד", approxHours: (n) => `כ-${n} שעות`,
      course: "קורס", recordings: "הקלטות", playlistYT: "הפלייליסט ב-YouTube ↗", watchYT: "לצפייה ב-YouTube ↗",
      searchPh: "חיפוש נושא או שיעור, למשל: PLL, הופמן, QAM", search: "חיפוש", searchFor: "חיפוש", results: "תוצאות",
      noResults: "לא נמצאו שיעורים. נסו מילה אחרת, או", browseTopics: "עיינו בנושאים",
      leadSuffix: "כל השיעורים מסודרים לפי קורס ולפי נושא, בסדר הלימוד.",
      heroTopics: ["תקשורת", "אותות ומערכות", "אנטנות", "תורת האינפורמציה"],
      soon: "בקרוב", prepTitle: "מכינה – מתמטיקה ופיזיקה", prepText: "סרטונים קצרים וממוקדים לנושאים שבהם נתקעים: חשמל ומעגלים, מספרים מרוכבים, טריגונומטריה וגלים.",
      projCta: "מחפשים פרויקט גמר?", projCtaText: "פרויקטים פתוחים במכ״ם, SDR ואנטנות – עם ציוד מעבדה אמיתי.", toProjects: "לפרויקטים",
      coursesLead: "כל קורס מסודר ביחידות, לפי סדר הלימוד. אפשר לצפות כאן או ב-YouTube.",
      topicsLead: "מחפשים נושא אחד ספציפי? כאן כל השיעורים מכל הקורסים, מקובצים לפי נושא.",
      fromAll: (n) => `${n} שיעורים מכל הקורסים`,
      examTitle: "הכנה למבחנים", examLead: "שיעורי חזרה, תרגולים ופתרונות תרגילי בית מכל הקורסים, במקום אחד.",
      kinds: { all: "הכול", review: "חזרות", practice: "תרגולים", solution: "פתרונות" },
      kindBadge: { practice: "תרגול", solution: "פתרון", review: "חזרה" },
      researchTitle: "מחקר", researchLead: "תחומי המחקר במעבדה: חישה במכ״ם mmWave, הדמיה ועיבוד אותות.",
      talks: "הרצאות והדגמות",
      industry: "שיתוף פעולה עם התעשייה", industryText: "חברות שמעוניינות לשתף פעולה במחקר, להעמיד ציוד או להציע פרויקט לסטודנטים – מוזמנות ליצור קשר.",
      contact: "יצירת קשר", collabSubject: "שיתוף פעולה במחקר",
      projTitle: "פרויקטי סטודנטים", projLead: "פרויקטים שבוצעו במעבדה, ופרויקטים פתוחים לסטודנטים שמחפשים פרויקט גמר.",
      status: { all: "הכול", open: "פתוחים לסטודנטים", active: "בעבודה", done: "הושלמו" },
      statusBadge: { done: "הושלם", active: "בעבודה", open: "פתוח לסטודנטים" },
      noProjects: "אין כרגע פרויקטים בקטגוריה הזאת.",
      proposeTitle: "רוצים להציע או להצטרף לפרויקט?", proposeText: "שלחו כמה שורות על הרעיון, הקורס שבמסגרתו אתם עובדים והציוד שאתם צריכים.",
      propose: "שליחת הצעה", projSubject: "פרויקט סטודנטים",
      aboutTitle: "אודות",
      about: [
        "ד״ר אייל מגורי הוא מרצה במרכז האקדמי לב (JCT) – מכון לב, בירושלים. הוא מלמד קורסים בתקשורת, באותות ומערכות, באנטנות ובתורת האינפורמציה, ומוביל מחקר בחישה במכ״ם mmWave.",
        "המטרה שלו היא לפתח במכון לב מעבדה לתקשורת, RF ומכ״ם – מקום שבו סטודנטים עובדים על ציוד אמיתי, ושבו נפגשים הוראה, פרויקטים ומחקר עם התעשייה.",
        "האתר מרכז את כל השיעורים, התרגולים והמעבדות שהוקלטו – בחינם, בסדר הלימוד ולפי נושא – כדי שכל סטודנט יוכל ללמוד בקצב שלו.",
      ],
      ytChannel: "ערוץ YouTube", notFound: "הדף לא נמצא", backHome: "חזרה לדף הבית",
      free: "כל השיעורים זמינים בחינם", langNoteEn: "השיעורים בקורס הזה באנגלית", langNoteHe: "",
      more: "←", playLabel: "הפעלת הסרטון",
      menu: "תפריט", other: "English",
    },
    en: {
      nav: { home: "Home", courses: "Courses", topics: "Topics", exam: "Exam prep", lab: "Lab", research: "Research", projects: "Projects", about: "About" },
      labLead: "Hands-on SDR experiments, a general RF course and research – at the Jerusalem College of Technology.",
      vision: "Vision", equipment: "Equipment", sdrTitle: "SDR lab – experiments with the ADALM-Pluto",
      sdrLead: "Seven experiments that build a complete radio, from a first tone to OFDM and radar. Each one has a short theory part, Python code and research tasks. The code runs in simulation even without hardware.",
      theory: "Theory", tasks: "What to investigate", simResult: "Simulation results", hwResult: "Hardware results",
      hwSoon: "Will be added after running on the ADALM-Pluto in the lab.", code: "Code", download: "Download", showCode: "Show code", hideCode: "Hide code",
      common: "Shared module (required)", allCode: "All code on GitHub ↗", runIt: "Run", related: "Related lectures",
      prevLab: "Previous experiment", nextLab: "Next experiment", allLabs: "All experiments", toLab: "Visit the lab",
      rfModules: "Course topics", rfSoon: "Videos are in preparation. Want an update when the course is out?", notify: "Notify me", rfSubject: "RF course – updates",
      collabTitle: "Research and collaboration topics", collabLead: "Research directions the lab offers to companies and institutions. Each topic can start as a student project and grow into joint research.",
      partners: "Relevant for", labCta: "The lab at JCT", labCtaText: "Hands-on SDR experiments with full code, a general RF course and collaboration topics.",
      rfCard: "New course",
      courses: "Courses", allCourses: "All courses", byTopic: "Browse by topic", allTopics: "All topics", featured: "Featured lectures",
      lessons: "lectures", videos: "videos", hours: "hours", hoursLearning: "hours of teaching", approxHours: (n) => `~${n} hours`,
      course: "Course", recordings: "Recorded", playlistYT: "Playlist on YouTube ↗", watchYT: "Watch on YouTube ↗",
      searchPh: "Search a topic or lecture, e.g. PLL, Huffman, QAM", search: "Search", searchFor: "Search", results: "results",
      noResults: "No lectures found. Try another word, or", browseTopics: "browse the topics",
      leadSuffix: "Every lecture is organized by course and by topic, in teaching order.",
      heroTopics: ["Communication", "Signals & Systems", "Antennas", "Information Theory"],
      soon: "Coming soon", prepTitle: "Pre-engineering math & physics", prepText: "Short, focused videos on the topics students get stuck on: circuits, complex numbers, trigonometry and waves.",
      projCta: "Looking for a final-year project?", projCtaText: "Open projects in radar, SDR and antennas – with real lab equipment.", toProjects: "See projects",
      coursesLead: "Each course is organized into units, in teaching order. Watch here or on YouTube.",
      topicsLead: "Looking for one specific topic? Here are the lectures from all courses, grouped by topic.",
      fromAll: (n) => `${n} lectures across all courses`,
      examTitle: "Exam preparation", examLead: "Review sessions, tutorials and homework solutions from all courses, in one place.",
      kinds: { all: "All", review: "Reviews", practice: "Tutorials", solution: "Solutions" },
      kindBadge: { practice: "Tutorial", solution: "Solution", review: "Review" },
      researchTitle: "Research", researchLead: "Research in the lab: mmWave radar sensing, imaging and signal processing.",
      talks: "Talks and demos",
      industry: "Industry collaboration", industryText: "Companies interested in joint research, lending equipment or proposing a student project are welcome to get in touch.",
      contact: "Contact", collabSubject: "Research collaboration",
      projTitle: "Student projects", projLead: "Projects completed in the lab, and open projects for students looking for a final-year project.",
      status: { all: "All", open: "Open to students", active: "In progress", done: "Completed" },
      statusBadge: { done: "Completed", active: "In progress", open: "Open to students" },
      noProjects: "No projects in this category right now.",
      proposeTitle: "Want to propose or join a project?", proposeText: "Send a few lines about the idea, the course you are working in and the equipment you need.",
      propose: "Send a proposal", projSubject: "Student project",
      aboutTitle: "About",
      about: [
        "Dr. Eyal Magory is a lecturer at the Jerusalem College of Technology (JCT) – Lev Academic Center. He teaches communication systems, signals and systems, antennas and information theory, and leads research in mmWave radar sensing.",
        "His goal is to build a communication, RF and radar lab at JCT – a place where students work on real hardware, and where teaching, projects and research meet industry.",
        "This site collects all recorded lectures, tutorials and labs – free, in teaching order and by topic – so every student can learn at their own pace. Most lectures are taught in Hebrew.",
      ],
      ytChannel: "YouTube channel", notFound: "Page not found", backHome: "Back to home",
      free: "All lectures are free", langNoteEn: "", langNoteHe: "Lectures are in Hebrew",
      more: "→", playLabel: "Play video",
      menu: "Menu", other: "עברית",
    },
  };
  const T = () => (EN ? UI.en : UI.he);

  /* ---------- derived indexes ---------- */
  const allLessons = [];
  for (const c of COURSES) for (const u of c.units) for (const l of u.lessons) allLessons.push({ ...l, course: c, unitObj: u });
  for (const s of SPECIALS) allLessons.push({ ...s, course: null, unitObj: null });

  const durToMin = (d) => {
    const p = String(d).split(":").map(Number);
    return p.length === 3 ? p[0] * 60 + p[1] + p[2] / 60 : p[0] + p[1] / 60;
  };
  const hours = (ls) => Math.round(ls.reduce((s, l) => s + durToMin(l.dur), 0) / 60);
  const courseLessons = (c) => c.units.flatMap((u) => u.lessons);
  const topicCount = (tag) => allLessons.filter((l) => l.tags?.includes(tag)).length;
  const unitName = (l) => (l.unitObj ? tr(l.unitObj, "title") : T().talks);

  /* ---------- small components ---------- */
  const badge = (text, cls = "") => `<span class="badge ${cls}">${esc(text)}</span>`;
  const kindBadge = (k) => (T().kindBadge[k] ? badge(T().kindBadge[k], "gold") : "");
  const STATUS_CLS = { done: "green", active: "", open: "gold" };
  const topicChip = (tag, withCount = false) => {
    const t = TOPICS[tag];
    if (!t) return "";
    return `<a class="chip" href="${P()}/topic/${tag}">${esc(topicLabel(t))}${withCount ? ` <small>${topicCount(tag)}</small>` : ""}</a>`;
  };
  const langNote = (c) => {
    if (!c) return "";
    const n = c.lang === "en" ? T().langNoteEn : T().langNoteHe;
    return n ? `<span class="note">${esc(n)}</span>` : "";
  };

  const lessonRow = (l, current, hrefBase) => `
    <li>
      <a class="lesson ${current ? "current" : ""}" href="${hrefBase}${encodeURIComponent(l.id)}" ${current ? 'aria-current="true"' : ""}>
        <div class="thumb"><img loading="lazy" src="${thumb(l.id)}" alt=""><span>${esc(l.dur)}</span></div>
        <div>
          <div class="t">${esc(lessonTitle(l))}</div>
          <div class="k">${kindBadge(l.kind)}${l.course && hrefBase.includes("/topic/") ? `<span class="muted" style="font-size:14px">${esc(tr(l.course, "title"))}</span>` : ""}</div>
        </div>
      </a>
    </li>`;

  const player = (l) => `
    <div class="video" id="video">
      <button type="button" aria-label="${esc(T().playLabel)}: ${esc(lessonTitle(l))}" style="background-image:url('${thumb(l.id, "hqdefault")}')" data-id="${esc(l.id)}"></button>
    </div>
    <div class="now">
      <h2>${esc(lessonTitle(l))}</h2>
      <div class="muted">${l.course ? esc(tr(l.course, "title")) + " · " : ""}${esc(unitName(l))} · ${esc(l.dur)}</div>
      <div class="chips">${(l.tags || []).map((t) => topicChip(t)).join("")}</div>
      <p><a href="${ytWatch(l.id)}" target="_blank" rel="noopener">${T().watchYT}</a></p>
    </div>`;

  const wireVideo = () => {
    const btn = app.querySelector("#video button");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(btn.dataset.id)}?autoplay=1&rel=0${EN ? "&hl=en" : "&hl=iw"}`;
      iframe.title = btn.getAttribute("aria-label");
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      btn.replaceWith(iframe);
    });
  };

  const courseCard = (c) => {
    const ls = courseLessons(c);
    return `
      <a class="card course-card" href="${P()}/course/${c.id}" style="--c:${c.color}">
        <div class="code">${T().course} ${esc(c.code)} · ${esc(tr(c, "year"))}</div>
        <h3>${esc(tr(c, "title"))}</h3>
        <div class="muted">${esc(tr(c, "summary"))}</div>
        <div class="meta"><span>${ls.length} ${T().videos}</span><span>${T().approxHours(hours(ls))}</span></div>
      </a>`;
  };

  const thumbCard = (l, href, ext = false) => `
    <a class="card" href="${href}" ${ext ? 'target="_blank" rel="noopener"' : ""} style="padding:0;overflow:hidden">
      <img loading="lazy" src="${thumb(l.id)}" alt="" style="aspect-ratio:16/9;object-fit:cover">
      <div style="padding:14px 16px 16px"><h3 style="font-size:17px">${esc(lessonTitle(l))}</h3><div class="muted" style="font-size:14px">${l.course ? esc(tr(l.course, "title")) + " · " : ""}${esc(l.dur)}</div></div>
    </a>`;

  const instBadge = () => LAB.logo
    ? `<img class="inst-logo" src="${esc(LAB.logo)}" alt="JCT">`
    : `<span class="inst-mark" aria-hidden="true">JCT</span>`;
  const REPO = "https://github.com/magory1/magory1.github.io/tree/main/sdr";

  /* ---------- pages ---------- */
  const pages = {};

  /* home: academic profile page */
  const HOME = {
    he: {
      position: "מרצה בהנדסת חשמל ותקשורת",
      bio: [
        "ד״ר אייל מגורי מלמד במרכז האקדמי לב (JCT) בירושלים קורסים בתקשורת, באותות ומערכות, באנטנות ובתורת האינפורמציה. המחקר שלו עוסק בחישה במכ״ם mmWave, בהדמיה ובעיבוד אותות.",
        "הוא מקים במכון לב מעבדה לתקשורת, RF ומכ״ם, שבה סטודנטים עובדים על ציוד אמיתי – ומשתף את כל ההרצאות והמעבדות באתר הזה, בחינם.",
      ],
      interests: "תחומי עניין", interestList: ["חישה במכ״ם mmWave וניטור סימנים חיוניים", "הדמיית מכ״ם בשדה קרוב (SAR)", "עיבוד אותות ומערכות תקשורת", "רדיו מוגדר תוכנה (SDR)", "אנטנות ו-RF"],
      email: "דוא״ל", teaching: "הוראה", teachingLead: "הרצאות מוקלטות מלאות, בסדר הלימוד.",
      thCode: "מס׳ קורס", thCourse: "קורס", thYear: "שנה", thLect: "הרצאות",
      upcoming: "בהכנה", research: "מחקר", allResearch: "כל תחומי המחקר והצעות לשיתוף פעולה",
      lab: "המעבדה", labText: "שבעה ניסויים ב-ADALM-Pluto שבונים רדיו שלם – מטון ראשון ועד OFDM ומכ״ם. לכל ניסוי רקע תאורטי, קוד Python ומשימות מחקר.",
      toLab: "לניסויים", students: "לסטודנטים",
      links: [["exam", "הכנה למבחנים", "חזרות, תרגולים ופתרונות"], ["topics", "חיפוש לפי נושא", "כל השיעורים מקובצים לפי נושא"], ["projects", "פרויקטי גמר", "פרויקטים פתוחים במכ״ם, SDR ואנטנות"]],
      summary: (c, l, h) => `${c} קורסים · ${l} הרצאות · ${h}+ שעות לימוד`,
    },
    en: {
      position: "Lecturer in Electrical and Communication Engineering",
      bio: [
        "Dr. Eyal Magory teaches communication systems, signals and systems, antennas and information theory at the Jerusalem College of Technology (JCT). His research focuses on mmWave radar sensing, imaging and signal processing.",
        "He is building a communication, RF and radar lab at JCT, where students work on real hardware – and shares all lectures and labs on this site, free of charge.",
      ],
      interests: "Research interests", interestList: ["mmWave radar sensing and vital-sign monitoring", "Near-field radar imaging (SAR)", "Signal processing and communication systems", "Software-defined radio (SDR)", "Antennas and RF"],
      email: "Email", teaching: "Teaching", teachingLead: "Full recorded lectures, in teaching order.",
      thCode: "Code", thCourse: "Course", thYear: "Year", thLect: "Lectures",
      upcoming: "In preparation", research: "Research", allResearch: "All research areas and collaboration topics",
      lab: "The lab", labText: "Seven ADALM-Pluto experiments that build a complete radio – from a first tone to OFDM and radar. Each comes with theory, Python code and research tasks.",
      toLab: "View experiments", students: "For students",
      links: [["exam", "Exam preparation", "Reviews, tutorials and solutions"], ["topics", "Browse by topic", "All lectures grouped by topic"], ["projects", "Final-year projects", "Open projects in radar, SDR and antennas"]],
      summary: (c, l, h) => `${c} courses · ${l} lectures · ${h}+ hours of teaching`,
    },
  };

  pages.home = () => {
    const t = T(), h = EN ? HOME.en : HOME.he;
    const photo = SITE.photo ? `<img class="portrait" src="${esc(SITE.photo)}" alt="${esc(tr(SITE, "owner"))}">` : "";
    return `
      <section class="profile"><div class="wrap profile-grid">
        <div>
          ${photo}
          <h1>${esc(tr(SITE, "owner"))}</h1>
          <div class="position">${h.position}</div>
          <div class="affil">${instBadge()}${esc(tr(LAB, "inst"))}</div>
          ${h.bio.map((p) => `<p>${esc(p)}</p>`).join("")}
          <ul class="contact">
            <li><span>${h.email}</span> <a href="mailto:${esc(SITE.email)}" dir="ltr">${esc(SITE.email)}</a></li>
            <li><span>YouTube</span> <a href="${esc(SITE.youtube)}" target="_blank" rel="noopener" dir="ltr">@JCT_1</a></li>
            <li><span>GitHub</span> <a href="https://github.com/magory1" target="_blank" rel="noopener" dir="ltr">magory1</a></li>
          </ul>
        </div>
        <aside class="interests">
          <h2>${h.interests}</h2>
          <ul>${h.interestList.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
        </aside>
      </div></section>

      <section class="acad"><div class="wrap">
        <div class="acad-head"><h2>${h.teaching}</h2><span class="muted">${h.summary(COURSES.length, allLessons.length, hours(allLessons))}</span></div>
        <table class="courses-table">
          <thead><tr><th>${h.thCode}</th><th>${h.thCourse}</th><th>${h.thYear}</th><th>${h.thLect}</th></tr></thead>
          <tbody>
            ${COURSES.map((c) => `<tr><td dir="ltr">${esc(c.code)}</td><td><a href="${P()}/course/${c.id}">${esc(tr(c, "title"))}</a>${c.lang === "en" && !EN ? ' <small class="muted">(English)</small>' : ""}</td><td>${esc(tr(c, "year"))}</td><td>${courseLessons(c).length}</td></tr>`).join("")}
            <tr><td>—</td><td><a href="${P()}/rf">${esc(tr(RF_COURSE, "title"))}</a></td><td colspan="2" class="muted">${h.upcoming}</td></tr>
          </tbody>
        </table>
        <form class="search search-inline" role="search" id="search-form">
          <input type="search" id="q" placeholder="${esc(t.searchPh)}" aria-label="${t.search}">
          <button type="submit">${t.search}</button>
        </form>
      </div></section>

      <section class="acad"><div class="wrap">
        <div class="acad-head"><h2>${h.research}</h2><a href="${P()}/research">${h.allResearch} ${t.more}</a></div>
        <ol class="research-list">${RESEARCH.map((r) => `<li><b>${esc(tr(r, "title"))}</b><span class="muted">${esc(tr(r, "text"))}</span></li>`).join("")}</ol>
      </div></section>

      <section class="acad"><div class="wrap">
        <div class="acad-head"><h2>${h.lab}</h2><a href="${P()}/lab">${h.toLab} ${t.more}</a></div>
        <p class="lab-text">${h.labText}</p>
        <ol class="lab-list">${SDR_LABS.map((l) => `<li><a href="${P()}/sdr/${l.id}">${esc(tr(l, "title").replace(/^(ניסוי|Lab) \d+ – /, ""))}</a></li>`).join("")}</ol>
      </div></section>

      <section class="acad"><div class="wrap">
        <div class="acad-head"><h2>${h.students}</h2></div>
        <div class="student-links">${h.links.map(([r, a, b]) => `<a href="${P()}/${r}"><b>${a}</b><span>${b}</span></a>`).join("")}</div>
      </div></section>`;
  };

  pages.courses = () => `
    <div class="wrap page-head"><h1>${T().courses}</h1><p class="muted">${T().coursesLead}</p></div>
    <section class="block" style="padding-top:10px"><div class="wrap"><div class="grid">${COURSES.map(courseCard).join("")}</div></div></section>`;

  pages.course = (cid, vid) => {
    const c = COURSES.find((x) => x.id === cid);
    if (!c) return pages.notfound();
    const t = T();
    const ls = courseLessons(c);
    const cur = allLessons.find((l) => l.course === c && l.id === vid) || allLessons.find((l) => l.course === c);
    return `
      <div class="wrap page-head">
        <div class="crumbs"><a href="${P()}/courses">${t.courses}</a> / ${t.course} ${esc(c.code)}</div>
        <h1>${esc(tr(c, "title"))}</h1>
        <p class="muted">${esc(tr(c, "summary"))}</p>
        <p class="muted" style="font-size:15px">${ls.length} ${t.videos} · ${t.approxHours(hours(ls))} · ${t.recordings} ${esc(tr(c, "year"))} · <a href="${ytList(c.playlist)}" target="_blank" rel="noopener">${t.playlistYT}</a></p>
        ${langNote(c)}
      </div>
      <div class="wrap course-layout">
        <div>
          ${c.units.map((u) => `
            <div class="unit">
              <h3>${esc(tr(u, "title"))} <small>${u.lessons.length} ${t.videos}</small></h3>
              <ol class="lessons">${u.lessons.map((l) => lessonRow(l, l.id === cur.id, `${P()}/course/${c.id}/`)).join("")}</ol>
            </div>`).join("")}
        </div>
        <aside class="player">${player(cur)}</aside>
      </div>`;
  };

  pages.topics = () => {
    const groups = {};
    for (const [k, t] of Object.entries(TOPICS)) {
      if (!topicCount(k)) continue;
      (groups[t.group] ||= []).push(k);
    }
    return `
      <div class="wrap page-head"><h1>${T().nav.topics}</h1><p class="muted">${T().topicsLead}</p></div>
      <section class="block" style="padding-top:10px"><div class="wrap">
        ${Object.entries(groups).map(([g, ks]) => `
          <div class="topic-group"><h3>${esc(EN ? TOPIC_GROUPS[g].en : TOPIC_GROUPS[g].label)}</h3><div class="chips">${ks.map((k) => topicChip(k, true)).join("")}</div></div>`).join("")}
      </div></section>`;
  };

  pages.topic = (tag, vid) => {
    const tp = TOPICS[tag];
    if (!tp) return pages.notfound();
    const ls = allLessons.filter((l) => l.tags?.includes(tag));
    if (!ls.length) return pages.notfound();
    const cur = ls.find((l) => l.id === vid) || ls[0];
    const g = TOPIC_GROUPS[tp.group];
    return `
      <div class="wrap page-head">
        <div class="crumbs"><a href="${P()}/topics">${T().nav.topics}</a> / ${esc(EN ? g.en : g.label)}</div>
        <h1>${esc(topicLabel(tp))}</h1>
        <p class="muted">${T().fromAll(ls.length)}</p>
      </div>
      <div class="wrap course-layout">
        <div><ol class="lessons">${ls.map((l) => lessonRow(l, l.id === cur.id, `${P()}/topic/${tag}/`)).join("")}</ol></div>
        <aside class="player">${player(cur)}</aside>
      </div>`;
  };

  pages.exam = (vid) => {
    const t = T();
    const ls = allLessons.filter((l) => l.tags?.includes("exam"));
    const f = pages.exam.filter || "all";
    const shown = f === "all" ? ls : ls.filter((l) => l.kind === f);
    const cur = shown.find((l) => l.id === vid) || shown[0];
    return `
      <div class="wrap page-head"><h1>${t.examTitle}</h1><p class="muted">${t.examLead}</p>${EN ? langNote({}) : ""}</div>
      <div class="wrap"><div class="filters">${Object.entries(t.kinds).map(([k, v]) => `<button type="button" data-kind="${k}" class="${f === k ? "on" : ""}">${v}</button>`).join("")}</div></div>
      <div class="wrap course-layout">
        <div><ol class="lessons">${shown.map((l) => lessonRow(l, cur && l.id === cur.id, `${P()}/exam/`)).join("")}</ol></div>
        <aside class="player">${cur ? player(cur) : ""}</aside>
      </div>`;
  };

  pages.research = () => {
    const t = T();
    return `
      <div class="wrap page-head"><h1>${t.researchTitle}</h1><p class="muted">${t.researchLead}</p></div>
      <section class="block" style="padding-top:10px"><div class="wrap">
        <div class="grid">${RESEARCH.map((r) => `
          <div class="card research-item"><h3>${esc(tr(r, "title"))}</h3><div class="muted">${esc(tr(r, "text"))}</div>
            <div class="chips" style="margin-top:6px">${r.tags.map((k) => topicChip(k)).join("")}</div></div>`).join("")}</div>
      </div></section>
      <section class="block"><div class="wrap">
        <div class="section-head"><h2>${t.talks}</h2></div>
        <div class="grid">${SPECIALS.map((l) => thumbCard(l, ytWatch(l.id), true)).join("")}</div>
      </div></section>
      <section class="block" id="collab"><div class="wrap">
        <div class="section-head"><h2>${t.collabTitle}</h2></div>
        <p class="muted" style="margin-top:-6px">${t.collabLead}</p>
        <div class="grid">${COLLAB.map((c) => `
          <div class="card"><h3>${esc(EN ? c.en : c.he)}</h3><div class="muted">${esc(tr(c, "d"))}</div>
            <div class="partners"><b>${t.partners}:</b> ${esc(tr(c, "who"))}</div></div>`).join("")}</div>
      </div></section>
      <section class="block"><div class="wrap">
        <div class="callout">
          <div><h3>${t.industry}</h3><div class="muted">${t.industryText}</div></div>
          <a class="btn" href="mailto:${esc(SITE.email)}?subject=${encodeURIComponent(t.collabSubject)}">${t.contact}</a>
        </div>
      </div></section>`;
  };

  pages.projects = () => {
    const t = T();
    const f = pages.projects.filter || "all";
    const shown = f === "all" ? PROJECTS : PROJECTS.filter((p) => p.status === f);
    return `
      <div class="wrap page-head"><h1>${t.projTitle}</h1><p class="muted">${t.projLead}</p></div>
      <div class="wrap"><div class="filters">${Object.entries(t.status).map(([k, v]) => `<button type="button" data-status="${k}" class="${f === k ? "on" : ""}">${v}</button>`).join("")}</div></div>
      <section class="block" style="padding-top:0"><div class="wrap">
        ${shown.length ? `<div class="grid">${shown.map((p) => `
          <div class="card project">
            ${p.video ? `<a class="thumb" href="${ytWatch(p.video)}" target="_blank" rel="noopener"><img loading="lazy" src="${thumb(p.video)}" alt=""></a>` : ""}
            <div>${t.statusBadge[p.status] ? badge(t.statusBadge[p.status], STATUS_CLS[p.status]) : ""}</div>
            <h3>${esc(tr(p, "title"))}</h3>
            <div class="muted">${esc(tr(p, "text"))}</div>
            <div class="chips" style="margin-top:4px">${(p.tags || []).map((k) => topicChip(k)).join("")}</div>
          </div>`).join("")}</div>` : `<div class="empty">${t.noProjects}</div>`}
      </div></section>
      <section class="block"><div class="wrap">
        <div class="callout">
          <div><h3>${t.proposeTitle}</h3><div class="muted">${t.proposeText}</div></div>
          <a class="btn" href="mailto:${esc(SITE.email)}?subject=${encodeURIComponent(t.projSubject)}">${t.propose}</a>
        </div>
      </div></section>`;
  };

  pages.lab = () => {
    const t = T();
    return `
      <div class="wrap page-head">
        <div class="inst">${instBadge()}${esc(tr(LAB, "inst"))}</div>
        <h1>${esc(tr(LAB, "name"))}</h1><p class="muted">${t.labLead}</p>
      </div>
      <section class="block" style="padding-top:10px"><div class="wrap lab-intro">
        <div><h2>${t.vision}</h2>${(EN ? LAB.vision_en : LAB.vision).map((p) => `<p>${esc(p)}</p>`).join("")}</div>
        <div class="card"><h3>${t.equipment}</h3><ul class="eq">${LAB.equipment.map((e) => `<li>${esc(EN ? e.en : e.he)}</li>`).join("")}</ul></div>
      </div></section>
      <section class="block"><div class="wrap">
        <div class="section-head"><h2>${t.sdrTitle}</h2><a href="${REPO}" target="_blank" rel="noopener">${t.allCode}</a></div>
        <p class="muted" style="margin-top:-6px">${t.sdrLead}</p>
        <div class="grid">${SDR_LABS.map((l) => `
          <a class="card lab-card" href="${P()}/sdr/${l.id}">
            <img loading="lazy" src="sdr/figures/${esc(l.fig)}" alt="">
            <h3>${esc(tr(l, "title"))}</h3>
            <div class="muted">${esc((EN ? l.theory_en : l.theory)[0])}</div>
          </a>`).join("")}</div>
      </div></section>
      <section class="block"><div class="wrap">
        <div class="callout">
          <div><h3>${esc(tr(RF_COURSE, "title"))}</h3><div class="muted">${esc(tr(RF_COURSE, "lead"))}</div></div>
          <a class="btn" href="${P()}/rf">${t.rfModules}</a>
        </div>
      </div></section>
      <section class="block" style="padding-top:0"><div class="wrap">
        <div class="callout">
          <div><h3>${t.collabTitle}</h3><div class="muted">${t.collabLead}</div></div>
          <a class="btn" href="${P()}/research">${t.nav.research}</a>
        </div>
      </div></section>`;
  };

  pages.sdr = (id) => {
    const t = T();
    const i = SDR_LABS.findIndex((l) => l.id === id);
    if (i < 0) return pages.notfound();
    const l = SDR_LABS[i], prev = SDR_LABS[i - 1], next = SDR_LABS[i + 1];
    const rel = allLessons.filter((x) => x.course && x.tags?.some((g) => l.tags.includes(g) && g !== "sdr")).slice(0, 4);
    return `
      <div class="wrap page-head">
        <div class="crumbs"><a href="${P()}/lab">${t.nav.lab}</a> / SDR</div>
        <h1>${esc(tr(l, "title"))}</h1>
        <div class="chips">${l.tags.map((k) => topicChip(k)).join("")}</div>
      </div>
      <div class="wrap lab-page">
        <section><h2>${t.theory}</h2>${(EN ? l.theory_en : l.theory).map((p) => `<p>${esc(p)}</p>`).join("")}</section>
        <section><h2>${t.tasks}</h2><ol class="tasks">${(EN ? l.tasks_en : l.tasks).map((p) => `<li>${esc(p)}</li>`).join("")}</ol></section>
        <section><h2>${t.code}</h2>
          <div class="code-box" dir="ltr">
            <div class="code-actions">
              <a class="btn" href="sdr/${esc(l.file)}" download>${t.download} ${esc(l.file)}</a>
              <a class="btn ghost" href="sdr/pluto_common.py" download>${t.common}: pluto_common.py</a>
              <button type="button" class="btn ghost" id="show-code">${t.showCode}</button>
            </div>
            <pre class="run"><code>pip install numpy scipy matplotlib
python ${esc(l.file)}            # simulation
python ${esc(l.file)} --pluto    # ADALM-Pluto (TX→RX cable + 30 dB attenuator)</code></pre>
            <pre class="src" id="src" hidden><code></code></pre>
          </div>
        </section>
        <section><h2>${t.simResult}</h2>
          <figure class="fig"><a href="sdr/figures/${esc(l.fig)}" target="_blank" rel="noopener"><img loading="lazy" src="sdr/figures/${esc(l.fig)}" alt="${esc(tr(l, "title"))}"></a>
          <figcaption>${esc(tr(l, "sim"))}</figcaption></figure>
        </section>
        <section><h2>${t.hwResult}</h2><div class="empty">${t.hwSoon}</div></section>
        ${rel.length ? `<section><h2>${t.related}</h2><div class="grid">${rel.map((x) => thumbCard(x, `${P()}/course/${x.course.id}/${x.id}`)).join("")}</div></section>` : ""}
        <nav class="lab-nav">
          ${prev ? `<a href="${P()}/sdr/${prev.id}">${EN ? "←" : "→"} ${t.prevLab}</a>` : "<span></span>"}
          <a href="${P()}/lab">${t.allLabs}</a>
          ${next ? `<a href="${P()}/sdr/${next.id}">${t.nextLab} ${EN ? "→" : "←"}</a>` : "<span></span>"}
        </nav>
      </div>`;
  };

  pages.rf = () => {
    const t = T();
    return `
      <div class="wrap page-head">
        <div class="crumbs"><a href="${P()}/lab">${t.nav.lab}</a> / RF</div>
        <h1>${esc(tr(RF_COURSE, "title"))}</h1><p class="muted">${esc(tr(RF_COURSE, "lead"))}</p>
      </div>
      <section class="block" style="padding-top:10px"><div class="wrap" style="max-width:860px">
        <h2>${t.rfModules}</h2>
        <ol class="modules">${RF_COURSE.modules.map((m) => `<li><b>${esc(EN ? m.en : m.he)}</b><span class="muted">${esc(tr(m, "d"))}</span></li>`).join("")}</ol>
        <div class="callout" style="margin-top:24px">
          <div><h3>${t.soon}</h3><div class="muted">${t.rfSoon}</div></div>
          <a class="btn" href="mailto:${esc(SITE.email)}?subject=${encodeURIComponent(t.rfSubject)}">${t.notify}</a>
        </div>
      </div></section>`;
  };

  pages.about = () => `
    <div class="wrap page-head"><h1>${T().aboutTitle}</h1></div>
    <section class="block" style="padding-top:10px"><div class="wrap" style="max-width:760px">
      ${T().about.map((p) => `<p>${esc(p)}</p>`).join("")}
      <p><a class="btn" href="mailto:${esc(SITE.email)}">${T().contact}</a> <a class="btn ghost" href="${esc(SITE.youtube)}" target="_blank" rel="noopener">${T().ytChannel}</a></p>
    </div></section>`;

  pages.search = (q) => {
    const t = T();
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const hay = (l) => [l.title, l.en, l.unitObj?.title, l.unitObj?.title_en, l.course?.title, l.course?.title_en,
      ...(l.tags || []).flatMap((k) => [TOPICS[k]?.label, TOPICS[k]?.en])].join(" ").toLowerCase();
    const res = allLessons.filter((l) => words.every((w) => hay(l).includes(w)));
    return `
      <div class="wrap page-head"><h1>${t.searchFor}: ${esc(q)}</h1><p class="muted">${res.length} ${t.results}</p>
        <form class="search" role="search" id="search-form" style="margin:14px 0 0;max-width:520px;box-shadow:var(--shadow);border:1px solid var(--line)">
          <input type="search" id="q" value="${esc(q)}" aria-label="${t.search}"><button type="submit">${t.search}</button></form></div>
      <section class="block" style="padding-top:16px"><div class="wrap" style="max-width:820px">
        ${res.length ? `<ol class="lessons">${res.map((l) => lessonRow(l, false, l.course ? `${P()}/course/${l.course.id}/` : `${P()}/topic/${l.tags[0]}/`)).join("")}</ol>`
          : `<div class="empty">${t.noResults} <a href="${P()}/topics">${t.browseTopics}</a>.</div>`}
      </div></section>`;
  };

  pages.notfound = () => `<div class="wrap page-head"><h1>${T().notFound}</h1><p><a href="${P()}/">${T().backHome}</a></p></div>`;

  /* ---------- chrome (header/footer) ---------- */
  function applyChrome(rest) {
    const t = T();
    document.documentElement.lang = EN ? "en" : "he";
    document.documentElement.dir = EN ? "ltr" : "rtl";
    document.title = EN ? "Dr. Eyal Magory – JCT | Courses, Lab & Research" : "ד״ר אייל מגורי – מכון לב | קורסים, מעבדה ומחקר";
    const routes = { home: "/", courses: "/courses", topics: "/topics", exam: "/exam", lab: "/lab", research: "/research", projects: "/projects", about: "/about" };
    document.querySelectorAll("nav.main a").forEach((a) => {
      a.textContent = t.nav[a.dataset.nav];
      a.href = P() + routes[a.dataset.nav];
    });
    const brand = document.querySelector(".brand");
    brand.href = P() + "/";
    brand.lastChild.textContent = " " + tr(SITE, "owner");
    const lb = document.getElementById("lang-btn");
    lb.textContent = t.other;
    lb.lang = EN ? "he" : "en";
    lb.href = (EN ? "#/" : "#/en/") + rest;            // same page in the other language
    document.querySelector(".menu-btn").setAttribute("aria-label", t.menu);
    document.getElementById("foot-owner").textContent = tr(SITE, "owner") + " · " + tr(LAB, "inst_short");
    document.getElementById("foot-free").textContent = t.free;
    document.getElementById("yt-link").textContent = t.ytChannel;
    document.getElementById("mail-link").textContent = t.contact;
  }

  /* ---------- router ---------- */
  const navKey = { "": "home", courses: "courses", course: "courses", topics: "topics", topic: "topics", exam: "exam", lab: "lab", sdr: "lab", rf: "lab", research: "research", projects: "projects", about: "about" };

  function render() {
    let raw = location.hash.replace(/^#\/?/, "");
    EN = raw === "en" || raw.startsWith("en/");
    if (EN) raw = raw.replace(/^en\/?/, "");
    applyChrome(raw);
    const [path, query] = raw.split("?");
    const [p0, p1, p2] = path.split("/").map(decodeURIComponent);
    let html;
    switch (p0) {
      case "": case undefined: html = pages.home(); break;
      case "courses": html = pages.courses(); break;
      case "course": html = pages.course(p1, p2); break;
      case "topics": html = pages.topics(); break;
      case "topic": html = pages.topic(p1, p2); break;
      case "exam": html = pages.exam(p1); break;
      case "lab": html = pages.lab(); break;
      case "sdr": html = pages.sdr(p1); break;
      case "rf": html = pages.rf(); break;
      case "research": html = pages.research(); break;
      case "projects": html = pages.projects(); break;
      case "about": html = pages.about(); break;
      case "search": html = pages.search(new URLSearchParams(query || "").get("q") || ""); break;
      default: html = pages.notfound();
    }
    app.innerHTML = html;
    document.querySelectorAll("nav.main a").forEach((a) => a.classList.toggle("active", a.dataset.nav === (navKey[p0 || ""] || "")));
    document.querySelector("nav.main").classList.remove("open");
    wireVideo();
    wirePage();
    if (!p2 && !(p0 === "exam" && p1)) window.scrollTo(0, 0);
    else if (window.innerWidth <= 960) document.getElementById("video")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function wirePage() {
    const form = app.querySelector("#search-form");
    if (form) form.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = app.querySelector("#q").value.trim();
      if (q) location.hash = `${P()}/search?q=${encodeURIComponent(q)}`;
    });
    const sc = app.querySelector("#show-code");
    if (sc) sc.addEventListener("click", async () => {
      const pre = app.querySelector("#src");
      if (!pre.hidden) { pre.hidden = true; sc.textContent = T().showCode; return; }
      const file = app.querySelector(".code-actions a").getAttribute("href");
      if (!pre.dataset.loaded) {
        try { pre.firstChild.textContent = await (await fetch(file)).text(); pre.dataset.loaded = "1"; }
        catch { pre.firstChild.textContent = "Could not load " + file; }
      }
      pre.hidden = false; sc.textContent = T().hideCode;
    });
    app.querySelectorAll("[data-kind]").forEach((b) => b.addEventListener("click", () => { pages.exam.filter = b.dataset.kind; render(); }));
    app.querySelectorAll("[data-status]").forEach((b) => b.addEventListener("click", () => { pages.projects.filter = b.dataset.status; render(); }));
  }

  document.querySelector(".menu-btn").addEventListener("click", (e) => {
    const open = document.querySelector("nav.main").classList.toggle("open");
    e.currentTarget.setAttribute("aria-expanded", String(open));
  });
  document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("yt-link").href = SITE.youtube;
  document.getElementById("mail-link").href = "mailto:" + SITE.email;

  window.addEventListener("hashchange", render);
  render();
})();
