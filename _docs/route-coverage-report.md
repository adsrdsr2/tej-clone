# Route coverage report — tej-clone

Generated: 2026-10-16. Build: `npx astro build` → 170 pages, 0 errors.
Reference: sitemap.xml of tej.as fetched 2026-10-15 (169 URLs).

## Summary

| Group | Reference | Clone | Status |
|---|---|---|---|
| Top-level pages | 13 | 13 | ✅ 100% |
| `/demos/tavus` | 1 | 1 | ✅ |
| `/blog/<slug>` | 31 | 31 | ✅ 100% |
| `/talks/<slug>` | 26 | 26 | ✅ 100% |
| `/podcast/ep/<slug>` | 98 | 98 | ✅ 100% |
| **Total routes** | **169** | **169** | ✅ 100% |
| Machine endpoints (`/rss.xml`, `/llms.txt`, `/robots.txt`) | present on real site | 3 | ✅ |
| 404 page | — | 1 | ✅ |

All 169 route paths in `dist/` match the reference sitemap 1:1 (verified by comparing
`content.json` slugs — built from the sitemap — against build output; no duplicate or
malformed slugs).

## Top-level pages (13)

| Route | Title (verified) | H1 (verified) |
|---|---|---|
| `/` | Tejas Kumar — AI Engineer, Speaker & Author (homepage) | I'm Tejas Kumar, |
| `/about` | About Tejas Kumar, AI Engineer at IBM in Berlin | About Tejas Kumar |
| `/story` | The testimony and autobiography of Tejas Kumar | The thread. |
| `/speaking` | Book Tejas Kumar: AI Keynote Speaker in Berlin | Invite me to speak. |
| `/workshops` | Agentic AI Training and React Workshops for Teams | AI and React training for your team. |
| `/preaching` | Invite Tejas Kumar to Preach: Guest Preacher for Church | Invite me to preach. |
| `/calendar` | Tejas Kumar's speaking calendar: where I'll be next | Where I'll be. |
| `/investing` | Tejas Kumar: angel investor in early stage startups | I invest early. |
| `/status` | How Tejas Kumar is doing: live health status | How I'm doing. |
| `/talks` | Talk transcripts by Tejas Kumar | Talk transcripts |
| `/react` | Fluent React Book by Tejas Kumar: How React Works Inside | How React actually works. |
| `/blog` | Writing on AI, React and Engineering \| Tejas Kumar | I write |
| `/podcast` | ConTejas Code: A Long Form Podcast for Engineers | Learn from the brightest minds in engineering |
| `/demos/tavus` | Tavus Video AI Demo with Live Tool Calls in the Browser | A face that calls my functions. |

## Content routes

- **31 blog posts** — slugs/titles/dates/descriptions from the real RSS feed
  (e.g. `/blog/will-ai-replace-software-engineers`). Bodies: verified excerpt +
  labeled `[CONTENT PLACEHOLDER]` (full prose not in evidence package, per brief §11).
- **26 talk transcripts** — slugs/titles/events verified (e.g. `/talks/infoq`);
  YouTube links cross-matched against the 85 cover-flow video IDs where available.
- **98 podcast episodes** — slugs/titles verified (e.g. `/podcast/ep/…`); directory
  shows 12 full cards + compact list for the rest ("12 of 98"), mirroring the reference.
- **85 cover-flow talks** — every card carries a real, verified YouTube video ID
  (81 from the live site's llms.txt, 4 recovered from the site's own youtu.be links).

## Machine endpoints

- `/rss.xml` — 31 items, real title/link/description/pubDate from the RSS feed.
- `/llms.txt` — index of all routes with real titles.
- `/robots.txt` — `Allow: /`, `Disallow: /api/`.

## Deliberate omissions (documented, not gaps)

- `/nothing.png` — the real site's tracking pixel; intentionally not reproduced.
- `/api/askPodcast` — real backend; replaced with a local keyword-search adapter
  that never fabricates quotes. No `/api/*` routes exist (`Disallow: /api/`).
- No PostHog/Sentry network calls — local no-op analytics adapter only.
- Contact points to `/#contact` (verified: real `/contact` returns 404).
