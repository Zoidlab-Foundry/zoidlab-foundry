// The ZoidLab app registry. Add an app = add an entry here.
// status: "live" (has a url) | "soon" (previewed, not yet launchable)
export interface AppEntry {
  slug: string;
  name: string;
  tagline: string;
  url?: string;
  glyph: string;
  accent: string;
  status: "live" | "soon";
}

export const APPS: AppEntry[] = [
  {
    slug: "builder",
    name: "AI Workflow Builder",
    tagline: "Visually build, test, and deploy AI workflows on the Nyquest runtime.",
    url: "https://builder.zoidlab.ai",
    glyph: "⚡",
    accent: "#4fd1c5",
    status: "live",
  },
  {
    slug: "marketplace",
    name: "Agent Marketplace",
    tagline: "Browse, test, install, and publish reusable AI agents across Nyquest.",
    url: "https://marketplace.zoidlab.ai",
    glyph: "◆",
    accent: "#7c5cfc",
    status: "live",
  },
  {
    slug: "prompter",
    name: "Prompt Studio",
    tagline: "Design, test, version, and govern production prompts — GitHub for enterprise AI prompts.",
    url: "https://prompter.zoidlab.ai",
    glyph: "❝",
    accent: "#22d3ee",
    status: "live",
  },
  {
    slug: "memorymaker",
    name: "MemoryMaker",
    tagline: "Design and govern AI memory systems — inspectable, expiring, tenant-aware memory.",
    url: "https://memorymaker.zoidlab.ai",
    glyph: "🧠",
    accent: "#818cf8",
    status: "live",
  },
  {
    slug: "rag",
    name: "RAG Builder",
    tagline: "Build, test, and govern trusted AI knowledge systems — citation-first RAG. Package 05 · Pro Required.",
    url: "https://rag.zoidlab.ai",
    glyph: "📚",
    accent: "#22d3ee",
    status: "live",
  },
  {
    slug: "trustgate",
    name: "TrustGate",
    tagline: "Define, test, and enforce AI usage policies — the answer to 'is this AI action allowed?'. Package 06 · Pro Required.",
    url: "https://trustgate.zoidlab.ai",
    glyph: "⛨",
    accent: "#7c5cfc",
    status: "live",
  },
  {
    slug: "spendguard",
    name: "SpendGuard",
    tagline: "See where AI spend goes and cut it — cost breakdowns, budgets, and a real savings simulator. Package 07 · Pro Required.",
    url: "https://spendguard.zoidlab.ai",
    glyph: "$",
    accent: "#34d399",
    status: "live",
  },
  {
    slug: "modelbench",
    name: "ModelBench",
    tagline: "Which model wins on your workload? Benchmark speed, cost, and quality with real relay runs. Package 08 · Pro Required.",
    url: "https://modelbench.zoidlab.ai",
    glyph: "◈",
    accent: "#f59e0b",
    status: "live",
  },
  {
    slug: "eval",
    name: "Eval",
    tagline: "Is this AI good enough to ship? Judge answers against criteria for a production-readiness verdict. Package 09 · Pro Required.",
    url: "https://eval.zoidlab.ai",
    glyph: "✓",
    accent: "#0ea5e9",
    status: "live",
  },
];
