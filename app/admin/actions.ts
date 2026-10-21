"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { endSession, requireAdmin } from "@/lib/admin/auth";
import { fromLocalInput } from "@/lib/admin/format";
import {
  APP_STATUS_VALUES,
  appStatus,
  DECIDED,
  DECISIONS,
  INQUIRY_STATUSES,
  VOTES,
  type AppStatus,
  type Decision,
} from "@/lib/admin/status";
import { getDb, schema } from "@/lib/db";
import { decisionSubject } from "@/lib/admin/emails";
import { appUrl, sendMail } from "@/lib/mail";
import { EMAIL_RE } from "@/lib/options";

const { applications: A, applicationEvents: E, applicationVotes: V, partnerInquiries: P, admins } = schema;

type Result = { ok: true; message?: string } | { ok: false; error: string };

function refresh() {
  revalidatePath("/admin", "layout");
}

async function logEvent(applicationId: number, adminId: number | null, what: string) {
  await getDb().insert(E).values({ applicationId, adminId, what });
}

async function loadApp(id: number) {
  const [app] = await getDb().select().from(A).where(eq(A.id, id));
  return app ?? null;
}

async function applyStatus(id: number, status: AppStatus, adminId: number) {
  const app = await loadApp(id);
  if (!app || app.status === status) return app;
  const patch: Partial<typeof A.$inferInsert> = { status, statusChangedAt: new Date() };
  // Marking a startup as pitched starts the 48-hour decision clock if no pitch time was set.
  if (status === "pitched" && !app.pitchAt) patch.pitchAt = new Date();
  await getDb().update(A).set(patch).where(eq(A.id, id));
  await logEvent(id, adminId, appStatus(status).label);
  return app;
}

export async function setStatus(id: number, status: string): Promise<Result> {
  const me = await requireAdmin();
  if (!APP_STATUS_VALUES.includes(status as AppStatus)) return { ok: false, error: "Unknown status" };
  if (DECIDED.includes(status as AppStatus)) {
    return { ok: false, error: "Use the Decision panel to accept, waitlist or decline, so the founder gets an answer." };
  }
  if (!(await applyStatus(id, status as AppStatus, me.id))) return { ok: false, error: "Application not found" };
  refresh();
  return { ok: true };
}

export async function setLead(id: number, adminId: number | null): Promise<Result> {
  const me = await requireAdmin();
  const db = getDb();
  let name = "Unassigned";
  if (adminId !== null) {
    const [a] = await db.select().from(admins).where(eq(admins.id, adminId));
    if (!a) return { ok: false, error: "Unknown partner" };
    name = a.name;
  }
  await db.update(A).set({ leadAdminId: adminId }).where(eq(A.id, id));
  await logEvent(id, me.id, adminId === null ? "Lead partner removed" : `Lead partner: ${name}`);
  refresh();
  return { ok: true };
}

export async function setPitchAt(id: number, local: string): Promise<Result> {
  const me = await requireAdmin();
  const when = local ? fromLocalInput(local) : null;
  if (local && !when) return { ok: false, error: "Pick a valid date and time" };
  const app = await loadApp(id);
  if (!app) return { ok: false, error: "Application not found" };
  await getDb().update(A).set({ pitchAt: when }).where(eq(A.id, id));
  if (when && ["new", "under_review", "shortlisted"].includes(app.status)) {
    await applyStatus(id, "pitch_scheduled", me.id);
  } else {
    await logEvent(id, me.id, when ? "Pitch time updated" : "Pitch time cleared");
  }
  refresh();
  return { ok: true };
}

export async function castVote(id: number, vote: string): Promise<Result> {
  const me = await requireAdmin();
  if (!VOTES.some((v) => v.value === vote)) return { ok: false, error: "Unknown vote" };
  await getDb()
    .insert(V)
    .values({ applicationId: id, adminId: me.id, vote })
    .onConflictDoUpdate({ target: [V.applicationId, V.adminId], set: { vote, updatedAt: new Date() } });
  refresh();
  return { ok: true };
}

