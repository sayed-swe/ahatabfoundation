import { mountLayout, $, esc } from "./ui.js";
import { t } from "./i18n.js";
import { listEvents, listPastEvents } from "./data.js";
import { eventRowHtml } from "./render.js";

mountLayout("events");

(async () => {
  const up = $("#upcoming");
  try {
    const rows = await listEvents();
    up.innerHTML = rows.length ? rows.map(eventRowHtml).join("") : `<li class="muted">${esc(t("common.empty.events"))}</li>`;
  } catch (err) {
    console.error(err);
    up.innerHTML = `<li class="muted">${esc(t("common.loadError"))}</li>`;
  }
  try {
    const past = await listPastEvents();
    if (past.length) {
      $("#past").innerHTML = past.map(eventRowHtml).join("");
      $("#past-section").hidden = false;
    }
  } catch (err) {
    console.error(err);
  }
})();
