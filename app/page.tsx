"use client"

export default function Landing(){

  return(

    <main style={{
      minHeight:"100vh",
      display:"flex",
      justifyContent:"center",
      padding:"60px 20px",
      background:"#050505"
    }}>

      <div style={{
        width:"100%",
        maxWidth:900
      }}>

        {/* HEADER */}

        <div style={{
          display:"flex",
          justifyContent:"space-between",
          alignItems:"center",
          marginBottom:80
        }}>

          <h1 style={{
            fontSize:28,
            fontWeight:700
          }}>
            ETSY LISTER
          </h1>

          <div style={{display:"flex",gap:12}}>

            <a href="/login">
              <button style={btnGhost}>
                Login
              </button>
            </a>

            <a href="/login">
              <button style={btnPrimary}>
                Start Free
              </button>
            </a>

          </div>

        </div>

        {/* HERO */}

        <section style={{marginBottom:80}}>

          <h2 style={{
            fontSize:56,
            lineHeight:1.1,
            fontWeight:700,
            marginBottom:24
          }}>
            AI That Builds Etsy Listings
            <br/>
            That Actually Rank.
          </h2>

          <p style={{
            opacity:0.7,
            fontSize:18,
            maxWidth:520,
            marginBottom:40
          }}>
            Live market scanning. Competitor intelligence. SEO domination engine.
            Stop guessing — start outranking.
          </p>

          <a href="/login">
            <button style={{
              ...btnPrimary,
              padding:"18px 28px",
              fontSize:18
            }}>
              Generate Your First Listing →
            </button>
          </a>

        </section>

        {/* FEATURES */}

        <section style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",
          gap:20
        }}>

          <Feature
            title="Live Market Intelligence"
            text="Real Etsy competitors scanned automatically."
          />

          <Feature
            title="Domination Scoring"
            text="AI predicts ranking strength before you publish."
          />

          <Feature
            title="Long Tail SEO Engine"
            text="Keyword stacking designed for Etsy algorithm."
          />

          <Feature
            title="AI Strategy Brain"
            text="Actionable optimization insights instantly."
          />

        </section>

      </div>

    </main>
  )
}

const btnPrimary={
  background:"white",
  color:"black",
  border:"none",
  padding:"10px 18px",
  borderRadius:12,
  fontWeight:600,
  cursor:"pointer"
}

const btnGhost={
  background:"transparent",
  border:"1px solid #222",
  color:"white",
  padding:"10px 18px",
  borderRadius:12,
  cursor:"pointer"
}

function Feature({title,text}:any){

  return(

    <div style={{
      background:"#0f0f0f",
      padding:24,
      borderRadius:16,
      border:"1px solid #1f1f1f"
    }}>

      <strong>{title}</strong>

      <p style={{
        marginTop:10,
        opacity:0.7
      }}>
        {text}
      </p>

    </div>

  )
}