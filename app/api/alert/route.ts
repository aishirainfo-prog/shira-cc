import { NextResponse } from "next/server"; import { sendAlert } from "@/lib/mailer";
export async function POST(req: Request) { const { subject, text } = await req.json(); await sendAlert(subject || "SHIRA Alert", text || "No text"); return NextResponse.json({ ok:true }); }
