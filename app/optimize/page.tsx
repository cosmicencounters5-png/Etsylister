"use client"

import { useState } from "react"

export default function OptimizePage(){

  const [url,setUrl]=useState("")
  const [loading,setLoading]=useState(false)
  const [result,setResult]=useState<any>(null)

  async function parseFromIframe(listingUrl:string){

    return new Promise((resolve)=>{

      const iframe = document.createElement("iframe")

      iframe.style.display="none"
      iframe.src = listingUrl

      iframe.onload = ()=>{

        try{

          const doc = iframe.contentDocument

          const title =
            doc?.querySelector('meta[property="og:title"]')?.getAttribute("content")

          const description =
            doc?.querySelector('meta[name="description"]')?.getAttribute("content")

          const image =
            doc?.querySelector('meta[property="og:image"]')?.getAttribute("content")

          iframe.remove()

          if(!title){
            resolve(null)
            return
          }

          resolve({
            title,
            description,
            image
          })

        }catch(e){

          iframe.remove()
          resolve(null)
        }

      }

      document.body.appendChild(iframe)

    })

  }

  async function optimize(){

    if(!url) return

    setLoading(true)

    const match =
      url.match(/listing\/(\d+)/) ||
      url.match(/(\d{6,})/)

    if(!match){
      alert("Invalid Etsy link")
      setLoading(false)
      return
    }

    const listingUrl = `https://www.etsy.com/listing/${match[1]}`

    const listing = await parseFromIframe(listingUrl)

    if(!listing){
      alert("Could not parse listing")
      setLoading(false)
      return
    }

    const res = await fetch("/api/optimize",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body: JSON.stringify({ listing })
    })

    const data = await res.json()

    setResult(data)

    setLoading(false)
  }

  return(

    <main style={{maxWidth:800,margin:"0 auto",padding:"80px 20px"}}>

      <h1>Etsy Listing Optimizer</h1>

      <input
        value={url}
        onChange={(e)=>setUrl(e.target.value)}
        placeholder="Paste Etsy listing URL..."
      />

      <button onClick={optimize}>
        {loading ? "Loading..." : "Optimize"}
      </button>

      {result && (

        <div>

          <h3>Original Title</h3>
          <p>{result.original?.title}</p>

          <h3>Optimized Title</h3>
          <p>{result.optimized?.title}</p>

        </div>

      )}

    </main>
  )
}