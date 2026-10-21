"use client";

import { useState, useTransition } from "react";
import { updateInquiry } from "@/app/admin/actions";
import { INQUIRY_STATUSES } from "@/lib/admin/status";

type Props = {
  id: number;
  status: string;
  ownerAdminId: number | null;
  note: string;
  admins: { id: number; name: string }[];
  whatsapp: string;
  mailto: string;
};

export function InquiryControls({ id, status, ownerAdminId, note, admins, whatsapp, mailto }: Props) {
  const [pending, start] = useTransition();
  const [st, setSt] = useState(status);
  const [owner, setOwner] = useState(ownerAdminId);
  const [text, setText] = useState(note);
  const [savedNote, setSavedNote] = useState(note);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const save = (patch: Parameters<typeof updateInquiry>[1]) =>
    start(async () => {
      const r = await updateInquiry(id, patch);
      setMsg(r.ok ? { ok: true, text: "Saved" } : { ok: false, text: r.error });
    });

  return (
    <>
      <div className="row-end">
        <label className="fld">
          Status
          <select
            value={st}
            disabled={pending}
            onChange={(e) => {
              setSt(e.target.value);
              save({ status: e.target.value });
            }}
          >
            {INQUIRY_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label className="fld">
          Owner
          <select
            value={owner ?? ""}
            disabled={pending}
            onChange={(e) => {
              const next = e.target.value ? Number(e.target.value) : null;
              setOwner(next);
              save({ ownerAdminId: next });
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
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="b b-light" style={{ padding: "11px 18px" }}>
          WhatsApp
        </a>
        <a href={mailto} className="b b-dark">
          Reply by email
        </a>
      </div>
      <label htmlFor="pnote" className="fld ink">
        Internal note
        <textarea
          id="pnote"
          rows={3}
          placeholder="Next step, terms, who met them"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setMsg(null);
          }}
          onBlur={() => {
            if (text !== savedNote) {
              setSavedNote(text);
              save({ internalNote: text });
            }
          }}
        />
      </label>
      {msg && (
        <span className={msg.ok ? "saved" : "err"} role="status">
          {msg.text}
        </span>
      )}
    </>
  );
}
