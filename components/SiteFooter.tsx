import Link from "next/link";
import { LogoLockup } from "./Logo";
import { SITE } from "@/lib/site";

export function HomeFooter() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot">
          <div>
            <a className="logo" href="#top" aria-label="Ryse Venture">
              <LogoLockup />
            </a>
            <p>We back founders before the world notices.</p>
          </div>
          <div>
            <h4>Ryse</h4>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#thesis">Thesis</a></li>
              <li><a href="#partners">Partners</a></li>
              <li><a href="#portfolio">Portfolio</a></li>
            </ul>
          </div>
          <div>
            <h4>Founders</h4>
            <ul>
              <li><a href="#how">How it works</a></li>
              <li><a href="#get">What you get</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><Link href="/apply">Apply</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li>{SITE.email}</li>
              <li>{SITE.domain}</li>
              <li>{SITE.city}</li>
            </ul>
          </div>
        </div>
        <div className="legal">
          <span>© {SITE.year} Ryse. All rights reserved.</span>
          <span>{SITE.domain}</span>
        </div>
      </div>
    </footer>
  );
}

export function ApplyFooter() {
  return (
    <footer>
      <div className="wrap">
        <div className="legal">
          <span>© {SITE.year} Ryse. All rights reserved.</span>
          <Link href="/" style={{ textDecoration: "none" }}>
            {SITE.domain}
          </Link>
        </div>
      </div>
    </footer>
  );
}
