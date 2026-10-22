"use client";

import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import {
  CAMPAIGN_RE,
  COUNTRY_CODES,
  DECK_EXT,
  DECK_MAX_BYTES,
  EMAIL_RE,
  FOUNDER_TYPES,
  GRAD_YEARS,
  HEARD_FROM,
  MAX_COFOUNDERS,
  NEEDS,
  SECTORS,
  STAGES,
  URL_RE,
} from "@/lib/options";
import { Counter, Field, focusField, Req, without, type Errors } from "./forms/Field";

const STEP_TITLES = ["About you", "Your team", "Your startup", "Ryse and you"];

const EMPTY = {
  full_name: "",
  email: "",
  phone_cc: "+961",
  phone: "",
  location: "",
  linkedin_url: "",
  founder_type: "",
  university: "",
  grad_year: "",
  team_type: "",
  full_time: "",
  startup_name: "",
  one_liner: "",
  sector: "",
  stage: "",
  problem: "",
  solution: "",
  traction: "",
  website_url: "",
  raised_before: "",
  raised_details: "",
  heard_from: "",
  campaign_code: "",
};
type Values = typeof EMPTY;
type Cofounder = { key: number; name: string; role: string; email: string };

function fmt(b: number) {
  return b > 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(b / 1024)) + " KB";
}

