# league-of-web — Foundation Design

**Date:** 2026-07-08
**Status:** Approved

## Purpose

A 1:1 web clone of the League of Legends client, built component by component, for display/portfolio purposes. Components are presentational ("dummy") but designed so real logic and an API can be connected later without rewriting them. The project doubles as a showcase UI library (Storybook-like, but custom-built and part of the deployed site).

## Goals

- Pixel-faithful recreations of LoL client UI on the web.
- Every component visible and browsable in a custom `/showcase` route.
- Agent-friendly repo: consistent conventions, skills, and a GitHub Issues kanban so agents can pick tasks autonomously.
- Deployed on Vercel, auto-deploy from `main`.

## Non-goals (for now)

- Real game logic, sockets, or Riot API integration (fixture layer designed so this can come later).
- Unit test infrastructure (added when logic-bearing components appear).
- Authentication, user accounts.

## Architecture — Turborepo monorepo

pnpm workspaces + Turborepo.

```
league-of-web/
  apps/
    web/                    # Next.js app: client clone routes + /showcase
      src/app/(client)/     # LoL client clone screens
      src/app/showcase/     # component library UI
  packages/
    ui/                     # @low/ui — all components, grouped by domain
      src/chrome/           # navbar, window frame, buttons, currency display...
      src/champ-select/     # (future)
      src/collection/       # (future)
    tokens/                 # @low/tokens — Hextech design tokens (CSS @theme + TS)
    fixtures/               # @low/fixtures — typed dummy data + Data Dragon helpers
  turbo.json
  pnpm-workspace.yaml
```

- **apps/web**: Next.js (App Router, latest), TypeScript strict, Tailwind v4.
- **@low/ui**: React components only. No data fetching, no app imports.
- **@low/tokens**: single source of styling truth. Tailwind v4 `@theme` CSS plus TS constants where needed.
- **@low/fixtures**: typed mock data (summoner, friends list, lobby, store items...) and Data Dragon URL helpers/types.
- Future API: new `apps/api` or route handlers in `apps/web` — package boundary already clean.

## Component contract

- Pure presentational: props in, callbacks out (`onSelect`, never fetch).
- Data shapes come from `@low/fixtures` types; components never import fixture *values*, only types. Pages/showcase supply values.
- When an API exists later: swap fixture value for hook at the page level; component unchanged.
- Every component ships with a showcase file — **no component is done without a showcase entry**.

## Showcase mechanics

- Each component folder: `component.tsx` + `component.showcase.tsx`.
- Showcase file exports metadata: name, description, and a variants array (`{ name, render, notes }`).
- `packages/ui/src/registry.ts` aggregates all showcase entries.
- `/showcase` in apps/web: Hextech-styled sidebar listing components by domain; per-component page renders variants on dark canvas with notes. The showcase itself is a portfolio piece.

## Design tokens (Hextech)

- Gold: `#C8AA6E`, `#785A28` (borders, accents). Blue: `#0AC8B9`, `#005A82` (magic/interactive). Dark: `#010A13`, `#1E2328` (surfaces).
- Display font: Beaufort-like free alternative (e.g. Marcellus); body: Spiegel-like (e.g. Inter).
- Border/glow/frame utilities in @low/tokens.
- Rule: agents never hardcode hex values — tokens only. Documented in CLAUDE.md.

## Data source

- Riot Data Dragon public CDN (`ddragon.leagueoflegends.com`) for real champion splash art, icons, names — no API key.
- Everything else: typed local fixtures in @low/fixtures.

## Agentic workflow

- **CLAUDE.md** (root): project rules — component contract, folder conventions, token usage, showcase requirement, definition of done, monorepo commands.
- **Skills** (`.claude/skills/`):
  - `new-component` — recipe: scaffold folder, build component, add showcase entry, register, verify in showcase.
  - `hextech-style` — design language reference: palette, typography, frame patterns, dos/don'ts.
  - `task-workflow` — pick GitHub issue (`gh issue list --label "status:ready"`), assign, branch, PR, link issue, move labels.
- **GitHub Issues kanban**:
  - Labels: `type:component`, `area:chrome|champ-select|collection|login|store`, `status:ready|in-progress|review`, `priority:1|2|3`.
  - Component issue template: description, reference screenshot slot, acceptance criteria.
  - Seed: ~8 core-chrome issues (window frame, top navbar, primary/secondary buttons, currency display RP/BE, player hovercard, tooltip, tab bar, modal frame).
- Repo: **public**, `matintosh/league-of-web`.

## Verification gate

TypeScript strict + ESLint + `turbo build` passing. Visual verification via showcase in dev server. Vitest deferred until logic components exist.

## Deployment

Vercel, full setup: `vercel link` + `vercel git connect` after first push; auto-deploy on `main`, preview deploys on PRs.

## Build order (first milestone)

1. Monorepo scaffold (turbo, pnpm workspaces, apps/web, three packages, CI-quality lint/ts config).
2. Tokens package with Hextech theme; base showcase shell at `/showcase`.
3. CLAUDE.md + three skills + issue template + labels + seed issues.
4. Push to GitHub, connect Vercel, verify deploy.
5. First component (primary button) end-to-end through the workflow to prove the loop.
