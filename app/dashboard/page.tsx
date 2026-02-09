"use client"

import { useState, useEffect } from "react"
import { supabase } from "../../lib/supabaseClient"

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
  const [aiThoughts,setAiThoughts]=useState<string[]>([])

  // 🔥 LOGOUT (CORRECT PLACEMENT)
  async function logout(){
    await supabase.auth.signOut()
    window.location.href="/login"
  }

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

  // LIVE MARKET
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

  // AUTONOMOUS SIGNALS
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