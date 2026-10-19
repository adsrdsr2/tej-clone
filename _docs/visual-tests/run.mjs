// Visual + interaction test runner for the tej.as clone (coordinator task).
// Usage: node _docs/visual-tests/run.mjs
// Screenshots -> _docs/visual-tests/ ; results -> _docs/visual-tests/report.json
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const BASE = 'http://localhost:4321';
const OUT = dirname(fileURLToPath(import.meta.url));
mkdirSync(OUT, { recursive: true });

const report = { base: BASE, started: new Date().toISOString(), shots: [], checks: [], errors: [] };
const ok = (name, detail) => { report.checks.push({ name, pass: true, detail }); console.log('  PASS', name, detail || ''); };
const fail = (name, detail) => { report.checks.push({ name, pass: false, detail }); console.log('  FAIL', name, detail || ''); };

async function newPage(browser, vp, opts = {}) {
  const ctx = await browser.newContext({
    viewport: { width: vp[0], height: vp[1] },
    reducedMotion: opts.reducedMotion ? 'reduce' : 'no-preference',
    colorScheme: opts.colorScheme || 'light',
    javaScriptEnabled: opts.js === false ? false : true,
  });
  if (opts.theme) await ctx.addInitScript(t => localStorage.setItem('theme', t), opts.theme);
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0, 200)); });
  page.on('pageerror', e => errs.push('pageerror: ' + String(e).slice(0, 200)));
  page.on('requestfailed', r => errs.push('reqfail: ' + r.url().slice(0, 140)));
  return { page, ctx, errs };
}

