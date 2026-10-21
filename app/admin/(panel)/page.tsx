import type { Metadata } from "next";
import Link from "next/link";
import { Pill } from "@/components/admin/Pill";
import { requireAdmin } from "@/lib/admin/auth";
import {
  ago,
  beirutHour,
  founderTypeLabel,
  fmtDayTime,
  fmtLongDay,
  hoursLeft,
  initials,
  sectorLabel,
  source,
  stageLabel,
  weekBounds,
} from "@/lib/admin/format";
import { applicationSummaries, listAdmins } from "@/lib/admin/queries";
import { appStatus, DECIDED, DECISION_WINDOW_MS } from "@/lib/admin/status";
import { SearchBox } from "@/components/admin/SearchBox";

export const metadata: Metadata = { title: "Dashboard" };

const STAGES = [
  { name: "New", match: ["new"] },
  { name: "Under review", match: ["under_review"] },
  { name: "Shortlisted", match: ["shortlisted"] },
  { name: "Pitch scheduled", match: ["pitch_scheduled"] },
  { name: "Pitched", match: ["pitched"] },
  { name: "Decided", match: DECIDED as string[] },
];

export default async function Dashboard() {
  const me = await requireAdmin();
  const [apps, admins] = await Promise.all([applicationSummaries(), listAdmins()]);
  const now = new Date();
  const day = 86400000;

  const thisWeek = apps.filter((a) => now.getTime() - a.createdAt.getTime() < 7 * day).length;
  const lastWeek = apps.filter((a) => {
    const age = now.getTime() - a.createdAt.getTime();
    return age >= 7 * day && age < 14 * day;
  }).length;
  const delta = thisWeek - lastWeek;

  const waiting = apps.filter((a) => a.status === "new" || a.status === "under_review");
  const oldest = waiting.reduce<Date | null>((m, a) => (!m || a.createdAt < m ? a.createdAt : m), null);
  const oldestDays = oldest ? Math.floor((now.getTime() - oldest.getTime()) / day) : 0;

  const { start, end } = weekBounds(now);
  const pitchesThisWeek = apps.filter((a) => a.pitchAt && a.pitchAt >= start && a.pitchAt < end).length;
  const nextPitch = apps
    .filter((a) => a.pitchAt && a.pitchAt > now && !DECIDED.includes(a.status as never))
    .sort((a, b) => a.pitchAt!.getTime() - b.pitchAt!.getTime())[0];

  const due = apps
    .filter((a) => a.status === "pitched" && a.pitchAt)
    .map((a) => ({ a, due: new Date(a.pitchAt!.getTime() + DECISION_WINDOW_MS) }))
    .sort((x, y) => x.due.getTime() - y.due.getTime());
  const dueSoon = due.filter((d) => d.due.getTime() - now.getTime() <= DECISION_WINDOW_MS);
  const under12 = dueSoon.filter((d) => hoursLeft(d.due, now) < 12).length;

  const stageCounts = STAGES.map((s) => ({ ...s, count: apps.filter((a) => s.match.includes(a.status)).length }));
  const maxStage = Math.max(1, ...stageCounts.map((s) => s.count));

  const sourceCounts = new Map<string, number>();
  for (const a of apps) {
    const k = source(a, "Applied online");
    sourceCounts.set(k, (sourceCounts.get(k) ?? 0) + 1);
  }
  const sources = [...sourceCounts.entries()].sort((x, y) => y[1] - x[1]).slice(0, 6);

  const hour = beirutHour(now);
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const cols = "1.6fr 1fr 1fr 0.9fr 0.8fr 120px";

  return (
    <main className="adm-main roomy">
      <div className="adm-head">
        <div className="adm-title">
          <span className="eyebrow">{fmtLongDay(now)}</span>
          <h1 className="h1">
            {greeting}, {me.name.split(" ")[0]}
          </h1>
        </div>
        <div className="tools">
          <SearchBox placeholder="Search founders or startups" />
          <Link href="/admin/applications" className="b b-dark">
            <span className="sq"></span>All applications
          </Link>
        </div>
      </div>

      <div className="kpis">
        <div className="kpi">
          <span className="k">New this week</span>
          <span className="v">{thisWeek}</span>
          <span className={"n" + (delta > 0 ? " up" : "")}>
            {delta === 0 ? "Same as last week" : `${delta > 0 ? "+" : "−"}${Math.abs(delta)} vs last week`}
          </span>
        </div>
        <div className="kpi">
          <span className="k">Waiting for review</span>
          <span className="v">{waiting.length}</span>
          <span className="n">{oldest ? `Oldest: ${oldestDays === 0 ? "today" : oldestDays === 1 ? "1 day" : `${oldestDays} days`}` : "All caught up"}</span>
        </div>
        <div className="kpi">
          <span className="k">Pitches this week</span>
          <span className="v">{pitchesThisWeek}</span>
          <span className="n">{nextPitch ? `Next: ${fmtDayTime(nextPitch.pitchAt!)}` : "None scheduled"}</span>
        </div>
        <div className="kpi dark">
          <span className="k">Decisions due in 48h</span>
          <span className="v">{dueSoon.length}</span>
          <span className={"n" + (under12 ? "" : " calm")}>
            {under12 ? `${under12} due in under 12 hours` : dueSoon.length ? "None due in under 12 hours" : "Nothing waiting"}
          </span>
        </div>
      </div>

      <section aria-labelledby="due-h" className="card clip">
        <div className="card-head">
          <h2 id="due-h" className="h2">
            Decisions due
          </h2>
          <span className="sub">The 48-hour promise starts at the pitch</span>
        </div>
        {due.length === 0 ? (
          <p className="empty">No pitched startups are waiting for a decision.</p>
        ) : (
          <div className="tbl-scroll">
            <div style={{ minWidth: 760 }}>
              <div className="th" style={{ gridTemplateColumns: cols }}>
                <span>Startup</span>
                <span>Pitched</span>
                <span>Decision due</span>
                <span>Time left</span>
                <span>Votes</span>
                <span></span>
              </div>
              {due.map(({ a, due: d }) => {
                const left = hoursLeft(d, now);
                return (
                  <div className="tr" key={a.id} style={{ gridTemplateColumns: cols }}>
                    <div className="stack">
                      <span className="strong">{a.startupName}</span>
                      <span className="meta">
                        {a.refNo} · {a.fullName}
                      </span>
                    </div>
                    <span className="cell">{fmtDayTime(a.pitchAt!)}</span>
                    <span className="cell">{fmtDayTime(d)}</span>
                    <span className={left < 12 ? "urgent" : "ok"}>{left < 0 ? `${-left} h overdue` : `${left} h left`}</span>
                    <span className="cell ink2">
                      {a.votes} of {admins.length}
                    </span>
                    <Link href={`/admin/applications/${a.id}#decision`} className="b b-light b-xs" style={{ justifySelf: "end" }}>
                      Decide
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <div className="split">
        <section aria-labelledby="recent-h" className="card clip" style={{ flex: "2 1 480px", minWidth: 0 }}>
          <div className="card-head">
            <h2 id="recent-h" className="h2">
              Latest applications
            </h2>
            <Link href="/admin/applications">View all</Link>
          </div>
          {apps.length === 0 && <p className="empty">No applications yet.</p>}
          {apps.slice(0, 5).map((a) => {
            const s = appStatus(a.status);
            return (
              <Link href={`/admin/applications/${a.id}`} className="recent" key={a.id}>
                <span className="ini">{initials(a.startupName)}</span>
                <div className="stack">
                  <span className="strong">{a.startupName}</span>
                  <span className="meta">
                    {sectorLabel(a.sector)} · {stageLabel(a.stage)} · {founderTypeLabel(a.founderType)}
                  </span>
                </div>
                <span className="when">{ago(a.createdAt, now)}</span>
                <Pill label={s.label} pill={s.pill} />
              </Link>
            );
          })}
        </section>

        <div style={{ flex: "1 1 300px", minWidth: 0, display: "flex", flexDirection: "column", gap: 24 }}>
          <section aria-labelledby="pipe-h" className="card" style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 id="pipe-h" className="h2">
                Pipeline
              </h2>
              <Link href="/admin/pipeline" style={{ fontSize: 14, fontWeight: 600 }}>
                Open board
              </Link>
            </div>
            {stageCounts.map((s) => (
              <div className="bars" key={s.name}>
                <span className="nm">{s.name}</span>
                <span className="track">
                  <span className="fill" style={{ width: `${Math.round((s.count / maxStage) * 100)}%` }}></span>
                </span>
                <span className="ct">{s.count}</span>
              </div>
            ))}
          </section>

          <section aria-labelledby="src-h" className="card" style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
            <h2 id="src-h" className="h2">
              Where founders come from
            </h2>
            {sources.length === 0 && <span className="meta">No applications yet.</span>}
            {sources.map(([name, n]) => (
              <div className="src" key={name}>
                <span>{name}</span>
                <b>{n}</b>
              </div>
            ))}
          </section>
        </div>
      </div>
    </main>
  );
}
