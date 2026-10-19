# گزارش تست تعاملی — کلون tej.as

- تاریخ: ۱۶ اکتبر ۲۰۲۶ — اجرا روی `http://localhost:4321` (astro dev)
- ابزار: Playwright/Chromium — اسکریپت `~/workspace/tej-clone/_docs/visual-tests/run.mjs`
- نتیجه‌ی نهایی: **۲۹/۲۹ پاس** (یک دور اول ۲۳/۲۹ بود؛ ۶ مورد خطای اسکریپت تست بود نه باگ سایت — جزئیات پایین)
- لاگ خام: `~/workspace/tej-clone/_docs/visual-tests/report.json`

## نتایج تست‌ها

| تست | نتیجه | جزئیات |
|---|---|---|
| I1-theme-toggle | pass | کلیک روی `button[aria-label="Switch theme"]`: ‏`data-theme` روی `html` از light به dark رفت، `localStorage.theme='dark'` ثبت شد، لیبل دکمه «Dark» شد. |
| I1-theme-label | pass | لیبل بعد از تاگل: «Dark» (حالت LIGHT↔DARK عوض می‌شود). |
| I1-theme-persist | pass | بعد از reload تم dark حفظ شد؛ در `domcontentloaded` (قبل از paint) ‏`data-theme=dark` بود — no-flash تأیید شد. |
| I2-popover-open-7items | pass | کلیک روی `[popovertarget="nav-more"]` → ‏`#nav-more:popover-open` برقرار، دقیقاً ۷ آیتم قابل‌مشاهده (Calendar, Workshops, Book, About, Status, Investing, Contact)، ‏`aria-expanded="true"` سینک شد. |
| I2-popover-escape | pass | فشردن Escape → پاپ‌اور بسته شد و `aria-expanded="false"` برگشت. |
| I2-popover-link-200 | pass | لینک اول پاپ‌اور (`/calendar`) → HTTP 200. |
| I3-pill-fixed-bottom | pass | در 390×844 هدر topbar با `position: fixed` در پایین ویوپورت است (`y=764, h=64`). |
| I3-scroll-to-top | pass | اسکرول به انتهای صفحه (`y=7145`) → کلیک روی `[data-scroll-top]` → برگشت به `y=0`. |
| I4-cf-85-shields | pass | دقیقاً ۸۵ دکمه‌ی `button.cf-shield`؛ نمونه‌ی aria-label: «AI Engineer World's Fair 2026 (Workshop). Talk 1 of 85.» (حاوی «Talk N of 85»). |
| I4-cf-next-center-changes | pass | کلیک next: ‏`scrollLeft` از ۰ به ۷۳۶ رفت و کارت وسط از ایندکس ۰ به ۱ عوض شد. |
| I4-cf-prev | pass | کلیک prev: ‏`scrollLeft` به ۰ برگشت. |
| I4-cf-keyboard-arrowright | pass | فوکوس روی ترک + `ArrowRight` → ‏`scrollLeft` از ۰ به ۷۳۶ (کیبورد کار می‌کند). |
| I5-ask-results-real-links | pass | تایپ «react» + سابمیت → ۶ نتیجه با لینک‌های واقعی (مثل `/talks/react-universe-meetup-berlin-2026`، `/blog/what-is-react-fiber`) — همه با الگوی مسیرهای واقعی سایت مطابق‌اند، بدون نقل‌قول جعلی. |
| I5-ask-copy-link | pass | دکمه‌ی «Copy link» بعد از نتایج ظاهر شد؛ بعد از کلیک لیبل «Copied!» شد. |
| I5-ask-chip | pass | کلیک روی چیپ پیشنهادی → ۸ نتیجه آمد. |
| I5-ask-escape-clears | pass | فوکوس روی اینپوت + Escape → نتایج کاملاً پاک شدند. |
| I5-ask-links-resolve | pass | ۴ لینک اول نتایج تک‌تک باز شدند و همه HTTP 200 دادند. |
| I6-nav-/speaking | pass | HTTP 200. |
| I6-nav-/story | pass | HTTP 200. |
| I6-nav-/podcast | pass | HTTP 200. |
| I6-nav-/blog | pass | HTTP 200. |
| I7-reduced-cf-flat | pass | با emulate ‏`prefers-reduced-motion: reduce`: ترنسفورم کارت‌ها `translateX(0px) translateZ(0px) rotateY(0deg) scale(1)` — کاملاً فلت. |
| I7-reduced-ask-at-once | pass | در حالت reduced-motion نتایج Ask یکجا نمایش داده شدند (۶ نتیجه در ~۹۰۰ms). |
| I8-overflow (۵ مورد) | pass | `/` در 1440/390/320، `/blog` در 390، `/speaking` در 768 — هیچ overflow افقی (`scrollWidth <= innerWidth`). در هر ۴۴ شات هم `hOverflow=0` ثبت شد. |
| I9-nojs-renders | pass | صفحه بدون خطای JS رندر می‌شود (`h1` موجود، HTTP 200)؛ شات واقعی بدون JS هم جداگانه گرفته شد (کاور-فلو: کارت وسط بزرگ و خوانا، کناری‌ها چرخیده). |

