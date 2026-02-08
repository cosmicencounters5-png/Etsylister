"use client"

import { useState } from "react"

export default function Home() {

  const [product, setProduct] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  async function generate() {

    setLoading(true)

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ product })
    })

    const data = await res.json()

    setResult(data)
    setLoading(false)
  }

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

        <h1 style={{ fontSize: 48, fontWeight: "bold", textAlign: "center" }}>
          ETSYLISTER
        </h1>

        <div style={{ background: "#111", padding: 20, borderRadius: 12 }}>

          <input
            value={product}
            onChange={(e)=>setProduct(e.target.value)}
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

          <button
            onClick={generate}
            style={{
              width: "100%",
              padding: 12,
              background: "white",
              color: "black",
              borderRadius: 8,
              fontWeight: "bold"
            }}
          >
            {loading ? "Scanning Etsy AI..." : "Generate Listing"}
          </button>

        </div>

        {result && (
          <div style={{ marginTop: 20 }}>
            <h2>{result.title}</h2>
            <p>{result.description}</p>
            <p>{result.tags}</p>
          </div>
        )}

      </div>
    </main>
  )
}