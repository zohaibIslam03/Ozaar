import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Prefer a single canonical host: https://ozaar.theinnovations.tech
 * - Force HTTPS when behind a proxy that sends x-forwarded-proto
 * - Redirect www → non-www
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host") ?? url.host;
  const proto =
    request.headers.get("x-forwarded-proto") ??
    (url.protocol === "https:" ? "https" : "http");

  let redirect = false;

  // www → non-www
  if (host.startsWith("www.")) {
    url.host = host.replace(/^www\./, "");
    redirect = true;
  }

  // http → https (production / proxied only)
  if (proto === "http" && !host.includes("localhost") && !host.startsWith("127.")) {
    url.protocol = "https:";
    redirect = true;
  }

  if (redirect) {
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Skip Next internals and static assets.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mjs)$).*)",
  ],
};
