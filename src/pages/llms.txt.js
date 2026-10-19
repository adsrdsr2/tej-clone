/* /llms.txt — plain-text index of the site with real links, for LLMs. */
import content from "../data/content.json";

const SITE = "https://tej.as";

export async function GET() {
  const lines = [
    "# Tejas Kumar",
    "",
    "> Tejas Kumar is an AI Engineer at IBM in Berlin. Speaker, author of Fluent React, host of the ConTejas Code podcast.",
    "",
    "## Pages",
    `- [About Tejas Kumar](${SITE}/about)`,
    `- [The thread — testimony and autobiography](${SITE}/story)`,
    `- [Invite me to speak](${SITE}/speaking)`,
    `- [AI and React workshops for teams](${SITE}/workshops)`,
    `- [Invite me to preach](${SITE}/preaching)`,
    `- [Speaking calendar](${SITE}/calendar)`,
    `- [Angel investing](${SITE}/investing)`,
    `- [How I'm doing](${SITE}/status)`,
    `- [Talk transcripts](${SITE}/talks)`,
    `- [Fluent React — the book](${SITE}/react)`,
    `- [Blog](${SITE}/blog)`,
    `- [ConTejas Code podcast](${SITE}/podcast)`,
    `- [Tavus video AI demo](${SITE}/demos/tavus)`,
    "",
    "## Blog posts",
  ];
  for (const p of content.blog) {
    lines.push(`- [${p.title}](${SITE}/blog/${p.slug})`);
  }
  lines.push("", "## Talk transcripts");
  for (const t of content.transcripts) {
    lines.push(`- [${t.title} — ${t.event}](${SITE}/talks/${t.slug})`);
  }
  lines.push("", "## Podcast episodes");
  for (const e of content.episodes) {
    lines.push(`- [${e.title}](${SITE}/podcast/ep/${e.slug})`);
  }
  lines.push("", "## Elsewhere", `- [X](https://x.com/TejasKumar_)`, `- [GitHub](https://github.com/TejasQ)`, `- [LinkedIn](https://www.linkedin.com/in/tejasq)`, `- [YouTube](https://www.youtube.com/@tejask)`, `- [RSS](${SITE}/rss.xml)`);

  return new Response(lines.join("\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
