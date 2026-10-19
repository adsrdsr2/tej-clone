# Implementation Digest — کلون سایت tej.as

> خلاصه اجرایی پیاده‌سازی، مستقیم از پکیج تحلیلی `tej-clone-spec/`
> تاریخ بازرسی منبع: ۲۰۲۶-۱۰-۱۵ · نسخه اسپک: ۱.۰
> این فایل تصمیم نهایی برای بیلد است؛ جاهایی که اسناد با هم اختلاف داشتند، اختلاف حل شده و تصمیم ثبت شده (بخش ۱۰).
> نماد اعتماد: ✅ تأییدشده (Verified) · 📏 اندازه‌گیری‌شده (Measured) · 🔍 استنباطی (Inferred) · ❓ نامشخص (Unknown)

---

## ۱. لیست دقیق روت‌ها (۱۶۹ URL)

منبع شمارش: `/sitemap.xml` ✅ (pages.md §2). مدل ناوبری: MPA کلاسیک — هیچ client-side router پیدا نشد 📏.

| گروه | تعداد | روت‌ها |
|---|---|---|
| صفحات سطح‌اول | ۱۳ | `/` `/about` `/story` `/speaking` `/workshops` `/preaching` `/calendar` `/investing` `/status` `/talks` `/react` `/blog` `/podcast` |
| دمو | ۱ | `/demos/tavus` |
| پست‌های بلاگ | ۳۱ | `/blog/<slug>` (لیست زیر) |
| ترنسکریپت سخنرانی | ۲۶ | `/talks/<slug>` |
| اپیزود پادکست | ۹۸ | `/podcast/ep/<slug>` |

**جمع:** ۱۳+۱+۳۱+۲۶+۹۸ = **۱۶۹** ✅

### عنوان‌ها و H1 های تأییدشده (از رندر زنده، ✅)

| روت | `<title>` | H1 |
|---|---|---|
| `/` | Tejas Kumar: AI Engineer, Speaker, Author of Fluent React | I'm Tejas Kumar, |
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

### اسلاگ‌های بلاگ (۳۱ عدد، ✅)
`local-llm-vs-cloud`، `companies-are-full-of-it`، `why-ai-cant-replace-human-taste`، `please-stop-the-slop`، `can-ai-feel-pain`، `apple-watch-readiness-score-wrong`، `what-are-open-weights`، `ai-evals-llm-judge`، `kolibri-vs-claude-german-llm-benchmark`، `super-intelligence-isnt-superior`، `aleph-alpha-kolibri`، `what-is-webmcp`، `how-much-does-a-keynote-speaker-cost`، `what-is-react-fiber`، `what-does-the-bible-say-about-ai`، `what-is-good-taste-in-software`، `how-long-should-a-keynote-speaker-speak`، `what-is-an-agent-harness`، `note-app-ai-benchmark-apple-intelligence-sucks`، `biggest-lessons-2024-honor-people-fear-failure`، `coding-nights-weekends-good-work-life-balance`، `how-to-grow-professional-relationships-tjs-model`، `health-fitness-devrel-hemophilia`، `impact-pillars-web-engineering`، `goodbye-facebook`، `2020-in-review`، `why-i-do-not-prefer-speaking-at-remote-conferences`، `why-i-think-remote-work-is-incredible`، `5-things-i-love-about-my-website`، `what-i-learned-from-getting-pushed-off-my-bicycle`، `hello-world`.
متای صفحه `/blog`: «31 posts, written since 2020, newest first» ✅ — لیست نزولی.

### اندپوینت‌های ماشینی/فید (✅)
- `/llms.txt` (۲۸٬۱۰۷ بایت) و `/llms-full.txt` (۷۷۸٬۳۲۱ بایت) — **منبع اصلی متن‌ها برای کلون**
- `/podcast/llms.txt` — ایندکس ماشینی پادکست
- `/rss.xml` — فید RSS 2.0 بلاگ، ۳۱ آیتم (روی همه صفحات با `<link rel="alternate">` لینک شده)
- RSS پادکست (خارجی): `https://feeds.acast.com/public/shows/contejas-code`
- `POST /api/webmcp/<tool>` — چهار ابزار: `search-content`، `list-talks`، `get-speaking-schedule`، `get-booking-info`
- `GET /api/askPodcast?q=…` — استریم SSE برای ویجت Ask (بک‌اند داینامیک؛ در کلون stub/mock بزن)
- ریدایرکت‌ها: `/about/` → 308 به `/about` (اسلش آخر حذف می‌شود) · `/codecrafters` → 302 به `https://app.codecrafters.io/join?via=TejasQ` با `rel="sponsored"` · `/feed.xml` → 404 (فقط `/rss.xml` وجود دارد) · `/nothing.png` پیکسل ۶۸ بایتی — **رفتار ترکینگش را کلون نکن**

---

## ۲. ساختار صفحات مهم

قاعده سراسری ✅: دقیقاً یک `<h1>` در هر صفحه، ترتیب منطقی `h1→h2→h3`، `lang="en"`، breadcrumb (`nav aria-label="Breadcrumb"`) روی صفحات سکشن مثل `TEJAS KUMAR / TALK TRANSCRIPTS`.

### `/` — خانه (۶ سکشن، به ترتیب ✅)
1. **Hero** — ابرو-لیبل‌ها `BERLIN` و `AI ENGINEER, IBM` · هدلاین monument «I'm Tejas Kumar,» (کاما قرمز) · پرتره راست · لید «and I've been building on the web for over 25 years, at places like» · ردیف لوگوی کارفرماها (SVGهای IBM، Spotify، مثلث Vercel، پروانه Bluesky + لینک «AND MORE») · خط قرمز عمودی نازک در لبه چپ هیرو
2. **Speaking / cover-flow** — «I speak at conferences.» + «85 talks at 68 events, 2012 to 2026. Here they all are.» + دکمه قرمز `INVITE ME TO SPEAK →` + کاروسل سه‌بعدی cover-flow با ۸۵ کارت
3. **Fluent React book promo** — کاور کتاب + دیوار تحسین X/Twitter (masonry سه‌ستونه)
4. **Ask widget** — جزیره SolidJS، چیپ‌های پیشنهادی + اینپوت + دکمه «Search with AI»
5. **Latest writing / podcast promos** — کارت‌های لینک به `/blog` و `/podcast`
6. **Contact CTA** + فوتر

