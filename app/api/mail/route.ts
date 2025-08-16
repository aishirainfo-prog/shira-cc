import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { env } from "@/lib/env";
export const runtime = "nodejs";

const tx = nodemailer.createTransport({
  host: env.EMAIL_SERVER_HOST,
  port: env.EMAIL_SERVER_PORT,
  secure: env.EMAIL_SERVER_PORT === 465,
  auth: { user: env.EMAIL_SERVER_USER, pass: env.EMAIL_SERVER_PASSWORD },
});

export async function POST(req: Request) {
  const { subject = "Shira Alert", text = "Ping da Shira Command Center" } = await req.json().catch(() => ({}));
  await tx.sendMail({ from: env.EMAIL_FROM, to: env.ALERT_EMAIL_TO || env.EMAIL_FROM, subject, text });
  return NextResponse.json({ sent: true });
}
