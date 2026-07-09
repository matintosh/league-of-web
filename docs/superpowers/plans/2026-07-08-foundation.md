# league-of-web Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the full league-of-web monorepo foundation: Turborepo + Next.js app with Hextech-themed showcase, agentic workflow (CLAUDE.md, skills, GitHub Issues kanban), Vercel deploy, and one component (HextechButton) shipped end-to-end to prove the loop.

**Architecture:** pnpm-workspace Turborepo. `apps/web` is the only build target (Next.js App Router); `packages/tokens`, `packages/fixtures`, `packages/ui` export raw TypeScript consumed via `transpilePackages`. A registry in `@low/ui` drives a custom `/showcase` route.

**Tech Stack:** Next.js (latest, App Router), TypeScript strict, Tailwind v4, Turborepo, pnpm, gh CLI, Vercel CLI.

## Global Constraints

- Package names exactly: `@low/ui`, `@low/tokens`, `@low/fixtures`.
- TypeScript `strict: true` everywhere; no `any` unless justified in a comment.
- No hardcoded hex colors outside `packages/tokens` — Tailwind token classes only.
- Components are presentational: props in, callbacks out. No fetching in `@low/ui`.
- Components import **types** from `@low/fixtures`, never fixture **values**.
- Every component ships with a `*.showcase.tsx` file and a registry entry.
- Data Dragon version: `16.13.1` (latest as of 2026-07-08).
- Repo: public `matintosh/league-of-web`. Deploy: Vercel project `league-of-web`, root directory `apps/web`.
- Verification gate per task: `pnpm typecheck` (and `pnpm build` where stated) must pass.
- Commit messages: Conventional Commits, trailer `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: Monorepo scaffold

**Files:**
- Create: `pnpm-workspace.yaml`, `turbo.json`, `package.json`, `tsconfig.base.json`, `.gitignore`, `README.md`

**Interfaces:**
- Produces: workspace globs `apps/*`, `packages/*`; turbo tasks `build`, `dev`, `lint`, `typecheck`; `tsconfig.base.json` for all packages to extend.

- [ ] **Step 1: Write root config files**

`pnpm-workspace.yaml`:
```yaml
packages:
  - apps/*
  - packages/*
```

`package.json`:
```json
{
  "name": "league-of-web",
  "private": true,
  "packageManager": "pnpm@10.16.1",
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck"
  }
}
```

`turbo.json`:
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "lint": {},
    "typecheck": { "dependsOn": ["^typecheck"] },
    "dev": { "cache": false, "persistent": true }
  }
}
```

`tsconfig.base.json`:
```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "preserve",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "noUncheckedIndexedAccess": true,
    "isolatedModules": true
  }
}
```

`.gitignore`:
```
node_modules/
.next/
.turbo/
.vercel/
.env*
!.env.example
*.tsbuildinfo
.DS_Store
```

`README.md`:
```markdown
# league-of-web

A 1:1 web recreation of the League of Legends client, built component by component.
Every component is browsable in the built-in showcase at `/showcase`.

Portfolio project — UI is presentational; a real API may be connected later.

## Stack

Turborepo · Next.js (App Router) · TypeScript · Tailwind v4 · Vercel

## Develop

pnpm install
pnpm dev        # apps/web on http://localhost:3000
pnpm typecheck
pnpm build
```

- [ ] **Step 2: Install turbo**

Run: `pnpm add -Dw turbo`
Expected: `devDependencies` gains `turbo`, lockfile created, no errors.

- [ ] **Step 3: Verify turbo runs**

Run: `pnpm turbo --version`
Expected: version `2.x` printed.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: monorepo scaffold (pnpm workspaces + turborepo)"
```

---

### Task 2: @low/tokens package

**Files:**
- Create: `packages/tokens/package.json`, `packages/tokens/tsconfig.json`, `packages/tokens/src/theme.css`, `packages/tokens/src/index.ts`

**Interfaces:**
- Produces: CSS import `@low/tokens/theme.css` (Tailwind v4 `@theme` block defining `--color-gold-1..6`, `--color-blue-1..7`, `--color-grey-1..3`, `--color-grey-cool`, `--color-grey-4`, `--color-hextech-black`, `--font-display`, `--font-body`); TS export `palette` object from `@low/tokens`.

- [ ] **Step 1: Write package files**

`packages/tokens/package.json`:
```json
{
  "name": "@low/tokens",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts",
    "./theme.css": "./src/theme.css"
  },
  "scripts": {
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5"
  }
}
```

`packages/tokens/tsconfig.json`:
```json
{
  "extends": "../../tsconfig.base.json",
  "include": ["src"]
}
```

`packages/tokens/src/theme.css` (official Riot Hextech palette):
```css
@theme {
  /* Gold — borders, accents, text highlights */
  --color-gold-1: #f0e6d2;
  --color-gold-2: #c8aa6e;
  --color-gold-3: #c89b3c;
  --color-gold-4: #785a28;
  --color-gold-5: #463714;
  --color-gold-6: #32281e;

  /* Hextech blue — magic, interactive, focus */
  --color-blue-1: #cdfafa;
  --color-blue-2: #0ac8b9;
  --color-blue-3: #0397ab;
  --color-blue-4: #005a82;
  --color-blue-5: #0a323c;
  --color-blue-6: #091428;
  --color-blue-7: #0a1428;

  /* Grey — surfaces, disabled, body text */
  --color-grey-1: #a09b8c;
  --color-grey-2: #5b5a56;
  --color-grey-3: #3c3c41;
  --color-grey-4: #1e2328;
  --color-grey-cool: #1e282d;
  --color-hextech-black: #010a13;

  /* Typography — font files loaded by the app via next/font, exposed as vars */
  --font-display: var(--font-marcellus), "Marcellus", serif;
  --font-body: var(--font-inter), "Inter", sans-serif;
}
```

`packages/tokens/src/index.ts`:
```ts
/** Hextech palette as TS constants — for the rare case CSS classes can't be used (e.g. canvas). */
export const palette = {
  gold1: "#f0e6d2",
  gold2: "#c8aa6e",
  gold3: "#c89b3c",
  gold4: "#785a28",
  gold5: "#463714",
  gold6: "#32281e",
  blue1: "#cdfafa",
  blue2: "#0ac8b9",
  blue3: "#0397ab",
  blue4: "#005a82",
  blue5: "#0a323c",
  blue6: "#091428",
  blue7: "#0a1428",
  grey1: "#a09b8c",
  grey2: "#5b5a56",
  grey3: "#3c3c41",
  grey4: "#1e2328",
  greyCool: "#1e282d",
  hextechBlack: "#010a13",
} as const;

