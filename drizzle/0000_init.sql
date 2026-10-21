CREATE TABLE "application_decks" (
	"id" serial PRIMARY KEY NOT NULL,
	"application_id" integer NOT NULL,
	"filename" text NOT NULL,
	"content_type" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"data" "bytea" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "application_decks_application_id_unique" UNIQUE("application_id")
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"ref_no" text,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone_cc" text NOT NULL,
	"phone" text NOT NULL,
	"location" text,
	"linkedin_url" text,
	"founder_type" text NOT NULL,
	"university" text,
	"grad_year" integer,
	"team_type" text NOT NULL,
	"cofounders" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"full_time" boolean NOT NULL,
	"startup_name" text NOT NULL,
	"one_liner" text NOT NULL,
	"sector" text NOT NULL,
	"stage" text NOT NULL,
	"problem" text NOT NULL,
	"solution" text NOT NULL,
	"traction" text,
	"website_url" text,
	"raised_before" boolean NOT NULL,
	"raised_details" text,
	"needs" text[] NOT NULL,
	"heard_from" text NOT NULL,
	"campaign_code" text,
	"consent_at" timestamp with time zone NOT NULL,
	CONSTRAINT "applications_ref_no_unique" UNIQUE("ref_no")
);
--> statement-breakpoint
CREATE TABLE "partner_inquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"partner_type" text NOT NULL,
	"full_name" text NOT NULL,
	"organization" text NOT NULL,
	"role" text NOT NULL,
	"email" text NOT NULL,
	"phone_cc" text NOT NULL,
	"phone" text NOT NULL,
	"uni_unit" text,
	"ticket_range" text,
	"help_types" text[] DEFAULT '{}' NOT NULL,
	"message" text NOT NULL,
	"consent_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "application_decks" ADD CONSTRAINT "application_decks_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "applications_created_at_idx" ON "applications" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "applications_email_idx" ON "applications" USING btree ("email");--> statement-breakpoint
CREATE INDEX "partner_inquiries_created_at_idx" ON "partner_inquiries" USING btree ("created_at");