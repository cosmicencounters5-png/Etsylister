"use client"

import { useState } from "react"

export default function Home(){

  const [input,setInput]=useState("")
  const [loading,setLoading]=useState(false)
  const [raw,setRaw]=useState("")
  const [parsed,setParsed]=useState<any>(null)

  async function generate(){

    if(!input) return

    setLoading(true)
    setRaw("")
    setParsed(null)

    const res=await fetch("/api/generate",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body: JSON.stringify({ product:input })
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
    }catch(e){}

    setLoading(false)
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

        <input
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          placeholder="Describe product..."
          style={{width:"100%",padding:12,marginBottom:12}}
        />

        <button onClick={generate}>
          {loading ? "🔥 Calculating domination..." : "Generate"}
        </button>

        {parsed && (

          <div>

            <div style={card}>
              <strong>🔥 DOMINATION SCORE</strong>
              <p>{parsed.dominationScore}</p>
              <p>SEO Advantage: {parsed.seoAdvantage}</p>
              <p>Keyword Coverage: {parsed.keywordCoverage}</p>
            </div>

            <div style={card}>
              <strong>TITLE</strong>
              <p>{parsed.title}</p>
            </div>

            <div style={card}>
              <strong>DESCRIPTION</strong>
              <p>{parsed.description}</p>
            </div>

            <div style={card}>
              <strong>TAGS</strong>
              <p>{parsed.tags}</p>
            </div>

            <div style={card}>
              <strong>STRATEGY</strong>
              <p>{parsed.strategyInsights}</p>
            </div>

          </div>

        )}

      </div>

    </main>

  )
}