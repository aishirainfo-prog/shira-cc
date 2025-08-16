import { NextResponse } from "next/server";
import OpenAI from "openai";
import { env } from "@/lib/env";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    if (!env.OPENAI_API_KEY) return NextResponse.json({ error: "OPENAI_API_KEY mancante" }, { status: 500 });
    const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
    const out = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt || "Ciao Shira!" }],
    });
    return NextResponse.json({ text: out.choices?.[0]?.message?.content ?? "" });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "chat error" }, { status: 500 });
  }
}
