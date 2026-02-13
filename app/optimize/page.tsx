"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import AuthGuard from "@/components/AuthGuard"

export default function OptimizePage(){

  const router = useRouter()

  const [title,setTitle]=useState("")
  const [description,setDescription]=useState("")
  const [loading,setLoading]=useState(false)
  const [step,setStep]=useState("")
  const [result,setResult]=useState<any>(null)
  const [copied,setCopied]=useState("")

  function copy(text:string,label:string){

    navigator.clipboard.writeText(text)
    setCopied(label)

    setTimeout(()=>setCopied(""),1200)
  }

  async function optimize(){

    if(!title || !description) return

    setLoading(true)
    setResult(null)

    const brainSteps=[
      "Scanning Etsy algorithm...",
      "Reading buyer psychology...",
      "Analyzing competitors...",
      "Injecting ranking signals...",
      "Finalizing AI upgrade..."
    ]

    let i=0

    const interval=setInterval(()=>{
      setStep(brainSteps[i])
      i++
      if(i>=brainSteps.length) clearInterval(interval)
    },600)

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
    borderRadius:18,
    marginTop:24,
    border:"1px solid #1a1a1a",
    boxShadow:"0 0 30px rgba(0,255,200,0.05)"

  }

  return(

    <AuthGuard>

      <main style={{
        minHeight:"100vh",
        background:"#050505",
        display:"flex",
        justifyContent:"center",
        paddingTop:80,
        color:"white"
      }}>

        <div style={{maxWidth:820,width:"100%",padding:"0 20px"}}>

          {/* BACK BUTTON */}

          <button
            onClick={()=>router.push("/dashboard")}
            style={{
              marginBottom:20,
              background:"#111",
              border:"1px solid #222",
              color:"white",
              padding:"10px 14px",
              borderRadius:10,
              cursor:"pointer"
            }}
          >
            ← Back to Dashboard
          </button>

          {/* HEADER */}

          <h1 style={{
            fontSize:44,
            fontWeight:800,
            letterSpacing:-1
          }}>
            Etsy Lister AI 🚀
          </h1>

          <p style={{opacity:.6}}>
            Activate AI listing domination.
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

          {/* GOD BUTTON */}

          <button
            onClick={optimize}
            style={{
              marginTop:20,
              padding:"18px 24px",
              borderRadius:16,
              background: loading
                ? "linear-gradient(90deg,#00ffd5,#00aaff)"
                : "white",
              color:"black",
              fontWeight:800,
              width:"100%",
              boxShadow: loading
                ? "0 0 25px rgba(0,255,200,0.6)"
                : "none",
              transition:"0.2s"
            }}
          >

            {loading ? `🤖 ${step}` : "Optimize Listing 🔥"}

          </button>

          {copied &&(

            <p style={{
              color:"#00ffae",
              marginTop:10
            }}>
              Copied {copied} ✅
            </p>

          )}

          {/* RESULTS */}

          {result &&(

            <div style={{marginTop:40}}>

              <div style={card}>

                <strong>SEO Score Upgrade</strong>

                <div style={{
                  marginTop:10,
                  fontSize:22,
                  display:"flex",
                  gap:20
                }}>

                  <span style={{opacity:.5}}>
                    {result.beforeScore}
                  </span>

                  <span style={{
                    color:"#00ffae",
                    fontWeight:800,
                    textShadow:"0 0 10px #00ffae"
                  }}>
                    → {result.afterScore}
                  </span>

                </div>

              </div>

              <div style={card}>

                <strong>Optimized Title</strong>

                <button onClick={()=>copy(result.optimized.title,"Title")}>
                  Copy
                </button>

                <p style={{marginTop:10}}>
                  {result.optimized.title}
                </p>

              </div>

              <div style={card}>

                <strong>Optimized Description</strong>

                <button onClick={()=>copy(result.optimized.description,"Description")}>
                  Copy
                </button>

                <p style={{marginTop:10,whiteSpace:"pre-line"}}>
                  {result.optimized.description}
                </p>

              </div>

              <div style={card}>

                <strong>SEO Tags</strong>

                <button
                  onClick={()=>copy(result.optimized.tags.join(", "),"Tags")}
                >
                  Copy Tags
                </button>

                <p style={{marginTop:10}}>
                  {result.optimized.tags.join(", ")}
                </p>

              </div>

            </div>

          )}

        </div>

      </main>

    </AuthGuard>

  )
}