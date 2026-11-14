import { mountLayout, $, $$, esc, normalizeDigits, pageUrl } from "./ui.js";
import { t, getLang, fmtNumber, applyI18n, setting } from "./i18n.js";
import { sb } from "./supa.js";
import { getSettings } from "./data.js";

mountLayout("donate");

// Manual mobile-banking flow: the donor sends money from their own app, then gives us the Transaction ID.
// Nothing here moves money. Each gift is checked by an admin against the real account before it counts.
const QUICK = [100, 300, 500, 1000, 2000, 5000];
const MIN = 10;
const MAX = 1000000;
const TIMER_SECONDS = 10 * 60;
const BRAND = { bkash: "#e2136e", nagad: "#ee3a43", rocket: "#8c3494", upay: "#e8a900", cellfin: "#1b9c5b", tap: "#d52b1e", islami: "#0b7d3e" };
const brandColor = (name) => {
  const k = Object.keys(BRAND).find((b) => String(name).toLowerCase().includes(b));
  return k ? BRAND[k] : "#1e6b62";
};

const state = { step: 1, amount: 0, name: "", anon: false, phone: "", message: "", method: null };
const body = $("#gate-body");
let methods = [];
let contact = {};
let payNote = "";
let timer = null;

const money = (n) => "৳" + fmtNumber(n);
const toBnDigits = (s) => (getLang() === "bn" ? String(s).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]) : String(s));
const fill = (key, vars) => Object.entries(vars).reduce((s, [k, v]) => s.replaceAll(`{${k}}`, v), t(key));

function showStep(n) {
  state.step = n;
  clearInterval(timer);
  $$("#gate-steps li").forEach((li) => {
    const s = Number(li.dataset.s);
    li.classList.toggle("done", s < n || n === 4);
    if (s === n) li.setAttribute("aria-current", "step");
    else li.removeAttribute("aria-current");
  });
  $("#gate-steps").hidden = n === 4;
  if (n === 1) renderAmount();
  else if (n === 2) renderMethods();
  else if (n === 3) renderSend();
  else renderThanks();
  applyI18n(body);
  const h = $("h2", body);
  if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); }
  $("#gate-steps").scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}

/* ---- step 1: amount ---- */
function renderAmount() {
  body.innerHTML = `
    <h2 data-i18n="donate.amount.title"></h2>
    <div class="chips" role="group" data-i18n-aria="donate.amount.title">
      ${QUICK.map((q) => `<button type="button" class="chip" data-q="${q}" aria-pressed="${state.amount === q}">${money(q)}</button>`).join("")}
    </div>
    <div class="field">
      <label for="amt" data-i18n="donate.amount.other"></label>
      <div class="money"><span aria-hidden="true">৳</span><input id="amt" inputmode="numeric" autocomplete="off" maxlength="9" value="${state.amount && !QUICK.includes(state.amount) ? state.amount : ""}"></div>
    </div>
    <div class="field">
      <label for="dn" data-i18n="form.name"></label>
      <input id="dn" autocomplete="name" maxlength="120" value="${esc(state.name)}" ${state.anon ? "disabled" : ""}>
    </div>
    <label class="check-row"><input type="checkbox" id="anon" ${state.anon ? "checked" : ""}><span data-i18n="donate.anon"></span></label>
    <div class="field"><label for="dp" data-i18n="donate.optional.phone"></label><input id="dp" type="tel" autocomplete="tel" maxlength="40" value="${esc(state.phone)}"></div>
    <div class="field"><label for="dm" data-i18n="donate.optional.msg"></label><textarea id="dm" maxlength="500" style="min-height:80px">${esc(state.message)}</textarea></div>
    <p class="form-status err" id="e1" role="alert"></p>
    <button class="btn btn-teal btn-block" type="button" id="next" data-i18n="donate.next"></button>`;
  const amt = $("#amt");
  $$(".chip", body).forEach((c) => c.addEventListener("click", () => {
    state.amount = Number(c.dataset.q);
    amt.value = "";
    $$(".chip", body).forEach((x) => x.setAttribute("aria-pressed", String(x === c)));
  }));
  amt.addEventListener("input", () => {
    const n = Number(normalizeDigits(amt.value).replace(/\D/g, ""));
    state.amount = n || 0;
    $$(".chip", body).forEach((x) => x.setAttribute("aria-pressed", String(Number(x.dataset.q) === n)));
  });
  $("#anon").addEventListener("change", (e) => {
    state.anon = e.target.checked;
    $("#dn").disabled = state.anon;
  });
  $("#next").addEventListener("click", () => {
    state.name = $("#dn").value.trim();
    state.phone = normalizeDigits($("#dp").value).trim();
    state.message = $("#dm").value.trim();
    const err = $("#e1");
    if (!(state.amount >= MIN && state.amount <= MAX)) return (err.textContent = t("donate.amount.min"));
    if (!state.anon && !state.name) return (err.textContent = t("donate.name.required"));
    err.textContent = "";
    showStep(2);
  });
}

