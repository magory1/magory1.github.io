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
      nav: { home: "בית", courses: "קורסים", topics: "נושאים", exam: "הכנה למבחנים", research: "מחקר", projects: "פרויקטים", about: "אודות" },
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
        "ד״ר אייל מגורי מלמד קורסים בתקשורת, באותות ומערכות, באנטנות ובתורת האינפורמציה, ומוביל מחקר בחישה במכ״ם mmWave.",
        "האתר מרכז את כל השיעורים, התרגולים והמעבדות שהוקלטו – בחינם, בסדר הלימוד ולפי נושא – כדי שכל סטודנט יוכל ללמוד בקצב שלו.",
      ],
      ytChannel: "ערוץ YouTube", notFound: "הדף לא נמצא", backHome: "חזרה לדף הבית",
      free: "כל השיעורים זמינים בחינם", langNoteEn: "השיעורים בקורס הזה באנגלית", langNoteHe: "",
      more: "←", playLabel: "הפעלת הסרטון",
      menu: "תפריט", other: "English",
    },
    en: {
      nav: { home: "Home", courses: "Courses", topics: "Topics", exam: "Exam prep", research: "Research", projects: "Projects", about: "About" },
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
        "Dr. Eyal Magory teaches communication systems, signals and systems, antennas and information theory, and leads research in mmWave radar sensing.",
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

  const wavesSvg = () => {
    let d1 = "", d2 = "";
    for (let x = 0; x <= 1200; x += 3) {
      const m = 1 + 0.6 * Math.sin((2 * Math.PI * x) / 300);
      d1 += (x ? "L" : "M") + x + " " + (60 + 18 * m * Math.sin((2 * Math.PI * x) / 14)).toFixed(1);
      const m2 = 1 + 0.6 * Math.sin((2 * Math.PI * x) / 300 + 1.6);
      d2 += (x ? "L" : "M") + x + " " + (340 + 18 * m2 * Math.sin((2 * Math.PI * x) / 14)).toFixed(1);
    }
    return `<svg class="waves" viewBox="0 0 1200 400" preserveAspectRatio="none" aria-hidden="true">
      <defs><linearGradient id="wf" x1="0" x2="1"><stop offset="0" stop-color="#5fd3f3" stop-opacity="0"/><stop offset=".2" stop-color="#5fd3f3" stop-opacity=".5"/><stop offset=".8" stop-color="#5fd3f3" stop-opacity=".5"/><stop offset="1" stop-color="#5fd3f3" stop-opacity="0"/></linearGradient></defs>
      <path d="${d1}" fill="none" stroke="url(#wf)" stroke-width="1.5"/><path d="${d2}" fill="none" stroke="url(#wf)" stroke-width="1.5"/></svg>`;
  };

  const thumbCard = (l, href, ext = false) => `
    <a class="card" href="${href}" ${ext ? 'target="_blank" rel="noopener"' : ""} style="padding:0;overflow:hidden">
      <img loading="lazy" src="${thumb(l.id)}" alt="" style="aspect-ratio:16/9;object-fit:cover">
      <div style="padding:14px 16px 16px"><h3 style="font-size:17px">${esc(lessonTitle(l))}</h3><div class="muted" style="font-size:14px">${l.course ? esc(tr(l.course, "title")) + " · " : ""}${esc(l.dur)}</div></div>
    </a>`;

  /* ---------- pages ---------- */
  const pages = {};

  pages.home = () => {
    const t = T();
    const featured = ["L8bJGr18qGM", "dH8FtkFdXnk", "XmWzYSSivBY", "y-FBDLiEVRE"].map((id) => allLessons.find((l) => l.id === id)).filter(Boolean);
    return `
      <section class="hero">
        ${wavesSvg()}
        <div class="wrap">
          <h1>${esc(tr(SITE, "owner"))}</h1>
          <div class="topics">${t.heroTopics.map(esc).join("<span>•</span>")}</div>
          <p class="lead">${esc(tr(SITE, "tagline"))}. ${t.leadSuffix}</p>
          <form class="search" role="search" id="search-form">
            <input type="search" id="q" placeholder="${esc(t.searchPh)}" aria-label="${t.search}">
            <button type="submit">${t.search}</button>
          </form>
          <div class="stats">
            <div><b>${COURSES.length}</b><small>${t.courses}</small></div>
            <div><b>${allLessons.length}</b><small>${t.lessons}</small></div>
            <div><b>${hours(allLessons)}+</b><small>${t.hoursLearning}</small></div>
          </div>
        </div>
      </section>

      <section class="block"><div class="wrap">
        <div class="section-head"><h2>${t.courses}</h2><a href="${P()}/courses">${t.allCourses} ${t.more}</a></div>
        <div class="grid">${COURSES.map(courseCard).join("")}
          <div class="card soon">
            <div class="code">${t.soon}</div>
            <h3>${t.prepTitle}</h3>
            <div class="muted">${t.prepText}</div>
          </div>
        </div>
      </div></section>

      <section class="block"><div class="wrap">
        <div class="section-head"><h2>${t.byTopic}</h2><a href="${P()}/topics">${t.allTopics} ${t.more}</a></div>
        <div class="chips">${["am", "fm", "pll", "digital", "qam", "matched", "infotheory", "linearcodes", "fourier", "antennas", "sdr", "radar", "matlab"].map((k) => topicChip(k, true)).join("")}</div>
      </div></section>

      <section class="block"><div class="wrap">
        <div class="section-head"><h2>${t.featured}</h2></div>
        <div class="grid">${featured.map((l) => thumbCard(l, `${P()}/course/${l.course.id}/${l.id}`)).join("")}</div>
      </div></section>

      <section class="block"><div class="wrap">
        <div class="callout">
          <div><h3>${t.projCta}</h3><div class="muted">${t.projCtaText}</div></div>
          <a class="btn" href="${P()}/projects">${t.toProjects}</a>
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
    document.title = EN ? "Dr. Eyal Magory – Courses, Research & Projects" : "ד״ר אייל מגורי – קורסים, מחקר ופרויקטים";
    const routes = { home: "/", courses: "/courses", topics: "/topics", exam: "/exam", research: "/research", projects: "/projects", about: "/about" };
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
    document.getElementById("foot-owner").textContent = tr(SITE, "owner");
    document.getElementById("foot-free").textContent = t.free;
    document.getElementById("yt-link").textContent = t.ytChannel;
    document.getElementById("mail-link").textContent = t.contact;
  }

  /* ---------- router ---------- */
  const navKey = { "": "home", courses: "courses", course: "courses", topics: "topics", topic: "topics", exam: "exam", research: "research", projects: "projects", about: "about" };

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
