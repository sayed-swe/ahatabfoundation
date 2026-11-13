import { sb } from "./supa.js";

const EMPTY = { general: {}, impact: {}, donate: {} };
let settingsPromise;

// Cached per page load; public pages read the same settings for footer, hero and forms.
export function getSettings() {
  settingsPromise ??= (async () => {
    try {
      const { data, error } = await sb.from("site_settings").select("key,value");
      if (error) throw error;
      const out = { ...EMPTY };
      (data || []).forEach((r) => { out[r.key] = r.value; });
      return out;
    } catch (err) {
      console.error(err);
      return { ...EMPTY };
    }
  })();
  return settingsPromise;
}

async function run(query) {
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export const listPrograms = (limit) => {
  let q = sb.from("programs").select("*").eq("published", true).order("sort").order("created_at");
  if (limit) q = q.limit(limit);
  return run(q);
};

export const listStories = (limit) => {
  let q = sb.from("stories").select("*").eq("published", true).lte("published_at", new Date().toISOString()).order("published_at", { ascending: false });
  if (limit) q = q.limit(limit);
  return run(q);
};

export async function getStory(slug) {
  const rows = await run(
    sb.from("stories").select("*").eq("slug", slug).eq("published", true).lte("published_at", new Date().toISOString()).limit(1)
  );
  return rows[0] || null;
}

export const listEvents = (limit) => {
  // Show events from the start of today, so an event is still listed on its own day.
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  let q = sb.from("events").select("*").eq("published", true).gte("starts_at", start.toISOString()).order("starts_at");
  if (limit) q = q.limit(limit);
  return run(q);
};
