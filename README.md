# Rosewell Archive

Waitlist landing page for the Rosewell Archive — a private vault of B2B leads, unreleased SaaS footage, cold call scripts and landing page templates for solo founders.

## Deploy

`dist/index.html` is fully self-contained (fonts, images and scripts inlined). Any static host works:

`index.html` at the repo root is the page, with `support.js` and `assets/` beside it.

- **Vercel / Netlify** — connect the repo, no build command, output directory = root.
- **GitHub Pages** — enable Pages on `main` / root.

Note: `dist/index.html` is a stale, broken export (its images and script point at
unresolved UUIDs). Do not deploy it.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | The deployed page. Static hosts serve this from the repo root. |
| `Rosewell Archive.dc.html` | Editable source (Design Component). Copy to `index.html` after editing. |
| `support.js` | Runtime required by the source file. |
| `assets/logo.png` | Pixel-folder logo. |
| `assets/avatars/` | Reviewer profile photos. |

## Waitlist form

The six forms on the page share one state. `onJoin()` validates name + email,
then POSTs form-encoded to `/api/waitlist` (same origin), which forwards to a
Make.com webhook that appends a row in Google Sheets.

Fields sent: `name`, `email`, `source`, `page`, `referrer`, `submitted_at`,
plus `ip` added server-side.

### Why the proxy

The Make webhook requires an `x-make-apikey` header. This page is public, so the
key cannot live in it — anyone could read it in the page source. `api/waitlist.js`
holds it in Vercel's environment instead. As a side benefit the browser request is
same-origin, so CORS never applies.

### Required environment variables

Set these in **Vercel > Settings > Environment Variables**, then redeploy:

| Name | Value |
| --- | --- |
| `MAKE_WEBHOOK_URL` | `https://hook.eu2.make.com/<your-hook-id>` |
| `MAKE_API_KEY` | The webhook's API key |

Never commit these. Without them the endpoint returns `500 not configured`.

### Responses

| Status | Meaning |
| --- | --- |
| `200` | Signup forwarded to Make |
| `400` | Name missing or email invalid |
| `405` | Non-POST request |
| `500` | Env vars not set |
| `502` | Make rejected it — usually the scenario is switched off (410) or the key is wrong (401) |
