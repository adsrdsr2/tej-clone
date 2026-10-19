/* AskWidget — local AI-search simulation for the tej.as clone.
 *
 * Unofficial reproduction for study purposes — not the site owner's
 * official widget. There is no real /api/askPodcast backend in this
 * static build, so search runs against the local content.json index
 * and results are revealed with a chunked "streaming" effect that
 * mimics the original SSE experience.
 *
 * SSR-safe: no window/document access at module top level. All browser
 * APIs are touched only inside event handlers / onMount (client only).
 */
import {
  createSignal,
  createMemo,
  For,
  Show,
  onCleanup,
  onMount,
} from "solid-js";
import content from "../data/content.json";
import { u } from "../lib/url";

/* ---------- types ---------- */
type Kind = "blog" | "talk" | "podcast";

interface Doc {
  slug: string;
  title: string;
  description: string;
  kind: Kind;
  href: string;
}

interface Hit extends Doc {
  score: number;
}

type Status = "idle" | "pending" | "streaming" | "done" | "error";

const KIND_LABEL: Record<Kind, string> = {
  blog: "Blog",
  talk: "Talk",
  podcast: "Podcast",
};

const SUGGESTIONS = [
  "HOSTING MY OWN LLM",
  "FINE-GRAINED REACTIVITY",
  "WORK/LIFE BALANCE",
  "DIVERSITY & INCLUSION",
] as const;

const STOPWORDS = new Set(
  "a,an,the,and,or,of,to,in,on,for,with,by,is,are,was,were,be,been,as,at,from,that,this,these,those,it,its,i,you,he,she,we,they,them,his,her,their,our,your,my,me,do,does,did,how,what,why,when,where,which,who,whom,can,could,should,would,about,tell,me".split(
    ","
  )
);

/* ---------- build the search index (SSR-safe) ---------- */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s&+-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

function buildIndex(): Doc[] {
  const docs: Doc[] = [];
  try {
    const data = content as {
      blog?: { slug: string; title: string; description?: string }[];
      transcripts?: { slug: string; title: string; event?: string }[];
      episodes?: { slug: string; title: string }[];
    };
    for (const b of data.blog ?? [])
      docs.push({
        slug: b.slug,
        title: b.title,
        description: b.description ?? "",
        kind: "blog",
        href: u(`/blog/${b.slug}`),
      });
    for (const t of data.transcripts ?? [])
      docs.push({
        slug: t.slug,
        title: t.title,
        description: t.event ?? "",
        kind: "talk",
        href: u(`/talks/${t.slug}`),
      });
    for (const e of data.episodes ?? [])
      docs.push({
        slug: e.slug,
        title: e.title,
        description: "",
        kind: "podcast",
        href: u(`/podcast/ep/${e.slug}`),
      });
  } catch {
    /* handled by the caller — index stays empty */
  }
  return docs;
}

const INDEX = buildIndex();

function search(query: string, limit = 8): Hit[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];
  const hits: Hit[] = [];
  for (const doc of INDEX) {
    const titleT = tokenize(doc.title);
    const descT = tokenize(doc.description);
    let score = 0;
    for (const tok of tokens) {
      if (titleT.some((t) => t === tok || t.startsWith(tok))) score += 3;
      else if (titleT.some((t) => tok.length > 3 && t.includes(tok))) score += 2;
      if (descT.some((t) => t === tok || t.startsWith(tok))) score += 2;
    }
    if (score > 0) hits.push({ ...doc, score });
  }
  hits.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  // de-dupe by slug, keep order
  const seen = new Set<string>();
  return hits.filter((h) => !seen.has(h.slug) && (seen.add(h.slug), true)).slice(0, limit);
}

