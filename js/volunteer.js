import { mountLayout, $, bindForm, normalizeDigits, pageUrl } from "./ui.js";
import { t } from "./i18n.js";
import { sb } from "./supa.js";

mountLayout("volunteer");

const clean = (v) => {
  const s = String(v ?? "").trim();
  return s === "" ? null : s;
};

bindForm(
  $("#vol-form"),
  async (fd) => {
    const { error } = await sb.from("volunteers").insert({
      name: String(fd.get("name")).trim(),
      phone: String(normalizeDigits(fd.get("phone"))).trim(),
      email: clean(fd.get("email")),
      area: clean(fd.get("area")),
      message: clean(fd.get("message")),
    });
    if (error) throw error;
  },
  "vol.thanks"
);

$("#share").addEventListener("click", async (e) => {
  const btn = e.currentTarget;
  const url = pageUrl("home");
  try {
    if (navigator.share) await navigator.share({ title: document.title, url });
    else {
      await navigator.clipboard.writeText(url);
      const old = btn.textContent;
      btn.textContent = t("share.copied");
      setTimeout(() => { btn.textContent = old; }, 2000);
    }
  } catch (_) { /* user cancelled the share sheet */ }
});
