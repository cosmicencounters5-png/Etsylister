"use client"

import { useState, useEffect } from "react"

export default function Home(){

  const [input,setInput]=useState("")
  const [loading,setLoading]=useState(false)
  const [parsed,setParsed]=useState<any>(null)
  const [radar,setRadar]=useState<any>(null)
  const [trend,setTrend]=useState<any>(null)
  const [dna,setDNA]=useState<any>(null)
  const [killer,setKiller]=useState<any>(null)

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

  useEffect(()=>{

    if(input.length < 4) return

    const timeout = setTimeout(async()=>{

      const radarRes = await fetch("/api/marketRadar",{method:"POST",headers:{ "Content-Type":"application/json"},body: JSON.stringify({ product:input })})
      setRadar(await radarRes.json())

      const trendRes = await fetch("/api/trendEngine",{method:"POST",headers:{ "Content-Type":"application/json"},body: JSON.stringify({ product:input })})
      setTrend(await trendRes.json())

      const dnaRes = await fetch("/api/titleDNA",{method:"POST",headers:{ "Content-Type":"application/json"},body: JSON.stringify({ product:input })})
      setDNA(await dnaRes.json())

      const killerRes = await fetch("/api/killerEngine",{method:"POST",headers:{ "Content-Type":"application/json"},body: JSON.stringify({ product:input })})
      setKiller(await killerRes.json())

    },800)

    return ()=>clearTimeout(timeout)

  },[input])

  async function generate(){

    if(!input) return

    setLoading(true)
    setParsed(null)

    const res=await fetch("/api/generate",{method:"POST",headers:{ "Content-Type":"application/json"},body: JSON.stringify({ product:input })})

    const reader=res.body?.getReader()
    const decoder=new TextDecoder()

    let fullText=""

    while(true){
      const {done,value}=await reader!.read()
      if(done) break
      fullText+=decoder.decode(value)
    }

    let cleaned=fullText.replace(/```json/g,"").replace(/```/g,"")

    try{
      setParsed(JSON.parse(cleaned))
    }catch(e){}

    setLoading(false)
  }

  function copy(text:string){
    navigator.clipboard.writeText(text)
  }

  const card:any={
    background:"#111",
    border:"1px solid #2affff",
    boxShadow:"0 0 20px rgba(0,255,255,0.15)",
    borderRadius:12,
    padding:18,
    marginBottom:18
  }

  return(

    <main style={{minHeight:"100vh",display:"grid",gap:24,gridTemplateColumns:"1fr"}}>

      <style>{`
        @media (min-width: 900px) {
          main {
            grid-template-columns: 300px 1fr !important;
          }
        }
      `}</style>

      {/* SIDEBAR */}

      <div>

        <div style={card}>
          <strong>⚡ LIVE SEO SCANNER</strong>
          {input ? (
            <>
              <p>Strength: {liveSEO.strength}</p>
              <p>Competition: {liveSEO.competition}</p>
              <p>Trend: {liveSEO.trend}</p>
              <p>Intent: {liveSEO.intent}</p>
            </>
          ) : <p>Type product...</p>}
        </div>

        {trend && (
          <div style={card}>
            <strong>🔥 AI TREND ENGINE</strong>
            {trend.trending.map((t:any,i:number)=><div key={i}>- {t}</div>)}
          </div>
        )}

        {dna && (
          <div style={card}>
            <strong>🧬 TITLE DNA ENGINE</strong>
            <p>{dna.structure}</p>
          </div>
        )}

        {killer && (
          <div style={card}>
            <strong>☠️ COMPETITOR KILLER ENGINE</strong>
            {killer.weaknesses.map((w:any,i:number)=><div key={i}>- {w}</div>)}
          </div>
        )}

      </div>

      {/* MAIN PANEL RESTORED */}

      <div>

        <h1 style={{fontSize:48,fontWeight:"bold"}}>
          ETSYLISTER ⚡
        </h1>

        <input
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          placeholder="Describe product..."
          style={{width:"100%",padding:14,marginTop:20,fontSize:16}}
        />

        <button onClick={generate} style={{marginTop:12,padding:14,width:"100%"}}>
          {loading ? "🔥 Reverse engineering..." : "Generate"}
        </button>

        {parsed && (

          <div style={{marginTop:20}}>

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

          </div>

        )}

      </div>

    </main>
  )
}