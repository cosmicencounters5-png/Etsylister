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

  const [copied,setCopied]=useState("")

  // LIVE MARKET SCAN

  useEffect(()=>{

    if(input.length < 4){
      setLiveMarket(null)
      return
    }

    const timeout=setTimeout(async()=>{

      try{

        const res=await fetch("/api/liveMarket",{
          method:"POST",
          headers:{ "Content-Type":"application/json"},
          body:JSON.stringify({product:input})
        })

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

  // TYPING EFFECT

  useEffect(()=>{

    if(!parsed) return

    function typeField(field:string,value:string,delay:number){

      let i=0

      const interval=setInterval(()=>{

        i++

        setTyped((prev:any)=>({
          ...prev,
          [field]:value.slice(0,i)
        }))

        if(i>=value.length){
          clearInterval(interval)
        }

      },delay)

    }

    typeField("title",parsed.title,10)
    setTimeout(()=>typeField("description",parsed.description,2),400)
    setTimeout(()=>typeField("tags",parsed.tags,8),800)

  },[parsed])

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

        {/* LIVE MARKET */}

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

        {showResult && parsed && (
          <div>

            <ResultBlock title="TITLE" text={typed.title} label="title" copied={copied} copy={copy}/>
            <ResultBlock title="DESCRIPTION" text={typed.description} label="description" copied={copied} copy={copy}/>
            <TagBlock tags={typed.tags} label="tags" copied={copied} copy={copy}/>
            <StrategyPanel parsed={parsed}/>

          </div>
        )}

      </div>

    </main>
  )
}

// RESULT COMPONENTS (UNCHANGED)

function ResultBlock({title,text,label,copied,copy}:any){
  return(
    <div style={{background:"#0f0f0f",padding:24,borderRadius:16,marginBottom:20}}>
      <strong>{title}</strong>
      <p style={{marginTop:10,opacity:.85}}>{text}</p>
      <button onClick={()=>copy(text,label)} style={{marginTop:12,background:"#222",color:"white",padding:"8px 14px",borderRadius:8}}>
        {copied===label ? "Copied ✓" : "Copy"}
      </button>
    </div>
  )
}

function TagBlock({tags,label,copied,copy}:any){

  const tagArray = tags.split(",")

  return(
    <div style={{background:"#0f0f0f",padding:24,borderRadius:16,marginBottom:20}}>
      <strong>TAGS</strong>
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:12}}>
        {tagArray.map((t:string,i:number)=>(
          <span key={i} style={{background:"#1a1a1a",padding:"6px 10px",borderRadius:999,fontSize:14}}>
            {t.trim()}
          </span>
        ))}
      </div>
      <button onClick={()=>copy(tags,label)} style={{marginTop:12,background:"#222",color:"white",padding:"8px 14px",borderRadius:8}}>
        {copied===label ? "Copied ✓" : "Copy"}
      </button>
    </div>
  )
}

function StrategyPanel({parsed}:any){

  if(!parsed) return null

  return(
    <div style={{background:"#0f0f0f",padding:24,borderRadius:16,marginTop:20}}>
      <strong>🧠 AI Strategy Insights</strong>
      {parsed.titleFormula && <p style={{marginTop:10}}><b>Winning Title Formula:</b> {parsed.titleFormula}</p>}
      {parsed.strategyInsights && <p style={{marginTop:10}}>{parsed.strategyInsights}</p>}
      {parsed.seoAdvantage && <p style={{marginTop:10}}><b>SEO Advantage:</b> {parsed.seoAdvantage}</p>}
      {parsed.competitorInsights && <p style={{marginTop:10}}><b>Competitor Insights:</b> {parsed.competitorInsights}</p>}
    </div>
  )
}