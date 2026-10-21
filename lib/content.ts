// Copy for the public site, word for word from the final company profile
// (261001_Ryse_Company_Profile_vf). Edit here, not in the page markup.

export type IconName =
  | "award" | "sunrise" | "anchor" | "plus-circle" | "globe" | "zap" | "dollar" | "compass" | "trending-up"
  | "user" | "search" | "tool" | "target" | "pen" | "book" | "briefcase" | "refresh" | "check";

export const LOGO_STRIP = [
  { src: "multiflow", name: "Multiflow Trading" },
  { src: "beta-investment-group", name: "Beta Investment Group" },
  { src: "upwell", name: "Upwell" },
  { src: "kopibat", name: "Kopibat" },
  { src: "goldish", name: "Goldish" },
  { src: "puravida", name: "PuraVida" },
  { src: "rinov8", name: "Rinov8 Group" },
  { src: "myclinic", name: "MyClinic" },
  { src: "virtual-universe", name: "Virtual Universe" },
];

export const HEADLINE_STATS = [
  { value: "48h", label: "From pitch to investment decision" },
  { value: "Day 0", label: "Is when we're ready to invest" },
];

export const THESIS: { icon: IconName; title: string; body: string }[] = [
  { icon: "award", title: "Founders over pedigree", body: "We judge ambition, speed and execution, not CVs, degrees or connections." },
  { icon: "sunrise", title: "Day zero is the best day", body: "The best moment to back someone is when no one believes in them yet." },
  { icon: "anchor", title: "Built under pressure", body: "Companies born in hard markets learn discipline early." },
  { icon: "plus-circle", title: "More than an investor", body: "Capital opens the door. Strategy and hands-on support move the needle." },
  { icon: "globe", title: "Local proof, global scale", body: "Validate in Lebanon, build for the region, expand to the world." },
  { icon: "zap", title: "Speed is respect", body: "Founders hear back within 48 hours. Their time matters as much as ours." },
];

export const PHILOSOPHY: { img: string; alt: string; pos: string; icon: IconName; title: string; body: string }[] = [
  {
    img: "/images/benefit-capital.jpg",
    alt: "A handshake closing an investment",
    pos: "55% 50%",
    icon: "dollar",
    title: "Capital",
    body: "Financial support to build, test and reach first revenue, without waiting for traction you can't yet show.",
  },
  {
    img: "/images/benefit-strategy.jpg",
    alt: "A mentor walking a founder through a strategy board",
    pos: "68% 40%",
    icon: "compass",
    title: "Strategy",
    body: "Direct guidance from three partners who have started, operated, sold and advised companies across the region.",
  },
  {
    img: "/images/benefit-growth.jpg",
    alt: "A startup team reviewing growth on a screen",
    pos: "55% 40%",
    icon: "trending-up",
    title: "Support for Growth",
    body: "Hands-on support from Ryse's functional departments, so you never worry about marketing, branding, finance, and product and tech.",
  },
];

export const APPROACH: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "user",
    title: "Start with the founder",
    body: "We get to know you, the problem you want to solve, and why it matters. We look for conviction, resourcefulness, and a willingness to learn.",
  },
  {
    icon: "search",
    title: "Challenge the idea",
    body: "Together, we test the assumptions behind your business: who needs it, what they will pay for, and why they will choose you. We help you gather evidence before committing significant time and money.",
  },
  {
    icon: "tool",
    title: "Build what matters",
    body: "We turn that insight into a focused plan. From your product and business model to branding, pricing, and operations, we help you prioritize and work alongside you to execute.",
  },
  {
    icon: "target",
    title: "Get into the market",
    body: "We support you in reaching your first customers, testing your sales approach, and developing relevant partnerships. Real customer feedback guides what happens next.",
  },
  {
    icon: "trending-up",
    title: "Build for growth",
    body: "As traction develops, we help strengthen your team, processes, and financial foundations. When funding is required for the business's next step, we help you prepare a credible investment case.",
  },
];

