import Link from "next/link";
import { LogoLockup } from "./Logo";
import { SITE } from "@/lib/site";

export function HomeFooter({ base = "" }: { base?: string }) {
  return (
    <footer>
      <div className="wrap">
        <div className="foot">
          <div>
            <a className="logo" href={base ? "/" : "#top"} aria-label="Ryse Venture">
              <LogoLockup />
            </a>
            <p>Where bold ideas RYSE.</p>
          </div>
          <div>
            <h4>Ryse</h4>
            <ul>
              <li><a href={`${base}#about`}>About</a></li>
              <li><a href={`${base}#thesis`}>Thesis</a></li>
              <li><a href={`${base}#approach`}>Approach</a></li>
              <li><a href={`${base}#leadership`}>Leadership</a></li>
              <li><a href={`${base}#portfolio`}>Portfolio</a></li>
            </ul>
          </div>
          <div>
            <h4>Founders</h4>
            <ul>
              <li><a href={`${base}#how`}>How it works</a></li>
              <li><a href={`${base}#who`}>Who can apply</a></li>
              <li><a href={`${base}#faq`}>FAQ</a></li>
              <li><Link href="/apply">Apply</Link></li>
              <li><Link href="/partner">Partner with us</Link></li>
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
