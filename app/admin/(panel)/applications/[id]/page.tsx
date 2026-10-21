import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DecisionPanel, ManagePanel, NotePanel, VotesPanel } from "@/components/admin/ApplicationPanels";
import { Pill } from "@/components/admin/Pill";
import { requireAdmin } from "@/lib/admin/auth";
import {
  deckKind,
  fmtBytes,
  fmtDayTime,
  founderTypeLabel,
  heardLabel,
  hoursLeft,
  initials,
  sectorLabel,
  source,
  stageLabel,
  toLocalInput,
  waLink,
} from "@/lib/admin/format";
import { getApplication, listAdmins } from "@/lib/admin/queries";
import { appStatus, DECIDED, DECISION_WINDOW_MS } from "@/lib/admin/status";
import { MAIL_FROM } from "@/lib/mail";
import { NEEDS } from "@/lib/options";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = Number((await params).id);
  const data = Number.isInteger(id) ? await getApplication(id) : null;
  return { title: data?.app.startupName ?? "Application" };
}

export default async function ApplicationPage({ params }: Props) {
  const me = await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [data, admins] = await Promise.all([getApplication(id), listAdmins()]);
  if (!data) notFound();
  const { app: a, deck, votes, events } = data;
  const now = new Date();
  const s = appStatus(a.status);
  const decided = DECIDED.includes(a.status as never);
  const voted = votes.filter((v) => v.vote).length;
  const due = a.pitchAt ? new Date(a.pitchAt.getTime() + DECISION_WINDOW_MS) : null;
  const mine = votes.find((v) => v.adminId === me.id);
  const needs = a.needs.map((n) => NEEDS.find((x) => x.value === n)?.label ?? n).join(", ");
  const linkedin = a.linkedinUrl?.replace(/^https?:\/\/(www\.)?/, "");
  const website = a.websiteUrl?.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

  let banner: { tone: "hot" | "calm" | "done"; main: string; sub: string } | null = null;
  if (decided && a.decidedAt) {
    banner = {
      tone: "done",
      main: `${s.label} ${fmtDayTime(a.decidedAt)}`,
      sub: a.decisionEmailedAt ? `Feedback emailed to ${a.email}` : "Feedback not emailed yet",
    };
  } else if (a.status === "pitched" && due) {
    const left = hoursLeft(due, now);
    banner = {
      tone: left < 12 ? "hot" : "calm",
      main: `Decision due ${fmtDayTime(due)} · ${left < 0 ? `${-left} hours overdue` : `${left} hours left`}`,
      sub: `Pitched ${fmtDayTime(a.pitchAt!)} · ${voted} of ${admins.length} partners have voted`,
    };
  } else if (a.pitchAt) {
    banner = {
      tone: "calm",
      main: `Pitch ${a.pitchAt > now ? "scheduled for" : "was set for"} ${fmtDayTime(a.pitchAt)}`,
      sub: `${voted} of ${admins.length} partners have voted`,
    };
  }

  return (
    <main className="adm-main detail">
      <Link href="/admin/applications" className="back">
        ← All applications
      </Link>

      <div className="adm-head" style={{ alignItems: "flex-start" }}>
        <div className="app-id">
          <span className="logo">{initials(a.startupName)}</span>
          <div className="adm-title">
            <div className="row">
              <h1 className="h1">{a.startupName}</h1>
              <Pill label={s.label} pill={s.pill} />
            </div>
            <span className="meta" style={{ fontSize: 14 }}>
              {a.refNo} · Submitted {fmtDayTime(a.createdAt)} · {source(a)}
            </span>
          </div>
        </div>
        <div className="tools">
          <a href={waLink(a.phoneCc, a.phone)} target="_blank" rel="noopener noreferrer" className="b b-light" style={{ padding: "11px 18px" }}>
            WhatsApp founder
          </a>
          <a href="#decision" className="b b-dark">
            <span className="sq"></span>Make decision
          </a>
        </div>
      </div>

      {banner && (
        <div role="status" className={`banner ${banner.tone}`}>
          <b>{banner.main}</b>
          <span>{banner.sub}</span>
        </div>
      )}

      <div className="cols">
        <div className="main-col">
          <section aria-labelledby="founder-h" className="card pad">
            <h2 id="founder-h" className="h2">
              Founder and team
            </h2>
            <div className="kv">
              <div>
                <span className="k">Founder</span>
                <span className="strong">
                  {a.fullName} · {founderTypeLabel(a.founderType)}
                </span>
              </div>
              <div>
                <span className="k">Location</span>
                <span>{a.location || "Not given"}</span>
              </div>
              <div>
                <span className="k">Email</span>
                <a href={`mailto:${a.email}`}>{a.email}</a>
              </div>
              <div>
                <span className="k">Phone / WhatsApp</span>
                <span>
                  {a.phoneCc} {a.phone}
                </span>
              </div>
              <div>
                <span className="k">LinkedIn</span>
                {a.linkedinUrl ? (
                  <a href={a.linkedinUrl} target="_blank" rel="noopener noreferrer">
                    {linkedin}
                  </a>
                ) : (
                  <span>Not given</span>
                )}
              </div>
              <div>
                <span className="k">Full-time on it</span>
                <span>{a.fullTime ? "Yes" : "Not yet"}</span>
              </div>
              {a.founderType === "student" && (
                <>
                  <div>
                    <span className="k">University</span>
                    <span>{a.university}</span>
                  </div>
                  <div>
                    <span className="k">Graduation year</span>
                    <span>{a.gradYear}</span>
                  </div>
                </>
              )}
            </div>
            <div className="cofs">
              <span className="k">Co-founders</span>
              {a.cofounders.length === 0 ? (
                <span className="cell">Solo founder</span>
              ) : (
                <div className="tags" style={{ gap: 8 }}>
                  {a.cofounders.map((c, i) => (
                    <span className="cof" key={i}>
                      <b>{c.name}</b> · {c.role}
                      {c.email ? ` · ${c.email}` : ""}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section aria-labelledby="startup-h" className="card pad" style={{ gap: 18 }}>
            <div className="foot-row">
              <h2 id="startup-h" className="h2">
                The startup
              </h2>
              <div className="tags">
                <span className="tag">{sectorLabel(a.sector)}</span>
                <span className="tag">{stageLabel(a.stage)}</span>
                {a.raisedBefore && <span className="tag">Raised before</span>}
              </div>
            </div>
            <p className="one-liner">{a.oneLiner}</p>
            <div className="para">
              <span className="k">Problem, and who has it</span>
              <p>{a.problem}</p>
            </div>
            <div className="para">
              <span className="k">Solution</span>
              <p>{a.solution}</p>
            </div>
            {a.traction && (
              <div className="para">
                <span className="k">Traction</span>
                <p>{a.traction}</p>
              </div>
            )}
            <div className="kv ruled">
              <div>
                <span className="k">Raised so far</span>
                <span>{a.raisedBefore ? a.raisedDetails : "Nothing yet"}</span>
              </div>
              <div>
                <span className="k">Website</span>
                {a.websiteUrl ? (
                  <a href={a.websiteUrl} target="_blank" rel="noopener noreferrer">
                    {website}
                  </a>
                ) : (
                  <span>Not given</span>
                )}
              </div>
              <div>
                <span className="k">Needs most</span>
                <span>{needs}</span>
              </div>
              <div>
                <span className="k">Heard about Ryse</span>
                <span>
                  {heardLabel(a.heardFrom)}
                  {a.campaignCode ? ` · ${a.campaignCode}` : ""}
                </span>
              </div>
            </div>
          </section>

          <section aria-labelledby="deck-h" className="card pad" style={{ gap: 14 }}>
            <h2 id="deck-h" className="h2">
              Pitch deck
            </h2>
            {deck ? (
              <div className="deck">
                <div className="thumb">{deckKind(deck.filename)}</div>
                <div className="info">
                  <span className="strong">{deck.filename}</span>
                  <span className="meta" style={{ fontSize: 14 }}>
                    {deckKind(deck.filename)} · {fmtBytes(deck.sizeBytes)}
                  </span>
                  <span className="tags" style={{ gap: 8, marginTop: 6 }}>
                    <a href={`/admin/decks/${deck.id}`} target="_blank" rel="noopener" className="b b-dark b-sm">
                      Open deck
                    </a>
                    <a href={`/admin/decks/${deck.id}?download=1`} className="b b-light b-sm">
                      Download
                    </a>
                  </span>
                </div>
              </div>
            ) : (
              <span className="meta" style={{ fontSize: 14 }}>
                No deck uploaded.
              </span>
            )}
          </section>

          <DecisionPanel
            id={a.id}
            founderName={a.fullName}
            founderEmail={a.email}
            startup={a.startupName}
            from={MAIL_FROM}
            saved={{
              decision: a.decision,
              feedback: a.decisionFeedback,
              note: a.decisionNote,
              emailedLabel: a.decisionEmailedAt ? `Sent ${fmtDayTime(a.decisionEmailedAt)} to ${a.email}` : null,
            }}
          />
        </div>

        <aside className="side-col">
          <ManagePanel
            key={`${a.status}-${a.leadAdminId}-${a.pitchAt?.getTime()}`}
            id={a.id}
            status={a.status}
            leadAdminId={a.leadAdminId}
            pitchLocal={toLocalInput(a.pitchAt)}
            dueLabel={due && !decided ? fmtDayTime(due) : null}
            admins={admins.map((x) => ({ id: x.id, name: x.name }))}
          />
          <VotesPanel
            id={a.id}
            myVote={mine?.vote ?? null}
            others={admins
              .filter((x) => x.id !== me.id)
              .map((x) => {
                const v = votes.find((y) => y.adminId === x.id);
                return { name: x.name, initials: initials(x.name), vote: v?.vote ?? null, note: v?.note ?? null };
              })}
          />
          <NotePanel id={a.id} note={mine?.note ?? ""} />
          <section aria-labelledby="hist-h" className="card pad-s" style={{ gap: 12 }}>
            <h2 id="hist-h" className="h2">
              History
            </h2>
            {events.map((e, i) => (
              <div className="hist" key={i}>
                <span className="mk"></span>
                <div className="stack">
                  <span className="t">{e.what}</span>
                  <span className="meta">
                    {e.who ?? a.fullName} · {fmtDayTime(e.createdAt)}
                  </span>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <div className="hist">
                <span className="mk"></span>
                <div className="stack">
                  <span className="t">Application submitted</span>
                  <span className="meta">
                    {a.fullName} · {fmtDayTime(a.createdAt)}
                  </span>
                </div>
              </div>
            )}
          </section>
        </aside>
      </div>
    </main>
  );
}