## لاگ console errorها

در همه‌ی لودهای صفحه `console` (نوع error)، ‏`pageerror` و `requestfailed` شنود شد:

1. **تامبنیل‌های YouTube** (`https://i.ytimg.com/vi/.../mqdefault.jpg`): ‏`net::ERR_TUNNEL_CONNECTION_FAILED` — در ۲۴ شات صفحه‌ی خانه تکرار شد. علت: بلاک بودن `i.ytimg.com` در سندباکس (مطابق انتظار بریف). هیچ `pageerror` (خطای JS) در هیچ صفحه‌ای رخ نداد.
2. **صفحه‌ی ۴۰۴**: یک پیام `console: Failed to load resource: the server responded with a status of 404` — موردانتظار روی خود صفحه‌ی ۴۰۴ است.
3. در صفحات داخلی (about، blog، speaking، …) **هیچ** console error ثبت نشد.

نتیجه: صفر خطای جاوااسکریپت؛ تنها خطاها شبکه‌ای/محیطی‌اند.

## موارد not-tested و شفاف‌سازی‌ها

- **شات no-JS کاور-فلو**: ‏`javaScriptEnabled: false` پلی‌رایت و `Emulation.setScriptExecutionDisabled` در کرومیوم این سندباکس هر دو بی‌اثر بودند (JS همچنان اجرا می‌شد). با روش جایگزین — حذف همه‌ی تگ‌های `<script>` از HTML خام و رندر آن — شات واقعی بدون JS گرفته شد (`home-coverflow-nojs.png`).
- **۶ فیل دور اول** (قبل از اصلاح اسکریپت) باگ سایت نبودند، باگ تست بودند: ‏`addInitScript` روی reload هم theme را ریست می‌کرد (I1)؛ سلکتور پاپ‌اور لیست مخفی موبایل را هم می‌شمرد (I2)؛ آستانه‌ی سخت‌گیرانه‌ی `scrollY < 50` برای اسکرول smooth (I3)؛ فرمت دقیق aria-label شیلدها (I4)؛ محاسبه‌ی کارت وسط روی دکمه به‌جای `.cf-item` (I4)؛ خواندن ترنسفورم از دکمه به‌جای `.cf-item` (I7). همه اصلاح و دوباره پاس شدند.
- **تداخل تولبار dev آسترو**: در یک دور، `<astro-dev-toolbar>` کلیک روی دکمه‌ی scroll-to-top پیل را بلاک کرد (۳۰ ثانیه تایم‌اوت). با حذف تولبار از DOM در تست حل شد — آرتیفکت حالت dev است، در پروداکشن رخ نمی‌دهد.
- GPU-render لنز پیل (refraction) در پلن به‌عنوان gap شناخته‌شده بود — تست نشد.

## تغییرات در ریپو

**هیچ تغییری در کد سایت داده نشد** — فقط ابزار تست اضافه شد (طبق قرارداد خروجی بریف):
- `~/workspace/tej-clone/_docs/visual-tests/run.mjs` — اسکریپت تست (قابل اجرای مجدد: `node _docs/visual-tests/run.mjs`)
- `~/workspace/tej-clone/_docs/visual-tests/*.png` (۴۴ شات) و `report.json`
- `~/workspace/tej-clone/_docs/screenshot-comparison-report.md` و `~/workspace/tej-clone/_docs/interaction-test-report.md`

باگ کرش‌کننده‌ای دیده نشد؛ چیزی برای فیکس اضطراری نبود — فقط گزارش شد.
