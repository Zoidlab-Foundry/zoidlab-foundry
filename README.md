# ZoidLab Foundry

The front door for the ZoidLab app suite — an authenticated launcher at
**foundry.zoidlab.ai**. Sign in once with your Nyquest Pro account and launch any
ZoidLab app; the session cookie is scoped to `.zoidlab.ai`, so it carries across every
subdomain app (builder, and whatever's next).

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
