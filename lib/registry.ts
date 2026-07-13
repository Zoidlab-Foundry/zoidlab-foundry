// The CANONICAL Foundry package registry — one source of truth for the whole suite.
// Per the Alignment & Remediation Blueprint (§3, §7.0, Appendix A): package number,
// name, domain, icon, required plan, status, capabilities, integration targets, and
// health are defined here and consumed by Foundry navigation, entitlement gating,
// resource selectors, and health displays. Do not duplicate this metadata per app.

export type ReleaseChannel = "prototype" | "beta" | "ga";
// active = built + live & gated · planned = specified in the blueprint, not yet built
export type RegistryStatus = "active" | "planned";

export interface PackageEntry {
  package_id: string;          // stable slug used across the suite
  package_number: string;      // "01".."13"
  name: string;
  tagline: string;
  domain: string;              // host (no scheme)
  url?: string;                // launch URL when active
  glyph: string;
  accent: string;
  required_plan: "pro";        // Nyquest Pro or higher
  release_channel: ReleaseChannel;
  status: RegistryStatus;
  health_path: string;         // open health endpoint on the app's API
  capabilities: string[];
  integration_targets: string[];  // §8.4 required integration matrix (package_ids)
  docs_url?: string;
  support_url?: string;
}

const SUPPORT = "https://foundry.zoidlab.ai";

