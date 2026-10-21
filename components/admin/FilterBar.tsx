"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

// Selects that re-run the page's GET query as soon as one changes.
export function FilterBar({ base, keep, children }: { base: string; keep: Record<string, string>; children: ReactNode }) {
  const router = useRouter();
  return (
    <form
      className="filters"
      action={base}
      onChange={(e) => {
        const form = e.currentTarget;
        const p = new URLSearchParams();
        for (const [k, v] of Object.entries(keep)) if (v) p.set(k, v);
        for (const [k, v] of new FormData(form).entries()) if (v) p.set(k, String(v));
        router.push(base + (p.size ? `?${p}` : ""));
      }}
    >
      {children}
      <noscript>
        <button type="submit" className="b b-light b-xs">
          Apply
        </button>
      </noscript>
    </form>
  );
}
