import { mountLayout, $, esc, icon, paragraphs, safeUrl, emptyState } from "./ui.js";
import { pick } from "./i18n.js";
import { listPrograms } from "./data.js";

mountLayout("programs");

(async () => {
  const el = $("#program-list");
  try {
    const rows = await listPrograms();
    if (!rows.length) return emptyState(el, "common.empty.programs");
    el.innerHTML = rows
      .map((p) => {
        const img = safeUrl(p.image_url);
        const body = pick(p, "body") || pick(p, "summary");
        return `<article class="program" id="${esc(p.slug)}">
          <div class="icon">${icon(p.icon)}</div>
          <div class="program-body">
            <h2>${esc(pick(p, "title"))}</h2>
            ${img ? `<img src="${esc(img)}" alt="" loading="lazy">` : ""}
            ${paragraphs(body)}
          </div>
        </article>`;
      })
      .join("");
    if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
  } catch (err) {
    console.error(err);
    emptyState(el, "common.loadError");
  }
})();
