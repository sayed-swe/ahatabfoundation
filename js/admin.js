import { loadClient } from "./supa.js";
import { esc, safeUrl, ICON_NAMES, LOGO, defaultImage } from "./ui.js";

const sb = await loadClient();

const app = document.getElementById("app");
const dlg = document.getElementById("dlg");
const toastBox = document.getElementById("toast");
const state = { user: null };

/* ---------- helpers ---------- */
function toast(msg, isErr = false) {
  const el = document.createElement("div");
  el.className = "t" + (isErr ? " err" : "");
  el.textContent = msg;
  toastBox.replaceChildren(el);
  setTimeout(() => el.remove(), 3500);
}
const slugify = (s) =>
  String(s || "").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
const fmtWhen = (iso) =>
  iso ? new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "";
const toLocalInput = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};
const samplePill = (v) => (v ? '<span class="pill">Sample</span>' : "");
const pill = (on, yes = "Published", no = "Draft") => `<span class="pill ${on ? "on" : "off"}">${on ? yes : no}</span>`;
const money = (n) => "৳" + Number(n).toLocaleString("en-IN");

/* ---------- resource definitions ---------- */
const PUB = { name: "published", label: "Show on the website", type: "checkbox", default: true };
const RES = {
  programs: {
    label: "Programs", table: "programs", one: "program",
    order: [["sort", true], ["created_at", true]],
    columns: [["title_en", "Title"], ["sort", "Order"], ["published", "Status", (v) => pill(v)]],
    fields: [
      { name: "title_en", label: "Title (English)", type: "text", required: true },
      { name: "title_bn", label: "Title (বাংলা)", type: "text" },
      { name: "summary_en", label: "Short summary (English)", type: "textarea", rows: 2 },
      { name: "summary_bn", label: "Short summary (বাংলা)", type: "textarea", rows: 2 },
      { name: "body_en", label: "Details (English)", type: "textarea", rows: 6, hint: "Leave a blank line between paragraphs." },
      { name: "body_bn", label: "Details (বাংলা)", type: "textarea", rows: 6 },
      { name: "icon", label: "Icon", type: "select", options: ICON_NAMES, default: "heart" },
      { name: "image_url", label: "Photo", type: "image" },
      { name: "sort", label: "Display order", type: "number", default: 0, hint: "Lower numbers appear first." },
      { name: "slug", label: "Web address name", type: "slug", from: "title_en", hint: "Letters, numbers and dashes. Filled in from the title." },
      PUB,
    ],
  },
  stories: {
    label: "Stories", table: "stories", one: "story",
    order: [["published_at", false]],
    columns: [["title_en", "Title"], ["category", "Type"], ["published_at", "Date", fmtWhen], ["published", "Status", (v) => pill(v)], ["is_sample", "", samplePill]],
    fields: [
      { name: "title_en", label: "Title (English)", type: "text", required: true },
      { name: "title_bn", label: "Title (বাংলা)", type: "text" },
      { name: "excerpt_en", label: "Short summary (English)", type: "textarea", rows: 2 },
      { name: "excerpt_bn", label: "Short summary (বাংলা)", type: "textarea", rows: 2 },
      { name: "body_en", label: "Full text (English)", type: "textarea", rows: 8, hint: "Leave a blank line between paragraphs." },
      { name: "body_bn", label: "Full text (বাংলা)", type: "textarea", rows: 8 },
      { name: "category", label: "Type", type: "select", options: ["news", "update", "story", "issue"], default: "news", hint: "Choose \"issue\" for a problem story. Up to three of them show on the home page under Why this work matters." },
      { name: "image_url", label: "Cover photo", type: "image" },
      { name: "published_at", label: "Publish date", type: "datetime", default: "now", hint: "A future date keeps the story hidden until then." },
      { name: "slug", label: "Web address name", type: "slug", from: "title_en", hint: "Letters, numbers and dashes. Filled in from the title." },
      { ...PUB, default: false, label: "Publish on the website" },
    ],
  },
  events: {
    label: "Events", table: "events", one: "event",
    order: [["starts_at", false]],
    columns: [["title_en", "Title"], ["starts_at", "When", fmtWhen], ["published", "Status", (v) => pill(v)], ["is_sample", "", samplePill]],
    fields: [
      { name: "title_en", label: "Title (English)", type: "text", required: true },
      { name: "title_bn", label: "Title (বাংলা)", type: "text" },
      { name: "description_en", label: "Description (English)", type: "textarea", rows: 3 },
      { name: "description_bn", label: "Description (বাংলা)", type: "textarea", rows: 3 },
      { name: "location", label: "Place", type: "text" },
      { name: "starts_at", label: "Starts", type: "datetime", required: true },
      { name: "image_url", label: "Photo", type: "image" },
      PUB,
    ],
  },
};

const INBOX = {
  donations: {
    label: "Gifts", table: "donations", statuses: ["pending", "verified", "rejected"],
    columns: [["created_at", "Received", fmtWhen], ["donor_name", "Donor"], ["amount", "Amount", money], ["method", "Method"]],
    detail: [["donor_name", "Name"], ["amount", "Amount", money], ["method", "Method"], ["trx_id", "Transaction ID"], ["phone", "Phone"], ["email", "Email"], ["message", "Message"], ["created_at", "Received", fmtWhen]],
  },
  volunteers: {
    label: "Volunteers", table: "volunteers", statuses: ["new", "contacted", "archived"],
    columns: [["created_at", "Received", fmtWhen], ["name", "Name"], ["phone", "Phone"], ["area", "Area"]],
    detail: [["name", "Name"], ["phone", "Phone"], ["email", "Email"], ["area", "Area"], ["message", "Message"], ["created_at", "Received", fmtWhen]],
  },
  messages: {
    label: "Messages", table: "messages", statuses: ["new", "read", "archived"],
    columns: [["created_at", "Received", fmtWhen], ["name", "From"], ["subject", "Subject"]],
    detail: [["name", "Name"], ["email", "Email"], ["phone", "Phone"], ["subject", "Subject"], ["body", "Message"], ["created_at", "Received", fmtWhen]],
  },
};
const NEW_STATUS = { donations: "pending", volunteers: "new", messages: "new" };

