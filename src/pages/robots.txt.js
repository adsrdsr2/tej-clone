/* /robots.txt — static site: allow everything, no server API routes exist. */
export async function GET() {
  const body = `User-agent: *
Allow: /
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
