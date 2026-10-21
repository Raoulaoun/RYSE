import type { Metadata } from "next";
import Link from "next/link";
import { InquiryControls } from "@/components/admin/InquiryControls";
import { Pill } from "@/components/admin/Pill";
import { helpLabel, partnerTypeLabel, received, ticketLabel, waLink } from "@/lib/admin/format";
import { listAdmins, listInquiries } from "@/lib/admin/queries";
import { inquiryStatus } from "@/lib/admin/status";

export const metadata: Metadata = { title: "Partner inquiries" };

const TABS = [
  { value: "", label: "All" },
  { value: "university", label: "Universities" },
  { value: "co_investor", label: "Co-investors" },
  { value: "corporate_mentor", label: "Corporates and mentors" },
];

function extra(i: Awaited<ReturnType<typeof listInquiries>>[number]) {
  if (i.partnerType === "university") return { label: "Club or office", value: i.uniUnit ?? "" };
  if (i.partnerType === "co_investor") return { label: "Typical ticket", value: ticketLabel(i.ticketRange) };
  return { label: "How they want to help", value: i.helpTypes.map(helpLabel).join(", ") };
}

export default async function Partners({ searchParams }: { searchParams: Promise<{ type?: string; id?: string }> }) {
  const { type = "", id } = await searchParams;
  const [all, admins] = await Promise.all([listInquiries(), listAdmins()]);
  const now = new Date();
  const list = all.filter((i) => !type || i.partnerType === type);
  const sel = list.find((i) => String(i.id) === id) ?? list[0];
  const ownerName = new Map(admins.map((a) => [a.id, a.name]));
  const href = (p: { type?: string; id?: number }) => {
    const q = new URLSearchParams();
    if (p.type) q.set("type", p.type);
    if (p.id) q.set("id", String(p.id));
    return `/admin/partners${q.size ? `?${q}` : ""}`;
  };

  return (
    <main className="adm-main">
      <div className="adm-title">
        <span className="eyebrow">Universities, co-investors and corporates</span>
        <h1 className="h1">Partner inquiries</h1>
      </div>

      <div className="tabs" role="group" aria-label="Filter by type">
        {TABS.map((t) => (
          <Link key={t.value || "all"} href={href({ type: t.value })} className={"tab" + (type === t.value ? " on" : "")}>
            {t.label}
          </Link>
        ))}
      </div>

      <div className="cols" style={{ gap: 20 }}>
        <section aria-label="Inquiries" className="card clip inq-list">
          {list.length === 0 && <p className="empty">No inquiries yet.</p>}
          {list.map((i) => {
            const s = inquiryStatus(i.status);
            return (
              <Link
                key={i.id}
                href={href({ type, id: i.id })}
                className={"inq-row" + (sel?.id === i.id ? " on" : "")}
                aria-current={sel?.id === i.id ? "true" : undefined}
              >
                <span className="top">
                  <span className="org">{i.organization}</span>
                  <span className="meta-s" style={{ whiteSpace: "nowrap" }}>
                    {received(i.createdAt, now)}
                  </span>
                </span>
                <span className="who">
                  {i.fullName} · {i.role}
                </span>
                <span className="tags">
                  <span className="tag s" style={{ fontWeight: 600, padding: "3px 9px" }}>
                    {partnerTypeLabel(i.partnerType)}
                  </span>
                  <Pill label={s.label} pill={s.pill} small />
                </span>
              </Link>
            );
          })}
        </section>

        {sel && (
          <section aria-labelledby="inq-h" className="card inq-detail" key={sel.id}>
            <div className="foot-row" style={{ alignItems: "flex-start" }}>
              <div className="adm-title">
                <span className="typ">{partnerTypeLabel(sel.partnerType)}</span>
                <h2 id="inq-h" className="h2">
                  {sel.organization}
                </h2>
                <span className="meta" style={{ fontSize: 14 }}>
                  Received {received(sel.createdAt, now)}
                </span>
              </div>
              <Pill label={inquiryStatus(sel.status).label} pill={inquiryStatus(sel.status).pill} small />
            </div>
            <div className="kv">
              <div>
                <span className="k">Contact</span>
                <span className="strong">{sel.fullName}</span>
              </div>
              <div>
                <span className="k">Role</span>
                <span>{sel.role}</span>
              </div>
              <div>
                <span className="k">Email</span>
                <a href={`mailto:${sel.email}`}>{sel.email}</a>
              </div>
              <div>
                <span className="k">Phone / WhatsApp</span>
                <span>
                  {sel.phoneCc} {sel.phone}
                </span>
              </div>
              <div>
                <span className="k">{extra(sel).label}</span>
                <span>{extra(sel).value}</span>
              </div>
              <div>
                <span className="k">Owner</span>
                <span>{sel.ownerAdminId ? ownerName.get(sel.ownerAdminId) : "Unassigned"}</span>
              </div>
            </div>
            <div className="para">
              <span className="k">Message</span>
              <p>{sel.message}</p>
            </div>
            <InquiryControls
              id={sel.id}
              status={sel.status}
              ownerAdminId={sel.ownerAdminId}
              note={sel.internalNote ?? ""}
              admins={admins.map((a) => ({ id: a.id, name: a.name }))}
              whatsapp={waLink(sel.phoneCc, sel.phone)}
              mailto={`mailto:${sel.email}?subject=${encodeURIComponent("Working with Ryse")}`}
            />
          </section>
        )}
      </div>
    </main>
  );
}
