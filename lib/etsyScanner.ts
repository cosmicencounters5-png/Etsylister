const cache:any = {};

export async function scanEtsy(keyword: string) {

  const key = keyword.toLowerCase();

  // CACHE HIT
  if (cache[key] && Date.now() - cache[key].time < 1000 * 60 * 30) {
    console.log("CACHE HIT");
    return cache[key].data;
  }

  console.log("LIGHTNING LIVE SCAN");

  const searchUrl = `https://www.etsy.com/search?q=${encodeURIComponent(keyword)}`;

  const res = await fetch(searchUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  const html = await res.text();

  const links = [...html.matchAll(/"url":"(https:\\\/\\\/www\.etsy\.com\\\/listing\\\/.*?)"/g)]
    .map(m => m[1].replace(/\\\//g,"/"))
    .slice(0,10);

  // ⚡ PARALLEL SCANNING
  const results = await Promise.all(

    links.map(async (link) => {

      try {

        const page = await fetch(link, {
          headers: {
            "User-Agent": "Mozilla/5.0"
          }
        });

        const pageHtml = await page.text();

        const titleMatch = pageHtml.match(/<title>(.*?)<\/title>/i);
        const title = titleMatch ? titleMatch[1] : "";

        const cartMatch = pageHtml.match(/(\d+)\+?\s+people have this in their cart/i);
        const inCart = cartMatch ? parseInt(cartMatch[1]) : 0;

        const reviewMatch = pageHtml.match(/"reviewCount":(\d+)/);
        const reviews = reviewMatch ? parseInt(reviewMatch[1]) : 0;

        if (inCart >= 20) {

          const profitability =
            (inCart * 3) +
            Math.log(reviews + 1);

          return {
            title,
            inCart,
            reviews,
            profitability
          };
        }

      } catch(e) {}

      return null;

    })

  );

  const filtered = results.filter(Boolean);

  // SAVE CACHE
  cache[key] = {
    time: Date.now(),
    data: filtered
  };

  return filtered;
}