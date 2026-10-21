import Image from "next/image";
import Link from "next/link";
import { CopyEmail } from "@/components/CopyButton";
import { PartnerSection } from "@/components/PartnerSection";
import { HomeFooter } from "@/components/SiteFooter";
import { HomeHeader } from "@/components/SiteHeader";
import { SITE } from "@/lib/site";

const LOGOS = [
  { src: "multiflow", name: "Multiflow Trading" },
  { src: "beta-investment-group", name: "Beta Investment Group" },
  { src: "upwell", name: "Upwell" },
  { src: "kopibat", name: "Kopibat Real Estate" },
  { src: "beta-app", name: "Beta App" },
  { src: "myclinic", name: "MyClinic" },
  { src: "rinov8", name: "Rinov8 Group" },
  { src: "goldish", name: "Goldish" },
  { src: "virtual-universe", name: "Virtual Universe" },
  { src: "puravida", name: "Puravida" },
];

const STEPS = [
  {
    title: "Apply",
    body: "Submit your application online, or through a Ryse campaign at your university.",
    when: "Takes about 5 minutes",
  },
  {
    title: "Screening",
    body: "The three partners review every application themselves, against our investment thesis.",
    when: "Reviewed by the partners",
  },
  {
    title: "Pitch meeting",
    body: "Shortlisted founders present to the partners in person and answer their questions.",
    when: "Face to face",
  },
  {
    title: "Decision",
    body: "You receive a clear answer with honest feedback, whatever the outcome.",
    when: "Within 48 hours",
  },
];

