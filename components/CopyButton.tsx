"use client";

import { useRef, useState } from "react";

export function CopyEmail({ email }: { email: string }) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [copied, setCopied] = useState(false);

  // Falls back to selecting the text so it can be copied by hand.
  function selectIt() {
    const t = textRef.current;
    if (!t) return;
    const r = document.createRange();
    r.selectNodeContents(t);
    const s = window.getSelection();
    s?.removeAllRanges();
    s?.addRange(r);
  }

  function copy() {
    try {
      navigator.clipboard.writeText(email).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }, selectIt);
    } catch {
      selectIt();
    }
  }

  return (
    <>
      <span ref={textRef}>{email}</span>
      <button className="copy" type="button" onClick={copy}>
        {copied ? "Copied" : "Copy"}
      </button>
    </>
  );
}
