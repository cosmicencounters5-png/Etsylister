export async function parseEtsyListing(rawUrl: string) {
  const match = rawUrl.match(/listing\/(\d+)/) || rawUrl.match(/(\d{6,})/);
  
  if (!match) return null;
  
  const listingId = match[1];
  const listingUrl = `https://www.etsy.com/listing/${listingId}`;
  
  try {
    // 1. Försök med vanlig fetch + headers
    const res = await fetch(listingUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "DNT": "1",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1"
      },
      next: { revalidate: 3600 }
    });

    console.log("STATUS:", res.status);
    
    if (!res.ok) {
      if (res.status === 403 || res.status === 429) {
        console.log("Etsy blockerade request, använder fallback...");
        return await fetchWithFallback(listingId);
      }
      throw new Error(`HTTP ${res.status}`);
    }

    const html = await res.text();
    
    const titleMatch = 
      html.match(/property="og:title"\s*content="([^"]+)"/) ||
      html.match(/<meta property="og:title" content="([^"]+)"/) ||
      html.match(/<title[^>]*>([^<]+)Etsy<\/title>/);
    
    const descMatch = 
      html.match(/name="description"\s*content="([^"]+)"/) ||
      html.match(/property="og:description"\s*content="([^"]+)"/);
    
    const imageMatch = 
      html.match(/property="og:image"\s*content="([^"]+)"/);

    if (!titleMatch) {
      console.log("NO TITLE FOUND, använder fallback...");
      return await fetchWithFallback(listingId);
    }

    let title = titleMatch[1];
    if (title.includes(" - Etsy")) {
      title = title.split(" - Etsy")[0];
    }

    return {
      id: listingId,
      title: title.trim(),
      description: descMatch?.[1] || "",
      image: imageMatch?.[1] || "",
      url: listingUrl,
      fetchedAt: new Date().toISOString(),
      fallback: false  // <-- LÄGG TILL DENNA
    };

  } catch (e) {
    console.error("Parser error:", e);
    return await fetchWithFallback(match[1]);
  }
}

// Sista fallback: Generera ett titelförslag baserat på listing ID
async function fetchWithFallback(listingId: string) {
  console.log("Använder fallback för listing:", listingId);
  
  return {
    id: listingId,
    title: `Etsy Listing #${listingId}`,
    description: "Product description could not be fetched at this time.",
    image: "",
    url: `https://www.etsy.com/listing/${listingId}`,
    fetchedAt: new Date().toISOString(),
    fallback: true  // <-- LÄGG TILL DENNA
  };
}