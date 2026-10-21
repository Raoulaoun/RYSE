// Application and inquiry states, with the pill colors from the admin design.

export type Pill = { bg: string; fg: string };

export const APP_STATUSES = [
  { value: "new", label: "New", pill: { bg: "#E6EEFB", fg: "#1E4FA8" }, dot: "#1E4FA8" },
  { value: "under_review", label: "Under review", pill: { bg: "#FFF3D6", fg: "#7A5200" }, dot: "#B07A00" },
  { value: "shortlisted", label: "Shortlisted", pill: { bg: "#EDE9FF", fg: "#4B3AA8" }, dot: "#4B3AA8" },
  { value: "pitch_scheduled", label: "Pitch scheduled", pill: { bg: "#E3F4F1", fg: "#0F6152" }, dot: "#0F6152" },
  { value: "pitched", label: "Pitched", pill: { bg: "#EEEEEA", fg: "#3A3C38" }, dot: "#3A3C38" },
  { value: "accepted", label: "Accepted", pill: { bg: "#C8F25A", fg: "#0E0F0E" }, dot: "#7FA51E" },
  { value: "declined", label: "Declined", pill: { bg: "#FBE7E2", fg: "#9B2C14" }, dot: "#9B2C14" },
  { value: "waitlisted", label: "Waitlisted", pill: { bg: "#EFEFEF", fg: "#4A4A4A" }, dot: "#4A4A4A" },
] as const;

export type AppStatus = (typeof APP_STATUSES)[number]["value"];
export const APP_STATUS_VALUES = APP_STATUSES.map((s) => s.value) as [AppStatus, ...AppStatus[]];
export const DECIDED: AppStatus[] = ["accepted", "declined", "waitlisted"];

export function appStatus(value: string) {
  return APP_STATUSES.find((s) => s.value === value) ?? APP_STATUSES[0];
}

export const DECISIONS = [
  { value: "accepted", label: "Accept" },
  { value: "waitlisted", label: "Waitlist" },
  { value: "declined", label: "Decline" },
] as const;
export type Decision = (typeof DECISIONS)[number]["value"];

export const VOTES = [
  { value: "yes", label: "Yes", pill: { bg: "#C8F25A", fg: "#0E0F0E" } },
  { value: "maybe", label: "Maybe", pill: { bg: "#FFF3D6", fg: "#7A5200" } },
  { value: "no", label: "No", pill: { bg: "#FBE7E2", fg: "#9B2C14" } },
] as const;
export type Vote = (typeof VOTES)[number]["value"];

export const INQUIRY_STATUSES = [
  { value: "new", label: "New", pill: { bg: "#E6EEFB", fg: "#1E4FA8" } },
  { value: "contacted", label: "Contacted", pill: { bg: "#FFF3D6", fg: "#7A5200" } },
  { value: "in_discussion", label: "In discussion", pill: { bg: "#E3F4F1", fg: "#0F6152" } },
  { value: "closed", label: "Closed", pill: { bg: "#EFEFEF", fg: "#4A4A4A" } },
] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number]["value"];

export function inquiryStatus(value: string) {
  return INQUIRY_STATUSES.find((s) => s.value === value) ?? INQUIRY_STATUSES[0];
}

// The 48-hour promise starts at the pitch.
export const DECISION_WINDOW_MS = 48 * 3600 * 1000;
