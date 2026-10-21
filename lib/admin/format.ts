import { HEARD_FROM, SECTORS, STAGES, FOUNDER_TYPES, PARTNER_TYPES, TICKET_RANGES, HELP_TYPES } from "@/lib/options";

// Ryse works on Beirut time; every date in the admin is shown in it.
export const TZ = "Asia/Beirut";

const fmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-GB", { timeZone: TZ, ...opts });
const dayTime = fmt({ weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: false });
const dayOnly = fmt({ weekday: "short", day: "numeric", month: "short" });
const shortDate = fmt({ day: "numeric", month: "short" });
const longDay = fmt({ weekday: "long", day: "numeric", month: "long" });
const hourFmt = fmt({ hour: "numeric", hour12: false });
const ymd = fmt({ year: "numeric", month: "2-digit", day: "2-digit" });

/** "Mon 19 Oct, 16:00" */
export function fmtDayTime(d: Date) {
  return dayTime.format(d).replace(/^(\w+) (\d+ \w+),? /, "$1 $2, ");
}
/** "Mon 19 Oct" */
export function fmtDay(d: Date) {
  return dayOnly.format(d).replace(",", "");
}
/** "12 Oct" */
export function fmtShort(d: Date) {
  return shortDate.format(d);
}
/** "Wednesday, 21 October" */
export function fmtLongDay(d: Date) {
  return longDay.format(d).replace(/^(\w+) /, "$1, ");
}
export function beirutHour(d: Date) {
  return Number(hourFmt.format(d)) % 24;
}
function dayKey(d: Date) {
  return ymd.format(d);
}

/** "2 h ago", "Yesterday", "3 days ago", "1 week ago" */
export function ago(d: Date, now = new Date()) {
  const mins = Math.max(0, Math.round((now.getTime() - d.getTime()) / 60000));
  if (mins < 60) return mins <= 1 ? "Just now" : `${mins} min ago`;
  const yest = new Date(now.getTime() - 86400000);
  if (dayKey(d) === dayKey(now)) return `${Math.round(mins / 60)} h ago`;
  if (dayKey(d) === dayKey(yest)) return "Yesterday";
  const days = Math.round(mins / 1440);
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
}

/** "Today, 08:12", "Yesterday, 17:40", else "Mon 19 Oct" */
export function received(d: Date, now = new Date()) {
  const t = fmt({ hour: "2-digit", minute: "2-digit", hour12: false }).format(d);
  if (dayKey(d) === dayKey(now)) return `Today, ${t}`;
  if (dayKey(d) === dayKey(new Date(now.getTime() - 86400000))) return `Yesterday, ${t}`;
  return fmtDay(d);
}

/** Value for <input type="datetime-local"> in Beirut time. */
export function toLocalInput(d: Date | null) {
  if (!d) return "";
  const p = fmt({ year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false })
    .formatToParts(d)
    .reduce<Record<string, string>>((a, x) => ((a[x.type] = x.value), a), {});
  return `${p.year}-${p.month}-${p.day}T${p.hour === "24" ? "00" : p.hour}:${p.minute}`;
}

/** Parses a datetime-local value as Beirut time. */
export function fromLocalInput(v: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(v);
  if (!m) return null;
  const asUtc = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
  // Beirut's offset at that moment (handles summer time).
  const probe = new Date(asUtc);
  const local = toLocalInput(probe);
  const [, y, mo, d, h, mi] = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(local)!;
  const offset = Date.UTC(+y, +mo - 1, +d, +h, +mi) - asUtc;
  return new Date(asUtc - offset);
}

/** Start of the current Mon–Sun week in Beirut. */
export function weekBounds(now = new Date()) {
  const local = fromLocalInput(toLocalInput(now).slice(0, 10) + "T00:00")!;
  const dow = (new Date(local.getTime() + 12 * 3600000).getUTCDay() + 6) % 7; // 0 = Monday
  const start = new Date(local.getTime() - dow * 86400000);
  return { start, end: new Date(start.getTime() + 7 * 86400000) };
}

export function hoursLeft(due: Date, now = new Date()) {
  return Math.floor((due.getTime() - now.getTime()) / 3600000);
}

export function initials(s: string) {
  const words = s.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function fmtBytes(b: number) {
  return b >= 1048576 ? `${(b / 1048576).toFixed(1).replace(/\.0$/, "")} MB` : `${Math.max(1, Math.round(b / 1024))} KB`;
}

export function deckKind(filename: string) {
  return (/\.(\w+)$/.exec(filename)?.[1] ?? "file").toUpperCase();
}

const label = (list: readonly { value: string; label: string }[]) => (v: string | null | undefined) =>
  list.find((o) => o.value === v)?.label ?? v ?? "";
export const sectorLabel = label(SECTORS);
export const founderTypeLabel = label(FOUNDER_TYPES);
export const heardLabel = label(HEARD_FROM);
export const partnerTypeLabel = label(PARTNER_TYPES);
export const ticketLabel = label(TICKET_RANGES);
export const helpLabel = label(HELP_TYPES);

// Admin views use shorter stage names than the public form.
const STAGE_SHORT: Record<string, string> = { idea: "Idea", mvp: "MVP", first_customers: "First customers", revenue: "Revenue" };
export const stageLabel = (v: string) => STAGE_SHORT[v] ?? label(STAGES)(v);

/** Where an application came from: its campaign, a named channel, or the website. */
export function source(a: { campaignCode: string | null; heardFrom: string }, online = "Online") {
  if (a.campaignCode) return a.campaignCode;
  if (a.heardFrom === "referral") return "Referral";
  if (a.heardFrom === "linkedin") return "LinkedIn";
  if (a.heardFrom === "instagram") return "Instagram";
  if (a.heardFrom === "event") return "Event";
  return online;
}

export function waLink(cc: string, phone: string) {
  return `https://wa.me/${(cc + phone).replace(/\D/g, "")}`;
}
