import type { Metadata } from "next";
import { AdminTeam } from "@/components/admin/AdminTeam";
import { requireAdmin } from "@/lib/admin/auth";
import { fmtDay } from "@/lib/admin/format";
import { listAdmins } from "@/lib/admin/queries";
import { MAIL_FROM, mailConfigured } from "@/lib/mail";

export const metadata: Metadata = { title: "Settings" };

export default async function Settings() {
  const me = await requireAdmin();
  const admins = await listAdmins();
  const mail = mailConfigured();
  return (
    <main className="adm-main">
      <div className="adm-title">
        <span className="eyebrow">Access and email</span>
        <h1 className="h1">Settings</h1>
      </div>
      <AdminTeam members={admins.map((a) => ({ id: a.id, name: a.name, email: a.email, added: fmtDay(a.createdAt), me: a.id === me.id }))} />
      <section className="card pad-s" aria-labelledby="mail-h">
        <h2 id="mail-h" className="h2">
          Email
        </h2>
        <div className={`banner ${mail ? "done" : "hot"}`}>
          <b>{mail ? "Email is on" : "Email is off"}</b>
          <span>
            {mail
              ? `Sign-in links, confirmations and decisions send from ${MAIL_FROM}.`
              : "Set BREVO_API_KEY on Railway to send sign-in links, confirmations and decisions."}
          </span>
        </div>
      </section>
    </main>
  );
}
