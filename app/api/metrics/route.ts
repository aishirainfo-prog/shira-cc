import { NextResponse } from "next/server";
export const runtime = "nodejs";

export async function GET() {
  const mem = process.memoryUsage();
  const res = {
    node: process.version,
    platform: process.platform,
    uptimeSec: Math.round(process.uptime()),
    memoryMB: {
      rss: Math.round(mem.rss/1024/1024),
      heapTotal: Math.round(mem.heapTotal/1024/1024),
      heapUsed: Math.round(mem.heapUsed/1024/1024),
    },
    time: new Date().toISOString(),
  };
  return NextResponse.json(res);
}