const BENEFITS = [
  {
    img: "/images/benefit-capital.jpg",
    alt: "A handshake closing an investment",
    pos: "55% 50%",
    icon: (
      <svg viewBox="0 0 24 24">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    title: "Capital",
    body: "Financial support to build, test and reach first revenue, without waiting for traction you can't yet show.",
  },
  {
    img: "/images/benefit-strategy.jpg",
    alt: "A mentor walking a founder through a strategy board",
    pos: "68% 40%",
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
    title: "Strategy",
    body: "Direct guidance from three partners who have started, sold and advised companies across the region.",
  },
  {
    img: "/images/benefit-growth.jpg",
    alt: "A startup team reviewing growth on a screen",
    pos: "55% 40%",
    icon: (
      <svg viewBox="0 0 24 24">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    title: "Growth",
    body: "Hands-on support from Ryse's departments, so you never build brand, finance or product alone.",
  },
];

const DEPTS = [
  { name: "Strategy", body: "Business model, market entry, pricing and the plan to get there." },
  { name: "Growth & Brand", body: "Positioning, brand, launch and winning your first customers." },
  { name: "Finance & Legal", body: "Structure, cap table, financial models, contracts and compliance." },
  { name: "Product & Tech", body: "Product scoping, MVP decisions, tooling and technical hiring." },
];

const FOUNDER_TYPES = [
  { name: "Students", body: "Building alongside your studies" },
  { name: "Graduates", body: "Starting your first company" },
  { name: "Professionals", body: "Leaving a career to build" },
  { name: "Repeat founders", body: "Back for the next one" },
];

const BELIEFS = [
  { title: "Founders over pedigree", body: "We judge ambition, speed and execution, not CVs, degrees or connections." },
  { title: "Day zero is the best day", body: "The best moment to back someone is before the world notices." },
  {
    title: "Built under pressure",
    body: "Companies born in hard markets learn discipline early. We favor real revenue over endless burn.",
  },
  {
    title: "Local proof, regional scale",
    body: "Validate in Lebanon. Build for the GCC and the wider region from the start.",
  },
  {
    title: "More than a check",
    body: "Capital opens the door. Strategy and hands-on support are what move the needle.",
  },
  { title: "Speed is respect", body: "Founders hear back within 48 hours. Their time matters as much as ours." },
];

const VALUES = ["Founders first", "We show up", "Operators, not observers", "Built here, built to go further", "Straight talk"];

const PARTNERS = [
  {
    name: "Raoul Aoun",
    img: "/images/partners/raoul-aoun.jpg",
    bio: "Founder of Beta Investment Group, an independent investment firm started in 2021, where he is building the Beta App, an emerging investment technology. He has founded and invested in ventures across fintech, healthtech, procurement and consumer technology, including MyClinic, and puts his team to work alongside the founders he backs.",
    focus: "business strategy, go-to-market and getting a company off the ground.",
  },
  {
    name: "Roy Yammine",
    img: "/images/partners/roy-yammine.jpg",
    bio: "A strategy consultant with twelve years advising organizations across the Middle East on growth and transformation. He has built several startups, exiting some, and is a managing partner at Multiflow, a UAE building-materials business. He is developing Upwell, a functional-beverage brand.",
    focus: "whether a business works, from real demand to sound economics and execution.",
  },
  {
    name: "Bechara Koyess",
    img: "/images/partners/bechara-koyess.jpg",
    bio: "A strategy consultant with nine years across industry and consulting, focused on corporate strategy, transformation and operating-model design. Formerly with Strategy& in the Middle East, he holds an MBA from HEC Paris and degrees from AUB and USJ.",
    focus: "strategy, operating model and partnerships, turned into an actionable plan.",
  },
];

type Company = {
  logo: string;
  name: string;
  sector?: string;
  stage?: string;
  body?: string;
  partner?: string;
};

const PORTFOLIO: Company[] = [
  {
    logo: "multiflow",
    name: "Multiflow Trading",
    sector: "Building materials",
    stage: "Operating",
    body: "A building-materials business based in the UAE.",
    partner: "Roy Yammine",
  },
  {
    logo: "beta-investment-group",
    name: "Beta Investment Group",
    sector: "Investment",
    stage: "Since 2021",
    body: "Independent investment firm managing capital for high-net-worth investors.",
    partner: "Raoul Aoun",
  },
  {
    logo: "upwell",
    name: "Upwell",
    sector: "Beverages",
    stage: "In development",
    body: "A functional-beverage brand.",
    partner: "Roy Yammine",
  },
  { logo: "kopibat", name: "Kopibat Real Estate", sector: "Real estate" },
  {
    logo: "beta-app",
    name: "Beta App",
    sector: "FinTech",
    stage: "Launch",
    body: "Investment technology making smart investing simpler and more accessible.",
    partner: "Raoul Aoun",
  },
  {
    logo: "myclinic",
    name: "MyClinic",
    sector: "HealthTech",
    stage: "Live",
    body: "Clinic management software for practices in Lebanon and the region.",
    partner: "Raoul Aoun",
  },
  { logo: "rinov8", name: "Rinov8 Group" },
  { logo: "goldish", name: "Goldish" },
  { logo: "virtual-universe", name: "Virtual Universe" },
  { logo: "puravida", name: "Puravida" },
];

const FAQ = [
  {
    q: "Do I need to be a student to apply?",
    a: "No. Ryse is open to anyone building a company: students, graduates, professionals and repeat founders. Campus campaigns are one way in; applying online is the other.",
  },
  {
    q: "What stage should my startup be at?",
    a: "Any early stage, including an idea with a strong founder behind it. We care most about who you are, how fast you move, and whether the business can earn.",
  },
  {
    q: "Which sectors do you invest in?",
    a: "We're sector-agnostic. Our partners' experience spans finance, health, technology, real estate and consumer, so we can add value in most areas.",
  },
  {
    q: "How fast will I hear back?",
    a: "Within 48 hours of your in-person pitch, you receive a clear decision with honest feedback, whatever the answer.",
  },
  {
    q: "What support do I get after investment?",
    a: "Financial support plus hands-on work with the partners and the Ryse departments: strategy, growth and brand, finance and legal, and product and tech.",
  },
  {
    q: "Do you only back Lebanese companies?",
    a: "We validate in Lebanon and build for the GCC and the wider region. Founders based elsewhere in the region are welcome to apply.",
  },
];

// Placeholder-style image slot from the design (.ph), filled with a cover photo.
function Photo({ src, alt, pos, sizes }: { src: string; alt: string; pos: string; sizes: string }) {
  return (
    <div className="ph">
      <Image className="fill" src={src} alt={alt} fill sizes={sizes} style={{ objectPosition: pos }} />
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
                    We back founders before the world <em>notices.</em>
                  </h1>
                  <p className="lede">
                    Ryse invests early in ambitious founders, meets them in person, and decides within 48 hours. Every
                    company we back gets capital, strategic guidance and a team that works alongside it.
                  </p>
                  <div className="ctas">
                    <Link className="btn btn-signal" href="/apply">
                      Apply to Ryse
                    </Link>
                    <a className="btn btn-glass" href="#how">
                      How it works
                    </a>
                  </div>
                </div>
                <div className="hstats">
                  <div className="hstat lime"><b>48h</b><span>From pitch to decision</span></div>
                  <div className="hstat"><b>Day 0</b><span>We invest from the very start</span></div>
                  <div className="hstat"><b>3</b><span>Operator partners</span></div>
                  <div className="hstat"><b>4</b><span>Support departments</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LOGO STRIP */}
        <div className="strip">
          <div className="wrap">
            <p>Companies built by Ryse partners</p>
            <div className="logos">
              {LOGOS.map((l) => (
                <div className="logo-slot" key={l.src}>
                  {/* Logos keep their intrinsic aspect ratio; plain img avoids fixed dimensions. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/images/logos/${l.src}.png`} alt={l.name} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ABOUT */}
        <section id="about">
          <div className="wrap about-grid">
            <Photo
              src="/images/about.jpg"
              alt="The partners working through a plan with a founding team"
              pos="50% 50%"
              sizes="(min-width: 980px) 560px, 100vw"
            />
            <div className="about-text">
              <span className="eyebrow">About Ryse</span>
              <h2>An incubator run by people who have built companies</h2>
              <p>
                Talent is everywhere, but early backing is rare. Most capital waits for traction founders can&apos;t
                reach on their own, and most support stops at workshops. Ryse closes that gap.
              </p>
              <p>
                We are open to any founder with an idea worth backing. We screen every application ourselves, meet
                founders face to face, and put capital and our own operating teams behind the ones we believe in.
              </p>
              <div className="stats">
                <div className="stat"><b>Open</b><span>To founders of any background</span></div>
                <div className="stat"><b>Any sector</b><span>We back the founder first</span></div>
                <div className="stat"><b>In person</b><span>Every pitch is face to face</span></div>
                <div className="stat"><b>Hands-on</b><span>Support long after the check</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW */}
        <section id="how" className="soft">
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
              <article className="route">
                <Photo
                  src="/images/route-online.jpg"
                  alt="A founder working on his application at a laptop"
                  pos="50% 35%"
                  sizes="(min-width: 820px) 560px, 100vw"
                />
                <div className="route-body">
                  <small>Route A</small>
                  <h3>Apply online</h3>
                  <p>Open all year. Ideal for graduates, professionals and founders already building.</p>
                </div>
              </article>
              <article className="route">
                <Photo
                  src="/images/route-campus.jpg"
                  alt="A student presenting at a campus pitch day"
                  pos="50% 40%"
                  sizes="(min-width: 820px) 560px, 100vw"
                />
                <div className="route-body">
                  <small>Route B</small>
                  <h3>Apply through a campus campaign</h3>
                  <p>
                    Ryse runs campaigns with university entrepreneurship clubs. Look out for the next one on your
                    campus.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section id="get">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">For founders</span>
              <h2>Capital is where our support starts</h2>
              <p>Every company we back gets three kinds of support, plus access to the full Ryse team.</p>
            </div>
            <div className="ben-grid">
              {BENEFITS.map((b) => (
                <article className="ben" key={b.title}>
                  <Photo src={b.img} alt={b.alt} pos={b.pos} sizes="(min-width: 900px) 380px, 100vw" />
                  <div className="ben-body">
                    <span className="ic">{b.icon}</span>
                    <h3>{b.title}</h3>
                    <p>{b.body}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="depts">
              {DEPTS.map((d) => (
                <div className="dept" key={d.name}>
                  <small>Department</small>
                  <b>{d.name}</b>
                  <p>{d.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHO */}
        <section className="who soft" id="who">
          <div className="wrap who-grid">
            <div className="who-text">
              <span className="eyebrow">Who can apply</span>
              <h2>Open to every founder</h2>
              <p>
                No degree, age or sector requirements. If you&apos;re building something and ready to execute, we want
                to hear from you.
              </p>
              <div className="types">
                {FOUNDER_TYPES.map((t) => (
                  <div className="type" key={t.name}>
                    <b>{t.name}</b>
                    <span>{t.body}</span>
                  </div>
                ))}
              </div>
            </div>
            <Image
              className="who-img"
              src="/images/who.jpg"
              alt="A founder pitching her startup to investors in a bright Beirut meeting room"
              width={1500}
              height={1000}
              sizes="(min-width: 980px) 580px, 100vw"
            />
          </div>
        </section>

        {/* THESIS */}
        <section id="thesis">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">Our thesis</span>
              <h2>What we believe about early-stage investing</h2>
              <p>Great founders don&apos;t wait for permission. Neither do we.</p>
            </div>
            <div className="thesis-grid">
              {BELIEFS.map((b) => (
                <div className="belief" key={b.title}>
                  <h3>{b.title}</h3>
                  <p>{b.body}</p>
                </div>
              ))}
            </div>
            <div className="values">
              <small>Our values</small>
              {VALUES.map((v) => (
                <span className="value" key={v}>
                  {v}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* PARTNERS */}
        <section id="partners" className="soft">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">Leadership</span>
              <h2>The partners</h2>
              <p>
                Between them, the three partners have started companies, sold some of them, and advised many of the
                region&apos;s larger organizations on strategy and growth.
              </p>
            </div>
            <div className="partners-grid">
              {PARTNERS.map((p) => (
                <article className="partner" key={p.name}>
                  <Image
                    className="portrait"
                    src={p.img}
                    alt={`Portrait of ${p.name}`}
                    width={640}
                    height={800}
                    sizes="(min-width: 900px) 380px, 100vw"
                  />
                  <div>
                    <h3>{p.name}</h3>
                    <p className="p-role">Managing Partner · Entrepreneur &amp; Investor</p>
                  </div>
                  <p className="bio">{p.bio}</p>
                  <p className="p-focus">
                    <b>In the program:</b> {p.focus}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* PORTFOLIO */}
        <section id="portfolio">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">Portfolio</span>
              <h2>Companies our partners have built</h2>
              <p>The same experience now goes to every founder Ryse backs.</p>
            </div>
            <div className="port-grid">
              {PORTFOLIO.map((c) => (
                <article className="co" key={c.name}>
                  <div className="co-logo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/images/logos/${c.logo}.png`} alt={`${c.name} logo`} loading="lazy" />
                  </div>
                  <div className="co-body">
                    {c.sector && (
                      <div className="co-meta">
                        <span className="sector">{c.sector}</span>
                        {c.stage && <span className="stage">{c.stage}</span>}
                      </div>
                    )}
                    <h3>{c.name}</h3>
                    {c.body ? <p>{c.body}</p> : <p className="tbc">Details coming soon</p>}
                    {c.partner && <span className="co-partner">{c.partner}</span>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* PARTNER WITH US */}
        <PartnerSection />

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
          <div className="wrap apply-grid">
            <div>
              <span className="eyebrow">Apply</span>
              <h2>
                Building something? <span>Pitch it.</span>
              </h2>
              <p className="lede">Applications are open all year. The partners read every one.</p>
              <div className="ctas" style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 30 }}>
                <Link className="btn btn-signal" href="/apply">
                  Start your application
                </Link>
                <a className="btn btn-glass" href="#faq">
                  Read the FAQ
                </a>
              </div>
            </div>
            <div>
              <ul className="checks" style={{ marginTop: 0 }}>
                <li>Takes about five minutes</li>
                <li>Upload your pitch deck if you have one</li>
                <li>Reviewed personally by the partners</li>
                <li>A decision within 48 hours of your pitch</li>
              </ul>
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
            </div>
          </div>
        </section>
      </main>
      <HomeFooter />
    </>
  );
}
