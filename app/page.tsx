"use client"

import { useState, useEffect } from "react"

export default function Home(){

  const [input,setInput]=useState("")
  const [loading,setLoading]=useState(false)
  const [parsed,setParsed]=useState<any>(null)
  const [showResult,setShowResult]=useState(false)

  const [typed,setTyped]=useState<any>({
    title:"",
    description:"",
    tags:""
  })

  const [brainStep,setBrainStep]=useState("")
  const [autonomousSignals,setAutonomousSignals]=useState<string[]>([])
  const [liveMarket,setLiveMarket]=useState<any>(null)

  const [listingScore,setListingScore]=useState<any>(null)
  const [animatedScore,setAnimatedScore]=useState(0)
  const [copied,setCopied]=useState("")

  // 🔥 LIVE MARKET SCAN WHILE TYPING

  useEffect(()=>{

    if(input.length < 4){
      setLiveMarket(null)
      return
    }

    const timeout=setTimeout(async()=>{

      const res=await fetch("/api/liveMarket",{
        method:"POST",
        headers:{ "Content-Type":"application/json"},
        body:JSON.stringify({product:input})
      })

      try{
        const data=await res.json()
        setLiveMarket(data.marketInsights)
      }catch(e){}

    },900)

    return ()=>clearTimeout(timeout)

  },[input])

  // AUTONOMOUS ANALYZER

  useEffect(()=>{

    if(input.length < 3){
      setAutonomousSignals([])
      return
    }

    const words=input.toLowerCase()

    const signals=[]

    if(words.includes("pattern") || words.includes("template")){
      signals.push("Digital product niche detected")
    }

    if(words.includes("printable") || words.includes("download")){
      signals.push("Instant download buyer intent detected")
    }

    if(words.split(" ").length >=3){
      signals.push("Long-tail keyword structure identified")
    }

    if(words.includes("gift") || words.includes("custom")){
      signals.push("High buyer intent keyword detected")
    }

    signals.push("Etsy SEO alignment active")

    setAutonomousSignals(signals)

  },[input])

  async function generate(){

    if(!input) return

    setLoading(true)
    setShowResult(false)

    const res=await fetch("/api/generate",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body: JSON.stringify({ product:input })
    })

    const data=await res.json()

    setParsed(data)
    setTyped({title:"",description:"",tags:""})

    setLoading(false)
    setShowResult(true)
  }

  // AI THINKING

  useEffect(()=>{

    if(!loading) return

    const steps = [
      "Scanning Etsy competitors...",
      "Analyzing SEO patterns...",
      "Detecting buyer intent...",
      "Calculating profitability...",
      "Generating domination listing..."
    ]

    let i = 0

    const interval = setInterval(()=>{

      setBrainStep(steps[i])
      i++

      if(i >= steps.length){
        clearInterval(interval)
      }

    },600)

    return ()=>clearInterval(interval)

  },[loading])

  function copy(text:string,label:string){
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(()=>setCopied(""),1200)
  }

  return(

    <main style={{minHeight:"100vh",display:"flex",justifyContent:"center",paddingTop:80}}>

      <div style={{width:"100%",maxWidth:620}}>

        <h1 style={{fontSize:56,fontWeight:600,textAlign:"center",marginBottom:60}}>
          ETSYLISTER
        </h1>

        <div style={{background:"#0f0f0f",borderRadius:18,padding:24,marginBottom:20}}>

          <input
            value={input}
            onChange={(e)=>setInput(e.target.value)}
            placeholder="Describe your product..."
            style={{width:"100%",padding:20,fontSize:18,borderRadius:12,border:"1px solid #222",background:"#111",color:"white"}}
          />

          <button
            onClick={generate}
            style={{width:"100%",padding:18,marginTop:16,borderRadius:12,background:"white",color:"black",fontWeight:600}}
          >
            {loading ? "AI thinking..." : "Generate Listing"}
          </button>

        </div>

        {/* 🔥 LIVE MARKET PANEL */}

        {liveMarket && (

          <div style={{background:"#0f0f0f",padding:18,borderRadius:14,marginBottom:20}}>
            <strong>📊 LIVE MARKET INTELLIGENCE</strong>
            <p>Avg In Cart: {liveMarket.avgInCart}</p>
            <p>Demand: {liveMarket.demand}</p>
            <p>Competition: {liveMarket.competition}</p>
            <p>Trend: {liveMarket.trend}</p>
            <p>Opportunity: {liveMarket.opportunity}</p>
          </div>

        )}

        {autonomousSignals.length>0 && !loading && (
          <div style={{background:"#0f0f0f",padding:18,borderRadius:14,marginBottom:20}}>
            🤖 Live AI Analysis:
            {autonomousSignals.map((s,i)=><div key={i}>⚡ {s}</div>)}
          </div>
        )}

        {loading && (
          <div style={{background:"#0f0f0f",padding:18,borderRadius:14,marginBottom:20}}>
            🤖 {brainStep}
          </div>
        )}

      </div>

    </main>
  )
}