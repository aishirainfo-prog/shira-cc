export const runtime = 'edge';
export async function GET() { return new Response('ok', { status: 200 }); }
export async function POST() { return Response.json({ ok: true }); }
