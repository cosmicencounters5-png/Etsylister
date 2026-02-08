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

  const seo = analyzeSEO(competitors);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `
You are an elite Etsy SEO expert.

USER PRODUCT:
${product}

REAL COMPETITOR TITLES:
${competitors.join("\n")}

TOP SINGLE KEYWORDS:
${seo.topKeywords.join(", ")}

TOP LONG-TAIL PHRASES:
${seo.topPhrases.join(", ")}

PIPE SYMBOL USAGE:
${seo.pipeUsage}

RULES:

- Title max 140 characters
- Use proven Etsy structure
- High converting description
- EXACTLY 13 tags
- Each tag MAX 20 characters
- Tags comma separated

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

  return Response.json(data);
}