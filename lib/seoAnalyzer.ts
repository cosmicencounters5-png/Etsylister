export function analyzeSEO(titles: string[]) {

  const wordCount: Record<string, number> = {};

  titles.forEach(title => {

    const words = title
      .toLowerCase()
      .replace(/[^\w\s|]/g,"")
      .split(" ");

    words.forEach(word => {

      if (word.length < 3) return;

      wordCount[word] = (wordCount[word] || 0) + 1;
    });

  });

  const topKeywords = Object.entries(wordCount)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,15)
    .map(x=>x[0]);

  const pipeUsage = titles.filter(t=>t.includes("|")).length;

  return {
    topKeywords,
    pipeUsage
  };
}