import type { Metadata } from "next";
import { ApplicationForm } from "@/components/ApplicationForm";
import { CopyEmail } from "@/components/CopyButton";
import { ApplyFooter } from "@/components/SiteFooter";
import { ApplyHeader } from "@/components/SiteHeader";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Apply to Ryse",
  description: "Tell us who you are and what you're building. It takes about five minutes.",
};

export default function ApplyPage() {
  return (
    <>
      <ApplyHeader />
      <main className="apage">
        <div className="wrap apage-grid">
          <aside className="aside-card">
            <div>
              <span className="eyebrow">Founder application</span>
              <h1 style={{ marginTop: 14 }}>
                Building something? <span>Pitch it.</span>
              </h1>
            </div>
            <p>
              Tell us who you are and what you&apos;re building. It takes about five minutes, and the partners read every
              application themselves.
            </p>
            <ol className="next">
              <li><div><b>Apply</b><span>Four short steps. Add your deck if you have one.</span></div></li>
              <li><div><b>Screening</b><span>The three partners review your application.</span></div></li>
              <li><div><b>Pitch meeting</b><span>Shortlisted founders pitch to the partners in person.</span></div></li>
              <li><div><b>Decision</b><span>A clear answer, promptly, with honest feedback.</span></div></li>
            </ol>
            <div className="contact">
              <div>
                <small>Questions</small>
                <CopyEmail email={SITE.email} />
              </div>
            </div>
          </aside>
          <ApplicationForm />
        </div>
      </main>
      <ApplyFooter />
    </>
  );
}
