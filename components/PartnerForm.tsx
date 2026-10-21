"use client";

import { useEffect, useState, type FormEvent } from "react";
import { COUNTRY_CODES, EMAIL_RE, HELP_TYPES, PARTNER_TYPES, TICKET_RANGES } from "@/lib/options";
import { Counter, Field, focusField, Req, without, type Errors } from "./forms/Field";

type PartnerType = (typeof PARTNER_TYPES)[number]["value"] | "";


const EMPTY = {
  full_name: "",
  organization: "",
  role: "",
  email: "",
  phone_cc: "+961",
  phone: "",
  uni_unit: "",
  ticket_range: "",
  message: "",
};

export function PartnerForm() {
  const [type, setType] = useState<PartnerType>("");
  const [v, setV] = useState(EMPTY);
  const [help, setHelp] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [hp, setHp] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [doneEmail, setDoneEmail] = useState<string | null>(null);

  const set = (k: keyof typeof EMPTY) => (e: { target: { value: string } }) => {
    setV((s) => ({ ...s, [k]: e.target.value }));
    setErrors((er) => without(er, k));
  };

  // Links like /partner?type=university preselect who is reaching out.
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("type");
    const match = PARTNER_TYPES.find((p) => p.value === t);
    // Read once from the URL on mount; there is no external store to sync with.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (match) setType(match.value);
  }, []);

  function pickType(t: PartnerType) {
    setType(t);
    setErrors((er) => without(er, "partner_type", "uni_unit", "ticket_range", "help_type"));
  }

  function validate(): Errors {
    const e: Errors = {};
    if (!type) e.partner_type = "Pick how you're reaching out";
    if (!v.full_name.trim()) e.full_name = "Add your full name";
    if (!v.organization.trim()) e.organization = "Add your organization";
    if (!v.role.trim()) e.role = "Add your role";
    if (!EMAIL_RE.test(v.email.trim())) e.email = "Add a valid email";
    if (v.phone.replace(/\D/g, "").length < 6) e.phone = "Add a phone number";
    if (type === "university" && !v.uni_unit.trim()) e.uni_unit = "Add your club or office";
    if (type === "co_investor" && !v.ticket_range) e.ticket_range = "Pick a ticket size";
    if (type === "corporate_mentor" && help.length === 0) e.help_type = "Pick at least one";
    if (!v.message.trim()) e.message = "Add a short message";
    if (!consent) e.consent = "Please accept to continue";
    return e;
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    if (hp || sending) return;
    const e = validate();
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) {
      focusField(first);
      return;
    }
    setSending(true);
    setSendError("");
    try {
      const res = await fetch("/api/partners", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...v, partner_type: type, help_type: help, consent: "yes", website_hp: hp }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "We couldn't send your message. Please try again.");
      setDoneEmail(v.email.trim());
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "We couldn't send your message. Please try again.");
    } finally {
      setSending(false);
    }
  }

  function reset() {
    setType("");
    setV(EMPTY);
    setHelp([]);
    setConsent(false);
    setErrors({});
    setSendError("");
    setDoneEmail(null);
  }

  return (
    <div>
      <form className="pform" noValidate onSubmit={onSubmit} hidden={doneEmail !== null}>
        <input
          type="text"
          name="website_hp"
          tabIndex={-1}
          autoComplete="off"
          style={{ position: "absolute", left: -9999 }}
          aria-hidden="true"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
        />
        <Field name="partner_type" errors={errors}>
          <span className="lbl">
            I&apos;m reaching out as<Req />
          </span>
          <div className="seg three">
            {PARTNER_TYPES.map((p) => (
              <label key={p.value} htmlFor={`pt-${p.value}`}>
                <input
                  type="radio"
                  id={`pt-${p.value}`}
                  name="partner_type"
                  value={p.value}
                  checked={type === p.value}
                  onChange={() => pickType(p.value)}
                />{" "}
                {p.label}
              </label>
            ))}
          </div>
        </Field>
        <div className="f2">
          <Field name="full_name" errors={errors}>
            <label htmlFor="p-name">
              Full name<Req />
            </label>
            <input id="p-name" name="full_name" autoComplete="name" value={v.full_name} onChange={set("full_name")} />
          </Field>
          <Field name="organization" errors={errors}>
            <label htmlFor="p-org">
              Organization<Req />
            </label>
            <input
              id="p-org"
              name="organization"
              autoComplete="organization"
              value={v.organization}
              onChange={set("organization")}
            />
          </Field>
        </div>
        <div className="f2">
          <Field name="role" errors={errors}>
            <label htmlFor="p-role">
              Role or title<Req />
            </label>
            <input
              id="p-role"
              name="role"
              autoComplete="organization-title"
              value={v.role}
              onChange={set("role")}
            />
          </Field>
          <Field name="email" errors={errors}>
            <label htmlFor="p-email">
              Email<Req />
            </label>
            <input
              id="p-email"
              name="email"
              type="email"
              autoComplete="email"
              value={v.email}
              onChange={set("email")}
            />
          </Field>
        </div>
        <Field name="phone" errors={errors}>
          <label htmlFor="p-phone">
            Phone / WhatsApp<Req />
          </label>
          <div className="phone-row">
            <select id="p-cc" name="phone_cc" aria-label="Country code" value={v.phone_cc} onChange={set("phone_cc")}>
              {COUNTRY_CODES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <input
              id="p-phone"
              name="phone"
              type="tel"
              autoComplete="tel-national"
              value={v.phone}
              onChange={set("phone")}
            />
          </div>
        </Field>
        <Field name="uni_unit" errors={errors} hidden={type !== "university"}>
          <label htmlFor="p-unit">
            Club or office<Req />
          </label>
          <input
            id="p-unit"
            name="uni_unit"
            placeholder="e.g. Entrepreneurship club"
            value={v.uni_unit}
            onChange={set("uni_unit")}
          />
        </Field>
        <Field name="ticket_range" errors={errors} hidden={type !== "co_investor"}>
          <label htmlFor="p-ticket">
            Typical ticket size<Req />
          </label>
          <select id="p-ticket" name="ticket_range" value={v.ticket_range} onChange={set("ticket_range")}>
            <option value="">Select…</option>
            {TICKET_RANGES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
        <Field name="help_type" errors={errors} hidden={type !== "corporate_mentor"}>
          <span className="lbl">
            How would you like to help?<Req />
          </span>
          <div className="chips">
            {HELP_TYPES.map((h) => (
              <label key={h.value} htmlFor={`ht-${h.value}`}>
                <input
                  type="checkbox"
                  id={`ht-${h.value}`}
                  name="help_type"
                  value={h.value}
                  checked={help.includes(h.value)}
                  onChange={(e) => {
                    setHelp((s) => (e.target.checked ? [...s, h.value] : s.filter((x) => x !== h.value)));
                    setErrors((er) => without(er, "help_type"));
                  }}
                />{" "}
                {h.label}
              </label>
            ))}
          </div>
        </Field>
        <Field name="message" errors={errors}>
          <label htmlFor="p-msg">
            Message<Req />
          </label>
          <textarea id="p-msg" name="message" maxLength={1000} value={v.message} onChange={set("message")} />
          <Counter value={v.message} max={1000} />
        </Field>
        <Field name="consent" errors={errors}>
          <label className="check" htmlFor="p-consent">
            <input
              type="checkbox"
              id="p-consent"
              name="consent"
              value="yes"
              checked={consent}
              onChange={(e) => {
                setConsent(e.target.checked);
                setErrors((er) => without(er, "consent"));
              }}
            />{" "}
            <span>I agree that Ryse stores these details to reply to me, as described in the privacy policy.</span>
          </label>
        </Field>
        {sendError && (
          <p className="form-error" role="alert">
            {sendError}
          </p>
        )}
        <button type="submit" className="btn btn-primary" disabled={sending}>
          <span className="dot"></span>
          {sending ? "Sending…" : "Send to the partners"}
        </button>
      </form>

      <div className="done-card" hidden={doneEmail === null} style={{ border: "1px solid var(--line)" }}>
        <span className="tick">
          <svg viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
        <h3>Thanks, we&apos;ll be in touch</h3>
        <p style={{ color: "var(--muted)" }}>
          The partners reply within three working days. A confirmation is on its way to <b>{doneEmail}</b>.
        </p>
        <button type="button" className="btn btn-outline" onClick={reset}>
          Send another message
        </button>
      </div>
    </div>
  );
}
