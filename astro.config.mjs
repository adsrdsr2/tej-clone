import { defineConfig } from 'astro/config';
import solidJs from '@astrojs/solid-js';

// Unofficial reproduction of tej.as — for study purposes only.
// Not affiliated with or endorsed by the site's owner.

// GitHub Pages base-path handling:
// - In GitHub Actions, GITHUB_REPOSITORY is "owner/repo". Project pages are
//   served under https://<owner>.github.io/<repo>/, so the Astro base must
//   include the repository name.
// - A repository named "<owner>.github.io" is served from the domain root,
//   so no base prefix is needed.
// - Local dev / preview keep base "/" and a localhost site URL.
const [ghOwner, ghRepo] = (process.env.GITHUB_REPOSITORY ?? "/").split("/");
const onPages = process.env.GITHUB_ACTIONS === "true" && !!ghOwner && !!ghRepo;
// NOTE: Astro exposes import.meta.env.BASE_URL *without* a trailing slash
// ("/tej-clone"), so every join site in components uses `${BASE_URL}/path`.
const base = onPages && !ghRepo.endsWith(".github.io") ? `/${ghRepo}` : "/";
const site =
  onPages && base === "/"
    ? `https://${ghOwner}.github.io`
    : onPages
      ? `https://${ghOwner}.github.io${base.replace(/\/$/, "")}`
      : "http://localhost:4321";

export default defineConfig({
  output: 'static',
  site,
  base,
  trailingSlash: 'never',
  integrations: [solidJs()],
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
});
