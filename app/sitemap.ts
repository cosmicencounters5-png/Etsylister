import type { MetadataRoute } from "next"
import { baseKeywords, seoTemplates } from "../lib/seoKeywords"
import { ideaKeywords } from "../lib/ideaKeywords" // NEW

export default function sitemap(): MetadataRoute.Sitemap {

  const baseUrl = "https://etsylister.com"

  // 🔥 STATIC CORE PAGES
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
    },

    // NEW — feature pages
    {
      url: `${baseUrl}/optimize`,
      changeFrequency: "weekly",
      priority: 0.9
    },
    {
      url: `${baseUrl}/dashboard`,
      changeFrequency: "weekly",
      priority: 0.7
    }
  ]

  // 🔥 EXISTING PROGRAMMATIC SEO
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

  // 🔥 NEW IDEA ENGINE (TRAFFIC MACHINE)
  const ideaPages: MetadataRoute.Sitemap =
    ideaKeywords.map(keyword => {

      const slug = keyword.replaceAll(" ","-")

      return {
        url: `${baseUrl}/idea/${slug}`,
        changeFrequency: "weekly",
        priority: 0.85
      }

    })

  return [
    ...staticPages,
    ...programmaticPages,
    ...ideaPages
  ]
}