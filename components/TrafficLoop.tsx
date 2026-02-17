"use client"

import Link from "next/link"

export default function TrafficLoop(){

  const box={
    background:"#0f0f0f",
    padding:18,
    borderRadius:14,
    border:"1px solid #222"
  }

  return(

    <div style={{marginTop:30}}>

      <strong>🔥 Continue upgrading your listing</strong>

      <div style={{
        display:"grid",
        gap:12,
        marginTop:14
      }}>

        <Link href="/optimize">
          <div style={box}>
            ⚡ Optimize an existing listing
          </div>
        </Link>

        <Link href="/idea-scanner">
          <div style={box}>
            💡 Scan another product idea
          </div>
        </Link>

        <Link href="/dashboard">
          <div style={box}>
            🚀 Generate new listing
          </div>
        </Link>

      </div>

    </div>
  )
}