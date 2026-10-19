# گزارش مقایسه‌ی بصری — کلون tej.as

- تاریخ: ۱۶ اکتبر ۲۰۲۶ — اجرا روی `http://localhost:4321` (astro dev)
- مرجع: `~/workspace/goals/muse1241-bot/files/tej-clone-spec/evidence/` (فقط خوانده شد، تغییری نکرد)
- شات‌های لوکال: `~/workspace/tej-clone/_docs/visual-tests/` (۴۴ فایل PNG + ‏`report.json`)
- اسکریپت تست: `~/workspace/tej-clone/_docs/visual-tests/run.mjs`

**قانون صداقت:** هیچ‌جا ادعای pixel-perfect نشده. وضعیت‌ها: `match` / `minor-diff` / `major-diff` / `not-compared`.

**یادداشت‌های کلی (قبل از جدول):**
- در همه‌ی شات‌های لوکال، نوار ابزار dev آسترو (`<astro-dev-toolbar>`) در لبه‌ی پایین دیده می‌شود — آرتیفکت حالت dev است، در پروداکشن نیست.
- تامبنیل‌های YouTube (`i.ytimg.com`) در سندباکس بلاک‌اند (`ERR_TUNNEL_CONNECTION_FAILED`)؛ کارت‌های کاور-فلو به‌جای عکس، باکس مشکی + آیکن تصویر خراب نشان می‌دهند. خطای محیطی است، نه باگ کلون. fallback تصویری برای این حالت وجود ندارد (نکته‌ی بهبود، نه باگ).
- ~~در همه‌ی شات‌ها کنار لوگوی «TEJAS KUMAR.» یک آیکن خانه‌ی اضافه هست که در مرجع نیست (minor سیستماتیک).~~ — ✅ فیکس شد (۱۶ اکتبر): آیکن اضافه از لوگوی دسکتاپ حذف شد.
- محتواهای اصلی سایت واقعی (متن کامل بلاگ، نقل‌قول‌ها، تایم‌لاین) عمداً در کلون با پلیس‌هولدرهای برچسب‌دار جایگزین شده‌اند («…NOT IN EVIDENCE PACKAGE») — تصمیم طراحی آگاهانه است، نه باگ؛ ولی در مقایسه‌ها major-diff محتوایی ثبت شده.

## خانه (/)

| صفحه/ویوپورت | فایل مرجع | فایل لوکال | وضعیت | توضیح |
|---|---|---|---|---|
| 1440×900 top، روشن | `desktop-1440x900_home_top.png` | `home-1440x900-top-light.png` | minor-diff | هدلاین ۳خطی، کامای قرمز، پرتره، ردیف لوگوها، خط قرمز چپ، نوبار — همه سر جایشان. تفاوت: آیکن خانه‌ی اضافه کنار لوگو + تولبار dev در لبه‌ی پایین شات. |
| 1440×900 top، تاریک | `desktop-1440x900_home_theme-dark.png` | `home-1440x900-top-dark.png` | minor-diff | چیدمان و تم یکسان. نکته: فایل مرجع `theme-dark` لیبل «☾ LIGHT» نشان می‌دهد ولی مرجع `theme-toggled` (وضعیت واقعی بعد از کلیک) «☾ DARK» است — یعنی خود evidence در این دو فایل ناسازگار است؛ کلون با وضعیت واقعی بعد از تاگل (toggled) مطابق است. |
| no-flash تاریک/روشن | — | `home-theme-dark-noflash.png` / `home-theme-light-noflash.png` | match | بلافاصله بعد از `domcontentloaded` (بدون انتظار): `document.documentElement.dataset.theme` دقیقاً `dark`/`light` بود — تم قبل از paint ست شده، فلش تم اشتباه دیده نشد. |
| 1440×900 میانه (Praise) | `desktop-1440x900_home_midscroll.png` | `home-1440x900-midscroll.png` | major-diff | محتوا: مرجع دیوار واقعی نقل‌قول‌های X است؛ لوکال ۶ کارت نمونه با برچسب صریح «SAMPLE PRAISE». چیدمان (گرید ۳ستونه‌ی کارت‌ها) نزدیک است → تفاوت چیدمانی minor. |
| 1440×900 پایین (فوتر) | `desktop-1440x900_home_bottom.png` | `home-1440x900-bottom.png` | minor-diff | ساختار فوتر ۵ستونه سالم و یکسان با بقیه‌ی صفحات؛ مقایسه‌ی پیکسل‌به‌پیکسل تفصیلی انجام نشد. |
| 1440×900 تمام‌صفحه | `desktop-1440x900_home_full.png` | `home-1440x900-full.png` | minor-diff | همه‌ی سکشن‌ها (هیرو، کتاب، کاور-فلو، Praise، Ask، بلاگ/پادکست، فوتر) رندر می‌شوند؛ `hOverflow=0`. |
| 1280×800 top | `laptop-1280x800_home_top.png` | `home-1280x800-top.png` | minor-diff | مشابه ۱۴۴۰؛ فقط آیکن خانه‌ی اضافه. |
| 768×1024 top | `tablet-768x1024_home_top.png` | `home-768x1024-top.png` | minor-diff | نوبار نواری (strip) دیده می‌شود (مطابق پلن P5 برای ≥768)؛ هیرو چیده‌شده؛ «AND MORE» در هر دو نسخه به خط بعد می‌رود — مطابق مرجع. |
| 390×844 top | `mobile-390x844_home_top.png` | `home-390x844-top.png` | minor-diff | پیل پایینی فیکس، هیرو انباشته، eyebrows مخفی — مطابق مرجع. ✅ فیکس شد (۱۶ اکتبر): هر ۵ لوگو حالا در یک ردیف‌اند (تأیید با شات مجدد `/tmp/fix-mobile-hero.png`). |
| 320×568 top | `smallmobile-320x640_home_top.png` (مرجع ۶۴۰ است، لوکال ۵۶۸) | `home-320x568-top.png` | minor-diff | بدون overflow افقی (`hOverflow=0`)؛ هیرو و پیل سالم. مقایسه‌ی مستقیم ابعادی ممکن نبود (ارتفاع متفاوت). |
| پاپ‌اور More باز | `desktop-1440x900_home_navpop-open.png` | `home-navpop-open.png` | minor-diff | ۷ آیتم با لیبل و توضیح، شورون چرخیده — دقیقاً مطابق مرجع. فقط آیکن خانه‌ی اضافه. |
| هاور نوبار | `desktop-1440x900_home_nav-hover.png` | `home-nav-hover.png` | not-compared | شات گرفته شد؛ مقایسه‌ی تفصیلی انجام نشد. |
| reduced-motion | `desktop-1440x900_home_reduced-motion.png` | `home-reduced-motion.png` + `home-coverflow-reduced-motion.png` | match | با emulate ‏`prefers-reduced-motion: reduce` کارت‌های کاور-فلو فلت‌اند (`translateX(0) translateZ(0) rotateY(0deg) scale(1)`) — با تست تعاملی تأیید شد. |

