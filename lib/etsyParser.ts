import cheerio from 'cheerio';

export async function parseEtsyListing(url: string) {
  const match = url.match(/listing\/(\d+)/) || url.match(/(\d{6,})/);
  if (!match) return null;

  const listingUrl = `https://www.etsy.com/listing/${match[1]}`;

  try {
    const res = await fetch(listingUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      },
    });

    if (!res.ok) {
      console.log(`Fetch failed with status ${res.status}`);
      return null;
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // Extract title (tilpass hvis nødvendig basert på Etsys HTML-struktur)
    const title = $('h1[data-buy-box-listing-title="true"]').text().trim() || $('title').text().trim().replace(' - Etsy', '');

    // Extract description (tilpass selector om det ikke matcher)
    const description = $('div[data-component="listing-page-description"] p').text().trim() || 
                        $('meta[name="description"]').attr('content') || 
                        $('div#description-text').text().trim();

    // Extract image (første hovedbilde)
    const image = $('img.carousel-image').first().attr('src') || 
                  $('meta[property="og:image"]').attr('content');

    return {
      title,
      description,
      image,
    };
  } catch (error) {
    console.error('Error parsing Etsy listing:', error);
    return null;
  }
}