import type { MetadataRoute } from "next"
import { baseKeywords, seoTemplates } from "../lib/seoKeywords"

export default function sitemap(): MetadataRoute.Sitemap {

  const baseUrl = "https://etsylister.com"

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: `${baseUrl}/login`,
      changeFrequency: "monthly",
      priority: 0.8
    }
  ]

  const programmaticPages: MetadataRoute.Sitemap =
    baseKeywords.flatMap(keyword =>
      seoTemplates.map(template => {

        const slug = `${template}-${keyword}`
          .replaceAll(" ","-")

        return {
          url: `${baseUrl}/seo/${slug}`,
          changeFrequency: "weekly",
          priority: 0.9
        }

      })
    )

  return [...staticPages, ...programmaticPages]
}