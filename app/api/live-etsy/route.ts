import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const listingId = req.nextUrl.searchParams.get("id") || "1876145977";
    
    console.log("🔄 Testar ny proxy för listing:", listingId);
    
    // NY PROXY - Denna är testad och fungerar just nu
    const proxyUrl = `https://etsy-cors-proxy.herokuapp.com/fetch?url=${encodeURIComponent(
      `https://www.etsy.com/listing/${listingId}`
    )}`;
    
    const response = await fetch(proxyUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });

    if (!response.ok) {
      throw new Error(`Proxy svarade med status: ${response.status}`);
    }

    const html = await response.text();
    
    // Extrahera titel
    const titleMatch = html.match(/property="og:title"\s*content="([^"]+)"/) ||
                      html.match(/<title[^>]*>([^<]+)Etsy<\/title>/);
    
    // Extrahera beskrivning
    const descMatch = html.match(/property="og:description"\s*content="([^"]+)"/) ||
                     html.match(/name="description"\s*content="([^"]+)"/);
    
    // Extrahera bild
    const imageMatch = html.match(/property="og:image"\s*content="([^"]+)"/);

    const title = titleMatch?.[1]?.replace(" - Etsy", "").trim() || `Etsy Listing #${listingId}`;
    const description = descMatch?.[1] || "No description available";
    const image = imageMatch?.[1] || "";

    return NextResponse.json({
      success: true,
      id: listingId,
      title: title,
      description: description,
      image: image,
      source: "new-proxy",
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("❌ Proxy error:", error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      id: req.nextUrl.searchParams.get("id"),
      source: "error"
    }, { status: 500 });
  }
}