import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.BUILDER_SESSION_SECRET || "dev-secret-change-me");
// /api/providers (canonical catalog) is an OPEN control-plane endpoint apps consume
// server-side. /api/health-check pings sibling health (no user data).
const PUBLIC_PREFIXES = ["/enter", "/gate", "/api/session", "/api/handoff", "/api/providers", "/api/health-check", "/api/assistant/health"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) return NextResponse.next();

  const cookie = req.cookies.get("zb_session")?.value;
  if (cookie) {
    try {
      await jwtVerify(cookie, SECRET);
      return NextResponse.next();
    } catch {
      /* fall through */
    }
  }
  const url = req.nextUrl.clone();
  url.pathname = "/gate";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.svg).*)"],
};