export type Palette = typeof palette;
```

- [ ] **Step 2: Install and typecheck**

Run: `pnpm install && pnpm --filter @low/tokens typecheck`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(tokens): hextech design tokens package"
```

---

### Task 3: @low/fixtures package

**Files:**
- Create: `packages/fixtures/package.json`, `packages/fixtures/tsconfig.json`, `packages/fixtures/src/index.ts`, `packages/fixtures/src/types.ts`, `packages/fixtures/src/ddragon.ts`, `packages/fixtures/src/summoner.ts`

**Interfaces:**
- Produces: types `Summoner`, `Wallet`, `Friend`, `Availability`; helpers `championSquareUrl(id: string): string`, `championSplashUrl(id: string, skin?: number): string`, `profileIconUrl(id: number): string`; const `DDRAGON_VERSION`; fixture values `demoSummoner: Summoner`, `demoFriends: Friend[]`.

- [ ] **Step 1: Write package files**

`packages/fixtures/package.json`:
```json
{
  "name": "@low/fixtures",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": { ".": "./src/index.ts" },
  "scripts": { "typecheck": "tsc --noEmit" },
  "devDependencies": { "typescript": "^5" }
}
```

`packages/fixtures/tsconfig.json`:
```json
{
  "extends": "../../tsconfig.base.json",
  "include": ["src"]
}
```

`packages/fixtures/src/types.ts`:
```ts
export type Availability = "online" | "away" | "in-game" | "in-queue" | "offline";

export interface Wallet {
  /** Riot Points (paid currency) */
  rp: number;
  /** Blue Essence */
  blueEssence: number;
}

export interface Summoner {
  gameName: string;
  tagLine: string;
  level: number;
  profileIconId: number;
  availability: Availability;
}

export interface Friend {
  summoner: Summoner;
  /** e.g. "League of Legends", "Away", custom status text */
  statusText?: string;
  groupName: string;
}
```

`packages/fixtures/src/ddragon.ts`:
```ts
/** Riot Data Dragon — public CDN, no API key. https://developer.riotgames.com/docs/lol#data-dragon */
export const DDRAGON_VERSION = "16.13.1";

const BASE = "https://ddragon.leagueoflegends.com";

/** Square champion icon, 120x120. `id` is the ddragon champion id, e.g. "Ahri", "LeeSin". */
export const championSquareUrl = (id: string): string =>
  `${BASE}/cdn/${DDRAGON_VERSION}/img/champion/${id}.png`;

/** Full splash art, 1215x717. `skin` 0 = default. */
export const championSplashUrl = (id: string, skin = 0): string =>
  `${BASE}/cdn/img/champion/splash/${id}_${skin}.jpg`;

/** Summoner profile icon. */
export const profileIconUrl = (id: number): string =>
  `${BASE}/cdn/${DDRAGON_VERSION}/img/profileicon/${id}.png`;
```

`packages/fixtures/src/summoner.ts`:
```ts
import type { Friend, Summoner, Wallet } from "./types";

export const demoSummoner: Summoner = {
  gameName: "Matintosh",
  tagLine: "LAS",
  level: 247,
  profileIconId: 5212,
  availability: "online",
};

export const demoWallet: Wallet = { rp: 1350, blueEssence: 48210 };

export const demoFriends: Friend[] = [
  {
    summoner: { gameName: "Faker", tagLine: "KR1", level: 812, profileIconId: 6402, availability: "in-game" },
    statusText: "League of Legends",
    groupName: "General",
  },
  {
    summoner: { gameName: "Tyler1", tagLine: "NA1", level: 623, profileIconId: 4368, availability: "in-queue" },
    statusText: "Ranked Solo/Duo",
    groupName: "General",
  },
  {
    summoner: { gameName: "Baus", tagLine: "EUW", level: 590, profileIconId: 5205, availability: "away" },
    groupName: "General",
  },
  {
    summoner: { gameName: "Phreak", tagLine: "NA1", level: 431, profileIconId: 743, availability: "offline" },
    groupName: "Work",
  },
];
```

