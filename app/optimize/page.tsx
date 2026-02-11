try {

  // STEP 1 — PARSE I BROWSER
  const listing = await parseEtsyListing(url)

  if(!listing){
    alert("Could not parse listing")
    setLoading(false)
    return
  }

  // STEP 2 — SEND RESULTAT TIL API
  const res = await fetch("/api/optimize",{
    method:"POST",
    headers:{ "Content-Type":"application/json"},
    body: JSON.stringify({
      listing
    })
  })

  const data = await res.json()

  setResult(data)

} catch(e){
  console.log(e)
}