export type Partner = {
  slug: string;
  name: string;
  photo: string;
  // Tall portrait for the profile block; swap for the dark-background shots when they arrive.
  profilePhoto: string;
  summary: string;
  title: string;
  logos: { src: string; name: string }[];
  chips: string[];
  bio: [string, string];
  program: string;
};

export const PARTNERS: Partner[] = [
  {
    slug: "roy",
    name: "Roy Yammine",
    photo: "/images/partners/roy-yammine.jpg",
    profilePhoto: "/images/partners/roy-yammine.jpg",
    summary:
      "Serial entrepreneur with 12+ years in strategy consulting, specializing in business growth, operational excellence, and transformation.",
    title: "Managing Partner · Serial Entrepreneur & Strategy Advisor",
    logos: [
      { src: "upwell", name: "Upwell" },
      { src: "goldish", name: "Goldish" },
      { src: "virtual-universe", name: "Virtual Universe" },
      { src: "multiflow", name: "Multiflow" },
    ],
    chips: [
      "12+ years in strategy consulting, Strategy&",
      "Founder, Multiflow",
      "MBA, London Business School",
      "Co-founder, Upwell",
      "Founder, Virtual Universe",
      "Founder, Goldish",
    ],
    bio: [
      "Roy is a serial entrepreneur and strategy consultant with an MBA from London Business School and over 12 years of experience advising leading organizations across the Middle East on growth strategy, market entry, operational excellence, and business transformation. Alongside his consulting career, he has founded and co-founded multiple ventures across diverse industries, successfully exiting some while continuing to scale others.",
      "His entrepreneurial portfolio spans technology, consumer products, and construction materials. He is currently a Managing Partner at Multiflow, a UAE-based building materials company, and co-founder of Upwell, a functional beverage brand. His experience combines strategic advisory expertise, an international business education, and hands-on business building, from concept development and market validation to commercialization and growth.",
    ],
    program:
      "Helping founders validate business opportunities, develop commercially viable models, establish strong go-to-market strategies, and turn promising ideas into scalable businesses.",
  },
  {
    slug: "bechara",
    name: "Bechara Koyess",
    photo: "/images/partners/bechara-koyess.jpg",
    profilePhoto: "/images/partners/bechara-koyess.jpg",
    summary:
      "Serial entrepreneur with 9+ years across industry and consulting, specializing in corporate strategy, operating models, and strategic partnerships.",
    title: "Managing Partner · Entrepreneur & Strategy Advisor",
    logos: [
      { src: "upwell", name: "Upwell" },
      { src: "kopibat", name: "Kopibat" },
      { src: "puravida", name: "PuraVida" },
      { src: "rinov8", name: "Rinov8 Group" },
    ],
    chips: [
      "9+ years in industry & consulting, Strategy&",
      "Co-founder & CEO, Rinov8 Group",
      "Partner, Kopibat",
      "Partner, PuraVida",
      "Co-founder, Upwell",
    ],
    bio: [
      "Bechara is an entrepreneur and strategy consultant with over 9 years of experience across industry and consulting, advising leading public and private sector organizations in the Middle East on corporate strategy, business transformation, operating model design, and strategic partnerships. With a background in engineering and an MBA from HEC Paris, he combines strategic advisory expertise with a practical understanding of business operations and execution.",
      "Alongside his consulting career, Bechara has built and managed ventures across entertainment, real estate, hospitality, and consumer products. His entrepreneurial experience includes co-founding Rinov8 Group, leading real estate activities at Kopibat, and supporting the growth of PuraVida and Upwell. His experience spans the full business lifecycle, from opportunity identification and business development to operational management and strategic growth.",
    ],
    program:
      "Helping founders refine business strategies, structure effective operating models, establish strategic partnerships, and turn ambitious ideas into actionable plans for sustainable growth.",
  },
  {
    slug: "raoul",
    name: "Raoul Aoun",
    photo: "/images/partners/raoul-aoun.jpg",
    profilePhoto: "/images/partners/raoul-aoun.jpg",
    summary:
      "Serial entrepreneur and investor with a strong background in fintech, health tech, digital product development, and go-to-market strategy.",
    title: "Managing Partner · Serial Entrepreneur & Investor",
    logos: [
      { src: "beta-app", name: "Beta App" },
      { src: "beta-investment-group", name: "Beta Investment Group" },
      { src: "myclinic", name: "MyClinic" },
    ],
    chips: ["Founder, Beta Investment Group", "Founder, Beta App", "Co-founder, MyClinic"],
    bio: [
      "Raoul is a serial entrepreneur and investor with extensive experience building, investing in, and scaling businesses across fintech, healthtech, and consumer technology. As the founder of Beta Investment Group, an independent investment firm established in 2021, he combines investment expertise with a strong understanding of business strategy, capital allocation, and digital innovation.",
      "Beyond investment management, Raoul has founded and backed technology-driven ventures, including MyClinic, a healthcare management software platform, and Beta App, an emerging digital investment platform. His approach goes beyond financial investment, leveraging his team's expertise across product development, technology, marketing, and operations to actively support the businesses he backs from their earliest stages.",
    ],
    program:
      "Helping founders validate products, build go-to-market strategies, leverage technology, and access the capital and operating support needed to scale.",
  },
];

