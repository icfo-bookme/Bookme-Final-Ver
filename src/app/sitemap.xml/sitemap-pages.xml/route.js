export const revalidate = 3600;

export async function GET() {
  const lastmod = new Date().toISOString();

  const pages = [
    { url: "https://bookme.com.bd/", priority: "1.0", changefreq: "daily" },

    { url: "https://bookme.com.bd/about", priority: "0.8", changefreq: "monthly" },
    { url: "https://bookme.com.bd/contact", priority: "0.8", changefreq: "monthly" },
    { url: "https://bookme.com.bd/terms", priority: "0.7", changefreq: "monthly" },
    { url: "https://bookme.com.bd/privacy", priority: "0.7", changefreq: "monthly" },

    { url: "https://bookme.com.bd/booking-review", priority: "0.7", changefreq: "daily" },
    { url: "https://bookme.com.bd/loading", priority: "0.4", changefreq: "monthly" },
    { url: "https://bookme.com.bd/emi-policy", priority: "0.7", changefreq: "monthly" },
    { url: "https://bookme.com.bd/talent-culture", priority: "0.6", changefreq: "monthly" },
    { url: "https://bookme.com.bd/refund-policy", priority: "0.7", changefreq: "monthly" },

    { url: "https://bookme.com.bd/activities", priority: "0.8", changefreq: "daily" },
    { url: "https://bookme.com.bd/car-rental", priority: "0.8", changefreq: "daily" },
    { url: "https://bookme.com.bd/faq", priority: "0.7", changefreq: "monthly" },
    { url: "https://bookme.com.bd/flight", priority: "0.9", changefreq: "daily" },
    { url: "https://bookme.com.bd/ships/tanguar-haor-bangladesh/1", priority: "0.9", changefreq: "daily" },
    { url: "https://bookme.com.bd/ships/sundarban/2", priority: "0.9", changefreq: "daily" },
    { url: "https://bookme.com.bd/ships/saint-martin/3", priority: "0.9", changefreq: "daily" },
    { url: "https://bookme.com.bd/hotel", priority: "0.9", changefreq: "daily" },
    { url: "https://bookme.com.bd/tour/packages", priority: "0.9", changefreq: "daily" },
    { url: "https://bookme.com.bd/visa", priority: "0.9", changefreq: "daily" },

    { url: "https://bookme.com.bd/register", priority: "0.5", changefreq: "monthly" },
    { url: "https://bookme.com.bd/login", priority: "0.5", changefreq: "monthly" },
  ];

  const urls = pages
    .map(
      (page) => `
<url>
  <loc>${page.url}</loc>
  <lastmod>${lastmod}</lastmod>
  <changefreq>${page.changefreq}</changefreq>
  <priority>${page.priority}</priority>
</url>`
    )
    .join("");

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