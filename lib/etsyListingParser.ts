export async function parseEtsyListing(rawUrl: string) {

  if (!rawUrl) return null

  // 🔥 extract listing ID from ANY Etsy URL
  const match = rawUrl.match(/listing\/(\d+)/) || rawUrl.match(/(\d{6,})/)

  if (!match) return null

  const listingId = match[1]
  const listingUrl = `https://www.etsy.com/listing/${listingId}`

  try {

    // ⭐ First attempt — fetch real page
    const res = await fetch(listingUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept-Language": "en-US,en;q=0.9"
      },
      cache: "no-store"
    })

    const html = await res.text()

    // 🔥 Extract JSON-LD (real structured data)
    const matches = [...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
    )]

    for (const m of matches) {

      try {

        const data = JSON.parse(m[1])

        if (data["@type"] === "Product") {

          return {
            title: data.name || "",
            description: data.description || "",
            image: data.image || ""
          }

        }

      } catch (e) {}

    }

    // ⭐ FALLBACK — use oEmbed if JSON-LD missing

    try {

      const embed = await fetch(
        `https://www.etsy.com/oembed?url=${encodeURIComponent(listingUrl)}`
      )

      const data = await embed.json()

      return {
        title: data.title || "",
        description: "",
        image: data.thumbnail_url || ""
      }

    } catch (e) {
      console.log("oembed fallback failed")
    }

    return null

  } catch (e) {

    console.log("Etsy fetch failed", e)
    return null

  }

}