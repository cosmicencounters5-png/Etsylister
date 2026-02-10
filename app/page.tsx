import { Metadata } from "next"
import LandingClient from "./LandingClient"

export const metadata: Metadata = {
  title: "EtsyLister AI — Create Etsy Listings That Rank & Sell",
  description:
    "AI-powered Etsy listing generator that scans competitors, finds profitable niches, and builds domination listings using real marketplace data.",
  keywords: [
    "etsy seo",
    "etsy listing generator",
    "etsy ai tool",
    "etsy keyword research",
    "etsy listing optimization",
    "etsy ranking tool",
    "etsy seller tools",
    "etsy seo software",
    "ai etsy listings"
  ],
  openGraph: {
    title: "EtsyLister AI — Etsy SEO Domination Engine",
    description:
      "Scan Etsy competitors, find profitable niches, and generate listings that actually rank.",
    url: "https://yourdomain.com",
    siteName: "EtsyLister AI",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "EtsyLister AI — Etsy Listing Domination",
    description:
      "AI scans Etsy. Finds profitable niches. Builds domination listings."
  },
  robots: {
    index: true,
    follow: true
  }
}

export default function Page(){
  return <LandingClient />
}