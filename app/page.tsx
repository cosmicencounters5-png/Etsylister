---

## 😈 ERSTATT HELE FILEN

```tsx
"use client"

import { useState } from "react"

export default function Home(){

  const [product,setProduct]=useState("")
  const [loading,setLoading]=useState(false)
  const [raw,setRaw]=useState("")
  const [parsed,setParsed]=useState<any>(null)

  async function generate(){

    if(!product) return

    setLoading(true)
    setRaw("")
    setParsed(null)

    const res = await fetch("/api/generate",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body: JSON.stringify({ product })
    })

    const reader = res.body?.getReader()
    const decoder = new TextDecoder()

    let fullText=""

    while(true){

      const {done,value} = await reader!.read()
      if(done) break

      const chunk = decoder.decode(value)
      fullText += chunk

      setRaw(fullText) // show live stream
    }

    // CLEAN markdown formatting
    let cleaned = fullText
      .replace(/```json/g,"")
      .replace(/```/g,"")

    try{

      const json = JSON.parse(cleaned)
      setParsed(json)

    }catch(e){
      console.log("JSON parse failed")
    }

    setLoading(false)
  }

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
            {loading ? "🧠 Streaming AI..." : "Generate Listing"}
          </button>

        </div>

        {/* LIVE STREAM VIEW */}
        {loading && raw && (
          <div style={card}>
            <pre style={{whiteSpace:"pre-wrap"}}>{raw}</pre>
          </div>
        )}

        {/* PARSED CARDS */}
        {parsed && (
          <div>

            <div style={card}>
              <strong>TITLE</strong>
              <p>{parsed.title}</p>
              <button onClick={()=>copy(parsed.title)}>Copy</button>
            </div>

            <div style={card}>
              <strong>DESCRIPTION</strong>
              <p>{parsed.description}</p>
              <button onClick={()=>copy(parsed.description)}>Copy</button>
            </div>

            <div style={card}>
              <strong>TAGS</strong>
              <p>{parsed.tags}</p>
              <button onClick={()=>copy(parsed.tags)}>Copy</button>
            </div>

            <div style={card}>
              <strong>🧠 STRATEGY</strong>
              <p>{parsed.strategyInsights}</p>
            </div>

          </div>
        )}

      </div>

    </main>

  )
}