import { Space_Grotesk, Unbounded } from "next/font/google";

export const unbounded = Unbounded({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-unbounded" });
export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-space-grotesk",
});
