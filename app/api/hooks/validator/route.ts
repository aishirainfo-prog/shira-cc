import { NextResponse } from "next/server"; import { ValidationSchema } from "@/lib/schemas"; import { verify } from "@/lib/hmac"; import { pushValidation } from "@/lib/store";
export async function POST(req: Request) {
  const secret = process.env.SHIRA_WEBHOOK_SECRET || ""; const sig = (req.headers.get("x-shira-signature") || "").trim();
  const raw = await req.text(); if (!verify(raw, sig, secret)) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  const parsed = ValidationSchema.safeParse(JSON.parse(raw)); if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  pushValidation(parsed.data); return NextResponse.json({ ok: true });
}
