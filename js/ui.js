import { t, getLang, setLang, applyI18n, setting } from "./i18n.js";
import { getSettings } from "./data.js";

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Accepts https links and paths on this site (e.g. /images/sample/flood-village.svg). Rejects everything else.
// Site paths are resolved against the folder this script lives in, so pictures still load when the site is
// hosted under a sub-path (for example GitHub Pages at /ahatabfoundation/) and not only at the domain root.
export const SITE_BASE = new URL("../", import.meta.url).href;
// Address of a page of this site, e.g. pageUrl("news", "?s=my-story") -> https://host/base/news/?s=my-story
export const pageUrl = (name, rest = "") => SITE_BASE + name + "/" + rest;
export const safeUrl = (u) => {
  const v = String(u || "").trim();
  if (/^https?:\/\//i.test(v)) return v;
  if (/^\/(?!\/)/.test(v)) return SITE_BASE + v.slice(1);
  return "";
};

// If a picture cannot be loaded (bad link, deleted upload, blocked host), show a built-in illustration
// instead of a broken-image icon. Opt out with data-no-fallback.
const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="#dceae4"/>' +
      '<rect x="40" y="40" width="1120" height="720" rx="28" fill="none" stroke="#1e6b62" stroke-width="6" stroke-dasharray="22 16" stroke-linecap="round"/>' +
      '<path d="M600 540C470 450 410 385 410 322c0-52 40-90 90-90 40 0 76 24 100 62 24-38 60-62 100-62 50 0 90 38 90 90 0 63-60 128-190 218z" fill="#f0a23b"/></svg>'
  );
document.addEventListener(
  "error",
  (e) => {
    const img = e.target;
    if (!(img instanceof HTMLImageElement) || img.dataset.fb || img.hasAttribute("data-no-fallback")) return;
    img.dataset.fb = "1";
    img.removeAttribute("srcset");
    img.src = FALLBACK_IMG;
  },
  true
);

// Pictures on the public pages. Each slot has a built-in illustration; Admin > Settings > Site pictures
// can replace any of them with an uploaded photo or a link (stored in site_settings key "images").
export const IMAGE_SLOTS = {
  hero: "hero-community",
  intro: "dada-and-child",
  children: "food-share",
  about: "care-children",
  programs: "learning",
  news: "news-desk",
  events: "events-gathering",
  donate: "hands-heart",
  volunteer: "volunteers-team",
  contact: "contact",
};
export const defaultImage = (slot) => `${SITE_BASE}images/art/${IMAGE_SLOTS[slot]}.svg`;

export async function fillSlots(root = document) {
  const imgs = $$("img[data-slot]", root);
  if (!imgs.length) return;
  imgs.forEach((img) => { if (!img.getAttribute("src")) img.src = defaultImage(img.dataset.slot); });
  const custom = (await getSettings()).images || {};
  imgs.forEach((img) => {
    const u = safeUrl(custom[img.dataset.slot]);
    if (u && img.src !== u) { delete img.dataset.fb; img.src = u; }
  });
}

