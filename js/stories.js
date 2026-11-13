import { mountLayout, $, esc, paragraphs, safeUrl, emptyState } from "./ui.js";
import { t, pick, fmtDate } from "./i18n.js";
import { listStories, listEvents, getStory } from "./data.js";
import { storyRowHtml, eventRowHtml } from "./render.js";

mountLayout("stories");

const slug = new URLSearchParams(location.search).get("s");

async function detail() {
  $("#list-view").hidden = true;
  const box = $("#detail-view");
  box.hidden = false;
  try {
    const s = await getStory(slug);
    if (!s) {
      box.innerHTML = `<p>${esc(t("common.notFound"))}</p><p><a href="stories.html">${esc(t("common.back"))}</a></p>`;
      return;
    }
    const title = pick(s, "title");
    document.title = `${title} | Ahatab Foundation`;
    const img = safeUrl(s.image_url);
    box.innerHTML = `<article class="article">
      <p class="muted"><a href="stories.html">${esc(t("common.back"))}</a></p>
      <h1>${esc(title)}</h1>
      <p class="muted">${esc(fmtDate(s.published_at))}</p>
      ${img ? `<img class="article-cover" src="${esc(img)}" alt="">` : ""}
      <div class="prose">${paragraphs(pick(s, "body") || pick(s, "excerpt"))}</div>
    </article>`;
  } catch (err) {
    console.error(err);
    box.innerHTML = `<p>${esc(t("common.loadError"))}</p>`;
  }
}

async function list() {
  const el = $("#stories");
  try {
    const rows = await listStories();
    el.innerHTML = rows.length ? rows.map(storyRowHtml).join("") : `<li class="muted">${esc(t("common.empty.stories"))}</li>`;
  } catch (err) {
    console.error(err);
    el.innerHTML = `<li class="muted">${esc(t("common.loadError"))}</li>`;
  }
  try {
    const ev = await listEvents();
    $("#events-list").innerHTML = ev.length ? ev.map(eventRowHtml).join("") : `<li class="muted">${esc(t("common.empty.events"))}</li>`;
  } catch (err) {
    console.error(err);
  }
}

if (slug) {
  $("#page-head").hidden = true;
  detail();
} else {
  list();
}
