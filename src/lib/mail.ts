import "server-only";
import nodemailer from "nodemailer";

// Sends mail via SMTP if configured; otherwise a safe no-op (logs in dev).
// Env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM, MAIL_TO
export async function sendMail(subject: string, text: string, to?: string) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM, MAIL_TO } = process.env;
  const recipient = to || MAIL_TO;
  if (!SMTP_HOST || !recipient) {
    if (process.env.NODE_ENV !== "production") console.log(`[mail:noop] ${subject} → ${recipient ?? "?"}\n${text}`);
    return;
  }
  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: Number(SMTP_PORT) === 465,
      auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    });
    await transporter.sendMail({ from: MAIL_FROM || SMTP_USER, to: recipient, subject, text });
  } catch (e) {
    console.error("[mail] send failed:", e);
  }
}
