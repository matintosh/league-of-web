# league-of-web

A 1:1 web recreation of the League of Legends client for portfolio purposes.
Components are presentational ("dummy") but API-ready. Every component is
browsable in the custom showcase at `/showcase`.

## Commands

- `pnpm dev` — dev server (apps/web on :3000)
- `pnpm typecheck` — all packages (gate: must pass)
- `pnpm build` — production build (gate: must pass)
- `pnpm --filter web lint` — eslint

## Monorepo layout

- `apps/web` — Next.js App Router app: client clone routes + `/showcase`
- `packages/ui` (`@low/ui`) — ALL components, grouped by area folder:
  `src/chrome/`, `src/champ-select/`, `src/collection/`, `src/login/`, `src/store/`, `src/merch/`
- `packages/tokens` (`@low/tokens`) — Hextech design tokens (Tailwind v4 `@theme`)
- `packages/fixtures` (`@low/fixtures`) — typed dummy data + Data Dragon helpers

## Hard rules

1. **Tokens only.** Never hardcode hex colors outside `packages/tokens`.
   Use token classes: `text-gold-1`, `bg-blue-7`, `border-gold-4`, `font-display`, etc.
2. **Component contract.** Components in `@low/ui` are presentational:
   props in, callbacks out (`onSelect`, `onClose`...). NO data fetching in `@low/ui`.
3. **Types, not values.** Components import *types* from `@low/fixtures`.
   Fixture *values* are supplied by pages and showcase files only.
4. **Showcase required.** A component is not done without:
   - `<component>.showcase.tsx` next to it exporting a `ShowcaseEntry`
   - a line registering it in `packages/ui/src/registry.ts`
   - Showcase files are server-safe: never `'use client'` — put stateful demos in a separate `*.demo.tsx` client component.
5. **Faithfulness.** Match the real LoL client as closely as possible.
   Reference screenshots live in the GitHub issue for each component.

## Definition of done

- [ ] Component matches reference (visual check in `/showcase`)
- [ ] Showcase entry with all meaningful variants (states, sizes, edge cases)
- [ ] `pnpm typecheck` and `pnpm build` pass
- [ ] No hardcoded colors, no fetching, props documented with JSDoc
- [ ] PR references its issue (`Closes #N`)

## Workflow

Tasks live in GitHub Issues (`gh issue list --label "status:ready"`).
See skills: `new-component` (build recipe), `hextech-style` (design language),
`task-workflow` (issue → branch → PR loop).

## Data Dragon

Champion/profile assets come from Riot's public CDN via helpers in
`@low/fixtures` (`championSquareUrl`, `championSplashUrl`, `profileIconUrl`).
Pinned version: see `DDRAGON_VERSION` in `packages/fixtures/src/ddragon.ts`.
