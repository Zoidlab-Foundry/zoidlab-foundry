// Canonical Foundry PROVIDER CATALOG — one source of truth for provider/model
// capabilities and VERSIONED pricing (blueprint §3, §4.1, §6.3, §7.7).
//
// Pricing is a named, immutable snapshot. Cost is computed once at ingest against a
// snapshot id and stored — never silently recomputed with newer prices (§7.7). Apps
// (SpendGuard, ModelBench, Builder) should treat this catalog as authoritative and
// record `pricing_snapshot_id` on every usage event.

export const PRICING_SNAPSHOT_ID = "price_2025_06";
export const PRICING_SNAPSHOT_DATE = "2025-06";

export type Capability = "chat" | "vision" | "tools" | "audio" | "embedding" | "reasoning" | "image" | "structured_output";

export interface ModelEntry {
  provider: string;
  model: string;            // catalog model id (bare, provider-prefixed forms resolve to this)
  input_per_m: number;      // USD / 1M input tokens
  output_per_m: number;     // USD / 1M output tokens
  context: number;          // context window (tokens)
  tier: "frontier" | "efficient" | "reasoning" | "open";
  capabilities: Capability[];
}

// USD per 1M tokens. Snapshot 2025-06 published list prices.
export const CATALOG: ModelEntry[] = [
  { provider: "openai", model: "gpt-4o", input_per_m: 2.5, output_per_m: 10, context: 128000, tier: "frontier", capabilities: ["chat", "vision", "tools", "structured_output"] },
  { provider: "openai", model: "gpt-4o-mini", input_per_m: 0.15, output_per_m: 0.6, context: 128000, tier: "efficient", capabilities: ["chat", "vision", "tools", "structured_output"] },
  { provider: "openai", model: "gpt-4.1", input_per_m: 2, output_per_m: 8, context: 1000000, tier: "frontier", capabilities: ["chat", "vision", "tools", "structured_output"] },
  { provider: "openai", model: "gpt-4.1-mini", input_per_m: 0.4, output_per_m: 1.6, context: 1000000, tier: "efficient", capabilities: ["chat", "tools", "structured_output"] },
  { provider: "openai", model: "gpt-5", input_per_m: 1.25, output_per_m: 10, context: 400000, tier: "frontier", capabilities: ["chat", "vision", "tools", "reasoning", "structured_output"] },
  { provider: "openai", model: "gpt-5-mini", input_per_m: 0.25, output_per_m: 2, context: 400000, tier: "efficient", capabilities: ["chat", "tools", "structured_output"] },
  { provider: "openai", model: "o3-mini", input_per_m: 1.1, output_per_m: 4.4, context: 200000, tier: "reasoning", capabilities: ["chat", "reasoning", "tools"] },
  { provider: "anthropic", model: "claude-opus-4-8", input_per_m: 15, output_per_m: 75, context: 200000, tier: "frontier", capabilities: ["chat", "vision", "tools", "reasoning", "structured_output"] },
  { provider: "anthropic", model: "claude-sonnet-5", input_per_m: 3, output_per_m: 15, context: 200000, tier: "frontier", capabilities: ["chat", "vision", "tools", "structured_output"] },
  { provider: "anthropic", model: "claude-sonnet-4.5", input_per_m: 3, output_per_m: 15, context: 200000, tier: "frontier", capabilities: ["chat", "vision", "tools", "structured_output"] },
  { provider: "anthropic", model: "claude-3.5-sonnet", input_per_m: 3, output_per_m: 15, context: 200000, tier: "frontier", capabilities: ["chat", "vision", "tools"] },
  { provider: "anthropic", model: "claude-haiku-4-5", input_per_m: 0.8, output_per_m: 4, context: 200000, tier: "efficient", capabilities: ["chat", "vision", "tools"] },
  { provider: "anthropic", model: "claude-3.5-haiku", input_per_m: 0.8, output_per_m: 4, context: 200000, tier: "efficient", capabilities: ["chat", "tools"] },
  { provider: "anthropic", model: "claude-3-opus", input_per_m: 15, output_per_m: 75, context: 200000, tier: "frontier", capabilities: ["chat", "vision"] },
  { provider: "google", model: "gemini-2.5-pro", input_per_m: 1.25, output_per_m: 10, context: 1000000, tier: "frontier", capabilities: ["chat", "vision", "audio", "tools", "structured_output"] },
  { provider: "google", model: "gemini-2.5-flash", input_per_m: 0.075, output_per_m: 0.3, context: 1000000, tier: "efficient", capabilities: ["chat", "vision", "audio", "tools"] },
  { provider: "google", model: "gemini-1.5-flash", input_per_m: 0.075, output_per_m: 0.3, context: 1000000, tier: "efficient", capabilities: ["chat", "vision"] },
  { provider: "deepseek", model: "deepseek-chat", input_per_m: 0.27, output_per_m: 1.1, context: 64000, tier: "efficient", capabilities: ["chat", "tools"] },
  { provider: "deepseek", model: "deepseek-reasoner", input_per_m: 0.55, output_per_m: 2.19, context: 64000, tier: "reasoning", capabilities: ["chat", "reasoning"] },
  { provider: "meta", model: "llama-4-70b", input_per_m: 0.59, output_per_m: 0.79, context: 128000, tier: "open", capabilities: ["chat", "tools"] },
  { provider: "meta", model: "llama-3.3-70b", input_per_m: 0.59, output_per_m: 0.79, context: 128000, tier: "open", capabilities: ["chat"] },
  { provider: "mistral", model: "mistral-large", input_per_m: 2, output_per_m: 6, context: 128000, tier: "frontier", capabilities: ["chat", "tools"] },
];

export function snapshot() {
  return { pricing_snapshot_id: PRICING_SNAPSHOT_ID, snapshot_date: PRICING_SNAPSHOT_DATE, models: CATALOG.length };
}
