import { z } from "zod";
import {
  CAMPAIGN_RE,
  COUNTRY_CODES,
  EMAIL_RE,
  FOUNDER_TYPES,
  GRAD_YEARS,
  HEARD_FROM,
  HELP_TYPES,
  MAX_COFOUNDERS,
  NEEDS,
  PARTNER_TYPES,
  SECTORS,
  STAGES,
  TICKET_RANGES,
  URL_RE,
  values,
} from "./options";

// Server-side mirror of the client rules. The client shows friendly messages;
// these schemas are the source of truth for what gets stored.

const req = (max: number) => z.string().trim().min(1).max(max);
const opt = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : null));
const email = z.string().trim().max(254).regex(EMAIL_RE);
const phone = z
  .string()
  .trim()
  .max(30)
  .refine((v) => v.replace(/\D/g, "").length >= 6);
const url = opt(500).refine((v) => v === null || URL_RE.test(v));
const yesNo = z.enum(["yes", "no"]).transform((v) => v === "yes");
const consent = z.literal("yes");

export const applicationSchema = z
  .object({
    full_name: req(200),
    email,
    phone_cc: z.enum(values(COUNTRY_CODES)),
    phone,
    location: opt(200),
    linkedin_url: url,
    founder_type: z.enum(values(FOUNDER_TYPES)),
    university: opt(200),
    grad_year: z.preprocess((v) => (v === "" ? undefined : v), z.enum(GRAD_YEARS).optional()),

    team_type: z.enum(["solo", "team"]),
    cofounders: z
      .array(z.object({ name: req(200), role: req(120), email: z.union([email, z.literal("")]).optional() }))
      .max(MAX_COFOUNDERS)
      .default([]),
    full_time: yesNo,

    startup_name: req(200),
    one_liner: req(140),
    sector: z.enum(values(SECTORS)),
    stage: z.enum(values(STAGES)),
    problem: req(600),
    solution: req(600),
    traction: opt(600),
    website_url: url,
    raised_before: yesNo,
    raised_details: opt(300),

    needs: z.array(z.enum(values(NEEDS))).min(1),
    heard_from: z.enum(values(HEARD_FROM)),
    campaign_code: opt(40).refine((v) => v === null || CAMPAIGN_RE.test(v)),
    consent,
  })
  .superRefine((d, ctx) => {
    if (d.founder_type === "student") {
      if (!d.university) ctx.addIssue({ code: "custom", path: ["university"], message: "Required" });
      if (!d.grad_year) ctx.addIssue({ code: "custom", path: ["grad_year"], message: "Required" });
    }
    if (d.raised_before && !d.raised_details) {
      ctx.addIssue({ code: "custom", path: ["raised_details"], message: "Required" });
    }
  })
  .transform((d) => ({
    ...d,
    // Drop answers to questions that were hidden for this applicant.
    university: d.founder_type === "student" ? d.university : null,
    grad_year: d.founder_type === "student" && d.grad_year ? Number(d.grad_year) : null,
    cofounders:
      d.team_type === "team" ? d.cofounders.map((c) => ({ name: c.name, role: c.role, email: c.email || null })) : [],
    raised_details: d.raised_before ? d.raised_details : null,
    campaign_code: d.campaign_code ? d.campaign_code.toUpperCase() : null,
  }));

export const partnerSchema = z
  .object({
    partner_type: z.enum(values(PARTNER_TYPES)),
    full_name: req(200),
    organization: req(200),
    role: req(200),
    email,
    phone_cc: z.enum(values(COUNTRY_CODES)),
    phone,
    uni_unit: opt(200),
    // An unselected <select> posts "".
    ticket_range: z.preprocess((v) => (v === "" ? undefined : v), z.enum(values(TICKET_RANGES)).optional()),
    help_type: z.array(z.enum(values(HELP_TYPES))).default([]),
    message: req(1000),
    consent,
  })
  .superRefine((d, ctx) => {
    if (d.partner_type === "university" && !d.uni_unit)
      ctx.addIssue({ code: "custom", path: ["uni_unit"], message: "Required" });
    if (d.partner_type === "co_investor" && !d.ticket_range)
      ctx.addIssue({ code: "custom", path: ["ticket_range"], message: "Required" });
    if (d.partner_type === "corporate_mentor" && d.help_type.length === 0)
      ctx.addIssue({ code: "custom", path: ["help_type"], message: "Required" });
  })
  .transform((d) => ({
    ...d,
    uni_unit: d.partner_type === "university" ? d.uni_unit : null,
    ticket_range: d.partner_type === "co_investor" ? (d.ticket_range ?? null) : null,
    help_type: d.partner_type === "corporate_mentor" ? d.help_type : [],
  }));

export type ApplicationInput = z.output<typeof applicationSchema>;
export type PartnerInput = z.output<typeof partnerSchema>;
