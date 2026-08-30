# Rosewell Archive

Waitlist landing page for the Rosewell Archive — a private vault of B2B leads, unreleased SaaS footage, cold call scripts and landing page templates for solo founders.

## Deploy

`dist/index.html` is fully self-contained (fonts, images and scripts inlined). Any static host works:

- **GitHub Pages** — copy `dist/index.html` to the repo root as `index.html`, then enable Pages on `main`.
- **Vercel / Netlify** — point the project at `dist/` with no build command.

## Files

| Path | What it is |
| --- | --- |
| `dist/index.html` | Standalone production page. Deploy this. |
| `Rosewell Archive.dc.html` | Editable source (Design Component). |
| `support.js` | Runtime required by the source file. |
| `assets/logo.png` | Pixel-folder logo. |
| `assets/avatars/` | Reviewer profile photos. |

## Waitlist form

The six forms on the page share one state and currently validate name + email client-side only. To capture signups, wire `onJoin()` in the source file to your endpoint (Formspark, Loops, Resend, etc.).
