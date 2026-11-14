// Privacy-friendly visit counter. Stores no IP address and sets no cookies.
// A random id kept in the visitor's own browser is what lets the admin count unique visitors.
import { sb } from "./supa.js";

const SITE_BASE_PATH = new URL("../", import.meta.url).pathname;
const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|whatsapp|telegram/i;

function store(kind, key, make) {
  try {
    const s = kind === "local" ? localStorage : sessionStorage;
    let v = s.getItem(key);
    if (!v) { v = make(); s.setItem(key, v); }
    return v;
  } catch { return make(); }
}
const randomId = () =>
  (self.crypto && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36)).replace(/-/g, "");

function deviceType() {
  const shortSide = Math.min(screen.width || 0, screen.height || 0) || window.innerWidth;
  if (shortSide < 600) return "mobile";
  if (shortSide < 1000 && matchMedia("(pointer: coarse)").matches) return "tablet";
  if (window.innerWidth < 600) return "mobile";
  return "desktop";
}

function referrerHost() {
  try {
    if (!document.referrer) return "";
    const u = new URL(document.referrer);
    if (u.host === location.host) return "";
    return u.hostname.replace(/^www\./, "").slice(0, 200);
  } catch { return ""; }
}

function pagePath() {
  let p = location.pathname.startsWith(SITE_BASE_PATH) ? location.pathname.slice(SITE_BASE_PATH.length) : location.pathname.replace(/^\//, "");
  p = p.replace(/index\.html$/, "").replace(/\/$/, "") || "home";
  const slug = new URLSearchParams(location.search).get("s");
  return ("/" + p + (slug ? "?s=" + slug : "")).slice(0, 200);
}

export function track() {
  try {
    if (location.protocol === "file:") return;
    if (navigator.doNotTrack === "1" || localStorage.getItem("ahatab-no-track")) return;
    if (BOT.test(navigator.userAgent) || navigator.webdriver) return;
    if (/\/admin\//.test(location.pathname)) return;
    const row = {
      path: pagePath(),
      referrer: referrerHost() || null,
      visitor_id: store("local", "ahatab-vid", randomId),
      session_id: store("session", "ahatab-sid", randomId),
      device: deviceType(),
      lang: localStorage.getItem("ahatab-lang") === "bn" ? "bn" : "en",
      screen_w: Math.round(window.innerWidth) || null,
    };
    sb.from("page_views").insert(row).then(({ error }) => { if (error) console.debug("views:", error.message); });
  } catch (err) { console.debug(err); }
}
