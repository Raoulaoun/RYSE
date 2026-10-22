// Transactional email through Brevo's HTTP API. Without BREVO_API_KEY
// (local development) messages are printed to the server log instead.

type Mail = { to: string; subject: string; text: string; html?: string; replyTo?: string };

export const MAIL_FROM = process.env.MAIL_FROM ?? "Ryse <hello@ryseventure.com>";

export function mailConfigured() {
  return Boolean(process.env.BREVO_API_KEY);
}

// "Ryse <hello@ryseventure.com>" -> { name: "Ryse", email: "hello@ryseventure.com" }
function parseAddress(a: string) {
  const m = /^\s*(.*?)\s*<([^>]+)>\s*$/.exec(a);
  return m ? { name: m[1].replace(/^"|"$/g, "") || undefined, email: m[2] } : { email: a.trim() };
}

export async function sendMail(m: Mail): Promise<{ sent: boolean }> {
  const key = process.env.BREVO_API_KEY;
  if (!key) {
    console.info(`[mail:not-sent] to=${m.to} subject=${JSON.stringify(m.subject)}\n${m.text}`);
    return { sent: false };
  }
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": key, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: parseAddress(MAIL_FROM),
      to: [{ email: m.to }],
      subject: m.subject,
      textContent: m.text,
      htmlContent: m.html ?? textToHtml(m.text),
      replyTo: m.replyTo ? { email: m.replyTo } : undefined,
    }),
  });
  if (!res.ok) throw new Error(`Brevo responded ${res.status}: ${await res.text()}`);
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
  const base =
    process.env.APP_URL ??
    process.env.RENDER_EXTERNAL_URL ??
    (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : "http://localhost:3000");
  return base.replace(/\/$/, "") + path;
}
