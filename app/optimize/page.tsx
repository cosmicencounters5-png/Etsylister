"use client"

import { useState } from "react"

export default function OptimizePage(){

  const [title,setTitle]=useState("")
  const [description,setDescription]=useState("")
  const [loading,setLoading]=useState(false)
  const [step,setStep]=useState("")
  const [result,setResult]=useState<any>(null)

  function copy(text:string){

    navigator.clipboard.writeText(text)

  }

  async function optimize(){

    if(!title || !description) return

    setLoading(true)
    setResult(null)

    const brainSteps=[
      "Scanning Etsy SEO signals...",
      "Detecting buyer intent...",
      "Analyzing ranking structure...",
      "Injecting conversion psychology...",
      "Building ranking-ready listing..."
    ]

    let i=0

    const interval=setInterval(()=>{
      setStep(brainSteps[i])
      i++
      if(i>=brainSteps.length) clearInterval(interval)
    },650)

    try{

      const res=await fetch("/api/optimize",{
        method:"POST",
        headers:{ "Content-Type":"application/json"},
        body:JSON.stringify({ title,description })
      })

      const data=await res.json()

      if(data.error){

        alert(data.error)

      }else{

        setResult(data)

      }

    }catch(e){

      console.log(e)

    }

    setLoading(false)
  }

  const card={

    background:"#0f0f0f",
    padding:24,
    borderRadius:16,
    marginTop:24,
    border:"1px solid #1a1a1a",
    boxShadow:"0 0 20px rgba(255,255,255,0.03)"

  }

  return(

    <main style={{
      maxWidth:820,
      margin:"0 auto",
      padding:"80px 20px",
      color:"white"
    }}>

      <h1 style={{
        fontSize:44,
        fontWeight:800,
        letterSpacing:-1
      }}>
        Etsy Lister AI 🚀
      </h1>

      <p style={{opacity:.6}}>
        Paste your listing and activate AI optimization.
      </p>

      {/* INPUT */}

      <textarea
        placeholder="Original title..."
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
        style={{
          width:"100%",
          marginTop:20,
          padding:16,
          borderRadius:12,
          background:"#111",
          border:"1px solid #222",
          color:"white"
        }}
      />

      <textarea
        placeholder="Description..."
        value={description}
        onChange={(e)=>setDescription(e.target.value)}
        style={{
          width:"100%",
          marginTop:14,
          padding:16,
          borderRadius:12,
          background:"#111",
          border:"1px solid #222",
          color:"white",
          minHeight:140
        }}
      />

      {/* BUTTON */}

      <button
        onClick={optimize}
        style={{
          marginTop:20,
          padding:"18px 24px",
          borderRadius:14,
          background:"white",
          color:"black",
          fontWeight:700,
          width:"100%",
          transition:"0.2s"
        }}
      >

        {loading ? `🤖 ${step}` : "Optimize Listing 🔥"}

      </button>

      {/* RESULTS */}

      {result &&(

        <div style={{marginTop:40}}>

          {/* SCORE */}

          <div style={card}>

            <strong>SEO Score Upgrade</strong>

            <div style={{
              marginTop:10,
              fontSize:20,
              display:"flex",
              gap:20
            }}>

              <span style={{opacity:.6}}>
                Before: {result.beforeScore}
              </span>

              <span style={{
                color:"#00ffae",
                fontWeight:700
              }}>
                After: {result.afterScore} 🚀
              </span>

            </div>

          </div>

          {/* TITLE */}

          <div style={card}>

            <strong>Optimized Title</strong>

            <button
              style={{marginLeft:10}}
              onClick={()=>copy(result.optimized.title)}
            >
              Copy
            </button>

            <p style={{marginTop:10}}>
              {result.optimized.title}
            </p>

          </div>

          {/* DESCRIPTION */}

          <div style={card}>

            <strong>Optimized Description</strong>

            <button
              style={{marginLeft:10}}
              onClick={()=>copy(result.optimized.description)}
            >
              Copy
            </button>

            <p style={{marginTop:10,whiteSpace:"pre-line"}}>
              {result.optimized.description}
            </p>

          </div>

          {/* TAGS */}

          <div style={card}>

            <strong>SEO Tags</strong>

            <button
              style={{marginLeft:10}}
              onClick={()=>copy(result.optimized.tags.join(", "))}
            >
              Copy Tags
            </button>

            <p style={{marginTop:10}}>
              {result.optimized.tags.join(", ")}
            </p>

          </div>

        </div>

      )}

    </main>

  )

}