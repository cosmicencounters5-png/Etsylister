export function analyzeSEO(titles: string[]) {

  const wordCount: Record<string, number> = {};
  const phraseCount: Record<string, number> = {};
  const structurePatterns: Record<string, number> = {};

  titles.forEach(title => {

    const cleaned = title.toLowerCase().replace(/[^\w\s|]/g,"")

    const words = cleaned
      .split(" ")
      .filter(w => w.length > 2);

    // 🔥 single word frequency
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    // 🔥 phrase extraction (2-4 word phrases)
    for (let i=0;i<words.length;i++) {

      const two = words.slice(i,i+2).join(" ");
      const three = words.slice(i,i+3).join(" ");
      const four = words.slice(i,i+4).join(" ");

      [two, three, four].forEach(p => {
        if (p.split(" ").length >=2) {
          phraseCount[p] = (phraseCount[p] || 0) + 1;
        }
      });
    }

    // 🔥 TITLE DNA STRUCTURE DETECTION
    if(cleaned.includes("|")){

      const structure = cleaned
        .split("|")
        .map(s=>s.trim())
        .map(()=>"[segment]")
        .join(" | ")

      structurePatterns[structure] = (structurePatterns[structure] || 0) + 1
    }

  });

  const topKeywords = Object.entries(wordCount)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,15)
    .map(x=>x[0]);

  const topPhrases = Object.entries(phraseCount)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,10)
    .map(x=>x[0]);

  const pipeUsage = titles.filter(t=>t.includes("|")).length;

  // 🔥 KEYWORD POWER SCORE
  const keywordScores = Object.entries(wordCount)
    .map(([word,count])=>({

      keyword:word,

      score:
        count > titles.length*0.6 ? "SATURATED" :
        count > titles.length*0.3 ? "STRONG" :
        "OPPORTUNITY"

    }))

  const opportunityKeywords = keywordScores
    .filter(k=>k.score==="OPPORTUNITY")
    .slice(0,8)
    .map(k=>k.keyword)

  const titleStructures = Object.entries(structurePatterns)
    .sort((a,b)=>b[1]-a[1])
    .map(x=>x[0])

  return {
    topKeywords,
    topPhrases,
    pipeUsage,
    keywordScores,
    opportunityKeywords,
    titleStructures
  };
}