## کاور-فلو

| صفحه/ویوپورت | فایل مرجع | فایل لوکال | وضعیت | توضیح |
|---|---|---|---|---|
| کراپ 1440 | `desktop-1440x900_home_coverflow.png` | `home-coverflow-crop.png` | minor-diff | ✅ فیکس شد (۱۶ اکتبر): هدر سکشن چپ‌چین با دکمه‌ی مستطیلی قرمز شد — مطابق مرجع (تأیید با شات مجدد `/tmp/fix-cf-header.png`). باقی‌مانده: تامبنیل کارت وسط در سندباکس لود نشد (بلاک i.ytimg.com — محیطی). کارت وسط بزرگ و خوانا، کارت‌های کناری چرخیده — مطابق نیازمندی. |
| بدون JS | — | `home-coverflow-nojs.png` | match (requirement) | بدون هیچ اسکریپتی (HTML با تگ‌های `<script>` حذف‌شده): کارت وسط بزرگ و خوانا، کارت‌های کناری چرخیده، دکمه‌های prev/next دیده می‌شوند. نکته‌ی ابزاری: ‏`javaScriptEnabled:false` پلی‌رایت و `Emulation.setScriptExecutionDisabled` در کرومیوم این سندباکس بی‌اثر بودند؛ با روش جایگزین (حذف اسکریپت‌ها از HTML) شات واقعی بدون JS گرفته شد. |

## صفحات سطح‌اول (full-page در 1440، همه HTTP 200 و بدون overflow افقی)

