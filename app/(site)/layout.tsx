import type { Metadata, Viewport } from "next";
import { ScrollState } from "@/components/ScrollState";
import { spaceGrotesk } from "@/lib/fonts";
import { SITE } from "@/lib/site";
import "./globals.css";

const description =
  "Ryse is an incubator for early-stage startups in Lebanon and the region: experience, strategic guidance and hands-on support for ambitious founders, and help attracting investors when the time is right.";

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
