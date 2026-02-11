export async function parseEtsyListing(rawUrl: string) {
  const match =
    rawUrl.match(/listing\/(\d+)/) ||
    rawUrl.match(/(\d{6,})/);

  if (!match) return null;

  const id = match[1];

  const pageUrl = `https://www.etsy.com/listing/${id}`;

  try {
    const res = await fetch(pageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    const html = await res.text();

    // Find all JSON-LD scripts
    const scriptMatches = html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);

    for (const match of scriptMatches) {
      const jsonStr = match[1].trim();
      try {
        const data = JSON.parse(jsonStr);
        if (data['@type'] === 'Product') {
          return {
            title: data.name,
            description: data.description,
            image: Array.isArray(data.image) ? data.image[0] : data.image
          };
        }
      } catch (parseError) {
        // Skip invalid JSON
      }
    }

    return null;

  } catch (e) {
    console.log("parser failed", e);
    return null;
  }
}