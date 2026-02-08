export async function POST(req: Request) {

  const body = await req.json();
  const product = body.product;

  // Fake AI response (vi kobler OpenAI senere)
  const result = {
    title: `Premium ${product} | Handmade Gift Idea | Bestseller Style`,
    description: `This is a high-converting Etsy listing for ${product}. Generated using AI competitor analysis.`,
    tags: "etsy, handmade, trending, gift idea, bestseller, unique, shop now, ai listing"
  };

  return Response.json(result);

}