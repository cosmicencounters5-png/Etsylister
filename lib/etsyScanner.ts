export async function scanEtsy(keyword: string) {

  const searchUrl = `https://www.etsy.com/search?q=${encodeURIComponent(keyword)}`;

  const res = await fetch(searchUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  const html = await res.text();

  // Find listing URLs
  const links = [...html.matchAll(/"url":"(https:\\\/\\\/www\.etsy\.com\\\/listing\\\/.*?)"/g)]
    .map(m => m[1].replace(/\\\//g,"/"))
    .slice(0,10);

  const winners: string[] = [];

  for (const link of links) {

    try {

      const page = await fetch(link, {
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      });

      const pageHtml = await page.text();

      // Check in-cart signal
      const match = pageHtml.match(/(\d+)\+?\s+people have this in their cart/i);

      if (match) {

        const count = parseInt(match[1]);

        if (count >= 20) {

          const titleMatch = pageHtml.match(/<title>(.*?)<\/title>/i);

          if (titleMatch) {
            winners.push(titleMatch[1]);
          }
        }
      }

    } catch(e) {
      // skip errors
    }
  }

  return winners;
}