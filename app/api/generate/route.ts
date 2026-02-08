import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {

  const body = await req.json();
  const product = body.product || "product";

  const prompt = `
You are an Etsy SEO expert.

USER PRODUCT:
${product}

RULES:

- Generate Etsy listing
- Title max 140 characters
- High converting description
- EXACTLY 13 tags
- Each tag MAX 20 characters
- Tags must be comma separated

OUTPUT FORMAT:

TITLE:
...

DESCRIPTION:
...

TAGS:
tag1, tag2, tag3...
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: prompt
      }
    ]
  });

  const text = completion.choices[0].message.content;

  return Response.json({
    raw: text
  });

}