### `/about` — About Tejas Kumar
بیوگرافی بلند، تایم‌لاین، ۶ آواتار تستیمونیال، پرتره. (📱 نسخه موبایل هم اسکرین‌شات شده)

### `/story` — The thread.
اتوبیوگرافی فصل‌بندی‌شده («testimony») + دات اسکرول قرمز `.thread__head` در ریل چپ که با اسکرول صفحه حرکت می‌کند.

### `/speaking` — Invite me to speak.
موضوعات سخنرانی، فرمت‌ها، هزینه‌ها، لوگوی رویدادهای گذشته، CTA رزرو. (📱 موبایل هم دارد)

### `/workshops` — AI and React training for your team.
آفرهای ورکشاپ تیمی، فرمت‌ها، CTA تماس.

### `/preaching` — Invite me to preach.
دعوت‌نامه سخنرانی مهمان برای کلیساها.

### `/calendar` — Where I'll be.
لیست حضورهای آینده. 🔍 ساختار `CalendarList` استنباطی است.

### `/investing` — I invest early.
تز انجل‌اینوستینگ + استارتاپ‌های پورتفولیو (متن را از `/llms-full.txt` بگیر، جعل نکن).

### `/status` — How I'm doing.
پنل «live health status» — ❓ منبع دیتای زنده نامشخص؛ صفحه HTML استاتیک است. در کلون: پنل استاتیک با placeholder مستند.

### `/talks` — Talk transcripts
اینتروداکشن: «26 of my 85 recorded talks have a full transcript…» ✅ + ۲۶ ردیف `TalkRow`: سال | عنوان | رویداد، با جداکننده hairline.

### `/talks/<slug>` — ترنسکریپت کامل (۲۶ صفحه)
قالب 🔍 استنباطی (رندر نشده)؛ متن کامل را از `/llms-full.txt` بگیر.

### `/react` — How React actually works.
صفحه کتاب *Fluent React*: کاور، فصل‌ها، تحسین‌ها، لینک‌های خرید (+ افیلیت `/codecrafters`).

### `/blog` — I write
۳۱ کارت `PostCard` از جدید به قدیم + لینک RSS. (📱 موبایل هم دارد)

### `/blog/<slug>` — مقاله
Breadcrumb · `PostHero` (تیتر + متا) · TOC (`nav aria-labelledby="post-toc-label"`) · متن مقاله · `aside[aria-label="Share this post"]` (لینک‌های X/Bluesky/LinkedIn) · سکشن FAQ (`section aria-labelledby="questions"`) · پست‌های مرتبط · اسلایدر عمودی خواندن: `div role="slider" tabindex="0" aria-label="Scrub through this post"` (کیبورد ❓ نامشخص).

### `/podcast` — ConTejas Code
دایرکتوری ۹۸ اپیزود، آواتار مهمان‌ها، لینک RSS اکست، واریانت ویجت Ask.

### `/podcast/ep/<slug>` — صفحه اپیزود (۹۸ عدد)
قالب 🔍 استنباطی، رندر نشده.

### `/demos/tavus` — A face that calls my functions.
دموی تعاملی Tavus — ❓ رفتار ران‌تایم تست نشده؛ در کلون: ناحیه امبد + placeholder مستند.

---

## ۳. Design Tokens دقیق

### ۳.۱ مکانیزم تم (✅)
- اسکریپت بلاکینگ در `<head>`: `localStorage.getItem("theme")` فقط `"light"`/`"dark"` قبول می‌کند.
- بدون مقدار ذخیره‌شده → `matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"` — **پیش‌فرض dark**.
- قبل از paint روی `<html>` ست می‌شود: `document.documentElement.setAttribute("data-theme", …)` (در HTML خام SSR هیچ `data-theme` نیست).
- تا وقتی کاربر انتخاب نکرده، listener تغییر `prefers-color-scheme: light` سیستم‌عامل را دنبال می‌کند.
- CSS: `:root, :root[data-theme=dark]` = توکن‌های dark؛ `:root[data-theme=light]` = توکن‌های light؛ `@media (prefers-color-scheme:light){:root:not([data-theme=dark]){…}}` برای بازدیدکننده بدون JS.
- `<meta name="theme-color" content="#F4F1EA">` ✅

### ۳.۲ رنگ‌ها (✅ کپی کاراکتربه‌کاراکتر از CSS)

| توکن | مقدار | نقش |
|---|---|---|
| `--void` | `#0a0708` | مشکی گرم (بک‌گراند dark) |
| `--ink` | `#161012` | سطح تیره |
| `--rule-dark` / `--rule-dark-lit` | `#2a2426` / `#4a4441` | بوردرهای تیره |
| `--bone` | `#f2efe9` | سفید استخوانی |
| `--ash` / `--ash-dim` | `#a39b98` / `#8c8481` | متن ثانویه/کم‌رنگ (dark) |
| `--paper` | `#f4f1ea` | بک‌گراند light |
| `--paper-2` | `#e8e4da` | پلیت light |
| `--paper-ink` | `#0a0708` | متن اصلی (light) |
| `--paper-mid` / `--paper-dim` | `#4a4441` / `#6b6460` | متن ثانویه/کم‌رنگ (light) |
| `--paper-rule` / `--paper-rule-lit` | `#d8d3c7` / `#b3aa99` | بوردرهای light |
| `--red` (dark) / `--red-paper` (light) | `#ef3340` / `#96101c` | قرمز برند (accent) |
| `--red-deep` | `#a50e1a` | قرمز عمیق |
| `--gold` / `--gold-paper` | `#e8b33a` / `#7a5c0e` | طلایی |
| `--brand-ibm` / `--brand-spotify` / `--brand-xata` | `#1f70c1` / `#1ed760` / `#8566ff` | رنگ لوگوها |
| `--on-red` | `#f2efe9` | متن روی قرمز |
| `--tag-family` | `#9f72ea` / `#7048c4` | dark / light |
| `--tag-faith` | `#e8b33a` / `#8a6708` | dark / light |
| `--tag-work` | `#2a8fbe` / `#0d7096` | dark / light |

توکن‌های معنایی هر تم:

