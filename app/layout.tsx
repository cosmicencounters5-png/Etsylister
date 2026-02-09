import { Analytics } from "@vercel/analytics/react"

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