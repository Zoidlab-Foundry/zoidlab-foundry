# ZoidLab Foundry

The front door for the **ZoidLab** platform — the living lab of [Nyquest](https://nyquest.ai).
Foundry is an authenticated launcher at **foundry.zoidlab.ai**: sign in once with your Nyquest
account and launch any ZoidLab app. The session cookie is scoped to `.zoidlab.ai`, so it carries
across every subdomain app.

## The ZoidLab platform

| App | What it is | Live at |
|-----|-----------|---------|
| **Foundry** (this repo) | The hub / front door — one sign-in, launch everything | [foundry.zoidlab.ai](https://foundry.zoidlab.ai) |
| **AI Workflow Builder** | Visually build, test, and deploy AI workflows on the Nyquest runtime | [builder.zoidlab.ai](https://builder.zoidlab.ai) · [repo](https://github.com/Zoidlab-Foundry-m/zoidlab-builder) |
| **Agent Marketplace** | Browse, test, install, clone, and publish reusable AI agents | [marketplace.zoidlab.ai](https://marketplace.zoidlab.ai) · [repo](https://github.com/Zoidlab-Foundry-m/zoidlab-marketplace) |

## Access model — Nyquest Pro

ZoidLab has **no separate login**. Your **Nyquest** account *is* your ZoidLab identity:

- Sign in through Nyquest (open Foundry, or the "ZoidLab" link in the Nyquest app). The token
  is exchanged for a short-lived one-time code, never placed in a URL.
- **A Nyquest Pro or Teams plan is required** to use the apps (Foundry + Builder are Pro-gated;
  Marketplace browsing is open, but installing / cloning / publishing require sign-in).
- One signed session (`zb_session`, `Domain=.zoidlab.ai`) is trusted by every `*.zoidlab.ai` app —
  log in once, use them all. Workflow runs and agent actions bill **your own Nyquest wallet**.
- No Nyquest account yet? Get one at [app.nyquest.ai](https://app.nyquest.ai).

---


## What it is
- Next.js launcher. Nyquest Pro SSO (same handoff/session flow as the builder, reused).
- **Shared session**: cookie `zb_session` on `Domain=.zoidlab.ai`, signed with the shared
  `BUILDER_SESSION_SECRET`. Every `*.zoidlab.ai` app trusts it — one login for all.
- **Apps registry** in `lib/apps.ts` — adding an app to the hub is one entry.

## Auth flow (front door)
1. Nyquest app "ZoidLab" link → POST token to `foundry.zoidlab.ai/api/handoff` → one-time code
2. Opens `foundry.zoidlab.ai/enter#c=<code>` → `/api/session` sets the shared cookie
3. Launcher lists apps; clicking one opens e.g. `builder.zoidlab.ai` — no re-auth (shared cookie)

## Env
```
BUILDER_SESSION_SECRET=   # MUST match the builder's value
NYQUEST_API=https://api.nyquest.ai
PRO_TIERS=pro,teams
NYQUEST_APP_ORIGIN=https://app.nyquest.ai
SESSION_COOKIE_DOMAIN=.zoidlab.ai
PORT=3200
```

## Deploy
systemd `zoidlab-foundry-web` on :3200, exposed at foundry.zoidlab.ai via the `mcp-zoidberg`
Cloudflare tunnel.
