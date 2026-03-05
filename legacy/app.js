const SUPABASE_URL = config.SUPABASE_URL;
const SUPABASE_ANON_KEY = config.SUPABASE_ANON_KEY;
const supabase = (typeof supabase !== 'undefined' && SUPABASE_URL) ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const qs = new URLSearchParams(location.search);
const sanitize = s => String(s || "").replace(/[<>]/g, c => ({ "<": "&lt;", ">": "&gt;" }[c]));
const getLangFromQS = () => (qs.get("lang") || "vi").toLowerCase().startsWith("en") ? "en" : "vi";
const getTypeFromQS = () => (qs.get("type") || "").trim();

let currentLang = getLangFromQS();
const getCompanyFromQS = () => sanitize(qs.get("company") || (currentLang == "vi" ? "công ty" : "company"));

let CACHE = {}; // slug_lang -> data

const LABELS = {
  vi: { language: "Ngôn ngữ:", summary: "Tóm tắt", exp: "Kinh nghiệm", contact: "Liên hệ", skills: "Kỹ năng", portfolio: "Dự án", langs: "Ngôn ngữ", edu: "Học vấn" },
  en: { language: "Language:", summary: "Summary", exp: "Experience", contact: "Contact", skills: "Skills", portfolio: "Portfolio", langs: "Languages", edu: "Education" }
};

const MSG404 = {
  vi: { title: "404 — Không tìm thấy" },
  en: { title: "404 — Not Found" }
};

function applyLabels() {
  const L = LABELS[currentLang];
  const ids = ["language", "summary", "exp", "contact", "skills", "portfolio", "edu"];
  ids.forEach(id => {
    const el = document.getElementById(`label-${id}`);
    if (el) el.textContent = L[id];
  });
}

function clearContainers() {
  ["experience", "skills", "projects", "langs", "education", "contact", "summary"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = "";
  });
}

function render(data) {
  const p = data.profiles || {};
  document.getElementById("name").textContent = p.full_name || "";
  document.getElementById("position").textContent = data.position || "";

  const summary = (data.summary || "").replaceAll("__COMPANY__", getCompanyFromQS());
  document.getElementById("summary").textContent = summary;

  const contact = document.getElementById("contact");
  const items = [];
  if (p.birthdate) items.push(`🎂 ${sanitize(p.birthdate)}`);
  if (p.phone) items.push(`☎ ${sanitize(p.phone)}`);
  if (p.email) items.push(`✉ ${sanitize(p.email)}`);
  if (p.location) items.push(`📍 ${sanitize(p.location)}`);
  if (p.facebook_url) items.push(`↗ ${sanitize(p.facebook_url)}`);
  contact.innerHTML = items.map(i => `<li>${i}</li>`).join("");

  const expWrap = document.getElementById("experience");
  (p.experiences || []).forEach(x => {
    const el = document.createElement("div"); el.className = "job";
    el.innerHTML = `
      <h3>${sanitize(x.position || "")} ${x.company ? "at " + sanitize(x.company) : ""}</h3>
      <div class="meta">
        <span>${sanitize(x.location || "")}</span>
        <span>${[x.start_date, x.end_date].filter(Boolean).map(sanitize).join(" – ")}</span>
      </div>
      <p>${sanitize(x.description || "")}</p>
      ${Array.isArray(x.achievements) ? "<ul>" + x.achievements.map(i => `<li>${sanitize(i)}</li>`).join("") + "</ul>" : ""}
    `;
    expWrap.appendChild(el);
  });

  const skills = p.skills || [];
  const wrap = document.getElementById("skills");
  const groupNames = {
    programming_languages: "Programming Languages",
    frameworks: "Frameworks",
    databases: "Databases",
    cloud_platforms: "Cloud & DevOps",
    tools: "Tools",
    soft_skills: "Soft Skills"
  };
  const grouped = skills.reduce((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s.name);
    return acc;
  }, {});

  Object.entries(groupNames).forEach(([key, label]) => {
    const arr = grouped[key];
    if (arr && arr.length) {
      const block = document.createElement("div");
      block.innerHTML = `<div class="badge" style="margin:6px 0 6px;display:inline-block">${label}</div>` +
                        arr.map(s => `<span class="pill">${sanitize(s)}</span>`).join("");
      wrap.appendChild(block);
    }
  });

  const projWrap = document.getElementById("projects");
  (p.projects || []).forEach(pj => {
    const el = document.createElement("div"); el.className = "job project";
    const links = [];
    if (pj.live_url) links.push(`<a href="${pj.live_url}" target="_blank">Link</a>`);
    if (Array.isArray(pj.live_urls)) pj.live_urls.forEach(u => links.push(`<a href="${u}" target="_blank">Link</a>`));
    if (pj.github_url) links.push(`<a href="${pj.github_url}" target="_blank">GitHub</a>`);

    el.innerHTML = `
      <h3>${sanitize(pj.name || "")}</h3>
      <div class="meta">
        <span>${(pj.technologies || []).map(sanitize).join(", ")}</span>
        <span>${links.join(" • ")}</span>
      </div>
      <p>${sanitize(pj.description || "")}</p>
    `;
    projWrap.appendChild(el);
  });

  const eduWrap = document.getElementById("education");
  (p.education || []).forEach(e => {
    const el = document.createElement("div");
    const tail = [e.degree, e.field_of_study, e.graduation_date].filter(Boolean).map(sanitize).join(" • ");
    const gpa = e.gpa ? ` • GPA ${sanitize(e.gpa)}` : "";
    el.innerHTML = `<div><strong>${sanitize(e.institution || "")}</strong></div><div class="muted" style="color:var(--muted);font-size:13px">${tail}${gpa}</div>`;
    eduWrap.appendChild(el);
  });

  document.getElementById("btn-vi").classList.toggle("active", currentLang === "vi");
  document.getElementById("btn-en").classList.toggle("active", currentLang === "en");
  document.documentElement.lang = currentLang;
}

function render404() {
  const M = MSG404[currentLang];
  document.body.innerHTML = `<div class="wrap not_found"><h1>${M.title}</h1></div>`;
}

async function switchLang(lang) {
  currentLang = (lang === "en") ? "en" : "vi";
  applyLabels();
  clearContainers();
  init();
  const url = new URL(location);
  url.searchParams.set("lang", currentLang);
  history.replaceState({}, "", url);
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-lang]");
  if (btn) switchLang(btn.getAttribute("data-lang"));
});

async function init() {
  const rawType = getTypeFromQS();
  if (!rawType) return render404();
  const safeType = rawType.toLowerCase().replace(/[^a-z0-9_-]/g, "");

  const cacheKey = `${safeType}_${currentLang}`;
  if (CACHE[cacheKey]) {
    render(CACHE[cacheKey]);
    return;
  }

  if (!supabase) {
    console.error("Supabase not initialized");
    return;
  }

  try {
    const { data, error } = await supabase
      .from('cv_variants')
      .select(`
        position,
        summary,
        profiles (
          *,
          experiences (*),
          projects (*),
          skills (*),
          education (*)
        )
      `)
      .eq('slug', safeType)
      .eq('language', currentLang)
      .single();

    if (error || !data) throw new Error(error?.message || "Not found");

    CACHE[cacheKey] = data;
    applyLabels();
    clearContainers();
    render(data);
  } catch (e) {
    console.error(e);
    render404();
  }
}

init();

