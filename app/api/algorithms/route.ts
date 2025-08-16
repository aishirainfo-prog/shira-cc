// app/api/algorithms/route.ts
import { NextResponse } from "next/server";
export const runtime = "nodejs";

function parseNumbers(input: string): number[] {
  return (input || "")
    .split(/[,\s]+/)
    .map(s => Number(s.trim()))
    .filter(n => Number.isFinite(n));
}

function stats(nums: number[]) {
  if (nums.length === 0) return { count: 0 };
  const sorted = [...nums].sort((a,b)=>a-b);
  const sum = nums.reduce((a,b)=>a+b,0);
  const mean = sum / nums.length;
  const median = sorted.length % 2
    ? sorted[(sorted.length - 1)/2]
    : (sorted[sorted.length/2 - 1] + sorted[sorted.length/2]) / 2;
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const freq: Record<number, number> = {};
  for (const n of nums) freq[n] = (freq[n] || 0) + 1;
  let mode = sorted[0], modeCount = 0;
  for (const [k,v] of Object.entries(freq)) if (v > modeCount) { mode = Number(k); modeCount = v; }
  return { count: nums.length, min, max, sum, mean, median, mode };
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const input = typeof body.numbers === "string" ? body.numbers : String(body.numbers ?? "");
    const numbers = parseNumbers(input);
    return NextResponse.json({ input, numbers, ...stats(numbers) });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Errore algoritmi" }, { status: 400 });
  }
}
