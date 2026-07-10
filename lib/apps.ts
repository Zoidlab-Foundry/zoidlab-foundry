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
];
