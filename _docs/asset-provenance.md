# Asset provenance — images

All images in this reproduction are substitutes, not originals. Documented here
per the engineering brief (§10.2, §19e).

## `public/img/tejas-hero.png` — hero portrait cutout
- **Source:** cropped from the evidence screenshot
  `~/workspace/goals/muse1241-bot/files/tej-clone-spec/evidence/desktop-1440x900_home_top.png`
  (region x=880–1440, y=200–860 of the 1440×900 capture).
- **Processing:** background removed by corner-seeded flood fill against the
  page background (#f0e9e2 ± 38), then saved as RGBA PNG so the cutout works on
  both light and dark themes.
- **Status:** SUBSTITUTE. The original photo is not in the evidence package.
  Photograph credit on the real site: Taz Singh (see footer).

## Cover-flow thumbnails
- Loaded at runtime from `https://i.ytimg.com/vi/<id>/mqdefault.jpg` — the same
  YouTube CDN pattern the reference site uses. The 85 video IDs in
  `src/data/content.json` were verified against the live site's llms.txt on
  2026-10-15; the 4 missing IDs were recovered from the live site's own
  youtu.be links. No thumbnails are bundled locally.

## `public/favicon.svg`
- Hand-drawn placeholder (red dot on void with serif "T") — not the original
  favicon.
