import { t, getLang, setLang, applyI18n, setting } from "./i18n.js";
import { getSettings } from "./data.js";

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Accepts https links and paths on this site (e.g. /images/sample/flood-village.svg). Rejects everything else.
// Site paths are resolved against the folder this script lives in, so pictures still load when the site is
// hosted under a sub-path (for example GitHub Pages at /ahatabfoundation/) and not only at the domain root.
const SITE_BASE = new URL("../", import.meta.url).href;
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

const LOGO = `<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
  <circle cx="24" cy="24" r="21" fill="none" stroke="#1e6b62" stroke-width="3" stroke-dasharray="7 5" stroke-linecap="round"/>
  <path d="M13 29c3-6 7-9 11-9s8 3 11 9" fill="none" stroke="#10312f" stroke-width="3" stroke-linecap="round"/>
  <circle cx="24" cy="17" r="4.5" fill="#f0a23b"/>
</svg>`;

const PAGES = [
  ["home", "index.html", "nav.home"],
  ["about", "about.html", "nav.about"],
  ["programs", "programs.html", "nav.programs"],
  ["stories", "stories.html", "nav.stories"],
  ["events", "events.html", "nav.events"],
  ["involved", "get-involved.html", "nav.involved"],
  ["contact", "contact.html", "nav.contact"],
];

export function mountLayout(active) {
  const header = $("#site-header");
  const footer = $("#site-footer");
  if (header) {
    header.className = "site-header";
    header.innerHTML = `
      <div class="wrap bar">
        <a class="brand" href="index.html" aria-label="Ahatab Foundation">
          ${LOGO}
          <span class="brand-name">${getLang() === "bn" ? "আহতাব ফাউন্ডেশন" : "Ahatab Foundation"}</span>
        </a>
        <nav class="nav" id="nav" aria-label="Main">
          ${PAGES.map(([id, href, key]) => `<a href="${href}" data-i18n="${key}"${id === active ? ' aria-current="page"' : ""}></a>`).join("")}
        </nav>
        <div class="bar-actions">
          <button class="lang-btn" type="button" data-i18n="lang.other" data-i18n-aria="lang.aria"></button>
          <a class="btn btn-sun bar-donate" href="get-involved.html#give" data-i18n="nav.donate"></a>
          <button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav" data-i18n="nav.menu"></button>
        </div>
      </div>`;
    $(".lang-btn", header).addEventListener("click", () => setLang(getLang() === "en" ? "bn" : "en"));
    const menu = $(".menu-btn", header);
    const nav = $("#nav", header);
    menu.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menu.setAttribute("aria-expanded", String(open));
    });
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
            <ul>${PAGES.map(([, href, key]) => `<li><a href="${href}" data-i18n="${key}"></a></li>`).join("")}</ul>
          </div>
          <div>
            <h2 data-i18n="footer.contact"></h2>
            <ul id="foot-contact"><li data-i18n="footer.pending"></li></ul>
          </div>
        </div>
        <div class="foot-base">
          <span data-i18n="footer.rights"></span>
          <a href="admin/" data-i18n="footer.admin"></a>
        </div>
      </div>`;
  }
  applyI18n();
  fillFooter();
  import("./track.js").then((m) => m.track()).catch(() => {});
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
