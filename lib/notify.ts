import "server-only";
import { sendMail } from "./mail";
import { deckLink } from "./deck-link";
import {
  FOUNDER_TYPES,
  HEARD_FROM,
  HELP_TYPES,
  NEEDS,
  PARTNER_TYPES,
  SECTORS,
  STAGES,
  TICKET_RANGES,
} from "./options";
import type { ApplicationInput, PartnerInput } from "./validation";

// Emails each new submission to the Ryse inbox (NOTIFY_EMAIL), so the team sees
// it without the admin panel. Replying goes straight to the sender.

const label = (list: readonly { value: string; label: string }[], v: string | null | undefined) =>
  list.find((o) => o.value === v)?.label ?? v ?? "";

function lines(rows: [string, string | null | undefined][]) {
  return rows
    .filter(([, v]) => v !== null && v !== undefined && v !== "")
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}

function inbox() {
  return process.env.NOTIFY_EMAIL?.trim() || null;
}

export async function notifyApplication(
  d: ApplicationInput,
  ref: string,
  deck: { id: number; filename: string; sizeBytes: number } | null,
) {
  const to = inbox();
  if (!to) return;
  const mb = (b: number) => `${(b / 1048576).toFixed(1)} MB`;
  const link = deck ? deckLink(deck.id) : null;
  const text = [
    `New founder application ${ref}: ${d.startup_name}`,
    lines([
      ["Founder", `${d.full_name} (${label(FOUNDER_TYPES, d.founder_type)})`],
      ["Email", d.email],
      ["Phone / WhatsApp", `${d.phone_cc} ${d.phone}`],
      ["Location", d.location],
      ["LinkedIn", d.linkedin_url],
      ["University", d.university ? `${d.university}, class of ${d.grad_year}` : null],
    ]),
    lines([
      ["Team", d.team_type === "team" ? "A team" : "Solo founder"],
      ["Co-founders", d.cofounders.map((c) => `${c.name} (${c.role}${c.email ? `, ${c.email}` : ""})`).join("; ")],
      ["Anyone full-time", d.full_time ? "Yes" : "Not yet"],
    ]),
    lines([
      ["Startup", d.startup_name],
      ["One-liner", d.one_liner],
      ["Sector", label(SECTORS, d.sector)],
      ["Stage", label(STAGES, d.stage)],
      ["Website", d.website_url],
      ["Raised before", d.raised_before ? `Yes: ${d.raised_details}` : "No"],
    ]),
    `The problem, and who has it:\n${d.problem}`,
    `Solution:\n${d.solution}`,
    d.traction ? `Traction:\n${d.traction}` : "",
    lines([
      ["Needs most", d.needs.map((n) => label(NEEDS, n)).join(", ")],
      ["Heard about Ryse", label(HEARD_FROM, d.heard_from)],
      ["Campaign", d.campaign_code],
    ]),
    deck
      ? `Pitch deck: ${deck.filename} (${mb(deck.sizeBytes)})\n${link ? `Download (link valid 180 days): ${link}` : "Saved with the application in the database."}`
      : "Pitch deck: none uploaded",
    "Reply to this email to answer the founder directly.",
  ]
    .filter(Boolean)
    .join("\n\n");
  await sendMail({ to, subject: `New application ${ref}: ${d.startup_name}`, text, replyTo: d.email });
}

export async function notifyPartner(d: PartnerInput) {
  const to = inbox();
  if (!to) return;
  const text = [
    `New partner inquiry from ${d.organization}`,
    lines([
      ["Reaching out as", label(PARTNER_TYPES, d.partner_type)],
      ["Name", d.full_name],
      ["Organization", d.organization],
      ["Role", d.role],
      ["Email", d.email],
      ["Phone / WhatsApp", `${d.phone_cc} ${d.phone}`],
      ["Club or office", d.uni_unit],
      ["Typical ticket", d.ticket_range ? label(TICKET_RANGES, d.ticket_range) : null],
      ["How they want to help", d.help_type.map((h) => label(HELP_TYPES, h)).join(", ")],
    ]),
    `Message:\n${d.message}`,
    "Reply to this email to answer them directly.",
  ].join("\n\n");
  await sendMail({
    to,
    subject: `New partner inquiry: ${d.organization} (${label(PARTNER_TYPES, d.partner_type)})`,
    text,
    replyTo: d.email,
  });
}
