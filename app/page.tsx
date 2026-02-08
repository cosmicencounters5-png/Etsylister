"use client"

import { useState } from "react"

export default function Home() {

  const [product,setProduct]=useState("")
  const [loading,setLoading]=useState(false)
  const [streamText,setStreamText]=useState("")
  const [step,setStep]=useState("")

  async function generate(){

    if(!product) return

    setLoading(true)
    setStreamText("")

    setStep("🔎 Scanning Etsy competitors...")

    const res = await fetch("/api/generate",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body: JSON.stringify({ product })
    })

    const reader = res.body?.getReader()
    const decoder = new TextDecoder()

    while(true){

      const {done,value} = await reader!.read()
      if(done) break

      const chunk = decoder.decode(value)

      setStreamText(prev=>prev+chunk)
    }

    setLoading(false)
    setStep("")
  }

  return(
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
            {loading ? "🧠 AI thinking live..." : "Generate Listing"}
          </button>

        </div>

        {streamText && (
          <div style={{marginTop:20,background:"#111",padding:20,borderRadius:12}}>
            <pre style={{whiteSpace:"pre-wrap"}}>{streamText}</pre>
          </div>
        )}

      </div>

    </main>
  )
}