"use client"

import { useState } from "react"

export default function OptimizePage() {

  const [url,setUrl] = useState("")
  const [loading,setLoading] = useState(false)
  const [brainStep,setBrainStep] = useState("")
  const [result,setResult] = useState<any>(null)

  async function optimize(){

    if(!url) return

    setLoading(true)
    setResult(null)

    try{

      const res = await fetch("/api/optimize",{
        method:"POST",
        headers:{ "Content-Type":"application/json"},
        body: JSON.stringify({ url })
      })

      const data = await res.json()

      if(data.error){
        alert(data.error)
        setLoading(false)
        return
      }

      setResult(data)

    }catch(e){
      console.log(e)
    }

    setLoading(false)
  }

  return(
    <main>
      {/* resten av JSX */}
    </main>
  )
}