/* ---------- auth ---------- */
async function boot() {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) return renderLogin();
  state.user = session.user;
  const { data, error } = await sb.from("admins").select("user_id").maybeSingle();
  if (error) console.error(error);
  if (data) return renderShell();
  renderNotAdmin();
}

function renderLogin(mode = "in", msg = "") {
  const signup = mode === "up";
  app.innerHTML = `<div class="auth"><div class="panel">
    <div class="auth-logo">${LOGO}</div>
    <h1>${signup ? "Create admin account" : "Admin sign in"}</h1>
    <p class="muted">${signup ? "Make this account first. The first account to sign in can then claim admin access." : "Ahatab Foundation website."}</p>
    <form id="auth-form" class="form-grid">
      <div class="field"><label for="email">Email</label><input id="email" name="email" type="email" required autocomplete="email"></div>
      <div class="field"><label for="pw">Password</label><input id="pw" name="pw" type="password" required minlength="8" autocomplete="${signup ? "new-password" : "current-password"}"></div>
      <p class="form-status ${msg.startsWith("!") ? "err" : "ok"}" role="status">${esc(msg.replace(/^!/, ""))}</p>
      <button class="btn btn-teal" type="submit">${signup ? "Create account" : "Sign in"}</button>
      <button class="link-btn" type="button" id="swap">${signup ? "I already have an account" : "Create the first admin account"}</button>
    </form></div></div>`;
  document.getElementById("swap").onclick = () => renderLogin(signup ? "in" : "up");
  document.getElementById("auth-form").onsubmit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const email = String(f.get("email")).trim();
    const password = String(f.get("pw"));
    const btn = e.target.querySelector("button[type=submit]");
    btn.disabled = true;
    try {
      if (signup) {
        const { data, error } = await sb.auth.signUp({ email, password });
        if (error) throw error;
        if (data.session) return boot();
        return renderLogin("in", "Account created. Check your email to confirm it, then sign in.");
      }
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw error;
      boot();
    } catch (err) {
      renderLogin(mode, "!" + (err.message || "Could not sign in."));
    }
  };
}

function renderNotAdmin() {
  app.innerHTML = `<div class="auth"><div class="panel">
    <h1>Almost there</h1>
    <p>You are signed in as <b>${esc(state.user.email)}</b>, but this account is not an admin yet.</p>
    <p class="muted">If this is the first admin account for the site, claim access below. It works once; after that, new admins have to be added in the database.</p>
    <p class="form-status err" id="claim-msg" role="status"></p>
    <div class="btn-row"><button class="btn btn-teal" id="claim">Claim admin access</button>
    <button class="btn btn-ghost" id="out">Sign out</button></div></div></div>`;
  document.getElementById("out").onclick = signOut;
  document.getElementById("claim").onclick = async () => {
    const { data, error } = await sb.rpc("claim_admin");
    if (error) console.error(error);
    if (data === true) return boot();
    document.getElementById("claim-msg").textContent = "Admin access was already claimed by another account.";
  };
}

async function signOut() {
  await sb.auth.signOut();
  renderLogin();
}

/* ---------- shell and routing ---------- */
const NAV = [
  ["overview", "Overview"], ["analytics", "Visitors"], ["programs", "Programs"], ["stories", "Stories"], ["events", "Events"],
  ["donations", "Gifts"], ["volunteers", "Volunteers"], ["messages", "Messages"], ["settings", "Settings"],
];

