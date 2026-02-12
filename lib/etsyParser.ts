import cheerio from 'cheerio';
import fetch from 'node-fetch'; // Hvis ikke allerede, import fra 'node-fetch'

export async function parseEtsyListing(url: string) {
  const match = url.match(/listing\/(\d+)/) || url.match(/(\d{6,})/);
  if (!match) return null;

  const listingUrl = `https://www.etsy.com/listing/${match[1]}`;

  const apiKey = process.env.SCRAPINGBEE_API_KEY;
  if (!apiKey) {
    console.error('Missing ScrapingBee API key');
    return null;
  }

  const proxyUrl = `https://app.scrapingbee.com/api/v1/?api_key=${apiKey}&url=${encodeURIComponent(listingUrl)}&render_js=false`; // render_js=false for raskere, bare HTML

  try {
    const res = await fetch(proxyUrl);

    if (!res.ok) {
      console.error(`Proxy fetch failed: ${res.status} - ${res.statusText}`);
      return null;
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // Updated selectors basert på aktuell Etsy-struktur (2026)
    const title = $('h1').first().text().trim() || 
                  $('title').text().trim().replace(/ - Etsy$/, '');

    // Description: Samle fra description-div (oppdatert til vanligere id/class)
    let description = '';
    const descSection = $('#description') || $('div.wt-text-body-01'); // Tilpass hvis id="description" eller class
    descSection.find('p, li, h2').each((i, el) => {
      const text = $(el).text().trim();
      if (text) description += text + '\n\n';
    });
    if (!description) {
      description = $('meta[name="description"]').attr('content') || '';
    }

    // Image: Fortsatt og:image
    const image = $('meta[property="og:image"]').attr('content') || 
                  $('img.wt-max-width-full').first().attr('src') || // Alternativ for carousel-bilder
                  $('img[data-listing-image]').first().attr('src');

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