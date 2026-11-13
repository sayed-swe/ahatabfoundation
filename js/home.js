import { mountLayout, $, esc, emptyState } from "./ui.js";
import { t, fmtNumber } from "./i18n.js";
import { getSettings, listPrograms, listStories, listEvents } from "./data.js";
import { patchHtml, storyRowHtml, eventRowHtml } from "./render.js";

mountLayout("home");

async function programs() {
  const el = $("#programs");
  try {
    const rows = await listPrograms();
    el.innerHTML = rows.length ? rows.map(patchHtml).join("") : "";
    if (!rows.length) emptyState(el, "common.empty.programs");
  } catch (err) {
    console.error(err);
    emptyState(el, "common.loadError");
  }
}

async function impact() {
  const s = (await getSettings()).impact || {};
  if (!s.show) return;
  const items = [
    ["people_helped", "impact.people"],
    ["families_supported", "impact.families"],
    ["volunteers", "impact.volunteers"],
    ["projects", "impact.projects"],
  ];
  $("#impact-grid").innerHTML = items
    .map(([k, label]) => `<div><strong>${esc(fmtNumber(s[k]))}</strong><span>${esc(t(label))}</span></div>`)
    .join("");
  $("#impact").hidden = false;
}

async function stories() {
  const el = $("#stories");
  try {
    const rows = await listStories(3);
    if (rows.length) el.innerHTML = rows.map(storyRowHtml).join("");
    else el.innerHTML = `<li class="muted">${esc(t("common.empty.stories"))}</li>`;
  } catch (err) {
    console.error(err);
    el.innerHTML = `<li class="muted">${esc(t("common.loadError"))}</li>`;
  }
}

async function events() {
  try {
    const rows = await listEvents(3);
    if (!rows.length) return; // hide the section entirely when nothing is scheduled
    $("#events-list").innerHTML = rows.map(eventRowHtml).join("");
    $("#events").hidden = false;
  } catch (err) {
    console.error(err);
  }
}

programs();
impact();
stories();
events();
