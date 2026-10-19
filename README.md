# tej-clone

> **Unofficial reproduction of [tej.as](https://tej.as) for study purposes — NOT the
> site owner's official website.** Not affiliated with or endorsed by Tejas Kumar.
> Long-form prose is either a verified excerpt from his public feeds or a clearly
> labeled placeholder; nothing is presented as his writing unless verified.
> Photos and artwork are documented substitutes (see `_docs/asset-provenance.md`).

A from-scratch rebuild of the tej.as homepage and content architecture with
**Astro 7 + SolidJS islands**, based on ~45 evidence screenshots and the site's
public machine-readable feeds (sitemap.xml, RSS, llms.txt), captured 2026-10-15/16.

- **169 routes** — 13 top-level pages, `/demos/tavus`, 31 blog posts,
  26 talk transcripts, 98 podcast episodes (see `_docs/route-coverage-report.md`)
- **3D cover-flow** — 85 talks, scroll-snap + JS-driven 3D transforms, CSS
  scroll-driven fallback for the no-JS path, `prefers-reduced-motion` aware
- **Ask widget** — SolidJS island (`client:visible`) with a local search adapter;
  never calls the real `/api/askPodcast`, never fabricates quotes
- **Light/dark themes** — blocking init script (`localStorage` → OS → dark),
  no flash of wrong theme; toggle label flips LIGHT ↔ DARK
- **Native popover** "More" menu, mobile bottom-pill navigation, skip link,
  labeled Ask input, `rel="noopener noreferrer"` on external blank links
- **Responsive** 320 → 1440px; **no analytics, no tracking pixels, no calls to
  the production backend** (local no-op adapters only)

## Quick start

```bash
cd ~/workspace/tej-clone
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/ (170 pages: 169 routes + 404)
npm run preview
```

Node 18+ and the Playwright Chromium in `~/.cache/ms-playwright` are enough;
no other system dependencies.

## Layout

| Path | Contents |
|---|---|
| `src/pages/` | 13 top-level pages, `demos/tavus`, `[slug]` templates (blog/talks/episodes), `rss.xml.js`, `llms.txt.js`, `robots.txt.js`, `404.astro` |
| `src/components/` | `Topbar.astro`, `Footer.astro`, `CoverFlow.astro` |
| `src/islands/` | `AskWidget.tsx` (SolidJS, `client:visible`) |
| `src/layouts/` | `Base.astro` (head, blocking theme script, JSON-LD, shared chrome) |
| `src/scripts/` | `coverflow.ts` (vanilla JS 3D driver) |
| `src/styles/` | `global.css` (design tokens, 8 keyframes, type utilities, grain) |
| `src/data/` | `content.json` (verified titles/metadata: 85/26/98/31) |
| `public/fonts/` | 8 self-hosted woff2 files |
| `public/img/` | `tejas-hero.png` (documented substitute, transparent cutout) |
| `_docs/` | digest, provenance, progress, and all test/coverage reports |

## Docs

- `_docs/implementation-digest.md` — analysis of the 13 evidence documents
- `_docs/route-coverage-report.md` — 169/169 routes vs the real sitemap
- `_docs/screenshot-comparison-report.md` — visual diffs vs evidence screenshots
- `_docs/interaction-test-report.md` — behavior tests + console-error log
- `_docs/evidence-and-limitations.md` — gaps, unverified assumptions, incidents
- `_docs/asset-provenance.md` — where every image came from
- `_docs/PROGRESS.md` — build progress record

## Honesty notes

- Not pixel-perfect — see the screenshot comparison report for documented diffs.
- Testimonials, book cover, calendar entries, status data, and full article bodies
  are labeled placeholders; that content was not in the evidence package.
- No PostHog/Sentry calls, no `/nothing.png` tracking pixel, no `/api/*` routes.
