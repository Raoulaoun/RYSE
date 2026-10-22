import { NextResponse } from "next/server";

// The admin panel is off unless ADMIN_ENABLED=true, so the marketing site can
// be deployed on its own. Every admin page also requires a signed-in partner.
export function proxy() {
  if (process.env.ADMIN_ENABLED === "true") return NextResponse.next();
  return new NextResponse("Not found", { status: 404, headers: { "content-type": "text/plain" } });
}

// Only /admin: the proxy buffers request bodies, which must not touch deck uploads.
export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
