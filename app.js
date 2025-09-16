const qs = new URLSearchParams(location.search);
const sanitize = s => String(s || "").replace(/[<>]/g, c => ({ "<": "&lt;", ">": "&gt;" }[c]));
const getLangFromQS = () => (qs.get("lang") || "vi").toLowerCase().startsWith("en") ? "en" : "vi";
const getCompanyFromQS = () => sanitize(qs.get("company") || "TST ECO");
const getTypeFromQS = () => (qs.get("type") || "").trim();

let currentLang = getLangFromQS();
let DATA = null; 

const LABELS = {
  vi: { language: "Ngôn ngữ:", summary: "Tóm tắt", exp: "Kinh nghiệm", contact: "Liên hệ", skills: "Kỹ năng", portfolio: "Dự án", langs: "Ngôn ngữ", edu: "Học vấn" },
  en: { language: "Language:", summary: "Summary", exp: "Experience", contact: "Contact", skills: "Skills", portfolio: "Portfolio", langs: "Languages", edu: "Education" }
};

const MSG404 = {
  vi: {
    title: "404 — Không tìm thấy",
  },
  en: {
    title: "404 — Not Found",
  }
};

function applyLabels() {
  const L = LABELS[currentLang];
  document.getElementById("label-language").textContent = L.language;
  document.getElementById("label-summary").textContent  = L.summary;
  document.getElementById("label-exp").textContent      = L.exp;
  document.getElementById("label-contact").textContent  = L.contact;
  document.getElementById("label-skills").textContent   = L.skills;
  document.getElementById("label-portfolio").textContent= L.portfolio;
  document.getElementById("label-edu").textContent      = L.edu;

  
}

function clearContainers() {
  ["experience", "skills", "projects", "langs", "education", "contact", "summary"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = "";
  });
}

