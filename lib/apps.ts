// Legacy view over the canonical registry — kept so existing importers keep working.
// The single source of truth is lib/registry.ts.
import { REGISTRY } from "./registry";

export interface AppEntry {
  slug: string;
  name: string;
  tagline: string;
  url?: string;
  glyph: string;
  accent: string;
  status: "live" | "soon";
}

export const APPS: AppEntry[] = REGISTRY.map((p) => ({
  slug: p.package_id,
  name: p.name,
  tagline: p.tagline,
  url: p.url,
  glyph: p.glyph,
  accent: p.accent,
  status: p.status === "active" ? "live" : "soon",
}));
