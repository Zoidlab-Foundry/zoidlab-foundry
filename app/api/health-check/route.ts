import { NextResponse } from "next/server";
import { REGISTRY } from "../../../lib/registry";

// Suite health: ping each active package's OPEN /api/health server-side (no session
// needed — health endpoints are ungated) and report up/down + latency. Feeds the
// portal's "coherent operating picture" (blueprint §4.1, §7.0, §11.3).
export const dynamic = "force-dynamic";

export async function GET() {
  const active = REGISTRY.filter((p) => p.status === "active" && p.url);
  const results = await Promise.allSettled(
    active.map(async (p) => {
      const t0 = Date.now();
      const r = await fetch(`${p.url}${p.health_path}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      });
      const ms = Date.now() - t0;
      let ok = r.ok;
      try {
        const j = await r.json();
        ok = ok && (j.ok === true || j.ok === undefined);
      } catch {
        /* non-JSON but 2xx still counts as up */
      }
      return { id: p.package_id, ok, ms };
    }),
  );

  const health: Record<string, { ok: boolean; ms: number | null }> = {};
  results.forEach((res, i) => {
    const id = active[i].package_id;
    health[id] = res.status === "fulfilled"
      ? { ok: res.value.ok, ms: res.value.ms }
      : { ok: false, ms: null };
  });
  const up = Object.values(health).filter((h) => h.ok).length;
  return NextResponse.json({ health, up, total: active.length });
}
