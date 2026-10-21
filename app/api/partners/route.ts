import { NextResponse } from "next/server";
import { getDb, schema } from "@/lib/db";
import { sendMail } from "@/lib/mail";
import { partnerSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "We couldn't read your message. Please try again." }, { status: 400 });
  }

  // Honeypot: bots fill the hidden field. Pretend it worked and store nothing.
  if (body.website_hp) return NextResponse.json({ ok: true });

  const parsed = partnerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Some answers are missing or invalid.", fields: Object.keys(parsed.error.flatten().fieldErrors) },
      { status: 400 },
    );
  }
  const d = parsed.data;

  try {
    await getDb()
      .insert(schema.partnerInquiries)
      .values({
        partnerType: d.partner_type,
        fullName: d.full_name,
        organization: d.organization,
        role: d.role,
        email: d.email,
        phoneCc: d.phone_cc,
        phone: d.phone,
        uniUnit: d.uni_unit,
        ticketRange: d.ticket_range,
        helpTypes: d.help_type,
        message: d.message,
        consentAt: new Date(),
      });
    await sendMail({
      to: d.email,
      subject: "Thanks for reaching out to Ryse",
      text: `Hi ${d.full_name.split(/\s+/)[0]},\n\nThanks for getting in touch about working with Ryse. The partners reply within three working days.\n\nThe Ryse partners`,
    }).catch((err) => console.error("Failed to send partner confirmation", err));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to save partner inquiry", err);
    return NextResponse.json({ error: "We couldn't send your message. Please try again in a moment." }, { status: 500 });
  }
}
