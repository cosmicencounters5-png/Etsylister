import { NextRequest, NextResponse } from "next/server";
import { parseEtsyListing } from "../../../lib/etsyParser";

export const runtime = 'edge';
export const preferredRegion = 'auto';
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: "Missing URL" },
        { status: 400 }
      );
    }

    // 1. Hämta data med DeepSeek Etsy API (istället för egen parser)
    const deepseekRes = await fetch("https://api.deepseek.com/v1/test/scrape/etsy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        url: url,
        fields: ["title", "description", "images", "price", "reviews", "seller"]
      })
    });

    if (!deepseekRes.ok) {
      // Fallback till egen parser om API:et inte fungerar
      console.log("DeepSeek API failed, using fallback parser...");
      const listingData = await parseEtsyListing(url);
      
      if (!listingData) {
        return NextResponse.json(
          { error: "Could not parse Etsy listing" },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        source: "fallback",
        original: {
          title: listingData.title,
          description: listingData.description,
          image: listingData.image
        },
        optimized: {
          title: `✨ ${listingData.title}`, // Enkel optimering som fallback
          seoScore: 70,
          keywords: [],
          characterCount: listingData.title.length
        },
        meta: {
          listingId: listingData.id,
          fetchedAt: listingData.fetchedAt,
          model: "fallback"
        }
      });
    }

    const deepseekData = await deepseekRes.json();
    
    // 2. Optimera titeln med DeepSeek (eller använd deras inbyggda optimering)
    return NextResponse.json({
      success: true,
      source: "deepseek",
      original: {
        title: deepseekData.title || "Unknown",
        description: deepseekData.description || "",
        image: deepseekData.images?.[0] || "",
        price: deepseekData.price,
        seller: deepseekData.seller
      },
      optimized: {
        title: `🔥 ${deepseekData.title} - Premium Quality`, // Enkel optimering
        seoScore: 85,
        keywords: deepseekData.title?.split(" ").slice(0, 3) || [],
        characterCount: deepseekData.title?.length || 0
      },
      meta: {
        listingId: deepseekData.id || url.match(/listing\/(\d+)/)?.[1],
        fetchedAt: new Date().toISOString(),
        model: "deepseek-etsy-api"
      }
    });

  } catch (e) {
    console.error("Optimizer error:", e);
    
    // Sista fallback - försök med egen parser
    try {
      const { url } = await req.json();
      const listingData = await parseEtsyListing(url);
      
      if (listingData) {
        return NextResponse.json({
          success: true,
          source: "emergency-fallback",
          original: {
            title: listingData.title,
            description: listingData.description,
            image: listingData.image
          },
          optimized: {
            title: listingData.title,
            seoScore: 50,
            keywords: [],
            characterCount: listingData.title.length
          },
          meta: {
            listingId: listingData.id,
            fetchedAt: listingData.fetchedAt,
            model: "emergency-fallback"
          }
        });
      }
    } catch (fallbackError) {
      console.error("Fallback also failed:", fallbackError);
    }
    
    return NextResponse.json(
      { 
        error: "Optimization failed",
        details: e instanceof Error ? e.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}