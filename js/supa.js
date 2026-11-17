import { SUPABASE_URL, SUPABASE_KEY } from "./config.js";

// The Supabase library is a sizeable download from a CDN. Public pages must not wait for it before
// they show the header and hero, so it loads in the background and `sb` is a thin stand-in that replays
// a call (for example sb.from("programs").select("*").eq(...)) once the real client is ready.
// Public code only ever awaits those calls. The admin area uses loadClient() to get the real client.
let real;
const loading = import("https://esm.sh/@supabase/supabase-js@2").then(({ createClient }) => {
  real = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: true, autoRefreshToken: true } });
  return real;
});
export const loadClient = () => loading;

function replay(steps) {
  let parent = real;
  let value = real;
  for (const s of steps) {
    if ("get" in s) { parent = value; value = value[s.get]; }
    else { value = value.apply(parent, s.call); parent = value; }
  }
  return value;
}

function chain(steps) {
  return new Proxy(function () {}, {
    get(_, prop) {
      if (prop === "then") {
        const run = loading.then(() => replay(steps));
        return run.then.bind(run);
      }
      return chain([...steps, { get: prop }]);
    },
    apply(_, __, args) { return chain([...steps, { call: args }]); },
  });
}

export const sb = chain([]);
