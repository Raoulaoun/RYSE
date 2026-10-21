"use client";

import { useState, useTransition } from "react";
import { castVote, saveNote, sendDecision, setLead, setPitchAt, setStatus } from "@/app/admin/actions";
import { decisionDraft, decisionSubject } from "@/lib/admin/emails";
import { APP_STATUSES, DECIDED, DECISIONS, VOTES } from "@/lib/admin/status";

type Result = { ok: true; message?: string } | { ok: false; error: string };

// Runs a server action and keeps its outcome for display.
function useAction() {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const run = (fn: () => Promise<Result>) =>
    start(async () => {
      setMsg(null);
      const r = await fn();
      setMsg(r.ok ? (r.message ? { ok: true, text: r.message } : null) : { ok: false, text: r.error });
    });
  return { pending, msg, run, setMsg };
}

function Msg({ msg }: { msg: { ok: boolean; text: string } | null }) {
  if (!msg) return null;
  return (
    <span className={msg.ok ? "saved" : "err"} role={msg.ok ? "status" : "alert"}>
      {msg.text}
    </span>
  );
}

export function ManagePanel({
  id,
  status,
  leadAdminId,
  pitchLocal,
  dueLabel,
  admins,
}: {
  id: number;
  status: string;
  leadAdminId: number | null;
  pitchLocal: string;
  dueLabel: string | null;
  admins: { id: number; name: string }[];
}) {
  const { pending, msg, run } = useAction();
  // Local copies keep the selects on the new value while the save runs.
  const [st, setSt] = useState(status);
  const [lead, setLeadId] = useState(leadAdminId);
  const decided = DECIDED.includes(status as never);
  return (
    <section aria-labelledby="manage-h" className="card pad-s">
      <h2 id="manage-h" className="h2">
        Manage
      </h2>
      <label className="fld">
        Status
        <select
          value={st}
          disabled={pending}
          onChange={(e) => {
            const next = e.target.value;
            setSt(next);
            run(async () => {
              const r = await setStatus(id, next);
              if (!r.ok) setSt(status);
              return r;
            });
          }}
        >
          {APP_STATUSES.map((s) => (
            <option key={s.value} value={s.value} disabled={DECIDED.includes(s.value) && s.value !== status}>
              {s.label}
              {DECIDED.includes(s.value) && s.value !== status ? " (use Decision)" : ""}
            </option>
          ))}
        </select>
      </label>
      <label className="fld">
        Lead partner
        <select
          value={lead ?? ""}
          disabled={pending}
          onChange={(e) => {
            const next = e.target.value ? Number(e.target.value) : null;
            setLeadId(next);
            run(() => setLead(id, next));
          }}
        >
          <option value="">Unassigned</option>
          {admins.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </label>
      <label className="fld">
        Pitch meeting
        <input
          type="datetime-local"
          defaultValue={pitchLocal}
          disabled={pending || decided}
          onBlur={(e) => {
            if (e.target.value !== pitchLocal) run(() => setPitchAt(id, e.target.value));
          }}
        />
      </label>
      {dueLabel && (
        <div className="kv-line">
          <span className="k">Decision due</span>
          <b>{dueLabel}</b>
        </div>
      )}
      <Msg msg={msg} />
    </section>
  );
}

export function VotesPanel({
  id,
  myVote,
  others,
}: {
  id: number;
  myVote: string | null;
  others: { name: string; initials: string; vote: string | null; note: string | null }[];
}) {
  const { pending, msg, run } = useAction();
  const [vote, setVote] = useState(myVote);
  return (
    <section aria-labelledby="votes-h" className="card pad-s">
      <h2 id="votes-h" className="h2">
        Partner votes
      </h2>
      <div className="my-vote">
        <span className="t">Your vote</span>
        <div role="radiogroup" aria-label="Your vote" className="chips three">
          {VOTES.map((v) => (
            <button
              key={v.value}
              type="button"
              role="radio"
              aria-checked={vote === v.value}
              className="chip"
              disabled={pending}
              onClick={() => {
                setVote(v.value);
                run(() => castVote(id, v.value));
              }}
            >
              {v.label}
            </button>
          ))}
        </div>
        <Msg msg={msg} />
      </div>
      {others.length === 0 && <span className="meta">You are the only partner with access.</span>}
      {others.map((o) => {
        const v = VOTES.find((x) => x.value === o.vote);
        return (
          <div className="voter" key={o.name}>
            <span className="av">{o.initials}</span>
            <div className="body">
              <div className="top">
                <span className="nm">{o.name}</span>
                {v ? (
                  <span className="pill" style={{ background: v.pill.bg, color: v.pill.fg }}>
                    {v.label}
                  </span>
                ) : (
                  <span className="meta">No vote yet</span>
                )}
              </div>
              {o.note && <span className="note">{o.note}</span>}
            </div>
          </div>
        );
      })}
    </section>
  );
}

export function NotePanel({ id, note }: { id: number; note: string }) {
  const { pending, msg, run, setMsg } = useAction();
  const [text, setText] = useState(note);
  return (
    <section aria-labelledby="notes-h" className="card pad-s" style={{ gap: 12 }}>
      <h2 id="notes-h" className="h2">
        Your note
      </h2>
      <label htmlFor="mynote" className="sr">
        Your note on this application
      </label>
      <textarea
        id="mynote"
        className="plain"
        rows={3}
        placeholder="What stood out in the pitch?"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setMsg(null);
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button type="button" className="b b-light b-sm" disabled={pending} onClick={() => run(() => saveNote(id, text))}>
          Save note
        </button>
        <Msg msg={msg} />
      </div>
    </section>
  );
}

export function DecisionPanel({
  id,
  founderName,
  founderEmail,
  startup,
  from,
  saved,
}: {
  id: number;
  founderName: string;
  founderEmail: string;
  startup: string;
  from: string;
  saved: { decision: string | null; feedback: string | null; note: string | null; emailedLabel: string | null };
}) {
  const initial = saved.decision ?? "accepted";
  const [decision, setDecision] = useState(initial);
  const [feedback, setFeedback] = useState(saved.feedback ?? decisionDraft(initial, founderName, startup));
  const [note, setNote] = useState(saved.note ?? "");
  const [previewing, setPreviewing] = useState(false);
  const { pending, msg, run, setMsg } = useAction();

  function pick(d: string) {
    if (d === decision) return;
    // Text the partner hasn't changed (a draft, or what was sent before) follows the
    // new decision, so an acceptance letter can't go out with a decline.
    const untouched = feedback === decisionDraft(decision, founderName, startup) || feedback === saved.feedback;
    if (untouched) setFeedback(d === saved.decision && saved.feedback ? saved.feedback : decisionDraft(d, founderName, startup));
    setDecision(d);
    setPreviewing(false);
    setMsg(null);
  }

  return (
    <section id="decision" aria-labelledby="decision-h" className="card pad decision">
      <h2 id="decision-h" className="h2">
        Decision
      </h2>
      <div role="radiogroup" aria-label="Decision" className="chips">
        {DECISIONS.map((d) => (
          <button key={d.value} type="button" role="radio" aria-checked={decision === d.value} className="chip" onClick={() => pick(d.value)}>
            {d.label}
          </button>
        ))}
      </div>
      <label htmlFor="feedback" className="fld ink">
        Feedback to the founder
        <textarea
          id="feedback"
          rows={6}
          value={feedback}
          onChange={(e) => {
            setFeedback(e.target.value);
            setPreviewing(false);
          }}
        />
      </label>
      <label htmlFor="internal" className="fld ink">
        Internal note (not sent)
        <input
          id="internal"
          type="text"
          placeholder="Reason, terms discussed, next steps"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </label>

      {previewing && (
        <div className="preview" aria-label="Email preview">
          <div className="hd">
            <span>From: {from}</span>
            <span>To: {founderEmail}</span>
            <span>Subject: {decisionSubject(startup)}</span>
          </div>
          <div className="bd">{feedback}</div>
        </div>
      )}

      <div className="foot-row">
        <span className="meta">
          {saved.emailedLabel ?? `Sends from ${from.replace(/^.*<|>$/g, "")} after you preview it`}
        </span>
        <span style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <Msg msg={msg} />
          {previewing && (
            <button type="button" className="b b-light" onClick={() => setPreviewing(false)} disabled={pending}>
              Edit
            </button>
          )}
          <button
            type="button"
            className="b b-lime"
            disabled={pending}
            onClick={() => {
              if (!previewing) {
                if (/\[[^\]]+\]/.test(feedback)) {
                  setMsg({ ok: false, text: "Fill in the [bracketed] parts first" });
                  return;
                }
                setMsg(null);
                setPreviewing(true);
                return;
              }
              run(async () => {
                const r = await sendDecision(id, decision, feedback, note);
                if (r.ok) setPreviewing(false);
                return r;
              });
            }}
          >
            {pending ? "Sending…" : previewing ? "Send to founder" : "Preview and send"}
          </button>
        </span>
      </div>
    </section>
  );
}
