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

    // 1. Parse Etsy listing
    const listingData = await parseEtsyListing(url);
    
    if (!listingData) {
      return NextResponse.json(
        { error: "Could not parse Etsy listing" },
        { status: 400 }
      );
    }

    // 2. Optimera med Gemini (Flash för snabbare svar)
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Optimize this Etsy product title for SEO and conversions:

Original title: "${listingData.title}"

Requirements:
- Max 140 characters
- Include key product features
- Add emotional triggers
- Keep brand name if present
- Front-load important keywords

Return ONLY valid JSON:
{
  "optimizedTitle": "your optimized title here",
  "seoScore": 0-100,
  "keywords": ["keyword1", "keyword2"],
  "characterCount": 0
}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200
          }
        })
      }
    );

    if (!geminiRes.ok) {
      throw new Error(`Gemini API error: ${geminiRes.status}`);
    }

    const geminiData = await geminiRes.json();
    
    let text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    text = text.replace(/```json\s*|\s*```/g, "").trim();
    
    let optimized;
    try {
      optimized = JSON.parse(text);
    } catch {
      // Fallback om JSON parsning misslyckas
      optimized = {
        optimizedTitle: listingData.title,
        seoScore: 50,
        keywords: [],
        characterCount: listingData.title.length
      };
    }

    // 3. Returnera komplett data - utan price/currency
    return NextResponse.json({
      success: true,
      original: {
        title: listingData.title,
        description: listingData.description,
        image: listingData.image || ""
      },
      optimized: {
        title: optimized.optimizedTitle || listingData.title,
        seoScore: optimized.seoScore || 75,
        keywords: optimized.keywords || [],
        characterCount: optimized.characterCount || listingData.title.length
      },
      meta: {
        listingId: listingData.id,
        fetchedAt: listingData.fetchedAt,
        model: "gemini-1.5-flash",
        fallback: listingData.fallback || false
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