import Link from "next/link";
import { LogoMark } from "./Logo";

const NAV = [
  { href: "#about", label: "About" },
  { href: "#how", label: "How it works" },
  { href: "#get", label: "For founders" },
  { href: "#partners", label: "Partners" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#faq", label: "FAQ" },
];

export function HomeHeader() {
  return (
    <header className="top">
      <div className="wrap">
        <a className="logo" href="#top" aria-label="Ryse Venture home">
          <LogoMark />
        </a>
        <nav className="links" aria-label="Sections">
          {NAV.map((n) => (
            <a key={n.href} href={n.href}>
              {n.label}
            </a>
          ))}
        </nav>
        <Link className="btn btn-primary" href="/apply">
          <span className="dot"></span>Apply
        </Link>
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
