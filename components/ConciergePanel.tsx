"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/* Foundry concierge — "which app do I use for X?"
   Read-only by construction: it recommends apps and deep-links to them, and never touches
   app data. Each app's own ✦ Assist panel does the work once you arrive. */

type App = { name: string; url: string; glyph: string; tagline: string };
type Msg = { role: "user" | "assistant"; content: string; apps?: App[] };

const SUGGESTIONS = [
  "I have a pile of PDFs and want to answer questions about them",
  "Which model is cheapest for my prompts?",
  "I need test data to evaluate a prompt",
  "How do I put a policy in front of AI actions?",
];

export default function ConciergePanel() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, busy]);

  const send = async (text: string) => {
    if (!text.trim() || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: text.trim() }];
    setMsgs(next); setInput(""); setBusy(true);
    try {
      const r = await fetch("/api/assistant/chat", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })) }),
      });
      const a = await r.json();
      setMsgs((m) => [...m, { role: "assistant", content: a.text || "(no answer)", apps: a.apps || [] }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: "Could not reach the concierge — try again." }]);
    } finally { setBusy(false); }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open the Foundry concierge"
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-line bg-panel px-4 py-2.5 text-[13px] font-semibold shadow-lg transition hover:border-cy/60"
      >
        <span className="text-cy">✦</span> Which app?
      </button>
      {open && createPortal(
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Foundry concierge">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute bottom-0 right-0 top-0 flex w-full max-w-[420px] flex-col border-l border-line bg-bg shadow-2xl">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-cy/15 text-[13px] text-cy">✦</span>
              <div>
                <div className="text-[14px] font-semibold">Foundry concierge</div>
                <div className="text-[11px] text-dim">Tells you which app to use — each app has its own assistant inside.</div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close"
                className="ml-auto rounded-md px-2 py-1 text-[13px] text-dim hover:text-ink">✕</button>
            </div>
            <div ref={bodyRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {msgs.length === 0 && (
                <div className="space-y-2">
                  <div className="rounded-lg border border-line bg-panel p-3 text-[13px] text-dim">
                    Describe what you are trying to do and I will point you at the right app.
                  </div>
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => send(s)}
                      className="block w-full rounded-lg border border-line px-3 py-2 text-left text-[12.5px] text-dim transition hover:border-cy/50 hover:text-ink">
                      {s}
                    </button>
                  ))}
                </div>
              )}
              {msgs.map((m, i) => (
                <div key={i} className="space-y-2">
                  <div className={`max-w-[92%] whitespace-pre-wrap rounded-lg px-3 py-2 text-[13px] leading-relaxed ${m.role === "user" ? "ml-auto bg-cy/15" : "border border-line bg-panel"}`}>
                    {m.content}
                  </div>
                  {!!m.apps?.length && (
                    <div className="space-y-1.5">
                      {m.apps.map((a) => (
                        <a key={a.name} href={a.url}
                          className="flex items-start gap-2 rounded-lg border border-line bg-panel px-3 py-2 transition hover:border-cy/60">
                          <span className="text-[15px]">{a.glyph}</span>
                          <span>
                            <span className="block text-[13px] font-semibold">{a.name} →</span>
                            <span className="block text-[11.5px] text-dim">{a.tagline}</span>
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {busy && <div className="text-[12px] text-dim">thinking…</div>}
            </div>
            <form className="border-t border-line p-3" onSubmit={(e) => { e.preventDefault(); send(input); }}>
              <div className="flex gap-2">
                <input value={input} onChange={(e) => setInput(e.target.value)} disabled={busy}
                  placeholder="What are you trying to do?"
                  className="flex-1 rounded-lg border border-line bg-panel px-3 py-2 text-[13px] outline-none focus:border-cy/60" />
                <button type="submit" disabled={busy || !input.trim()}
                  className="rounded-lg bg-cy px-3.5 py-2 text-[13px] font-semibold text-black disabled:opacity-50">Ask</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
