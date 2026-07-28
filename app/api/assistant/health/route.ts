import { NextResponse } from "next/server";
import { REGISTRY } from "../../../../lib/registry";

// Public health for the hub concierge — no session needed, mirrors the per-app
// /api/assistant/health so the estate smoke test can check all 17 uniformly.
export function GET() {
  return NextResponse.json({
    ok: true,
    assistant: "Foundry",
    apps: REGISTRY.filter((p) => p.status === "active").length,
    relay: Boolean(process.env.NYQUEST_API_KEY),
  });
}
