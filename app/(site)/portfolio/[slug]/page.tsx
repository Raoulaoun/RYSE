import type { Metadata } from "next";
import { PORTFOLIO } from "@/lib/content";
import { SITE } from "@/lib/site";

// Company profiles now open inside the homepage. These old addresses forward to
// the open panel (/#portfolio-<slug>), so shared links and search results still work.

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return PORTFOLIO.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = PORTFOLIO.find((x) => x.slug === slug);
  return {
    title: c ? `${c.name} · Ryse portfolio` : "Ryse portfolio",
  };
}

export default async function CompanyRedirect({ params }: Props) {
  const { slug } = await params;
  const target = `/#portfolio-${slug}`;
  const c = PORTFOLIO.find((x) => x.slug === slug);
  return (
    <>
      {/* Rendered directly: Next's metadata API drops the #fragment from canonical URLs. */}
      <link rel="canonical" href={`${SITE.url}${target}`} />
      <meta httpEquiv="refresh" content={`0; url=${target}`} />
      <p style={{ padding: 24, fontFamily: "var(--body)" }}>
        Opening <a href={target}>{c?.name ?? "this company"} on ryseventure.com</a>…
      </p>
    </>
  );
}
