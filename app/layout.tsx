export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>

        {/* 🔥 MOBILE + DESKTOP SAFE VIEWPORT */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />

        {/* 🔥 Smooth font rendering */}
        <meta name="theme-color" content="#050505" />

      </head>

      <body
        style={{
          margin:0,
          padding:0,
          background:"#050505",
          color:"white",
          fontFamily:"-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
        }}
      >

        {/* 🔥 PRO CONTAINER (desktop friendly) */}
        <div
          style={{
            maxWidth:1200,
            margin:"0 auto",
            padding:"env(safe-area-inset-top) 16px env(safe-area-inset-bottom)"
          }}
        >
          {children}
        </div>

      </body>
    </html>
  )
}