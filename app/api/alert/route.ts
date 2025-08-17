export const runtime = "nodejs";

export async function POST() {
  return Response.json({
    ok: true,
    note: "Mailer disabilitato (stub)."
  });
}