export type Company = {
  slug: string;
  name: string;
  logo: string;
  sector: string;
  where: string;
  exited?: boolean;
  // Grey tiles with ink numbers: exited companies or historical figures.
  lightStats?: boolean;
  overview: string;
  highlights: [string, string, string];
  role: string;
  impact: { value: string; label: string }[];
  footnotes?: string[];
  // The company's profile image (public/images/portfolio/<slug>.jpg), shown uncropped.
  image?: { src: string; width: number; height: number };
};

export const PORTFOLIO: Company[] = [
  {
    slug: "multiflow",
    image: { src: "/images/portfolio/multiflow.jpg", width: 1128, height: 1500 },
    name: "Multiflow Building Materials Trading",
    logo: "multiflow",
    sector: "Construction Material Trading and Manufacturing",
    where: "United Arab Emirates · Launched in 2025",
    lightStats: true,
    overview:
      "A leading distribution company specializing in high-quality pipes and fittings in the UAE. Driven by a commitment to excellence, reliability and innovation, it delivers top-tier piping solutions tailored to the evolving needs of commercial, industrial and infrastructure projects.",
    highlights: [
      "Key distributor of pipes to major developers in the UAE, including Emaar, Sobha, Damac, Samana and Nakheel",
      "Revenue growing month-on-month with expanding margins",
      "Strong team of 55 full-time professionals with in-depth knowledge of the construction industry",
    ],
    role: "Roy Yammine — Founder",
    impact: [
      { value: "25Mn USD", label: "Revenues, 2026 year-to-date" },
      { value: "26%", label: "Net profit margin" },
      { value: "32.5Mn USD", label: "Valuation" },
    ],
  },
  {
    slug: "beta",
    image: { src: "/images/portfolio/beta.jpg", width: 904, height: 1500 },
    name: "Beta Investment Group",
    logo: "beta-investment-group",
    sector: "Investment management",
    where: "Lebanon & diaspora · Launched in 2021",
    overview:
      "Independent investment firm founded in 2021 to manage capital for high-net-worth investors in Lebanon and the diaspora, while extending its expertise into digital investing. Currently developing Beta App, a technology for safe and professional money management.",
    highlights: [
      "Founded in 2021 to serve high-net-worth investors",
      "Manages investor capital and is developing Beta App",
      "Combines traditional investment management with a planned digital channel",
    ],
    role: "Raoul Aoun — Founder",
    impact: [
      { value: "$7.2M", label: "Assets under management" },
      { value: "2021", label: "Founded" },
    ],
  },
  {
    slug: "upwell",
    image: { src: "/images/portfolio/upwell.jpg", width: 1142, height: 1500 },
    name: "Upwell",
    logo: "upwell",
    sector: "Functional Beverages",
    where: "Lebanon & MENA · Launched in 2026",
    overview:
      "Functional wellness beverages designed for modern lifestyles. Its twist-to-mix smart cap keeps powdered ingredients separate until consumption, enabling fresh, convenient, low-calorie drinks.",
    highlights: [
      "A twist-activated smart cap releases functional powder into the water",
      "Range covers coconut matcha, collagen + creatine, clear whey and protein with electrolytes",
      "Products target everyday wellness with no added sugar and simple grab-and-go use",
    ],
    role: "Roy Yammine and Bechara Koyess — Co-founders",
    impact: [
      { value: "5 Markets¹", label: "KSA, Jordan, Mexico, Australia" },
      { value: "900K", label: "Projected annual sales (bottles)²" },
      { value: "3.4Mn USD", label: "Projected annual sales (USD)²" },
    ],
    footnotes: ["¹ Currently at an advanced negotiation stage.", "² End of 2028."],
  },
  {
    slug: "kopibat",
    image: { src: "/images/portfolio/kopibat.jpg", width: 1058, height: 1500 },
    name: "Kopibat",
    logo: "kopibat",
    sector: "Real Estate · Engineering",
    where: "Antoine Koyess & Associates · Launched in 1980",
    overview:
      "Lebanon-based real estate development, engineering and construction company working on residential towers, mixed-use assets and commercial property developments.",
    highlights: [
      "Developed Al Nahr / Zeena Tower, a ~40,700 m² mixed-use development",
      "Served as consultant on 50 Rue du Liban, a 20-floor, 33-unit residential tower",
      "Developer of Saifi 623, a residential project in Beirut",
    ],
    role: "Bechara Koyess — Partner",
    impact: [
      { value: "50+", label: "Projects delivered" },
      { value: "USD 500M+", label: "Development value" },
    ],
  },
  {
    slug: "goldish",
    image: { src: "/images/portfolio/goldish.jpg", width: 1058, height: 1500 },
    name: "Goldish",
    logo: "goldish",
    sector: "Hospitality Technology",
    where: "Lebanon · Launched in 2016, sold in 2018",
    exited: true,
    lightStats: true,
    overview:
      "A hospitality technology platform for users to find restaurants, book a table and order delivery, coupled with a floor plan management system for hosts, a table-side ordering system for waiters and a delivery tracking system for drivers.",
    highlights: [
      "Interactive floor plans enabled reservations and real-time table management",
      "Waiters and guests could place orders on tablets and mobile devices by scanning a QR code",
      "Delivery operations ran with live driver tracking",
    ],
    role: "Roy Yammine — Founder and CEO",
    impact: [
      { value: "2 Years", label: "of development" },
      { value: "350K USD", label: "Selling value" },
    ],
  },
  {
    slug: "puravida",
    image: { src: "/images/portfolio/puravida.jpg", width: 1058, height: 1500 },
    name: "PuraVida",
    logo: "puravida",
    sector: "Lifestyle · Hospitality",
    where: "Dubai & Ibiza · Launched in 2024",
    overview:
      "A lifestyle and membership platform connecting users with curated nightlife, music, dining and social experiences through events, guest-list access and priority restaurant bookings.",
    highlights: [
      "The discovery app curates nightlife, music events and private after-parties",
      "Members access club guest lists, priority bookings and restaurant discounts",
      "Partnered with 7 nightclubs and 50 restaurants",
    ],
    role: "Bechara Koyess — Managing Director and Partner",
    impact: [
      { value: "2,900", label: "Paid bookings" },
      { value: "$2.8M", label: "Booking value" },
      { value: "7 + 50", label: "Club & restaurant partners" },
    ],
  },
  {
    slug: "rinov8",
    image: { src: "/images/portfolio/rinov8.jpg", width: 1058, height: 1500 },
    name: "Rinov8 Group",
    logo: "rinov8",
    sector: "Events & Entertainment",
    where: "Lebanon · Launched in 2010",
    overview:
      "A Lebanon-based event management and entertainment company specializing in music, nightlife, corporate gatherings, NGO fundraisers, university celebrations and private events.",
    highlights: [
      "Produced events featuring artists such as Ross, Oliver Huntemann and MRAK",
      "Organized corporate events, NGO events and graduation parties",
      "Curated music and nightlife concepts, including Follow the Rino, Swag City and Sin City",
    ],
    role: "Bechara Koyess — Co-founder and CEO",
    impact: [
      { value: "100+", label: "Events delivered" },
      { value: "50K+", label: "Total attendance" },
      { value: "USD 2M+", label: "Revenue" },
    ],
  },
  {
    slug: "myclinic",
    image: { src: "/images/portfolio/myclinic.jpg", width: 978, height: 1500 },
    name: "MyClinic",
    logo: "myclinic",
    sector: "HealthTech · SaaS",
    where: "Lebanon & MENA · Launched in 2025",
    overview:
      "Dental-clinic management software designed to bring the main operational tools for dental practices into an integrated, subscription-based offering.",
    highlights: [
      "Offers all-inclusive annual plans for clinics of different sizes",
      "Created a Founding Clinic Program for early adopters",
      "Deployed a field sales team targeting clinics across Lebanon",
    ],
    role: "Raoul Aoun — Co-founder",
    impact: [
      { value: "250 Clinics", label: "Across Lebanon and MENA" },
      { value: "60% increase", label: "in yearly revenue" },
      { value: "150,000 USD", label: "Yearly recurrent revenue" },
    ],
  },
  {
    slug: "virtualuniverse",
    image: { src: "/images/portfolio/virtualuniverse.jpg", width: 1058, height: 1500 },
    name: "Virtual Universe",
    logo: "virtual-universe",
    sector: "VR · Entertainment",
    where: "Lebanon · Launched in 2017, sold in 2020",
    exited: true,
    lightStats: true,
    overview:
      "A virtual-reality entertainment offering centered on immersive gameplay, including omni-directional walking platforms and motion-based racing simulators.",
    highlights: [
      "KAT Walk Mini platforms let players walk, turn, run and crouch in virtual worlds",
      "Compatible with major VR headsets and 40+ games",
      "Racing simulators combined motion technology with three widescreen HD displays",
    ],
    role: "Roy Yammine — Founder and CEO",
    impact: [
      { value: "3 Key Locations", label: "ABC Dbayeh, Achrafieh and Verdun" },
      { value: "25K USD", label: "Monthly revenues" },
      { value: "24,000 Minutes", label: "played by users" },
    ],
  },
];