| توکن | Dark | Light |
|---|---|---|
| `--bg` | `#0a0708` | `#f4f1ea` |
| `--bg-plate` | `#161012` | `#e8e4da` |
| `--fg` | `#f2efe9` | `#0a0708` |
| `--fg-2` | `#a39b98` | `#4a4441` |
| `--fg-3` | `#8c8481` | `#6b6460` |
| `--hairline` | `#2a2426` | `#d8d3c7` |
| `--hairline-lit` | `#4a4441` | `#b3aa99` |
| `--accent` / `--focus` / `--mark` | `#ef3340` | `#96101c` |
| `--nav-plate` / `--nav-ink` | `#f2efe9` / `#0a0708` | `#0a0708` / `#f4f1ea` |
| `--nav-glass` | 52% | 62% |
| `--grain-opacity` / `--grain-blend` | .5 / screen | .35 / multiply |
| `--vignette-opacity` | .55 | 0 |

- `--fg-label: color-mix(in srgb, var(--fg-2) 72%, var(--fg))` ✅
- `::selection { background: var(--accent); color: var(--on-red) }` ✅
- لینک‌های متن: آندرلاین `1px`، آفست `.25rem`، رنگ `color-mix(in srgb, var(--mark) 55%, transparent)` → روی hover رنگ خالص `var(--mark)` با `transition: text-decoration-color var(--dur-fast) var(--ease)`
- فوکوس سراسری: `:focus-visible { outline: 2px solid var(--focus); outline-offset: 3px }` ✅
- سیستم دکمه عمومی `.btn` **وجود ندارد** ✅ (دکمه‌ها bespoke هر کامپوننت‌اند)

### ۳.۳ تایپوگرافی (✅)

**فونت‌ها** — ۸ قانون `@font-face`، همه `font-display:swap`، self-hosted:

| خانواده | فایل | وزن | preload |
|---|---|---|---|
| Jost (variable) | `/fonts/jost-var.woff2` (+ `-latin-ext`) | 200–900 | ✅ بله (۲۶٬۵۸۸ بایت) |
| Switzer | `/fonts/switzer-400.woff2` (+ `-500`) | 400 / 500 | فقط 400 ✅ (۱۶٬۷۲۸ بایت) |
| Geist Mono (variable) | `/fonts/geist-mono-var.woff2` (+ `-latin-ext`) | 100–900 | نه |
| Instrument Serif | `/fonts/instrument-serif-400-italic.woff2` (+ `-latin-ext`) | 400 italic | نه |

استک‌ها:
- `--font-display: "Jost","Futura","Century Gothic","Trebuchet MS",system-ui,sans-serif`
- `--font-body: "Switzer","Helvetica Neue",Helvetica,Arial,system-ui,sans-serif`
- `--font-serif: "Instrument Serif",Georgia,"Times New Roman",Times,serif`
- `--font-mono: "Geist Mono",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace`

وزن‌ها: `--w-hair:200; --w-book:400; --w-mid:500; --w-bold:700; --w-heavy:800; --w-black:900` · بدنه = ۴۰۰.

**مقیاس تایپ** (همه ✅):

| یوتیلیتی | سایز | line-height | tracking |
|---|---|---|---|
| `.text-monument` | `min(clamp(5rem,18.5vw,17.5rem),30vh)` | .76 | -.045em |
| `.text-colossal` | `min(clamp(4.25rem,12.5vw,12rem),21vh,17vw)` | .8 | -.04em |
| `.text-major` | `min(clamp(3.4rem,7.6vw,7.5rem),14vh,13.6vw)` | .86 | -.032em |
| `.text-minor` | `clamp(2.4rem,4vw,3.5rem)` | .94 | -.024em |
| `.text-scripture` | `clamp(2.5rem,7vw,7.5rem)` | 1.02 | -.012em |
| `.text-lede` | `clamp(1.375rem,1.9vw,1.75rem)` | 1.36 | -.008em |
| `.text-body` | `clamp(1.125rem,1.3vw,1.3125rem)` | 1.62 | 0 |
| `.text-small` | `clamp(.9375rem,1vw,1rem)` | 1.5 | — |
| `.text-label` | `clamp(.75rem,.82vw,.875rem)` | 1 | .24em |
| `.text-micro` | `.6875rem` | 1 | .3em |

بدنه: antialiased، `font-variant-numeric:tabular-nums`، اندازه‌ها: `--measure-lede:26ch; --measure-body:34ch; --measure-prose:66ch`. لیبل‌ها/ناو uppercase با tracking باز.

### ۳.۴ فاصله‌ها، شعاع، سایه (✅)
- `--shell:96rem` حداکثر عرض محتوا · `--gutter:clamp(1.5rem,6vw,5.4rem)` · `--rail:max(.875rem,calc(var(--gutter)*.45))`
- ریتم عمودی (نام‌های liturgical): `--air-s:1.5rem` · `--air-m:clamp(2rem,4vh,3rem)` · `--air-l:clamp(4rem,8vh,6rem)` · `--air-nave:min(clamp(7rem,13vh,10rem),18vw)` · `--air-chapter:min(clamp(10rem,20vh,15rem),23vw)` · `--air-cathedral:min(clamp(14rem,34vh,22rem),29vw)` · `--air-throne:min(clamp(20rem,58vh,34rem),42vw)`
- شعاع: `--r-1:2px`، `--r-pill:999px`، به‌علاوه `1.1rem` (آیتم‌های navpop)، `1.5rem`، `8px` (کاور-فلو)
- بوردرها: تقریباً همه `1px solid var(--hairline)`؛ یک مورد `1px dashed color-mix(in srgb, var(--accent) 60%, transparent)`
- سایه‌ها: lift `0 1.5rem 3rem var(--shadow-lift)`؛ پاپ‌اور ۳لایه + ریم داخلی؛ پیل موبایل چندلایه inset sheen
- گرین: تای‌ل ۱۶۰px از SVG `feTurbulence` به‌صورت data-URI روی `body::before` (opacity/blend هر تم)؛ وینیت روی `body::after` با radial-gradient (فقط dark)

### ۳.۵ بریک‌پوینت‌ها (✅ — سینتکس range در سورس)
`(width>=480px) (width>=640px) (width>=768px) (width>=1024px) (width>=1280px) (width>=1536px) (width>=1620px) (width<=767px) (width<=520px) (height<=30rem)`؛ کاور-فلو اضافه: `(width<=767px)` + ارتفاع‌های ۸۰۰/۷۰۰/۶۲۰/۵۲۰px. **سوئیچ اصلی: 768px.**

