"use client"

export default function AiLogo(){

  return(

    <div style={{
      display:"flex",
      alignItems:"center",
      gap:12
    }}>

      {/* AI ORB */}

      <div style={{
        width:14,
        height:14,
        borderRadius:"50%",
        background:"white",
        boxShadow:"0 0 12px rgba(255,255,255,0.8)",
        animation:"aiPulse 2.5s infinite ease-in-out"
      }}/>

      {/* LOGO TEXT */}

      <div style={{
        fontWeight:700,
        letterSpacing:1
      }}>
        ETSY <span style={{opacity:.6}}>LISTER</span>
      </div>

      <style>{`

        @keyframes aiPulse {

          0% {
            transform:scale(1);
            opacity:0.7;
          }

          50% {
            transform:scale(1.4);
            opacity:1;
          }

          100% {
            transform:scale(1);
            opacity:0.7;
          }

        }

      `}</style>

    </div>

  )
}