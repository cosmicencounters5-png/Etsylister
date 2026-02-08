import OpenAI from "openai";
import { scanEtsy } from "../../../lib/etsyScanner";
import { analyzeSEO } from "../../../lib/seoAnalyzer";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {

  const body = await req.json();
  const product = body.product || "product";

  const competitors = await scanEtsy(product);

  const titles = competitors.map(c => c.title);

  const seo = analyzeSEO(titles);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `
You are an elite Etsy SEO expert.

USER PRODUCT:
${product}

REAL COMPETITOR DATA:
${JSON.stringify(competitors,null,2)}

TOP KEYWORDS:
${seo.topKeywords.join(", ")}

LONG TAIL PHRASES:
${seo.topPhrases.join(", ")}

RULES:

- Title max 140 characters
- EXACTLY 13 tags
- each tag max 20 characters
- comma separated

Return ONLY JSON:

{
"title":"",
"description":"",
"tags":""
}
`
      }
    ]
  });

  let text = completion.choices[0].message.content || "{}";

  text = text.replace(/```json/g,"").replace(/```/g,"");

  const data = JSON.parse(text);

  // return competitor data too (for UI later)
  return Response.json({
    ...data,
    competitors
  });
}