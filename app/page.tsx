"use client"

import { useState, useEffect } from "react"

export default function Home(){

  const [chatOpen,setChatOpen]=useState(false)
  const [chatInput,setChatInput]=useState("")
  const [chatMessages,setChatMessages]=useState<any[]>([])

  const [input,setInput]=useState("")
  const [loading,setLoading]=useState(false)
  const [parsed,setParsed]=useState<any>(null)

  const [trend,setTrend]=useState<any>(null)
  const [dna,setDNA]=useState<any>(null)
  const [killer,setKiller]=useState<any>(null)
  const [profit,setProfit]=useState<any>(null)
  const [listingScore,setListingScore]=useState<any>(null)

  const [animatedScore,setAnimatedScore]=useState(0)
  const [aiThinking,setAiThinking]=useState("")

  function analyzeLiveSEO(text:string){

    const words=text.toLowerCase().split(" ").filter(Boolean)
    const buyerWords=["gift","pattern","template","digital","printable","handmade","diy","custom"]

    let intentScore=0
    buyerWords.forEach(w=>{
      if(words.includes(w)) intentScore++
    })

    const strength =
      words.length>=4 && intentScore>=1 ? "HIGH" :
      words.length>=2 ? "MEDIUM" : "LOW"

    const competition =
      words.length>=5 ? "LOW" :
      words.length>=3 ? "MEDIUM" : "HIGH"

    const trend =
      intentScore>=2 ? "STRONG" :
      intentScore>=1 ? "RISING" : "UNKNOWN"

    const intent =
      intentScore>=2 ? "EXCELLENT" :
      intentScore>=1 ? "GOOD" : "WEAK"

    return {strength,competition,trend,intent}
  }

  const liveSEO = analyzeLiveSEO(input)

  useEffect(()=>{

    if(!loading) return

    const steps=[
      "Scanning competitors...",
      "Analyzing market demand...",
      "Detecting ranking gaps...",
      "Calculating profitability...",
      "Optimizing strategy..."
    ]

    let i=0

    const interval=setInterval(()=>{
      setAiThinking(steps[i])
      i++
      if(i>=steps.length) clearInterval(interval)
    },700)

    return ()=>clearInterval(interval)

  },[loading])

  useEffect(()=>{

    if(input.length < 4) return

    const timeout = setTimeout(async()=>{

      const trendRes = await fetch("/api/trendEngine",{method:"POST",headers:{ "Content-Type":"application/json"},body: JSON.stringify({ product:input })})
      setTrend(await trendRes.json())

      const dnaRes = await fetch("/api/titleDNA",{method:"POST",headers:{ "Content-Type":"application/json"},body: JSON.stringify({ product:input })})
      setDNA(await dnaRes.json())

      const killerRes = await fetch("/api/killerEngine",{method:"POST",headers:{ "Content-Type":"application/json"},body: JSON.stringify({ product:input })})
      setKiller(await killerRes.json())

      const profitRes = await fetch("/api/profitGod",{method:"POST",headers:{ "Content-Type":"application/json"},body: JSON.stringify({ product:input })})
      setProfit(await profitRes.json())

      const scoreRes = await fetch("/api/listingGod",{method:"POST",headers:{ "Content-Type":"application/json"},body: JSON.stringify({ product:input })})
      setListingScore(await scoreRes.json())

    },800)

    return ()=>clearTimeout(timeout)

  },[input])

  useEffect(()=>{

    if(!listingScore) return

    let current=0

    const interval=setInterval(()=>{

      current+=2
      if(current>=listingScore.score){
        current=listingScore.score
        clearInterval(interval)
      }

      setAnimatedScore(current)

    },20)

    return ()=>clearInterval(interval)

  },[listingScore])

  async function generate(){

    if(!input) return

    setLoading(true)
    setParsed(null)

    const res=await fetch("/api/generate",{method:"POST",headers:{ "Content-Type":"application/json"},body: JSON.stringify({ product:input })})

    const data=await res.json()

    setParsed(data)
    setLoading(false)
  }

  function copy(text:string){
    navigator.clipboard.writeText(text)
  }

  const card:any={
    background:"#0e0e0e",
    borderRadius:16,
    padding:24,
    marginBottom:24
  }

  return(

    <main style={{
      minHeight:"100vh",
      display:"grid",
      gap:48,
      padding:40,
      gridTemplateColumns:"1fr"
    }}>

      <style>{`
        @media (min-width: 1000px) {
          main {
            grid-template-columns: 320px 1fr !important;
          }
        }
      `}</style>

      {/* SIDEBAR */}

      <div>

        <div style={card}>
          <strong>LIVE SEO SIGNAL</strong>
          <p>{liveSEO.strength} strength</p>
          <p>{liveSEO.intent} buyer intent</p>
        </div>

        {trend && profit && (
          <div style={card}>
            <strong>MARKET INTELLIGENCE</strong>
            <p>Opportunity: {profit.opportunity}</p>
            {trend.trending.map((t:any,i:number)=><div key={i}>• {t}</div>)}
          </div>
        )}

        {(dna || killer) && (
          <div style={card}>
            <strong>STRATEGY INSIGHTS</strong>
            {dna && <p>{dna.structure}</p>}
            {killer && killer.weaknesses.map((w:any,i:number)=><div key={i}>• {w}</div>)}
          </div>
        )}

      </div>

      {/* MAIN WORKSPACE */}

      <div>

        <h1 style={{fontSize:56,fontWeight:700,marginBottom:30}}>ETSYLISTER</h1>

        {listingScore && (
          <div style={{
            ...card,
            boxShadow:"0 0 50px rgba(0,255,255,0.25)"
          }}>
            <h2>👑 LISTING SCORE {animatedScore}/100</h2>
            <p>{listingScore.status}</p>
          </div>
        )}

        {loading && <p style={{opacity:0.6}}>{aiThinking}</p>}

        <input
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          placeholder="Describe product..."
          style={{width:"100%",padding:18,fontSize:16}}
        />

        <button onClick={generate} style={{marginTop:16,padding:18,width:"100%"}}>
          {loading ? "Analyzing..." : "Generate Listing"}
        </button>

        {parsed && (

          <div style={{marginTop:30}}>

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