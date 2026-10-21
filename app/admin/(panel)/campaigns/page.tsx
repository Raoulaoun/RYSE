import type { Metadata } from "next";
import Link from "next/link";
import { CampaignLink } from "@/components/admin/CampaignLink";
import { fmtDay } from "@/lib/admin/format";
import { applicationSummaries } from "@/lib/admin/queries";
import { DECIDED } from "@/lib/admin/status";
import { appUrl } from "@/lib/mail";

export const metadata: Metadata = { title: "Campaigns" };
const COLS = "1.4fr 0.8fr 0.8fr 0.8fr 1fr";

export default async function Campaigns() {
  const apps = await applicationSummaries();
  const byCode = new Map<string, typeof apps>();
  for (const a of apps) if (a.campaignCode) byCode.set(a.campaignCode, [...(byCode.get(a.campaignCode) ?? []), a]);
  const rows = [...byCode.entries()]
    .map(([code, list]) => ({
      code,
      total: list.length,
      pitched: list.filter((a) => a.pitchAt).length,
      accepted: list.filter((a) => a.status === "accepted").length,
      decided: list.filter((a) => DECIDED.includes(a.status as never)).length,
      latest: list.reduce((m, a) => (a.createdAt > m ? a.createdAt : m), list[0].createdAt),
    }))
    .sort((x, y) => y.latest.getTime() - x.latest.getTime());

  return (
    <main className="adm-main">
      <div className="adm-title">
        <span className="eyebrow">Campus and event links</span>
        <h1 className="h1">Campaigns</h1>
      </div>
      <CampaignLink base={appUrl()} />
      <section className="card clip" aria-label="Campaigns">
        <div className="tbl-scroll">
          <div style={{ minWidth: 640 }}>
            <div className="th lined" style={{ gridTemplateColumns: COLS }}>
              <span>Code</span>
              <span>Applications</span>
              <span>Pitched</span>
              <span>Accepted</span>
              <span>Latest</span>
            </div>
            {rows.length === 0 && <p className="empty">No applications have come through a campaign link yet.</p>}
            {rows.map((r) => (
              <Link key={r.code} href={`/admin/applications?source=${encodeURIComponent(r.code)}`} className="tr" style={{ gridTemplateColumns: COLS }}>
                <span className="strong">{r.code}</span>
                <span className="cell">{r.total}</span>
                <span className="cell">{r.pitched}</span>
                <span className="cell">
                  {r.accepted} of {r.decided} decided
                </span>
                <span className="cell muted">{fmtDay(r.latest)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
