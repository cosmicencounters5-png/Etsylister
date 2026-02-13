"use client"

import { useState, useEffect } from "react"
import { supabase } from "../../lib/supabaseClient"
import AuthGuard from "../../components/AuthGuard"
import Link from "next/link"

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
  const [copied,setCopied]=useState("")

  async function logout(){
    await supabase.auth.signOut()
    window.location.href="/"
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
      if(i>=steps.length) i=steps.length-1
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

      delete data.seoPage

      setParsed(data)

    }catch(e){}

    setLoading(false)
  }

  const card={
    background:"#0f0f0f",
    padding:20,
    borderRadius:16,
    border:"1px solid #1f1f1f"
  }

  return(

    <AuthGuard>

      <main style={{minHeight:"100vh",display:"flex",justifyContent:"center",paddingTop:80}}>

        <div style={{width:"100%",maxWidth:700}}>

          {/* HEADER */}

          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>

            <h1 style={{fontSize:36,fontWeight:600}}>ETSY LISTER</h1>

            <div style={{display:"flex",gap:10,alignItems:"center"}}>

              <Link href="/idea-scanner">
                <button style={{
                  padding:"10px 16px",
                  borderRadius:10,
                  background:"#111",
                  border:"1px solid #222",
                  color:"white"
                }}>
                  Idea Scanner 💡
                </button>
              </Link>

              <Link href="/optimize">
                <button style={{
                  padding:"10px 16px",
                  borderRadius:10,
                  background:"linear-gradient(90deg,#00ffa3,#00c3ff)",
                  border:"none",
                  fontWeight:600,
                  color:"black"
                }}>
                  Optimize 🚀
                </button>
              </Link>

              <button onClick={logout}>Logout</button>

            </div>

          </div>

          {/* INPUT */}

          <div style={{...card,marginTop:20}}>

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
              {loading ? brainStep : "Generate Listing"}
            </button>

          </div>

          {/* DOMINATION */}

          <div style={{...card,marginTop:20}}>
            👑 Score: {liveDomination.score}/100 — {liveDomination.level}
          </div>

        </div>

      </main>

    </AuthGuard>
  )
}