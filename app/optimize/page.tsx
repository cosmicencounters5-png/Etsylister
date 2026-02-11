async function optimize(){

  if (!url) return

  setLoading(true)
  setResult(null)

  const steps=[
    "Scanning Etsy listing...",
    "Extracting structured data...",
    "Analyzing SEO signals...",
    "Detecting ranking gaps...",
    "Generating optimized version..."
  ]

  let i=0

  const interval=setInterval(()=>{
    setBrainStep(steps[i])
    i++
    if(i>=steps.length) clearInterval(interval)
  },600)

  try{

    // ✅ SEND URL DIREKTE TIL API
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