/* ---------- component ---------- */
export default function AskWidget() {
  const [query, setQuery] = createSignal("");
  const [status, setStatus] = createSignal<Status>("idle");
  const [hits, setHits] = createSignal<Hit[]>([]);
  const [introShown, setIntroShown] = createSignal("");
  const [visibleCount, setVisibleCount] = createSignal(0);
  const [copied, setCopied] = createSignal(false);

  let pendingTimer: number | undefined;
  let streamTimer: number | undefined;

  onMount(() => {
    // Deep-link support: prefill from ?q= when the share link is opened.
    try {
      const q = new URLSearchParams(window.location.search).get("q");
      if (q) {
        setQuery(q);
        runSearch(q);
      }
    } catch {
      /* ignore */
    }
  });

  const clearTimers = () => {
    if (pendingTimer !== undefined) {
      clearTimeout(pendingTimer);
      pendingTimer = undefined;
    }
    if (streamTimer !== undefined) {
      clearInterval(streamTimer);
      streamTimer = undefined;
    }
  };
  onCleanup(clearTimers);

  const reducedMotion = () =>
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const runSearch = (raw: string) => {
    clearTimers();
    setHits([]);
    setIntroShown("");
    setVisibleCount(0);
    setCopied(false);

    if (INDEX.length === 0) {
      setStatus("error");
      return;
    }

    setStatus("pending");

    // Simulate network latency before the "stream" starts.
    pendingTimer = window.setTimeout(() => {
      const trimmed = raw.trim();
      let results: Hit[] = [];
      let intro: string;

      if (trimmed.length === 0) {
        // Blank query: surface a few hand-picked starting points.
        results = INDEX.slice(0, 6).map((d) => ({ ...d, score: 0 }));
        intro = "Here are a few places to start — or ask me anything above.";
      } else {
        results = search(trimmed);
        intro =
          results.length > 0
            ? `Here's what I found for “${trimmed}”:`
            : "No matches found — try one of the suggestions above.";
      }

      setHits(results);

      if (reducedMotion()) {
        setIntroShown(intro);
        setVisibleCount(results.length);
        setStatus("done");
        return;
      }

      // Chunked typewriter: intro text streams in, then one result per tick.
      setStatus("streaming");
      let pos = 0;
      streamTimer = window.setInterval(() => {
        if (pos < intro.length) {
          pos = Math.min(intro.length, pos + 2);
          setIntroShown(intro.slice(0, pos));
          return;
        }
        const n = visibleCount();
        if (n < results.length) {
          setVisibleCount(n + 1);
          return;
        }
        clearTimers();
        setStatus("done");
      }, 30);
    }, 550);
  };

  const onSubmit = (e: Event) => {
    e.preventDefault();
    runSearch(query());
  };

  const onChip = (text: string) => {
    setQuery(text);
    runSearch(text);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      clearTimers();
      setHits([]);
      setIntroShown("");
      setVisibleCount(0);
      setStatus("idle");
    }
  };

  const copyLink = async () => {
    try {
      const url = `${window.location.origin}${window.location.pathname}?q=${encodeURIComponent(
        query().trim()
      )}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — leave the button as-is */
    }
  };

  const showing = createMemo(
    () => status() === "pending" || status() === "streaming" || status() === "done"
  );

  return (
    <section class="ask-widget" aria-label="Ask the site">
      <style>{`
        .ask-widget {
          background: var(--bg-plate);
          border: 1px solid var(--hairline);
          border-radius: 1rem;
          padding: 1.25rem;
        }
        .ask-widget__chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 0.9rem;
        }
        .ask-widget__chip {
          font-family: var(--font-mono, "Geist Mono", monospace);
          font-size: 0.72rem;
          letter-spacing: 0.04em;
          padding: 0.4rem 0.75rem;
          border: 1px solid var(--hairline);
          border-radius: 999px;
          background: transparent;
          color: var(--fg-2);
          cursor: pointer;
          transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;
        }
        .ask-widget__chip:hover,
        .ask-widget__chip:focus-visible {
          border-color: var(--accent);
          color: var(--accent);
          outline: none;
        }
        .ask-widget__form {
          display: flex;
          gap: 0.6rem;
        }
        .ask-widget__input {
          flex: 1;
          min-width: 0;
          background: var(--bg);
          border: 1px solid var(--hairline);
          border-radius: 0.6rem;
          color: var(--fg);
          padding: 0.65rem 0.9rem;
          font-size: 0.95rem;
        }
        .ask-widget__input:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
          border-color: var(--accent);
        }
        .ask-widget__submit {
          background: var(--accent);
          color: var(--on-red, #fff);
          border: none;
          border-radius: 0.6rem;
          padding: 0.65rem 1.1rem;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }
        .ask-widget__submit:hover:not(:disabled) {
          filter: brightness(1.08);
        }
        .ask-widget__submit:disabled {
          opacity: 0.6;
          cursor: progress;
        }
        .ask-widget__result {
          margin-top: 1rem;
          border-top: 1px dashed var(--hairline);
          padding-top: 1rem;
        }
        .ask-result-pending {
          color: var(--fg-2);
          font-size: 0.95rem;
        }
        .ask-result-pending::after {
          content: ".";
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
          width: 0;
          animation: ellipsis 0.9s steps(4, end) infinite;
        }
        .ask-widget__intro {
          color: var(--fg-2);
          font-size: 0.95rem;
          margin: 0 0 0.75rem;
          min-height: 1.4em;
        }
        .ask-widget__intro--streaming::after {
          content: "▍";
          color: var(--accent);
          animation: ask-blink 0.8s steps(2, start) infinite;
        }
        @keyframes ask-blink {
          to { visibility: hidden; }
        }
        .ask-widget__list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }
        .ask-widget__item a {
          display: block;
          border: 1px solid var(--hairline);
          border-radius: 0.55rem;
          padding: 0.6rem 0.8rem;
          text-decoration: none;
          color: var(--fg);
          transition: border-color 0.15s ease, transform 0.15s ease;
        }
        .ask-widget__item a:hover,
        .ask-widget__item a:focus-visible {
          border-color: var(--accent);
          outline: none;
        }
        .ask-widget__kind {
          display: inline-block;
          font-family: var(--font-mono, "Geist Mono", monospace);
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--accent);
          border: 1px solid var(--hairline);
          border-radius: 999px;
          padding: 0.1rem 0.5rem;
          margin-right: 0.5rem;
        }
        .ask-widget__empty {
          color: var(--fg-3);
          font-size: 0.92rem;
          margin: 0;
        }
        .ask-widget__error {
          color: var(--accent);
          font-size: 0.92rem;
          margin: 0;
        }
        .ask-widget__actions {
          margin-top: 0.9rem;
          display: flex;
          justify-content: flex-end;
        }
        .ask-widget__copy {
          font-size: 0.8rem;
          background: transparent;
          border: 1px solid var(--hairline);
          border-radius: 0.5rem;
          color: var(--fg-2);
          padding: 0.4rem 0.8rem;
          cursor: pointer;
        }
        .ask-widget__copy:hover,
        .ask-widget__copy:focus-visible {
          border-color: var(--accent);
          color: var(--accent);
          outline: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .ask-result-pending::after,
          .ask-widget__intro--streaming::after {
            animation: none;
          }
        }
      `}</style>

      <div class="ask-widget__chips" role="group" aria-label="Suggested questions">
        <For each={SUGGESTIONS}>
          {(s) => (
            <button
              type="button"
              class="ask-widget__chip"
              onClick={() => onChip(s)}
            >
              {s}
            </button>
          )}
        </For>
      </div>

      <form class="ask-widget__form" onSubmit={onSubmit}>
        <input
          id="ask-widget-input"
          class="ask-widget__input"
          type="text"
          value={query()}
          onInput={(e) => setQuery(e.currentTarget.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask about talks, episodes, blog…"
          aria-label="Ask a question about this site"
          autocomplete="off"
        />
        <button
          type="submit"
          class="ask-widget__submit"
          disabled={status() === "pending" || status() === "streaming"}
        >
          Search
        </button>
      </form>

      <Show when={showing()}>
        <div class="ask-widget__result" aria-live="polite" aria-atomic="false">
          <Show when={status() === "pending"}>
            <p class="ask-result-pending">Searching</p>
          </Show>
          <Show when={status() !== "pending"}>
            <p
              classList={{
                "ask-widget__intro": true,
                "ask-widget__intro--streaming": status() === "streaming",
              }}
            >
              {introShown()}
            </p>
            <Show when={hits().length > 0 && visibleCount() > 0}>
              <ul class="ask-widget__list">
                <For each={hits().slice(0, visibleCount())}>
                  {(hit) => (
                    <li class="ask-widget__item">
                      <a href={hit.href}>
                        <span class="ask-widget__kind">{KIND_LABEL[hit.kind]}</span>
                        {hit.title}
                      </a>
                    </li>
                  )}
                </For>
              </ul>
            </Show>
          </Show>
          <Show when={status() === "done"}>
            <div class="ask-widget__actions">
              <button type="button" class="ask-widget__copy" onClick={copyLink}>
                {copied() ? "Copied!" : "Copy link"}
              </button>
            </div>
          </Show>
        </div>
      </Show>

      <Show when={status() === "error"}>
        <div class="ask-widget__result" aria-live="polite">
          <p class="ask-widget__error">
            Sorry — the search index couldn't be loaded. Please reload the page
            and try again.
          </p>
        </div>
      </Show>
    </section>
  );
}
