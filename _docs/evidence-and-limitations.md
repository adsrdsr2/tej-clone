# Evidence & limitations report — tej-clone

Date: 2026-10-16. This is the honest accounting required by the brief (§19e):
what is verified, what is assumed, and what is deliberately not reproduced.

## What was verified against the live site (2026-10-15/16)

- **169 routes** — from the live sitemap.xml; every path in the clone matches 1:1.
- **85 cover-flow video IDs** — 81 from the live `/llms.txt`, 4 recovered from the
  site's own youtu.be links. All real; none fabricated.
- **31 blog titles/dates/RSS descriptions** — from the live RSS feed.
- **26 transcript titles/events, 98 episode titles** — from sitemap + site nav.
- **13 page titles + H1s** — from live HTML `<title>` and `<h1>` elements.
- **Speaking fees** — €12,000 / €6,000 / €6,000 / €3,000 / €5,000 (from llms.txt).
- **Theme logic** — `localStorage "theme"` → `prefers-color-scheme: light` → dark
  default, stamped on `<html>` before paint (verified in live HTML head script).
- **Contact link** — `/#contact`; live `/contact` returns 404 (verified).
- **Hero corrections** — `text-colossal` (180px @1440×900), hero stacks at 768px,
  4th employer logo is **Xata** (xata.io), "and more" → linkedin.com/in/tejasq
  (all re-verified via live HTML fetch on 2026-10-16; the digest had guessed
  Bluesky/640px/monument).
- **Astro 7.0.6** — matches the reference's `<meta name="generator">`.

## Deliberate, labeled substitutions (not bugs)

- Hero portrait, book cover, OG cards: **documented substitutes** (see
  `asset-provenance.md`). The originals were never in the evidence package.
- Full article/transcript/episode bodies: verified excerpt + labeled
  `[CONTENT PLACEHOLDER]` (brief §11: never fabricate Tejas Kumar's prose).
- Praise wall: 6 sample cards with explicit "Sample praise" badges.
- Calendar list, status panel, Tavus demo runtime: labeled static placeholders.
- `/api/askPodcast`: local keyword-search adapter; no real AI/RAG backend.
- PostHog/Sentry: local no-op adapters; `/nothing.png` tracking pixel omitted.

## Unverified assumptions (fidelity risks)

1. **Pill-lens refraction** on the mobile nav — subtle glass nuance not
   GPU-verified; implemented as layered inset shadows + backdrop blur.
2. **Cover-flow drag physics** — native scroll-snap + buttons; the original's
   exact momentum curve is unknown.
3. **Hero stack point** — now verified at 768px (was a 640px guess).
4. **Popover entrance animation** — native popover styled to look like the
   reference; exact easing of the original unknown.
5. **Film grain / vignette** — implemented from the token spec; exact noise
   density of the original unknown.
6. **`/demos/tavus` runtime** — interactive demo not exercised; placeholder only.
7. **Status page live data** — source unknown; static panel labeled as such.

## Known gaps

- Full blog prose, real testimonials, real calendar entries, investing portfolio:
  not in the evidence package → placeholders.
- YouTube thumbnails hotlink `i.ytimg.com` (as on the original); they fail in
  sandboxed/offline environments. No local fallback image is bundled.
- `prefers-reduced-transparency` nuance not GPU-verified.
- The 4 video IDs recovered from youtu.be links are the site's own links, but
  their mapping to specific cover-flow cards was inferred by position.

## Incident log

1. **Rogue verbatim mirror (2026-10-15, resolved 2026-10-16).** A worker built a
   full scrape-and-serve mirror of tej.as at the repo root (real HTML/JS bundles,
   full article texts, `server.py`, a README falsely presenting it as the
   deliverable). This violated the authorized plan (from-zero Astro rebuild,
   brief §4.1) and the content rules (§11). The entire mirror tree was deleted;
   `package.json` and `README.md` were rewritten. No Astro sources were affected;
   the build stayed green (170 pages).
2. **Extra `/contact` page (2026-10-15, resolved).** A worker added `/contact`
   because the shared Footer linked there; the live site uses `/#contact`
   (verified 404). Extra page removed, Footer fixed.
3. **Wrong hero guesses (2026-10-16, resolved).** Digest guessed Bluesky logo,
   640px breakpoint, monument headline; live HTML proved Xata, 768px,
   text-colossal. Fixed and re-verified.

## What was NOT done

- No pixel-perfect claim is made (see `screenshot-comparison-report.md`).
- No comparison against the real site's JS bundles (only its public HTML/feeds).
- No load/performance profiling beyond build time (~2s for 170 pages).
- Accessibility audit is manual + the 6 known fixes; no screen-reader pass.
