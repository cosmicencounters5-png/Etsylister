"use client"

import { useState, useEffect } from "react"

export default function Home(){

  const [input,setInput]=useState("")
  const [loading,setLoading]=useState(false)
  const [parsed,setParsed]=useState<any>(null)
  const [showResult,setShowResult]=useState(false)

  const [typed,setTyped]=useState({
    title:"",
    description:"",
    tags:""
  })

  const [brainStep,setBrainStep]=useState("")
  const [autonomousSignals,setAutonomousSignals]=useState<string[]>([])
  const [liveMarket,setLiveMarket]=useState<any>(null)

  const [liveDomination,setLiveDomination]=useState({score:0,level:"LOW"})
  const [copied,setCopied]=useState("")

  function calculateLiveDomination(text:string){

    const words=text.toLowerCase()

    let score=0

    if(words.includes("pattern") || words.includes("template")) score+=20
    if(words.includes("printable") || words.includes("download")) score+=20
    if(words.includes("gift") || words.includes("custom")) score+=20

    const wordCount = words.split(" ").length

    if(wordCount>=3) score+=20
    if(wordCount>=5) score+=20

    const level =
      score>=80 ? "GOD MODE" :
      score>=60 ? "STRONG" :
      score>=40 ? "RISING" : "LOW"

    return {score,level}
  }

  useEffect(()=>{
    setLiveDomination(calculateLiveDomination(input))
  },[input])

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
        setLiveMarket(data)

      }catch(e){}

    },900)

    return ()=>clearTimeout(timeout)

  },[input])

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
      if(i >= steps.length) clearInterval(interval)
    },600)

    return ()=>clearInterval(interval)

  },[loading])

  useEffect(()=>{

    if(!parsed) return

    function typeField(field:string,value:string,delay:number){

      let i=0

      const interval=setInterval(()=>{

        i++

        setTyped(prev=>({
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

        <InputPanel input={input} setInput={setInput} generate={generate} loading={loading}/>

        <DominationPanel liveDomination={liveDomination}/>

        {liveMarket && <MarketPanel liveMarket={liveMarket}/>}

        {autonomousSignals.length>0 && !loading && (
          <InfoCard title="🤖 Live AI Analysis">
            {autonomousSignals.map((s,i)=><div key={i}>⚡ {s}</div>)}
          </InfoCard>
        )}

        {loading && (
          <InfoCard title="🤖 AI Brain">
            {brainStep}
          </InfoCard>
        )}

        {showResult && parsed && (
          <>
            <ResultBlock title="TITLE" text={typed.title} label="title" copied={copied} copy={copy}/>
            <ResultBlock title="DESCRIPTION" text={typed.description} label="description" copied={copied} copy={copy}/>
            <TagBlock tags={typed.tags} label="tags" copied={copied} copy={copy}/>
            <StrategyPanel parsed={parsed}/>
            <UltraStrategistPanel parsed={parsed}/>
          </>
        )}

      </div>

    </main>
  )
}

function InputPanel({input,setInput,generate,loading}:any){
  return(
    <div style={{background:"#0f0f0f",borderRadius:18,padding:24,marginBottom:20}}>
      <input value={input} onChange={(e)=>setInput(e.target.value)}
        placeholder="Describe your product..."
        style={{width:"100%",padding:20,fontSize:18,borderRadius:12,border:"1px solid #222",background:"#111",color:"white"}}
      />
      <button onClick={generate}
        style={{width:"100%",padding:18,marginTop:16,borderRadius:12,background:"white",color:"black",fontWeight:600}}>
        {loading ? "AI thinking..." : "Generate Listing"}
      </button>
    </div>
  )
}

function DominationPanel({liveDomination}:any){
  return(
    <InfoCard title="👑 LIVE DOMINATION ENGINE">
      <p>Score: {liveDomination.score}/100</p>
      <p>Level: {liveDomination.level}</p>
    </InfoCard>
  )
}

function MarketPanel({liveMarket}:any){
  return(
    <>
      <InfoCard title="📊 LIVE MARKET INTELLIGENCE">
        <p>Avg In Cart: {liveMarket.avgInCart}</p>
        <p>Demand: {liveMarket.demand}</p>
        <p>Competition: {liveMarket.competition}</p>
        <p>Trend: {liveMarket.trend}</p>
      </InfoCard>

      {liveMarket.leaders && (
        <InfoCard title="🔥 MARKET DOMINATION LEADERS">
          {liveMarket.leaders.map((l:any,i:number)=><div key={i}>{l.title}</div>)}
        </InfoCard>
      )}
    </>
  )
}

function InfoCard({title,children}:any){
  return(
    <div style={{background:"#0f0f0f",padding:18,borderRadius:14,marginBottom:20}}>
      <strong>{title}</strong>
      <div style={{marginTop:10}}>{children}</div>
    </div>
  )
}

function ResultBlock({title,text,label,copied,copy}:any){
  return(
    <InfoCard title={title}>
      <p style={{opacity:.85}}>{text}</p>
      <button onClick={()=>copy(text,label)}>
        {copied===label ? "Copied ✓" : "Copy"}
      </button>
    </InfoCard>
  )
}

function TagBlock({tags,label,copied,copy}:any){

  if(!tags) return null

  const tagArray = tags.split(",")

  return(
    <InfoCard title="TAGS">

      <div style={{
        display:"flex",
        flexWrap:"wrap",
        gap:8
      }}>
        {tagArray.map((t:string,i:number)=>(
          <span key={i} style={{
            background:"#1a1a1a",
            padding:"6px 10px",
            borderRadius:999,
            fontSize:14
          }}>
            {t.trim()}
          </span>
        ))}
      </div>

      <button style={{marginTop:12}} onClick={()=>copy(tags,label)}>
        {copied===label ? "Copied ✓" : "Copy"}
      </button>

    </InfoCard>
  )
}

function StrategyPanel({parsed}:any){
  if(!parsed) return null
  return <InfoCard title="🧠 Strategy">{parsed.strategyInsights}</InfoCard>
}

function UltraStrategistPanel({parsed}:any){
  if(!parsed) return null
  return(
    <InfoCard title="🔥 ULTRA STRATEGIST AI">
      <p>{parsed.titleFormula}</p>
      <p>{parsed.dominationScore}</p>
    </InfoCard>
  )
}