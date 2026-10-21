"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/Logo";
import { signOut } from "@/app/admin/actions";

type Props = { name: string; initials: string; newApps: number; newInquiries: number };

export function Sidebar({ name, initials, newApps, newInquiries }: Props) {
  const path = usePathname();
  const links = [
    { href: "/admin", label: "Dashboard", on: path === "/admin" },
    { href: "/admin/applications", label: "Applications", on: path.startsWith("/admin/applications"), badge: newApps },
    { href: "/admin/pipeline", label: "Pipeline", on: path.startsWith("/admin/pipeline") },
    { href: "/admin/partners", label: "Partner inquiries", on: path.startsWith("/admin/partners"), badge: newInquiries, dim: true },
    { href: "/admin/campaigns", label: "Campaigns", on: path.startsWith("/admin/campaigns") },
    { href: "/admin/settings", label: "Settings", on: path.startsWith("/admin/settings") },
  ];
  return (
    <nav className="adm-nav" aria-label="Admin">
      <Link href="/admin" className="logo-link">
        <Wordmark className="adm-logo" />
      </Link>
      <div className="adm-links">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className={"adm-link" + (l.on ? " on" : "")} aria-current={l.on ? "page" : undefined}>
            <span className="lbl">
              {l.on && <span className="sq"></span>}
              {l.label}
            </span>
            {l.badge ? <span className={"adm-badge" + (l.dim ? " dim" : "")}>{l.badge}</span> : null}
          </Link>
        ))}
      </div>
      <div className="adm-me">
        <span className="av">{initials}</span>
        <div className="who">
          <span className="name">{name}</span>
          <form action={signOut}>
            <button type="submit">Sign out</button>
          </form>
        </div>
      </div>
    </nav>
  );
}
