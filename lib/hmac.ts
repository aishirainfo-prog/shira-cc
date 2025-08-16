import crypto from "crypto";
export function sign(body: string, secret: string) { return crypto.createHmac("sha256", secret).update(body).digest("hex"); }
export function verify(body: string, signature: string | null, secret: string) {
  if (!signature) return false;
  const expected = sign(body, secret);
  try { return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected)); } catch { return false; }
}
