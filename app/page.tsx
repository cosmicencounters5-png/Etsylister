"use client"

import { useState } from "react"

export default function Home(){

  const [input,setInput]=useState("")
  const [loading,setLoading]=useState(false)
  const [raw,setRaw]=useState("")
  const [parsed,setParsed]=useState<any>(null)

  function detectMode(value:string){

    if(value.includes("etsy.com/listing/")){
      return "url"
    }

    return "product"
  }

  async function generate(){

    if(!input) return

    setLoading(true)
    setRaw("")
    setParsed(null)

    const mode = detectMode(input)

    const body:any={}

    if(mode==="url"){
      body.url=input
    }else{
      body.product=input
    }

    const res = await fetch("/api/generate",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body: JSON.stringify(body)
    })

    const reader=res.body?.getReader()
    const decoder=new TextDecoder()

    let fullText=""

    while(true){

      const {done,value}=await reader!.read()

      if(done) break

      const chunk=decoder.decode(value)

      fullText+=chunk

      setRaw(fullText)
    }

    let cleaned=fullText
      .replace(/```json/g,"")
      .replace(/```/g,"")

    try{
      const json=JSON.parse(cleaned)
      setParsed(json)
    }catch(e){
      console.log("parse failed")
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

  const modePreview = detectMode(input)

  return(

    <main style={{minHeight:"100vh",background:"black",color:"white",display:"flex",justifyContent:"center"}}>

      <div style={{maxWidth:800,width:"100%",padding:20}}>

        <h1 style={{fontSize:48,fontWeight:"bold",textAlign:"center"}}>ETSYLISTER</h1>

        <div style={{background:"#111",padding:20,borderRadius:12}}>

          <input
            value={input}
            onChange={(e)=>setInput(e.target.value)}
            placeholder="Describe product OR paste Etsy listing link"
            style={{width:"100%",padding:12,marginBottom:12,background:"black",color:"white",border:"1px solid #333",borderRadius:8}}
          />

          {/* AUTO MODE PREVIEW */}
          {input && (
            <div style={{marginBottom:10,opacity:0.7,fontSize:14}}>
              Mode detected: {modePreview==="url" ? "🔥 Upgrade Existing Listing" : "✨ Generate New Listing"}
            </div>
          )}

          <button onClick={generate} style={{width:"100%",padding:12,background:"white",color:"black",borderRadius:8,fontWeight:"bold"}}>
            {loading ? "🧠 AI streaming..." : "Generate"}
          </button>

        </div>

        {loading && raw && (
          <div style={card}>
            <pre style={{whiteSpace:"pre-wrap"}}>{raw}</pre>
          </div>
        )}

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