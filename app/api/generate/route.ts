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

  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    stream: true,
    messages: [
      {
        role: "user",
        content: `
You are an elite Etsy AI strategist.

USER PRODUCT:
${product}

COMPETITOR DATA:
${JSON.stringify(competitors,null,2)}

TOP KEYWORDS:
${seo.topKeywords.join(", ")}

LONG TAIL PHRASES:
${seo.topPhrases.join(", ")}

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
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {

      for await (const chunk of stream) {

        const content = chunk.choices[0]?.delta?.content || "";

        controller.enqueue(encoder.encode(content));
      }

      controller.close();
    }
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain" }
  });
}