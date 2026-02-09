"use client"

import { useState, useEffect } from "react"
import { supabase } from "../../lib/supabaseClient"
import AuthGuard from "../../components/AuthGuard"

export default function Home(){

  const [input,setInput]=useState("")
  const [loading,setLoading]=useState(false)

  const [parsed,setParsed]=useState<any>(null)

  const [typed,setTyped]=useState({
    title:"",
    description:"",
    tags:""
  })

  const [liveMarket,setLiveMarket]=useState<any>(null)
  const [liveDomination,setLiveDomination]=useState({score:0,level:"LOW"})
  const [aiThoughts,setAiThoughts]=useState<string[]>([])
  const [copied,setCopied]=useState("")
  const [brainStep,setBrainStep]=useState("")

  // LOGOUT
  async function logout(){
    await supabase.auth.signOut()
    window.location.href="/login"
  }

  function copy(text:string,label:string){
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(()=>setCopied(""),1200)
  }

  // LIVE DOMINATION ENGINE
  function calculateLiveDomination(text:string){

    const words=text.toLowerCase()
    let score=0

    if(words.includes("pattern") || words.includes("template")) score+=20
    if(words.includes("printable") || words.includes("download")) score+=20
    if(words.includes("gift") || words.includes("custom")) score+=20

    const wc = words.split(" ").length

    if(wc>=3) score+=20
    if(wc>=5) score+=20

    const level =
      score>=80 ? "GOD MODE" :
      score>=60 ? "STRONG" :
      score>=40 ? "RISING" : "LOW"

    return {score,level}
  }

  useEffect(()=>{
    setLiveDomination(calculateLiveDomination(input))
  },[input])

  // AI THOUGHT STREAM
  useEffect(()=>{

    if(input.length < 3){
      setAiThoughts([])
      return
    }

    const thoughts:string[]=[]

    if(input.includes("pattern") || input.includes("template")){
      thoughts.push("AI detected digital product category")
    }

    if(input.split(" ").length >=3){
      thoughts.push("AI analyzing long-tail keyword opportunity")
    }

    if(input.includes("gift")){
      thoughts.push("AI boosting buyer-intent weighting")
    }

    thoughts.push("Scanning hidden ranking signals")

    setAiThoughts(thoughts)

  },[input])

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
        setLiveMarket(data)

      }catch(e){
        console.log(e)
      }

    },900)

    return ()=>clearTimeout(timeout)

  },[input])

  // AI brain thinking animation
  useEffect(()=>{

    if(!loading) return

    const steps=[
      "Scanning Etsy competitors...",
      "Analyzing SEO patterns...",
      "Detecting buyer intent...",
      "Calculating profitability...",
      "Generating domination listing..."
    ]

    let i=0

    const interval=setInterval(()=>{
      setBrainStep(steps[i])
      i++
      if(i>=steps.length) clearInterval(interval)
    },600)

    return ()=>clearInterval(interval)

  },[loading])

  // typing animation
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

        if(i>=value.length) clearInterval(interval)

      },delay)

    }

    typeField("title",parsed.title || "",10)
    setTimeout(()=>typeField("description",parsed.description || "",2),400)
    setTimeout(()=>typeField("tags",parsed.tags || "",8),800)

  },[parsed])

  // GENERATE
  async function generate(){

    if(!input) return

    setLoading(true)

    try{

      const res=await fetch("/api/generate",{
        method:"POST",
        headers:{ "Content-Type":"application/json"},
        body: JSON.stringify({ product:input })
      })

      const data=await res.json()

      setParsed(data)

    }catch(e){
      console.log(e)
    }

    setLoading(false)
  }

  return(

    <AuthGuard>

      <main style={{minHeight:"100vh",display:"flex",justifyContent:"center",paddingTop:80}}>

        <div style={{width:"100%",maxWidth:620}}>

          {/* HEADER */}

          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:40}}>

            <h1 style={{fontSize:36,fontWeight:600}}>
              ETSY LISTER
            </h1>

            <button onClick={logout} style={{
              background:"#111",
              border:"1px solid #222",
              padding:"8px 14px",
              borderRadius:10
            }}>
              Logout
            </button>

          </div>

          {/* INPUT */}

          <div style={{background:"#0f0f0f",borderRadius:18,padding:24}}>

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

            <button onClick={generate} style={{
              width:"100%",
              padding:18,
              marginTop:16,
              borderRadius:12,
              background:"white",
              color:"black",
              fontWeight:600
            }}>
              {loading ? "AI thinking..." : "Generate Listing"}
            </button>

          </div>

          {/* LIVE DOMINATION */}

          <div style={{marginTop:20,background:"#0f0f0f",padding:18,borderRadius:14}}>
            👑 Score: {liveDomination.score}/100 — {liveDomination.level}
          </div>

          {/* AI THINKING */}

          {loading && (
            <div style={{marginTop:20}}>
              🤖 {brainStep}
            </div>
          )}

          {/* AI THOUGHTS */}

          {aiThoughts.map((t,i)=><div key={i}>⚡ {t}</div>)}

          {/* RESULTS */}

          {parsed && (

            <div style={{marginTop:30}}>

              <div style={{background:"#0f0f0f",padding:18,borderRadius:14}}>
                🔥 Profitability: {parsed.dominationScore}
              </div>

              <h3>TITLE</h3>
              <p>{typed.title}</p>
              <button onClick={()=>copy(typed.title,"title")}>
                {copied==="title"?"Copied ✓":"Copy"}
              </button>

              <h3>DESCRIPTION</h3>
              <p>{typed.description}</p>
              <button onClick={()=>copy(typed.description,"desc")}>
                {copied==="desc"?"Copied ✓":"Copy"}
              </button>

              <h3>TAGS</h3>

              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>

                {typed.tags.split(",").map((t:string,i:number)=>(
                  <span key={i} style={{
                    background:"#1a1a1a",
                    padding:"6px 10px",
                    borderRadius:999
                  }}>
                    {t.trim()}
                  </span>
                ))}

              </div>

              <button style={{marginTop:12}} onClick={()=>copy(typed.tags,"tags")}>
                {copied==="tags"?"Copied ✓":"Copy Tags"}
              </button>

            </div>

          )}

        </div>

      </main>

    </AuthGuard>
  )
}