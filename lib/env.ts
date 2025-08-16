export const env = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  SHIRA_WEBHOOK_SECRET: process.env.SHIRA_WEBHOOK_SECRET || "",
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "",
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "",
  EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST || "",
  EMAIL_SERVER_PORT: Number(process.env.EMAIL_SERVER_PORT || 587),
  EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER || "",
  EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD || "",
  EMAIL_FROM: process.env.EMAIL_FROM || "",
  ALERT_EMAIL_TO: process.env.ALERT_EMAIL_TO || "",
};
