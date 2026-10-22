import Image from "next/image";
import Link from "next/link";
import { CopyEmail } from "@/components/CopyButton";
import { IconCircle } from "@/components/Icon";
import { HomeFooter } from "@/components/SiteFooter";
import { HomeHeader } from "@/components/SiteHeader";
import {
  APPROACH,
  FAQ,
  HEADLINE_STATS,
  LOGO_STRIP,
  PARTNERS,
  PHILOSOPHY,
  PORTFOLIO,
  ROUTES,
  STEPS,
  THESIS,
  WHO,
} from "@/lib/content";
import { APPLY_HREF, FORMS_ON } from "@/lib/links";
import { SITE } from "@/lib/site";

function Tiles() {
  return (
    <div className="tiles">
      {HEADLINE_STATS.map((s) => (
        <div className="tile" key={s.value}>
          <b>{s.value}</b>
          <span>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <HomeHeader />
      <main id="top">
        {/* HERO */}
        <section className="hero">
          <div className="wrap">
            <div className="band">
              <div className="band-media">
                <Image
                  src="/images/hero.jpg"
                  alt="Founders talking on a Beirut rooftop at golden hour"
                  width={1600}
                  height={685}
                  sizes="(min-width: 1200px) 1136px, 100vw"
                  preload
                  style={{ objectPosition: "50% 30%" }}
                />
              </div>
              <div className="band-content">
                <div>
                  <span className="eyebrow">Incubator · Lebanon &amp; the region</span>
                  <h1>
                    Where Bold Ideas
                    <br />
                    <em>RYSE</em>
                  </h1>
                  <p className="lede">An incubator for early-stage startups</p>
                  <div className="ctas">
                    <a className="btn btn-signal" href={APPLY_HREF}>
                      Apply to Ryse
                    </a>
                    <a className="btn btn-glass" href="#how">
                      How it works
                    </a>
                  </div>
                </div>
                <div className="hstats">
                  {HEADLINE_STATS.map((s, i) => (
                    <div className={"hstat" + (i === 0 ? " lime" : "")} key={s.value}>
                      <b>{s.value}</b>
                      <span>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LOGO STRIP */}
        <div className="strip">
          <div className="wrap">
            <p>Companies built and backed by the Ryse partners</p>
            <div className="logos">
              {LOGO_STRIP.map((l) => (
                <div className="logo-slot" key={l.src}>
                  {/* Logos keep their intrinsic aspect ratio; plain img avoids fixed dimensions. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/images/logos/${l.src}.png`} alt={l.name} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* OUR BELIEF */}
        <section id="about">
          <div className="wrap belief-grid">
            <div className="belief-text">
              <span className="eyebrow">Our belief</span>
              <h2>Turn today&apos;s boldest founders into tomorrow&apos;s industry leaders</h2>
              <p>
                Starting a business takes courage. Building it takes the right people around you. At RYSE, founders gain
                access to a team of entrepreneurs, operators, and specialists who help turn bold ideas into businesses
                built to grow.
              </p>
              <Tiles />
            </div>
            <div className="ph">
              <Image
                className="fill"
                src="/images/about.jpg"
                alt="The partners working through a plan with a founding team"
                fill
                sizes="(min-width: 980px) 560px, 100vw"
              />
            </div>
          </div>
        </section>

        {/* OUR THESIS */}
        <section id="thesis" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">Our thesis</span>
              <h2>What we believe about early-stage investing</h2>
            </div>
            <div className="thesis-cards">
              {THESIS.map((t) => (
                <div className="thesis-card card-soft" key={t.title}>
                  <IconCircle name={t.icon} />
                  <h3>{t.title}</h3>
                  <p>{t.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* OUR PHILOSOPHY */}
        <section id="philosophy" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">Our philosophy</span>
              <h2>Capital is where our support starts but not where it ends</h2>
            </div>
            <div className="ben-grid">
              {PHILOSOPHY.map((b) => (
                <article className="ben card-soft" key={b.title}>
                  <div className="ph">
                    <Image
                      className="fill"
                      src={b.img}
                      alt={b.alt}
                      fill
                      sizes="(min-width: 900px) 380px, 100vw"
                      style={{ objectPosition: b.pos }}
                    />
                    <IconCircle name={b.icon} />
                  </div>
                  <div className="ben-body">
                    <h3>{b.title}</h3>
                    <p>{b.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* OUR APPROACH */}
        <section id="approach" className="ink-band">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">Our approach</span>
              <h2>How we work with founders</h2>
            </div>
            <ol className="approach">
              {APPROACH.map((a, i) => (
                <li key={a.title}>
                  <IconCircle name={a.icon} />
                  <span className="n">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{a.title}</h3>
                  <p>{a.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* LEADERSHIP */}
        <section id="leadership" className="ink-band" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="leaders-head" />
            <div className="sec-head">
              <span className="eyebrow">Leadership</span>
              <h2>Built by founders, for founders</h2>
              <p>
                Ryse is led by three partners who have founded businesses, achieved successful exits, and advised some of
                the region&apos;s largest organizations and government ministries on strategy and growth.
              </p>
            </div>
            <div className="leaders">
              {PARTNERS.map((p) => (
                <div className="leader" key={p.slug}>
                  <span className="ring">
                    <Image src={p.photo} alt={`Portrait of ${p.name}`} width={168} height={168} sizes="168px" />
                  </span>
                  <h3>{p.name}</h3>
                  <span className="role">Managing partner</span>
                  <p>{p.summary}</p>
                  <a href={`#bio-${p.slug}`}>Read bio</a>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section aria-label="Partner profiles">
          <div className="wrap profiles">
            {PARTNERS.map((p, i) => (
              <article className={"profile" + (i % 2 ? " flip" : "")} id={`bio-${p.slug}`} key={p.slug}>
                <div className="profile-img">
                  <Image
                    src={p.profilePhoto}
                    alt={`Portrait of ${p.name}`}
                    fill
                    sizes="(min-width: 980px) 480px, 100vw"
                  />
                </div>
                <div className="profile-body">
                  <div className="profile-top">
                    <span className="eyebrow">Managing partner</span>
                    <div className="profile-logos">
                      {p.logos.map((l) => (
                        <span key={l.src}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={`/images/logos/${l.src}.png`} alt={l.name} loading="lazy" />
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h2>{p.name}</h2>
                    <p className="title">{p.title}</p>
                  </div>
                  <ul className="chips-list">
                    {p.chips.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                  <p>{p.bio[0]}</p>
                  <p>{p.bio[1]}</p>
                  <div className="program">
                    <small>In the program</small>
                    <p>{p.program}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* PORTFOLIO */}
        <section id="portfolio" className="soft">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">Portfolio</span>
              <h2>Companies we&apos;ve built and backed</h2>
              <p>
                Startups and businesses the Ryse team has founded, run or backed across finance, healthcare, technology,
                hospitality, entertainment and real estate. The same playbook now goes to every founder we back.
              </p>
            </div>
            <div className="port-grid">
              {PORTFOLIO.map((c) => (
                <Link className="co" href={`/portfolio/${c.slug}`} key={c.slug}>
                  <span className="co-logo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/images/logos/${c.logo}.png`} alt="" loading="lazy" />
                  </span>
                  <span className="co-text">
                    <h3>{c.name}</h3>
                    <span className="sector">{c.sector}</span>
                    {c.exited && <span className="pill-exited">Exited</span>}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">How it works</span>
              <h2>From application to decision, in four steps</h2>
              <p>A simple process with no committees and no months of waiting.</p>
            </div>
            <ol className="timeline">
              {STEPS.map((s, i) => (
                <li key={s.title}>
                  <span className="num">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                  <span className="when">{s.when}</span>
                </li>
              ))}
            </ol>
            <div className="routes">
              {ROUTES.map((r) => (
                <article className="route card-soft" key={r.tag}>
                  <IconCircle name={r.icon} />
                  <div className="route-body">
                    <small>{r.tag}</small>
                    <h3>{r.title}</h3>
                    <p>{r.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* WHO CAN APPLY */}
        <section className="who soft" id="who">
          <div className="who-grid">
            <div className="who-img">
              <Image
                src="/images/hero.jpg"
                alt="Two founders talking on a Beirut rooftop"
                fill
                sizes="(min-width: 980px) 50vw, 100vw"
              />
            </div>
            <div className="who-text">
              <span className="eyebrow">Who can apply</span>
              <h2>Open to every founder</h2>
              <p>
                No degree, age or sector requirements. If you&apos;re building something and ready to execute, we want to
                hear from you.
              </p>
              <ul className="who-list">
                {WHO.map((w) => (
                  <li key={w.title}>
                    <IconCircle name={w.icon} size="s" />
                    <div>
                      <b>{w.title}</b>
                      <span>{w.body}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq">
          <div className="wrap faq-grid">
            <div className="sec-head" style={{ marginBottom: 0 }}>
              <span className="eyebrow">FAQ</span>
              <h2>Frequently asked questions</h2>
              <p>Can&apos;t find your answer? Write to {SITE.email}.</p>
            </div>
            <div>
              {FAQ.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* APPLY */}
        <section className="apply" id="apply">
          <div className="wrap">
            <div className="apply-band">
              <div>
                <span className="eyebrow" style={{ color: "var(--signal)" }}>
                  Apply
                </span>
                <h2>
                  Building something? <span>Pitch it.</span>
                </h2>
                <p className="lede">
                  Applications are open all year. The partners read every one, and you hear back within 48 hours of your
                  pitch.
                </p>
                <div className="ctas" style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 30 }}>
                  <a className="btn btn-signal" href={APPLY_HREF}>
                    {FORMS_ON ? `Apply at ${SITE.domain}` : `Email your pitch to ${SITE.email}`}
                  </a>
                </div>
              </div>
              <div className="big48" aria-label="48 hours to hear back">
                <b>48h</b>
                <span>TO HEAR BACK</span>
              </div>
            </div>
            <div className="apply-foot">
              <div className="contact">
                <div>
                  <small>Email</small>
                  <CopyEmail email={SITE.email} />
                </div>
                <div>
                  <small>Website</small>
                  <span>{SITE.domain}</span>
                </div>
                <div>
                  <small>Based in</small>
                  <span>{SITE.city}</span>
                </div>
              </div>
              <div className="team-row" aria-label="Managing partners">
                {PARTNERS.map((p) => (
                  <div key={p.slug}>
                    <Image src={p.photo} alt="" width={48} height={48} sizes="48px" />
                    <span>
                      <b>{p.name}</b>
                      <span>Managing partner</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <HomeFooter />
    </>
  );
}
