"use client"

import { useState, useEffect } from "react"

export default function Home(){

  const [input,setInput]=useState("")
  const [loading,setLoading]=useState(false)
  const [raw,setRaw]=useState("")
  const [parsed,setParsed]=useState<any>(null)
  const [radar,setRadar]=useState<any>(null)

  function analyzeLiveSEO(text:string){

    const words=text.toLowerCase().split(" ").filter(Boolean)

    const buyerWords=["gift","pattern","template","digital","printable","handmade","diy","custom"]

    let intentScore=0

    buyerWords.forEach(w=>{
      if(words.includes(w)) intentScore++
    })

    const lengthScore = words.length

    const strength =
      lengthScore>=4 && intentScore>=1 ? "HIGH" :
      lengthScore>=2 ? "MEDIUM" : "LOW"

    const competition =
      lengthScore>=5 ? "LOW" :
      lengthScore>=3 ? "MEDIUM" : "HIGH"

    const trend =
      intentScore>=2 ? "STRONG" :
      intentScore>=1 ? "RISING" : "UNKNOWN"

    const intent =
      intentScore>=2 ? "EXCELLENT" :
      intentScore>=1 ? "GOOD" : "WEAK"

    return {
      strength,
      competition,
      trend,
      intent
    }
  }

  const liveSEO = analyzeLiveSEO(input)

  // 😈 LIVE MARKET RADAR
  useEffect(()=>{

    if(input.length < 4) return

    const timeout = setTimeout(async()=>{

      const res = await fetch("/api/marketRadar",{
        method:"POST",
        headers:{ "Content-Type":"application/json"},
        body: JSON.stringify({ product:input })
      })

      const data = await res.json()

      setRadar(data)

    },800)

    return ()=>clearTimeout(timeout)

  },[input])

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

  function copy(text:string){
    navigator.clipboard.writeText(text)
  }

  const glow:any={
    background:"#111",
    border:"1px solid #2affff",
    boxShadow:"0 0 20px rgba(0,255,255,0.2)",
    borderRadius:12,
    padding:18,
    marginTop:18
  }

  const copyBtn:any={
    marginTop:10,
    padding:"6px 12px",
    background:"#2affff",
    color:"black",
    border:"none",
    borderRadius:6,
    cursor:"pointer",
    fontWeight:"bold"
  }

  return(

    <main style={{minHeight:"100vh",background:"#050505",color:"white",display:"flex",justifyContent:"center"}}>

      <div style={{maxWidth:850,width:"100%",padding:24}}>

        <h1 style={{fontSize:50,fontWeight:"bold",textAlign:"center",letterSpacing:2}}>
          ETSYLISTER ⚡
        </h1>

        <input
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          placeholder="Describe product..."
          style={{width:"100%",padding:14,marginTop:20}}
        />

        {input && (
          <div style={glow}>
            <strong>⚡ LIVE SEO SCANNER</strong>
            <p>Keyword Strength: {liveSEO.strength}</p>
            <p>Competition Level: {liveSEO.competition}</p>
            <p>Trend Signal: {liveSEO.trend}</p>
            <p>Buyer Intent: {liveSEO.intent}</p>
          </div>
        )}

        {radar && (
          <div style={glow}>
            <strong>🚀 LIVE MARKET RADAR</strong>
            <p>Demand: {radar.demand}</p>
            <p>Avg In Cart: {radar.avgInCart}</p>
            <p>Trend Direction: {radar.trend}</p>
            <p>Competition Quality: {radar.competition}</p>
          </div>
        )}

        <button onClick={generate} style={{marginTop:10,padding:14,width:"100%"}}>
          {loading ? "🔥 Reverse engineering..." : "Generate"}
        </button>

        {parsed && (

          <div>

            <div style={glow}>
              <strong>🔥 WINNING TITLE FORMULA</strong>
              <p>{parsed.titleFormula}</p>
            </div>

            <div style={glow}>
              <strong>🔥 DOMINATION SCORE</strong>
              <p>{parsed.dominationScore}</p>
              <p>SEO Advantage: {parsed.seoAdvantage}</p>
              <p>Keyword Coverage: {parsed.keywordCoverage}</p>
            </div>

            <div style={glow}>
              <strong>🧠 WHY COMPETITORS WIN</strong>
              <p>{parsed.competitorInsights}</p>
            </div>

            <div style={glow}>
              <strong>TITLE</strong>
              <p>{parsed.title}</p>
              <button style={copyBtn} onClick={()=>copy(parsed.title)}>Copy</button>
            </div>

            <div style={glow}>
              <strong>DESCRIPTION</strong>
              <p>{parsed.description}</p>
              <button style={copyBtn} onClick={()=>copy(parsed.description)}>Copy</button>
            </div>

            <div style={glow}>
              <strong>TAGS</strong>
              <p>{parsed.tags}</p>
              <button style={copyBtn} onClick={()=>copy(parsed.tags)}>Copy</button>
            </div>

          </div>

        )}

      </div>

    </main>

  )
}