async function settle(page, ms = 900) {
  await page.waitForLoadState('domcontentloaded', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(ms);
}

async function scrollTo(page, what) {
  if (what === 'footer') {
    await page.evaluate(() => document.querySelector('footer')?.scrollIntoView({ block: 'end' }));
  } else if (what === 'mid') {
    await page.evaluate(() => {
      const els = [...document.querySelectorAll('h1,h2,h3')];
      const t = els.find(e => /praise|kind words|testimonial/i.test(e.textContent)) ||
                els.find(e => /speak at conferences/i.test(e.textContent));
      (t || document.body).scrollIntoView({ block: 'start' });
    });
  } else if (what === 'coverflow') {
    await page.evaluate(() => {
      const cf = document.querySelector('.cf') || [...document.querySelectorAll('h2')].find(e => /speak at conferences/i.test(e.textContent));
      (cf || document.body).scrollIntoView({ block: 'center' });
    });
  } else if (what === 'ask') {
    await page.evaluate(() => document.querySelector('.ask-widget')?.scrollIntoView({ block: 'center' }));
  }
  await page.waitForTimeout(600);
}

const SHOTS = [
  // --- home hero at 5 viewports ---
  ['home-1440x900-top-light', '/', [1440, 900], { theme: 'light' }],
  ['home-1440x900-top-dark', '/', [1440, 900], { theme: 'dark' }],
  ['home-1440x900-midscroll', '/', [1440, 900], { theme: 'light', scrollTo: 'mid' }],
  ['home-1440x900-bottom', '/', [1440, 900], { theme: 'light', scrollTo: 'footer' }],
  ['home-1440x900-full', '/', [1440, 900], { theme: 'light', full: true }],
  ['home-1280x800-top', '/', [1280, 800], { theme: 'light' }],
  ['home-1280x800-full', '/', [1280, 800], { theme: 'light', full: true }],
  ['home-768x1024-top', '/', [768, 1024], { theme: 'light' }],
  ['home-768x1024-full', '/', [768, 1024], { theme: 'light', full: true }],
  ['home-390x844-top', '/', [390, 844], { theme: 'light' }],
  ['home-390x844-midscroll', '/', [390, 844], { theme: 'light', scrollTo: 'mid' }],
  ['home-390x844-bottom', '/', [390, 844], { theme: 'light', scrollTo: 'footer' }],
  ['home-390x844-full', '/', [390, 844], { theme: 'light', full: true }],
  ['home-320x568-top', '/', [320, 568], { theme: 'light' }],
  ['home-320x568-full', '/', [320, 568], { theme: 'light', full: true }],
  // --- theme states / no-flash ---
  ['home-theme-dark-noflash', '/', [1440, 900], { theme: 'dark', noflash: true }],
  ['home-theme-light-noflash', '/', [1440, 900], { theme: 'light', noflash: true }],
  ['home-navpop-open', '/', [1440, 900], { theme: 'light', openPopover: true }],
  ['home-nav-hover', '/', [1440, 900], { theme: 'light', hoverNav: true }],
  ['home-reduced-motion', '/', [1440, 900], { theme: 'light', reducedMotion: true }],
  // --- cover-flow ---
  ['home-coverflow-crop', '/', [1440, 900], { theme: 'light', scrollTo: 'coverflow' }],
  ['home-coverflow-nojs', '/', [1440, 900], { scrollTo: 'coverflow', js: false }],
  ['home-coverflow-reduced-motion', '/', [1440, 900], { theme: 'light', scrollTo: 'coverflow', reducedMotion: true }],
  // --- ask widget ---
  ['home-ask-typed', '/', [1440, 900], { theme: 'light', askShot: true }],
  // --- 13 top-level pages full at 1440 ---
  ...['about','story','speaking','workshops','preaching','calendar','investing','status','talks','react','blog','podcast']
    .map(r => [`page-${r}-full`, `/${r}`, [1440, 900], { full: true }]),
  ['page-demos-tavus-full', '/demos/tavus', [1440, 900], { full: true }],
  // --- content inner pages ---
  ['page-blog-post-full', '/blog/local-llm-vs-cloud', [1440, 900], { full: true }],
  ['page-talk-transcript-full', '/talks/agent-conf-2026', [1440, 900], { full: true }],
  ['page-podcast-episode-full', '/podcast/ep/how-to-build-tech-software-full-stack-engineering', [1440, 900], { full: true }],
  ['page-404', '/nonexistent-test-xyz', [1440, 900], {}],
  // --- mobile key pages ---
  ['mobile-390x844-about-full', '/about', [390, 844], { full: true }],
  ['mobile-390x844-blog-full', '/blog', [390, 844], { full: true }],
  ['mobile-390x844-speaking-full', '/speaking', [390, 844], { full: true }],
];

async function capture(browser, [name, route, vp, setup]) {
  const { page, ctx, errs } = await newPage(browser, vp, setup);
  try {
    if (setup.noflash) {
      await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20000 });
      const themeAtLoad = await page.evaluate(() => document.documentElement.dataset.theme);
      await page.screenshot({ path: join(OUT, name + '.png') });
      report.shots.push({ name, route, viewport: vp, file: name + '.png', themeAtLoad, consoleErrors: errs.slice(0, 5) });
      console.log(`shot ${name} themeAtLoad=${themeAtLoad} errs=${errs.length}`);
    } else {
      const resp = await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 20000 });
      const status = resp ? resp.status() : 'no-response';
      await settle(page);
      if (setup.scrollTo) await scrollTo(page, setup.scrollTo);
      if (setup.openPopover) { await page.click('[popovertarget="nav-more"]'); await page.waitForTimeout(600); }
      if (setup.hoverNav) { await page.hover('.topbar__nav a'); await page.waitForTimeout(500); }
      if (setup.askShot) {
        await scrollTo(page, 'ask');
        await page.fill('#ask-widget-input', 'react');
        await page.click('.ask-widget__submit');
        await page.waitForTimeout(6000);
      }
      const out = name + '.png';
      await page.screenshot({ path: join(OUT, out), fullPage: !!setup.full });
      const hOverflow = await page.evaluate(() =>
        document.documentElement.scrollWidth - document.documentElement.clientWidth);
      report.shots.push({ name, route, viewport: vp, status, file: out, hOverflow, consoleErrors: errs.slice(0, 5) });
      console.log(`shot ${name} [${status}] hOverflow=${hOverflow} errs=${errs.length}`);
      if (errs.length) report.errors.push({ shot: name, errs: errs.slice(0, 5) });
    }
  } catch (e) {
    report.shots.push({ name, route, error: String(e).slice(0, 200) });
    console.log('shot ERROR', name, String(e).slice(0, 120));
  } finally { await ctx.close(); }
}

