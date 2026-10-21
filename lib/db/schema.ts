import {
  boolean,
  customType,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

const bytea = customType<{ data: Buffer; driverData: Buffer }>({
  dataType: () => "bytea",
});


// Ryse partners who can sign in to /admin. Access is by invitation only.
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const loginTokens = pgTable("login_tokens", {
  id: serial("id").primaryKey(),
  tokenHash: text("token_hash").notNull().unique(),
  adminId: integer("admin_id")
    .notNull()
    .references(() => admins.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  tokenHash: text("token_hash").notNull().unique(),
  adminId: integer("admin_id")
    .notNull()
    .references(() => admins.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export type Cofounder = { name: string; role: string; email: string | null };

export const applications = pgTable(
  "applications",
  {
    id: serial("id").primaryKey(),
    refNo: text("ref_no").unique(),
    status: text("status").notNull().default("new"),
    statusChangedAt: timestamp("status_changed_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),

    // Review (admin)
    leadAdminId: integer("lead_admin_id").references(() => admins.id, { onDelete: "set null" }),
    pitchAt: timestamp("pitch_at", { withTimezone: true }),
    decision: text("decision"),
    decisionFeedback: text("decision_feedback"),
    decisionNote: text("decision_note"),
    decidedAt: timestamp("decided_at", { withTimezone: true }),
    decisionEmailedAt: timestamp("decision_emailed_at", { withTimezone: true }),

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
  (t) => [
    index("applications_created_at_idx").on(t.createdAt),
    index("applications_email_idx").on(t.email),
    index("applications_status_idx").on(t.status),
  ],
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
    ownerAdminId: integer("owner_admin_id").references(() => admins.id, { onDelete: "set null" }),
    internalNote: text("internal_note"),
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

// One row per partner per application: their vote and private note.
export const applicationVotes = pgTable(
  "application_votes",
  {
    id: serial("id").primaryKey(),
    applicationId: integer("application_id")
      .notNull()
      .references(() => applications.id, { onDelete: "cascade" }),
    adminId: integer("admin_id")
      .notNull()
      .references(() => admins.id, { onDelete: "cascade" }),
    vote: text("vote"),
    note: text("note"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("application_votes_app_admin_idx").on(t.applicationId, t.adminId)],
);

// Activity history shown on the application page.
export const applicationEvents = pgTable(
  "application_events",
  {
    id: serial("id").primaryKey(),
    applicationId: integer("application_id")
      .notNull()
      .references(() => applications.id, { onDelete: "cascade" }),
    adminId: integer("admin_id").references(() => admins.id, { onDelete: "set null" }),
    what: text("what").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("application_events_app_idx").on(t.applicationId)],
);
