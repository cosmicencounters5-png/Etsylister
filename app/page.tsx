"use client"

import { useState, useEffect } from "react"

export default function Home() {

  const [product, setProduct] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [display, setDisplay] = useState<any>({})
  const [step, setStep] = useState("")

  async function generate() {

    if (!product) return

    setLoading(true)
    setResult(null)
    setDisplay({})

    setStep("🔎 Scanning Etsy competitors...")
    await new Promise(r => setTimeout(r, 800))

    setStep("📊 Analysing trends...")
    await new Promise(r => setTimeout(r, 800))

    setStep("🧠 AI strategist thinking...")

    const res = await fetch("/api/generate", {
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body: JSON.stringify({ product })
    })

    const data = await res.json()

    setResult(data)
    setLoading(false)
    setStep("")
  }

  // LIVE typing effect
  useEffect(()=>{

    if(!result) return

    async function reveal(){

      setDisplay({})

      await new Promise(r=>setTimeout(r,300))
      setDisplay((d:any)=>({...d,title:result.title}))

      await new Promise(r=>setTimeout(r,500))
      setDisplay((d:any)=>({...d,description:result.description}))

      await new Promise(r=>setTimeout(r,500))
      setDisplay((d:any)=>({...d,tags:result.tags}))

      await new Promise(r=>setTimeout(r,500))
      setDisplay((d:any)=>({...d,strategyInsights:result.strategyInsights}))

      setDisplay((d:any)=>({...d,competitors:result.competitors}))

    }

    reveal()

  },[result])

  function copy(text:string){
    navigator.clipboard.writeText(text)
  }

  const card:any={
    background:"#111",
    border:"1px solid #222",
    borderRadius:12,
    padding:16,
    marginTop:16
  }

  return (
    <main style={{minHeight:"100vh",background:"black",color:"white",display:"flex",justifyContent:"center"}}>

      <div style={{maxWidth:800,width:"100%",padding:20}}>

        <h1 style={{fontSize:48,fontWeight:"bold",textAlign:"center"}}>ETSYLISTER</h1>

        <div style={{background:"#111",padding:20,borderRadius:12}}>

          <input
            value={product}
            onChange={(e)=>setProduct(e.target.value)}
            placeholder="What are you selling?"
            style={{width:"100%",padding:12,marginBottom:12,background:"black",color:"white",border:"1px solid #333",borderRadius:8}}
          />

          <button onClick={generate} style={{width:"100%",padding:12,background:"white",color:"black",borderRadius:8,fontWeight:"bold"}}>
            {loading ? step : "Generate Listing"}
          </button>

        </div>

        {display.title && (
          <div style={card}>
            <strong>TITLE</strong>
            <p>{display.title}</p>
            <button onClick={()=>copy(display.title)}>Copy</button>
          </div>
        )}

        {display.description && (
          <div style={card}>
            <strong>DESCRIPTION</strong>
            <p>{display.description}</p>
            <button onClick={()=>copy(display.description)}>Copy</button>
          </div>
        )}

        {display.tags && (
          <div style={card}>
            <strong>TAGS</strong>
            <p>{display.tags}</p>
            <button onClick={()=>copy(display.tags)}>Copy</button>
          </div>
        )}

        {display.strategyInsights && (
          <div style={card}>
            <strong>🧠 AI STRATEGIST INSIGHTS</strong>
            <p>{display.strategyInsights}</p>
          </div>
        )}

        {display.competitors && (
          <div style={card}>
            <strong>🔥 WAR ROOM MARKET DATA</strong>
            {display.competitors.map((c:any,i:number)=>(
              <div key={i} style={{marginTop:10}}>
                <div>{c.title}</div>
                <div style={{opacity:0.7,fontSize:14}}>
                  In cart: {c.inCart} | Reviews: {c.reviews} | Profitability: {c.profitability.toFixed(2)} | Trend: {c.trendScore.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </main>
  )
}