`packages/fixtures/src/index.ts`:
```ts
export * from "./types";
export * from "./ddragon";
export * from "./summoner";
```

- [ ] **Step 2: Install and typecheck**

Run: `pnpm install && pnpm --filter @low/fixtures typecheck`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(fixtures): typed dummy data + data dragon helpers"
```

---

### Task 4: @low/ui package (showcase types + registry)

**Files:**
- Create: `packages/ui/package.json`, `packages/ui/tsconfig.json`, `packages/ui/src/index.ts`, `packages/ui/src/showcase.ts`, `packages/ui/src/registry.ts`

**Interfaces:**
- Produces: `ShowcaseVariant { name: string; notes?: string; render: () => ReactNode }`; `ShowcaseEntry { slug: string; name: string; area: Area; description: string; variants: ShowcaseVariant[] }`; `type Area = "chrome" | "champ-select" | "collection" | "login" | "store"`; `registry: ShowcaseEntry[]` exported from `@low/ui/registry`.
- Consumes: nothing yet (components come later and import types from `@low/fixtures`).

- [ ] **Step 1: Write package files**

`packages/ui/package.json`:
```json
{
  "name": "@low/ui",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts",
    "./registry": "./src/registry.ts"
  },
  "scripts": { "typecheck": "tsc --noEmit" },
  "peerDependencies": {
    "react": "^19"
  },
  "dependencies": {
    "@low/fixtures": "workspace:*",
    "@low/tokens": "workspace:*"
  },
  "devDependencies": {
    "@types/react": "^19",
    "react": "^19",
    "typescript": "^5"
  }
}
```

`packages/ui/tsconfig.json`:
```json
{
  "extends": "../../tsconfig.base.json",
  "include": ["src"]
}
```

`packages/ui/src/showcase.ts`:
```ts
import type { ReactNode } from "react";

export type Area = "chrome" | "champ-select" | "collection" | "login" | "store";

export interface ShowcaseVariant {
  name: string;
  /** Short note rendered under the variant — props used, state shown, gotchas. */
  notes?: string;
  render: () => ReactNode;
}

export interface ShowcaseEntry {
  /** URL slug, kebab-case, unique. e.g. "hextech-button" */
  slug: string;
  /** Display name. e.g. "Hextech Button" */
  name: string;
  area: Area;
  description: string;
  variants: ShowcaseVariant[];
}
```

`packages/ui/src/registry.ts`:
```ts
import type { ShowcaseEntry } from "./showcase";

/**
 * Every component registers its showcase entry here.
 * Keep sorted by area, then name.
 */
export const registry: ShowcaseEntry[] = [];
```

`packages/ui/src/index.ts`:
```ts
export type { Area, ShowcaseEntry, ShowcaseVariant } from "./showcase";
```

- [ ] **Step 2: Install and typecheck**

Run: `pnpm install && pnpm --filter @low/ui typecheck`
Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(ui): ui package with showcase types and empty registry"
```

---

### Task 5: apps/web — Next.js app wired to tokens

**Files:**
- Create: `apps/web/package.json`, `apps/web/tsconfig.json`, `apps/web/next.config.ts`, `apps/web/postcss.config.mjs`, `apps/web/eslint.config.mjs`, `apps/web/src/app/globals.css`, `apps/web/src/app/layout.tsx`, `apps/web/src/app/page.tsx`, `apps/web/next-env.d.ts` (generated)

**Interfaces:**
- Consumes: `@low/tokens/theme.css`; token classes (`bg-hextech-black`, `text-gold-1`, `font-display`, etc.).
- Produces: running app on `:3000`; root layout exposing `--font-marcellus` and `--font-inter` CSS vars consumed by the tokens theme.

- [ ] **Step 1: Write package.json and install deps**

`apps/web/package.json`:
```json
{
  "name": "web",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@low/fixtures": "workspace:*",
    "@low/tokens": "workspace:*",
    "@low/ui": "workspace:*"
  }
}
```

Run:
```bash
pnpm --filter web add next@latest react@latest react-dom@latest
pnpm --filter web add -D typescript @types/node @types/react @types/react-dom tailwindcss @tailwindcss/postcss eslint eslint-config-next
```
Expected: installs latest Next (16.x) and Tailwind v4.

- [ ] **Step 2: Write config files**

`apps/web/tsconfig.json`:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "allowJs": true,
    "incremental": true,
    "noEmit": true,
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

`apps/web/next.config.ts`:
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@low/ui", "@low/tokens", "@low/fixtures"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "ddragon.leagueoflegends.com" }],
  },
};

export default nextConfig;
```

`apps/web/postcss.config.mjs`:
```js
export default {
  plugins: { "@tailwindcss/postcss": {} },
};
```

`apps/web/eslint.config.mjs`:
```js
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  { ignores: [".next/**"] },
];
```
(If `@eslint/eslintrc` is missing: `pnpm --filter web add -D @eslint/eslintrc`.)

- [ ] **Step 3: Write globals.css, layout, landing page**

`apps/web/src/app/globals.css`:
```css
@import "tailwindcss";
@import "@low/tokens/theme.css";

