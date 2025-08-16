import { NextResponse } from "next/server";
export const runtime = "nodejs";

export async function GET() {
  const m = process.memoryUsage();
  return NextResponse.json({
    rss: m.rss,
    heapTotal: m.heapTotal,
    heapUsed: m.heapUsed,
    node: process.version,
    ts: Date.now(),
  });
}
