import type { AppSummary } from "./queries";

export type AppFilters = {
  status: string;
  q: string;
  stage: string;
  sector: string;
  ftype: string;
  source: string;
  lead: string;
};

type Params = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export function readFilters(p: Params): AppFilters {
  return {
    status: one(p.status),
    q: one(p.q).trim(),
    stage: one(p.stage),
    sector: one(p.sector),
    ftype: one(p.ftype),
    source: one(p.source),
    lead: one(p.lead),
  };
}

/** Applies every filter except the status tab (so tabs can show their counts). */
export function filterApps(apps: AppSummary[], f: AppFilters) {
  const q = f.q.toLowerCase();
  return apps.filter((a) => {
    if (q) {
      const hay = `${a.startupName} ${a.fullName} ${a.refNo ?? ""} ${a.email}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (f.stage && a.stage !== f.stage) return false;
    if (f.sector && a.sector !== f.sector) return false;
    if (f.ftype && a.founderType !== f.ftype) return false;
    if (f.source === "online" && a.campaignCode) return false;
    if (f.source && f.source !== "online" && a.campaignCode !== f.source) return false;
    if (f.lead === "none" && a.leadAdminId !== null) return false;
    if (f.lead && f.lead !== "none" && String(a.leadAdminId) !== f.lead) return false;
    return true;
  });
}

export function byStatus(apps: AppSummary[], status: string) {
  return status ? apps.filter((a) => a.status === status) : apps;
}

/** Query string for the given filters, dropping empty values. */
export function qs(f: Partial<AppFilters> & { page?: number }) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(f)) if (v !== undefined && v !== "" && !(k === "page" && v === 1)) p.set(k, String(v));
  const s = p.toString();
  return s ? `?${s}` : "";
}