### ۳.۶ توکن‌های موشن (✅)
`--dur-fast:.18s; --dur:.32s; --dur-slow:.9s; --ease:cubic-bezier(.22,1,.36,1)`

---

## ۴. کامپوننت‌های مشترک

### Header / Topbar (✅)
- `header.topbar` — دسکتاپ: نوار strip با `padding:1.15rem var(--gutter)`، بوردر hairline پایین، بک‌گراند نیمه‌شفاف blur، `z-index:60`
- چپ: لوگو «TEJAS KUMAR.» + آیکون خانه · وسط: ناو `Speaking · Story · Podcast · Blog · More ⌄` (mono micro uppercase، رنگ `var(--fg-label)`) · راست: تاگل تم
- مارکاپ ناو **بایت‌به‌بایت یکسان در همه صفحات** به‌جز نشانگر صفحه فعال ✅: `aria-current="page"` روی لینک جاری، `data-current` روی دکمه More وقتی صفحه جاری از آیتم‌های overflow است

### منوی More (✅)
- پاپ‌اور **نیتیو HTML**: `<button popovertarget="nav-more">` باز می‌کند `<div id="nav-more" popover class="navpop">`
- ۷ آیتم (لیبل + نُت): Calendar/Where I'll be next · Workshops/I teach your team · Book/Fluent React · About/The long version · Status/How I'm doing today · Investing/Startups I back · Contact/Say hello
- انیمیشن باز/بسته: `opacity .18s, scale .32s, translate .32s` + ترنزیشن‌های discrete روی `display`/`overlay` · چرخش شورون با `transition: rotate var(--dur-fast) var(--ease)` 📏
- Escape می‌بندد 📏؛ کلیک روی لینک = ناوبری کامل + dismiss نیتیو
- ❌ نقص: `aria-expanded` روی تریگر نیست — در کلون اضافه کن

### ناو موبایل — پیل پایینی (≤767px) (✅/📏)
- همان `header.topbar` می‌شود `position:fixed; bottom:…` پیل: `width:fit-content`، بک‌گراند شیشه‌ای `color-mix(var(--nav-plate) var(--nav-glass))`، `blur(12px) saturate(190%)`، شین inset چندلایه
- محتوا (📏 روی 390×844): دکمه آیکون خانه، دکمه شورون scroll-to-top، تاگل تم — مرکزچین، y≈756، ارتفاع ≈56px
- **Pill lens**: فیلتر SVG `#pill-lens` با `feDisplacementMap` (refraction شیشه‌ای)؛ normal-map از canvas، آپدیت با `ResizeObserver`؛ فقط `max-width:767px`؛ با `prefers-reduced-transparency` غیرفعال می‌شود. ظاهر پیکسلی دقیق ❓ (بدون GPU تأیید نشده — subtle است)
- لینک‌های ناو داخل پاپ‌اور به‌صورت `navpop__phone` تکرار می‌شوند؛ آیتم‌ها `min-block-size:44px`

### Cover-flow سه‌بعدی سخنرانی‌ها (✅)
- سکشن `.cf` در خانه: ترک scroll-snap با **۸۵** کارت `.cf-item` (تامبنیل + `.cf-shade` + انعکاس `.cf-mirror` + اورلی `.cf-face-ui`)، دکمه‌های دایره‌ای `.cf-nav--prev/next`، نوار تیک `.cf-strip__rail > .cf-strip__thumb`
- هر کارت یک `button.cf-shield` با `aria-label="<Event>. Talk N of 85."` دارد (N=1..85 ✅)
- تامبنیل‌ها: `https://i.ytimg.com/vi/<videoId>/mqdefault.jpg` (۸۵ آیدی یکتا ✅؛ روی `/speaking` دو مورد `maxresdefault`)
- رفتار: کارت وسط scale=1 و رو‌به‌رو، shade محو، face-UI ظاهر، انعکاس اوج می‌گیرد. با JS: درایور `TalksCoverFlow.*.js`؛ بدون JS: مسیر CSS با `animation-timeline: view()` (progressive enhancement — کلاس `.cf:not([data-js])`)
- reduced-motion-aware ✅

### Ask widget (✅ حضور / 🔍 رفتار SSE)
- جزیره SolidJS: `<astro-island component-export="AskPodcast" client:visible>` — **تنها** جزیره خانه؛ hydrate وقتی اسکرول به ویو می‌رسد
- UI: چیپ‌های پیشنهادی «HOSTING MY OWN LLM»، «FINE-GRAINED REACTIVITY»، «WORK/LIFE BALANCE»، «DIVERSITY & INCLUSION» + اینپوت متنی + دکمه «Search with AI»
- سابمیت → استریم SSE به `/api/askPodcast?q=…`؛ حالت pending = انیمیشن ellipsis؛ نتایج + سازنده لینک اشتراک‌گذاری clipboard
- در کلون: UI را عیناً بساز، بک‌اند را mock/stub کن (robots.txt اجازه `/api/` نمی‌دهد)
- ❌ نقص: اینپوت فقط placeholder دارد — در کلون `<label>`/`aria-label` اضافه کن

### Theme toggle (✅/📏)
- `<button type="button" class="theme" aria-label="Switch theme" aria-pressed="false">` + آیکون خورشید/ماه + `<span data-theme-label>`
- کلیک → `data-theme` روی `<html>` برعکس می‌شود، بک‌گراند body `rgb(244,241,234)`↔`rgb(10,7,8)`، لیبل LIGHT↔DARK، `localStorage.setItem("theme", next)`؛ کراس‌فید رنگ‌ها با ترنزیشن `.18s`؛ بدون اورلی/فلش
- کیبورد: دکمه نیتیو، Tab/Enter/Space؛ فوکوس‌رینگ استاندارد

### Footer (✅)
- بلاک برند («Tejas Kumar» + خط بیو) + ۴ ستون: WORK WITH ME (Keynote speaking · AI and React workshops · Where I'll be next · Angel investing · Contact) · READ AND WATCH (Blog · Talk transcripts · ConTejas Code podcast · Fluent React, my book) · ABOUT ME (About · My story · How I'm doing) · ELSEWHERE (X · LinkedIn · YouTube · GitHub · RSS feed)
- نوار پایینی: `© 2026 TEJAS KUMAR, BERLIN` + `Portrait by Taz Singh`

---

## ۵. انیمیشن‌ها (۸ کی‌فریم + قواعد کاهش‌حرکت)

