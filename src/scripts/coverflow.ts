/* coverflow.ts — 3D cover-flow carousel driver (vanilla JS/TS, no libraries).
 *
 * Loaded from src/components/CoverFlow.astro via `<script src="../scripts/coverflow.ts">`.
 * Astro/Vite bundles this file; it runs once the component markup is parsed.
 *
 * What it does:
 *  - Marks each `section.cf` with `data-js`, disabling the CSS-only
 *    `animation-timeline` fallback (`.cf:not([data-js])`).
 *  - On track scroll (rAF-throttled), measures every card's distance from the
 *    track's visual center and interpolates the verified reference geometry:
 *      center: translateX(0) translateZ(+0.42*W) rotateY(0) scale(1)
 *      side:   translateX(±42%) translateZ(-0.62*W) rotateY(±38°) scale(0.74)
 *    plus z-index (100 / 40 / 1), shade opacity (0 → .86), mirror opacity
 *    (.42 → .14) and face-ui visibility (only near center).
 *  - Prev/next buttons scroll by exactly one card (`scrollBy`, smooth unless
 *    reduced motion). Arrow keys / Home / End work when the track is focused;
 *    buttons are native so Tab/Enter/Space work out of the box.
 *  - Drives the `.cf-strip__thumb` position from scroll progress.
 *  - Announces the centered talk in an `aria-live="polite"` region.
 *  - `prefers-reduced-motion: reduce` → flat cards (no rotation/depth),
 *    instant scrolling, no smooth behavior. Touch swipe stays native
 *    scroll-snap — nothing custom is added for it.
 */

interface CardRefs {
  el: HTMLElement;
  shade: HTMLElement | null;
  mirror: HTMLElement | null;
  face: HTMLElement | null;
  n: string;
  title: string;
  event: string;
}

const PERSPECTIVE_PX = 1400; // matches --cf-persp
const ROT_DEG = 38; // matches --cf-rot
const ANNOUNCE_DELAY_MS = 280;

