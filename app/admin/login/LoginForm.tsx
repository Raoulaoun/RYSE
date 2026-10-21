"use client";

import { useActionState } from "react";
import { requestLink, type LoginState } from "./actions";

export function LoginForm({ expired }: { expired: boolean }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(requestLink, { sent: false, email: "" });

  if (state.sent) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <span className="tick">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0E0F0E" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
        <h1 className="h1">Check your inbox</h1>
        <p>
          If {state.email} has access, we sent it a sign-in link. It expires in 15 minutes.
        </p>
      </div>
    );
  }

  return (
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <h1 className="h1">Partner sign in</h1>
        <p>Enter your Ryse email and we&apos;ll send you a sign-in link. Access is by invitation only.</p>
      </div>
      {expired && <p className="err">That sign-in link has expired or was already used. Request a new one.</p>}
      <label htmlFor="login-email">
        Email
        <input id="login-email" name="email" type="email" autoComplete="email" required defaultValue={state.email} />
      </label>
      {state.error && <p className="err">{state.error}</p>}
      <button type="submit" className="go" disabled={pending}>
        {pending ? "Sending…" : "Send sign-in link"}
      </button>
    </form>
  );
}
