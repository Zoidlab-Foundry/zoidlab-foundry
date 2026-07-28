import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { REGISTRY } from "../../../../lib/registry";

/* Hub assistant — the Foundry concierge.
   Answers "which app do I use for X?" and "where does this live?" grounded in the canonical
   package registry, and returns deep links so the user can jump straight there.

   Unlike the per-app assistants (foundry_common.assistant), this one is READ-ONLY BY
   CONSTRUCTION: it has no capabilities and touches no app data — routing advice only. Each
   app's own assistant does the work once the user arrives. Billed to the user's own Nyquest
   wallet via the rk claim when present. */

const SECRET = new TextEncoder().encode(process.env.BUILDER_SESSION_SECRET || "dev-secret-change-me");
const RELAY = (process.env.NYQUEST_BASE_URL || "https://api.nyquest.ai/v1").replace(/\/$/, "");
const SHARED_KEY = process.env.NYQUEST_API_KEY || "";
const MODEL = process.env.FOUNDRY_ASSISTANT_MODEL || "anthropic/claude-sonnet-5";
const PRO = ["pro", "team", "teams", "enterprise"];

function catalog() {
  return REGISTRY.filter((p) => p.status === "active")
    .map((p) => `- ${p.name} (${p.domain}) — ${p.tagline}` +
                (p.capabilities?.length ? `  [${p.capabilities.join(", ")}]` : ""))
    .join("\n");
}

const RULES = `You are the concierge for the ZoidLab Foundry — a suite of AI engineering apps that
share one sign-in, one LLM relay, and one export format. Your job is to point people at the RIGHT
APP for what they are trying to do, and to explain how the apps fit together.

THE APPS:`;

export async function POST(req: Request) {
  const c = (await cookies()).get("zb_session")?.value;
  if (!c) return NextResponse.json({ error: "no_session" }, { status: 401 });
  let claims: Record<string, unknown> = {};
  try {
    const { payload } = await jwtVerify(c, SECRET);
    claims = payload as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_session" }, { status: 401 });
  }
  if (!PRO.includes(String(claims.tier || "free").toLowerCase())) {
    return NextResponse.json({ error: "plan_required" }, { status: 403 });
  }

  const key = (claims.rk as string) || SHARED_KEY;
  const body = await req.json().catch(() => ({}));
  const messages = Array.isArray(body?.messages) ? body.messages.slice(-10) : [];
  if (!key) {
    return NextResponse.json({
      type: "answer", billing: "none",
      text: "The concierge needs a relay key. In the meantime, every app tile below links " +
            "straight to its own in-app assistant, which can answer questions about that app.",
      apps: [],
    });
  }

  const system = `${RULES.trim()}
${catalog()}

HOW THEY COMPOSE: Builder orchestrates the others as workflow nodes (RAG query, memory recall,
prompt run, vision/voice/MCP/swarm runs). DataForge generates test data that feeds ModelBench,
Eval and RAG. TrustGate governs AI actions across apps; SpendGuard meters their cost. Every app
exports in the same signed Foundry envelope, and every app has its own in-app assistant (the
✦ Assist button) that can actually do the work once the user is there.

Reply with EXACTLY ONE minified JSON object, no prose, no code fences:
{"type":"answer","text":"...","apps":["exact app names you recommend, most relevant first"]}
Rules: recommend only apps listed above, by their exact names. Keep text under 90 words, concrete,
plain text. If the user's need spans several apps, say the order to use them in. If nothing fits,
say so honestly rather than inventing an app.`;

  let out = "";
  try {
    const r = await fetch(`${RELAY}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: MODEL, temperature: 0.2, max_tokens: 500,
        messages: [{ role: "system", content: system },
                   ...messages.map((m: { role: string; content: unknown }) => ({
                     role: m.role === "assistant" ? "assistant" : "user",
                     content: String(m.content).slice(0, 2000),
                   }))],
      }),
    });
    const j = await r.json();
    out = j?.choices?.[0]?.message?.content || "";
  } catch {
    return NextResponse.json({ type: "answer", text: "The concierge could not reach the relay just now — try again.", apps: [] });
  }

  let parsed: { text?: string; apps?: string[] } = {};
  try {
    const t = out.trim().replace(/^```(json)?/, "").replace(/```$/, "").trim();
    parsed = JSON.parse(t.slice(t.indexOf("{"), t.lastIndexOf("}") + 1));
  } catch {
    parsed = { text: out.trim(), apps: [] };
  }
  const names = new Set((parsed.apps || []).map((n) => String(n).toLowerCase()));
  const apps = REGISTRY.filter((p) => p.status === "active" && names.has(p.name.toLowerCase()))
    .map((p) => ({ name: p.name, url: p.url || `https://${p.domain}`, glyph: p.glyph, tagline: p.tagline }));

  return NextResponse.json({
    type: "answer",
    text: (parsed.text || "").trim() || "I could not put that into words — try asking a different way.",
    apps,
    billing: claims.rk ? "user" : "owner",
  });
}
