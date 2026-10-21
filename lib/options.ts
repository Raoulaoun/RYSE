// Option lists shared by the forms (labels) and the API (allowed values).

export const COUNTRY_CODES = [
  { value: "+961", label: "🇱🇧 +961" },
  { value: "+971", label: "🇦🇪 +971" },
  { value: "+966", label: "🇸🇦 +966" },
  { value: "+974", label: "🇶🇦 +974" },
  { value: "+965", label: "🇰🇼 +965" },
  { value: "+962", label: "🇯🇴 +962" },
  { value: "+33", label: "🇫🇷 +33" },
  { value: "+1", label: "🇺🇸 +1" },
  { value: "+44", label: "🇬🇧 +44" },
] as const;

export const FOUNDER_TYPES = [
  { value: "student", label: "Student" },
  { value: "graduate", label: "Graduate" },
  { value: "professional", label: "Professional" },
  { value: "repeat_founder", label: "Repeat founder" },
] as const;

export const GRAD_YEARS = ["2026", "2027", "2028", "2029", "2030", "2031", "2032"] as const;

export const SECTORS = [
  { value: "fintech", label: "FinTech" },
  { value: "healthtech", label: "HealthTech" },
  { value: "edtech", label: "EdTech" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "b2b_saas", label: "B2B SaaS" },
  { value: "ai", label: "AI" },
  { value: "marketplace", label: "Marketplace" },
  { value: "consumer", label: "Consumer" },
  { value: "climate", label: "Climate" },
  { value: "real_estate", label: "Real estate" },
  { value: "other", label: "Other" },
] as const;

export const STAGES = [
  { value: "idea", label: "Idea" },
  { value: "mvp", label: "Prototype or MVP" },
  { value: "first_customers", label: "First customers" },
  { value: "revenue", label: "Revenue" },
] as const;

export const NEEDS = [
  { value: "capital", label: "Capital" },
  { value: "strategy", label: "Strategy" },
  { value: "growth_brand", label: "Growth & Brand" },
  { value: "finance_legal", label: "Finance & Legal" },
  { value: "product_tech", label: "Product & Tech" },
] as const;

export const HEARD_FROM = [
  { value: "campus_campaign", label: "Campus campaign" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram" },
  { value: "referral", label: "Referral from someone" },
  { value: "event", label: "An event" },
  { value: "other", label: "Other" },
] as const;

export const PARTNER_TYPES = [
  { value: "university", label: "University" },
  { value: "co_investor", label: "Co-investor" },
  { value: "corporate_mentor", label: "Corporate or mentor" },
] as const;

export const TICKET_RANGES = [
  { value: "under_10k", label: "Under $10k" },
  { value: "10k_50k", label: "$10k to $50k" },
  { value: "50k_250k", label: "$50k to $250k" },
  { value: "250k_plus", label: "$250k and above" },
] as const;

export const HELP_TYPES = [
  { value: "sponsor", label: "Sponsor a campaign" },
  { value: "mentor", label: "Mentor founders" },
  { value: "network", label: "Open my network" },
  { value: "problem_to_solve", label: "Bring a problem to solve" },
] as const;

export const DECK_MAX_BYTES = 15 * 1048576;
export const DECK_EXT = /\.(pdf|ppt|pptx|key)$/i;
export const MAX_COFOUNDERS = 3;

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const URL_RE = /^https?:\/\/\S+\.\S+/;
export const CAMPAIGN_RE = /^[A-Za-z0-9_-]{2,40}$/;

export function values<T extends readonly { value: string }[]>(list: T) {
  return list.map((o) => o.value) as [T[number]["value"], ...T[number]["value"][]];
}
