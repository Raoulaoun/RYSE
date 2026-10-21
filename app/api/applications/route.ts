import { NextResponse } from "next/server";
import { getDb, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { DECK_EXT, DECK_MAX_BYTES } from "@/lib/options";
import { sendMail } from "@/lib/mail";
import { applicationSchema } from "@/lib/validation";

export const runtime = "nodejs";

// Deck limit plus room for the text fields.
const MAX_BODY_BYTES = DECK_MAX_BYTES + 1048576;

const DECK_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  key: "application/vnd.apple.keynote",
};

function refNo(id: number, year: number) {
  return `RYS-${year}-${String(id).padStart(4, "0")}`;
}

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "The upload is too large. The deck limit is 15 MB." }, { status: 413 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "We couldn't read your application. Please try again." }, { status: 400 });
  }

  // Honeypot: bots fill the hidden field. Pretend it worked and store nothing.
  if (form.get("website_hp")) return NextResponse.json({ ok: true, refNo: refNo(0, new Date().getFullYear()) });

  let cofounders: unknown = [];
  try {
    cofounders = JSON.parse(String(form.get("cofounders") ?? "[]"));
  } catch {
    // Left as [] and rejected below if the team needs it.
  }

  const str = (k: string) => {
    const v = form.get(k);
    return typeof v === "string" ? v : undefined;
  };

  const parsed = applicationSchema.safeParse({
    full_name: str("full_name"),
    email: str("email"),
    phone_cc: str("phone_cc"),
    phone: str("phone"),
    location: str("location"),
    linkedin_url: str("linkedin_url"),
    founder_type: str("founder_type"),
    university: str("university"),
    grad_year: str("grad_year"),
    team_type: str("team_type"),
    cofounders,
    full_time: str("full_time"),
    startup_name: str("startup_name"),
    one_liner: str("one_liner"),
    sector: str("sector"),
    stage: str("stage"),
    problem: str("problem"),
    solution: str("solution"),
    traction: str("traction"),
    website_url: str("website_url"),
    raised_before: str("raised_before"),
    raised_details: str("raised_details"),
    needs: form.getAll("needs"),
    heard_from: str("heard_from"),
    campaign_code: str("campaign_code"),
    consent: str("consent"),
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Some answers are missing or invalid.", fields: Object.keys(parsed.error.flatten().fieldErrors) },
      { status: 400 },
    );
  }
  const d = parsed.data;

  const deck = form.get("deck");
  let deckRow: { filename: string; contentType: string; sizeBytes: number; data: Buffer } | null = null;
  if (deck instanceof File && deck.size > 0) {
    const ext = DECK_EXT.exec(deck.name)?.[1]?.toLowerCase();
    if (!ext) return NextResponse.json({ error: "Use a PDF, PowerPoint or Keynote file" }, { status: 400 });
    if (deck.size > DECK_MAX_BYTES) return NextResponse.json({ error: "The deck limit is 15 MB." }, { status: 413 });
    deckRow = {
      filename: deck.name.slice(0, 255),
      contentType: DECK_TYPES[ext],
      sizeBytes: deck.size,
      data: Buffer.from(await deck.arrayBuffer()),
    };
  }

  try {
    const db = getDb();
    const ref = await db.transaction(async (tx) => {
      const now = new Date();
      const [row] = await tx
        .insert(schema.applications)
        .values({
          fullName: d.full_name,
          email: d.email,
          phoneCc: d.phone_cc,
          phone: d.phone,
          location: d.location,
          linkedinUrl: d.linkedin_url,
          founderType: d.founder_type,
          university: d.university,
          gradYear: d.grad_year,
          teamType: d.team_type,
          cofounders: d.cofounders,
          fullTime: d.full_time,
          startupName: d.startup_name,
          oneLiner: d.one_liner,
          sector: d.sector,
          stage: d.stage,
          problem: d.problem,
          solution: d.solution,
          traction: d.traction,
          websiteUrl: d.website_url,
          raisedBefore: d.raised_before,
          raisedDetails: d.raised_details,
          needs: d.needs,
          heardFrom: d.heard_from,
          campaignCode: d.campaign_code,
          consentAt: now,
        })
        .returning({ id: schema.applications.id });
      const ref = refNo(row.id, now.getFullYear());
      await tx.update(schema.applications).set({ refNo: ref }).where(eq(schema.applications.id, row.id));
      if (deckRow) await tx.insert(schema.applicationDecks).values({ applicationId: row.id, ...deckRow });
      await tx.insert(schema.applicationEvents).values({ applicationId: row.id, what: "Application submitted" });
      return ref;
    });
    await sendMail({
      to: d.email,
      subject: `We received your application: ${ref}`,
      text: `Hi ${d.full_name.split(/\s+/)[0]},\n\nThank you for applying to Ryse with ${d.startup_name}. Your reference number is ${ref}.\n\nWhat happens next:\n1. The partners review your application personally.\n2. If you're shortlisted, we invite you to pitch in person.\n3. You get a clear answer within 48 hours of your pitch.\n\nQuestions? Reply to this email.\n\nThe Ryse partners`,
    }).catch((err) => console.error("Failed to send application confirmation", err));
    return NextResponse.json({ ok: true, refNo: ref });
  } catch (err) {
    console.error("Failed to save application", err);
    return NextResponse.json(
      { error: "We couldn't save your application. Please try again in a moment." },
      { status: 500 },
    );
  }
}
