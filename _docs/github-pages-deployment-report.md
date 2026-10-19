# GitHub Pages deployment — test report (2026-10-19)

Conversion of the existing tej.as clone to a GitHub-Pages-deployable static
site, per the deployment mission brief. No redesign; source of truth was the
existing code.

## Environment

- Repo: `adsrdsr2/tej-clone` (private), branch `main`, commit `661e6d8` (+ this change)
- Local: Node 24, npm (package-lock.json), Astro 7.0.6, SolidJS
- CI (workflow): `ubuntu-latest`, Node 22, `npm ci`

## Checks that PASSED

| # | Check | Result |
|---|-------|--------|
| 1 | `npm run build` (local, base `/`) | ✅ 170 pages, no errors |
| 2 | Pages-simulated build (`GITHUB_ACTIONS=true GITHUB_REPOSITORY=adsrdsr2/tej-clone`) | ✅ 170 pages, no errors |
| 3 | Base paths in Pages build | ✅ all internal `href`/`src` under `/tej-clone/`; zero root-absolute strays, zero `//` double-slash links, zero broken `tej-cloneX` joins |
| 4 | Internal link integrity (Pages build) | ✅ 194/194 internal links resolve to a file in `dist/` |
| 5 | `dist/404.html` exists | ✅ GitHub Pages serves it for unknown paths |
| 6 | Nested routes directly openable | ✅ `dist/blog/<slug>/index.html`, `dist/talks/<slug>/index.html`, `dist/podcast/ep/<slug>/index.html` all generated |
| 7 | RSS feed | ✅ 31 items, links use deployed site URL |
| 8 | `llms.txt`, `robots.txt` | ✅ generated, URLs use deployed site URL |
| 9 | Canonical + Open Graph URLs | ✅ absolute, use deployed site URL (e.g. `https://adsrdsr2.github.io/tej-clone/blog/2020-in-review`) |
| 10 | Ask widget | ✅ fully client-side (local `content.json` index); button relabeled "Search" — no AI-backend pretense, no `/api/*` calls anywhere |
| 11 | No server-only leftovers | ✅ `grep` for `/api/`, `webmcp` endpoints, `fetch(` to backends: none in `src/` |
| 12 | `/contact` dead links | ✅ retargeted to homepage `#contact` section (mailto placeholder, honestly labeled) |
| 13 | Status page honesty | ✅ "live" wording replaced with "static snapshot" labels |
| 14 | Workflow file validity | ✅ `.github/workflows/deploy.yml` — checkout, Node 22 + npm cache, `npm ci`, build, `upload-pages-artifact@v3` (`./dist`), `deploy-pages@v4`, minimal permissions (`contents: read`, `pages: write`, `id-token: write`), `github-pages` environment, push-to-`main` + `workflow_dispatch` triggers |
| 15 | Local dev unaffected | ✅ local build has no `/tej-clone` prefix; `npm run dev`/`preview` unchanged |

## Checks NOT run (and why)

- **Playwright browser/interaction tests** — the repo has no test files
  (`playwright` is a devDependency, but no specs exist); the prior
  `interaction-test-report.md` documents the original manual verification.
- **Actual GitHub Actions run** — requires the workflow to execute on
  github.com after push; not yet triggered at report time.
- **Visual regression at 1440/1280/768/390/320px** — no browser harness was
  executed in this pass; no visual code was changed (only URLs/labels), so
  prior screenshot evidence still stands.

## Known limitations / open items

1. **GitHub Pages needs a one-time manual enablement**: Settings → Pages →
   Build and deployment → Source: **GitHub Actions**. Enabling via the REST
   API (`PUT /repos/{owner}/{repo}/pages`) returned 404 for this repo, so the
   click-through is required once; afterwards every push to `main` deploys
   automatically.
2. `llms-full.txt` does not exist in this project (only `llms.txt`); nothing
   to fix.
3. The site is an *unofficial reproduction* — kept `private`; the README
   carries the non-affiliation notice.
4. No sitemap.xml generator is installed; `robots.txt` allows all, no sitemap
   reference (unchanged from the original clone).

## Files changed in this pass

- `astro.config.mjs` — `base`/`site` derived from the Actions environment
- `src/lib/url.ts` — new shared base-aware URL helper
- 22 source files — internal links/images/feeds via `u()` (scripted, then
  hand-verified); `Topbar.astro`/`Footer.astro` render via `u()`
- `src/layouts/Base.astro` — canonical/OG/canonical JSON-LD via `Astro.site`
- `src/pages/rss.xml.js`, `src/pages/llms.txt.js` — `SITE` from `import.meta.env.SITE`
- `src/pages/robots.txt.js` — dropped the stale `/api/` disallow
- `src/pages/status.astro` — honest "static snapshot" wording
- `src/islands/AskWidget.tsx` — button relabeled "Search"
- `.github/workflows/deploy.yml` — new Pages deployment workflow
- `README.md` — new "Deploy to GitHub Pages" section
