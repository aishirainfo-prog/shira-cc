// app/api/generate/route.ts
import { NextResponse } from "next/server";
export const runtime = "nodejs";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

export async function POST(req: Request) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return NextResponse.json({ error: "OPENAI_API_KEY mancante" }, { status: 500 });

  try {
    const { prompt } = await req.json().catch(() => ({ prompt: "" }));
    const p = (prompt ?? "").toString().slice(0, 4000);

    const r = await fetch(OPENAI_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.6,
        messages: [
          { role: "system", content: "Sei Shira, assistant tecnico conciso." },
          { role: "user", content: p }
        ]
      })
    });

    const data = await r.json();
    if (!r.ok) return NextResponse.json(data, { status: r.status });

    const text = data?.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ model: MODEL, output: text });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Errore generazione" }, { status: 400 });
  }
}