export function paragraphs(text) {
  return String(text || "")
    .split(/\n{2,}/)
    .filter((p) => p.trim())
    .map((p) => `<p>${esc(p.trim()).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

const ICONS = {
  heart: '<path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/>',
  wheat: '<path d="M12 22V8M12 8c-2-.5-3.5-2-3.5-4 2 .5 3.5 2 3.5 4zM12 8c2-.5 3.5-2 3.5-4-2 .5-3.5 2-3.5 4zM12 13c-2-.5-3.5-2-3.5-4 2 .5 3.5 2 3.5 4zM12 13c2-.5 3.5-2 3.5-4-2 .5-3.5 2-3.5 4zM12 18c-2-.5-3.5-2-3.5-4 2 .5 3.5 2 3.5 4zM12 18c2-.5 3.5-2 3.5-4-2 .5-3.5 2-3.5 4z"/>',
  stethoscope: '<path d="M6 3v6a4 4 0 0 0 8 0V3M4 3h4M12 3h4M10 13v2a5 5 0 0 0 10 0v-1"/><circle cx="20" cy="12" r="2"/>',
  "book-open": '<path d="M12 6c-2-1.5-5-2-9-2v14c4 0 7 .5 9 2 2-1.5 5-2 9-2V4c-4 0-7 .5-9 2zM12 6v14"/>',
  droplets: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
  "life-buoy": '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M5.6 5.6l3.5 3.5M14.9 14.9l3.5 3.5M18.4 5.6l-3.5 3.5M9.1 14.9l-3.5 3.5"/>',
  home: '<path d="M3 11l9-8 9 8M5 10v10h14V10M10 20v-6h4v6"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14c2.8 0 4.5 2 4.5 5"/>',
  sprout: '<path d="M12 21v-9M12 12c0-4 3-6 7-6 0 4-3 6-7 6zM12 14c0-3-2-5-6-5 0 3 2 5 6 5z"/>',
};
export const ICON_NAMES = Object.keys(ICONS);
export const icon = (name) =>
  `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name] || ICONS.heart}</svg>`;

export const LOGO = `<svg viewBox="0 0 120 120" aria-hidden="true" focusable="false"><circle cx="60" cy="60" r="58" fill="#1e6b62"/><circle class="lg-ring" pathLength="1" cx="60" cy="60" r="52.5" fill="none" stroke="#fbe4bc" stroke-width="2.4" stroke-dasharray="7 6" stroke-linecap="round" opacity=".8"/><g class="lg-rays" stroke="#fbe4bc" stroke-width="4.5" stroke-linecap="round"><path d="M30.1 52.0L20.4 49.4"/><path d="M35.2 41.3L27.3 35.3"/><path d="M44.0 33.4L38.9 24.9"/><path d="M55.2 29.4L53.6 19.5"/><path d="M67.0 29.8L69.2 20.1"/><path d="M77.8 34.6L83.5 26.4"/><path d="M86.0 43.1L94.4 37.7"/></g><circle class="lg-sun" cx="60" cy="60" r="21" fill="#f0a23b"/><g class="lg-hands" fill="#fff7e8"><path d="M16 66c1-5 6-6 10-3 4 3 6 8 9 12l-9 4c-5-3-10-8-10-13z"/><path d="M104 66c-1-5-6-6-10-3-4 3-6 8-9 12l9 4c5-3 10-8 10-13z"/><path d="M24 76c7 3 11 6 17 9 7 3 12 4 19 4s12-1 19-4c6-3 10-6 17-9 0 17-16 29-36 29S24 93 24 76z"/></g><g fill="none" stroke="#1e6b62" stroke-width="2.4" stroke-linecap="round" opacity=".55"><path d="M36 80c5 5 14 8 24 8s19-3 24-8" stroke-dasharray="5 5"/></g></svg>`;

// [id, folder, i18n key]. Each page lives at <site>/<folder>/.
const PAGES = [
  ["home", "home", "nav.home"],
  ["about", "about", "nav.about"],
  ["programs", "programs", "nav.programs"],
  ["news", "news", "nav.news"],
  ["events", "events", "nav.events"],
  ["volunteer", "volunteer", "nav.volunteer"],
  ["contact", "contact", "nav.contact"],
];

export function mountLayout(active) {
  const header = $("#site-header");
  const footer = $("#site-footer");
  if (header) {
    header.className = "site-header";
    header.innerHTML = `
      <div class="wrap bar">
        <a class="brand" href="${pageUrl("home")}" aria-label="Ahatab Foundation">
          ${LOGO}
          <span class="brand-name">${getLang() === "bn" ? "আহতাব ফাউন্ডেশন" : "Ahatab Foundation"}</span>
        </a>
        <div class="bar-actions">
          <a class="btn btn-sun bar-donate" href="${pageUrl("donate")}" data-i18n="nav.donate"></a>
          <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu" data-i18n-aria="nav.menu">
            <span class="burger" aria-hidden="true"><i></i><i></i><i></i></span>
          </button>
        </div>
      </div>
      <div class="menu-back" data-menu-close></div>
      <aside class="menu" id="menu" aria-hidden="true" aria-label="Menu">
        <div class="menu-head">
          <div class="lang-seg" role="group" data-i18n-aria="lang.aria">
            <button type="button" data-lang="bn" aria-pressed="${getLang() === "bn"}">বাংলা</button>
            <button type="button" data-lang="en" aria-pressed="${getLang() === "en"}">English</button>
          </div>
          <button class="menu-x" type="button" data-menu-close data-i18n-aria="nav.close"><span aria-hidden="true">&times;</span></button>
        </div>
        <nav class="menu-nav" id="nav" aria-label="Main">
          ${PAGES.map(([id, folder, key]) => `<a href="${pageUrl(folder)}" data-i18n="${key}"${id === active ? ' aria-current="page"' : ""}></a>`).join("")}
        </nav>
        <a class="btn btn-sun menu-donate" href="${pageUrl("donate")}" data-i18n="nav.donate"></a>
      </aside>`;
    const menu = $("#menu", header);
    const btn = $(".menu-btn", header);
    const setOpen = (open) => {
      header.classList.toggle("menu-open", open);
      document.documentElement.classList.toggle("no-scroll", open);
      btn.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-hidden", String(!open));
      if (open) $("a", menu)?.focus();
      else if (header.contains(document.activeElement)) btn.focus();
    };
    btn.addEventListener("click", () => setOpen(btn.getAttribute("aria-expanded") !== "true"));
    $$("[data-menu-close]", header).forEach((el) => el.addEventListener("click", () => setOpen(false)));
    header.addEventListener("keydown", (e) => {
      if (btn.getAttribute("aria-expanded") !== "true") return;
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") { // keep keyboard focus inside the open menu
        const items = $$("a, button", menu).filter((x) => x.offsetParent !== null);
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    $$("[data-lang]", header).forEach((b) => b.addEventListener("click", () => { if (b.dataset.lang !== getLang()) setLang(b.dataset.lang); }));
  }
  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML = `
      <div class="wrap">
        <div class="foot-grid">
          <div>
            <h2 id="foot-name"></h2>
            <p id="foot-tag"></p>
          </div>
          <div>
            <h2 data-i18n="footer.explore"></h2>
            <ul>${PAGES.map(([, folder, key]) => `<li><a href="${pageUrl(folder)}" data-i18n="${key}"></a></li>`).join("")}<li><a href="${pageUrl("donate")}" data-i18n="nav.donate"></a></li></ul>
          </div>
          <div>
            <h2 data-i18n="footer.contact"></h2>
            <ul id="foot-contact"><li data-i18n="footer.pending"></li></ul>
          </div>
        </div>
        <div class="foot-base">
          <span data-i18n="footer.rights"></span>
          <a href="${SITE_BASE}admin/" data-i18n="footer.admin"></a>
        </div>
      </div>`;
  }
  applyI18n();
  fillFooter();
  fillSlots();
  playIntro();
  import("./track.js").then((m) => m.track()).catch(() => {});
}


// Opening animation: shown once per visit (browser session), skipped for people who prefer reduced motion.
// A tiny inline script in each page <head> marks <html class="intro-pending"> so the page never flashes before it.
function playIntro() {
  const root = document.documentElement;
  const done = () => root.classList.remove("intro-pending");
  let seen = false;
  try { seen = !!sessionStorage.getItem("ahatab-intro"); sessionStorage.setItem("ahatab-intro", "1"); } catch (_) { /* ignore */ }
  if (seen || matchMedia("(prefers-reduced-motion: reduce)").matches) return done();
  const bn = getLang() === "bn";
  const el = document.createElement("div");
  el.id = "intro";
  el.setAttribute("aria-hidden", "true");
  el.innerHTML = `<div class="intro-inner">${LOGO}<div class="intro-name">${bn ? "আহতাব ফাউন্ডেশন" : "Ahatab Foundation"}</div><div class="intro-tag">${esc(t("hero.title").replace(/\.$/, ""))}</div></div>`;
  document.body.append(el);
  done(); // the overlay itself now covers the page
  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    el.classList.add("leaving");
    setTimeout(() => el.remove(), 600);
  };
  el.addEventListener("click", close);
  addEventListener("keydown", close, { once: true });
  setTimeout(close, 2600);
}

async function fillFooter() {
  const s = await getSettings();
  const g = s.general || {};
  const name = $("#foot-name");
  if (!name) return;
  name.textContent = setting(g, "name") || (getLang() === "bn" ? "আহতাব ফাউন্ডেশন" : "Ahatab Foundation");
  $("#foot-tag").textContent = setting(g, "tagline");
  const items = [];
  if (g.email) items.push(`<li><a href="mailto:${esc(g.email)}">${esc(g.email)}</a></li>`);
  if (g.phone) items.push(`<li><a href="tel:${esc(g.phone.replace(/\s/g, ""))}">${esc(g.phone)}</a></li>`);
  const loc = setting(g, "location");
  if (loc) items.push(`<li>${esc(loc)}</li>`);
  if (g.facebook && safeUrl(g.facebook)) items.push(`<li><a href="${esc(g.facebook)}" rel="noopener">Facebook</a></li>`);
  if (items.length) $("#foot-contact").innerHTML = items.join("");
}

export function emptyState(el, key) {
  el.innerHTML = `<p class="muted">${esc(t(key))}</p>`;
}

const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
export const normalizeDigits = (s) => String(s ?? "").replace(/[০-৯]/g, (d) => BN_DIGITS.indexOf(d));

// Wires a public form: honeypot, disabled button while sending, status line, reset on success.
export function bindForm(form, submit, successKey) {
  const status = $(".form-status", form);
  const btn = $('button[type="submit"]', form);
  const label = btn.textContent;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    status.className = "form-status";
    status.textContent = "";
    if (fd.get("website")) { // bots fill the hidden field; pretend it worked
      status.classList.add("ok");
      status.textContent = t(successKey);
      return;
    }
    btn.disabled = true;
    btn.textContent = t("form.sending");
    try {
      await submit(fd);
      form.reset();
      status.classList.add("ok");
      status.textContent = t(successKey);
    } catch (err) {
      console.error(err);
      status.classList.add("err");
      status.textContent = t("form.error");
    } finally {
      btn.disabled = false;
      btn.textContent = label;
    }
  });
}
