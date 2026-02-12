import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const listingId = req.nextUrl.searchParams.get("id") || "1876145977";
  
  // NY proxy - denna är inte blockerad (än)
  const response = await fetch(
    `https://etsy-scraper-7x3p.onrender.com/?url=https://www.etsy.com/listing/${listingId}`
  );
  
  const data = await response.json();
  return NextResponse.json(data);
}