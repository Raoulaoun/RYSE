import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconCircle } from "@/components/Icon";
import { HomeFooter } from "@/components/SiteFooter";
import { HomeHeader } from "@/components/SiteHeader";
import { PORTFOLIO } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return PORTFOLIO.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = PORTFOLIO.find((x) => x.slug === slug);
  return c ? { title: `${c.name} · Ryse portfolio`, description: c.overview } : {};
}

export default async function CompanyPage({ params }: Props) {
  const { slug } = await params;
  const i = PORTFOLIO.findIndex((c) => c.slug === slug);
  if (i < 0) notFound();
  const c = PORTFOLIO[i];
  const prev = PORTFOLIO[(i - 1 + PORTFOLIO.length) % PORTFOLIO.length];
  const next = PORTFOLIO[(i + 1) % PORTFOLIO.length];

  return (
    <>
      <HomeHeader base="/" />
      <main className="co-page" id="top">
        <div className="wrap">
          <div className="co-page-grid">
            {c.image ? (
              <div className="co-page-img real">
                <Image
                  src={c.image.src}
                  alt={`${c.name} in pictures`}
                  width={c.image.width}
                  height={c.image.height}
                  sizes="(min-width: 980px) 520px, 100vw"
                  preload
                />
              </div>
            ) : (
              <div className="co-page-img ph">
                <span className="ph-label">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  {c.name} image
                </span>
              </div>
            )}

            <div className="co-page-body">
              <div>
                <span className="eyebrow">Portfolio / {String(i + 1).padStart(2, "0")}</span>
                <h1>{c.name}</h1>
                <p className="where">{c.where}</p>
              </div>

              <div className="co-id">
                <span className="card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/images/logos/${c.logo}.png`} alt={`${c.name} logo`} />
                </span>
                <span className="sector-pill">{c.sector}</span>
                {c.exited && <span className="pill-exited">Exited</span>}
              </div>

              <div className="co-block">
                <h2>Company overview</h2>
                <p>{c.overview}</p>
              </div>

              <div className="co-block">
                <h2>Key highlights</h2>
                <ul className="highlights">
                  {c.highlights.map((h) => (
                    <li key={h}>
                      <IconCircle name="check" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="co-block">
                <h2>Partner&apos;s role &amp; contributions</h2>
                <p className="role-line">{c.role}</p>
              </div>

              <div className="co-block">
                <h2>Commercial impact</h2>
                <div className="tiles three">
                  {c.impact.map((s) => (
                    <div className={"tile" + (c.lightStats ? " light" : "")} key={s.label}>
                      <b>{s.value}</b>
                      <span>{s.label}</span>
                    </div>
                  ))}
                </div>
                {c.footnotes && (
                  <div className="footnotes">
                    {c.footnotes.map((f) => (
                      <span key={f}>{f}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <nav className="co-nav" aria-label="Portfolio">
            <Link href={`/portfolio/${prev.slug}`}>
              <small>← Previous</small>
              <b>{prev.name}</b>
            </Link>
            <Link href="/#portfolio" className="back">
              Back to portfolio
            </Link>
            <Link href={`/portfolio/${next.slug}`} className="fwd">
              <small>Next →</small>
              <b>{next.name}</b>
            </Link>
          </nav>
        </div>
      </main>
      <HomeFooter base="/" />
    </>
  );
}
