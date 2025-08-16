import { NextResponse } from "next/server";
export const runtime = "nodejs";

function median(arr: number[]) {
  const a = [...arr].sort((x,y)=>x-y);
  const mid = Math.floor(a.length/2);
  return a.length % 2 ? a[mid] : (a[mid-1]+a[mid])/2;
}

export async function POST(req: Request) {
// app/api/algorithms/route.ts
import { NextResponse } from "next/server";
export const runtime = "nodejs";

function stats(nums: number[]) {
  const n = nums.length;
  const sorted = [...nums].sort((a,b)=>a-b);
  const sum = nums.reduce((a,b)=>a+b, 0);
  const mean = n ? sum / n : 0;
  const median = n ? (n%2? sorted[(n-1)/2] : (sorted[n/2-1]+sorted[n/2])/2) : 0;
  const min = n ? sorted[0] : 0;
  const max = n ? sorted[n-1] : 0;
  const variance = n ? nums.reduce((a,b)=>a+(b-mean)**2,0)/n : 0;
  const stdev = Math.sqrt(variance);
  return { n, min, max, sum, mean, median, stdev };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let arr = body?.numbers;

    // Permettiamo anche stringhe "1,2,3"
    if (typeof arr === "string") {
      arr = arr.split(/[,\s]+/).filter(Boolean).map(Number);
    }
    if (!Array.isArray(arr)) throw new Error("Fornisci 'numbers' come array o stringa");
    const nums = arr.map(Number).filter(n => Number.isFinite(n));
    if (!nums.length) throw new Error("Nessun numero valido");

    return NextResponse.json(stats(nums));
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Errore" }, { status: 400 });
  }
}
  const { numbers } = await req.json().catch(() => ({ numbers: "" }));
  const nums = String(numbers)
    .split(/[ ,;]+/)
    .map((x) => Number(x))
    .filter((n) => Number.isFinite(n));

  if (!nums.length) return NextResponse.json({ error: "Fornisci numeri" }, { status: 400 });

  const sorted = [...nums].sort((a,b)=>a-b);
  const sum = nums.reduce((s,n)=>s+n,0);
  const mean = sum / nums.length;
  const med = median(nums);
  const min = sorted[0], max = sorted[sorted.length-1];

  return NextResponse.json({ input: nums, sorted, sum, mean, median: med, min, max });
}
