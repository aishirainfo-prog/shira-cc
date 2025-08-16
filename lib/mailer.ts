import nodemailer from "nodemailer";
export async function sendAlert(subject: string, text: string) {
  const host = process.env.EMAIL_SERVER_HOST!; const port = Number(process.env.EMAIL_SERVER_PORT || 587);
  const user = process.env.EMAIL_SERVER_USER!; const pass = process.env.EMAIL_SERVER_PASSWORD!;
  const from = process.env.EMAIL_FROM!; const to = process.env.ALERT_EMAIL_TO || process.env.EMAIL_FROM!;
  const transporter = nodemailer.createTransport({ host, port, auth: { user, pass } });
  await transporter.sendMail({ from, to, subject, text });
}