export const STEPS = [
  { title: "Apply", body: "Online, or through a Ryse campaign.", when: "Takes about 5 minutes" },
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

export const ROUTES: { icon: IconName; tag: string; title: string; body: string }[] = [
  {
    icon: "pen",
    tag: "Route A",
    title: "Apply online",
    body: "Open all year. Ideal for graduates, professionals and founders already building.",
  },
  {
    icon: "book",
    tag: "Route B",
    title: "Apply through a campus campaign",
    body: "Ryse runs campaigns with university entrepreneurship clubs across Lebanon.",
  },
];

export const WHO: { icon: IconName; title: string; body: string }[] = [
  { icon: "book", title: "Students", body: "Building alongside your studies" },
  { icon: "award", title: "Graduates", body: "Starting your first company" },
  { icon: "briefcase", title: "Professionals", body: "Leaving a career to build" },
  { icon: "refresh", title: "Repeat founders", body: "Back for the next one" },
];

export const FAQ = [
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
    a: "You receive an investment decision within 48 hours of your in-person pitch, with honest feedback whatever the answer.",
  },
  {
    q: "What support do I get after investment?",
    a: "Financial support plus hands-on work with the partners and the Ryse departments: strategy, growth and brand, finance and legal, and product and tech.",
  },
  {
    q: "Do you only back Lebanese companies?",
    a: "We validate in Lebanon, build for the region, and help founders expand to the world. Founders based elsewhere in the region are welcome to apply.",
  },
];