| صفحه | فایل مرجع | فایل لوکال | وضعیت | توضیح |
|---|---|---|---|---|
| /about | `desktop-1440x900_about_full.png` | `page-about-full.png` | major-diff (محتوا) | زبان بصری (هیرو، breadcrumb، سکشن‌ها، فوتر) یکسان → minor بصری؛ محتوا ساده‌سازی شده با پلیس‌هولدرهای برچسب‌دار (تایم‌لاین، نقل‌قول‌ها) — آگاهانه. |
| /story | `desktop-1440x900_story_full.png` | `page-story-full.png` | minor-diff | رندر سالم؛ مقایسه‌ی تفصیلی انجام نشد. |
| /speaking | `desktop-1440x900_speaking_full.png` | `page-speaking-full.png` | major-diff (محتوا) | مرجع ~۳۱۶۰۰px با آرشیو کامل تاک‌هاست؛ لوکال صفحه‌ی «Invite me to speak» فشرده (Topics، جدول Formats & fees، CTA) است. ساختار تمیز ولی محتوا/دامنه‌ی صفحه متفاوت. |
| /workshops | `desktop-1440x900_workshops_full.png` | `page-workshops-full.png` | minor-diff | رندر سالم؛ مقایسه‌ی تفصیلی انجام نشد. |
| /preaching | `desktop-1440x900_preaching_full.png` | `page-preaching-full.png` | minor-diff | رندر سالم؛ مقایسه‌ی تفصیلی انجام نشد. |
| /calendar | `desktop-1440x900_calendar_full.png` | `page-calendar-full.png` | minor-diff | رندر سالم؛ مقایسه‌ی تفصیلی انجام نشد. |
| /investing | `desktop-1440x900_investing_full.png` | `page-investing-full.png` | minor-diff | رندر سالم؛ مقایسه‌ی تفصیلی انجام نشد. |
| /status | `desktop-1440x900_status_full.png` | `page-status-full.png` | minor-diff | رندر سالم؛ مقایسه‌ی تفصیلی انجام نشد. |
| /talks | `desktop-1440x900_talks_full.png` | `page-talks-full.png` | minor-diff | رندر سالم؛ مقایسه‌ی تفصیلی انجام نشد. |
| /react | `desktop-1440x900_react_full.png` | `page-react-full.png` | minor-diff | رندر سالم؛ مقایسه‌ی تفصیلی انجام نشد. |
| /blog | `desktop-1440x900_blog_full.png` | `page-blog-full.png` | minor-diff | رندر سالم؛ مقایسه‌ی تفصیلی انجام نشد. |
| /podcast | `desktop-1440x900_podcast_full.png` | `page-podcast-full.png` | minor-diff | رندر سالم؛ مقایسه‌ی تفصیلی انجام نشد. |
| /demos/tavus | `desktop-1440x900_demos_tavus_full.png` | `page-demos-tavus-full.png` | minor-diff | رندر سالم؛ مقایسه‌ی تفصیلی انجام نشد. |
| موبایل 390: about/blog/speaking | `mobile-390x844_{about,blog,speaking}_full.png` | `mobile-390x844-*-full.png` | not-compared | هر سه ۲۰۰ و بدون overflow؛ مقایسه‌ی تفصیلی انجام نشد. |

## صفحات داخلی محتوا

| صفحه | فایل مرجع | فایل لوکال | وضعیت | توضیح |
|---|---|---|---|---|
| پست بلاگ `/blog/local-llm-vs-cloud` | `desktop-1440x900_blog_local-llm-vs-cloud_full.png` | `page-blog-post-full.png` | major-diff (محتوا) / minor (چیدمان) | مرجع متن کامل مقاله با جدول، نمودار و باکس sticky «ON THIS PAGE» در ستون راست دارد؛ لوکال تک‌ستونه با `[CONTENT PLACEHOLDER]` است (آگاهانه). breadcrumb لوکال سه‌سطحی (`TEJAS KUMAR / BLOG / TITLE`) در برابر دوسطحی مرجع (`TEJAS KUMAR / WRITING`) — minor. |
| ترنسکریپت تاک `/talks/agent-conf-2026` | — (در evidence نیست؛ gap شناخته‌شده‌ی پلن) | `page-talk-transcript-full.png` | not-compared | HTTP 200، رندر سالم، بدون overflow. |
| اپیزود پادکست `/podcast/ep/how-to-build-tech-software-full-stack-engineering` | — (gap شناخته‌شده) | `page-podcast-episode-full.png` | not-compared | HTTP 200، رندر سالم، بدون overflow. |
| ۴۰۴ | — | `page-404.png` | not-compared | استاتوس واقعی ۴۰۴؛ هیروی «Lost?» با دو دکمه‌ی «BACK HOME» و «READ THE BLOG»؛ تمیز. یک پیام console موردانتظار «Failed to load resource: 404» روی همین صفحه ثبت شد. |

## خلاصه‌ی تفاوت‌های major (پس از فیکس‌های ۱۶ اکتبر)

1. ~~**هدر سکشن کاور-فلو**: وسط‌چین + دکمه‌ی pill در برابر چپ‌چین + دکمه‌ی مستطیلی مرجع.~~ — ✅ فیکس شد.
2. **محتوای placeholder**: Praise، تایم‌لاین about، متن کامل بلاگ، آرشیو speaking — همه با پلیس‌هولدرهای برچسب‌دار (تصمیم آگاهانه‌ی کلون، نه باگ؛ ولی در مقایسه major-diff محتوایی‌اند).
3. **minorهای باقی‌مانده**: ~~آیکن خانه‌ی اضافه کنار لوگو~~ (✅ فیکس شد)؛ ~~wrap زودهنگام ردیف لوگوها در 390~~ (✅ فیکس شد)؛ ناسازگاری داخلی evidence بین `theme-dark` و `theme-toggled` در لیبل دکمه‌ی تم (کلون با وضعیت واقعی بعد از تاگل مطابق است — تصمیم درست).
