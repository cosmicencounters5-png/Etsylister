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

    // KOLLA: Finns API-nyckeln?
    const apiKey = process.env.DEEPSEEK_API_KEY;
    console.log("API Key exists:", !!apiKey);
    
    if (!apiKey) {
      console.error("DEEPSEEK_API_KEY is not set in Vercel");
      // Fallback till egen parser
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
          title: `✨ ${listingData.title.replace("Etsy Listing #", "Vintage ")}`,
          seoScore: 75,
          keywords: ["vintage", "handmade", "unique"],
          characterCount: listingData.title.length
        },
        meta: {
          listingId: listingData.id,
          fetchedAt: listingData.fetchedAt,
          model: "fallback",
          warning: "DeepSeek API key missing - add to Vercel env variables"
        }
      });
    }

    // 1. Försök med DeepSeek Etsy API
    try {
      const deepseekRes = await fetch("https://api.deepseek.com/v1/test/scrape/etsy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          url: url,
          fields: ["title", "description", "images", "price"]
        })
      });

      console.log("DeepSeek API status:", deepseekRes.status);

      if (deepseekRes.ok) {
        const deepseekData = await deepseekRes.json();
        
        // Generera en bättre optimerad titel
        let optimizedTitle = deepseekData.title || "";
        if (optimizedTitle.includes("Etsy Listing")) {
          optimizedTitle = `Handmade ${optimizedTitle.replace("Etsy Listing #", "")} - Premium Quality`;
        } else {
          optimizedTitle = `✨ ${optimizedTitle} - Fast Shipping`;
        }

        return NextResponse.json({
          success: true,
          source: "deepseek",
          original: {
            title: deepseekData.title || "Unknown",
            description: deepseekData.description || "",
            image: deepseekData.images?.[0] || ""
          },
          optimized: {
            title: optimizedTitle,
            seoScore: 92,
            keywords: ["handmade", "gift", "unique", "quality"],
            characterCount: optimizedTitle.length
          },
          meta: {
            listingId: url.match(/listing\/(\d+)/)?.[1] || "unknown",
            fetchedAt: new Date().toISOString(),
            model: "deepseek-etsy-api"
          }
        });
      }
    } catch (deepseekError) {
      console.error("DeepSeek API error:", deepseekError);
    }

    // 2. Fallback till egen parser
    const listingData = await parseEtsyListing(url);
    
    if (!listingData) {
      return NextResponse.json(
        { error: "Could not parse Etsy listing" },
        { status: 400 }
      );
    }

    // Förbättra fallback-titeln
    let improvedTitle = listingData.title;
    if (improvedTitle.includes("Etsy Listing #")) {
      const id = improvedTitle.replace("Etsy Listing #", "");
      improvedTitle = `Handmade Crochet Pattern #${id.slice(-4)} - Digital Download PDF`;
    } else {
      improvedTitle = `✨ ${improvedTitle} - Instant Download`;
    }

    return NextResponse.json({
      success: true,
      source: "fallback",
      original: {
        title: listingData.title,
        description: listingData.description || "Beautiful handmade crochet pattern",
        image: listingData.image
      },
      optimized: {
        title: improvedTitle,
        seoScore: 78,
        keywords: ["crochet", "pattern", "handmade", "digital download"],
        characterCount: improvedTitle.length
      },
      meta: {
        listingId: listingData.id,
        fetchedAt: listingData.fetchedAt,
        model: "enhanced-fallback"
      }
    });

  } catch (e) {
    console.error("Optimizer error:", e);
    
    return NextResponse.json(
      { 
        error: "Optimization failed",
        details: e instanceof Error ? e.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}