توکن‌های سراسری ✅: `--dur-fast:.18s` · `--dur:.32s` · `--dur-slow:.9s` · `--ease:cubic-bezier(.22,1,.36,1)`. **هیچ** GSAP/ScrollTrigger/Framer/Lottie/Three.js وجود ندارد ✅.

| # | نام | تعریف (verbatim) | timing | trigger |
|---|---|---|---|---|
| ۱ | `ellipsis` | `@keyframes ellipsis { to { width: 1.25em; } }` روی `.ask-result-pending::after` | `.9s steps(4,end) infinite` | حالت pending ویجت Ask (نقاط «…» متحرک تا رسیدن نتایج) |
| ۲ | `thread-head` | `0%{top:0;scale:1} to{top:100%;scale:1}` — دات ۵px قرمز `position:fixed` در ریل چپ | scroll-driven (`animation: linear both thread-head scroll(root)`) | اسکرول کل صفحه؛ progressive enhancement (جای `scroll()` ساپورت نباشد: `scale:0` نامرئی) |
| ۳ | `cf-swing` | 3D swing: `translateX(42%) translateZ(calc(var(--cf-w)*-.62)) rotateY(var(--cf-rot)) scale(.74)` → وسط `translateX(0) translateZ(calc(var(--cf-w)*.42)) rotateY(0) scale(1)` → آینه‌ای | scroll-driven (`animation-timeline: --cf-item`) | ورود/خروج کارت کاور-فلو از مرکز |
| ۴ | `cf-stack` | z-index: `0%,to:1` · `38%,62%:40` · `47%,53%:100` | scroll-driven | ترتیب قرارگیری کارت وسط روی همسایه‌ها |
| ۵ | `cf-dim` | opacity `.86 → .55 → 0 → .55 → .86` (صفر در مرکز) | scroll-driven | اورلی shade روی کارت‌ها |
| ۶ | `cf-faceui` | opacity `0 → 1 → 0` (فقط ±۸٪ مرکز) | scroll-driven | UI عنوان/لینک هر کارت فقط وقتی وسط است |
| ۷ | `cf-mirrorfade` | opacity `.14 → .42 → .14` | scroll-driven | انعکاس کف؛ قوی‌ترین زیر کارت وسط |
| ۸ | `cf-thumb-run` | `translate(0) → translate(100cqi)` روی `.cf-strip__thumb` | scroll-driven (`--cf-scroll`، مشروط به `@supports (timeline-scope:--x)`) | تامب اسکرول‌بار افقی کاور-فلو |

> کی‌فریم‌های ۳–۸ فقط وقتی اعمال می‌شوند که **JS نباشد** (`.cf:not([data-js])`)؛ با JS فعال، `TalksCoverFlow.*.js` همان choreography را درایو می‌کند.

**ترنزیشن‌های مهم** (از ۲۹ قانون ✅): ناو `color .18s` · شورون More `rotate .18s` · آندرلاین متن `text-decoration-color .18s` · آیتم‌های navpop `background-color .18s` · پاپ‌اور `opacity .18s, scale/translate .32s` · کارت‌ها `transform/border-color/box-shadow .32s` · زوم آرتورک کارت `transform .9s → scale(1.04)` روی hover · دکمه‌های کاور-فلو `background/transform .18s` · فلش CTA `transform .18s` · تیلت `transform .32s`.

**prefers-reduced-motion** (✅):
```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after { scroll-behavior:auto !important;
    transition-duration:1ms !important; animation-duration:1ms !important;
    animation-iteration-count:1 !important; }
}
```
به‌علاوه گاردهای JS: تیلت skip می‌شود، کاور-فلو reduced-motion-aware است، pill lens به `prefers-reduced-transparency` احترام می‌گذارد.
**غایب‌های تأییدشده** ✅: هیچ entrance/reveal-on-scroll، هیچ پارالاکس، هیچ page-transition (ناوبری = فول‌لود).

---

## ۶. تعامل‌ها (۱۲ تعامل اصلی + ۲ رفتار مستندشده)

۱. **ThemeToggle** 📏 — کلیک: flip شدن `data-theme`، `localStorage.theme`، لیبل LIGHT/DARK؛ کراس‌فید `.18s`
۲. **MorePopover** 📏 — پاپ‌اور نیتیو؛ Escape می‌بندد؛ شورون می‌چرخد؛ light-dismiss نیتیو
۳. **NavLinks** 📏 — hover: رنگ → `var(--fg)` در `.18s`؛ صفحه فعال: `aria-current="page"`؛ کلیک = فول‌لود
۴. **MobilePillNav** 📏 — پیل پایینی ≤767px؛ آیکون‌های خانه/اسکرول‌به‌بالا/تم؛ فیلتر refraction شیشه‌ای SVG
۵. **TalksCoverFlow** ✅ — ۸۵ کارت، دکمه‌های prev/next، تیک‌ها، scroll-snap، swipe نیتیو؛ دکمه‌ها `<button>` نیتیو (کیبورد OK)
۶. **AskWidget** 🔍 — چیپ‌ها + اینپوت + SSE به `/api/askPodcast`؛ استریم end-to-end تست نشده → در کلون mock
۷. **TiltCards** ✅ — `[data-tilt]` روی `pointermove` با `--rx/--ry/--tz` تیلت می‌شود، روی leave با `transform .32s` برمی‌گردد؛ زیر reduced-motion غیرفعال (کدام کارت‌ها: ❓)
۸. **ProseLinks** ✅ — آندرلاین fade-in در `.18s`
۹. **CTAs** ✅ — بلاک قرمز (`var(--accent)`) با لیبل mono uppercase؛ فلش روی hover nudge می‌خورد (`.18s`)
۱۰. **BlogSlider** ✅-markup — `role="slider"` عمودی با `aria-valuemin/max/now`؛ رفتار کیبورد ❓
۱۱. **ShareLinks** ✅ — لینک‌های X/Bluesky/LinkedIn با `aria-label` در `aside[aria-label="Share this post"]`
۱۲. **TOCNav** ✅ — لینک‌های anchor به هدینگ‌ها؛ `html{scroll-padding-top:6rem}` برای آفست هدر فیکس

