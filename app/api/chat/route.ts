export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { input } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return Response.json({ error: "OPENAI_API_KEY mancante" });
    }

    // Chiamata minimale (modello economico). Se non hai credito -> "insufficient_quota".
    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: input || "Ciao dal backend!"
      })
    });

    const data = await r.json();
    return Response.json(data);
  } catch (e: any) {
    return Response.json({ error: "chat_error", details: String(e) });
  }
}