function initSection(section: HTMLElement): void {
  section.setAttribute("data-js", "");

  const track = section.querySelector<HTMLElement>("[data-cf-track]");
  const live = section.querySelector<HTMLElement>("[data-cf-live]");
  const rail = section.querySelector<HTMLElement>(".cf-strip__rail");
  const thumb = section.querySelector<HTMLElement>(".cf-strip__thumb");
  const prevBtn = section.querySelector<HTMLButtonElement>(".cf-nav--prev");
  const nextBtn = section.querySelector<HTMLButtonElement>(".cf-nav--next");
  if (!track) return;

  const items = Array.from(track.querySelectorAll<HTMLElement>(".cf-item"));
  if (items.length === 0) return;

  const cards: CardRefs[] = items.map((el) => ({
    el,
    shade: el.querySelector<HTMLElement>(".cf-shade"),
    mirror: el.querySelector<HTMLElement>(".cf-mirror"),
    face: el.querySelector<HTMLElement>(".cf-face-ui"),
    n: el.getAttribute("data-n") ?? "",
    title: el.getAttribute("data-title") ?? "",
    event: el.getAttribute("data-event") ?? "",
  }));

  const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reduced = reduceMq.matches;
  let step = 1;
  let nearestIndex = 0;

  const scrollBehavior = (): ScrollBehavior => (reduced ? "auto" : "smooth");

  function measure(): void {
    // Distance between consecutive card origins (width + gap). offsetLeft is
    // layout-based, so 3D transforms never disturb the measurement. The track
    // is `position: relative`, making it the offsetParent of the cards.
    if (cards.length > 1) {
      step = cards[1].el.offsetLeft - cards[0].el.offsetLeft;
    } else {
      step = cards[0].el.offsetWidth;
    }
    if (!step || step <= 0) step = cards[0].el.offsetWidth || 1;
  }

  function paintCard(card: CardRefs, d: number): void {
    const ad = Math.abs(d);

    if (reduced) {
      // Flat row: no rotation, no depth, everything readable.
      card.el.style.transform = "translateX(0) translateZ(0) rotateY(0deg) scale(1)";
      card.el.style.zIndex = "1";
      if (card.shade) card.shade.style.opacity = "0";
      if (card.mirror) card.mirror.style.opacity = "0";
      if (card.face) {
        card.face.style.opacity = "1";
        card.face.style.visibility = "visible";
      }
      return;
    }

    const t = Math.min(ad, 1); // 0 at center → 1 at one full card away
    const s = d < 0 ? -1 : 1; // -1 left of center, +1 right of center
    const w = card.el.offsetWidth || 1;

    // Per-card perspective(): the scrolling track forces transform-style: flat,
    // so a shared parent perspective cannot reach the cards.
    card.el.style.transform =
      `perspective(${PERSPECTIVE_PX}px)` +
      ` translateX(${(s * 42 * t).toFixed(3)}%)` +
      ` translateZ(${((0.42 - 1.04 * t) * w).toFixed(1)}px)` +
      ` rotateY(${(s * ROT_DEG * t).toFixed(2)}deg)` +
      ` scale(${(1 - 0.26 * t).toFixed(3)})`;
    card.el.style.zIndex = ad < 0.5 ? "100" : ad < 1.25 ? "40" : "1";

    if (card.shade) card.shade.style.opacity = (0.86 * t).toFixed(3);
    if (card.mirror) card.mirror.style.opacity = (0.42 - 0.28 * t).toFixed(3);
    if (card.face) {
      // Fully visible within ±8% of center, faded out by ±20%.
      const fo = Math.max(0, Math.min(1, 1 - (ad - 0.08) / 0.12));
      card.face.style.opacity = fo.toFixed(3);
      card.face.style.visibility = ad < 0.45 ? "visible" : "hidden";
    }
  }

  function update(): void {
    const center = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let bestAbs = Infinity;
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const d = (card.el.offsetLeft + card.el.offsetWidth / 2 - center) / step;
      const ad = Math.abs(d);
      if (ad < bestAbs) {
        bestAbs = ad;
        best = i;
      }
      paintCard(card, d);
    }
    nearestIndex = best;

    if (thumb && rail) {
      const max = track.scrollWidth - track.clientWidth;
      const p = max > 0 ? track.scrollLeft / max : 0;
      const x = p * (rail.clientWidth - thumb.offsetWidth);
      thumb.style.transform = `translateX(${x.toFixed(1)}px)`;
    }
  }

  let announceTimer = 0;
  function announce(text: string): void {
    if (live && live.textContent !== text) live.textContent = text;
  }
  function scheduleAnnounce(): void {
    window.clearTimeout(announceTimer);
    announceTimer = window.setTimeout(() => {
      const c = cards[nearestIndex];
      if (c) announce(`Talk ${c.n} of ${cards.length}: ${c.title} — ${c.event}`);
    }, ANNOUNCE_DELAY_MS);
  }

  let ticking = false;
  track.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(() => {
          ticking = false;
          update();
          scheduleAnnounce();
        });
      }
    },
    { passive: true },
  );

  prevBtn?.addEventListener("click", () => {
    track.scrollBy({ left: -step, behavior: scrollBehavior() });
  });
  nextBtn?.addEventListener("click", () => {
    track.scrollBy({ left: step, behavior: scrollBehavior() });
  });

  track.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      track.scrollBy({
        left: (e.key === "ArrowRight" ? 1 : -1) * step,
        behavior: scrollBehavior(),
      });
    } else if (e.key === "Home") {
      e.preventDefault();
      track.scrollTo({ left: 0, behavior: scrollBehavior() });
    } else if (e.key === "End") {
      e.preventDefault();
      track.scrollTo({ left: track.scrollWidth, behavior: scrollBehavior() });
    }
  });

  // Each card's shield opens its YouTube talk in a new tab (noopener).
  // Buttons are natively keyboard-operable (Enter/Space fire click).
  section.querySelectorAll<HTMLButtonElement>(".cf-shield").forEach((btn) => {
    btn.addEventListener("click", () => {
      const href = btn.getAttribute("data-href");
      if (href) window.open(href, "_blank", "noopener");
    });
  });

  if (typeof reduceMq.addEventListener === "function") {
    reduceMq.addEventListener("change", (e: MediaQueryListEvent) => {
      reduced = e.matches;
      update();
    });
  }

  window.addEventListener("resize", () => {
    measure();
    update();
  });

  measure();
  update();
  // Announce the initial position immediately so SR users land oriented.
  const first = cards[nearestIndex];
  if (first) announce(`Talk ${first.n} of ${cards.length}: ${first.title} — ${first.event}`);

  // Widths are fixed via --cf-w, but re-measure once fonts settle just in case.
  if (document.fonts && typeof document.fonts.ready.then === "function") {
    document.fonts.ready
      .then(() => {
        measure();
        update();
      })
      .catch(() => undefined);
  }
}

// The component is used once per page, but support several instances anyway.
document.querySelectorAll<HTMLElement>("section.cf").forEach(initSection);
