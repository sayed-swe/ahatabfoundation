import { mountLayout, $, esc, bindForm, normalizeDigits } from "./ui.js";
import { setting, t } from "./i18n.js";
import { sb } from "./supa.js";
import { getSettings } from "./data.js";

mountLayout("contact");

const clean = (v) => {
  const s = String(v ?? "").trim();
  return s === "" ? null : s;
};

bindForm(
  $("#contact-form"),
  async (fd) => {
    const { error } = await sb.from("messages").insert({
      name: String(fd.get("name")).trim(),
      email: clean(fd.get("email")),
      phone: clean(normalizeDigits(fd.get("phone"))),
      subject: clean(fd.get("subject")),
      body: String(fd.get("body")).trim(),
    });
    if (error) throw error;
  },
  "contact.thanks"
);

(async () => {
  const g = (await getSettings()).general || {};
  const rows = [];
  if (g.email) rows.push(`<p><b>${esc(t("form.email"))}</b><br><a href="mailto:${esc(g.email)}">${esc(g.email)}</a></p>`);
  if (g.phone) rows.push(`<p><b>${esc(t("form.phone"))}</b><br><a href="tel:${esc(g.phone.replace(/\s/g, ""))}">${esc(g.phone)}</a></p>`);
  const loc = setting(g, "location");
  if (loc) rows.push(`<p><b>${esc(t("contact.location"))}</b><br>${esc(loc)}</p>`);
  $("#contact-info").innerHTML = rows.length ? rows.join("") : `<p class="muted">${esc(t("footer.pending"))}</p>`;
})();
