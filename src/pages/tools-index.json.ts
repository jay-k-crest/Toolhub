import { getTools } from "../lib/data";

export const prerender = true;

export async function GET() {
  const tools = await getTools();

  const payload = tools
    .filter((tool) => tool.isActive)
    .map((tool) => ({
      name: tool.name,
      slug: tool.slug,
      categorySlug: tool.categorySlug,
      shortDesc: tool.shortDesc,
    }));

  return new Response(JSON.stringify(payload), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}