"use client"

import { useState, useEffect } from "react"
import { supabase } from "../../lib/supabaseClient"
import AuthGuard from "../../components/AuthGuard"

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

  const [liveMarket,setLiveMarket]=useState<any>(null)
  const [liveDomination,setLiveDomination]=useState({score:0,level:"LOW"})
  const [aiThoughts,setAiThoughts]=useState<string[]>([])

  // 🔥 LOGOUT
  async function logout(){
    await supabase.auth.signOut()
    window.location.href="/login"
  }

  // LIVE DOMINATION ENGINE
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

      }catch(e){}

    },900)

    return ()=>clearTimeout(timeout)

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
    setTyped({
      title:data.title || "",
      description:data.description || "",
      tags:data.tags || ""
    })

    setLoading(false)
    setShowResult(true)
  }

  return(

    <AuthGuard>

      <main style={{minHeight:"100vh",display:"flex",justifyContent:"center",paddingTop:80}}>

        <div style={{width:"100%",maxWidth:620}}>

          {/* HEADER */}

          <div style={{
            display:"flex",
            justifyContent:"space-between",
            alignItems:"center",
            marginBottom:40
          }}>

            <h1 style={{fontSize:36,fontWeight:600}}>
              ETSY LISTER
            </h1>

            <button
              onClick={logout}
              style={{
                background:"#111",
                border:"1px solid #222",
                padding:"8px 14px",
                borderRadius:10,
                cursor:"pointer"
              }}
            >
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

          {/* AI FEELS ALIVE */}

          {aiThoughts.length>0 && (
            <div style={{marginTop:20}}>
              {aiThoughts.map((t,i)=>(
                <div key={i}>⚡ {t}</div>
              ))}
            </div>
          )}

          {/* LIVE MARKET */}

          {liveMarket && (
            <div style={{marginTop:20}}>
              <strong>📊 Market:</strong>
              <div>Demand: {liveMarket.demand}</div>
              <div>Competition: {liveMarket.competition}</div>
            </div>
          )}

        </div>

      </main>

    </AuthGuard>
  )
}