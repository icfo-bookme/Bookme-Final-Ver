import { getSSRJson } from "@/lib/getSSRJson";
import slugify from "@/utils/slugify";

export const revalidate = 3600;

export async function GET() {
  const raw = await getSSRJson("/activities");

  const data = Array.isArray(raw)
    ? raw
    : raw?.data || raw?.result || [];

  const lastmod = new Date().toISOString();

  const urls = data
    .map((item) => {
      const slug = slugify(item.property_name);

      return `
<url>
  <loc>https://bookme.com.bd/${slug}/${item.id}</loc>
  <lastmod>${lastmod}</lastmod>
  <changefreq>daily</changefreq>
  <priority>0.9</priority>
</url>`;
    })
    .join("");

  return new Response(
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`,
  {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}