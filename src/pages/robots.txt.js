/* /robots.txt */
export async function GET() {
  const body = `User-agent: *
Allow: /
Disallow: /api/
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
