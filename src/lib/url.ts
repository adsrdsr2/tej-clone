/* Base-aware URL helper for GitHub Pages sub-path deployments.
 *
 * import.meta.env.BASE_URL is "/" for local dev and "/<repo>" for GitHub
 * Pages project sites (Astro exposes it without a trailing slash in both
 * cases). This helper joins it with a root-absolute path, guaranteeing
 * exactly one slash between the base and the path.
 *
 *   u("/speaking") -> "/speaking"            (local)
 *   u("/speaking") -> "/tej-clone/speaking"  (GitHub Pages)
 */
const base = import.meta.env.BASE_URL.replace(/\/$/, "");

export function u(path: string): string {
  return `${base}/${path.replace(/^\//, "")}`;
}