export const REGISTRY: PackageEntry[] = [
  {
    package_id: "builder", package_number: "01", name: "AI Workflow Builder",
    tagline: "Visually build, test, and deploy AI workflows on the Nyquest runtime.",
    domain: "builder.zoidlab.ai", url: "https://builder.zoidlab.ai", glyph: "⚡", accent: "#4fd1c5",
    required_plan: "pro", release_channel: "prototype", status: "active", health_path: "/api/health",
    capabilities: ["workflow-orchestration", "durable-runs", "deploy-webhook", "schedule", "rbac", "audit", "cost-analytics", "optimizer"],
    integration_targets: ["prompter", "memorymaker", "rag", "trustgate", "spendguard", "eval", "mcplab", "marketplace", "swarmlab"],
    support_url: SUPPORT,
  },
  {
    package_id: "marketplace", package_number: "02", name: "Agent Marketplace",
    tagline: "Browse, test, install, and publish reusable AI agents across Nyquest.",
    domain: "marketplace.zoidlab.ai", url: "https://marketplace.zoidlab.ai", glyph: "◆", accent: "#7c5cfc",
    required_plan: "pro", release_channel: "prototype", status: "active", health_path: "/api/health",
    capabilities: ["discovery", "install", "publish", "reviews", "sandbox"],
    integration_targets: ["trustgate", "eval", "spendguard", "foundry"],
    support_url: SUPPORT,
  },
  {
    package_id: "prompter", package_number: "03", name: "Prompt Studio",
    tagline: "Design, test, version, and govern production prompts.",
    domain: "prompter.zoidlab.ai", url: "https://prompter.zoidlab.ai", glyph: "❝", accent: "#22d3ee",
    required_plan: "pro", release_channel: "prototype", status: "active", health_path: "/api/health",
    capabilities: ["authoring", "versioning", "quick-test", "approvals", "deploy-alias", "export"],
    integration_targets: ["modelbench", "eval", "trustgate", "builder", "marketplace"],
    support_url: SUPPORT,
  },
  {
    package_id: "memorymaker", package_number: "04", name: "MemoryMaker",
    tagline: "Design and govern AI memory systems — inspectable, expiring, tenant-aware memory.",
    domain: "memorymaker.zoidlab.ai", url: "https://memorymaker.zoidlab.ai", glyph: "🧠", accent: "#818cf8",
    required_plan: "pro", release_channel: "prototype", status: "active", health_path: "/api/health",
    capabilities: ["dynamic-memory", "recall", "rules", "redaction", "forget", "export"],
    integration_targets: ["trustgate", "eval", "builder", "swarmlab", "marketplace"],
    support_url: SUPPORT,
  },
  {
    package_id: "rag", package_number: "05", name: "RAG Builder",
    tagline: "Build, test, and govern trusted AI knowledge systems — citation-first RAG.",
    domain: "rag.zoidlab.ai", url: "https://rag.zoidlab.ai", glyph: "📚", accent: "#22d3ee",
    required_plan: "pro", release_channel: "prototype", status: "active", health_path: "/api/health",
    capabilities: ["ingestion", "chunk-inspection", "retrieval-test", "cited-qa", "eval", "export", "deploy-endpoint"],
    integration_targets: ["trustgate", "eval", "modelbench", "spendguard", "builder", "marketplace"],
    support_url: SUPPORT,
  },
  {
    package_id: "trustgate", package_number: "06", name: "TrustGate",
    tagline: "Define, test, and enforce AI usage policies — the authoritative policy decision point.",
    domain: "trustgate.zoidlab.ai", url: "https://trustgate.zoidlab.ai", glyph: "⛨", accent: "#7c5cfc",
    required_plan: "pro", release_channel: "prototype", status: "active", health_path: "/api/health",
    capabilities: ["policy-engine", "decision-api", "violations", "approvals", "audit", "export"],
    integration_targets: ["builder", "marketplace", "prompter", "memorymaker", "rag", "spendguard", "modelbench", "eval"],
    support_url: SUPPORT,
  },
  {
    package_id: "spendguard", package_number: "07", name: "SpendGuard",
    tagline: "See where AI spend goes and cut it — cost breakdowns, budgets, savings simulator.",
    domain: "spendguard.zoidlab.ai", url: "https://spendguard.zoidlab.ai", glyph: "$", accent: "#34d399",
    required_plan: "pro", release_channel: "prototype", status: "active", health_path: "/api/health",
    capabilities: ["usage-ingest", "breakdown", "budgets", "savings-sim", "recommendations", "export"],
    integration_targets: ["builder", "rag", "modelbench", "eval", "prompter", "trustgate"],
    support_url: SUPPORT,
  },
  {
    package_id: "modelbench", package_number: "08", name: "ModelBench",
    tagline: "Which model wins on your workload? Real relay benchmarks of speed, cost, quality.",
    domain: "modelbench.zoidlab.ai", url: "https://modelbench.zoidlab.ai", glyph: "◈", accent: "#f59e0b",
    required_plan: "pro", release_channel: "prototype", status: "active", health_path: "/api/health",
    capabilities: ["datasets", "real-benchmark", "leaderboard", "quality-judge", "reports", "export"],
    integration_targets: ["prompter", "rag", "spendguard", "eval"],
    support_url: SUPPORT,
  },
  {
    package_id: "eval", package_number: "09", name: "Eval",
    tagline: "Is this AI good enough to ship? LLM-judge evaluation with a readiness verdict.",
    domain: "eval.zoidlab.ai", url: "https://eval.zoidlab.ai", glyph: "✓", accent: "#0ea5e9",
    required_plan: "pro", release_channel: "prototype", status: "active", health_path: "/api/health",
    capabilities: ["targets", "criteria", "test-sets", "llm-judge", "readiness-verdict", "failures", "export"],
    integration_targets: ["builder", "rag", "prompter", "modelbench", "trustgate"],
    support_url: SUPPORT,
  },
  {
    package_id: "visionlab", package_number: "10", name: "VisionLab",
    tagline: "See, extract, structure — turn images into schema-shaped data with confidence & risk flags.",
    domain: "vision.zoidlab.ai", url: "https://vision.zoidlab.ai", glyph: "👁", accent: "#f472b6",
    required_plan: "pro", release_channel: "prototype", status: "active", health_path: "/api/health",
    capabilities: ["vision-extraction", "structured-schema", "risk-flags"],
    integration_targets: ["prompter", "modelbench", "eval", "trustgate", "spendguard", "builder", "marketplace"],
    support_url: SUPPORT,
  },
  {
    package_id: "voicelab", package_number: "11", name: "VoiceLab",
    tagline: "Design voice agents, then test them in real simulated calls scored by an LLM judge.",
    domain: "voice.zoidlab.ai", url: "https://voice.zoidlab.ai", glyph: "🎙", accent: "#2dd4bf",
    required_plan: "pro", release_channel: "prototype", status: "active", health_path: "/api/health",
    capabilities: ["voice-agents", "call-simulation", "guardrail-scoring"],
    integration_targets: ["prompter", "rag", "mcplab", "eval", "trustgate", "spendguard", "marketplace"],
    support_url: SUPPORT,
  },
  {
    package_id: "mcplab", package_number: "12", name: "MCPLab",
    tagline: "Discover, test, govern, and version MCP connectors — real handshake, real tool calls.",
    domain: "mcplab.zoidlab.ai", url: "https://mcplab.zoidlab.ai", glyph: "🔌", accent: "#818cf8",
    required_plan: "pro", release_channel: "prototype", status: "active", health_path: "/api/health",
    capabilities: ["connector-discovery", "governed-test-calls", "immutable-versions"],
    integration_targets: ["builder", "swarmlab", "marketplace", "trustgate", "spendguard", "eval"],
    support_url: SUPPORT,
  },
  {
    package_id: "swarmlab", package_number: "13", name: "SwarmLab",
    tagline: "Compose agent swarms with typed handoffs and run them for real — bounded, replayable.",
    domain: "swarm.zoidlab.ai", url: "https://swarm.zoidlab.ai", glyph: "🐝", accent: "#fbbf24",
    required_plan: "pro", release_channel: "prototype", status: "active", health_path: "/api/health",
    capabilities: ["multi-agent", "typed-handoffs", "bounded-replayable-runs"],
    integration_targets: ["builder", "prompter", "memorymaker", "rag", "mcplab", "trustgate", "spendguard", "eval", "marketplace"],
    support_url: SUPPORT,
  },
];

export function getPackage(id: string) {
  return REGISTRY.find((p) => p.package_id === id);
}
