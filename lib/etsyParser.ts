/**
 * Etsy Listing Parser
 * Fallback-parser när DeepSeek API inte är tillgängligt
 */

export async function parseEtsyListing(rawUrl: string) {
  const match = rawUrl.match(/listing\/(\d+)/) || rawUrl.match(/(\d{6,})/);
  
  if (!match) return null;
  
  const listingId = match[1];
  const listingUrl = `https://www.etsy.com/listing/${listingId}`;
  
  try {
    // Försök hämta med User-Agent
    const res = await fetch(listingUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "text/html",
        "Accept-Language": "en-US,en;q=0.9"
      },
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      return await fetchWithFallback(listingId);
    }

    const html = await res.text();
    
    // Extrahera titel
    const titleMatch = 
      html.match(/property="og:title"\s*content="([^"]+)"/) ||
      html.match(/<meta property="og:title" content="([^"]+)"/) ||
      html.match(/<title[^>]*>([^<]+)Etsy<\/title>/);
    
    if (!titleMatch) {
      return await fetchWithFallback(listingId);
    }

    let title = titleMatch[1];
    if (title.includes(" - Etsy")) {
      title = title.split(" - Etsy")[0];
    }

    // Extrahera beskrivning
    const descMatch = 
      html.match(/name="description"\s*content="([^"]+)"/) ||
      html.match(/property="og:description"\s*content="([^"]+)"/);
    
    // Extrahera bild
    const imageMatch = html.match(/property="og:image"\s*content="([^"]+)"/);

    return {
      id: listingId,
      title: title.trim(),
      description: descMatch?.[1] || "Handmade item from Etsy",
      image: imageMatch?.[1] || "",
      url: listingUrl,
      fetchedAt: new Date().toISOString(),
      fallback: false
    };

  } catch (e) {
    console.error("Parser error:", e);
    return await fetchWithFallback(listingId);
  }
}

/**
 * Fallback när Etsy blockerar
 */
async function fetchWithFallback(listingId: string) {
  console.log("Using fallback for listing:", listingId);
  
  // Försök gissa produkt från ID (crochet patterns är vanliga)
  const lastFour = listingId.slice(-4);
  const categories = ["Crochet Pattern", "Knitting Pattern", "Sewing Pattern", "Digital Download"];
  const category = categories[parseInt(lastFour) % categories.length];
  
  return {
    id: listingId,
    title: `Etsy Listing #${listingId}`,
    description: `Beautiful handmade ${category.toLowerCase()} - Instant PDF download. Perfect for beginners and experienced crafters.`,
    image: "",
    url: `https://www.etsy.com/listing/${listingId}`,
    fetchedAt: new Date().toISOString(),
    fallback: true
  };
}