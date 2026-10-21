import { inArray } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { currentAdmin } from "@/lib/admin/auth";
import { byStatus, filterApps, readFilters } from "@/lib/admin/filter";
import { founderTypeLabel, heardLabel, sectorLabel, stageLabel, toLocalInput } from "@/lib/admin/format";
import { applicationSummaries, listAdmins } from "@/lib/admin/queries";
import { appStatus } from "@/lib/admin/status";
import { getDb, schema } from "@/lib/db";

function cell(v: unknown) {
  const s = v === null || v === undefined ? "" : String(v);
  // Quote everything; neutralise spreadsheet formulas.
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET(request: NextRequest) {
  if (!(await currentAdmin())) return new NextResponse("Sign in first", { status: 401 });
  const f = readFilters(Object.fromEntries(request.nextUrl.searchParams));
  const [summaries, admins] = await Promise.all([applicationSummaries(), listAdmins()]);
  const picked = byStatus(filterApps(summaries, f), f.status);
  const ids = picked.map((a) => a.id);
  const deckNames = new Map(picked.map((a) => [a.id, a.deckName]));
  const leads = new Map(admins.map((a) => [a.id, a.name]));
  const rows = ids.length
    ? await getDb().select().from(schema.applications).where(inArray(schema.applications.id, ids))
    : [];
  rows.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const header = [
    "Reference", "Submitted", "Status", "Startup", "One-liner", "Sector", "Stage", "Founder", "Email", "Phone",
    "Founder type", "University", "Graduation year", "Location", "LinkedIn", "Team", "Co-founders", "Full-time",
    "Problem", "Solution", "Traction", "Website", "Raised before", "Raised details", "Needs", "Heard from",
    "Campaign", "Lead partner", "Pitch", "Decision", "Deck",
  ];
  const lines = rows.map((a) =>
    [
      a.refNo, toLocalInput(a.createdAt).replace("T", " "), appStatus(a.status).label, a.startupName, a.oneLiner,
      sectorLabel(a.sector), stageLabel(a.stage), a.fullName, a.email, `${a.phoneCc} ${a.phone}`,
      founderTypeLabel(a.founderType), a.university, a.gradYear, a.location, a.linkedinUrl,
      a.teamType === "team" ? "Team" : "Solo", a.cofounders.map((c) => `${c.name} (${c.role})`).join("; "),
      a.fullTime ? "Yes" : "Not yet", a.problem, a.solution, a.traction, a.websiteUrl,
      a.raisedBefore ? "Yes" : "No", a.raisedDetails, a.needs.join(", "), heardLabel(a.heardFrom), a.campaignCode,
      a.leadAdminId ? leads.get(a.leadAdminId) : "", a.pitchAt ? toLocalInput(a.pitchAt).replace("T", " ") : "",
      a.decision ? appStatus(a.decision).label : "", deckNames.get(a.id) ?? "",
    ].map(cell).join(","),
  );
  const csv = "﻿" + [header.map(cell).join(","), ...lines].join("\r\n");
  const date = toLocalInput(new Date()).slice(0, 10);
  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="ryse-applications-${date}.csv"`,
      "cache-control": "no-store",
    },
  });
}
