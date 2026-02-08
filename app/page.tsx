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

  function copy(text:string) {
    navigator.clipboard.writeText(text)
  }

  const cardStyle:any = {
    background:"#111",
    border:"1px solid #222",
    borderRadius:12,
    padding:16,
    marginTop:16
  }

  return (
    <main style={{
      minHeight:"100vh",
      background:"black",
      color:"white",
      display:"flex",
      alignItems:"center",
      justifyContent:"center"
    }}>

      <div style={{maxWidth:800,width:"100%",padding:20}}>

        <h1 style={{fontSize:48,fontWeight:"bold",textAlign:"center"}}>
          ETSYLISTER
        </h1>

        <div style={{background:"#111",padding:20,borderRadius:12}}>

          <input
            value={product}
            onChange={(e)=>setProduct(e.target.value)}
            placeholder="What are you selling?"
            style={{
              width:"100%",
              padding:12,
              marginBottom:12,
              background:"black",
              color:"white",
              border:"1px solid #333",
              borderRadius:8
            }}
          />

          <button
            onClick={generate}
            style={{
              width:"100%",
              padding:12,
              background:"white",
              color:"black",
              borderRadius:8,
              fontWeight:"bold"
            }}
          >
            {loading ? step : "Generate Listing"}
          </button>

        </div>

        {result && (

          <div>

            {/* TITLE */}
            <div style={cardStyle}>
              <strong>TITLE</strong>
              <p>{result.title}</p>
              <button onClick={()=>copy(result.title)}>Copy</button>
            </div>

            {/* DESCRIPTION */}
            <div style={cardStyle}>
              <strong>DESCRIPTION</strong>
              <p>{result.description}</p>
              <button onClick={()=>copy(result.description)}>Copy</button>
            </div>

            {/* TAGS */}
            <div style={cardStyle}>
              <strong>TAGS</strong>
              <p>{result.tags}</p>
              <button onClick={()=>copy(result.tags)}>Copy</button>
            </div>

            {/* WAR ROOM MARKET DATA */}
            {result.competitors && (

              <div style={cardStyle}>
                <strong>🔥 HIGH DEMAND MARKET DATA</strong>

                {result.competitors.map((c:any,i:number)=>(
                  <div key={i} style={{marginTop:12,borderBottom:"1px solid #222",paddingBottom:8}}>

                    <div>{c.title}</div>

                    <div style={{opacity:0.7,fontSize:14}}>
                      In cart: {c.inCart} | Reviews: {c.reviews} | Profitability score: {c.profitability.toFixed(2)}
                    </div>

                  </div>
                ))}

              </div>

            )}

          </div>

        )}

      </div>

    </main>
  )
}