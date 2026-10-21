import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Wordmark } from "@/components/Logo";
import { currentAdmin } from "@/lib/admin/auth";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await currentAdmin()) redirect("/admin");
  const { error } = await searchParams;
  return (
    <div className="login">
      <Wordmark className="adm-logo" />
      <div className="login-card">
        <LoginForm expired={error === "expired"} />
      </div>
      <span className="foot">Ryse Venture · Admin panel</span>
    </div>
  );
}
