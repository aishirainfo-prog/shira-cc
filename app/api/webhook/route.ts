import { NextResponse } from "next/server";
import crypto from "crypto";
import { env } from "@/lib/env";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const raw = await req.text();
  const sig = req.headers.get("x-shira-signature") || "";
  const mac = crypto.createHmac("sha256", env.SHIRA_WEBHOOK_SECRET).update(raw).digest("hex");
  if (!env.SHIRA_WEBHOOK_SECRET || sig !== mac) {
    return new NextResponse("invalid signature", { status: 401 });
  }
  const data = raw ? JSON.parse(raw) : {};
  // TODO: gestisci gli eventi come preferisci
  return NextResponse.json({ ok: true, received: data });
}
