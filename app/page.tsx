"use client"

import { useState } from "react"

export default function Home() {

  const [product, setProduct] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [step, setStep] = useState("")

  async function generate() {

    if (!product) return

    setLoading(true)
    setResult(null)

    setStep("🔎 Scanning Etsy competitors...")
    await new Promise(r => setTimeout(r, 1000))

    setStep("📊 Analysing keywords...")
    await new Promise(r => setTimeout(r, 1000))

    setStep("🧠 Generating listing...")

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
    setStep("")
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
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            {loading ? step : "Generate Listing"}
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