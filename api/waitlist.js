// Serverless proxy: browser -> here -> Make.com webhook.
//
// The Make hook requires an x-make-apikey header. The page is public, so the
// key can't live in it; it lives in Vercel's env instead and only ever leaves
// from this function. The browser posts same-origin to /api/waitlist, which
// also means CORS never enters the picture.
//
// Required env vars (Vercel > Settings > Environment Variables):
//   MAKE_WEBHOOK_URL  e.g. https://hook.eu2.make.com/xxxxxxxx
//   MAKE_API_KEY      the webhook's API key

const FIELDS = ["name", "email", "source", "page", "referrer", "submitted_at"];
const MAX_LEN = 500;

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method not allowed" });
  }

  const hook = process.env.MAKE_WEBHOOK_URL;
  const key = process.env.MAKE_API_KEY;
  if (!hook || !key) {
    // Don't say which one is missing — this response is public.
    console.error("waitlist: missing MAKE_WEBHOOK_URL or MAKE_API_KEY");
    return res.status(500).json({ error: "not configured" });
  }

  // Vercel parses form-encoded and JSON bodies into an object for us.
  const src = typeof req.body === "object" && req.body ? req.body : {};
  const name = String(src.name || "").trim();
  const email = String(src.email || "").trim();

  // Re-validate here: the client checks are for UX, not trust.
  if (!name) return res.status(400).json({ error: "name required" });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return res.status(400).json({ error: "valid email required" });
  }

  const body = new URLSearchParams();
  for (const f of FIELDS) {
    body.set(f, String(src[f] == null ? "" : src[f]).slice(0, MAX_LEN));
  }
  body.set("name", name.slice(0, MAX_LEN));
  body.set("email", email.slice(0, MAX_LEN));
  // Trust the edge for this one rather than the client.
  body.set("ip", req.headers["x-forwarded-for"] || "");

  try {
    const r = await fetch(hook, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-make-apikey": key
      },
      body
    });

    if (!r.ok) {
      const detail = (await r.text().catch(() => "")).slice(0, 200);
      console.error("waitlist: make returned", r.status, detail);
      // 410 = scenario switched off, 401 = bad key. Both are our problem.
      return res.status(502).json({ error: "upstream rejected the signup" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("waitlist: fetch failed", err && err.message);
    return res.status(502).json({ error: "could not reach upstream" });
  }
};
