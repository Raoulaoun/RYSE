"use client";

import { useActionState, useTransition } from "react";
import { inviteAdmin, removeAdmin } from "@/app/admin/actions";

type Member = { id: number; name: string; email: string; added: string; me: boolean };

export function AdminTeam({ members }: { members: Member[] }) {
  const [state, action, pending] = useActionState(inviteAdmin, null);
  const [removing, start] = useTransition();
  const COLS = "1.2fr 1.4fr 0.8fr 110px";
  return (
    <>
      <section className="card clip" aria-labelledby="team-h">
        <div className="card-head">
          <h2 id="team-h" className="h2">
            Partners with access
          </h2>
          <span className="sub">They sign in with an emailed link</span>
        </div>
        <div className="tbl-scroll">
          <div style={{ minWidth: 560 }}>
            {members.map((m) => (
              <div className="tr" key={m.id} style={{ gridTemplateColumns: COLS }}>
                <span className="strong">
                  {m.name}
                  {m.me ? " (you)" : ""}
                </span>
                <span className="cell">{m.email}</span>
                <span className="cell muted">Added {m.added}</span>
                {m.me ? (
                  <span></span>
                ) : (
                  <button
                    type="button"
                    className="b b-light b-xs"
                    style={{ justifySelf: "end" }}
                    disabled={removing}
                    onClick={() => {
                      if (confirm(`Remove ${m.name}'s access?`)) start(async () => void (await removeAdmin(m.id)));
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <form action={action} className="card pad-s" aria-labelledby="inv-h">
        <h2 id="inv-h" className="h2">
          Give a partner access
        </h2>
        <div className="row-end">
          <label className="fld">
            Full name
            <input name="name" autoComplete="off" required />
          </label>
          <label className="fld">
            Email
            <input name="email" type="email" autoComplete="off" required />
          </label>
          <button type="submit" className="b b-dark" disabled={pending}>
            <span className="sq"></span>
            {pending ? "Adding…" : "Add partner"}
          </button>
        </div>
        {state && (
          <span className={state.ok ? "saved" : "err"} role="status">
            {state.ok ? state.message : state.error}
          </span>
        )}
      </form>
    </>
  );
}