/* ---- step 2: method ---- */
function renderMethods() {
  const list = methods
    .map((m, i) => `<button type="button" class="mcard" data-i="${i}" style="--brand:${brandColor(m.name)}"><span class="mdot" aria-hidden="true"></span><strong>${esc(m.name)}</strong><small>${esc(m.note || t("donate.type.default"))}</small></button>`)
    .join("");
  const mail = contact.email ? `<a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a>` : "";
  body.innerHTML = `
    <button type="button" class="back" id="back" data-i18n="donate.back"></button>
    <div class="gift-sum"><span data-i18n="donate.summary"></span><b>${money(state.amount)}</b></div>
    <h2 data-i18n="donate.method.title"></h2>
    ${payNote ? `<p class="muted">${esc(payNote)}</p>` : ""}
    ${methods.length
      ? `<p class="group-title"><span aria-hidden="true">📱</span> <span data-i18n="donate.method.group"></span></p><div class="mgrid">${list}</div>`
      : `<p class="muted">${esc(t("donate.method.empty"))}</p><p><a class="btn btn-teal" href="${pageUrl("contact")}" data-i18n="donate.method.contact"></a></p>${mail ? `<p>${mail}</p>` : ""}`}`;
  $("#back").addEventListener("click", () => showStep(1));
  $$(".mcard", body).forEach((c) => c.addEventListener("click", () => { state.method = methods[Number(c.dataset.i)]; showStep(3); }));
}

/* ---- step 3: send money, then Transaction ID ---- */
async function copy(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (_) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.append(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (__) { /* nothing more to try */ }
    ta.remove();
  }
  const old = btn.textContent;
  btn.textContent = t("donate.copied");
  btn.classList.add("ok");
  setTimeout(() => { btn.textContent = old; btn.classList.remove("ok"); }, 1800);
}

function renderSend() {
  const m = state.method;
  const action = m.note || t("donate.type.default");
  body.innerHTML = `
    <button type="button" class="back" id="back" data-i18n="donate.back"></button>
    <div class="send" style="--brand:${brandColor(m.name)}">
      <div class="send-head"><span class="mdot" aria-hidden="true"></span><h2>${esc(m.name)}</h2><b>${money(state.amount)}</b></div>
      <div class="send-card">
        <p data-i18n="donate.to"></p>
        <div class="numrow"><strong id="num" dir="ltr">${esc(toBnDigits(m.number))}</strong><button type="button" class="copy" id="c-num" data-i18n="donate.copy"></button></div>
      </div>
      <div class="send-card slim">
        <p data-i18n="donate.amount.label"></p>
        <div class="numrow"><strong>${money(state.amount)}</strong><button type="button" class="copy" id="c-amt" data-i18n="donate.copy"></button></div>
      </div>
      <div class="timer"><span data-i18n="donate.timer"></span><b id="tm" role="timer" aria-live="off">10:00</b></div>
      <p id="tm-note" class="muted" role="status"></p>
      <h3 data-i18n="donate.how"></h3>
      <ol class="how">
        <li>${esc(fill("donate.step.1", { m: m.name }))}</li>
        <li>${esc(fill("donate.step.2", { t: action, a: fmtNumber(state.amount) }))}</li>
        <li>${esc(t("donate.step.3"))}</li>
      </ol>
      <form id="trx-form" novalidate>
        <div class="field">
          <label for="trx" data-i18n="donate.trx.label"></label>
          <input id="trx" name="trx" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="24" data-i18n-ph="donate.trx.ph" dir="ltr">
        </div>
        <div class="hp" aria-hidden="true"><label>Website <input name="website" tabindex="-1" autocomplete="off"></label></div>
        <p class="form-status" id="e3" role="alert"></p>
        <button class="btn btn-teal btn-block" type="submit" id="send" data-i18n="donate.trx.submit"></button>
      </form>
      <p class="muted fine" data-i18n="donate.honest"></p>
    </div>`;
  $("#back").addEventListener("click", () => showStep(2));
  $("#c-num").addEventListener("click", (e) => copy(m.number, e.currentTarget));
  $("#c-amt").addEventListener("click", (e) => copy(String(state.amount), e.currentTarget));
  startTimer();
  $("#trx-form").addEventListener("submit", submit);
}

