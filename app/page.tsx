export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "black",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{ maxWidth: 600, width: "100%", padding: 20 }}>

        <h1 style={{
          fontSize: 48,
          fontWeight: "bold",
          textAlign: "center"
        }}>
          ETSYLISTER
        </h1>

        <p style={{
          textAlign: "center",
          opacity: 0.7,
          marginBottom: 40
        }}>
          AI-powered Etsy listing generator based on live competitor analysis
        </p>

        <div style={{
          background: "#111",
          padding: 20,
          borderRadius: 12
        }}>

          <input
            placeholder="What are you selling?"
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 12,
              background: "black",
              color: "white",
              border: "1px solid #333",
              borderRadius: 8
            }}
          />

          <button style={{
            width: "100%",
            padding: 12,
            background: "white",
            color: "black",
            borderRadius: 8,
            fontWeight: "bold"
          }}>
            Generate Listing
          </button>

        </div>

      </div>
    </main>
  )
}