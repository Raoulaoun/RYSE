import type { Metadata } from "next";
import { Board, type BoardLane } from "@/components/admin/Board";
import { FilterBar } from "@/components/admin/FilterBar";
import { ago, fmtDayTime, fmtShort, founderTypeLabel, hoursLeft, initials, sectorLabel, stageLabel } from "@/lib/admin/format";
import { applicationSummaries, listAdmins, type AppSummary } from "@/lib/admin/queries";
import { appStatus, DECIDED, DECISION_WINDOW_MS } from "@/lib/admin/status";

export const metadata: Metadata = { title: "Pipeline" };

const LANES = [
  { key: "new", name: "New", statuses: ["new"] },
  { key: "under_review", name: "Under review", statuses: ["under_review"] },
  { key: "shortlisted", name: "Shortlisted", statuses: ["shortlisted"] },
  { key: "pitch_scheduled", name: "Pitch scheduled", statuses: ["pitch_scheduled"] },
  { key: "pitched", name: "Pitched", statuses: ["pitched"] },
  { key: "decided", name: "Decided", statuses: DECIDED as string[] },
];

function cardMeta(a: AppSummary, now: Date): { meta: string; hot: boolean } {
  const days = (d: Date) => Math.max(0, Math.floor((now.getTime() - d.getTime()) / 86400000));
  switch (a.status) {
    case "new":
      return { meta: `Submitted ${ago(a.createdAt, now)}`, hot: days(a.createdAt) >= 3 };
    case "under_review": {
      const n = days(a.statusChangedAt);
      return { meta: n === 0 ? "In review since today" : `In review ${n} day${n === 1 ? "" : "s"}`, hot: false };
    }
    case "shortlisted":
      return { meta: "Invite to pitch", hot: false };
    case "pitch_scheduled":
      return { meta: a.pitchAt ? fmtDayTime(a.pitchAt) : "Pick a pitch time", hot: !a.pitchAt };
    case "pitched": {
      if (!a.pitchAt) return { meta: "Decision due", hot: true };
      const left = hoursLeft(new Date(a.pitchAt.getTime() + DECISION_WINDOW_MS), now);
      return { meta: left < 0 ? `${-left} h overdue` : `${left} h to decide`, hot: left < 12 };
    }
    default:
      return { meta: `${appStatus(a.status).label} ${fmtShort(a.decidedAt ?? a.statusChangedAt)}`, hot: false };
  }
}

export default async function Pipeline({ searchParams }: { searchParams: Promise<{ lead?: string }> }) {
  const { lead = "" } = await searchParams;
  const [apps, admins] = await Promise.all([applicationSummaries(), listAdmins()]);
  const now = new Date();
  const leadIni = new Map(admins.map((a) => [a.id, initials(a.name)]));
  const visible = apps.filter((a) => !lead || String(a.leadAdminId) === lead);

  const lanes: BoardLane[] = LANES.map((l) => ({
    key: l.key,
    name: l.name,
    dot: l.key === "decided" ? "#7FA51E" : appStatus(l.key).dot,
    locked: l.key === "decided",
    cards: visible
      .filter((a) => l.statuses.includes(a.status))
      .sort((x, y) =>
        l.key === "decided"
          ? (y.decidedAt ?? y.statusChangedAt).getTime() - (x.decidedAt ?? x.statusChangedAt).getTime()
          : x.createdAt.getTime() - y.createdAt.getTime(),
      )
      .map((a) => ({
        id: a.id,
        startup: a.startupName,
        ref: (a.refNo ?? "").replace(/^RYS-\d{4}-/, ""),
        founder: `${a.fullName} · ${founderTypeLabel(a.founderType)}`,
        stage: stageLabel(a.stage),
        sector: sectorLabel(a.sector),
        lead: a.leadAdminId ? (leadIni.get(a.leadAdminId) ?? "—") : "—",
        ...cardMeta(a, now),
      })),
  }));

  return (
    <main className="adm-main">
      <div className="adm-head">
        <div className="adm-title">
          <span className="eyebrow">Drag a card to change its status</span>
          <h1 className="h1">Pipeline</h1>
        </div>
        <FilterBar base="/admin/pipeline" keep={{}}>
          <label className="flt inline">
            Lead partner
            <select name="lead" defaultValue={lead}>
              <option value="">Everyone</option>
              {admins.map((a) => (
                <option key={a.id} value={String(a.id)}>
                  {a.name}
                </option>
              ))}
            </select>
          </label>
        </FilterBar>
      </div>
      <Board key={lead} lanes={lanes} />
    </main>
  );
}
