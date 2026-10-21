import { NextResponse, type NextRequest } from "next/server";
import { redeemLoginToken } from "@/lib/admin/auth";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const ok = token ? await redeemLoginToken(token) : false;
  return NextResponse.redirect(new URL(ok ? "/admin" : "/admin/login?error=expired", request.url));
}
