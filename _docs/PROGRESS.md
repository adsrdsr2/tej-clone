# tej-clone — progress record

## Done
- [x] Phases 1–17 executed via 6 workers + coordinator fixes
- [x] Foundation: digest, content.json (85/26/98/31 → 169 routes), Astro 7.0.6 + SolidJS, 8 fonts, global.css tokens, Base/Topbar/Footer, hero cutout, favicon, asset-provenance.md
- [x] CoverFlow 3D (85 cards, JS driver + no-JS scroll-driven fallback, reduced-motion)
- [x] Homepage (6 sections; hero corrections verified vs live HTML: text-colossal, 768px breakpoint, Xata logo)
- [x] Content pages: 13 top-level + demos/tavus + 31 blog + 26 talks + 98 episodes + rss.xml/llms.txt/robots/404 — build green, 170 pages
- [x] AskWidget SolidJS island (local search, no fabricated quotes)
- [x] Visual tests: 44 screenshots; interaction tests **29/29 pass**, 0 JS console errors
- [x] Post-test fixes (all re-verified): coverflow header left-aligned + rectangular CTA, removed extra home icon, mobile logo row single-line
- [x] Deliverables: README (unofficial notice), route-coverage, screenshot-comparison, interaction-test, evidence-and-limitations reports

## Still to do
- (Optional polish, not blocking) Pixel-level typography/whitespace review of top-level pages beyond the homepage; screen-reader pass; performance profiling.

## Blockers
- None. All real blockers resolved (mirror incident, /contact, hero guesses).
- [x] Phase 1–4: brief read, implementation digest (`_docs/implementation-digest.md`), content dataset (`src/data/content.json`: 85/26/98/31, 169 routes), stack install (Astro 7.0.6 + solid-js), fonts (8 woff2), `global.css` (tokens, 8 keyframes, grain, reduced-motion), `Base.astro` (blocking theme script, JSON-LD, OG), `Topbar.astro` (popover More + pill nav), `Footer.astro`, favicon, hero cutout (`public/img/tejas-hero.png`, documented substitute), `_docs/asset-provenance.md`
- [x] Bug found & fixed: Contact link is `/#contact` (live check: `/contact` 404s)
- [x] AskWidget.tsx built by worker (SolidJS island, local keyword search + simulated streaming, no fabricated quotes; `npx astro build` green, `tsc --noEmit` clean). Not yet mounted — homepage agent mounts it.

## In flight (4 build workers)
1. CoverFlow (3D carousel, CSS+JS, reduced-motion) → `src/components/CoverFlow.astro`, `src/scripts/coverflow.ts` — build green; known limitation: perspective() inlined in card transforms because scroll containers flatten preserve-3d
2. Homepage → `src/pages/index.astro` (6 sections)
3. Content pages → 13 top-level + `/demos/tavus` + 31 blog + 26 talks + 98 episode routes + rss.xml/llms.txt/robots/404 — `npx astro build` green (169 routes + endpoints)
   - Correction applied by coordinator: worker added an extra `/contact` page because Footer linked to `/contact`; live check confirmed the real site uses `/#contact` (and real `/contact` 404s), so extra page deleted and Footer fixed to `/#contact`. Route count back to exactly 169.
4. ~~AskWidget~~ done

## Incident (2026-10-16, resolved)
- A **verbatim scrape mirror** of tej.as was found at the repo root (root index.html,
  `_astro/` bundles, full article HTML, scraped images, `server.py`, `postprocess.py`,
  `tests/visual/`, rogue README/package.json scripts) — built outside the authorized
  plan (build-from-zero with Astro, brief §4.1/§11). It vendored the site's actual JS
  bundles and full article texts, contradicting the brief's content rules, and its
  README falsely described it as the deliverable.
- **Action:** entire mirror tree deleted; package.json scripts and README rewritten
  to describe the real Astro rebuild. No Astro sources were affected. Documented in
  `evidence-and-limitations.md`.

## Still to do
- Full `npx astro build` after all workers land; fix integration errors
- Playwright visual tests at 1440/1280/768/390/320 vs evidence screenshots; fix or document diffs
- Interaction tests (theme toggle, popover, pill, carousel, Ask widget, copy-link); console-error log check
- Deliverables: README (unofficial-reproduction notice), route-coverage report, screenshot-comparison report (local screenshots in a named folder), interaction-test report, evidence & limitations report
- Final honest report to parent

## Blockers
- None yet. Long Tejas Kumar prose: verified excerpts + documented placeholders only (per brief §11).