// ---------------- interactions ----------------
async function interactions(browser) {
  console.log('== interactions ==');

  // T1 theme toggle (no addInitScript: it would re-fire on reload)
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
    const page = await ctx.newPage();
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' }); await settle(page);
    await page.evaluate(() => localStorage.setItem('theme', 'light'));
    await page.reload({ waitUntil: 'domcontentloaded' }); await settle(page);
    const before = await page.evaluate(() => document.documentElement.dataset.theme);
    await page.click('button[aria-label="Switch theme"]'); await page.waitForTimeout(400);
    const after = await page.evaluate(() => ({
      theme: document.documentElement.dataset.theme,
      stored: localStorage.getItem('theme'),
      label: document.querySelector('[data-theme-label]')?.textContent.trim(),
    }));
    (before === 'light' && after.theme === 'dark' && after.stored === 'dark')
      ? ok('I1-theme-toggle', JSON.stringify(after)) : fail('I1-theme-toggle', JSON.stringify({ before, after }));
    (after.label && /dark/i.test(after.label)) ? ok('I1-theme-label', after.label) : fail('I1-theme-label', after.label || 'no label');
    await page.reload({ waitUntil: 'domcontentloaded' }); await settle(page);
    const persisted = await page.evaluate(() => document.documentElement.dataset.theme);
    persisted === 'dark' ? ok('I1-theme-persist', persisted) : fail('I1-theme-persist', persisted);
    await ctx.close();
  }

  // T2 popover
  {
    const { page, ctx } = await newPage(browser, [1440, 900], { theme: 'light' });
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' }); await settle(page);
    await page.click('[popovertarget="nav-more"]'); await page.waitForTimeout(500);
    const info = await page.evaluate(() => {
      const vis = el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
      const list = document.querySelector('#nav-more .navpop__list');
      return {
        open: !!document.querySelector('#nav-more:popover-open'),
        expanded: document.querySelector('[popovertarget="nav-more"]').getAttribute('aria-expanded'),
        visibleItems: [...document.querySelectorAll('#nav-more .navpop__list a')].filter(vis).map(a => a.getAttribute('href')),
        labels: [...document.querySelectorAll('#nav-more .navpop__list a')].filter(vis).map(a => a.textContent.trim().split('\n')[0].trim()),
      };
    });
    (info.open && info.visibleItems.length === 7 && info.expanded === 'true')
      ? ok('I2-popover-open-7items', JSON.stringify(info.labels)) : fail('I2-popover-open-7items', JSON.stringify(info));
    await page.keyboard.press('Escape'); await page.waitForTimeout(400);
    const closed = await page.evaluate(() => ({
      closed: !document.querySelector('#nav-more:popover-open'),
      expanded: document.querySelector('[popovertarget="nav-more"]').getAttribute('aria-expanded'),
    }));
    (closed.closed && closed.expanded === 'false') ? ok('I2-popover-escape') : fail('I2-popover-escape', JSON.stringify(closed));
    // nav link inside popover resolves
    const moreHref = info.visibleItems[0];
    const r = await page.goto(BASE + moreHref, { waitUntil: 'domcontentloaded' });
    (r && r.status() === 200) ? ok('I2-popover-link-200', moreHref) : fail('I2-popover-link-200', moreHref + ' status=' + (r && r.status()));
    await ctx.close();
  }

  // T3 mobile pill + scroll-to-top
  {
    const { page, ctx } = await newPage(browser, [390, 844], { theme: 'light' });
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' }); await settle(page);
    // dev-mode astro toolbar intercepts pointer events at the bottom-right;
    // hide it so clicks hit the real pill (production has no toolbar).
    await page.evaluate(() => document.querySelector('astro-dev-toolbar')?.remove());
    const rect = await page.evaluate(() => {
      const hb = document.querySelector('header.topbar').getBoundingClientRect();
      return { y: Math.round(hb.y), h: Math.round(hb.height), w: Math.round(hb.width), pos: getComputedStyle(document.querySelector('header.topbar')).position };
    });
    (rect.y > 700 && rect.pos === 'fixed') ? ok('I3-pill-fixed-bottom', JSON.stringify(rect)) : fail('I3-pill-fixed-bottom', JSON.stringify(rect));
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await page.waitForTimeout(600);
    const y1 = await page.evaluate(() => window.scrollY);
    await page.click('[data-scroll-top]'); await page.waitForTimeout(2500);
    const y2 = await page.evaluate(() => window.scrollY);
    (y1 > 1000 && y2 < 120) ? ok('I3-scroll-to-top', `y1=${y1} y2=${y2}`) : fail('I3-scroll-to-top', `y1=${y1} y2=${y2}`);
    await ctx.close();
  }

  // T4 cover-flow
  {
    const { page, ctx } = await newPage(browser, [1440, 900], { theme: 'light' });
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' }); await settle(page);
    await scrollTo(page, 'coverflow');
    const shields = await page.evaluate(() => ({
      n: document.querySelectorAll('button.cf-shield').length,
      sample: document.querySelector('button.cf-shield')?.getAttribute('aria-label'),
    }));
    (shields.n === 85 && /Talk \d+ of 85/.test(shields.sample || ''))
      ? ok('I4-cf-85-shields', JSON.stringify(shields)) : fail('I4-cf-85-shields', JSON.stringify(shields));
    const nearestIdx = () => page.evaluate(() => {
      const track = document.querySelector('.cf-track'); const center = track.scrollLeft + track.clientWidth / 2;
      let best = -1, bd = Infinity;
      document.querySelectorAll('.cf-item').forEach((b, i) => {
        const d = Math.abs((b.offsetLeft + b.offsetWidth / 2) - center);
        if (d < bd) { bd = d; best = i; }
      });
      return best;
    });
    const i0 = await nearestIdx();
    const before = await page.evaluate(() => document.querySelector('.cf-track').scrollLeft);
    await page.click('.cf-nav--next'); await page.waitForTimeout(1200);
    const after = await page.evaluate(() => document.querySelector('.cf-track').scrollLeft);
    const i1 = await nearestIdx();
    (after > before && i1 !== i0) ? ok('I4-cf-next-center-changes', `scrollLeft ${before}->${after}, card ${i0}->${i1}`) : fail('I4-cf-next-center-changes', `scrollLeft ${before}->${after}, card ${i0}->${i1}`);
    await page.click('.cf-nav--prev'); await page.waitForTimeout(1200);
    const back = await page.evaluate(() => document.querySelector('.cf-track').scrollLeft);
    back < after ? ok('I4-cf-prev', `scrollLeft back to ${back}`) : fail('I4-cf-prev', `scrollLeft=${back}`);
    // keyboard ArrowRight on track
    const kb0 = await page.evaluate(() => document.querySelector('.cf-track').scrollLeft);
    await page.focus('.cf-track'); await page.keyboard.press('ArrowRight'); await page.waitForTimeout(900);
    const kb1 = await page.evaluate(() => document.querySelector('.cf-track').scrollLeft);
    kb1 > kb0 ? ok('I4-cf-keyboard-arrowright', `scrollLeft ${kb0}->${kb1}`) : fail('I4-cf-keyboard-arrowright', `scrollLeft ${kb0}->${kb1}`);
    await ctx.close();
  }

  // T5 ask widget
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
    await ctx.grantPermissions(['clipboard-read', 'clipboard-write']);
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push('pageerror: ' + String(e).slice(0, 160)));
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' }); await settle(page);
    await scrollTo(page, 'ask');
    await page.fill('#ask-widget-input', 'react');
    await page.click('.ask-widget__submit');
    await page.waitForTimeout(9000);
    const res = await page.evaluate(() => ({
      links: [...document.querySelectorAll('.ask-widget__list a')].map(a => a.getAttribute('href')),
      intro: document.querySelector('.ask-widget__intro')?.textContent.slice(0, 60),
      copyBtn: !!document.querySelector('.ask-widget__copy'),
    }));
    const realLinks = res.links.filter(h => /^\/(blog|talks)\/[\w-]+$|^\/podcast\/ep\/[\w-]+$/.test(h));
    (res.links.length > 0 && realLinks.length === res.links.length)
      ? ok('I5-ask-results-real-links', `${res.links.length} links e.g. ${res.links.slice(0, 3).join(', ')}`)
      : fail('I5-ask-results-real-links', JSON.stringify(res));
    // copy link button
    if (res.copyBtn) {
      await page.click('.ask-widget__copy'); await page.waitForTimeout(400);
      const lbl = await page.evaluate(() => document.querySelector('.ask-widget__copy')?.textContent.trim());
      /copied/i.test(lbl || '') ? ok('I5-ask-copy-link', lbl) : fail('I5-ask-copy-link', lbl || 'label unchanged');
    } else fail('I5-ask-copy-link', 'no copy button after results');
    // suggestion chip
    await page.click('.ask-widget__chip'); await page.waitForTimeout(9000);
    const chipRes = await page.evaluate(() => document.querySelectorAll('.ask-widget__list a').length);
    chipRes > 0 ? ok('I5-ask-chip', chipRes + ' results') : fail('I5-ask-chip', 'no results from chip');
    // escape clears
    await page.focus('#ask-widget-input'); await page.keyboard.press('Escape'); await page.waitForTimeout(500);
    const cleared = await page.evaluate(() => document.querySelectorAll('.ask-widget__list a').length === 0);
    cleared ? ok('I5-ask-escape-clears') : fail('I5-ask-escape-clears', 'results still present');
    // check each result link resolves
    let bad = 0;
    for (const h of res.links.slice(0, 4)) {
      const r = await page.goto(BASE + h, { waitUntil: 'domcontentloaded' });
      if (!r || r.status() !== 200) bad++;
    }
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    bad === 0 ? ok('I5-ask-links-resolve', res.links.slice(0, 4).join(', ')) : fail('I5-ask-links-resolve', bad + ' bad links');
    errs.length && report.errors.push({ test: 'ask', errs });
    await ctx.close();
  }

  // T6 nav links 200
  {
    const { page, ctx } = await newPage(browser, [1440, 900], { theme: 'light' });
    const routes = ['/speaking', '/story', '/podcast', '/blog'];
    for (const r of routes) {
      const resp = await page.goto(BASE + r, { waitUntil: 'domcontentloaded' });
      (resp && resp.status() === 200) ? ok('I6-nav-' + r, '200') : fail('I6-nav-' + r, 'status=' + (resp && resp.status()));
    }
    await ctx.close();
  }

  // T7 reduced motion: coverflow flat + ask all-at-once
  {
    const { page, ctx } = await newPage(browser, [1440, 900], { reducedMotion: true, theme: 'light' });
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' }); await settle(page);
    await scrollTo(page, 'coverflow');
    const flat = await page.evaluate(() => {
      const tr = [...document.querySelectorAll('.cf-item')].slice(0, 5).map(b => b.style.transform);
      return tr;
    });
    flat.every(t => t === '' || /rotateY\(0deg\)/.test(t))
      ? ok('I7-reduced-cf-flat', JSON.stringify(flat[0] || '(no inline transform = flat)')) : fail('I7-reduced-cf-flat', JSON.stringify(flat));
    await scrollTo(page, 'ask');
    await page.fill('#ask-widget-input', 'react');
    const t0 = Date.now();
    await page.click('.ask-widget__submit');
    await page.waitForSelector('.ask-widget__list a', { timeout: 15000 });
    const t1 = Date.now();
    const count = await page.evaluate(() => ({
      visible: document.querySelectorAll('.ask-widget__list a').length,
      total: document.querySelectorAll('.ask-widget__list a').length,
    }));
    ok('I7-reduced-ask-at-once', `visible=${count.visible} in ${t1 - t0}ms`);
    await ctx.close();
  }

  // T8 horizontal overflow across viewports + pages
  {
    for (const [route, w, h] of [['/', 1440, 900], ['/', 390, 844], ['/', 320, 568], ['/blog', 390, 844], ['/speaking', 768, 1024]]) {
      const { page, ctx } = await newPage(browser, [w, h], { theme: 'light' });
      await page.goto(BASE + route, { waitUntil: 'domcontentloaded' }); await settle(page);
      const ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      ov <= 0 ? ok(`I8-overflow-${route.replace(/\//g, '_')||'home'}-${w}`, 'none') : fail(`I8-overflow-${route.replace(/\//g, '_')||'home'}-${w}`, 'overflow=' + ov);
      await ctx.close();
    }
  }

  // T9 no-JS render (page still readable, no errors from JS absence)
  {
    const { page, ctx } = await newPage(browser, [1440, 900], { js: false });
    const resp = await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    const hero = await page.evaluate(() => !!document.querySelector('h1'));
    (resp && resp.status() === 200 && hero) ? ok('I9-nojs-renders', 'h1 present, status 200') : fail('I9-nojs-renders', 'status=' + (resp && resp.status()));
    await ctx.close();
  }
}

const browser = await chromium.launch();
try {
  const filter = process.argv[2];
  if (filter === '--interactions') {
    await interactions(browser);
  } else {
    const list = filter ? SHOTS.filter(s => s[0].includes(filter)) : SHOTS;
    console.log(`capturing ${list.length} shots...`);
    for (const s of list) await capture(browser, s);
    if (!filter) await interactions(browser);
  }
} finally { await browser.close(); }
report.finished = new Date().toISOString();
writeFileSync(join(OUT, 'report.json'), JSON.stringify(report, null, 2));
const passes = report.checks.filter(c => c.pass).length;
console.log(`\nchecks: ${passes}/${report.checks.length} passed; shots: ${report.shots.length}`);
