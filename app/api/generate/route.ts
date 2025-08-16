// app/api/generate/route.ts
import { NextResponse } from "next/server";
export const runtime = "nodejs";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini"; // o "gpt-3.5-turbo-0125"

export async function POST(req: Request) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "OPENAI_API_KEY mancante" }, { status: 400 });
  }
  try {
    const { prompt } = await req.json();
    const p = (prompt ?? "").toString().slice(0, 4000);

    const r = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json"
      },
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
    if (!r.ok) {
      return NextResponse.json(data, { status: r.status });
    }
    const text = data?.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ model: MODEL, output: text });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Errore generazione" }, { status: 400 });
  }
}
import { NextResponse } from "next/server";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const { prompt } = await req.json().catch(() => ({ prompt: "" }));
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return new NextResponse("Manca OPENAI_API_KEY", { status: 500 });
  }
  if (!prompt || typeof prompt !== "string") {
    return new NextResponse("Prompt mancante", { status: 400 });
  }

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await r.json();
    const content =
      data?.choices?.[0]?.message?.content ?? JSON.stringify(data, null, 2);
    return new NextResponse(content, { status: 200 });
  } catch (err: any) {
    return new NextResponse(`Errore OpenAI: ${err?.message || err}`, {
      status: 500,
    });
  }
}
