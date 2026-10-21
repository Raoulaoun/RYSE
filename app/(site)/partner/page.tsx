import type { Metadata } from "next";
import { CopyEmail } from "@/components/CopyButton";
import { PartnerForm } from "@/components/PartnerForm";
import { ApplyFooter } from "@/components/SiteFooter";
import { ApplyHeader } from "@/components/SiteHeader";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Partner with Ryse",
  description:
    "For universities, co-investors, corporates and mentors who want to help founders move faster. The partners reply within three working days.",
};

export default function PartnerPage() {
  return (
    <>
      <ApplyHeader />
      <main className="apage">
        <div className="wrap apage-grid">
          <aside className="aside-card">
            <div>
              <span className="eyebrow">Partner inquiry</span>
              <h1 style={{ marginTop: 14 }}>Partner with Ryse</h1>
            </div>
            <p>
              For universities, co-investors, corporates and mentors who want to help founders move faster. The partners
              reply within three working days.
            </p>
            <ul className="aside-lines">
              <li><b>Universities:</b> host a Ryse campaign on campus.</li>
              <li><b>Co-investors:</b> join our pitch days and invest alongside us.</li>
              <li><b>Corporates and mentors:</b> sponsor, mentor or bring a real problem to solve.</li>
            </ul>
            <div className="contact">
              <div>
                <small>Questions</small>
                <CopyEmail email={SITE.email} />
              </div>
            </div>
          </aside>
          <PartnerForm />
        </div>
      </main>
      <ApplyFooter />
    </>
  );
}
