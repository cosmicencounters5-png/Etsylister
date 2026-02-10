"use client"

import { useState, useEffect } from "react"
import { supabase } from "../../lib/supabaseClient"
import AuthGuard from "../../components/AuthGuard"

export default function Home(){

  const [input,setInput]=useState("")
  const [loading,setLoading]=useState(false)
  const [brainStep,setBrainStep]=useState("")

  const [parsed,setParsed]=useState<any>(null)

  const [typed,setTyped]=useState({
    title:"",
    description:"",
    tags:""
  })

  const [liveDomination,setLiveDomination]=useState({score:0,level:"LOW"})
  const [aiThoughts,setAiThoughts]=useState<string[]>([])
  const [copied,setCopied]=useState("")

  async function logout(){
    await supabase.auth.signOut()
    window.location.href="/login"
  }

  function copy(text:string,label:string){
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(()=>setCopied(""),1200)
  }

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

    typeField("title",parsed.title,10)
    setTimeout(()=>typeField("description",parsed.description,2),400)
    setTimeout(()=>typeField("tags",parsed.tags,8),800)

  },[parsed])

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

    }catch(e){}

    setLoading(false)
  }

  const card={
    background:"rgba(15,15,15,0.8)",
    backdropFilter:"blur(8px)",
    border:"1px solid #1f1f1f",
    padding:20,
    borderRadius:16,
    marginTop:20,
    boxShadow:"0 0 40px rgba(0,0,0,0.25)"
  }

  return(

    <AuthGuard>

      <main style={{minHeight:"100vh",display:"flex",justifyContent:"center",paddingTop:80}}>

        <div style={{width:"100%",maxWidth:640}}>

          {/* HEADER */}

          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:40}}>

            <h1 style={{fontSize:36,fontWeight:600,letterSpacing:-1}}>
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

          <div style={card}>

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
              fontWeight:600,
              boxShadow: loading ? "0 0 20px white" : "none"
            }}>
              {loading ? brainStep : "Generate Listing"}
            </button>

          </div>

          {/* STICKY DOMINATION */}

          <div style={{...card,position:"sticky",top:20,zIndex:2}}>
            👑 Score: {liveDomination.score}/100 — {liveDomination.level}
          </div>

          {aiThoughts.map((t,i)=><div key={i}>⚡ {t}</div>)}

          {parsed && (

            <div>

              <div style={card}>
                🔥 Profitability: {parsed.dominationScore}
              </div>

              <div style={card}>
                <strong>TITLE</strong>
                <p>{typed.title}</p>
                <button onClick={()=>copy(typed.title,"title")}>
                  {copied==="title"?"Copied ✓":"Copy"}
                </button>
              </div>

              <div style={card}>
                <strong>DESCRIPTION</strong>
                <p>{typed.description}</p>
                <button onClick={()=>copy(typed.description,"desc")}>
                  {copied==="desc"?"Copied ✓":"Copy"}
                </button>
              </div>

              <div style={card}>
                <strong>TAGS</strong>

                <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:10}}>
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

              <div style={card}>

                <strong>🧠 Strategy Insights</strong>
                <p>{parsed.strategyInsights}</p>

                <strong>⚡ SEO Advantage</strong>
                <p>{parsed.seoAdvantage}</p>

                <strong>🔥 Competitor Insights</strong>
                <p>{parsed.competitorInsights}</p>

                <strong>👑 Title Formula</strong>
                <p>{parsed.titleFormula}</p>

              </div>

            </div>

          )}

        </div>

      </main>

    </AuthGuard>
  )
}