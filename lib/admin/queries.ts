import "server-only";
import { asc, count, desc, eq, sql } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";

const { applications: A, applicationDecks: D, applicationVotes: V, applicationEvents: E, admins, partnerInquiries: P } =
  schema;

export async function listAdmins() {
  return getDb().select().from(admins).orderBy(asc(admins.createdAt), asc(admins.id));
}

export async function navCounts() {
  const db = getDb();
  const [[apps], [inq]] = await Promise.all([
    db.select({ n: count() }).from(A).where(eq(A.status, "new")),
    db.select({ n: count() }).from(P).where(eq(P.status, "new")),
  ]);
  return { newApps: apps.n, newInquiries: inq.n };
}

// Everything the list, board and dashboard need, without the long text fields
// or deck bytes. Volumes are small enough to filter in memory.
export async function applicationSummaries() {
  const db = getDb();
  const votes = db
    .select({ applicationId: V.applicationId, n: sql<number>`count(${V.vote})::int`.as("n") })
    .from(V)
    .groupBy(V.applicationId)
    .as("votes");
  return db
    .select({
      id: A.id,
      refNo: A.refNo,
      status: A.status,
      statusChangedAt: A.statusChangedAt,
      createdAt: A.createdAt,
      fullName: A.fullName,
      email: A.email,
      phoneCc: A.phoneCc,
      phone: A.phone,
      location: A.location,
      founderType: A.founderType,
      university: A.university,
      startupName: A.startupName,
      oneLiner: A.oneLiner,
      sector: A.sector,
      stage: A.stage,
      heardFrom: A.heardFrom,
      campaignCode: A.campaignCode,
      leadAdminId: A.leadAdminId,
      pitchAt: A.pitchAt,
      decidedAt: A.decidedAt,
      deckName: D.filename,
      deckSize: D.sizeBytes,
      votes: sql<number>`coalesce(${votes.n}, 0)`,
    })
    .from(A)
    .leftJoin(D, eq(D.applicationId, A.id))
    .leftJoin(votes, eq(votes.applicationId, A.id))
    .orderBy(desc(A.createdAt), desc(A.id));
}
export type AppSummary = Awaited<ReturnType<typeof applicationSummaries>>[number];

export async function getApplication(id: number) {
  const db = getDb();
  const [app] = await db.select().from(A).where(eq(A.id, id));
  if (!app) return null;
  const [[deck], votes, events] = await Promise.all([
    db
      .select({ id: D.id, filename: D.filename, contentType: D.contentType, sizeBytes: D.sizeBytes })
      .from(D)
      .where(eq(D.applicationId, id)),
    db
      .select({ adminId: V.adminId, vote: V.vote, note: V.note, updatedAt: V.updatedAt })
      .from(V)
      .where(eq(V.applicationId, id)),
    db
      .select({ what: E.what, createdAt: E.createdAt, who: admins.name })
      .from(E)
      .leftJoin(admins, eq(admins.id, E.adminId))
      .where(eq(E.applicationId, id))
      .orderBy(desc(E.createdAt), desc(E.id)),
  ]);
  return { app, deck: deck ?? null, votes, events };
}

export async function listInquiries() {
  return getDb().select().from(P).orderBy(desc(P.createdAt), desc(P.id));
}