**دو رفتار اضافه مستندشده در interactions.md (خارج از لیست ۱۲تایی findings.json):**
۱۳. **PraiseWall hover** ✅ — کارت‌های تستیمونیال: lift (`transform/border-color/box-shadow .32s`) روی hover
۱۴. **Podcast preview embed swap** ✅-code — کلیک روی `[data-ai-podcast-link]`، تعویض preview با امبد `youtube-nocookie` (المان تریگر دقیق ❓)

کراس‌کاتینگ: همه کلیک‌های `[data-track]` → PostHog `capture` با `sendBeacon` (در کلون: analytics را stub کن یا حذف — تصمیم با بیلدر).

---

## ۷. رفتار ریسپانسیو

### ۱۴۴۰×900 (دسکتاپ)
تاپ‌بار strip کامل (لوگو چپ، ۴ لینک + More وسط، تاگل تم راست) · هیرو دو‌ستونه (هدلاین monument چپ، پرتره راست) · ابرو-لیبل‌های BERLIN / AI ENGINEER, IBM بالای گوشه‌ها · کاور-فلو 3D پهن · تستیمونیال masonry سه‌ستونه · فوتر ۴ ستونه.

### ۱۲۸۰×800 (لپ‌تاپ)
ساختار عین ۱۴۴۰؛ تایپ فلویید با `clamp()`/`vw` کوچک می‌شود؛ **هیچ reflow بین ۱۲۸۰ و ۱۴۴۰ نیست** 📏.

### ۷۶۸×1024 (تبلت)
هنوز **strip دسکتاپ** (سوئیچ پیل در `<=767px` است) · لینک‌های ناو بدون wrap جا می‌شوند · هیرو همچنان side-by-side ولی تنگ‌تر · کاور-فلو با geometry دسکتاپ.

