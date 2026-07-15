import { getCategories, getTools } from '../lib/data';

export const prerender = false;

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function toAbsoluteUrl(origin: string, path: string) {
  return new URL(path, origin).href;
}

export async function GET({ request }: { request: Request }) {
  const siteOrigin = process.env.SITE_URL ?? new URL(request.url).origin;
  const [categories, tools] = await Promise.all([getCategories(), getTools()]);
  const activeTools = tools.filter((tool) => (tool as { isActive?: boolean }).isActive !== false);

  const urls: { loc: string; priority?: number; changefreq?: string }[] = [
    { loc: toAbsoluteUrl(siteOrigin, '/'), priority: 1.0, changefreq: 'daily' },
    { loc: toAbsoluteUrl(siteOrigin, '/about/'), priority: 0.5, changefreq: 'monthly' },
    { loc: toAbsoluteUrl(siteOrigin, '/contact/'), priority: 0.5, changefreq: 'monthly' },
    { loc: toAbsoluteUrl(siteOrigin, '/privacy-policy/'), priority: 0.3, changefreq: 'monthly' },
    { loc: toAbsoluteUrl(siteOrigin, '/terms-of-service/'), priority: 0.3, changefreq: 'monthly' },
    ...categories.map((category) => ({
      loc: toAbsoluteUrl(siteOrigin, `/${category.slug}/`),
      priority: 0.8,
      changefreq: 'weekly',
    })),
    ...activeTools.map((tool) => ({
      loc: toAbsoluteUrl(siteOrigin, `/${tool.categorySlug}/${tool.slug}/`),
      priority: 0.7,
      changefreq: 'weekly',
    })),
  ];

  urls.sort((a, b) => a.loc.localeCompare(b.loc, 'en', { numeric: true }));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((item) => {
    const lines = [`  <url>`, `    <loc>${escapeXml(item.loc)}</loc>`];
    if (item.changefreq) {
      lines.push(`    <changefreq>${escapeXml(item.changefreq)}</changefreq>`);
    }
    if (typeof item.priority === 'number') {
      lines.push(`    <priority>${item.priority.toFixed(1)}</priority>`);
    }
    lines.push(`  </url>`);
    return lines.join('\n');
  })
  .join('\n')}
</urlset>\n`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}