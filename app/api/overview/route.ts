import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Server-side aggregation: forward the shared zb_session cookie to each app's API
// (no CORS — this runs on the server) and collect the signed-in user's real footprint.
const SOURCES: { slug: string; url: string; label: string; extract: (j: any) => number | null }[] = [
  { slug: "builder", url: "https://builder.zoidlab.ai/api/workflows", label: "workflows", extract: (j) => j?.workflows?.length ?? null },
  { slug: "marketplace", url: "https://marketplace.zoidlab.ai/api/my-agents", label: "installed agents", extract: (j) => (j?.installed?.length ?? 0) },
  { slug: "prompter", url: "https://prompter.zoidlab.ai/api/prompts", label: "prompts", extract: (j) => (Array.isArray(j) ? j.length : j?.prompts?.length) ?? null },
  { slug: "memorymaker", url: "https://memorymaker.zoidlab.ai/api/stores", label: "memory stores", extract: (j) => j?.count ?? j?.stores?.length ?? null },
  { slug: "rag", url: "https://rag.zoidlab.ai/api/knowledge-bases", label: "knowledge bases", extract: (j) => j?.count ?? j?.knowledge_bases?.length ?? null },
  { slug: "trustgate", url: "https://trustgate.zoidlab.ai/api/policies", label: "policies", extract: (j) => j?.policies?.length ?? null },
  { slug: "spendguard", url: "https://spendguard.zoidlab.ai/api/budgets", label: "budgets", extract: (j) => j?.budgets?.length ?? null },
  { slug: "modelbench", url: "https://modelbench.zoidlab.ai/api/runs", label: "benchmark runs", extract: (j) => j?.runs?.length ?? null },
  { slug: "eval", url: "https://eval.zoidlab.ai/api/runs", label: "eval runs", extract: (j) => j?.runs?.length ?? null },
];

export async function GET() {
  const cookie = (await cookies()).get("zb_session")?.value;
  if (!cookie) return NextResponse.json({ error: "no_session" }, { status: 401 });

  const results = await Promise.allSettled(
    SOURCES.map(async (s) => {
      const r = await fetch(s.url, {
        headers: { cookie: `zb_session=${cookie}` },
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });
      if (!r.ok) throw new Error(String(r.status));
      const j = await r.json();
      return { count: s.extract(j) };
    }),
  );

  const apps: Record<string, { label: string; count: number | null; ok: boolean }> = {};
  results.forEach((res, i) => {
    const s = SOURCES[i];
    apps[s.slug] = res.status === "fulfilled"
      ? { label: s.label, count: res.value.count, ok: true }
      : { label: s.label, count: null, ok: false };
  });
  return NextResponse.json({ apps });
}