### ۳۹۰×844 (موبایل)
- تاپ‌بار strip **حذف** → پیل شناور پایینی (📏 مرکزچین، y≈756، ارتفاع ≈56px)
- هیرو عمودی: هدلاین (دو خط «I'm Tejas / Kumar,») → لید → ردیف لوگو → پرتره تمام‌عرض پایین
- ابرو-لیبل‌های BERLIN / AI ENGINEER, IBM **مخفی** 📏
- تریگر More داخل پیل؛ آیتم‌های `navpop__phone` داخل پاپ‌اور
- فوتر: ستون‌ها wrap می‌شوند (۱–۲ ستونه)
- خط قرمز لبه چپ هیرو **می‌ماند** 📏
- تستیمونیال تک‌ستونه 📏

### ۳۲۰×640 (موبایل کوچک)
همان لی‌آوت ۳۹۰؛ پیل با `max-width:calc(100% - 1.5rem)` ✅؛ **هیچ overflow افقی مشاهده نشد** 📏؛ لیبل‌ها با `.text-micro` ثابت (`.6875rem`) خوانا می‌مانند.

### جدول کامپوننت‌به‌کامپوننت

| کامپوننت | دسکتاپ (≥768px) | موبایل (≤767px) |
|---|---|---|
| Topbar | نوار strip بالا، ناو کامل | پیل شناور پایین، ۳ دکمه آیکونی |
| More | دکمه متنی + شورون | تریگر آیکونی در پیل؛ تکرارهای `navpop__phone` |
| Hero | دو‌ستونه، پرتره راست | stacked، پرتره پایین |
| Hero eyebrows | نمایان | مخفی |
| Cover-flow | spread پهن 3D | geometry باریک‌تر (برک‌پوینت‌های ارتفاع ۸۰۰/۷۰۰/۶۲۰/۵۲۰ روی `--cf-h`) |
| Testimonials | masonry سه‌ستونه | تک‌ستونه |
| Footer sitemap | ۴ ستونه | wrap به ۱–۲ ستونه |
| Theme toggle | متن + آیکون | فقط آیکون (در پیل) |

❓ نامشخص‌ها: برک‌پوینت دقیق stack شدن هیرو بین ۷۶۸ و ۳۹۰ (احتمالاً 640px ولی اندازه‌گیری نشده — برای کلون از `640px` استفاده کن و ویژوال‌تست بگیر)؛ قوانین `(height<=30rem)` رندر نشده‌اند.

---

## ۸. محتوا: تأییدشده ✅ در برابر جعل‌ممنوع 🚫

### ✅ می‌توانی مستقیم استفاده کنی (verbatim از اسپک)
- همه `<title>`ها و H1های جدول بخش ۱
- ۳۱ اسلاگ بلاگ + متای «31 posts, written since 2020, newest first»
- لیبل‌های ناو (Speaking · Story · Podcast · Blog · More) و ۷ آیتم منوی More با نُت‌هایشان
- ۴ ستون فوتر با همه لینک‌ها + «© 2026 TEJAS KUMAR, BERLIN» + «Portrait by Taz Singh»
- متن‌های کوتاه خانه: «I'm Tejas Kumar,» · «I speak at conferences.» · «85 talks at 68 events, 2012 to 2026. Here they all are.» · `INVITE ME TO SPEAK →` · چیپ‌های Ask (۴ مورد بالا) · «Search with AI» · alt پرتره: «Tejas Kumar, AI Engineer at IBM, based in Berlin»
- اینتروی `/talks`: «26 of my 85 recorded talks have a full transcript…»
- ساختار متادیتا: JSON-LD (Person/WebSite/WebPage)، OG کارت‌های 1200×630 در `/img/og/<route>.png` و `/img/og/blog/<slug>.png` (هر ۳۱ مورد HTTP 200 ✅)

### 🚫 جعل نکن — excerpt تأییدشده + placeholder مستند
طبق قانون پروژه، متن‌های بلند Tejas Kumar را **نباید از حدس بازسازی کرد**:
- متن کامل ۳۱ پست بلاگ → از `/llms-full.txt` (۷۷۸KB، منبع authoritative طبق content-structure.md) استخراج کن؛ اگر در دسترس نبود، placeholder با برچسب `[CONTENT PLACEHOLDER — source: /llms-full.txt]` بگذار
- متن کامل ۲۶ ترنسکریپت سخنرانی → همان منبع
- توضیحات ۹۸ اپیزود پادکست → `/podcast/llms.txt` + فید Acast
- نقل‌قول‌های دیوار تحسین (PraiseWall) → placeholder آواتار/نام/متن با برچسب منبع
- محتوای پنل `/status` (مکانیزم «live» ❓) → پنل استاتیک + برچسب «data source unknown»
- هزینه‌های سخنرانی، رویدادهای تقویم، پورتفولیوی investing، متن اتوبیوگرافی `/story` → از `/llms-full.txt`، وگرنه placeholder مستند
- ۸۵ آیدی ویدیوی YouTube کاور-فلو در اسپک enumerate نشده‌اند → در کلون از `mqdefault.jpg` با آیدی‌های واقعی (از سورس زنده) یا placeholder تصویری با همان aspect استفاده کن؛ آیدی جعلی نساز

---

## ۹. یافته‌های findings.json: فرضیات تأییدنشده و محدودیت‌ها

### ❓ ۹ فرضیه تأییدنشده (unverified_assumptions)
1. نام/اسلات دقیق کامپوننت‌های Astro (نام‌های فعلی behavior-based هستند)
2. مکانیزم «live» دیتای صفحه `/status`
3. رفتار ران‌تایم `/demos/tavus`
4. ظاهر پیکسلی دقیق pill-lens refraction (بدون GPU تأیید نشده)
5. برک‌پوینت stack شدن هیرو بین ۷۶۸ و ۳۹۰ (احتمالاً 640px)
6. ورژن Sentry SDK
7. UX استریم Ask end-to-end
8. جزئیات فیزیک drag کاروسل
9. کدام کارت‌ها `[data-tilt]` دارند

### ⚠️ ۷ محدودیت بازرسی (limitations)
1. Playwright حین کار نصب شد؛ فقط headless-shell، بدون تأیید GPU برای pill-lens
2. تایمینگ‌های ترنزیشن از تعریف CSS خوانده شدند، نه پروفایل فریم‌به‌فریم
3. پایپ‌لاین محتوا (content collections) عمومی نیست؛ corpus از `/llms-full.txt`
4. بک‌اندهای `/api/*` صدا زده نشدند (robots.txt اجازه نمی‌دهد)
5. استریم SSE ویجت Ask end-to-end اجرا نشد
6. screen reader در دسترس نبود (یافته‌های ARIA از مارکاپ/CSS است)
7. صفحات داخلی `/podcast/ep/*` و `/talks/*` رندر نشدند (قالب استنباطی)

### 🐛 نقص‌های دسترس‌پذیری که در کلون باید فیکس شوند
1. به اینپوت Ask یک `<label>`/`aria-label` اضافه کن (فعلاً فقط placeholder)
2. لینک skip-to-content به `#main` اضافه کن (اصلاً وجود ندارد)
3. `aria-expanded` روی دکمه «More pages» toggle شود (اصلاً وجود ندارد)
4. به ۳ لینک `target=_blank` بدون `rel` (پروفایل LinkedIn + دو لینک فرم پادکست) `rel="noopener noreferrer"` بده
5. برای نتایج Ask و موقعیت کاروسل `aria-live="polite"` در نظر بگیر
6. همه جفت‌های کنتراست بدنه AA/AAA پاس می‌شوند (۸ جفت اندازه‌گیری‌شده، مثلاً `#0a0708` روی `#f4f1ea` = 17.78:1)

---

## ۱۰. اختلافات بین اسناد + تصمیم پیشنهادی

| # | اختلاف | اسناد درگیر | تصمیم |
|---|---|---|---|
| ۱ | تعداد talkها: «۸۵» در برابر «۲۶» | README/pages.md (کاور-فلو ۸۵تایی، aria-label «Talk N of 85» ✅) در برابر sitemap (۲۶ ترنسکریپت ✅) | **هر دو درست‌اند**: ۸۵ سخنرانی در کاروسل خانه («85 talks at 68 events, 2012 to 2026»)، که ۲۶ تایش ترنسکریپت کامل دارد («26 of my 85 recorded talks…»). در کلون هر دو را پیاده کن |
| ۲ | تعداد کی‌فریم‌ها: «۷» در برابر «۸» | README («All 7 keyframes») در برابر animations.md + findings.json (۸ مورد) | **۸**: هفت‌تای اول روی خانه‌اند، هشتمی (`cf-thumb-run`) در CSS کاور-فلوست. هر ۸ را پیاده کن |
| ۳ | تعداد تعامل‌ها: «۱۲» در برابر «۱۴» | findings.json (۱۲ interaction) در برابر interactions.md («14 interactive components») | **۱۴ رفتار مستندشده**؛ لیست ۱۲تایی findings.json دو مورد (hover کارت‌های PraiseWall و embed-swap پادکست) را جا انداخته. هر ۱۴ را پیاده کن (بخش ۶) |
| ۴ | تعداد اسکرین‌شات‌های evidence: «۴۶» در برابر «۴۵» | README + findings.json + visual-test-plan (۴۶) در برابر `ls` واقعی پوشه (۴۵) | **حقیقت پوشه = ۴۵ فایل**. شماره‌گذاری visual-test-plan هم off-by-one است (بازه ۳۲–۴۶ پانزده شماره برای ۱۴ روت). مرجع ویژوال‌تست = لیست بخش ۱۱ همین فایل |
| ۵ | نسخه موبایل `/speaking` و `/about` و `/blog` | responsive-behavior می‌گوید ۴ صفحه در موبایل رندر شدند | ✅ هر سه فایل در evidence هست (`mobile-390x844_{about,blog,speaking}_full.png`) — برای ویژوال‌تست موبایل از همین‌ها استفاده کن |
| ۶ | `.text-scripture` مصرف‌کننده ندارد | design-system.md §8 | توکن ✅ تأییدشده ولی بلااستفاده؛ در کلون توکن را نگه دار ولی بهش تکیه نکن |
| ۷ | تم پیش‌فرض | design-system.md: «dark is the fallback default» | ✅ سازگار با همه‌جا؛ اسکریپت init باید دقیقاً همین منطق را داشته باشد (`prefers-color-scheme: light` → light، وگرنه dark) |

---

## ۱۱. لیست اسکرین‌شات‌های evidence/ (۴۵ فایل)

قالب نام: `<viewport>_<page>_<state>.png`. تم فایل‌های بدون پسوند تم = تم پیش‌فرض مرورگر headless (🔍 احتمالاً dark طبق fallback؛ در visual-test-plan مبنا نگیر مگر state صریح).

### دسکتاپ 1440×900 (۲۶ فایل)
| فایل | صفحه/روت حدسی | state/تم |
|---|---|---|
| `desktop-1440x900_home_top.png` | `/` | بالای صفحه (تم پیش‌فرض) |
| `desktop-1440x900_home_midscroll.png` | `/` | میانه اسکرول (سکشن تستیمونیال) |
| `desktop-1440x900_home_bottom.png` | `/` | پایین صفحه (فوتر) |
| `desktop-1440x900_home_full.png` | `/` | فول‌پیج |
| `desktop-1440x900_home_theme-dark.png` | `/` | تم dark صریح |
| `desktop-1440x900_home_theme-light.png` | `/` | تم light صریح |
| `desktop-1440x900_home_theme-toggled.png` | `/` | بعد از کلیک واقعی تاگل (dark) |
| `desktop-1440x900_home_theme-toggled2.png` | `/` | تکرار/وضعیت دوم تاگل (در visual-test-plan نام‌برده نشده) |
| `desktop-1440x900_home_navpop-open.png` | `/` | پاپ‌اور More باز |
| `desktop-1440x900_home_nav-hover.png` | `/` | هاور روی لینک ناو |
| `desktop-1440x900_home_coverflow.png` | `/` | کراپ کاور-فلو |
| `desktop-1440x900_home_reduced-motion.png` | `/` | `prefers-reduced-motion: reduce` |
| `desktop-1440x900_about_full.png` | `/about` | فول‌پیج |
| `desktop-1440x900_story_full.png` | `/story` | فول‌پیج |
| `desktop-1440x900_speaking_full.png` | `/speaking` | فول‌پیج |
| `desktop-1440x900_workshops_full.png` | `/workshops` | فول‌پیج |
| `desktop-1440x900_preaching_full.png` | `/preaching` | فول‌پیج |
| `desktop-1440x900_calendar_full.png` | `/calendar` | فول‌پیج |
| `desktop-1440x900_investing_full.png` | `/investing` | فول‌پیج |
| `desktop-1440x900_status_full.png` | `/status` | فول‌پیج |
| `desktop-1440x900_talks_full.png` | `/talks` | فول‌پیج |
| `desktop-1440x900_react_full.png` | `/react` | فول‌پیج |
| `desktop-1440x900_blog_full.png` | `/blog` | فول‌پیج |
| `desktop-1440x900_podcast_full.png` | `/podcast` | فول‌پیج |
| `desktop-1440x900_demos_tavus_full.png` | `/demos/tavus` | فول‌پیج |
| `desktop-1440x900_blog_local-llm-vs-cloud_full.png` | `/blog/local-llm-vs-cloud` | فول‌پیج مقاله نمونه |

### لپ‌تاپ 1280×800 (۴ فایل)
`laptop-1280x800_home_top.png` · `laptop-1280x800_home_midscroll.png` · `laptop-1280x800_home_bottom.png` · `laptop-1280x800_home_full.png` — همه `/`، stateهای استاندارد.

### تبلت 768×1024 (۴ فایل)
`tablet-768x1024_home_top.png` · `tablet-768x1024_home_midscroll.png` · `tablet-768x1024_home_bottom.png` · `tablet-768x1024_home_full.png` — همه `/`؛ نکته: در این عرض هنوز strip دسکتاپ دیده می‌شود.

### موبایل 390×844 (۷ فایل)
`mobile-390x844_home_top.png` · `mobile-390x844_home_midscroll.png` · `mobile-390x844_home_bottom.png` · `mobile-390x844_home_full.png` — `/` با پیل پایینی · `mobile-390x844_about_full.png` → `/about` · `mobile-390x844_blog_full.png` → `/blog` · `mobile-390x844_speaking_full.png` → `/speaking`.

### موبایل کوچک 320×640 (۴ فایل)
`smallmobile-320x640_home_top.png` · `smallmobile-320x640_home_midscroll.png` · `smallmobile-320x640_home_bottom.png` · `smallmobile-320x640_home_full.png` — همه `/`؛ چک عدم overflow افقی.

---

## ۱۲. چک‌لیست پیاده‌سازی (ترتیب پیشنهادی بیلد)

1. **توکن‌ها**: بلاک `:root` بخش ۳ (هر hex باید دقیق match شود — تست P8 در visual-test-plan) + فونت‌های self-hosted (۸ فایل woff2؛ فقط Jost و Switzer-400 پری‌لود) + گرین SVG و وینیت
2. **تم**: اسکریپت blocking در `<head>` با منطق localStorage → matchMedia → پیش‌فرض dark؛ `data-theme` روی `<html>`
3. **کروم سراسری**: Topbar (strip/pill با برک‌پوینت 768px) + MorePopover نیتیو (۷ آیتم) + ThemeToggle + SiteFooter (۴ ستون) — مارکاپ یکسان همه صفحات
4. **خانه**: ۶ سکشن به ترتیب بخش ۲؛ هیرو با خط قرمز لبه چپ
5. **Cover-flow**: ۸۵ کارت + کنترل‌ها + کی‌فریم‌های ۳–۸ (مسیر no-JS) و درایور JS (مسیر اصلی)
6. **Ask widget**: UI کامل + mock برای `/api/askPodcast` (SSE)؛ اینپوت را label‌دار بساز
7. **صفحات محتوا**: قالب‌های blog/post، talks/row، podcast، بقیه روت‌های سطح‌اول؛ متن‌ها از `/llms-full.txt` وگرنه placeholder برچسب‌دار
8. **موشن**: ۸ کی‌فریم + ترنزیشن‌ها + بلاک reduced-motion + گاردهای JS
9. **فیکس‌های دسترس‌پذیری** (۶ مورد بخش ۹) — این‌ها را از نسخه اصلی بهتر بساز
10. **ویژوال‌تست**: ماتریس بخش ۱۱ + پروسیجرهای P1–P8 از visual-test-plan؛ معیار قبولی: صفر overflow افقی در 320px، کنتراست ≥4.5:1، persist تم بدون فلش، کیبورد-اپرِبل بودن پاپ‌اور/تاگل/کاروسل، صفر console error

### استک پیشنهادی کلون (معادل تأییدشده اصلی)
Astro 7 SSG + Vite · SolidJS island برای Ask (`client:visible`) · هاست استاتیک (Vercel یا معادل) · بدون روتر کلاینت‌ساید · بدون GSAP/Three.js · PostHog/Sentry/WebMCP اختیاری (در کلون stub یا حذف — تصمیم بیلدر، ولی `data-track` را نگه دار اگر آنالیتیکس می‌خواهی).