function render(cv) {
  document.getElementById("name").textContent = cv.personal_info?.name || "";
  document.getElementById("position").textContent = cv.personal_info?.position || "";

  const summary = (cv.summary?.professional_summary || "").replaceAll("__COMPANY__", getCompanyFromQS());
  document.getElementById("summary").textContent = summary;

  const p = cv.personal_info || {};
  const contact = document.getElementById("contact");
  const items = [];
  if (p.location) items.push(`📍 ${sanitize(p.location)}`);
  if (p.email) items.push(`✉ ${sanitize(p.email)}`);
  if (p.phone) items.push(`☎ ${sanitize(p.phone)}`);
  if (p.facebook) items.push(`↗ ${sanitize(p.facebook)}`);
  contact.innerHTML = items.map(i => `<li>${i}</li>`).join("");

  const expWrap = document.getElementById("experience");
  (cv.experience || []).forEach(x => {
    const el = document.createElement("div"); el.className = "job";
    el.innerHTML = `
      <h3>${sanitize(x.position || "")} ${x.company ? "at " + sanitize(x.company) : ""}</h3>
      <div class="meta">
        <span>${[x.location, x.type].filter(Boolean).map(sanitize).join(" • ")}</span>
        <span>${[x.start_date, x.end_date].filter(Boolean).map(sanitize).join(" – ")}</span>
      </div>
      <p>${sanitize(x.description || "")}</p>
      ${Array.isArray(x.achievements) ? "<ul>" + x.achievements.map(i => `<li>${sanitize(i)}</li>`).join("") + "</ul>" : ""}
    `;
    expWrap.appendChild(el);
  });

  const skills = cv.skills || {};
  const wrap = document.getElementById("skills");
  const groups = [
    ["Programming Languages", skills.programming_languages],
    ["Frameworks", skills.frameworks],
    ["Databases", skills.databases],
    ["Cloud & DevOps", skills.cloud_platforms],
    ["Tools", skills.tools],
    ["Soft Skills", skills.soft_skills]
  ];
  groups.forEach(([label, arr]) => {
    if (Array.isArray(arr) && arr.length) {
      const block = document.createElement("div");
      block.innerHTML =
        `<div class="badge" style="margin:6px 0 6px;display:inline-block">${label}</div>` +
        arr.map(s => `<span class="pill">${sanitize(s)}</span>`).join("");
      wrap.appendChild(block);
    }
  });

//   const projWrap = document.getElementById("projects");
//   (cv.projects || []).forEach(p => {
//     const el = document.createElement("div"); el.className = "card";
//     const links = [];
//     if (p.live_url) links.push(`<a href="${p.live_url}" target="_blank" rel="noopener">Link</a>`);
//     if (Array.isArray(p.live_urls)) p.live_urls.forEach(u => links.push(`<a href="${u}" target="_blank" rel="noopener">Link</a>`));
//     if (p.github_url) links.push(`<a href="${p.github_url}" target="_blank" rel="noopener">GitHub</a>`);
//     el.innerHTML = `
//       <div class="title"><strong>${sanitize(p.name || "")}</strong>${links.length ? `<span>${links.join(" • ")}</span>` : ""}</div>
//       <div style="color:var(--muted);font-size:13px;margin:4px 0 6px">${(p.technologies || []).map(sanitize).join(", ")}</div>
//       <div>${sanitize(p.description || "")}</div>
//     `;
//     projWrap.appendChild(el);
//   });
const projWrap = document.getElementById("projects");
(projWrap || (function(){return;})());
(projWrap && (cv.projects || []).forEach(p => {
  const el = document.createElement("div");
  el.className = "job project"; // dùng chung style .job

  // Links phải dựng trước để gắn vào meta (bên phải)
  const links = [];
  if (p.live_url)   links.push(`<a href="${p.live_url}" target="_blank" rel="noopener">Link</a>`);
  if (Array.isArray(p.live_urls)) p.live_urls.forEach(u => links.push(`<a href="${u}" target="_blank" rel="noopener">Link</a>`));
  if (p.github_url) links.push(`<a href="${p.github_url}" target="_blank" rel="noopener">GitHub</a>`);

  el.innerHTML = `
    <h3>${sanitize(p.name || "")}</h3>
    <div class="meta">
      <span>${(p.technologies || []).map(sanitize).join(", ")}</span>
      <span>${links.join(" • ")}</span>
    </div>
    <p>${sanitize(p.description || "")}</p>
  `;
  projWrap.appendChild(el);
}));

  const langWrap = document.getElementById("langs");
  (cv.languages || []).forEach(l => {
    const el = document.createElement("div");
    el.innerHTML = `<div><strong>${sanitize(l.language || "")}</strong> — <span style="color:var(--muted)">${sanitize(l.proficiency || "")}</span></div>`;
    langWrap.appendChild(el);
  });

  const eduWrap = document.getElementById("education");
  (cv.education || []).forEach(e => {
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

function render404(reason = "missing") {
  const M = MSG404[currentLang];
  const type = sanitize(getTypeFromQS());
  const detail = reason === "missing" ? M.missing : `${M.notfound}${type || "(empty)"}`;
  document.body.innerHTML = `
    <div class="wrap not_found">
      <h1>${M.title}</h1>
    </div>
  `;
}

function switchLang(lang) {
  currentLang = (lang === "en") ? "en" : "vi";
  applyLabels();
  clearContainers();
  if (DATA && DATA[currentLang]) {
    render(DATA[currentLang]);
  }
  const url = new URL(location);
  url.searchParams.set("lang", currentLang);
  history.replaceState({}, "", url);
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-lang]");
  if (btn) {
    switchLang(btn.getAttribute("data-lang"));
  }
});

async function init() {
  const rawType = getTypeFromQS();
  if (!rawType) {
    render404("missing");
    return;
  }
  const safeType = rawType.toLowerCase().replace(/[^a-z0-9_-]/g, "");
  if (!safeType) {
    render404("missing");
    return;
  }

  try {
    const res = await fetch(`cv-${safeType}.json`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    DATA = await res.json();

    currentLang = getLangFromQS();
    applyLabels();
    clearContainers();

    if (!DATA || (!DATA.en && !DATA.vi) || !DATA[currentLang]) {
      throw new Error("Invalid JSON structure or missing language");
    }
    render(DATA[currentLang]);
  } catch (e) {
    console.error(e);
    render404("notfound");
  }
}

init();
