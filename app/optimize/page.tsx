async function optimize(){

  if(!url) return

  setLoading(true)

  try{

    const res = await fetch("/api/optimize",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body: JSON.stringify({ url })
    })

    const data = await res.json()

    if(data.error){
      alert(data.error)
    }else{
      setResult(data)
    }

  }catch(e){
    console.log(e)
  }

  setLoading(false)
}