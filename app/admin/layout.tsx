import type { Metadata } from "next";
import { spaceGrotesk, unbounded } from "@/lib/fonts";
import "./admin.css";

export const metadata: Metadata = {
  title: { default: "Ryse admin", template: "Ryse admin · %s" },
  robots: { index: false, follow: false },
};

export default function AdminRoot({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${unbounded.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
