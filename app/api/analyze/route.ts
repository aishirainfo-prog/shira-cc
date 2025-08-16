// app/api/analyze/route.ts
import { NextResponse } from "next/server";
export const runtime = "nodejs";

const POS = ["bene","bravo","ottimo","top","wow","successo","felice","forte"];
const NEG = ["male","pessimo","errore","brutto","odio","fallito","triste","terribile"];

export async function POST(req: Request) {
  try {
    const { text } = await req.json().catch(() => ({ text: "" }));
    const t = (text ?? "").toString();

    const words = t.toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/).filter(Boolean);

    const pos = words.filter(w => POS.includes(w)).length;
    const neg = words.filter(w => NEG.includes(w)).length;
    const score = pos - neg;
    const sentiment = score > 0 ? "positivo" : score < 0 ? "negativo" : "neutro";

    return NextResponse.json({
      len: t.length, words: words.length, pos, neg, score, sentiment, preview: t.slice(0, 200)
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Errore analisi" }, { status: 400 });
  }
}
