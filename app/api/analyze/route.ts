// app/api/analyze/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const POS = ["bene","bravo","ottimo","top","wow","successo","felice","forte"];
const NEG = ["male","pessimo","errore","brutto","odio","fallito","triste","terribile"];

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    const t = (text ?? "").toString();

    const words = t
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter(Boolean);

    const pos = words.filter(w => POS.includes(w)).length;
    const neg = words.filter(w => NEG.includes(w)).length;
    const score = pos - neg;
    const sentiment = score > 0 ? "positivo" : score < 0 ? "negativo" : "neutro";

    const res = {
      len: t.length,
      words: words.length,
      pos,
      neg,
      score,
      sentiment,
      preview: t.slice(0, 200)
    };
    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Errore analisi" }, { status: 400 });
  }
}
import { NextResponse } from "next/server";
export const runtime = "nodejs";

const POS = ["bene","fantastico","ottimo","veloce","bravo","forte","wow"];
const NEG = ["male","pessimo","lento","errore","bug","odio","terribile"];

export async function POST(req: Request) {
  const { text } = await req.json().catch(() => ({ text: "" }));
  const t = (text || "").toString();

  const words = t.trim() ? t.trim().split(/\s+/) : [];
  const sentences = t.split(/[.!?]+/).filter(Boolean);

  const score =
    words.reduce((s, w) => s + (POS.includes(w.toLowerCase()) ? 1 : NEG.includes(w.toLowerCase()) ? -1 : 0), 0);

  const res = {
    chars: t.length,
    words: words.length,
    sentences: sentences.length,
    sentiment: score > 0 ? "positivo" : score < 0 ? "negativo" : "neutro",
    score,
    keywords: Array.from(new Set(words.map(w => w.toLowerCase()).filter(w => w.length > 4))).slice(0, 10),
  };

  return NextResponse.json(res);
}
