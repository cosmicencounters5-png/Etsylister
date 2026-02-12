"use client"

import { useState } from "react"

export default function OptimizePage(){

  const [url,setUrl]=useState("")
  const [result,setResult]=useState<any>(null)
  const [loading,setLoading]=useState(false)

  async function optimize(){

    setLoading(true)

    try{

      // FREE proxy (zero cost)
      const proxy =
        "https://api.allorigins.win/raw?url=" +
        encodeURIComponent(url)

      const res = await fetch(proxy)

      const html = await res.text()

      const parser = new DOMParser()
      const doc = parser.parseFromString(html,"text/html")

      const title =
        doc.querySelector("meta[property='og:title']")?.getAttribute("content")

      const description =
        doc.querySelector("meta[name='description']")?.getAttribute("content")

      setResult({
        title,
        description
      })

    }catch(e){

      alert("Parser failed")

    }

    setLoading(false)
  }

  return(

    <main style={{maxWidth:700,margin:"auto",padding:40}}>

      <h1>Etsy Listing Optimizer</h1>

      <input
        value={url}
        onChange={(e)=>setUrl(e.target.value)}
        placeholder="Paste Etsy listing"
      />

      <button onClick={optimize}>
        {loading ? "Loading..." : "Optimize"}
      </button>

      {result && (

        <div>

          <h3>Original Title</h3>
          <p>{result.title}</p>

          <h3>Description</h3>
          <p>{result.description}</p>

        </div>

      )}

    </main>

  )

}