const TAB_ICONS = {
  overview: '<path d="M3 11l9-8 9 8M5 10v10h14V10M10 20v-6h4v6"/>',
  analytics: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  donations: '<path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/>',
  messages: '<path d="M3 6h18v12H3zM3 7l9 7 9-7"/>',
  more: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
};
const TABS = [["overview", "Home"], ["analytics", "Visitors"], ["donations", "Gifts"], ["messages", "Inbox"]];
const MORE = [["programs", "Programs"], ["stories", "Stories"], ["events", "Events"], ["volunteers", "Volunteers"], ["settings", "Settings"]];
const tabIcon = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${TAB_ICONS[k]}</svg>`;

async function renderShell() {
  app.innerHTML = `<div class="shell">
    <aside class="side">
      <div class="name">${LOGO}<span>Ahatab Foundation</span></div>
      <nav id="nav" aria-label="Admin"></nav>
      <div class="foot"><a href="../home/">View public site</a><span>${esc(state.user.email)}</span><button class="link-btn" id="out">Sign out</button></div>
    </aside>
    <main class="main" id="main"></main></div>
    <nav class="tabbar" id="tabbar" aria-label="Quick menu">
      ${TABS.map(([k, l]) => `<a href="#/${k}" data-tab="${k}">${tabIcon(k)}<span>${l}</span><i class="badge" data-badge="${k}" hidden></i></a>`).join("")}
      <button type="button" id="more-btn" aria-expanded="false" aria-controls="sheet">${tabIcon("more")}<span>More</span><i class="badge" data-badge="volunteers" hidden></i></button>
    </nav>
    <div class="sheet-back" id="sheet-back" hidden></div>
    <div class="sheet" id="sheet" role="dialog" aria-label="More" hidden>
      <div class="sheet-grip" aria-hidden="true"></div>
      ${MORE.map(([k, l]) => `<a href="#/${k}" data-more="${k}">${l}<i class="badge" data-badge="${k}" hidden></i></a>`).join("")}
      <a href="../home/">View public site</a>
      <button type="button" id="sheet-out">Sign out</button>
    </div>`;
  document.getElementById("out").onclick = signOut;
  const sheet = document.getElementById("sheet"), back = document.getElementById("sheet-back"), moreBtn = document.getElementById("more-btn");
  const setSheet = (open) => { sheet.hidden = back.hidden = !open; moreBtn.setAttribute("aria-expanded", String(open)); if (open) sheet.querySelector("a")?.focus(); else moreBtn.focus(); };
  moreBtn.onclick = () => setSheet(sheet.hidden);
  back.onclick = () => setSheet(false);
  sheet.addEventListener("click", (e) => { if (e.target.closest("a")) { sheet.hidden = back.hidden = true; moreBtn.setAttribute("aria-expanded", "false"); } });
  sheet.addEventListener("keydown", (e) => { if (e.key === "Escape") setSheet(false); });
  document.getElementById("sheet-out").onclick = signOut;
  window.addEventListener("hashchange", route);
  route();
  refreshBadges();
}

const currentView = () => (location.hash.replace(/^#\/?/, "") || "overview");

async function route() {
  const view = currentView();
  document.getElementById("nav").innerHTML = NAV.map(
    ([k, l]) => `<a href="#/${k}" ${k === view ? 'aria-current="page"' : ""}>${l}<span class="badge" data-badge="${k}" hidden></span></a>`
  ).join("");
  refreshBadges();
  document.querySelectorAll("[data-tab]").forEach((a) => (a.dataset.tab === view ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current")));
  const moreOn = MORE.some(([k]) => k === view);
  document.getElementById("more-btn")?.classList.toggle("on", moreOn);
  document.querySelectorAll("[data-more]").forEach((a) => (a.dataset.more === view ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current")));
  window.scrollTo(0, 0);
  const main = document.getElementById("main");
  main.innerHTML = '<p class="muted">Loading…</p>';
  try {
    if (view === "overview") await renderOverview(main);
    else if (view === "analytics") await renderAnalytics(main);
    else if (RES[view]) await renderList(main, view);
    else if (INBOX[view]) await renderInbox(main, view);
    else if (view === "settings") await renderSettings(main);
    else main.innerHTML = '<p class="muted">Page not found.</p>';
  } catch (err) {
    console.error(err);
    main.innerHTML = `<p class="form-status err">Something went wrong: ${esc(err.message || err)}</p>`;
  }
}

async function count(table, filter) {
  let q = sb.from(table).select("*", { count: "exact", head: true });
  if (filter) q = filter(q);
  const { count: n, error } = await q;
  if (error) throw error;
  return n ?? 0;
}

async function refreshBadges() {
  try {
    const [d, v, m] = await Promise.all([
      count("donations", (q) => q.eq("status", "pending")),
      count("volunteers", (q) => q.eq("status", "new")),
      count("messages", (q) => q.eq("status", "new")),
    ]);
    Object.entries({ donations: d, volunteers: v, messages: m }).forEach(([k, n]) => {
      document.querySelectorAll(`[data-badge="${k}"]`).forEach((el) => { el.textContent = n; el.hidden = n === 0; });
    });
  } catch (err) { console.error(err); }
}

/* ---------- overview ---------- */
async function renderOverview(main) {
  const [d, v, m, p, s, sampleStories, sampleEvents] = await Promise.all([
    count("donations", (q) => q.eq("status", "pending")),
    count("volunteers", (q) => q.eq("status", "new")),
    count("messages", (q) => q.eq("status", "new")),
    count("programs", (q) => q.eq("published", true)),
    count("stories", (q) => q.eq("published", true)),
    count("stories", (q) => q.eq("is_sample", true)),
    count("events", (q) => q.eq("is_sample", true)),
  ]);
  let raised = null;
  try { const g = await sb.from("donations").select("amount").eq("status", "verified"); if (!g.error) raised = (g.data || []).reduce((a, x) => a + Number(x.amount || 0), 0); } catch { /* optional card */ }
  let vis = null;
  try { vis = (await sb.rpc("analytics_summary", { days: 7 })).data; } catch { /* the overview works without it */ }
  const card = (href, n, label, alert) => `<a class="stat ${alert && n ? "alert" : ""}" href="#/${href}"><strong>${n}</strong>${label}</a>`;
  main.innerHTML = `<div class="main-head"><h1>Overview</h1></div>
    <div class="stats">
      ${card("donations", d, "gifts waiting to be confirmed", true)}
      ${raised !== null ? card("donations", money(raised), "confirmed gifts so far") : ""}
      ${card("volunteers", v, "new volunteers", true)}
      ${card("messages", m, "unread messages", true)}
      ${card("programs", p, "programs on the website")}
      ${card("stories", s, "published stories")}
      ${vis ? card("analytics", num(vis.today.visitors), "visitors today") : ""}
      ${vis ? card("analytics", num(vis.totals.views), "page views, last 7 days") : ""}
    </div>
    ${sampleStories + sampleEvents ? `<div class="note"><b>Sample content:</b> ${sampleStories} stories and ${sampleEvents} events are examples so you can see how the site looks. Visitors see a "Sample" label on them. Replace them with your own, or remove them all now. <button class="btn btn-sm btn-danger" id="rm-samples" type="button" style="margin-left:.5rem">Remove sample content</button></div>` : ""}
    <div class="note"><b>Tip:</b> change the contact details, payment methods and impact numbers under <a href="#/settings">Settings</a>. The impact numbers stay hidden on the website until you switch them on.</div>`;
  const rm = document.getElementById("rm-samples");
  if (rm) rm.onclick = async () => {
    if (!confirm(`Delete ${sampleStories} sample stories and ${sampleEvents} sample events? Your own content is not touched.`)) return;
    const a = await sb.from("stories").delete().eq("is_sample", true);
    const b = await sb.from("events").delete().eq("is_sample", true);
    if (a.error || b.error) return toast((a.error || b.error).message, true);
    toast("Sample content removed");
    route();
  };
}

/* ---------- generic content lists ---------- */
async function renderList(main, key) {
  const r = RES[key];
  let q = sb.from(r.table).select("*");
  r.order.forEach(([c, asc]) => { q = q.order(c, { ascending: asc }); });
  const { data, error } = await q;
  if (error) throw error;
  const rows = data || [];
  main.innerHTML = `<div class="main-head"><h1>${r.label}</h1><button class="btn btn-teal" id="add">Add ${r.one}</button></div>
    ${rows.length > 4 ? searchBox() : ""}
    <div class="table-wrap">${rows.length ? `<table><thead><tr>${r.columns.map((c) => `<th>${c[1]}</th>`).join("")}<th></th></tr></thead><tbody>
      ${rows.map((row) => `<tr data-id="${esc(row.id)}">${r.columns.map(([f, l, fmt]) => `<td data-label="${esc(l)}">${fmt ? fmt(row[f]) : esc(row[f] ?? "")}</td>`).join("")}
        <td class="actions"><button class="btn btn-ghost btn-sm" data-edit>Edit</button><button class="btn btn-sm btn-danger" data-del>Delete</button></td></tr>`).join("")}
      </tbody></table>` : `<p class="empty">Nothing here yet. Add your first ${r.one}.</p>`}</div>`;
  document.getElementById("add").onclick = () => openForm(key, null);
  bindSearch(main);
  main.querySelectorAll("tr[data-id]").forEach((tr) => {
    const row = rows.find((x) => x.id === tr.dataset.id);
    tr.querySelector("[data-edit]").onclick = () => openForm(key, row);
    tr.querySelector("[data-del]").onclick = async () => {
      if (!confirm(`Delete this ${r.one}? This can't be undone.`)) return;
      const { error: err } = await sb.from(r.table).delete().eq("id", row.id);
      if (err) return toast(err.message, true);
      toast("Deleted");
      route();
    };
  });
}

