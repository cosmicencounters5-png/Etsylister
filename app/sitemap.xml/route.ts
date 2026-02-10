export async function GET() {

  const baseUrl = "https://etsylister.com"

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <url>
    <loc>${baseUrl}/login</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${baseUrl}/dashboard</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

</urlset>`

  return new Response(xml,{
    headers:{
      "Content-Type":"application/xml"
    }
  })
}