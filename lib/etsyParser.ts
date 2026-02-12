export async function parseEtsyListing(rawUrl: string) {
  const match = rawUrl.match(/listing\/(\d+)/) || rawUrl.match(/(\d{6,})/);
  
  if (!match) return null;
  
  const listingUrl = `https://www.etsy.com/listing/${match[1]}`;
  
  try {
    const res = await fetch(listingUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache"
      },
      // För Vercel Edge Runtime
      next: { revalidate: 3600 } // Cache i 1 timme
    });

    console.log("STATUS:", res.status);
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const html = await res.text();
    
    // Extrahera ALLA meta-taggar
    const titleMatch = html.match(/property="og:title"\s*content="([^"]+)"/) ||
                      html.match(/<meta property="og:title" content="([^"]+)"/);
    
    const descMatch = html.match(/name="description"\s*content="([^"]+)"/) ||
                     html.match(/property="og:description"\s*content="([^"]+)"/);
    
    const imageMatch = html.match(/property="og:image"\s*content="([^"]+)"/);
    const priceMatch = html.match(/"price"\s*:\s*"([^"]+)"/) || 
                      html.match(/"amount"\s*:\s*([0-9.]+)/);
    const currencyMatch = html.match(/"currency"\s*:\s*"([^"]+)"/);

    if (!titleMatch) {
      console.log("NO OG TITLE FOUND");
      return null;
    }

    return {
      id: match[1],
      title: titleMatch[1],
      description: descMatch?.[1] || "",
      image: imageMatch?.[1] || "",
      price: priceMatch?.[1] || null,
      currency: currencyMatch?.[1] || "USD",
      url: listingUrl,
      fetchedAt: new Date().toISOString()
    };

  } catch (e) {
    console.error("Parser error:", e);
    return null;
  }
}

// Batch-parser för flera URLs
export async function batchParseEtsyListings(urls: string[]) {
  const promises = urls.map(url => parseEtsyListing(url));
  const results = await Promise.allSettled(promises);
  
  return results
    .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled" && r.value !== null)
    .map(r => r.value);
}