function fieldHtml(f, row) {
  const v = row ? row[f.name] : f.default;
  const id = "f-" + f.name;
  const hint = f.hint ? `<p class="hint">${esc(f.hint)}</p>` : "";
  const req = f.required ? " required" : "";
  if (f.type === "checkbox")
    return `<div class="field check"><input type="checkbox" id="${id}" name="${f.name}" ${v ? "checked" : ""}><label for="${id}">${esc(f.label)}</label></div>`;
  let input;
  if (f.type === "textarea") input = `<textarea id="${id}" name="${f.name}" rows="${f.rows || 4}"${req}>${esc(v ?? "")}</textarea>`;
  else if (f.type === "select") input = `<select id="${id}" name="${f.name}">${f.options.map((o) => `<option ${o === (v ?? f.default) ? "selected" : ""}>${esc(o)}</option>`).join("")}</select>`;
  else if (f.type === "number") input = `<input id="${id}" name="${f.name}" type="number" value="${esc(v ?? 0)}">`;
  else if (f.type === "datetime") input = `<input id="${id}" name="${f.name}" type="datetime-local" value="${esc(toLocalInput(v === "now" || (!row && !v) ? new Date().toISOString() : v))}"${req}>`;
  else if (f.type === "image")
    input = `<div class="img-field"><input id="${id}" name="${f.name}" type="text" placeholder="https://… or upload below" value="${esc(v ?? "")}">
      <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" data-upload="${f.name}" aria-label="Upload a photo">
      <img alt="" ${safeUrl(v) ? `src="${esc(safeUrl(v))}"` : "hidden"} data-preview="${f.name}"></div>`;
  else input = `<input id="${id}" name="${f.name}" type="text" value="${esc(v ?? "")}"${req}${f.type === "slug" ? ' pattern="[a-z0-9\\-]+"' : ""}>`;
  return `<div class="field"><label for="${id}">${esc(f.label)}</label>${input}${hint}</div>`;
}

function openForm(key, row) {
  const r = RES[key];
  dlg.innerHTML = `<div class="dlg-head"><h2>${row ? "Edit" : "Add"} ${r.one}</h2><button class="btn btn-ghost btn-sm" data-close type="button">Close</button></div>
    <div class="dlg-body"><form class="form-grid" id="res-form">
      ${r.fields.map((f) => fieldHtml(f, row)).join("")}
      <p class="form-status err" id="form-err" role="status"></p>
      <div class="dlg-actions"><button class="btn btn-ghost" type="button" data-close>Cancel</button><button class="btn btn-teal" type="submit">Save ${r.one}</button></div>
    </form></div>`;
  dlg.showModal();
  dlg.querySelectorAll("[data-close]").forEach((b) => (b.onclick = () => dlg.close()));
  const form = document.getElementById("res-form");

  // slug follows the title until the admin edits it by hand
  r.fields.filter((f) => f.type === "slug").forEach((f) => {
    const src = form.elements[f.from];
    const out = form.elements[f.name];
    let touched = !!row;
    out.addEventListener("input", () => { touched = true; });
    src.addEventListener("input", () => { if (!touched) out.value = slugify(src.value); });
  });

  dlg.querySelectorAll("[data-upload]").forEach((input) => {
    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) return toast("Photo is over 5 MB. Choose a smaller one.", true);
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
      const path = `${key}/${crypto.randomUUID()}.${ext}`;
      toast("Uploading…");
      const { error } = await sb.storage.from("media").upload(path, file, { contentType: file.type });
      if (error) return toast(error.message, true);
      const { data } = sb.storage.from("media").getPublicUrl(path);
      form.elements[input.dataset.upload].value = data.publicUrl;
      const prev = dlg.querySelector(`[data-preview="${input.dataset.upload}"]`);
      prev.src = data.publicUrl;
      prev.hidden = false;
      toast("Photo uploaded");
    };
  });

  form.onsubmit = async (e) => {
    e.preventDefault();
    const payload = {};
    for (const f of r.fields) {
      const el = form.elements[f.name];
      if (f.type === "checkbox") payload[f.name] = el.checked;
      else if (f.type === "number") payload[f.name] = Number(el.value) || 0;
      else if (f.type === "datetime") payload[f.name] = el.value ? new Date(el.value).toISOString() : null;
      else {
        const val = el.value.trim();
        payload[f.name] = val === "" && !f.required && f.type !== "select" ? null : val;
      }
    }
    if (payload.image_url && !safeUrl(payload.image_url)) return (document.getElementById("form-err").textContent = "The photo link must start with https:// or be a path on this site, like /images/sample/flood-village.svg");
    if ("slug" in payload && !payload.slug) payload.slug = slugify(payload[r.fields.find((f) => f.type === "slug").from]) || `${r.one}-${Date.now()}`;
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    const { error } = row
      ? await sb.from(r.table).update(payload).eq("id", row.id)
      : await sb.from(r.table).insert(payload);
    btn.disabled = false;
    if (error) {
      document.getElementById("form-err").textContent = error.code === "23505" ? "That web address name is already used. Change it and save again." : error.message;
      return;
    }
    dlg.close();
    toast("Saved");
    route();
  };
}

