async function generate(){

  if(!input) return

  setLoading(true)
  setShowResult(false)

  try{

    const res = await fetch("/api/generate",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body: JSON.stringify({ product:input })
    })

    if(!res.ok){
      throw new Error("API failed")
    }

    const data = await res.json()

    console.log("AI RESPONSE:", data)

    setParsed(data)

    setTyped({
      title:data?.title || "",
      description:data?.description || "",
      tags:data?.tags || ""
    })

    setShowResult(true)

  }catch(e){

    console.log("GENERATE ERROR:", e)

    alert("AI failed — check console")

  }finally{

    setLoading(false)

  }

}