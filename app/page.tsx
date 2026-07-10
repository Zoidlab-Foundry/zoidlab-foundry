"use client";
import { useEffect, useState } from "react";
import { APPS } from "../lib/apps";

export default function Home() {
  const [user, setUser] = useState<{ email: string; tier: string } | null>(null);

  useEffect(() => {
    fetch("/api/whoami").then((r) => (r.ok ? r.json() : null)).then((u) => u && setUser(u)).catch(() => {});

    const cv = document.getElementById("glow") as HTMLCanvasElement | null;
    if (!cv) return;
    const cx = cv.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const blobs = [
      { x: 0.22, y: 0.28, r: 340, hue: "79,209,197", s: 0.0002, p: 1 },
      { x: 0.8, y: 0.24, r: 300, hue: "124,92,252", s: 0.00028, p: 3 },
      { x: 0.5, y: 0.82, r: 360, hue: "129,140,248", s: 0.00016, p: 5 },
    ];
    let raf = 0;
    const draw = (t: number) => {
      const w = (cv.width = window.innerWidth), h = (cv.height = window.innerHeight);
      cx.clearRect(0, 0, w, h);
      for (const b of blobs) {
        const bx = b.x * w + Math.sin(t * b.s + b.p) * 60;
        const by = b.y * h + Math.cos(t * b.s * 1.3 + b.p) * 46;
        const g = cx.createRadialGradient(bx, by, 0, bx, by, b.r);
        g.addColorStop(0, `rgba(${b.hue},0.13)`);
        g.addColorStop(1, `rgba(${b.hue},0)`);
        cx.fillStyle = g;
        cx.fillRect(bx - b.r, by - b.r, b.r * 2, b.r * 2);
      }
      if (!reduced) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  const logout = async () => {
    await fetch("/api/session", { method: "DELETE" }).catch(() => {});
    location.href = "/gate";
  };

  return (
    <>
      <canvas id="glow" aria-hidden="true" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col px-6">
        {/* top bar */}
        <header className="flex items-center gap-3 py-6">
          <svg width="30" height="30" viewBox="0 0 96 96" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="z" x1="20" y1="18" x2="78" y2="80" gradientUnits="userSpaceOnUse">
                <stop stopColor="#c026d3" /><stop offset="0.5" stopColor="#8b3ffa" /><stop offset="1" stopColor="#2f80ed" />
              </linearGradient>
            </defs>
            <path d="M22 26 H74 L32 70 H74" stroke="url(#z)" strokeWidth="18" strokeLinejoin="round" strokeLinecap="round" />
            <line x1="62.2" y1="38.3" x2="43.8" y2="57.7" stroke="#0c0c1c" strokeWidth="3.4" strokeLinecap="round" />
            <circle cx="62.2" cy="38.3" r="4.7" fill="#0c0c1c" /><circle cx="53" cy="48" r="4.7" fill="#0c0c1c" /><circle cx="43.8" cy="57.7" r="4.7" fill="#0c0c1c" />
          </svg>
          <span className="text-[16px] font-semibold tracking-[0.22em] text-ink">ZOIDLAB</span>
          {user && (
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden text-[12px] text-dim sm:inline">{user.email}</span>
              <span className="rounded bg-vi/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-ind">{user.tier}</span>
              <button onClick={logout} className="rounded-md px-2 py-1 text-[12px] text-dim hover:bg-line hover:text-ink">Sign out</button>
            </div>
          )}
        </header>

        {/* hero */}
        <div className="pt-10 pb-8">
          <div className="mb-3 text-[12px] font-semibold uppercase tracking-[0.3em] text-cy">Your workspace</div>
          <h1 className="text-[34px] font-light leading-tight text-ink sm:text-[44px]">
            Everything you build, <span className="font-semibold" style={{ background: "linear-gradient(100deg,#4fd1c5,#818cf8,#7c5cfc)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>in one place</span>.
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-dim">
            The ZoidLab app suite, powered by Nyquest. Sign in once — launch any tool.
          </p>
        </div>

        {/* app tiles */}
        <div className="grid grid-cols-1 gap-4 pb-8 sm:grid-cols-2">
          {APPS.map((app) => {
            const live = app.status === "live" && app.url;
            const Card = (
              <div className={`group h-full rounded-2xl border border-line bg-panel p-5 transition-colors ${live ? "hover:border-cy/50" : "opacity-60"}`}>
                <div className="mb-3 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl text-[20px]" style={{ background: `${app.accent}22`, color: app.accent }}>{app.glyph}</span>
                  <div className="text-[16px] font-semibold text-ink">{app.name}</div>
                </div>
                <p className="mb-4 text-[13px] leading-relaxed text-dim">{app.tagline}</p>
                {live ? (
                  <span className="text-[13px] font-semibold text-cy">Open →</span>
                ) : (
                  <span className="rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-wider text-dim/70">Coming soon</span>
                )}
              </div>
            );
            return live ? (
              <a key={app.slug} href={app.url}>{Card}</a>
            ) : (
              <div key={app.slug}>{Card}</div>
            );
          })}
          {/* build-more placeholder */}
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-line/70 p-5 text-center text-[12px] leading-relaxed text-dim/60">
            More ZoidLab apps land here as we build them.
          </div>
        </div>

        <footer className="mt-auto py-6 text-[11px] tracking-[0.2em] text-dim/60">
          ZOIDLAB · POWERED BY <a href="https://nyquest.ai" className="text-dim/80 hover:text-cy">NYQUEST</a>
        </footer>
      </div>
    </>
  );
}
