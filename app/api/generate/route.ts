import OpenAI from "openai";
import { scanEtsy } from "../../../lib/etsyScanner";
import { analyzeSEO } from "../../../lib/seoAnalyzer";
import { parseEtsyListing } from "../../../lib/etsyListingParser";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request){

  const body = await req.json()

  const product = body.product
  const url = body.url

  let existingListing:any = null

  if(url){
    existingListing = await parseEtsyListing(url)
  }

  const keyword = product || existingListing?.title || "product"

  const competitors = await scanEtsy(keyword)

  const titles = competitors.map(c=>c.title)

  const seo = analyzeSEO(titles)

  const stream = await openai.chat.completions.create({
    model:"gpt-4o-mini",
    stream:true,
    messages:[
      {
        role:"user",
        content:`

You are an elite Etsy optimization strategist.

USER PRODUCT:
${keyword}

EXISTING LISTING:
${JSON.stringify(existingListing,null,2)}

COMPETITOR DATA:
${JSON.stringify(competitors,null,2)}

TOP KEYWORDS:
${seo.topKeywords.join(", ")}

TASK:

If existing listing exists:
→ upgrade it to beat competitors.

Return JSON:

{
"title":"",
"description":"",
"tags":"",
"strategyInsights":""
}
`
      }
    ]
  })

  const encoder = new TextEncoder()

  const readable = new ReadableStream({

    async start(controller){

      for await(const chunk of stream){

        const content = chunk.choices[0]?.delta?.content || ""

        controller.enqueue(encoder.encode(content))
      }

      controller.close()
    }

  })

  return new Response(readable,{
    headers:{ "Content-Type":"text/plain" }
  })
}