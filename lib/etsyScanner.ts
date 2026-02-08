export async function scanEtsy(keyword: string) {

  const url = `https://www.etsy.com/search?q=${encodeURIComponent(keyword)}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  const html = await res.text();

  // Extract listing titles (basic version)
  const matches = [...html.matchAll(/"name":"(.*?)"/g)];

  const titles = matches
    .map(m => m[1])
    .filter(t => t.length > 5)
    .slice(0,20);

  return titles;
}