body {
  @apply bg-hextech-black text-grey-1 font-body antialiased;
}
```

`apps/web/src/app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import { Inter, Marcellus } from "next/font/google";
import "./globals.css";

const marcellus = Marcellus({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marcellus",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "league-of-web",
  description: "A web recreation of the League of Legends client, component by component.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${marcellus.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

`apps/web/src/app/page.tsx`:
```tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="font-display text-5xl uppercase tracking-widest text-gold-1">
        League of Web
      </h1>
      <p className="max-w-md text-center text-grey-1">
        A web recreation of the League of Legends client, built component by component.
      </p>
      <Link
        href="/showcase"
        className="border border-gold-4 px-8 py-3 font-display text-sm uppercase tracking-widest text-gold-2 transition-colors hover:border-gold-2 hover:text-gold-1"
      >
        Component Showcase
      </Link>
    </main>
  );
}
```

- [ ] **Step 4: Verify dev server, typecheck, lint, build**

Run: `pnpm --filter web dev` (background), then `curl -s http://localhost:3000 | grep -o "League of Web" | head -1`
Expected: `League of Web`. Kill dev server.

Run: `pnpm typecheck && pnpm --filter web lint && pnpm build`
Expected: all exit 0. Turbo builds fixtures/tokens/ui typechecks then web build.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(web): nextjs app wired to hextech tokens with landing page"
```

---

### Task 6: Showcase shell

**Files:**
- Create: `apps/web/src/app/showcase/layout.tsx`, `apps/web/src/app/showcase/page.tsx`, `apps/web/src/app/showcase/[slug]/page.tsx`

**Interfaces:**
- Consumes: `registry: ShowcaseEntry[]` from `@low/ui/registry`; `Area`, `ShowcaseEntry` types from `@low/ui`.
- Produces: `/showcase` (index), `/showcase/[slug]` (per-component page). Sidebar groups entries by area.

- [ ] **Step 1: Write showcase layout with sidebar**

`apps/web/src/app/showcase/layout.tsx`:
```tsx
import Link from "next/link";
import { registry } from "@low/ui/registry";
import type { Area } from "@low/ui";

const AREA_LABELS: Record<Area, string> = {
  chrome: "Chrome",
  "champ-select": "Champion Select",
  collection: "Collection",
  login: "Login",
  store: "Store",
};

export default function ShowcaseLayout({ children }: { children: React.ReactNode }) {
  const areas = [...new Set(registry.map((e) => e.area))];

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 shrink-0 border-r border-gold-5 bg-blue-7 p-6">
        <Link href="/showcase" className="font-display text-xl uppercase tracking-widest text-gold-1">
          Showcase
        </Link>
        <nav className="mt-8 flex flex-col gap-6">
          {areas.length === 0 && (
            <p className="text-sm text-grey-2">No components yet.</p>
          )}
          {areas.map((area) => (
            <div key={area}>
              <h2 className="mb-2 text-xs uppercase tracking-widest text-gold-4">
                {AREA_LABELS[area]}
              </h2>
              <ul className="flex flex-col gap-1">
                {registry
                  .filter((e) => e.area === area)
                  .map((e) => (
                    <li key={e.slug}>
                      <Link
                        href={`/showcase/${e.slug}`}
                        className="block px-2 py-1 text-sm text-grey-1 transition-colors hover:bg-grey-cool hover:text-gold-1"
                      >
                        {e.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
```

- [ ] **Step 2: Write showcase index and component page**

`apps/web/src/app/showcase/page.tsx`:
```tsx
import { registry } from "@low/ui/registry";

export default function ShowcaseIndex() {
  return (
    <div>
      <h1 className="font-display text-3xl uppercase tracking-widest text-gold-1">
        Component Showcase
      </h1>
      <p className="mt-4 max-w-xl text-grey-1">
        Every component of league-of-web, browsable with its variants.
        {registry.length} component{registry.length === 1 ? "" : "s"} registered.
      </p>
    </div>
  );
}
```

`apps/web/src/app/showcase/[slug]/page.tsx`:
```tsx
import { notFound } from "next/navigation";
import { registry } from "@low/ui/registry";

export function generateStaticParams() {
  return registry.map((e) => ({ slug: e.slug }));
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = registry.find((e) => e.slug === slug);
  if (!entry) notFound();

  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-gold-4">{entry.area}</p>
      <h1 className="mt-1 font-display text-3xl uppercase tracking-widest text-gold-1">
        {entry.name}
      </h1>
      <p className="mt-3 max-w-xl text-grey-1">{entry.description}</p>

      <div className="mt-10 flex flex-col gap-8">
        {entry.variants.map((variant) => (
          <section key={variant.name}>
            <h2 className="mb-3 text-sm uppercase tracking-widest text-gold-2">
              {variant.name}
            </h2>
            <div className="rounded-sm border border-grey-4 bg-blue-7 p-10">
              {variant.render()}
            </div>
            {variant.notes && <p className="mt-2 text-sm text-grey-2">{variant.notes}</p>}
          </section>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify**

Run: `pnpm typecheck && pnpm build`
Expected: exits 0. `/showcase` prerendered, shows "No components yet." in sidebar.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(web): registry-driven showcase shell"
```

---

### Task 7: CLAUDE.md

**Files:**
- Create: `CLAUDE.md`

**Interfaces:**
- Produces: project rules every agent session loads. Referenced by skills in Task 8.

- [ ] **Step 1: Write CLAUDE.md**

`CLAUDE.md`:
```markdown
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
  `src/chrome/`, `src/champ-select/`, `src/collection/`, `src/login/`, `src/store/`
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
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: CLAUDE.md project rules for agents"
```

---

### Task 8: Agent skills

**Files:**
- Create: `.claude/skills/new-component/SKILL.md`, `.claude/skills/hextech-style/SKILL.md`, `.claude/skills/task-workflow/SKILL.md`

**Interfaces:**
- Consumes: conventions from CLAUDE.md (Task 7), showcase types from Task 4.
- Produces: three invocable skills for future agent sessions.

- [ ] **Step 1: Write new-component skill**

`.claude/skills/new-component/SKILL.md`:
```markdown
---
name: new-component
description: Use when building any new UI component for league-of-web — scaffolds folder, component, showcase entry, and registry line following the component contract.
---

# New Component Recipe

## Checklist (do in order)

1. **Read the issue.** Get reference screenshot, acceptance criteria, area.
2. **Scaffold.** In `packages/ui/src/<area>/` create:
   - `<component-name>.tsx` — the component
   - `<component-name>.showcase.tsx` — the showcase entry
3. **Build the component.**
   - Presentational only: props in, callbacks out. No fetching.
   - Import types (not values) from `@low/fixtures`.
   - Token classes only (`text-gold-1`, `bg-blue-7`...) — never hex.
   - `'use client'` only if it holds state or handlers.
   - JSDoc every prop.
4. **Write the showcase entry:**

   ```tsx
   import type { ShowcaseEntry } from "../showcase";
   import { MyComponent } from "./my-component";

   export const myComponentShowcase: ShowcaseEntry = {
     slug: "my-component",
     name: "My Component",
     area: "chrome",
     description: "One sentence on what this is in the real client.",
     variants: [
       { name: "Default", render: () => <MyComponent /> },
       { name: "Disabled", notes: "disabled prop", render: () => <MyComponent disabled /> },
     ],
   };
   ```

   Cover every meaningful state: hover-relevant variants, disabled, loading,
   empty, long-text overflow. Showcase files MAY import fixture values.
5. **Register.** Add to `packages/ui/src/registry.ts` (sorted by area, then name):

   ```ts
   import { myComponentShowcase } from "./chrome/my-component.showcase";
   export const registry: ShowcaseEntry[] = [myComponentShowcase];
   ```

6. **Verify.** `pnpm typecheck && pnpm build` pass. Then `pnpm dev` and check
   `/showcase/<slug>` renders all variants correctly.

## File naming

kebab-case files, PascalCase exports. `hextech-button.tsx` exports `HextechButton`.
```

- [ ] **Step 2: Write hextech-style skill**

`.claude/skills/hextech-style/SKILL.md`:
```markdown
---
name: hextech-style
description: Use when styling any league-of-web component — the Hextech design language reference (palette usage, typography, borders, states).
---

# Hextech Design Language

The LoL client aesthetic: dark, ornate, gold-on-near-black with magic blue accents.

## Palette usage (token classes)

- **Surfaces:** `bg-hextech-black` (app bg), `bg-blue-7` / `bg-blue-6` (panels), `bg-grey-cool` / `bg-grey-4` (cards, hover fills)
- **Borders:** `border-gold-4` default, `border-gold-2` hover/active, `border-gold-5` subtle dividers, `border-grey-3` muted/disabled
- **Text:** `text-gold-1` headings/emphasis, `text-gold-2` interactive labels, `text-grey-1` body, `text-grey-2` muted/disabled
- **Magic/interactive accents:** `text-blue-2`, gradients `from-blue-3 to-blue-4`, glows `shadow-[0_0_12px_var(--color-blue-2)]`
- **Danger/ban:** use sparingly; the client uses desaturated reds — if needed add a token first, never inline hex

## Typography

- `font-display` (Marcellus ≈ Beaufort): headings, buttons, nav. Almost always `uppercase tracking-widest`
- `font-body` (Inter ≈ Spiegel): body copy, tooltips, form text
- Sizes skew small: buttons/labels `text-sm`, section headers `text-xs uppercase`

## Signature patterns

- **Buttons:** thin gold border + dark blue gradient fill + uppercase display text; hover = brighter border + subtle blue glow
- **Panels:** 1px `border-gold-5` frame on `bg-blue-7`; corner ornaments are a stretch goal, skip unless the issue asks
- **Dividers:** 1px `border-gold-5` fading at edges (use gradient masks)
- **Focus/selected:** gold border brighten + inner glow, never browser default outline color
- **Transitions:** fast and subtle — `transition-colors duration-150`. The client is snappy, not bouncy. No scale/spring animations.

## Don'ts

- No rounded corners beyond `rounded-sm` (client is squared/sharp)
- No pure white (`#fff`) text — `text-gold-1` is the "white"
- No hardcoded hex anywhere — add a token to `@low/tokens` if genuinely missing
```

- [ ] **Step 3: Write task-workflow skill**

`.claude/skills/task-workflow/SKILL.md`:
```markdown
---
name: task-workflow
description: Use when picking up or completing work in league-of-web — how to claim a GitHub issue, branch, PR, and update the kanban labels.
---

# Task Workflow (GitHub Issues kanban)

## Pick a task

    gh issue list --label "status:ready" --label "type:component"

Pick by priority (`priority:1` first). Read the full issue:

    gh issue view <N>

## Claim it

    gh issue edit <N> --add-label "status:in-progress" --remove-label "status:ready"

## Branch

    git checkout main && git pull
    git checkout -b feat/<component-slug>

## Build

Follow the `new-component` skill. Commit frequently (conventional commits).

## Ship

    git push -u origin feat/<component-slug>
    gh pr create --title "feat(<area>): <component name>" --body "Closes #<N>

    <what was built, variants included, any deviations from reference>"
    gh issue edit <N> --add-label "status:review" --remove-label "status:in-progress"

PR merge closes the issue automatically (via `Closes #N`).
Vercel builds a preview deploy per PR — link it in the PR if reviewing visuals.

## Rules

- One issue = one branch = one PR
- Never commit directly to `main`
- If blocked or the issue is ambiguous, comment on the issue instead of guessing
```

- [ ] **Step 4: Commit**

```bash
git add .claude
git commit -m "feat(agents): new-component, hextech-style, task-workflow skills"
```

---

### Task 9: GitHub — repo, labels, issue template, seed issues

**Files:**
- Create: `.github/ISSUE_TEMPLATE/component.yml`

**Interfaces:**
- Consumes: gh CLI authenticated as `matintosh`.
- Produces: public repo `matintosh/league-of-web` with labels and 8 seeded core-chrome issues; `origin` remote; `main` pushed.

- [ ] **Step 1: Write issue template**

`.github/ISSUE_TEMPLATE/component.yml`:
```yaml
name: Component
description: A UI component to build
title: "[Component] <name>"
labels: ["type:component", "status:ready"]
body:
  - type: input
    id: area
    attributes:
      label: Area
      description: chrome | champ-select | collection | login | store
      placeholder: chrome
    validations:
      required: true
  - type: textarea
    id: description
    attributes:
      label: Description
      description: What this component is in the real LoL client and where it appears.
    validations:
      required: true
  - type: textarea
    id: reference
    attributes:
      label: Reference
      description: Paste screenshot(s) of the real client component here.
  - type: textarea
    id: acceptance
    attributes:
      label: Acceptance criteria
      value: |
        - [ ] Matches reference visually
        - [ ] Showcase entry with all meaningful variants
        - [ ] Presentational only (props in, callbacks out)
        - [ ] Tokens only, typecheck + build pass
    validations:
      required: true
```

- [ ] **Step 2: Commit, create repo, push**

```bash
git add .github
git commit -m "chore: component issue template"
gh repo create league-of-web --public --source=. --push \
  --description "1:1 web recreation of the League of Legends client — Next.js, component by component, with built-in showcase"
```
Expected: repo created at `matintosh/league-of-web`, `main` pushed.

- [ ] **Step 3: Create labels**

```bash
gh label create "type:component" --color C8AA6E --description "UI component to build"
gh label create "area:chrome" --color 0AC8B9 --description "App shell / global chrome"
gh label create "area:champ-select" --color 0AC8B9 --description "Champion select screen"
gh label create "area:collection" --color 0AC8B9 --description "Collection screens"
gh label create "area:login" --color 0AC8B9 --description "Login + splash"
gh label create "area:store" --color 0AC8B9 --description "Store screens"
gh label create "status:ready" --color 2EA44F --description "Ready to pick up"
gh label create "status:in-progress" --color D4A72C --description "Someone is on it"
gh label create "status:review" --color 8250DF --description "PR open, needs review"
gh label create "priority:1" --color D73A4A --description "Build first"
gh label create "priority:2" --color FBCA04 --description "Build soon"
gh label create "priority:3" --color C5DEF5 --description "Nice to have"
```
Expected: 12 labels created (exit 0 each).

- [ ] **Step 4: Seed 8 core-chrome issues**

Create each with `gh issue create --label "type:component" --label "area:chrome" --label "status:ready" --label "priority:N"`. Bodies follow: description + acceptance criteria block from the template.

```bash
gh issue create --title "[Component] HextechButton" \
  --label "type:component" --label "area:chrome" --label "status:ready" --label "priority:1" \
  --body "**Area:** chrome

The primary CTA button of the client (e.g. PLAY, confirm dialogs). Thin gold border, dark blue gradient fill, uppercase Beaufort text, blue glow on hover. Variants: primary, secondary (muted border, transparent fill), disabled, sizes (default, large).

**Acceptance criteria**
- [ ] Matches reference visually
- [ ] Showcase entry with all meaningful variants
- [ ] Presentational only (props in, callbacks out)
- [ ] Tokens only, typecheck + build pass"

gh issue create --title "[Component] WindowFrame" \
  --label "type:component" --label "area:chrome" --label "status:ready" --label "priority:1" \
  --body "**Area:** chrome

The client's outer window chrome: thin gold border frame, top-right window controls (minimize, close), draggable-looking title area. Wraps the whole app shell.

**Acceptance criteria**
- [ ] Matches reference visually
- [ ] Showcase entry with all meaningful variants
- [ ] Presentational only (props in, callbacks out)
- [ ] Tokens only, typecheck + build pass"

gh issue create --title "[Component] TopNavbar" \
  --label "type:component" --label "area:chrome" --label "status:ready" --label "priority:1" \
  --body "**Area:** chrome

Main navigation bar: PLAY button slot on the left, nav items (Home, TFT, Collection, Loot, Store, Profile) with gold underline active state, currency + player slots on the right. Takes nav items as props.

**Acceptance criteria**
- [ ] Matches reference visually
- [ ] Showcase entry with all meaningful variants
- [ ] Presentational only (props in, callbacks out)
- [ ] Tokens only, typecheck + build pass"

gh issue create --title "[Component] CurrencyDisplay" \
  --label "type:component" --label "area:chrome" --label "status:ready" --label "priority:2" \
  --body "**Area:** chrome

RP and Blue Essence counters shown top-right of the navbar: icon + formatted amount + plus-button to buy. Takes a Wallet (see @low/fixtures) as props.

**Acceptance criteria**
- [ ] Matches reference visually
- [ ] Showcase entry with all meaningful variants
- [ ] Presentational only (props in, callbacks out)
- [ ] Tokens only, typecheck + build pass"

gh issue create --title "[Component] PlayerHovercard" \
  --label "type:component" --label "area:chrome" --label "status:ready" --label "priority:2" \
  --body "**Area:** chrome

Summoner identity card: profile icon with level badge, gameName#tagLine, availability dot (online/away/in-game/offline). Used top-right of navbar and in friends list. Takes a Summoner (see @low/fixtures) as props.

**Acceptance criteria**
- [ ] Matches reference visually
- [ ] Showcase entry with all meaningful variants
- [ ] Presentational only (props in, callbacks out)
- [ ] Tokens only, typecheck + build pass"

gh issue create --title "[Component] HextechTooltip" \
  --label "type:component" --label "area:chrome" --label "status:ready" --label "priority:2" \
  --body "**Area:** chrome

The client's tooltip: dark panel, thin gold border, small body text, subtle fade-in. Wraps any child; position top/bottom.

**Acceptance criteria**
- [ ] Matches reference visually
- [ ] Showcase entry with all meaningful variants
- [ ] Presentational only (props in, callbacks out)
- [ ] Tokens only, typecheck + build pass"

gh issue create --title "[Component] TabBar" \
  --label "type:component" --label "area:chrome" --label "status:ready" --label "priority:2" \
  --body "**Area:** chrome

Secondary tab navigation used inside screens (e.g. Collection: Champions / Skins / Emotes). Uppercase labels, gold active underline, muted inactive state. Controlled: takes tabs + activeId + onSelect.

**Acceptance criteria**
- [ ] Matches reference visually
- [ ] Showcase entry with all meaningful variants
- [ ] Presentational only (props in, callbacks out)
- [ ] Tokens only, typecheck + build pass"

gh issue create --title "[Component] ModalFrame" \
  --label "type:component" --label "area:chrome" --label "status:ready" --label "priority:3" \
  --body "**Area:** chrome

The client's dialog frame: dark panel with ornate gold border, title bar, close X, content slot, footer slot for buttons. Backdrop dims the client. Controlled: open + onClose.

**Acceptance criteria**
- [ ] Matches reference visually
- [ ] Showcase entry with all meaningful variants
- [ ] Presentational only (props in, callbacks out)
- [ ] Tokens only, typecheck + build pass"
```
Expected: issues #1–#8 created.

- [ ] **Step 5: Verify board**

Run: `gh issue list --label "status:ready"`
Expected: 8 issues listed.

---

### Task 10: Vercel — link, connect, deploy

**Files:**
- Create: `apps/web/.vercel/` (gitignored, created by link)

**Interfaces:**
- Consumes: pushed GitHub repo (Task 9), Vercel CLI authenticated as `matintosh`.
- Produces: Vercel project `league-of-web` with root directory `apps/web`, auto-deploy on `main`, previews on PRs.

- [ ] **Step 1: Upgrade Vercel CLI (outdated 54.4.1)**

Run: `pnpm add -g vercel@latest && vercel --version`
Expected: `54.21.x` or newer.

- [ ] **Step 2: Link project from apps/web**

Run from `apps/web/`: `vercel link --yes --project league-of-web`
Expected: `.vercel/project.json` created; CLI detects monorepo and records root directory `apps/web`.

Verify: `vercel project inspect league-of-web` → Root Directory shows `apps/web`. If it shows empty, set it in dashboard (Settings → Build & Development → Root Directory = `apps/web`) before continuing.

- [ ] **Step 3: Connect git repo**

Run from `apps/web/`: `vercel git connect`
Expected: connected to `github.com/matintosh/league-of-web`.

- [ ] **Step 4: Trigger and verify production deploy**

Run: `git commit --allow-empty -m "chore: trigger initial vercel deploy" && git push`
Then poll: `vercel ls league-of-web`
Expected: a production deployment with state `READY`. Open the URL, verify landing page + `/showcase` render.

---

### Task 11: HextechButton end-to-end (proves the loop)

**Files:**
- Create: `packages/ui/src/chrome/hextech-button.tsx`, `packages/ui/src/chrome/hextech-button.showcase.tsx`
- Modify: `packages/ui/src/registry.ts`

**Interfaces:**
- Consumes: `ShowcaseEntry` from Task 4; token classes from Task 2; issue #1 from Task 9.
- Produces: `HextechButton` component exported from `@low/ui`; first populated showcase page at `/showcase/hextech-button`; merged PR closing issue #1.

- [ ] **Step 1: Claim issue and branch (follow task-workflow skill)**

```bash
gh issue edit 1 --add-label "status:in-progress" --remove-label "status:ready"
git checkout -b feat/hextech-button
```

- [ ] **Step 2: Write the component**

`packages/ui/src/chrome/hextech-button.tsx`:
```tsx
import type { ButtonHTMLAttributes } from "react";

export type HextechButtonVariant = "primary" | "secondary";
export type HextechButtonSize = "default" | "large";

export interface HextechButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = gold border + blue gradient (PLAY, confirm). secondary = muted outline. */
  variant?: HextechButtonVariant;
  /** large is used for the PLAY button. */
  size?: HextechButtonSize;
}

const base =
  "inline-flex cursor-pointer items-center justify-center border font-display uppercase tracking-widest transition-all duration-150 disabled:cursor-not-allowed disabled:border-grey-3 disabled:bg-none disabled:text-grey-2";

const variants: Record<HextechButtonVariant, string> = {
  primary:
    "border-gold-4 bg-linear-to-b from-blue-6 to-blue-7 text-gold-2 hover:border-gold-2 hover:text-gold-1 hover:shadow-[0_0_12px_var(--color-blue-2)]",
  secondary:
    "border-grey-3 bg-transparent text-grey-1 hover:border-gold-4 hover:text-gold-1",
};

const sizes: Record<HextechButtonSize, string> = {
  default: "px-8 py-2.5 text-sm",
  large: "px-14 py-4 text-base",
};

export function HextechButton({
  variant = "primary",
  size = "default",
  className,
  ...props
}: HextechButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]}${className ? ` ${className}` : ""}`}
      {...props}
    />
  );
}
```

- [ ] **Step 3: Write the showcase entry**

`packages/ui/src/chrome/hextech-button.showcase.tsx`:
```tsx
import type { ShowcaseEntry } from "../showcase";
import { HextechButton } from "./hextech-button";

export const hextechButtonShowcase: ShowcaseEntry = {
  slug: "hextech-button",
  name: "Hextech Button",
  area: "chrome",
  description:
    "The client's main call-to-action button — PLAY, confirm dialogs, store purchases.",
  variants: [
    { name: "Primary", render: () => <HextechButton>Play</HextechButton> },
    {
      name: "Secondary",
      notes: 'variant="secondary" — cancel/back actions.',
      render: () => <HextechButton variant="secondary">Cancel</HextechButton>,
    },
    {
      name: "Large",
      notes: 'size="large" — the PLAY button.',
      render: () => <HextechButton size="large">Play</HextechButton>,
    },
    {
      name: "Disabled",
      notes: "disabled — greyed border, no gradient, no pointer.",
      render: () => <HextechButton disabled>Play</HextechButton>,
    },
  ],
};
```

- [ ] **Step 4: Register and export**

`packages/ui/src/registry.ts`:
```ts
import type { ShowcaseEntry } from "./showcase";
import { hextechButtonShowcase } from "./chrome/hextech-button.showcase";

/**
 * Every component registers its showcase entry here.
 * Keep sorted by area, then name.
 */
export const registry: ShowcaseEntry[] = [hextechButtonShowcase];
```

Add to `packages/ui/src/index.ts`:
```ts
export type { Area, ShowcaseEntry, ShowcaseVariant } from "./showcase";
export { HextechButton } from "./chrome/hextech-button";
export type { HextechButtonProps } from "./chrome/hextech-button";
```

- [ ] **Step 5: Verify**

Run: `pnpm typecheck && pnpm build`
Expected: exits 0.

Run `pnpm dev`, open `http://localhost:3000/showcase/hextech-button`.
Expected: sidebar shows "Chrome → Hextech Button"; page renders 4 variants; hover shows gold border + blue glow.

- [ ] **Step 6: Ship via PR (proves the loop)**

```bash
git add -A
git commit -m "feat(chrome): HextechButton with showcase entry"
git push -u origin feat/hextech-button
gh pr create --title "feat(chrome): HextechButton" --body "Closes #1

First component through the full workflow. Primary/secondary variants, default/large sizes, disabled state. Showcase at /showcase/hextech-button."
gh issue edit 1 --add-label "status:review" --remove-label "status:in-progress"
gh pr merge --squash --delete-branch
git checkout main && git pull
```
Expected: PR merged, issue #1 closed automatically, Vercel deploys `main`.

- [ ] **Step 7: Verify production**

Run: `vercel ls league-of-web`
Expected: new production deployment `READY`. Open `<prod-url>/showcase/hextech-button` — variants render.
