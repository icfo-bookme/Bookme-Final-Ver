export async function GET() {
    const baseUrl = "https://bookme.com.bd";

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <sitemap>
    <loc>${baseUrl}/sitemap.xml/sitemap-ships.xml</loc>
  </sitemap>

  <sitemap>
    <loc>${baseUrl}/sitemap.xml/sitemap-visa.xml</loc>
  </sitemap>

  <sitemap>
    <loc>${baseUrl}/sitemap.xml/sitemap-hotel-destinations.xml</loc>
  </sitemap>

  <sitemap>
    <loc>${baseUrl}/sitemap.xml/sitemap-hotels.xml</loc>
  </sitemap>

  <sitemap>
    <loc>${baseUrl}/sitemap.xml/sitemap-tours-packages.xml</loc>
  </sitemap>

    <sitemap>
    <loc>${baseUrl}/sitemap.xml/sitemap-activities.xml</loc>
  </sitemap>

   <sitemap>
    <loc>${baseUrl}/sitemap.xml/sitemap-pages.xml</loc>
  </sitemap>

</sitemapindex>`;

    return new Response(xml, {
        headers: { "Content-Type": "application/xml" },
    });
}