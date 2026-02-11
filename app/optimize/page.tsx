async function optimize(){

  if(!url) return

  setLoading(true)

  try{

    // ⭐ FETCH DIRECT FROM BROWSER
    const res = await fetch(url)

    const html = await res.text()

    // parse title from html
    const titleMatch = html.match(/<title>(.*?)<\/title>/)

    if(!titleMatch){

      alert("Could not parse listing")
      setLoading(false)
      return
    }

    const listing = {
      title: titleMatch[1],
      description:"",
      image:""
    }

    // send parsed data to API
    const apiRes = await fetch("/api/optimize",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body: JSON.stringify({ listing })
    })

    const data = await apiRes.json()

    setResult(data)

  }catch(e){
    console.log(e)
  }

  setLoading(false)
}