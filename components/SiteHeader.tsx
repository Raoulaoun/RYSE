import Link from "next/link";
import { APPLY_HREF } from "@/lib/links";
import { LogoMark } from "./Logo";

const NAV = [
  { href: "#about", label: "About" },
  { href: "#approach", label: "Approach" },
  { href: "#leadership", label: "Leadership" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#how", label: "How it works" },
  { href: "#faq", label: "FAQ" },
];

/** Main header. On pages other than the home page, `base="/"` points the anchors home. */
export function HomeHeader({ base = "" }: { base?: string }) {
  return (
    <header className="top">
      <div className="wrap">
        <a className="logo" href={base ? "/" : "#top"} aria-label="Ryse Venture home">
          <LogoMark />
        </a>
        <nav className="links" aria-label="Sections">
          {NAV.map((n) => (
            <a key={n.href} href={base + n.href}>
              {n.label}
            </a>
          ))}
        </nav>
        <a className="btn btn-primary" href={APPLY_HREF}>
          <span className="dot"></span>Apply
        </a>
      </div>
    </header>
  );
}

export function ApplyHeader() {
  return (
    <header className="top">
      <div className="wrap">
        <Link className="logo" href="/" aria-label="Ryse Venture home">
          <LogoMark />
        </Link>
        <Link className="back-link" href="/">
          ← Back to ryseventure.com
        </Link>
      </div>
    </header>
  );
}
