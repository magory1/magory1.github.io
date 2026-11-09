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
      researchTitle: "מחקר", researchLead: "לייזר אלקטרונים חופשיים ומקורות קרינה יחסותיים, חישה והדמיה במכ״ם mmWave ועיבוד אותות.",
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
        "ד״ר אייל מגורי הוא מרצה במרכז האקדמי לב (JCT) – מכון לב, בירושלים. הוא מלמד קורסים בתקשורת, באותות ומערכות, באנטנות, בתורת האינפורמציה ובתקשורת אופטית. המחקר שלו עוסק בלייזר אלקטרונים חופשיים (FEL) ובמקורות קרינה של אלומות אלקטרונים יחסותיות, ובחישה במכ״ם mmWave.",
        "המטרה שלו היא לפתח במכון לב מעבדה לתקשורת, RF ומכ״ם – מקום שבו סטודנטים עובדים על ציוד אמיתי, ושבו נפגשים הוראה, פרויקטים ומחקר עם התעשייה.",
        "האתר מרכז את כל השיעורים, התרגולים והמעבדות שהוקלטו – בחינם, בסדר הלימוד ולפי נושא – כדי שכל סטודנט יוכל ללמוד בקצב שלו.",
      ],
      interests: "תחומי מחקר", interestList: ["לייזר אלקטרונים חופשיים (FEL) בתחום ה-THz", "מקורות קרינה של אלומות אלקטרונים יחסותיות", "שדות מגנטיים ואנדולטורים", "חישה והדמיה במכ״ם mmWave", "עיבוד אותות, SDR ואנטנות"],
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
      researchTitle: "Research", researchLead: "Free-electron lasers and relativistic radiation sources, mmWave radar sensing and imaging, and signal processing.",
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
        "Dr. Eyal Magory is a lecturer at the Jerusalem College of Technology (JCT) – Lev Academic Center. He teaches communication systems, signals and systems, antennas, information theory and optical communication. His research covers free-electron lasers (FEL) and radiation sources driven by relativistic electron beams, and mmWave radar sensing.",
        "His goal is to build a communication, RF and radar lab at JCT – a place where students work on real hardware, and where teaching, projects and research meet industry.",
        "This site collects all recorded lectures, tutorials and labs – free, in teaching order and by topic – so every student can learn at their own pace. Most lectures are taught in Hebrew.",
      ],
      interests: "Research interests", interestList: ["THz free-electron lasers (FEL)", "Radiation sources driven by relativistic electron beams", "Magnetic fields and undulators", "mmWave radar sensing and imaging", "Signal processing, SDR and antennas"],
      ytChannel: "YouTube channel", notFound: "Page not found", backHome: "Back to home",
      free: "All lectures are free", langNoteEn: "", langNoteHe: "Lectures are in Hebrew",
      more: "→", playLabel: "Play video",
      menu: "Menu", other: "עברית",
    },
  };
  const T = () => (EN ? UI.en : UI.he);

  /* ---------- automatic sync with YouTube (youtube.js, written by tools/sync_youtube.py) ---------- */
  const YT = window.YT_SYNC || { playlists: {}, latest: [] };
  const NEW_UNIT = { title: "חדש ב-YouTube", title_en: "New on YouTube" };
  {
    const known = new Set();
    for (const c of COURSES) for (const u of c.units) for (const l of u.lessons) known.add(l.id);
    for (const s of SPECIALS) known.add(s.id);
    for (const c of COURSES) {
      const fresh = (YT.playlists[c.playlist] || []).filter((v) => !known.has(v.id));
      if (!fresh.length) continue;
      const counts = {};                                   // the course's most common topic
      for (const u of c.units) for (const l of u.lessons) for (const t of l.tags || []) counts[t] = (counts[t] || 0) + 1;
      const tag = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
      const lessons = fresh.map((v) => ({ id: v.id, title: v.title, en: v.title, dur: v.dur || "0:00", tags: tag ? [tag] : [], auto: true }));
      if (c.units.length === 1) c.units[0].lessons.push(...lessons);
      else c.units.push({ ...NEW_UNIT, lessons });
      for (const v of fresh) known.add(v.id);
    }
  }

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

  /* home: the course site; the lecturer is one section of it */
  const HOME = {
    he: {
      title: "קורסים פתוחים בהנדסת חשמל ותקשורת",
      lead: "הרצאות מלאות, תרגולים ומעבדות בתקשורת, באותות ומערכות, באנטנות, בתורת האינפורמציה ובתקשורת אופטית – בחינם, בסדר הלימוד ולפי נושא.",
      dept: "המחלקה להנדסת חשמל ואלקטרוניקה · המרכז האקדמי לב (JCT), ירושלים",
      latest: "הועלו לאחרונה", latestNote: "מתעדכן אוטומטית מערוץ ה-YouTube", allVideos: "לערוץ",
      teaching: "קורסים", thCode: "מס׳ קורס", thCourse: "קורס", thYear: "שנה", thLect: "הרצאות", upcoming: "בהכנה",
      research: "מחקר", allResearch: "תחומי המחקר והצעות לשיתוף פעולה",
      lab: "המעבדה", labText: "שבעה ניסויים ב-ADALM-Pluto שבונים רדיו שלם – מטון ראשון ועד OFDM ומכ״ם. לכל ניסוי רקע תאורטי, קוד Python ומשימות מחקר.",
      toLab: "לניסויים", students: "לסטודנטים",
      links: [["exam", "הכנה למבחנים", "חזרות, תרגולים ופתרונות"], ["topics", "חיפוש לפי נושא", "כל השיעורים מקובצים לפי נושא"], ["projects", "פרויקטי גמר", "פרויקטים פתוחים במכ״ם, SDR ואנטנות"]],
      lecturer: "המרצה", position: "מרצה, המחלקה להנדסת חשמל ואלקטרוניקה",
      lecturerText: "מלמד תקשורת, אותות ומערכות, אנטנות, תורת האינפורמציה ותקשורת אופטית. חוקר לייזר אלקטרונים חופשיים (FEL) ומקורות קרינה של אלומות יחסותיות, וחישה והדמיה במכ״ם mmWave.",
      more: "עוד על המרצה", email: "דוא״ל",
      stats: (c, l, h) => `${c} קורסים · ${l} הרצאות · ${h}+ שעות לימוד`, updated: (d) => `עודכן מ-YouTube ב-${d}`,
    },
    en: {
      title: "Open Courses in Electrical and Communication Engineering",
      lead: "Full lectures, tutorials and labs in communication systems, signals and systems, antennas, information theory and optical communication – free, in teaching order and by topic.",
      dept: "Department of Electrical and Electronics Engineering · Jerusalem College of Technology (JCT)",
      latest: "Latest uploads", latestNote: "Updated automatically from the YouTube channel", allVideos: "Channel",
      teaching: "Courses", thCode: "Code", thCourse: "Course", thYear: "Year", thLect: "Lectures", upcoming: "In preparation",
      research: "Research", allResearch: "Research areas and collaboration topics",
      lab: "The lab", labText: "Seven ADALM-Pluto experiments that build a complete radio – from a first tone to OFDM and radar. Each comes with theory, Python code and research tasks.",
      toLab: "View experiments", students: "For students",
      links: [["exam", "Exam preparation", "Reviews, tutorials and solutions"], ["topics", "Browse by topic", "All lectures grouped by topic"], ["projects", "Final-year projects", "Open projects in radar, SDR and antennas"]],
      lecturer: "Lecturer", position: "Lecturer, Department of Electrical and Electronics Engineering",
      lecturerText: "Teaches communication systems, signals and systems, antennas, information theory and optical communication. Researches free-electron lasers (FEL) and radiation sources driven by relativistic electron beams, and mmWave radar sensing and imaging.",
      more: "About the lecturer", email: "Email",
      stats: (c, l, h) => `${c} courses · ${l} lectures · ${h}+ hours`, updated: (d) => `Synced with YouTube on ${d}`,
    },
  };

  const latestCard = (v) => {
    const l = allLessons.find((x) => x.id === v.id);
    const href = l?.course ? `${P()}/course/${l.course.id}/${encodeURIComponent(v.id)}` : ytWatch(v.id);
    return thumbCard(l || { ...v, course: null }, href, !l?.course);
  };

  pages.home = () => {
    const t = T(), h = EN ? HOME.en : HOME.he;
    const upd = YT.updated ? new Date(YT.updated).toLocaleDateString(EN ? "en-GB" : "he-IL") : "";
    const latest = (YT.latest || []).slice(0, 4);
    return `
      <section class="site-hero"><div class="wrap">
        <div class="affil">${instBadge()}<span>${h.dept}</span></div>
        <h1>${esc(tr(SITE, "name"))}</h1>
        <p class="subtitle">${h.title}</p>
        <p class="lead">${h.lead}</p>
        <form class="search search-inline" role="search" id="search-form">
          <input type="search" id="q" placeholder="${esc(t.searchPh)}" aria-label="${t.search}">
          <button type="submit">${t.search}</button>
        </form>
        <p class="muted stats">${h.stats(COURSES.length, allLessons.length, hours(allLessons))}${upd ? ` · ${h.updated(upd)}` : ""}</p>
      </div></section>

      ${latest.length ? `<section class="acad"><div class="wrap">
        <div class="acad-head"><h2>${h.latest}</h2><span class="muted">${h.latestNote} · <a href="${esc(SITE.youtube)}" target="_blank" rel="noopener">${h.allVideos} ↗</a></span></div>
        <div class="grid latest-grid">${latest.map(latestCard).join("")}</div>
      </div></section>` : ""}

      <section class="acad"><div class="wrap">
        <div class="acad-head"><h2>${h.teaching}</h2><a href="${P()}/courses">${t.allCourses} ${t.more}</a></div>
        <table class="courses-table">
          <thead><tr><th>${h.thCode}</th><th>${h.thCourse}</th><th>${h.thYear}</th><th>${h.thLect}</th></tr></thead>
          <tbody>
            ${COURSES.map((c) => `<tr><td dir="ltr">${esc(c.code)}</td><td><a href="${P()}/course/${c.id}">${esc(tr(c, "title"))}</a>${c.lang === "en" && !EN ? ' <small class="muted">(English)</small>' : ""}</td><td>${esc(tr(c, "year"))}</td><td>${courseLessons(c).length}</td></tr>`).join("")}
            <tr><td>—</td><td><a href="${P()}/rf">${esc(tr(RF_COURSE, "title"))}</a></td><td colspan="2" class="muted">${h.upcoming}</td></tr>
          </tbody>
        </table>
      </div></section>

      <section class="acad"><div class="wrap">
        <div class="acad-head"><h2>${h.students}</h2></div>
        <div class="student-links">${h.links.map(([r, a, b]) => `<a href="${P()}/${r}"><b>${a}</b><span>${b}</span></a>`).join("")}</div>
      </div></section>

      <section class="acad"><div class="wrap">
        <div class="acad-head"><h2>${h.lab}</h2><a href="${P()}/lab">${h.toLab} ${t.more}</a></div>
        <p class="lab-text">${h.labText}</p>
        <ol class="lab-list">${SDR_LABS.map((l) => `<li><a href="${P()}/sdr/${l.id}">${esc(tr(l, "title").replace(/^(ניסוי|Lab) \d+ – /, ""))}</a></li>`).join("")}</ol>
      </div></section>

      <section class="acad"><div class="wrap">
        <div class="acad-head"><h2>${h.research}</h2><a href="${P()}/research">${h.allResearch} ${t.more}</a></div>
        <ol class="research-list">${RESEARCH.map((r) => `<li><b>${esc(tr(r, "title"))}</b><span class="muted">${esc(tr(r, "text"))}</span></li>`).join("")}</ol>
      </div></section>

      <section class="acad"><div class="wrap">
        <div class="acad-head"><h2>${h.lecturer}</h2></div>
        <div class="lecturer">
          ${SITE.photo ? `<img class="portrait sm" src="${esc(SITE.photo)}" alt="${esc(tr(SITE, "owner"))}">` : ""}
          <div>
            <b>${esc(tr(SITE, "owner"))}</b> <span class="muted">· ${h.position}</span>
            <p>${h.lecturerText}</p>
            <a href="${P()}/about">${h.more} ${t.more}</a> · <a href="mailto:${esc(SITE.email)}" dir="ltr">${esc(SITE.email)}</a>
          </div>
        </div>
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
        ${GUIDE_LIST.some((g) => g.course === c.id) ? `<div class="course-guides"><b>${G().guides}:</b> ${GUIDE_LIST.filter((g) => g.course === c.id).map((g) => `<a href="${P()}/guide/${g.id}">${esc(tr(g, "title"))}</a>`).join(" · ")}</div>` : ""}
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
      ${GUIDE_LIST.length ? `<section class="block"><div class="wrap">
        <div class="section-head"><h2>${G().guides}</h2></div>
        <p class="muted" style="margin-top:-6px">${G().guidesLead}</p>
        <div class="grid">${GUIDE_LIST.map(guideCard).join("")}</div>
      </div></section>` : ""}
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

  /* ---------- online lab guides (guides.js) ---------- */
  const GT = {
    he: { guides: "מדריכי מעבדה אינטרנטיים", guidesLead: "מדריכים שלב אחר שלב לביצוע המעבדות: רקע, הכנה, חיבורים והגדרות, שאלות לדוח וקבצי MATLAB.",
      open: "למדריך", goals: "מטרות המעבדה", equipment: "ציוד", theory: "רקע תאורטי", prep: "לפני המעבדה", prepQ: "שאלות הכנה (להגשה לפני המעבדה)",
      instruments: "הכרת הציוד", parts: "הניסוי", step: "שלב", done: "בוצע", forReport: "לדוח", save: "לשמור", hint: "הסבר נוסף",
      settings: "הגדרות", table: "טבלת תוצאות (חלק 3)", tableLead: "הכניסו את המתחים שמדדתם (ב-Volts). שאר העמודות מחושבות לבד. אפשר להוריד כ-CSV ולצרף לדוח.",
      depth: "עומק אפנון", left: "אונה שמאל", center: "אונה אמצעית", right: "אונה ימין", total: "סה״כ מתח", infoV: "מתח במידע", infoP: "הספק במידע", theoryP: "תאוריה \\(\\eta\\)",
      csv: "הורדת CSV", report: "מה מגישים", files: "קבצי MATLAB", download: "הורדה", show: "הצגת הקוד", hide: "הסתרת הקוד",
      progress: (a, b) => `${a} מתוך ${b} שלבים`, reset: "איפוס", contents: "בדף הזה", watch: "שיעורים מומלצים לפני המעבדה",
      sim: "נסו בסימולטור", simAM: "סימולטור: AM ו-DSB-SC", simRX: "סימולטור: המקלט הסינכרוני", mode: "סוג אפנון", ka: "עומק אפנון",
      phase: "פאזת המתנד \\(\\phi\\)", df: "שגיאת תדר \\(\\Delta f\\)", timeAx: "זמן", freqAx: "תדר", carrier: "גל נושא", sidebands: "פסי צד", eff: "יעילות הספק",
      rxNote: "המידע (8 Hz לצורך התצוגה) במוצא המקלט, ובכתום המעטפת \\(\\tfrac12\\cos(\\phi + 2\\pi\\Delta f t)\\).", minutes: "משך", course: "קורס",
      inCourse: "המעבדות בקורס", fromRx: "המקלט" },
    en: { guides: "Online lab guides", guidesLead: "Step-by-step guides for doing the labs: background, preparation, wiring and settings, report questions and MATLAB files.",
      open: "Open guide", goals: "Goals", equipment: "Equipment", theory: "Background", prep: "Before the lab", prepQ: "Preparation questions (submit before the lab)",
      instruments: "Know your instruments", parts: "The experiment", step: "Step", done: "Done", forReport: "For the report", save: "Save", hint: "More explanation",
      settings: "Settings", table: "Results table (Part 3)", tableLead: "Enter the voltages you measured (in volts). The other columns are computed for you. Download as CSV and attach it to the report.",
      depth: "Depth", left: "Left line", center: "Center line", right: "Right line", total: "Total voltage", infoV: "Voltage in message", infoP: "Power in message", theoryP: "Theory \\(\\eta\\)",
      csv: "Download CSV", report: "What to submit", files: "MATLAB files", download: "Download", show: "Show code", hide: "Hide code",
      progress: (a, b) => `${a} of ${b} steps`, reset: "Reset", contents: "On this page", watch: "Recommended lectures before the lab",
      sim: "Try it in the simulator", simAM: "Simulator: AM and DSB-SC", simRX: "Simulator: the synchronous receiver", mode: "Modulation", ka: "Depth",
      phase: "LO phase \\(\\phi\\)", df: "Frequency error \\(\\Delta f\\)", timeAx: "time", freqAx: "frequency", carrier: "Carrier", sidebands: "Sidebands", eff: "Power efficiency",
      rxNote: "The message (8 Hz for display) at the receiver output; orange is the envelope \\(\\tfrac12\\cos(\\phi + 2\\pi\\Delta f t)\\).", minutes: "Duration", course: "Course",
      inCourse: "Labs in this course", fromRx: "Receiver" },
  };
  const G = () => (EN ? GT.en : GT.he);
  const GUIDE_LIST = window.GUIDES || [];
  const guideCard = (g) => {
    const c = COURSES.find((x) => x.id === g.course);
    return `<a class="card guide-card" href="${P()}/guide/${g.id}">
      <img loading="lazy" src="${g.dir}/${g.theory[0].fig}" alt="">
      <div class="code">${c ? `${T().course} ${esc(c.code)} · ` : ""}${esc(tr(g, "time"))}</div>
      <h3>${esc(tr(g, "title"))}</h3><div class="muted">${esc(tr(g, "summary"))}</div></a>`;
  };
  const figHtml = (g, f, cap = "") => f ? `<figure class="fig${f.endsWith(".svg") ? " diagram" : ""}"><a href="${g.dir}/${f}" target="_blank" rel="noopener"><img loading="lazy" src="${g.dir}/${f}" alt="${esc(cap)}"></a>${cap ? `<figcaption>${esc(cap)}</figcaption>` : ""}</figure>` : "";
  const simAM = () => { const g = G(); return `
    <div class="sim" data-sim="am">
      <h3>${g.simAM}</h3>
      <div class="sim-controls">
        <label>${g.mode} <select data-k="mode"><option value="am">AM</option><option value="dsb">DSB-SC</option></select></label>
        <label>${g.ka} <input type="range" min="0" max="150" value="50" data-k="ka"> <output data-o="ka">50%</output></label>
      </div>
      <canvas data-c="t" height="190"></canvas>
      <div class="sim-row"><canvas data-c="f" height="150"></canvas><div class="sim-read" data-o="read"></div></div>
    </div>`; };
  const simRX = () => { const g = G(); return `
    <div class="sim" data-sim="rx">
      <h3>${g.simRX}</h3>
      <div class="sim-controls">
        <label>${g.phase} <input type="range" min="0" max="180" value="0" step="5" data-k="ph"> <output data-o="ph">0°</output></label>
        <label>${g.df} <input type="range" min="0" max="4" value="0" step="0.5" data-k="df"> <output data-o="df">0 Hz</output></label>
      </div>
      <canvas data-c="t" height="200"></canvas>
      <p class="muted sim-note">${g.rxNote}</p>
    </div>`; };

  pages.guide = (id) => {
    const g = GUIDE_LIST.find((x) => x.id === id);
    if (!g) return pages.notfound();
    const t = T(), gt = G(), c = COURSES.find((x) => x.id === g.course);
    const L = (o, k) => (EN ? o[k + "_en"] : o[k]) || o[k] || [];
    let n = 0;
    const total = g.parts.reduce((s, p) => s + p.steps.length, 0);
    const watch = allLessons.filter((x) => x.course?.id === "comm" && x.tags?.some((k) => g.tags.includes(k))).slice(0, 3);
    const toc = [["goals", gt.goals], ["theory", gt.theory], ["prep", gt.prep], ["instruments", gt.instruments],
      ...g.parts.map((p, i) => [`part${i + 1}`, tr(p, "title")]), ["results", gt.table], ["report", gt.report], ["files", gt.files]];
    const step = (s) => {
      n += 1;
      const q = L(s, "q");
      return `<li class="step" id="step${n}">
        <label class="step-check"><input type="checkbox" data-step="${n}"><span>${gt.step} ${n}</span></label>
        <div class="step-body">
          <p>${tr(s, "do")}</p>
          ${s.set ? `<div class="panel" dir="ltr">${s.set.map(([k, he, en]) => `<div><b>${esc(k)}</b><span>${esc(EN ? en : he)}</span></div>`).join("")}</div>` : ""}
          ${q.length ? `<div class="ask"><b>${gt.forReport}</b><ul>${q.map((x) => `<li>${x}</li>`).join("")}</ul></div>` : ""}
          ${s.rec ? `<div class="rec">📷 ${gt.save}: ${esc(tr(s, "rec"))}</div>` : ""}
          ${s.hint ? `<details class="hint"><summary>${gt.hint}</summary><p>${tr(s, "hint")}</p></details>` : ""}
          ${s.sim ? `<button type="button" class="btn ghost small" data-goto="${s.sim === "rx" ? "sim-rx" : "sim-am"}">${gt.sim} ↑</button>` : ""}
          ${s.table ? `<button type="button" class="btn ghost small" data-goto="results">${gt.table} ↓</button>` : ""}
        </div></li>`;
    };
    return `
      <div class="wrap page-head">
        <div class="crumbs"><a href="${P()}/lab">${t.nav.lab}</a>${c ? ` / <a href="${P()}/course/${c.id}">${esc(tr(c, "title"))}</a>` : ""}</div>
        <h1>${esc(tr(g, "title"))}</h1>
        <p class="muted">${esc(tr(g, "summary"))}</p>
        <div class="guide-meta">${c ? `<span>${gt.course} ${esc(c.code)}</span>` : ""}<span>${gt.minutes}: ${esc(tr(g, "time"))}</span>
          <span class="progress"><span class="bar"><i data-o="bar"></i></span><span data-o="prog">${gt.progress(0, total)}</span> <button type="button" class="link" data-reset>${gt.reset}</button></span></div>
      </div>
      <div class="wrap guide" data-guide="${g.id}" data-total="${total}">
        <aside class="guide-toc"><b>${gt.contents}</b>${toc.map(([k, v]) => `<button type="button" data-goto="${k}">${esc(v)}</button>`).join("")}</aside>
        <div class="guide-main">
          <section id="goals"><h2>${gt.goals}</h2><ul>${L(g, "goals").map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
            <h3>${gt.equipment}</h3><ul class="eq">${L(g, "equipment").map((x) => `<li>${esc(x)}</li>`).join("")}</ul></section>

          <section id="theory"><h2>${gt.theory}</h2>
            ${g.theory.map((s, i) => `<div class="theory-block"><h3>${esc(tr(s, "h"))}</h3>${figHtml(g, s.fig)}${tr(s, "body")}${figHtml(g, s.fig2)}
              ${i === 1 ? `<div id="sim-am">${simAM()}</div>` : ""}${i === g.theory.length - 1 ? `<div id="sim-rx">${simRX()}</div>` : ""}</div>`).join("")}
          </section>

          <section id="prep"><h2>${gt.prep}</h2>
            <h3>${gt.prepQ}</h3>
            <ol class="prep">${g.prep.map((p) => `<li><p>${tr(p, "q")}</p>${figHtml(g, p.fig)}${L(p, "items").length ? `<ol type="a">${L(p, "items").map((x) => `<li>${x}</li>`).join("")}</ol>` : ""}</li>`).join("")}</ol>
            <p>${EN ? "Run" : "הריצו את"} <a href="${g.dir}/${g.files[0].file}" download dir="ltr">${g.files[0].file}</a> ${EN ? "to explore the signals before the lab." : "כדי לשחק עם האותות לפני המעבדה."}</p>
            ${watch.length ? `<h3>${gt.watch}</h3><div class="grid">${watch.map((x) => thumbCard(x, `${P()}/course/${x.course.id}/${x.id}`)).join("")}</div>` : ""}
          </section>

          <section id="instruments"><h2>${gt.instruments}</h2>
            ${g.instruments.map((x) => `<details class="instr"><summary>${esc(tr(x, "h"))}</summary><p>${esc(tr(x, "body"))}</p></details>`).join("")}
          </section>

          ${g.parts.map((p, i) => `<section id="part${i + 1}" class="part"><h2>${esc(tr(p, "title"))}</h2><p class="muted">${esc(tr(p, "goal"))}</p>
            ${figHtml(g, p.diagram)}<ol class="steps" start="${n + 1}">${p.steps.map(step).join("")}</ol></section>`).join("")}

          <section id="results"><h2>${gt.table}</h2><p class="muted">${gt.tableLead}</p>
            <div class="table-wrap"><table class="results" dir="ltr">
              <thead><tr><th>${gt.depth}</th><th>${gt.left} [V]</th><th>${gt.center} [V]</th><th>${gt.right} [V]</th><th>${gt.total} [V]</th><th>${gt.infoV}</th><th>${gt.infoP}</th><th>${gt.theoryP}</th></tr></thead>
              <tbody>${[30, 50, 70, 100].map((d) => `<tr data-d="${d}"><td>${d}%</td>${["l", "c", "r"].map((k) => `<td><input type="number" step="0.001" min="0" inputmode="decimal" data-v="${k}" aria-label="${d}% ${k}"></td>`).join("")}<td data-o="tot">–</td><td data-o="iv">–</td><td data-o="ip">–</td><td>${(100 * (d / 100) ** 2 / (2 + (d / 100) ** 2)).toFixed(1)}%</td></tr>`).join("")}</tbody>
            </table></div>
            <button type="button" class="btn ghost" data-csv>${gt.csv}</button>
          </section>

          <section id="report"><h2>${gt.report}</h2><ul>${L(g, "report").map((x) => `<li>${esc(x)}</li>`).join("")}</ul></section>

          <section id="files"><h2>${gt.files}</h2>
            ${g.files.map((f) => `<div class="file-row">
              <div><b dir="ltr">${esc(f.file)}</b><div class="muted">${tr(f, "d")}</div></div>
              <div class="file-actions"><a class="btn" href="${g.dir}/${f.file}" download>${gt.download}</a><button type="button" class="btn ghost" data-src="${g.dir}/${f.file}">${gt.show}</button></div>
              <pre class="src" hidden dir="ltr"><code></code></pre></div>`).join("")}
          </section>
        </div>
      </div>`;
  };

  /* simulators: small canvas plots, colors from CSS variables */
  function drawSims() {
    const css = getComputedStyle(document.documentElement);
    const col = (v, d) => css.getPropertyValue(v).trim() || d;
    const fit = (cv) => { const r = window.devicePixelRatio || 1, w = cv.clientWidth, h = +(cv.dataset.h ||= cv.getAttribute("height")); cv.style.height = h + "px"; cv.width = w * r; cv.height = h * r; const x = cv.getContext("2d"); x.scale(r, r); return [x, w, h]; };
    const axes = (x, w, h, y0) => { x.strokeStyle = col("--line", "#ddd"); x.lineWidth = 1; x.beginPath(); x.moveTo(0, y0); x.lineTo(w, y0); x.stroke(); };
    app.querySelectorAll('[data-sim="am"]').forEach((el) => {
      const mode = el.querySelector('[data-k="mode"]').value, ka = +el.querySelector('[data-k="ka"]').value / 100;
      el.querySelector('[data-o="ka"]').textContent = Math.round(ka * 100) + "%";
      let [x, w, h] = fit(el.querySelector('[data-c="t"]'));
      const y0 = h / 2, sc = h / 2 / 2.7, N = 900;
      axes(x, w, h, y0);
      const env = (t) => (mode === "am" ? 1 + ka * Math.cos(2 * Math.PI * 2 * t) : 1.5 * ka * Math.cos(2 * Math.PI * 2 * t));
      x.strokeStyle = col("--accent", "#1f5fa8"); x.lineWidth = 1; x.beginPath();
      for (let i = 0; i <= N; i++) { const t = i / N; const v = env(t) * Math.cos(2 * Math.PI * 30 * t); x[i ? "lineTo" : "moveTo"](t * w, y0 - v * sc); }
      x.stroke();
      x.strokeStyle = "#e8892b"; x.lineWidth = 2;
      for (const s of [1, -1]) { x.beginPath(); for (let i = 0; i <= N; i++) { const t = i / N; x[i ? "lineTo" : "moveTo"](t * w, y0 - s * (mode === "am" ? env(t) : Math.abs(env(t))) * sc); } x.stroke(); }
      if (mode === "am" && ka > 1) { x.fillStyle = "#c0392b"; x.font = "13px sans-serif"; x.fillText(EN ? "over-modulation: envelope ≠ message" : "אפנון יתר: המעטפת ≠ המידע", 10, 18); }
      [x, w, h] = fit(el.querySelector('[data-c="f"]'));
      const lines = mode === "am" ? [[-1, ka / 2], [0, 1], [1, ka / 2]] : [[-1, 0.75 * ka], [1, 0.75 * ka]];
      axes(x, w, h, h - 22);
      x.font = "12px sans-serif"; x.textAlign = "center"; x.fillStyle = col("--muted", "#666");
      [[-1, "fc−fm"], [0, "fc"], [1, "fc+fm"]].forEach(([k, s]) => x.fillText(s, w / 2 + k * w / 4, h - 6));
      lines.forEach(([k, a]) => { x.fillStyle = k ? "#2e9e5b" : col("--accent", "#1f5fa8"); x.fillRect(w / 2 + k * w / 4 - 3, h - 22 - a * (h - 40), 6, a * (h - 40)); });
      const Pc = mode === "am" ? 0.5 : 0, Ps = mode === "am" ? ka * ka / 4 : 2 * (0.75 * ka) ** 2 / 2;
      const gt = G();
      el.querySelector('[data-o="read"]').innerHTML = mode === "am"
        ? `<div>V<sub>max</sub> = ${(1 + ka).toFixed(2)}</div><div>V<sub>min</sub> = ${(1 - ka).toFixed(2)}</div><div>${gt.carrier}: 1.00</div><div>${gt.sidebands}: 2 × ${(ka / 2).toFixed(2)}</div><div><b>${gt.eff}: ${(100 * Ps / (Pc + Ps || 1)).toFixed(1)}%</b></div>`
        : `<div>${gt.carrier}: 0</div><div>${gt.sidebands}: 2 × ${(0.75 * ka).toFixed(2)}</div><div><b>${gt.eff}: ${ka ? 100 : 0}%</b></div>`;
    });
    app.querySelectorAll('[data-sim="rx"]').forEach((el) => {
      const ph = +el.querySelector('[data-k="ph"]').value, df = +el.querySelector('[data-k="df"]').value;
      el.querySelector('[data-o="ph"]').textContent = ph + "°"; el.querySelector('[data-o="df"]').textContent = df + " Hz";
      const [x, w, h] = fit(el.querySelector('[data-c="t"]'));
      const y0 = h / 2, sc = h / 2 / 0.65, N = 1200, a = (t) => 0.5 * Math.cos((ph * Math.PI) / 180 + 2 * Math.PI * df * t);
      axes(x, w, h, y0);
      x.strokeStyle = col("--accent", "#1f5fa8"); x.lineWidth = 1.4; x.beginPath();
      for (let i = 0; i <= N; i++) { const t = i / N; x[i ? "lineTo" : "moveTo"](t * w, y0 - a(t) * Math.cos(2 * Math.PI * 8 * t) * sc); }
      x.stroke(); x.strokeStyle = "#e8892b"; x.lineWidth = 2;
      for (const s of [1, -1]) { x.beginPath(); for (let i = 0; i <= N; i++) { const t = i / N; x[i ? "lineTo" : "moveTo"](t * w, y0 - s * a(t) * sc); } x.stroke(); }
      x.fillStyle = col("--muted", "#666"); x.font = "12px sans-serif"; x.fillText("0", 4, h - 6); x.textAlign = "right"; x.fillText("1 s", w - 4, h - 6);
    });
  }

  function wireGuide() {
    const root = app.querySelector("[data-guide]");
    if (!root) return;
    const key = "guide:" + root.dataset.guide, total = +root.dataset.total;
    const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
    const store = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } };
    let done = load(key, []);
    const boxes = app.querySelectorAll("[data-step]");
    const sync = () => {
      boxes.forEach((b) => { b.checked = done.includes(+b.dataset.step); b.closest(".step").classList.toggle("is-done", b.checked); });
      app.querySelector('[data-o="prog"]').textContent = G().progress(done.length, total);
      app.querySelector('[data-o="bar"]').style.width = (100 * done.length / total) + "%";
    };
    boxes.forEach((b) => b.addEventListener("change", () => { const s = +b.dataset.step; done = b.checked ? [...new Set([...done, s])] : done.filter((x) => x !== s); store(key, done); sync(); }));
    app.querySelector("[data-reset]").addEventListener("click", () => { done = []; store(key, done); sync(); });
    sync();
    app.querySelectorAll("[data-goto]").forEach((b) => b.addEventListener("click", () => app.querySelector("#" + b.dataset.goto)?.scrollIntoView({ behavior: "smooth", block: "start" })));
    // results table
    const tkey = key + ":table", tv = load(tkey, {});
    const calc = () => {
      app.querySelectorAll(".results tbody tr").forEach((tr_) => {
        const v = {}; tr_.querySelectorAll("input").forEach((i) => { v[i.dataset.v] = parseFloat(i.value); });
        const ok = ["l", "c", "r"].every((k) => v[k] >= 0);
        const tot = v.l + v.c + v.r, P_ = v.l ** 2 + v.c ** 2 + v.r ** 2;
        tr_.querySelector('[data-o="tot"]').textContent = ok ? tot.toFixed(3) : "–";
        tr_.querySelector('[data-o="iv"]').textContent = ok && tot ? (100 * (v.l + v.r) / tot).toFixed(1) + "%" : "–";
        tr_.querySelector('[data-o="ip"]').textContent = ok && P_ ? (100 * (v.l ** 2 + v.r ** 2) / P_).toFixed(1) + "%" : "–";
      });
    };
    app.querySelectorAll(".results input").forEach((i) => {
      const id = i.closest("tr").dataset.d + i.dataset.v;
      if (tv[id] != null) i.value = tv[id];
      i.addEventListener("input", () => { tv[id] = i.value; store(tkey, tv); calc(); });
    });
    calc();
    app.querySelector("[data-csv]").addEventListener("click", () => {
      const rows = [...app.querySelectorAll(".results tr")].map((r) => [...r.children].map((c) => (c.querySelector("input")?.value ?? c.textContent).replace(/\\\(|\\\)|\\eta/g, "").trim()).join(","));
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob(["﻿" + rows.join("\n")], { type: "text/csv" }));
      a.download = root.dataset.guide + "_results.csv"; a.click();
    });
    // code viewers
    app.querySelectorAll("[data-src]").forEach((b) => b.addEventListener("click", async () => {
      const pre = b.closest(".file-row").querySelector("pre");
      if (!pre.hidden) { pre.hidden = true; b.textContent = G().show; return; }
      if (!pre.dataset.loaded) { try { pre.firstChild.textContent = await (await fetch(b.dataset.src)).text(); pre.dataset.loaded = "1"; } catch { pre.firstChild.textContent = "Could not load"; } }
      pre.hidden = false; b.textContent = G().hide;
    }));
    // simulators
    app.querySelectorAll(".sim input, .sim select").forEach((i) => i.addEventListener("input", drawSims));
    drawSims();
    if (!wireGuide.resize) { wireGuide.resize = true; window.addEventListener("resize", () => app.querySelector(".sim") && drawSims()); }
  }

  function renderMath() {
    if (window.renderMathInElement) {
      window.renderMathInElement(app, { delimiters: [{ left: "$$", right: "$$", display: true }, { left: "\\(", right: "\\)", display: false }], throwOnError: false });
    } else if (app.querySelector(".guide")) setTimeout(renderMath, 200);
  }

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
      <div class="lecturer" style="margin-bottom:18px">
        ${SITE.photo ? `<img class="portrait sm" src="${esc(SITE.photo)}" alt="${esc(tr(SITE, "owner"))}">` : ""}
        <div><b>${esc(tr(SITE, "owner"))}</b><br><span class="muted">${(EN ? HOME.en : HOME.he).position}<br>${esc(tr(LAB, "inst"))}</span></div>
      </div>
      ${T().about.map((p) => `<p>${esc(p)}</p>`).join("")}
      <h2 style="font-size:20px;margin-top:26px">${T().interests}</h2>
      <ul>${T().interestList.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
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
    document.title = EN ? "On the Wave – Open Courses in Electrical and Communication Engineering | JCT" : "על הגל – קורסים פתוחים בהנדסת חשמל ותקשורת | JCT";
    const routes = { home: "/", courses: "/courses", topics: "/topics", exam: "/exam", lab: "/lab", research: "/research", projects: "/projects", about: "/about" };
    document.querySelectorAll("nav.main a").forEach((a) => {
      a.textContent = t.nav[a.dataset.nav];
      a.href = P() + routes[a.dataset.nav];
    });
    const brand = document.querySelector(".brand");
    brand.href = P() + "/";
    brand.lastChild.textContent = " " + tr(SITE, "name");
    const lb = document.getElementById("lang-btn");
    lb.textContent = t.other;
    lb.lang = EN ? "he" : "en";
    lb.href = (EN ? "#/" : "#/en/") + rest;            // same page in the other language
    document.querySelector(".menu-btn").setAttribute("aria-label", t.menu);
    document.getElementById("foot-owner").textContent = tr(SITE, "name") + " · " + tr(SITE, "owner") + " · " + tr(LAB, "inst_short");
    document.getElementById("foot-free").textContent = t.free;
    document.getElementById("yt-link").textContent = t.ytChannel;
    document.getElementById("mail-link").textContent = t.contact;
  }

  /* ---------- router ---------- */
  const navKey = { "": "home", courses: "courses", course: "courses", topics: "topics", topic: "topics", exam: "exam", lab: "lab", sdr: "lab", guide: "lab", rf: "lab", research: "research", projects: "projects", about: "about" };

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
      case "guide": html = pages.guide(p1); break;
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
    wireGuide();
    renderMath();
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
