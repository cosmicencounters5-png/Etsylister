import { Metadata } from "next"
import LandingClient from "./LandingClient"

export const metadata: Metadata = {

  // 🔥 PRIMARY SEO TITLE
  title: "EtsyLister AI — Etsy SEO Tool, Listing Generator & Profitability Scanner",

  description:
    "EtsyLister AI scans Etsy competitors, detects profitable niches, and generates high-ranking Etsy listings using real marketplace data and advanced AI SEO analysis.",

  // 🔥 KEYWORD ENTITY STACKING (NOT OLD SEO — semantic signals)
  keywords: [
    "etsy seo tool",
    "etsy listing generator ai",
    "etsy keyword research tool",
    "etsy niche finder",
    "etsy listing optimization ai",
    "etsy seo software",
    "ai etsy listing generator",
    "etsy product research tool",
    "etsy profitability analyzer",
    "etsy ranking tool"
  ],

  metadataBase: new URL("https://yourdomain.com"),

  alternates: {
    canonical: "/"
  },

  // 🔥 OPEN GRAPH (social + google semantic context)
  openGraph: {
    title: "EtsyLister AI — Etsy SEO Domination Engine",
    description:
      "AI scans Etsy competitors, finds profitable niches, and builds listings designed to rank and sell.",
    url: "https://yourdomain.com",
    siteName: "EtsyLister AI",
    type: "website",
    locale: "en_US"
  },

  twitter: {
    card: "summary_large_image",
    title: "EtsyLister AI — Etsy Listing Domination",
    description:
      "AI scans Etsy. Finds profitable niches. Builds domination listings."
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
}

export default function Page(){

  return (
    <>
      {/* 🔥 CLIENT LANDING */}
      <LandingClient />

      {/* 🔥 HIDDEN SEO STRUCTURE — MASSIVE RANKING BOOST */}

      <section style={{display:"none"}}>

        <h2>Etsy SEO Tool powered by AI</h2>
        <p>
          EtsyLister AI is an advanced Etsy SEO tool designed to help sellers
          find profitable niches, analyze competitors, and generate optimized
          listings using artificial intelligence.
        </p>

        <h2>AI Etsy Listing Generator</h2>
        <p>
          Generate high-converting Etsy titles, descriptions, and tags using
          real marketplace data combined with AI-driven ranking analysis.
        </p>

        <h3>Etsy keyword research automation</h3>
        <p>
          Automatically detect long-tail keywords, buyer intent signals,
          and ranking patterns used by top-performing Etsy listings.
        </p>

        <h3>Etsy profitability analysis</h3>
        <p>
          Analyze demand, competition levels, and product opportunity scores
          to identify listings with high sales potential.
        </p>

      </section>
    </>
  )
}