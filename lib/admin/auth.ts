import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt, isNull } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb, schema } from "@/lib/db";

const COOKIE = "ryse_admin";
const SESSION_DAYS = 30;
const LINK_MINUTES = 15;

export type Admin = typeof schema.admins.$inferSelect;

const hash = (token: string) => createHash("sha256").update(token).digest("hex");
const newToken = () => randomBytes(32).toString("base64url");

/** Creates a one-time sign-in token for an invited admin. Returns null for unknown emails. */
export async function createLoginToken(email: string) {
  const db = getDb();
  const [admin] = await db.select().from(schema.admins).where(eq(schema.admins.email, email.trim().toLowerCase()));
  if (!admin) return null;
  const token = newToken();
  await db.insert(schema.loginTokens).values({
    tokenHash: hash(token),
    adminId: admin.id,
    expiresAt: new Date(Date.now() + LINK_MINUTES * 60000),
  });
  return { admin, token, minutes: LINK_MINUTES };
}

/** Exchanges a sign-in token for a session cookie. */
export async function redeemLoginToken(token: string) {
  const db = getDb();
  const now = new Date();
  const [row] = await db
    .update(schema.loginTokens)
    .set({ usedAt: now })
    .where(
      and(
        eq(schema.loginTokens.tokenHash, hash(token)),
        isNull(schema.loginTokens.usedAt),
        gt(schema.loginTokens.expiresAt, now),
      ),
    )
    .returning({ adminId: schema.loginTokens.adminId });
  if (!row) return false;

  const session = newToken();
  const expiresAt = new Date(now.getTime() + SESSION_DAYS * 86400000);
  await db.insert(schema.sessions).values({ tokenHash: hash(session), adminId: row.adminId, expiresAt });
  (await cookies()).set(COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
  return true;
}

export async function currentAdmin(): Promise<Admin | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const db = getDb();
  const [row] = await db
    .select({ admin: schema.admins })
    .from(schema.sessions)
    .innerJoin(schema.admins, eq(schema.admins.id, schema.sessions.adminId))
    .where(and(eq(schema.sessions.tokenHash, hash(token)), gt(schema.sessions.expiresAt, new Date())));
  return row?.admin ?? null;
}

/** For pages and server actions: the signed-in admin, or a redirect to the login page. */
export async function requireAdmin(): Promise<Admin> {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export async function endSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) await getDb().delete(schema.sessions).where(eq(schema.sessions.tokenHash, hash(token)));
  jar.delete(COOKIE);
}
