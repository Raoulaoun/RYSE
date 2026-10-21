// Transactional email through Resend's HTTP API. Without RESEND_API_KEY
// (local development) messages are printed to the server log instead.

type Mail = { to: string; subject: string; text: string; html?: string; replyTo?: string };

export const MAIL_FROM = process.env.MAIL_FROM ?? "Ryse <hello@ryseventure.com>";

export function mailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendMail(m: Mail): Promise<{ sent: boolean }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info(`[mail:not-sent] to=${m.to} subject=${JSON.stringify(m.subject)}\n${m.text}`);
    return { sent: false };
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: MAIL_FROM,
      to: [m.to],
      subject: m.subject,
      text: m.text,
      html: m.html ?? textToHtml(m.text),
      reply_to: m.replyTo,
    }),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
  return { sent: true };
}

function esc(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
}

// Plain paragraphs in the site's fonts; links stay clickable.
export function textToHtml(text: string) {
  const body = text
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 16px">${esc(p).replace(/\n/g, "<br>").replace(/(https?:\/\/\S+)/g, '<a href="$1" style="color:#0E0F0E">$1</a>')}</p>`)
    .join("");
  return `<div style="font-family:'Space Grotesk',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#0E0F0E;max-width:560px">${body}</div>`;
}

export function appUrl(path = "") {
  const base = process.env.APP_URL ?? (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : "http://localhost:3000");
  return base.replace(/\/$/, "") + path;
}
