"use client"

import { useState, useEffect } from "react"

export default function Home(){

  const [input,setInput]=useState("")
  const [loading,setLoading]=useState(false)
  const [parsed,setParsed]=useState<any>(null)

  const [listingScore,setListingScore]=useState<any>(null)
  const [animatedScore,setAnimatedScore]=useState(0)

  useEffect(()=>{

    if(input.length < 4) return

    const timeout = setTimeout(async()=>{

      const scoreRes = await fetch("/api/listingGod",{
        method:"POST",
        headers:{ "Content-Type":"application/json"},
        body: JSON.stringify({ product:input })
      })

      setListingScore(await scoreRes.json())

    },400)

    return ()=>clearTimeout(timeout)

  },[input])

  // smooth animation

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

    },16)

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

  const radius=90
  const circumference=2*Math.PI*radius
  const progress=(animatedScore/100)*circumference

  return(

    <main style={{
      minHeight:"100vh",
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      background:"#050505",
      color:"white",
      padding:20
    }}>

      <div style={{
        width:"100%",
        maxWidth:600,
        textAlign:"center"
      }}>

        {/* HEADER */}

        <h1 style={{
          fontSize:48,
          fontWeight:600,
          marginBottom:40,
          letterSpacing:-1
        }}>
          ETSYLISTER
        </h1>

        {/* SCORE DIAL */}

        {listingScore && (

          <div style={{marginBottom:40}}>

            <svg width="220" height="220">

              <circle
                cx="110"
                cy="110"
                r={radius}
                stroke="#222"
                strokeWidth="10"
                fill="transparent"
              />

              <circle
                cx="110"
                cy="110"
                r={radius}
                stroke="white"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={circumference-progress}
                strokeLinecap="round"
                transform="rotate(-90 110 110)"
              />

              <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                fontSize="42"
                fill="white"
              >
                {animatedScore}
              </text>

            </svg>

            <div style={{opacity:.6}}>
              {listingScore.status}
            </div>

          </div>

        )}

        {/* INPUT */}

        <input
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          placeholder="Describe your product..."
          style={{
            width:"100%",
            padding:18,
            fontSize:16,
            borderRadius:12,
            border:"1px solid #222",
            background:"#111",
            marginBottom:16
          }}
        />

        <button
          onClick={generate}
          style={{
            width:"100%",
            padding:18,
            borderRadius:12,
            background:"white",
            color:"black",
            fontWeight:600
          }}
        >
          {loading ? "Analyzing..." : "Generate Listing"}
        </button>

        {/* RESULTS */}

        {parsed && (

          <div style={{marginTop:40,textAlign:"left"}}>

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