/* ---------- inbox ---------- */
async function renderInbox(main, key) {
  const r = INBOX[key];
  const { data, error } = await sb.from(r.table).select("*").order("created_at", { ascending: false });
  if (error) throw error;
  const rows = data || [];
  const sum = (st) => rows.filter((x) => x.status === st).reduce((a, x) => a + Number(x.amount || 0), 0);
  const totals = key === "donations" && rows.length
    ? `<div class="stats" style="margin-bottom:1rem"><div class="stat"><strong>${money(sum("verified"))}</strong>confirmed gifts<small>${rows.filter((x) => x.status === "verified").length} gifts</small></div><div class="stat ${sum("pending") ? "alert" : ""}"><strong>${money(sum("pending"))}</strong>waiting to be checked<small>${rows.filter((x) => x.status === "pending").length} gifts</small></div></div>` : "";
  main.innerHTML = `<div class="main-head"><h1>${r.label}</h1>${rows.length ? '<button class="btn btn-ghost" id="csv" type="button">Download CSV</button>' : ""}</div>
    ${totals}
    ${rows.length > 4 ? searchBox() : ""}
    <div class="table-wrap">${rows.length ? `<table><thead><tr>${r.columns.map((c) => `<th>${c[1]}</th>`).join("")}<th>Status</th><th></th></tr></thead><tbody>
    ${rows.map((row) => `<tr data-id="${esc(row.id)}">${r.columns.map(([f, l, fmt]) => `<td data-label="${esc(l)}">${fmt ? esc(fmt(row[f])) : esc(row[f] ?? "")}</td>`).join("")}
      <td data-label="Status"><select aria-label="Status" data-status>${r.statuses.map((s) => `<option ${s === row.status ? "selected" : ""}>${s}</option>`).join("")}</select></td>
      <td class="actions"><button class="btn btn-ghost btn-sm" data-view>View</button><button class="btn btn-sm btn-danger" data-del>Delete</button></td></tr>`).join("")}
    </tbody></table>` : `<p class="empty">Nothing here yet.</p>`}</div>`;
  bindSearch(main);
  const csv = document.getElementById("csv");
  if (csv) csv.onclick = () => downloadCsv(`ahatab-${key}-${new Date().toISOString().slice(0, 10)}.csv`, r.detail, rows);
  main.querySelectorAll("tr[data-id]").forEach((tr) => {
    const row = rows.find((x) => x.id === tr.dataset.id);
    tr.querySelector("[data-status]").onchange = async (e) => {
      const { error: err } = await sb.from(r.table).update({ status: e.target.value }).eq("id", row.id);
      if (err) return toast(err.message, true);
      toast("Status updated");
      refreshBadges();
    };
    tr.querySelector("[data-view]").onclick = async () => {
      dlg.innerHTML = `<div class="dlg-head"><h2>${r.label.replace(/s$/, "")} details</h2><button class="btn btn-ghost btn-sm" data-close type="button">Close</button></div>
        <div class="dlg-body detail"><dl>${r.detail.map(([f, l, fmt]) => (row[f] ? `<dt>${l}</dt><dd>${esc(fmt ? fmt(row[f]) : row[f])}</dd>` : "")).join("")}</dl>
        ${key === "donations" ? `<p class="muted" style="margin-top:1rem">Check that this Transaction ID and amount really arrived in your ${esc(row.method)} account before you confirm.</p><div class="dlg-actions"><button class="btn btn-danger" type="button" data-set="rejected">Reject</button><button class="btn btn-teal" type="button" data-set="verified">Confirm gift</button></div>` : ""}</div>`;
      dlg.showModal();
      dlg.querySelector("[data-close]").onclick = () => dlg.close();
      dlg.querySelectorAll("[data-set]").forEach((b) => (b.onclick = async () => {
        const { error: err } = await sb.from(r.table).update({ status: b.dataset.set }).eq("id", row.id);
        if (err) return toast(err.message, true);
        dlg.close();
        toast(b.dataset.set === "verified" ? "Gift confirmed" : "Gift rejected");
        route();
      }));
      if (row.status === NEW_STATUS[key] && key === "messages") {
        await sb.from(r.table).update({ status: "read" }).eq("id", row.id);
        row.status = "read";
        tr.querySelector("[data-status]").value = "read";
        refreshBadges();
      }
    };
    tr.querySelector("[data-del]").onclick = async () => {
      if (!confirm("Delete this entry? This can't be undone.")) return;
      const { error: err } = await sb.from(r.table).delete().eq("id", row.id);
      if (err) return toast(err.message, true);
      toast("Deleted");
      route();
    };
  });
}


