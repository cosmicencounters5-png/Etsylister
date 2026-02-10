import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  metadataBase: new URL("https://etsylister.com"),

  title: {
    default: "EtsyLister AI — Create Etsy Listings That Rank & Sell",
    template: "%s | EtsyLister AI"
  },

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

  verification: {
    // 🔥 PASTE GOOGLE CODE HERE
    google: "PASTE_GOOGLE_VERIFICATION_CODE"
  },

  openGraph: {
    title: "EtsyLister AI — Etsy SEO Domination Engine",
    description:
      "Scan Etsy competitors, find profitable niches, and generate listings that actually rank.",
    url: "https://etsylister.com",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>

        {/* MOBILE SAFE VIEWPORT */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />

        <meta name="theme-color" content="#050505" />

        {/* Apple font smoothing + global styles */}
        <style>{`
          html, body {
            margin:0;
            padding:0;
            background:#050505;
            color:white;
            font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
            -webkit-font-smoothing:antialiased;
            text-rendering:optimizeLegibility;
          }

          * {
            box-sizing:border-box;
          }

          input, button {
            font-family:inherit;
            font-size:16px; /* prevents iOS zoom */
          }
        `}</style>

      </head>

      <body>

        {/* CENTERED APP CONTAINER */}
        <div
          style={{
            maxWidth:860,
            margin:"0 auto",
            padding:"env(safe-area-inset-top) 20px env(safe-area-inset-bottom)"
          }}
        >
          {children}
        </div>

        {/* 🔥 VERCEL ANALYTICS */}
        <Analytics />

      </body>
    </html>
  )
}