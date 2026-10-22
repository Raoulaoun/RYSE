import localFont from "next/font/local";

// Self-hosted copies of the Google fonts (SIL Open Font License, see fonts/),
// so builds never depend on reaching fonts.googleapis.com.
export const unbounded = localFont({
  src: "../fonts/Unbounded-latin.woff2",
  weight: "200 900",
  variable: "--font-unbounded",
  display: "swap",
});

export const spaceGrotesk = localFont({
  src: "../fonts/SpaceGrotesk-latin.woff2",
  weight: "300 700",
  variable: "--font-space-grotesk",
  display: "swap",
});
