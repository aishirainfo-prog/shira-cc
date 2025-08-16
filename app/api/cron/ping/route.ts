import { NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const base = process.env.NEXTAUTH_URL || "";
  try { await fetch(`${base}/api/status`, { cache: "no-store" }); } catch {}
  return NextResponse.json({ ok: true, at: new Date().toISOString() });
}
