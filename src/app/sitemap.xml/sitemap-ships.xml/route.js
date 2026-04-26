import { getSSRJson } from "@/lib/getSSRJson";
import slugify from "@/utils/slugify";


export const revalidate = 3600;

export async function GET() {
    const data = await getSSRJson("/ships/1");

    if (process.env.NODE_ENV === "development") {
        console.log("Sitemap Ships Data:", data);
    }

    const safeData = Array.isArray(data) ? data : [];

    const lastmod = new Date().toISOString();

    const urls = safeData.map((item) => {
        const slug = slugify(item.property_name);

        return `
<url>
  <loc>https://bookme.com.bd/ships/${slug}/${item.property_id}</loc>
  <lastmod>${lastmod}</lastmod>
  <changefreq>daily</changefreq>
  <priority>0.8</priority>
</url>`;
    }).join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml",
        },
    });
}