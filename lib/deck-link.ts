import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { appUrl } from "./mail";

// Signed, expiring download links for pitch decks, used in notification emails
// so partners can open a deck without the admin panel.
const VALID_DAYS = 180;

function sign(id: number, exp: number, secret: string) {
  return createHmac("sha256", secret).update(`deck:${id}:${exp}`).digest("base64url");
}

export function deckLink(id: number): string | null {
  const secret = process.env.DECK_LINK_SECRET;
  if (!secret) return null;
  const exp = Math.floor(Date.now() / 1000) + VALID_DAYS * 86400;
  return appUrl(`/api/decks/${id}?exp=${exp}&sig=${sign(id, exp, secret)}`);
}

export function verifyDeckLink(id: number, exp: number, sig: string) {
  const secret = process.env.DECK_LINK_SECRET;
  if (!secret || !Number.isInteger(id) || !Number.isInteger(exp) || exp < Date.now() / 1000) return false;
  const want = Buffer.from(sign(id, exp, secret));
  const got = Buffer.from(sig);
  return want.length === got.length && timingSafeEqual(want, got);
}
