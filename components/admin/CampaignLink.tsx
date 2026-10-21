"use client";

import { useState } from "react";
import { CAMPAIGN_RE } from "@/lib/options";

// Builds the /apply?c=CODE link a campus campaign shares.
export function CampaignLink({ base }: { base: string }) {
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const clean = code.trim().toUpperCase();
  const valid = CAMPAIGN_RE.test(clean);
  const link = `${base}/apply?c=${clean}`;
  return (
    <section className="card pad-s" aria-labelledby="new-h">
      <h2 id="new-h" className="h2">
        New campaign link
      </h2>
      <span className="meta">
        Applications through this link are tagged with the code, and the form shows &ldquo;Applying through campaign …&rdquo;.
      </span>
      <div className="row-end">
        <label className="fld">
          Campaign code
          <input value={code} onChange={(e) => { setCode(e.target.value); setCopied(false); }} placeholder="e.g. AUB-SPRING27" maxLength={40} />
        </label>
        <button
          type="button"
          className="b b-dark"
          disabled={!valid}
          onClick={() => navigator.clipboard.writeText(link).then(() => setCopied(true))}
        >
          <span className="sq"></span>
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
      {code && (valid ? <code style={{ fontSize: 14, overflowWrap: "anywhere" }}>{link}</code> : <span className="err">Use 2 to 40 letters, numbers, - or _</span>)}
    </section>
  );
}