/* ---------- search and CSV ---------- */
const searchBox = () => `<div class="searchbar"><label class="sr" for="q">Search</label><input id="q" type="search" placeholder="Search this list" autocomplete="off"></div>`;
function bindSearch(main) {
  const q = main.querySelector("#q");
  if (!q) return;
  q.addEventListener("input", () => {
    const term = q.value.trim().toLowerCase();
    let shown = 0;
    main.querySelectorAll("tbody tr").forEach((tr) => {
      const hit = !term || tr.textContent.toLowerCase().includes(term);
      tr.hidden = !hit;
      if (hit) shown++;
    });
    let none = main.querySelector(".no-match");
    if (!shown && !none) { none = document.createElement("p"); none.className = "empty no-match"; none.textContent = "No matches."; main.querySelector(".table-wrap").append(none); }
    if (shown && none) none.remove();
  });
}
// Values that start with = + - @ are prefixed so a spreadsheet never runs them as a formula.
const csvCell = (v) => {
  let t = String(v ?? "");
  if (/^[=+\-@\t\r]/.test(t)) t = "'" + t;
  return /[",\n\r]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
};
function downloadCsv(name, fields, rows) {
  const head = fields.map((f) => csvCell(f[1])).join(",");
  const body = rows.map((r) => fields.map(([k, , fmt]) => csvCell(fmt ? fmt(r[k]) : r[k])).join(",")).join("\n");
  const blob = new Blob(["\ufeff" + head + "\n" + body], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/* ---------- visitors ---------- */
const PAGE_NAMES = { home: "Home", about: "About us", programs: "What we do", news: "News", events: "Events", donate: "Donate", volunteer: "Volunteer", contact: "Contact" };
const DEVICE_NAMES = { mobile: "Phone", tablet: "Tablet", desktop: "Computer" };
const LANG_NAMES = { en: "English", bn: "বাংলা" };
function pageName(path) {
  const [file, query] = String(path).replace(/^\//, "").split("?");
  // older rows were saved as /index.html, /stories.html and so on
  const key = file.replace(/\.html$/, "").replace(/^index$/, "home").replace(/^stories$/, "news").replace(/^get-involved$/, "donate");
  const base = PAGE_NAMES[key] || key;
  return query ? `${base} (story)` : base;
}
const num = (n) => Number(n || 0).toLocaleString("en-IN");

function barList(items, nameOf = (k) => k) {
  const total = items.reduce((a, b) => a + b.n, 0) || 1;
  if (!items.length) return '<p class="muted">No data yet.</p>';
  return `<ul class="bars">${items.map((i) => `<li><span class="bars-name">${esc(nameOf(i.k))}</span><span class="bars-track"><span style="width:${Math.max(3, Math.round((i.n / total) * 100))}%"></span></span><span class="bars-n">${num(i.n)} <small>${Math.round((i.n / total) * 100)}%</small></span></li>`).join("")}</ul>`;
}

function dailyChart(daily) {
  const max = Math.max(1, ...daily.map((d) => d.views));
  const fmt = (d) => new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  const label = `Page views per day, ${fmt(daily[0].d)} to ${fmt(daily[daily.length - 1].d)}. Highest day: ${max}.`;
  return `<div class="chart" role="img" aria-label="${esc(label)}">
    <div class="chart-y"><span>${num(max)}</span><span>${num(Math.round(max / 2))}</span><span>0</span></div>
    <div class="chart-bars">${daily.map((d) => `<span class="chart-col" title="${esc(fmt(d.d))}: ${d.views} views, ${d.visitors} visitors"><i style="height:${(d.views / max) * 100}%"></i></span>`).join("")}</div>
    <div class="chart-x"><span>${esc(fmt(daily[0].d))}</span><span>${esc(fmt(daily[daily.length - 1].d))}</span></div>
  </div>`;
}

async function renderAnalytics(main, days = Number(sessionStorage.getItem("ahatab-range")) || 30) {
  const { data, error } = await sb.rpc("analytics_summary", { days });
  if (error) throw error;
  const a = data;
  const skip = !!localStorage.getItem("ahatab-no-track");
  main.innerHTML = `<div class="main-head"><h1>Visitors</h1>
      <div class="seg" role="group" aria-label="Time range">${[7, 30, 90].map((n) => `<button type="button" class="seg-btn" data-range="${n}" aria-pressed="${n === a.days}">${n} days</button>`).join("")}</div></div>
    <div class="stats">
      <div class="stat"><strong>${num(a.today.views)}</strong>page views today<small>${num(a.today.visitors)} visitors</small></div>
      <div class="stat"><strong>${num(a.totals.views)}</strong>page views, last ${a.days} days</div>
      <div class="stat"><strong>${num(a.totals.visitors)}</strong>unique visitors, last ${a.days} days</div>
      <div class="stat"><strong>${num(a.totals.sessions)}</strong>visits (sessions)<small>${a.totals.sessions ? (a.totals.views / a.totals.sessions).toFixed(1) : "0"} pages per visit</small></div>
    </div>
    <section class="panel-card"><h2>Page views per day</h2>${a.totals.views ? dailyChart(a.daily) : '<p class="muted">No visits recorded yet. They appear here as people open the website.</p>'}</section>
    <div class="grid-2">
      <section class="panel-card"><h2>Most viewed pages</h2>${a.pages.length ? `<div class="table-wrap flat"><table><thead><tr><th>Page</th><th>Views</th><th>Visitors</th></tr></thead><tbody>${a.pages.map((p) => `<tr><td data-label="Page">${esc(pageName(p.path))}</td><td data-label="Views">${num(p.views)}</td><td data-label="Visitors">${num(p.visitors)}</td></tr>`).join("")}</tbody></table></div>` : '<p class="muted">No data yet.</p>'}</section>
      <section class="panel-card"><h2>Devices</h2>${barList(a.devices, (k) => DEVICE_NAMES[k] || k)}<h2 class="mt">Language</h2>${barList(a.langs, (k) => LANG_NAMES[k] || k)}</section>
      <section class="panel-card"><h2>Where visitors come from</h2>${barList(a.referrers)}</section>
      <section class="panel-card"><h2>Latest visits</h2>${a.recent.length ? `<ul class="recent">${a.recent.map((r) => `<li><b>${esc(pageName(r.path))}</b><span>${esc(DEVICE_NAMES[r.device] || r.device)} · ${esc(LANG_NAMES[r.lang] || r.lang)} · ${esc(r.referrer)}</span><time>${esc(fmtWhen(r.created_at))}</time></li>`).join("")}</ul>` : '<p class="muted">No data yet.</p>'}</section>
    </div>
    <div class="note"><b>Privacy:</b> the website stores no IP addresses and sets no cookies. A random code kept in each visitor's own browser is used to count unique visitors, and visitors who turn on "Do Not Track" are not counted. Counts since you started: ${num(a.all_time)} page views.
      <label class="check" style="margin-top:.6rem"><input type="checkbox" id="no-track" ${skip ? "checked" : ""}><span>Don't count my own visits on this browser</span></label></div>`;
  main.querySelectorAll("[data-range]").forEach((b) => (b.onclick = () => { sessionStorage.setItem("ahatab-range", b.dataset.range); renderAnalytics(main, Number(b.dataset.range)).catch((e) => toast(e.message, true)); }));
  document.getElementById("no-track").onchange = (e) => {
    try { e.target.checked ? localStorage.setItem("ahatab-no-track", "1") : localStorage.removeItem("ahatab-no-track"); } catch {}
    toast(e.target.checked ? "Your visits on this browser are no longer counted" : "Your visits on this browser are counted again");
  };
}

/* ---------- settings ---------- */
const DEFAULTS = {
  general: { name_en: "Ahatab Foundation", name_bn: "আহতাব ফাউন্ডেশন", tagline_en: "", tagline_bn: "", location_en: "", location_bn: "", email: "", phone: "", facebook: "", founded: "2026" },
  impact: { show: false, people_helped: 0, families_supported: 0, volunteers: 0, projects: 0 },
  donate: { methods: [], note_en: "", note_bn: "" },
  images: {},
};

const IMAGE_LABELS = {
  hero: "Home page, top picture",
  intro: "Home page, introduction",
  children: "Home page, giving section",
  about: "About us page",
  programs: "Programs page",
  news: "News and stories page",
  events: "Events page",
  donate: "Donate page",
  volunteer: "Volunteer page",
  contact: "Contact page",
};

async function saveSetting(key, value) {
  const { error } = await sb.from("site_settings").upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) return toast(error.message, true);
  toast("Saved");
}

async function renderSettings(main) {
  const { data, error } = await sb.from("site_settings").select("key,value");
  if (error) throw error;
  const cur = JSON.parse(JSON.stringify(DEFAULTS));
  (data || []).forEach((r) => { cur[r.key] = { ...cur[r.key], ...r.value }; });
  const g = cur.general, im = cur.impact, d = cur.donate, imgs = cur.images || {};
  const inp = (form, name, label, val, type = "text") =>
    `<div class="field"><label for="${form}-${name}">${label}</label><input id="${form}-${name}" name="${name}" type="${type}" value="${esc(val ?? "")}"></div>`;

  main.innerHTML = `<div class="main-head"><h1>Settings</h1></div>
    <form class="settings-card form-grid" id="s-general" style="max-width:none">
      <h2>Organization and contact</h2>
      <div class="two">${inp("g", "name_en", "Name (English)", g.name_en)}${inp("g", "name_bn", "Name (বাংলা)", g.name_bn)}</div>
      <div class="two">${inp("g", "tagline_en", "Tagline (English)", g.tagline_en)}${inp("g", "tagline_bn", "Tagline (বাংলা)", g.tagline_bn)}</div>
      <div class="two">${inp("g", "location_en", "Location (English)", g.location_en)}${inp("g", "location_bn", "Location (বাংলা)", g.location_bn)}</div>
      <div class="two">${inp("g", "email", "Public email", g.email, "email")}${inp("g", "phone", "Public phone", g.phone, "tel")}</div>
      ${inp("g", "facebook", "Facebook page link", g.facebook, "url")}
      <div><button class="btn btn-teal" type="submit">Save details</button></div>
    </form>

    <form class="settings-card form-grid" id="s-impact" style="max-width:none">
      <h2>Impact numbers</h2>
      <p class="muted">Only enter numbers you can stand behind. They appear on the home page once switched on.</p>
      <div class="field check"><input type="checkbox" id="i-show" name="show" ${im.show ? "checked" : ""}><label for="i-show">Show impact numbers on the website</label></div>
      <div class="two">${inp("i", "people_helped", "People helped", im.people_helped, "number")}${inp("i", "families_supported", "Families supported", im.families_supported, "number")}</div>
      <div class="two">${inp("i", "volunteers", "Volunteers", im.volunteers, "number")}${inp("i", "projects", "Projects completed", im.projects, "number")}</div>
      <div><button class="btn btn-teal" type="submit">Save numbers</button></div>
    </form>

    <form class="settings-card form-grid" id="s-donate" style="max-width:none">
      <h2>Ways to give</h2>
      <p class="muted">Visitors pick one of these on the Donate page, send money to the number, then give you the Transaction ID. Only methods that are switched on and have a number are shown. Check each gift under Gifts against your real bKash, Nagad or bank account before you confirm it.</p>
      <div id="methods"></div>
      <div class="quick-add"><span class="muted">Quick add:</span> ${["bKash", "Nagad", "Rocket", "Upay"].map((n) => `<button class="btn btn-ghost btn-sm" type="button" data-quick="${n}">${n}</button>`).join("")}<button class="btn btn-ghost btn-sm" type="button" id="add-method">Other method</button></div>
      <div class="two">
        <div class="field"><label for="d-note_en">Message on the payment step (English)</label><textarea id="d-note_en" name="note_en" rows="3">${esc(d.note_en)}</textarea></div>
        <div class="field"><label for="d-note_bn">Message on the payment step (বাংলা)</label><textarea id="d-note_bn" name="note_bn" rows="3">${esc(d.note_bn)}</textarea></div>
      </div>
      <div><button class="btn btn-teal" type="submit">Save ways to give</button></div>
    </form>

    <form class="settings-card form-grid" id="s-images" style="max-width:none">
      <h2>Site pictures</h2>
      <p class="muted">Each page shows a built-in illustration until you add your own. Upload a photo (JPG, PNG or WebP, up to 5 MB) or paste a link. A wide photo works best. Only upload photos of people when they, or their guardians for children, have agreed to it.</p>
      <div class="pic-grid">${Object.keys(IMAGE_LABELS).map((k) => `<div class="pic-card" data-slot="${k}">
        <img src="${esc(safeUrl(imgs[k]) || defaultImage(k))}" alt="" data-no-fallback>
        <div class="pic-body">
          <strong>${IMAGE_LABELS[k]}</strong>
          <div class="field"><label for="p-${k}">Picture link (empty = built-in illustration)</label><input id="p-${k}" name="${k}" type="text" inputmode="url" autocomplete="off" placeholder="https://" value="${esc(imgs[k] || "")}"></div>
          <div class="pic-actions"><label class="btn btn-ghost btn-sm" for="pu-${k}">Upload photo</label><input id="pu-${k}" class="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp" data-up="${k}"><button class="btn btn-ghost btn-sm" type="button" data-reset="${k}">Use built-in</button></div>
        </div></div>`).join("")}</div>
      <div><button class="btn btn-teal" type="submit">Save pictures</button></div>
    </form>`;

  const picForm = document.getElementById("s-images");
  const setPic = (k, url) => {
    picForm.elements[k].value = url;
    picForm.querySelector(`.pic-card[data-slot="${k}"] img`).src = safeUrl(url) || defaultImage(k);
  };
  picForm.querySelectorAll("input[type=text]").forEach((el) => el.addEventListener("change", () => setPic(el.name, el.value.trim())));
  picForm.querySelectorAll("[data-reset]").forEach((b) => (b.onclick = () => setPic(b.dataset.reset, "")));
  picForm.querySelectorAll("[data-up]").forEach((input) => {
    input.onchange = async () => {
      const file = input.files[0];
      input.value = "";
      if (!file) return;
      if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return toast("Choose a JPG, PNG or WebP photo.", true);
      if (file.size > 5 * 1024 * 1024) return toast("Photo is over 5 MB. Choose a smaller one.", true);
      const k = input.dataset.up;
      const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
      const path = `site/${k}-${Date.now()}.${ext}`;
      toast("Uploading…");
      const { error } = await sb.storage.from("media").upload(path, file, { contentType: file.type });
      if (error) return toast(error.message, true);
      const { data } = sb.storage.from("media").getPublicUrl(path);
      setPic(k, data.publicUrl);
      toast("Photo uploaded. Press Save pictures to publish it.");
    };
  });
  picForm.onsubmit = (e) => {
    e.preventDefault();
    const out = {};
    for (const k of Object.keys(IMAGE_LABELS)) {
      const v = String(picForm.elements[k].value || "").trim();
      if (!v) continue;
      if (!safeUrl(v)) return toast(`${IMAGE_LABELS[k]}: the link must start with https://`, true);
      out[k] = v;
    }
    saveSetting("images", out);
  };

  document.getElementById("s-general").onsubmit = (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const out = { ...cur.general };
    ["name_en", "name_bn", "tagline_en", "tagline_bn", "location_en", "location_bn", "email", "phone", "facebook"].forEach((k) => { out[k] = String(f.get(k) || "").trim(); });
    if (out.facebook && !safeUrl(out.facebook)) return toast("The Facebook link must start with https://", true);
    saveSetting("general", out);
  };

  document.getElementById("s-impact").onsubmit = (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const num = (k) => Math.max(0, Math.floor(Number(f.get(k)) || 0));
    saveSetting("impact", { show: f.get("show") === "on", people_helped: num("people_helped"), families_supported: num("families_supported"), volunteers: num("volunteers"), projects: num("projects") });
  };

  const methods = Array.isArray(d.methods) ? d.methods.map((m) => ({ ...m })) : [];
  const box = document.getElementById("methods");
  const drawMethods = () => {
    box.innerHTML = methods.map((m, i) => `<div class="method-row">
      <div class="field"><label>Name</label><input data-i="${i}" data-k="name" placeholder="bKash personal" value="${esc(m.name)}"></div>
      <div class="field"><label>Number or account</label><input data-i="${i}" data-k="number" value="${esc(m.number)}"></div>
      <div class="field"><label>How to send</label><input data-i="${i}" data-k="note" placeholder="Send Money" value="${esc(m.note)}"></div>
      <label class="check method-on"><input type="checkbox" data-i="${i}" data-k="enabled" ${m.enabled === false ? "" : "checked"}><span>Show on Donate page</span></label>
      <button class="btn btn-ghost btn-sm" type="button" data-rm="${i}" aria-label="Remove method ${i + 1}">Remove</button></div>`).join("");
    box.querySelectorAll("input").forEach((el) => el.addEventListener("input", () => { methods[el.dataset.i][el.dataset.k] = el.type === "checkbox" ? el.checked : el.value; }));
    box.querySelectorAll("[data-rm]").forEach((b) => (b.onclick = () => { methods.splice(Number(b.dataset.rm), 1); drawMethods(); }));
  };
  drawMethods();
  document.getElementById("add-method").onclick = () => { methods.push({ name: "", number: "", note: "", enabled: true }); drawMethods(); };
  document.querySelectorAll("[data-quick]").forEach((b) => (b.onclick = () => { methods.push({ name: b.dataset.quick, number: "", note: "Send Money", enabled: true }); drawMethods(); box.querySelector(`[data-i="${methods.length - 1}"][data-k="number"]`)?.focus(); }));
  document.getElementById("s-donate").onsubmit = (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    saveSetting("donate", {
      methods: methods.filter((m) => m.name.trim()).map((m) => ({ name: m.name.trim(), number: (m.number || "").trim(), note: (m.note || "").trim(), enabled: m.enabled !== false })),
      note_en: String(f.get("note_en") || "").trim(),
      note_bn: String(f.get("note_bn") || "").trim(),
    });
  };
}

sb.auth.onAuthStateChange((event) => { if (event === "SIGNED_OUT") renderLogin(); });
boot();
