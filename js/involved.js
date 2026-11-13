import { mountLayout, $, esc, bindForm, normalizeDigits } from "./ui.js";
import { t, setting } from "./i18n.js";
import { sb } from "./supa.js";
import { getSettings } from "./data.js";

mountLayout("involved");

const clean = (v) => {
  const s = String(v ?? "").trim();
  return s === "" ? null : s;
};

async function donateInfo() {
  const d = (await getSettings()).donate || {};
  const methods = Array.isArray(d.methods) ? d.methods.filter((m) => m && m.name) : [];
  const list = $("#methods");
  const note = setting(d, "note");
  $("#give-step").textContent = note || t("give.step");
  if (!methods.length) {
    list.innerHTML = `<p class="muted">${esc(t("give.none"))}</p>`;
  } else {
    list.innerHTML = methods
      .map((m) => `<div class="method"><strong>${esc(m.name)}</strong>${m.number ? `<span class="num">${esc(m.number)}</span>` : ""}${m.note ? `<span class="muted">${esc(m.note)}</span>` : ""}</div>`)
      .join("");
  }
  const sel = $("#method");
  sel.innerHTML = methods.map((m) => `<option>${esc(m.name)}</option>`).join("") + `<option value="Other">${esc(t("form.method.other"))}</option>`;
}

bindForm(
  $("#give-form"),
  async (fd) => {
    const amount = Number(normalizeDigits(fd.get("amount")).replace(/[^\d.]/g, ""));
    if (!(amount > 0)) throw new Error("amount");
    const { error } = await sb.from("donations").insert({
      donor_name: String(fd.get("name")).trim(),
      phone: clean(normalizeDigits(fd.get("phone"))),
      email: clean(fd.get("email")),
      amount,
      method: String(fd.get("method") || "Other"),
      trx_id: clean(fd.get("trx")),
      message: clean(fd.get("message")),
    });
    if (error) throw error;
  },
  "give.thanks"
);

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
  const url = new URL("index.html", location.href).href;
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

donateInfo();
