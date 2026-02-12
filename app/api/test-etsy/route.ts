import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const listingId = req.nextUrl.searchParams.get("id") || "1876145977";
  
  const response = await fetch(
    `https://etsy-api-test.dokku.workers.dev/?listing=${listingId}`
  );
  
  const data = await response.json();
  return NextResponse.json(data);
}