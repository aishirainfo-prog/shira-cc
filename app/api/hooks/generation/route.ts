export const runtime = "nodejs";

export async function POST() {
  return Response.json({ ok: true, note: "Hook di generazione (stub)." });
}