export function ApplicationForm() {
  const [step, setStep] = useState(0);
  const [v, setV] = useState<Values>(EMPTY);
  const [cofs, setCofs] = useState<Cofounder[]>([]);
  const [needs, setNeeds] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [deck, setDeck] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [hp, setHp] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [done, setDone] = useState<{ refNo: string; email: string } | null>(null);
  const cofSeq = useRef(0);
  const deckInput = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  // Campaign links look like /apply?c=CODE.
  useEffect(() => {
    try {
      const code = new URLSearchParams(window.location.search).get("c");
      if (code && CAMPAIGN_RE.test(code)) {
        // Read once from the URL on mount; there is no external store to sync with.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setV((s) => ({ ...s, campaign_code: code.toUpperCase(), heard_from: "campus_campaign" }));
      }
    } catch {
      // Ignore malformed URLs.
    }
  }, []);

  useEffect(() => {
    if (done) doneRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [done]);

  function update<K extends keyof Values>(k: K, value: string) {
    setV((s) => ({ ...s, [k]: value }));
    setErrors((er) => without(er, k));
  }
  const bind = (k: keyof Values) => ({
    value: v[k],
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => update(k, e.target.value),
  });
  const radio = (k: keyof Values, value: string) => ({
    name: k,
    value,
    checked: v[k] === value,
    onChange: () => update(k, value),
  });

  function addCof() {
    cofSeq.current += 1;
    const key = cofSeq.current;
    setCofs((c) => (c.length >= MAX_COFOUNDERS ? c : [...c, { key, name: "", role: "", email: "" }]));
  }
  function setCof(key: number, k: "name" | "role" | "email", value: string) {
    setCofs((c) => c.map((x) => (x.key === key ? { ...x, [k]: value } : x)));
    setErrors((er) => without(er, `cof-${key}-${k}`));
  }
  function chooseTeam(value: string) {
    update("team_type", value);
    if (value === "team" && cofs.length === 0) addCof();
  }

  function takeFile(f: File | undefined) {
    setErrors((er) => without(er, "deck"));
    if (!f) return;
    if (!DECK_EXT.test(f.name)) {
      setErrors((er) => ({ ...er, deck: "Use a PDF, PowerPoint or Keynote file" }));
      return;
    }
    if (f.size > DECK_MAX_BYTES) {
      setErrors((er) => ({ ...er, deck: "That file is " + fmt(f.size) + ". The limit is 15 MB." }));
      return;
    }
    setDeck(f);
  }
  function removeDeck() {
    setDeck(null);
    if (deckInput.current) deckInput.current.value = "";
  }
  const onDrag = (over: boolean) => (e: DragEvent) => {
    e.preventDefault();
    setDragOver(over);
  };

  function validate(i: number): Errors {
    const e: Errors = {};
    const t = (s: string) => s.trim();
    const badUrl = (s: string) => t(s) !== "" && !URL_RE.test(t(s));
    if (i === 0) {
      if (!t(v.full_name)) e.full_name = "Add your full name";
      if (!EMAIL_RE.test(t(v.email))) e.email = "Add a valid email";
      if (v.phone.replace(/\D/g, "").length < 6) e.phone = "Add a phone number we can reach on WhatsApp";
      if (!v.founder_type) e.founder_type = "Pick the option that describes you";
      if (v.founder_type === "student") {
        if (!t(v.university)) e.university = "Add your university";
        if (!v.grad_year) e.grad_year = "Pick your graduation year";
      }
      if (badUrl(v.linkedin_url)) e.linkedin_url = "Use a full link starting with https://";
    }
    if (i === 1) {
      if (!v.team_type) e.team_type = "Tell us if you're solo or a team";
      if (v.team_type === "team") {
        for (const c of cofs) {
          if (!t(c.name)) e[`cof-${c.key}-name`] = "Add a name";
          if (!t(c.role)) e[`cof-${c.key}-role`] = "Add a role";
        }
      }
      if (!v.full_time) e.full_time = "Tell us if anyone is full-time";
    }
    if (i === 2) {
      if (!t(v.startup_name)) e.startup_name = "Add your startup's name";
      if (!t(v.one_liner)) e.one_liner = "Describe your startup in one line";
      if (!v.sector) e.sector = "Pick a sector";
      if (!v.stage) e.stage = "Pick your stage";
      if (!t(v.problem)) e.problem = "Describe the problem you solve";
      if (!t(v.solution)) e.solution = "Describe your solution";
      if (!v.raised_before) e.raised_before = "Tell us if you've raised money";
      if (v.raised_before === "yes" && !t(v.raised_details)) e.raised_details = "Tell us how much you raised";
      if (badUrl(v.website_url)) e.website_url = "Use a full link starting with https://";
    }
    if (i === 3) {
      if (needs.length === 0) e.needs = "Pick at least one";
      if (!v.heard_from) e.heard_from = "Tell us how you found us";
      if (!consent) e.consent = "Please accept to continue";
    }
    return e;
  }

  function scrollToForm() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function next() {
    const e = validate(step);
    // Keep a deck error visible; it is cleared by picking a valid file.
    setErrors((er) => (er.deck ? { ...e, deck: er.deck } : e));
    const first = Object.keys(e)[0];
    if (first) {
      focusField(first);
      return;
    }
    if (step < STEP_TITLES.length - 1) {
      setStep(step + 1);
      scrollToForm();
      return;
    }
    submit();
  }

  async function submit() {
    if (hp || sending) return;
    const fd = new FormData();
    for (const [k, val] of Object.entries(v)) fd.append(k, val);
    fd.append("cofounders", JSON.stringify(cofs.map(({ name, role, email }) => ({ name, role, email }))));
    for (const n of needs) fd.append("needs", n);
    fd.append("consent", "yes");
    fd.append("website_hp", hp);
    if (deck) fd.append("deck", deck);

    setSending(true);
    setSendError("");
    try {
      const res = await fetch("/api/applications", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.refNo) throw new Error(data.error || "We couldn't submit your application. Please try again.");
      setDone({ refNo: data.refNo, email: v.email.trim() });
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "We couldn't submit your application. Please try again.");
    } finally {
      setSending(false);
    }
  }

  function again() {
    setV(EMPTY);
    setCofs([]);
    setNeeds([]);
    setConsent(false);
    removeDeck();
    setErrors({});
    setSendError("");
    setDone(null);
    setStep(0);
    scrollToForm();
  }

  const last = step === STEP_TITLES.length - 1;

  return (
    <div>
      <form className="app" noValidate hidden={done !== null} onSubmit={(e) => e.preventDefault()}>
        <div className="steps-bar" aria-hidden="true">
          {STEP_TITLES.map((_, k) => (
            <span key={k} className={k <= step ? "on" : undefined}></span>
          ))}
        </div>
        <div className="step-head">
          <h3>{STEP_TITLES[step]}</h3>
          <small>
            Step {step + 1} of {STEP_TITLES.length}
          </small>
        </div>
        <input
          type="text"
          name="website_hp"
          id="f-hp"
          tabIndex={-1}
          autoComplete="off"
          style={{ position: "absolute", left: -9999 }}
          aria-hidden="true"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
        />

        {/* Step 1 */}
        <div className="fstep" hidden={step !== 0}>
          <div className="f2">
            <Field name="full_name" errors={errors}>
              <label htmlFor="f-name">
                Full name<Req />
              </label>
              <input id="f-name" autoComplete="name" {...bind("full_name")} />
            </Field>
            <Field name="email" errors={errors}>
              <label htmlFor="f-email">
                Email<Req />
              </label>
              <input id="f-email" type="email" autoComplete="email" {...bind("email")} />
            </Field>
          </div>
          <Field name="phone" errors={errors}>
            <label htmlFor="f-phone">
              Phone / WhatsApp<Req />
            </label>
            <div className="phone-row">
              <select id="f-cc" aria-label="Country code" {...bind("phone_cc")}>
                {COUNTRY_CODES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <input id="f-phone" type="tel" autoComplete="tel-national" placeholder="71 123 456" {...bind("phone")} />
            </div>
          </Field>
          <div className="f2">
            <Field name="location" errors={errors}>
              <label htmlFor="f-loc">City and country</label>
              <input id="f-loc" placeholder="Beirut, Lebanon" {...bind("location")} />
            </Field>
            <Field name="linkedin_url" errors={errors}>
              <label htmlFor="f-li">LinkedIn profile</label>
              <input id="f-li" type="url" placeholder="https://linkedin.com/in/…" {...bind("linkedin_url")} />
            </Field>
          </div>
          <Field name="founder_type" errors={errors}>
            <span className="lbl">
              I am a<Req />
            </span>
            <div className="chips">
              {FOUNDER_TYPES.map((f) => (
                <label key={f.value} htmlFor={`ft-${f.value}`}>
                  <input type="radio" id={`ft-${f.value}`} {...radio("founder_type", f.value)} /> {f.label}
                </label>
              ))}
            </div>
          </Field>
          <div className="f2" hidden={v.founder_type !== "student"}>
            <Field name="university" errors={errors}>
              <label htmlFor="f-uni">
                University<Req />
              </label>
              <input id="f-uni" placeholder="Your university" {...bind("university")} />
            </Field>
            <Field name="grad_year" errors={errors}>
              <label htmlFor="f-grad">
                Graduation year<Req />
              </label>
              <select id="f-grad" {...bind("grad_year")}>
                <option value="">Select…</option>
                {GRAD_YEARS.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        {/* Step 2 */}
        <div className="fstep" hidden={step !== 1}>
          <Field name="team_type" errors={errors}>
            <span className="lbl">
              Founding team<Req />
            </span>
            <div className="seg">
              <label htmlFor="tt-solo">
                <input type="radio" id="tt-solo" {...radio("team_type", "solo")} onChange={() => chooseTeam("solo")} />{" "}
                Solo founder
              </label>
              <label htmlFor="tt-team">
                <input type="radio" id="tt-team" {...radio("team_type", "team")} onChange={() => chooseTeam("team")} /> A
                team
              </label>
            </div>
          </Field>
          <div hidden={v.team_type !== "team"}>
            <div style={{ display: "grid", gap: 10 }}>
              {cofs.map((c, k) => (
                <div className="cof" key={c.key}>
                  <div className="cof-head">
                    <b>Co-founder {k + 1}</b>
                    <button type="button" className="linkbtn" onClick={() => setCofs((s) => s.filter((x) => x.key !== c.key))}>
                      Remove
                    </button>
                  </div>
                  <div className="f3">
                    <Field name={`cof-${c.key}-name`} errors={errors}>
                      <label htmlFor={`c${c.key}-n`}>
                        Name<Req />
                      </label>
                      <input id={`c${c.key}-n`} value={c.name} onChange={(e) => setCof(c.key, "name", e.target.value)} />
                    </Field>
                    <Field name={`cof-${c.key}-role`} errors={errors}>
                      <label htmlFor={`c${c.key}-r`}>
                        Role<Req />
                      </label>
                      <input
                        id={`c${c.key}-r`}
                        placeholder="e.g. CTO"
                        value={c.role}
                        onChange={(e) => setCof(c.key, "role", e.target.value)}
                      />
                    </Field>
                    <Field name={`cof-${c.key}-email`} errors={errors}>
                      <label htmlFor={`c${c.key}-e`}>Email</label>
                      <input
                        id={`c${c.key}-e`}
                        type="email"
                        value={c.email}
                        onChange={(e) => setCof(c.key, "email", e.target.value)}
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="linkbtn"
              style={{ marginTop: 10 }}
              hidden={cofs.length >= MAX_COFOUNDERS}
              onClick={addCof}
            >
              + Add co-founder
            </button>
            <p className="hint" style={{ marginTop: 6 }}>
              Up to 3 co-founders. Name and role are enough; email is optional.
            </p>
          </div>
          <Field name="full_time" errors={errors}>
            <span className="lbl">
              Is anyone working on this full-time?<Req />
            </span>
            <div className="seg">
              <label htmlFor="fu-yes">
                <input type="radio" id="fu-yes" {...radio("full_time", "yes")} /> Yes
              </label>
              <label htmlFor="fu-no">
                <input type="radio" id="fu-no" {...radio("full_time", "no")} /> Not yet
              </label>
            </div>
          </Field>
        </div>

        {/* Step 3 */}
        <div className="fstep" hidden={step !== 2}>
          <Field name="startup_name" errors={errors}>
            <label htmlFor="f-startup">
              Startup name<Req />
            </label>
            <input id="f-startup" {...bind("startup_name")} />
          </Field>
          <Field name="one_liner" errors={errors}>
            <label htmlFor="f-oneliner">
              One-liner<Req />
            </label>
            <input
              id="f-oneliner"
              maxLength={140}
              placeholder="We help [who] do [what] by [how]"
              {...bind("one_liner")}
            />
            <Counter value={v.one_liner} max={140} />
          </Field>
          <div className="f2">
            <Field name="sector" errors={errors}>
              <label htmlFor="f-sector">
                Sector<Req />
              </label>
              <select id="f-sector" {...bind("sector")}>
                <option value="">Select…</option>
                {SECTORS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field name="stage" errors={errors}>
              <label htmlFor="f-stage">
                Stage<Req />
              </label>
              <select id="f-stage" {...bind("stage")}>
                <option value="">Select…</option>
                {STAGES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field name="problem" errors={errors}>
            <label htmlFor="f-problem">
              The problem, and who has it<Req />
            </label>
            <textarea id="f-problem" maxLength={600} {...bind("problem")} />
            <Counter value={v.problem} max={600} />
          </Field>
          <Field name="solution" errors={errors}>
            <label htmlFor="f-solution">
              Your solution<Req />
            </label>
            <textarea id="f-solution" maxLength={600} {...bind("solution")} />
            <Counter value={v.solution} max={600} />
          </Field>
          <Field name="traction" errors={errors}>
            <label htmlFor="f-traction">Traction so far</label>
            <textarea
              id="f-traction"
              maxLength={600}
              placeholder="Users, revenue, pilots, waitlist, anything that shows momentum"
              {...bind("traction")}
            />
          </Field>
          <Field name="website_url" errors={errors}>
            <label htmlFor="f-web">Website or demo link</label>
            <input id="f-web" type="url" placeholder="https://" {...bind("website_url")} />
          </Field>
          <Field name="deck" errors={errors}>
            <span className="lbl">Pitch deck</span>
            <input
              ref={deckInput}
              type="file"
              id="f-deck"
              accept=".pdf,.ppt,.pptx,.key,application/pdf"
              hidden
              onChange={(e) => takeFile(e.target.files?.[0])}
            />
            <label
              className={"drop" + (dragOver ? " over" : "")}
              htmlFor="f-deck"
              tabIndex={0}
              hidden={deck !== null}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  deckInput.current?.click();
                }
              }}
              onDragEnter={onDrag(true)}
              onDragOver={onDrag(true)}
              onDragLeave={onDrag(false)}
              onDrop={(e) => {
                onDrag(false)(e);
                takeFile(e.dataTransfer.files[0]);
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <b>Drop your deck here, or click to browse</b>
              <span>PDF, PPTX or Keynote · up to 15 MB</span>
            </label>
            <div className="file-chip" hidden={deck === null}>
              <span>
                {deck && (
                  <>
                    <span>{deck.name}</span>
                    <small>{fmt(deck.size)}</small>
                  </>
                )}
              </span>
              <button type="button" className="linkbtn" onClick={removeDeck}>
                Remove
              </button>
            </div>
          </Field>
          <Field name="raised_before" errors={errors}>
            <span className="lbl">
              Have you raised money before?<Req />
            </span>
            <div className="seg">
              <label htmlFor="rb-no">
                <input type="radio" id="rb-no" {...radio("raised_before", "no")} /> No
              </label>
              <label htmlFor="rb-yes">
                <input type="radio" id="rb-yes" {...radio("raised_before", "yes")} /> Yes
              </label>
            </div>
          </Field>
          <Field name="raised_details" errors={errors} hidden={v.raised_before !== "yes"}>
            <label htmlFor="f-raised">
              How much, and from whom?<Req />
            </label>
            <input
              id="f-raised"
              maxLength={300}
              placeholder="e.g. $20k from friends and family"
              {...bind("raised_details")}
            />
          </Field>
        </div>

        {/* Step 4 */}
        <div className="fstep" hidden={step !== 3}>
          <Field name="needs" errors={errors}>
            <span className="lbl">
              What do you need most?<Req />
            </span>
            <div className="chips">
              {NEEDS.map((n) => (
                <label key={n.value} htmlFor={`nd-${n.value}`}>
                  <input
                    type="checkbox"
                    id={`nd-${n.value}`}
                    name="needs"
                    value={n.value}
                    checked={needs.includes(n.value)}
                    onChange={(e) => {
                      setNeeds((s) => (e.target.checked ? [...s, n.value] : s.filter((x) => x !== n.value)));
                      setErrors((er) => without(er, "needs"));
                    }}
                  />{" "}
                  {n.label}
                </label>
              ))}
            </div>
          </Field>
          <Field name="heard_from" errors={errors}>
            <label htmlFor="f-heard">
              How did you hear about Ryse?<Req />
            </label>
            <select id="f-heard" {...bind("heard_from")}>
              <option value="">Select…</option>
              {HEARD_FROM.map((h) => (
                <option key={h.value} value={h.value}>
                  {h.label}
                </option>
              ))}
            </select>
          </Field>
          <p className="hint" hidden={!v.campaign_code}>
            Applying through campaign {v.campaign_code}.
          </p>
          <Field name="consent" errors={errors}>
            <label className="check" htmlFor="f-consent">
              <input
                type="checkbox"
                id="f-consent"
                name="consent"
                value="yes"
                checked={consent}
                onChange={(e) => {
                  setConsent(e.target.checked);
                  setErrors((er) => without(er, "consent"));
                }}
              />{" "}
              <span>
                I agree that Ryse stores my application to evaluate it, as described in the privacy policy. My
                application is seen only by the Ryse partners.
              </span>
            </label>
          </Field>
        </div>

        {sendError && (
          <p className="form-error" role="alert">
            {sendError}
          </p>
        )}
        <div className="nav-row">
          <button
            type="button"
            className="btn btn-outline"
            hidden={step === 0}
            onClick={() => {
              setStep(step - 1);
              scrollToForm();
            }}
          >
            Back
          </button>
          <span></span>
          <button type="button" className="btn btn-primary" onClick={next} disabled={sending}>
            <span className="dot"></span>
            {last ? (sending ? "Submitting…" : "Submit application") : "Continue"}
          </button>
        </div>
      </form>

      <div className="done-card" ref={doneRef} hidden={done === null}>
        <span className="tick">
          <svg viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
        <h3>Application received</h3>
        <p style={{ color: "var(--muted)" }}>Your reference number</p>
        <div className="refno">{done?.refNo}</div>
        <ol>
          <li>The partners review your application personally.</li>
          <li>If you&apos;re shortlisted, we invite you to pitch in person.</li>
          <li>You get a clear answer promptly after your pitch.</li>
        </ol>
        <p className="hint">
          A confirmation email is on its way to <b>{done?.email}</b>.
        </p>
        <button type="button" className="btn btn-outline" onClick={again}>
          Submit another application
        </button>
      </div>
    </div>
  );
}
