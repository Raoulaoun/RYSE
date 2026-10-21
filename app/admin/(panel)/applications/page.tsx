import type { Metadata } from "next";
import Link from "next/link";
import { FilterBar } from "@/components/admin/FilterBar";
import { Pill } from "@/components/admin/Pill";
import { SearchBox } from "@/components/admin/SearchBox";
import { ago, deckKind, fmtBytes, founderTypeLabel, sectorLabel, source, stageLabel } from "@/lib/admin/format";
import { byStatus, filterApps, qs, readFilters } from "@/lib/admin/filter";
import { applicationSummaries, listAdmins } from "@/lib/admin/queries";
import { appStatus } from "@/lib/admin/status";
import { FOUNDER_TYPES, SECTORS, STAGES } from "@/lib/options";

export const metadata: Metadata = { title: "Applications" };

const PAGE = 25;
const TABS = ["", "new", "under_review", "shortlisted", "pitch_scheduled", "pitched", "accepted", "declined", "waitlisted"];
const COLS = "1.7fr 1.2fr 0.9fr 0.9fr 1fr 0.9fr 0.9fr 1.1fr";

export default async function Applications({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const f = readFilters(params);
  const page = Math.max(1, Number(params.page) || 1);
  const [all, admins] = await Promise.all([applicationSummaries(), listAdmins()]);
  const now = new Date();

  const filtered = filterApps(all, f);
  const rows = byStatus(filtered, f.status);
  const pages = Math.max(1, Math.ceil(rows.length / PAGE));
  const current = Math.min(page, pages);
  const shown = rows.slice((current - 1) * PAGE, current * PAGE);
  const campaigns = [...new Set(all.map((a) => a.campaignCode).filter((c): c is string => Boolean(c)))].sort();
  const leadName = new Map(admins.map((a) => [a.id, a.name]));

  const tabs = TABS.map((value) => ({
    value,
    label: value ? appStatus(value).label : "All",
    count: byStatus(filtered, value).length,
  })).filter((t) => t.value !== "waitlisted" || t.count > 0);

  return (
    <main className="adm-main">
      <div className="adm-head">
        <div className="adm-title">
          <span className="eyebrow">
            {all.length} application{all.length === 1 ? "" : "s"}
          </span>
          <h1 className="h1">Applications</h1>
        </div>
        <div className="tools">
          <SearchBox placeholder="Search founder, startup or RYS number" value={f.q} keep={{ ...f, q: "" }} wide />
          <a href={`/admin/applications/export${qs(f)}`} className="b b-light">
            Export CSV
          </a>
        </div>
      </div>

      <div className="tabs" role="group" aria-label="Filter by status">
        {tabs.map((t) => (
          <Link
            key={t.value || "all"}
            href={`/admin/applications${qs({ ...f, status: t.value })}`}
            className={"tab" + (f.status === t.value ? " on" : "")}
            aria-current={f.status === t.value ? "true" : undefined}
          >
            {t.label} <span className="c">{t.count}</span>
          </Link>
        ))}
      </div>

      <FilterBar base="/admin/applications" keep={{ status: f.status, q: f.q }}>
        <label className="flt">
          Stage
          <select name="stage" defaultValue={f.stage}>
            <option value="">All stages</option>
            {STAGES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flt">
          Sector
          <select name="sector" defaultValue={f.sector}>
            <option value="">All sectors</option>
            {SECTORS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flt">
          Founder type
          <select name="ftype" defaultValue={f.ftype}>
            <option value="">Everyone</option>
            {FOUNDER_TYPES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flt">
          Campaign
          <select name="source" defaultValue={f.source}>
            <option value="">All sources</option>
            <option value="online">Online</option>
            {campaigns.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="flt">
          Lead partner
          <select name="lead" defaultValue={f.lead}>
            <option value="">Anyone</option>
            {admins.map((a) => (
              <option key={a.id} value={String(a.id)}>
                {a.name}
              </option>
            ))}
            <option value="none">Unassigned</option>
          </select>
        </label>
      </FilterBar>

      <section aria-label="Applications list" className="card clip">
        <div className="tbl-scroll">
          <div style={{ minWidth: 980 }}>
            <div className="th lined" style={{ gridTemplateColumns: COLS }}>
              <span>Startup</span>
              <span>Founder</span>
              <span>Stage</span>
              <span>Sector</span>
              <span>Source</span>
              <span>Deck</span>
              <span>Submitted</span>
              <span>Status</span>
            </div>
            {shown.length === 0 && <p className="empty">No applications match these filters.</p>}
            {shown.map((a) => {
              const s = appStatus(a.status);
              return (
                <Link href={`/admin/applications/${a.id}`} className="tr" style={{ gridTemplateColumns: COLS }} key={a.id}>
                  <span className="stack">
                    <span className="strong">{a.startupName}</span>
                    <span className="meta-s">{a.refNo}</span>
                  </span>
                  <span className="stack">
                    <span className="cell">{a.fullName}</span>
                    <span className="meta-s">
                      {founderTypeLabel(a.founderType)}
                      {a.leadAdminId ? ` · ${leadName.get(a.leadAdminId) ?? ""}` : ""}
                    </span>
                  </span>
                  <span className="cell">{stageLabel(a.stage)}</span>
                  <span className="cell">{sectorLabel(a.sector)}</span>
                  <span className="cell">{source(a)}</span>
                  <span className="cell ink2">{a.deckName ? `${deckKind(a.deckName)} · ${fmtBytes(a.deckSize ?? 0)}` : "No deck"}</span>
                  <span className="cell muted">{ago(a.createdAt, now)}</span>
                  <span>
                    <Pill label={s.label} pill={s.pill} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="pager">
          <span>
            Showing {shown.length} of {rows.length}
          </span>
          <span className="btns">
            {current > 1 ? <Link href={`/admin/applications${qs({ ...f, page: current - 1 })}`}>Previous</Link> : <span className="off">Previous</span>}
            {current < pages ? <Link href={`/admin/applications${qs({ ...f, page: current + 1 })}`}>Next</Link> : <span className="off">Next</span>}
          </span>
        </div>
      </section>
    </main>
  );
}

