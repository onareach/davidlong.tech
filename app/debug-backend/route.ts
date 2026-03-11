import { NextResponse } from "next/server";

/**
 * Debug: returns which backend URL the proxy uses for /api/*.
 * Visit /debug-backend to verify .env.local is loaded.
 */
export async function GET() {
  const apiBase =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://davidlong-tech-backend-ddf83c56b82b.herokuapp.com";
  return NextResponse.json({
    backend: apiBase,
    usingLocal: apiBase.includes("localhost"),
  });
}
