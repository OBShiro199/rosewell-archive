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

The six forms on the page share one state. `onJoin()` validates name + email, then
POSTs form-encoded to a Zapier catch hook, which appends a row in Google Sheets.

Fields sent: `name`, `email`, `source`, `page`, `referrer`, `submitted_at`.

The hook URL lives in `this.WEBHOOK` at the top of the component. It is public by
design (the browser calls it) and accepts writes only — the tradeoff is that it can
be spammed, so add a honeypot or Turnstile if that becomes a problem.

To change destinations, edit `this.WEBHOOK` in `index.html` **and**
`Rosewell Archive.dc.html` (see Files below).
