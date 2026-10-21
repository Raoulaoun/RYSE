import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Unbounded } from "next/font/google";
import { ScrollState } from "@/components/ScrollState";
import { SITE } from "@/lib/site";
import "./globals.css";

const unbounded = Unbounded({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-unbounded" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-space-grotesk" });

const description =
  "Ryse invests early in ambitious founders, meets them in person, and decides within 48 hours. Capital, strategy and hands-on support for startups in Lebanon and the region.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: "Ryse",
  description,
  openGraph: {
    title: "Ryse — We back founders before the world notices.",
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
    <html lang="en" className={`${unbounded.variable} ${spaceGrotesk.variable}`}>
      <body>
        <ScrollState />
        {children}
      </body>
    </html>
  );
}
