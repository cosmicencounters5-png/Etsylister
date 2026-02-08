export function analyzeGaps(existing:any, competitors:any[]) {

  if(!existing) return null

  const competitorTitles = competitors.map(c=>c.title.toLowerCase())

  const words = competitorTitles
    .join(" ")
    .replace(/[^\w\s]/g,"")
    .split(" ")

  const freq:any = {}

  words.forEach(w=>{
    if(w.length<4) return
    freq[w]=(freq[w]||0)+1
  })

  const topWords = Object.entries(freq)
    .sort((a:any,b:any)=>b[1]-a[1])
    .slice(0,20)
    .map(x=>x[0])

  const existingWords = (existing.title||"").toLowerCase()

  const missing = topWords.filter(w=>!existingWords.includes(w))

  return {
    missingKeywords: missing.slice(0,10)
  }
}