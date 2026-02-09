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
  const [listingScore,setListingScore]=useState<any>(null)
  const [animatedScore,setAnimatedScore]=useState(0)
  const [copied,setCopied]=useState("")

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

  // 🔥 AI thinking simulation

  useEffect(()=>{

    if(!loading) return

    const steps = [
      "Scanning Etsy competitors...",
      "Analyzing SEO patterns...",
      "Detecting buyer intent...",
      "Optimizing title structure...",
      "Generating high-conversion listing..."
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

  // 🔥 live typing effect

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

    setTimeout(()=>{
      typeField("description",parsed.description,2)
    },400)

    setTimeout(()=>{
      typeField("tags",parsed.tags,8)
    },800)

  },[parsed])

  function copy(text:string,label:string){
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(()=>setCopied(""),1200)
  }

  const radius=90
  const circumference=2*Math.PI*radius
  const progress=(animatedScore/100)*circumference

  return(

    <main style={{
      minHeight:"100vh",
      display:"flex",
      justifyContent:"center",
      paddingTop:80
    }}>

      <div style={{width:"100%",maxWidth:620}}>

        <h1 style={{
          fontSize:56,
          fontWeight:600,
          letterSpacing:-1,
          textAlign:"center",
          marginBottom:60
        }}>
          ETSYLISTER
        </h1>

        <div style={{
          background:"#0f0f0f",
          borderRadius:18,
          padding:24,
          marginBottom:30
        }}>

          <input
            value={input}
            onChange={(e)=>setInput(e.target.value)}
            placeholder="Describe your product..."
            style={{
              width:"100%",
              padding:20,
              fontSize:18,
              borderRadius:12,
              border:"1px solid #222",
              background:"#111",
              color:"white"
            }}
          />

          <button
            onClick={generate}
            style={{
              width:"100%",
              padding:18,
              marginTop:16,
              borderRadius:12,
              background:"white",
              color:"black",
              fontWeight:600
            }}
          >
            {loading ? "AI thinking..." : "Generate Listing"}
          </button>

        </div>

        {loading && (

          <div style={{
            background:"#0f0f0f",
            padding:18,
            borderRadius:14,
            marginBottom:20,
            opacity:.85
          }}>
            🤖 {brainStep}
          </div>

        )}

        {listingScore && (

          <div style={{
            display:"flex",
            justifyContent:"center",
            marginBottom:40
          }}>

            <svg width="200" height="200">

              <circle cx="100" cy="100" r={radius} stroke="#222" strokeWidth="8" fill="transparent"/>

              <circle
                cx="100"
                cy="100"
                r={radius}
                stroke="white"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={circumference-progress}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
              />

              <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                fontSize="36"
                fill="white"
              >
                {animatedScore}
              </text>

            </svg>

          </div>

        )}

        {showResult && (

          <div>

            <ResultBlock title="TITLE" text={typed.title} label="title" copied={copied} copy={copy}/>
            <ResultBlock title="DESCRIPTION" text={typed.description} label="description" copied={copied} copy={copy}/>
            <TagBlock tags={typed.tags} label="tags" copied={copied} copy={copy}/>

          </div>

        )}

      </div>

    </main>
  )
}

function ResultBlock({title,text,label,copied,copy}:any){

  return(

    <div style={{
      background:"#0f0f0f",
      padding:24,
      borderRadius:16,
      marginBottom:20
    }}>

      <strong>{title}</strong>

      <p style={{marginTop:10,opacity:.85}}>{text}</p>

      <button
        onClick={()=>copy(text,label)}
        style={{
          marginTop:12,
          background:"#222",
          color:"white",
          padding:"8px 14px",
          borderRadius:8
        }}
      >
        {copied===label ? "Copied ✓" : "Copy"}
      </button>

    </div>
  )
}

function TagBlock({tags,label,copied,copy}:any){

  const tagArray = tags.split(",")

  return(

    <div style={{
      background:"#0f0f0f",
      padding:24,
      borderRadius:16,
      marginBottom:20
    }}>

      <strong>TAGS</strong>

      <div style={{
        display:"flex",
        flexWrap:"wrap",
        gap:8,
        marginTop:12
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

      <button
        onClick={()=>copy(tags,label)}
        style={{
          marginTop:12,
          background:"#222",
          color:"white",
          padding:"8px 14px",
          borderRadius:8
        }}
      >
        {copied===label ? "Copied ✓" : "Copy"}
      </button>

    </div>
  )
}