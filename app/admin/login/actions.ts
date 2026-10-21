"use server";

import { createLoginToken } from "@/lib/admin/auth";
import { EMAIL_RE } from "@/lib/options";
import { appUrl, sendMail } from "@/lib/mail";

export type LoginState = { sent: boolean; email: string; error?: string };

export async function requestLink(_prev: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return { sent: false, email, error: "Enter a valid email" };
  try {
    const t = await createLoginToken(email);
    // Unknown emails get the same answer, so the page doesn't reveal who has access.
    if (t) {
      const link = appUrl(`/admin/auth/verify?token=${t.token}`);
      await sendMail({
        to: t.admin.email,
        subject: "Your Ryse sign-in link",
        text: `Hi ${t.admin.name.split(" ")[0]},\n\nUse this link to sign in to the Ryse admin panel. It expires in ${t.minutes} minutes and works once.\n\n${link}\n\nIf you didn't ask for it, you can ignore this email.`,
      });
    }
  } catch (err) {
    console.error("Failed to send sign-in link", err);
    return { sent: false, email, error: "We couldn't send the link. Try again in a moment." };
  }
  return { sent: true, email };
}
