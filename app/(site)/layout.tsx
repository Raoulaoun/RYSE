import type { Metadata, Viewport } from "next";
import { ScrollState } from "@/components/ScrollState";
import { spaceGrotesk } from "@/lib/fonts";
import { SITE } from "@/lib/site";
import "./globals.css";

const description =
  "Ryse invests early in ambitious founders, meets them in person, and decides within 48 hours. Capital, strategy and hands-on support for startups in Lebanon and the region.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: "Ryse — An incubator for early-stage startups",
  description,
  openGraph: {
    title: "Ryse — Where bold ideas RYSE",
    description,
    url: SITE.url,
    siteName: "Ryse",
    images: [{ url: "/images/hero.jpg", width: 1600, height: 685 }],
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body>
        <ScrollState />
        {children}
      </body>
    </html>
  );
}
