import { boolean, customType, index, integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

const bytea = customType<{ data: Buffer; driverData: Buffer }>({
  dataType: () => "bytea",
});

export type Cofounder = { name: string; role: string; email: string | null };

export const applications = pgTable(
  "applications",
  {
    id: serial("id").primaryKey(),
    refNo: text("ref_no").unique(),
    status: text("status").notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),

    // About you
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    phoneCc: text("phone_cc").notNull(),
    phone: text("phone").notNull(),
    location: text("location"),
    linkedinUrl: text("linkedin_url"),
    founderType: text("founder_type").notNull(),
    university: text("university"),
    gradYear: integer("grad_year"),

    // Your team
    teamType: text("team_type").notNull(),
    cofounders: jsonb("cofounders").$type<Cofounder[]>().notNull().default([]),
    fullTime: boolean("full_time").notNull(),

    // Your startup
    startupName: text("startup_name").notNull(),
    oneLiner: text("one_liner").notNull(),
    sector: text("sector").notNull(),
    stage: text("stage").notNull(),
    problem: text("problem").notNull(),
    solution: text("solution").notNull(),
    traction: text("traction"),
    websiteUrl: text("website_url"),
    raisedBefore: boolean("raised_before").notNull(),
    raisedDetails: text("raised_details"),

    // Ryse and you
    needs: text("needs").array().notNull(),
    heardFrom: text("heard_from").notNull(),
    campaignCode: text("campaign_code"),
    consentAt: timestamp("consent_at", { withTimezone: true }).notNull(),
  },
  (t) => [index("applications_created_at_idx").on(t.createdAt), index("applications_email_idx").on(t.email)],
);

export const applicationDecks = pgTable("application_decks", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id")
    .notNull()
    .unique()
    .references(() => applications.id, { onDelete: "cascade" }),
  filename: text("filename").notNull(),
  contentType: text("content_type").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  data: bytea("data").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const partnerInquiries = pgTable(
  "partner_inquiries",
  {
    id: serial("id").primaryKey(),
    status: text("status").notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    partnerType: text("partner_type").notNull(),
    fullName: text("full_name").notNull(),
    organization: text("organization").notNull(),
    role: text("role").notNull(),
    email: text("email").notNull(),
    phoneCc: text("phone_cc").notNull(),
    phone: text("phone").notNull(),
    uniUnit: text("uni_unit"),
    ticketRange: text("ticket_range"),
    helpTypes: text("help_types").array().notNull().default([]),
    message: text("message").notNull(),
    consentAt: timestamp("consent_at", { withTimezone: true }).notNull(),
  },
  (t) => [index("partner_inquiries_created_at_idx").on(t.createdAt)],
);
