import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  
  return NextResponse.json({
    hasApiKey: !!apiKey,
    keyPrefix: apiKey ? apiKey.substring(0, 10) + "..." : null,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    message: apiKey ? "API Key exists!" : "No API Key found - add to Vercel env variables"
  });
}