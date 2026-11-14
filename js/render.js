import { t, pick, fmtDate, fmtNumber } from "./i18n.js";
import { esc, icon, safeUrl } from "./ui.js";

const sample = (row) => (row.is_sample ? `<span class="pill-sample">${esc(t("common.sample"))}</span>` : "");

export function patchHtml(p) {
  const img = safeUrl(p.image_url);
  return `<a class="patch${img ? " has-img" : ""}" href="programs.html#${esc(p.slug)}">
    ${img ? `<img class="patch-img" src="${esc(img)}" alt="" loading="lazy">` : `<span class="patch-icon">${icon(p.icon)}</span>`}
    <h3>${esc(pick(p, "title"))}</h3>
    <p>${esc(pick(p, "summary"))}</p>
    <span class="patch-more">${esc(t("common.readMore"))}</span>
  </a>`;
}

export function issueHtml(s) {
  const img = safeUrl(s.image_url);
  const href = `stories.html?s=${encodeURIComponent(s.slug)}`;
  return `<article class="issue">
    ${img ? `<img class="issue-img" src="${esc(img)}" alt="" loading="lazy">` : ""}
    <div>
      <h3><a href="${href}">${esc(pick(s, "title"))}</a></h3>
      <p>${esc(pick(s, "excerpt"))}</p>
      <p><a class="btn btn-ghost" href="${href}">${esc(t("common.readMore"))}<span class="sr">: ${esc(pick(s, "title"))}</span></a> ${sample(s)}</p>
    </div>
  </article>`;
}

export function storyRowHtml(s) {
  const img = safeUrl(s.image_url);
  const cat = ["news", "update", "story", "issue"].includes(s.category) ? t(`cat.${s.category}`) : s.category;
  return `<li class="row">
    <div class="row-meta"><b>${esc(cat)}</b>${esc(fmtDate(s.published_at))}${sample(s)}</div>
    <div>
      <h3><a href="stories.html?s=${encodeURIComponent(s.slug)}">${esc(pick(s, "title"))}</a></h3>
      <p>${esc(pick(s, "excerpt"))}</p>
    </div>
    ${img ? `<img class="row-thumb" src="${esc(img)}" alt="" loading="lazy">` : "<span></span>"}
  </li>`;
}

export function eventRowHtml(e) {
  const img = safeUrl(e.image_url);
  const day = fmtNumber(new Date(e.starts_at).getDate());
  const month = fmtDate(e.starts_at, { month: "long", year: "numeric" });
  const time = fmtDate(e.starts_at, { hour: "numeric", minute: "2-digit" });
  return `<li class="row">
    <div class="row-meta"><span class="event-day">${esc(day)}</span>${esc(month)}${sample(e)}</div>
    <div>
      <h3>${esc(pick(e, "title"))}</h3>
      <p>${esc(pick(e, "description"))}</p>
      <p class="row-meta">${esc(time)}${e.location ? " · " + esc(e.location) : ""}</p>
    </div>
    ${img ? `<img class="row-thumb" src="${esc(img)}" alt="" loading="lazy">` : "<span></span>"}
  </li>`;
}