function startTimer() {
  let left = TIMER_SECONDS;
  const tm = $("#tm");
  const draw = () => {
    const mm = String(Math.floor(left / 60)).padStart(2, "0");
    const ss = String(left % 60).padStart(2, "0");
    tm.textContent = toBnDigits(`${mm}:${ss}`);
  };
  draw();
  timer = setInterval(() => {
    left -= 1;
    draw();
    if (left <= 0) {
      clearInterval(timer);
      $("#tm-note").textContent = t("donate.timer.over"); // only a reminder: the Transaction ID can still be submitted
      $(".timer").classList.add("over");
    }
  }, 1000);
}

async function submit(e) {
  e.preventDefault();
  const fd = new FormData(e.currentTarget);
  const err = $("#e3");
  const btn = $("#send");
  err.className = "form-status err";
  err.textContent = "";
  if (fd.get("website")) return showStep(4); // bots fill the hidden field
  const trx = String(fd.get("trx") || "").trim().toUpperCase();
  if (!/^[A-Z0-9]{6,24}$/.test(trx)) return (err.textContent = t("donate.trx.invalid"));
  const label = btn.textContent;
  btn.disabled = true;
  btn.textContent = t("form.sending");
  const { error } = await sb.from("donations").insert({
    donor_name: state.anon ? "Anonymous" : state.name,
    phone: state.phone || null,
    amount: state.amount,
    method: state.method.name,
    trx_id: trx,
    message: state.message || null,
  });
  btn.disabled = false;
  btn.textContent = label;
  if (error) {
    console.error(error);
    err.textContent = error.code === "23505" ? t("donate.trx.dupe") : t("form.error");
    return;
  }
  state.trx = trx;
  showStep(4);
}

/* ---- step 4: thank you ---- */
function renderThanks() {
  body.innerHTML = `
    <div class="thanks">
      <svg class="tick" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24" fill="none" stroke="#1e6b62" stroke-width="3"/><path d="M14 27l8 8 16-17" fill="none" stroke="#1e6b62" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <h2 data-i18n="donate.thanks.title"></h2>
      <p data-i18n="donate.thanks.body"></p>
      <dl class="receipt">
        <dt data-i18n="donate.summary"></dt><dd>${money(state.amount)}</dd>
        <dt>${esc(state.method?.name || "")}</dt><dd dir="ltr">${esc(state.trx || "")}</dd>
      </dl>
      <div class="btn-row">
        <a class="btn btn-teal" href="${pageUrl("home")}" data-i18n="donate.thanks.home"></a>
        <button class="btn btn-ghost" type="button" id="again" data-i18n="donate.thanks.again"></button>
      </div>
    </div>`;
  $("#again").addEventListener("click", () => { Object.assign(state, { amount: 0, method: null, trx: "", message: "" }); showStep(1); });
}

(async () => {
  const s = await getSettings();
  const d = s.donate || {};
  contact = s.general || {};
  payNote = setting(d, "note");
  methods = (Array.isArray(d.methods) ? d.methods : []).filter((m) => m && m.name && m.number && m.enabled !== false);
  showStep(1);
})();
