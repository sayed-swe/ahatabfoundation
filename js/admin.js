import { sb } from "./supa.js";
import { esc, safeUrl, ICON_NAMES } from "./ui.js";

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
  ["overview", "Overview"], ["programs", "Programs"], ["stories", "Stories"], ["events", "Events"],
  ["donations", "Gifts"], ["volunteers", "Volunteers"], ["messages", "Messages"], ["settings", "Settings"],
];

async function renderShell() {
  app.innerHTML = `<div class="shell">
    <aside class="side">
      <div class="name">Ahatab Foundation</div>
      <nav id="nav" aria-label="Admin"></nav>
      <div class="foot"><a href="../index.html">View public site</a><span>${esc(state.user.email)}</span><button class="link-btn" id="out">Sign out</button></div>
    </aside>
    <main class="main" id="main"></main></div>`;
  document.getElementById("out").onclick = signOut;
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
  const main = document.getElementById("main");
  main.innerHTML = '<p class="muted">Loading…</p>';
  try {
    if (view === "overview") await renderOverview(main);
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
      const el = document.querySelector(`[data-badge="${k}"]`);
      if (el) { el.textContent = n; el.hidden = n === 0; }
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
  const card = (href, n, label, alert) => `<a class="stat ${alert && n ? "alert" : ""}" href="#/${href}"><strong>${n}</strong>${label}</a>`;
  main.innerHTML = `<div class="main-head"><h1>Overview</h1></div>
    <div class="stats">
      ${card("donations", d, "gifts waiting to be confirmed", true)}
      ${card("volunteers", v, "new volunteers", true)}
      ${card("messages", m, "unread messages", true)}
      ${card("programs", p, "programs on the website")}
      ${card("stories", s, "published stories")}
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
    <div class="table-wrap">${rows.length ? `<table><thead><tr>${r.columns.map((c) => `<th>${c[1]}</th>`).join("")}<th></th></tr></thead><tbody>
      ${rows.map((row) => `<tr data-id="${esc(row.id)}">${r.columns.map(([f, , fmt]) => `<td>${fmt ? fmt(row[f]) : esc(row[f] ?? "")}</td>`).join("")}
        <td class="actions"><button class="btn btn-ghost btn-sm" data-edit>Edit</button><button class="btn btn-sm btn-danger" data-del>Delete</button></td></tr>`).join("")}
      </tbody></table>` : `<p class="empty">Nothing here yet. Add your first ${r.one}.</p>`}</div>`;
  document.getElementById("add").onclick = () => openForm(key, null);
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
      <img alt="" ${safeUrl(v) ? `src="${esc(v)}"` : "hidden"} data-preview="${f.name}"></div>`;
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
  main.innerHTML = `<div class="main-head"><h1>${r.label}</h1></div>
    <div class="table-wrap">${rows.length ? `<table><thead><tr>${r.columns.map((c) => `<th>${c[1]}</th>`).join("")}<th>Status</th><th></th></tr></thead><tbody>
    ${rows.map((row) => `<tr data-id="${esc(row.id)}">${r.columns.map(([f, , fmt]) => `<td>${fmt ? esc(fmt(row[f])) : esc(row[f] ?? "")}</td>`).join("")}
      <td><select aria-label="Status" data-status>${r.statuses.map((s) => `<option ${s === row.status ? "selected" : ""}>${s}</option>`).join("")}</select></td>
      <td class="actions"><button class="btn btn-ghost btn-sm" data-view>View</button><button class="btn btn-sm btn-danger" data-del>Delete</button></td></tr>`).join("")}
    </tbody></table>` : `<p class="empty">Nothing here yet.</p>`}</div>`;
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
        <div class="dlg-body detail"><dl>${r.detail.map(([f, l, fmt]) => (row[f] ? `<dt>${l}</dt><dd>${esc(fmt ? fmt(row[f]) : row[f])}</dd>` : "")).join("")}</dl></div>`;
      dlg.showModal();
      dlg.querySelector("[data-close]").onclick = () => dlg.close();
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

/* ---------- settings ---------- */
const DEFAULTS = {
  general: { name_en: "Ahatab Foundation", name_bn: "আহতাব ফাউন্ডেশন", tagline_en: "", tagline_bn: "", location_en: "", location_bn: "", email: "", phone: "", facebook: "", founded: "2026" },
  impact: { show: false, people_helped: 0, families_supported: 0, volunteers: 0, projects: 0 },
  donate: { methods: [], note_en: "", note_bn: "" },
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
  const g = cur.general, im = cur.impact, d = cur.donate;
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
      <p class="muted">Add bank or mobile banking details. Visitors see these on the Get involved page.</p>
      <div id="methods"></div>
      <div><button class="btn btn-ghost btn-sm" type="button" id="add-method">Add a payment method</button></div>
      <div class="two">
        <div class="field"><label for="d-note_en">Message above the form (English)</label><textarea id="d-note_en" name="note_en" rows="3">${esc(d.note_en)}</textarea></div>
        <div class="field"><label for="d-note_bn">Message above the form (বাংলা)</label><textarea id="d-note_bn" name="note_bn" rows="3">${esc(d.note_bn)}</textarea></div>
      </div>
      <div><button class="btn btn-teal" type="submit">Save ways to give</button></div>
    </form>`;

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
      <div class="field"><label>Note</label><input data-i="${i}" data-k="note" placeholder="Send Money" value="${esc(m.note)}"></div>
      <button class="btn btn-ghost btn-sm" type="button" data-rm="${i}" aria-label="Remove method ${i + 1}">Remove</button></div>`).join("");
    box.querySelectorAll("input").forEach((el) => el.addEventListener("input", () => { methods[el.dataset.i][el.dataset.k] = el.value; }));
    box.querySelectorAll("[data-rm]").forEach((b) => (b.onclick = () => { methods.splice(Number(b.dataset.rm), 1); drawMethods(); }));
  };
  drawMethods();
  document.getElementById("add-method").onclick = () => { methods.push({ name: "", number: "", note: "" }); drawMethods(); };
  document.getElementById("s-donate").onsubmit = (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    saveSetting("donate", {
      methods: methods.filter((m) => m.name.trim()).map((m) => ({ name: m.name.trim(), number: (m.number || "").trim(), note: (m.note || "").trim() })),
      note_en: String(f.get("note_en") || "").trim(),
      note_bn: String(f.get("note_bn") || "").trim(),
    });
  };
}

sb.auth.onAuthStateChange((event) => { if (event === "SIGNED_OUT") renderLogin(); });
boot();
