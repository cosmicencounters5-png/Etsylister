// lib/etsyParser.ts
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
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    if (!res.ok) {
      console.error(`Fetch failed: ${res.status} - ${res.statusText}`);
      return null;
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // Title
    const title = $('h1[data-buy-box-listing-title="true"]').text().trim() || 
                  $('title').text().trim().replace(/ - Etsy$/, '');

    // Description - full text from the description section
    let description = '';
    $('div[data-component="listing-page-description"] p').each((i, el) => {
      description += $(el).text().trim() + '\n\n';
    });
    if (!description) {
      description = $('meta[name="description"]').attr('content') || '';
    }

    // Image
    const image = $('meta[property="og:image"]').attr('content') || 
                  $('img[data-listing-card-listing-image]').first().attr('src') || 
                  $('img.carousel-image').first().attr('src');

    if (!title) {
      console.error('Could not find title');
      return null;
    }

    return {
      title,
      description: description.trim(),
      image,
    };
  } catch (error) {
    console.error('Error parsing Etsy listing:', error);
    return null;
  }
}