export async function saveNote(id: number, note: string): Promise<Result> {
  const me = await requireAdmin();
  const text = note.trim().slice(0, 4000) || null;
  await getDb()
    .insert(V)
    .values({ applicationId: id, adminId: me.id, note: text })
    .onConflictDoUpdate({ target: [V.applicationId, V.adminId], set: { note: text, updatedAt: new Date() } });
  refresh();
  return { ok: true, message: "Saved" };
}

export async function sendDecision(
  id: number,
  decision: string,
  feedback: string,
  internalNote: string,
): Promise<Result> {
  const me = await requireAdmin();
  const d = DECISIONS.find((x) => x.value === decision);
  if (!d) return { ok: false, error: "Pick a decision" };
  const body = feedback.trim();
  if (!body) return { ok: false, error: "Write the feedback the founder will receive" };
  const app = await loadApp(id);
  if (!app) return { ok: false, error: "Application not found" };

  const now = new Date();
  await getDb()
    .update(A)
    .set({
      status: d.value as Decision,
      statusChangedAt: now,
      decision: d.value,
      decisionFeedback: body,
      decisionNote: internalNote.trim() || null,
      decidedAt: now,
    })
    .where(eq(A.id, id));
  await logEvent(id, me.id, appStatus(d.value).label);

  let emailed = false;
  try {
    emailed = (await sendMail({ to: app.email, subject: decisionSubject(app.startupName), text: body })).sent;
  } catch (err) {
    console.error("Failed to email decision", err);
    refresh();
    return { ok: false, error: "The decision is saved, but the email failed to send. Try again or email the founder directly." };
  }
  if (emailed) {
    await getDb().update(A).set({ decisionEmailedAt: now }).where(eq(A.id, id));
    await logEvent(id, me.id, `Decision emailed to ${app.email}`);
  }
  refresh();
  return {
    ok: true,
    message: emailed ? "Decision sent" : "Decision saved. Email isn't set up yet, so nothing was sent.",
  };
}

export async function updateInquiry(
  id: number,
  patch: { status?: string; ownerAdminId?: number | null; internalNote?: string },
): Promise<Result> {
  await requireAdmin();
  const set: Partial<typeof P.$inferInsert> = {};
  if (patch.status !== undefined) {
    if (!INQUIRY_STATUSES.some((s) => s.value === patch.status)) return { ok: false, error: "Unknown status" };
    set.status = patch.status;
  }
  if (patch.ownerAdminId !== undefined) set.ownerAdminId = patch.ownerAdminId;
  if (patch.internalNote !== undefined) set.internalNote = patch.internalNote.trim().slice(0, 4000) || null;
  await getDb().update(P).set(set).where(eq(P.id, id));
  refresh();
  return { ok: true, message: "Saved" };
}

export async function inviteAdmin(_prev: Result | null, form: FormData): Promise<Result> {
  const me = await requireAdmin();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const name = String(form.get("name") ?? "").trim();
  if (!name) return { ok: false, error: "Add their name" };
  if (!EMAIL_RE.test(email)) return { ok: false, error: "Add a valid email" };
  const db = getDb();
  const [existing] = await db.select().from(admins).where(eq(admins.email, email));
  if (existing) return { ok: false, error: `${existing.name} already has access` };
  await db.insert(admins).values({ email, name });
  try {
    await sendMail({
      to: email,
      subject: "You've been added to the Ryse admin panel",
      text: `Hi ${name.split(" ")[0]},\n\n${me.name} gave you access to the Ryse admin panel, where the partners review applications.\n\nSign in with this email address here:\n${appUrl("/admin/login")}\n\nThe Ryse partners`,
      replyTo: me.email,
    });
  } catch (err) {
    console.error("Failed to email invite", err);
  }
  refresh();
  return { ok: true, message: `${name} can now sign in` };
}

export async function removeAdmin(id: number): Promise<Result> {
  const me = await requireAdmin();
  if (id === me.id) return { ok: false, error: "You can't remove yourself" };
  await getDb().delete(admins).where(and(eq(admins.id, id)));
  refresh();
  return { ok: true };
}

export async function signOut() {
  await endSession();
  redirect("/admin/login");
}
