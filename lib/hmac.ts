import crypto from "crypto";

export function signHmac(payload: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export function verifyHmac(payload: string, secret: string, signature: string) {
  const expected = signHmac(payload, secret);
  // confronto costante per evitare timing attacks
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
