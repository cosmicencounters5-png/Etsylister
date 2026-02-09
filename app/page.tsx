"use client"

import { useState, useEffect } from "react"

export default function Home(){

  const [input,setInput]=useState("")
  const [loading,setLoading]=useState(false)
  const [parsed,setParsed]=useState<any>(null)

  const [trend,setTrend]=useState<any>(null)
  const [dna,setDNA]=useState<any>(null)
  const [killer,setKiller]=useState<any>(null)
  const [profit,setProfit]=useState<any>(null)
  const [listingScore,setListingScore]=useState<any>(null)

  const [animatedScore,setAnimatedScore]=useState(0)

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

    const intent =
      intentScore>=2 ? "EXCELLENT" :
      intentScore>=1 ? "GOOD" : "WEAK"

    return {strength,intent}
  }

  const liveSEO = analyzeLiveSEO(input)

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

    },600)

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

    },15)

    return ()=>clearInterval(interval)

  },[listingScore])

  async function generate(){

    if(!input) return

    setLoading(true)

    const res=await fetch("/api/generate",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body: JSON.stringify({ product:input })
    })

    const data=await res.json()

    setParsed(data)
    setLoading(false)
  }

  function copy(text:string){
    navigator.clipboard.writeText(text)
  }

  return(

    <main style={{
      minHeight:"100vh",
      display:"flex",
      justifyContent:"center",
      padding:"60px 20px",
      background:"#050505",
      color:"white"
    }}>

      <div style={{maxWidth:900,width:"100%"}}>

        {/* HEADER */}

        <h1 style={{
          fontSize:64,
          fontWeight:600,
          letterSpacing:-1,
          marginBottom:40
        }}>
          ETSYLISTER
        </h1>

        {/* HERO SCORE */}

        {listingScore && (

          <div style={{
            fontSize:48,
            marginBottom:40
          }}>
            {animatedScore}/100
            <div style={{fontSize:16,opacity:.6}}>
              {listingScore.status}
            </div>
          </div>

        )}

        {/* INPUT */}

        <input
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          placeholder="Describe product..."
          style={{
            width:"100%",
            padding:20,
            fontSize:18,
            background:"#111",
            border:"1px solid #222",
            borderRadius:12,
            marginBottom:16
          }}
        />

        <button
          onClick={generate}
          style={{
            width:"100%",
            padding:20,
            fontSize:16,
            background:"white",
            color:"black",
            borderRadius:12
          }}
        >
          {loading ? "Analyzing..." : "Generate"}
        </button>

        {/* RESULTS */}

        {parsed && (

          <div style={{marginTop:40}}>

            <h3>TITLE</h3>
            <p>{parsed.title}</p>
            <button onClick={()=>copy(parsed.title)}>Copy</button>

            <h3>DESCRIPTION</h3>
            <p>{parsed.description}</p>
            <button onClick={()=>copy(parsed.description)}>Copy</button>

            <h3>TAGS</h3>
            <p>{parsed.tags}</p>
            <button onClick={()=>copy(parsed.tags)}>Copy</button>

          </div>

        )}

      </div>

    </main>
  )
}