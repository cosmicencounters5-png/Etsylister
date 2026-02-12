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
        "Accept-Encoding": "gzip, deflate, br",
        "DNT": "1",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Cache-Control": "max-age=0"
      },
      // Viktigt för Vercel Edge
      next: { revalidate: 3600 }
    });

    console.log("STATUS:", res.status);
    
    if (!res.ok) {
      // 2. Om blockad, försök med alternativ metod
      if (res.status === 403 || res.status === 429) {
        console.log("Etsy blockerade request, försöker med proxy...");
        return await fetchWithProxy(listingId);
      }
      throw new Error(`HTTP ${res.status}`);
    }

    const html = await res.text();
    
    // 3. Extrahera data med flera patterns
    const titleMatch = 
      html.match(/property="og:title"\s*content="([^"]+)"/) ||
      html.match(/<meta property="og:title" content="([^"]+)"/) ||
      html.match(/<title[^>]*>([^<]+)Etsy<\/title>/) ||
      html.match(/"title"\s*:\s*"([^"]+)"/);
    
    const descMatch = 
      html.match(/name="description"\s*content="([^"]+)"/) ||
      html.match(/property="og:description"\s*content="([^"]+)"/) ||
      html.match(/"description"\s*:\s*"([^"]+)"/);
    
    const imageMatch = 
      html.match(/property="og:image"\s*content="([^"]+)"/) ||
      html.match(/"url"\s*:\s*"([^"]+\.(jpg|jpeg|png|webp))"/);

    if (!titleMatch) {
      console.log("NO TITLE FOUND, försöker med fallback...");
      return await fetchWithFallback(listingId);
    }

    // Rensa titeln från " - Etsy" om den finns
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
      fetchedAt: new Date().toISOString()
    };

  } catch (e) {
    console.error("Parser error:", e);
    // 4. Sista fallback
    return await fetchWithFallback(match[1]);
  }
}

// Alternativ metod: Använd vår egen proxy
async function fetchWithProxy(listingId: string) {
  try {
    // Använd en publik CORS-proxy (tillfällig lösning)
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
      `https://www.etsy.com/listing/${listingId}`
    )}`;
    
    const res = await fetch(proxyUrl);
    const html = await res.text();
    
    const titleMatch = html.match(/<title[^>]*>([^<]+)Etsy<\/title>/);
    
    if (titleMatch) {
      return {
        id: listingId,
        title: titleMatch[1].replace(" - Etsy", "").trim(),
        description: "Description från proxy",
        image: "",
        url: `https://www.etsy.com/listing/${listingId}`,
        fetchedAt: new Date().toISOString()
      };
    }
  } catch (e) {
    console.error("Proxy error:", e);
  }
  return null;
}

// Sista fallback: Generera ett titelförslag baserat på listing ID
async function fetchWithFallback(listingId: string) {
  console.log("Använder fallback för listing:", listingId);
  
  // Försök gissa produkttyp från URL om möjligt
  return {
    id: listingId,
    title: `Etsy Listing #${listingId}`,  // Temporär titel
    description: "Product description could not be fetched at this time.",
    image: "",
    url: `https://www.etsy.com/listing/${listingId}`,
    fetchedAt: new Date().toISOString(),
    fallback: true
  };
}

// Batch-parser för flera URLs
export async function batchParseEtsyListings(urls: string[]) {
  const promises = urls.map(url => parseEtsyListing(url));
  const results = await Promise.allSettled(promises);
  
  return results
    .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled" && r.value !== null)
    .map(r => r.value);
}