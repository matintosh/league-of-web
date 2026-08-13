import Link from "next/link";
import { registry } from "@low/ui/registry";
import type { Area } from "@low/ui";

// Area metadata — display label and browse path (first slug in each area)
const AREA_META: Record<Area, { label: string; description: string }> = {
  chrome:
    { label: "Chrome", description: "Top navbar, social rail, modals, currency display, settings, and global UI shell." },
  "champ-select":
    { label: "Champion Select", description: "Pick tiles, skin carousel, countdown header, lock-in button, team player rows." },
  collection:
    { label: "Collection", description: "Champion cards, skin previews, runes screen, emote wheel, stats and ranked screens." },
  login:
    { label: "Login", description: "Text inputs, checkboxes, social login buttons, and the animated submit button." },
  store:
    { label: "Store", description: "Hero carousel, item tiles, purchase modals, loot tab, mythic shop panel." },
  lobby:
    { label: "Lobby", description: "Game mode cards, player cards, role selectors, queue status, match-found modal." },
  merch:
    { label: "Merch", description: "Riot merch store shell and components — modern e-commerce design using --color-merch-* tokens." },
  launcher:
    { label: "Launcher", description: "Riot/League launcher shell and components — dark near-black palette using --color-launcher-* tokens." },
  universe:
    { label: "Universe", description: "League Universe site components — top nav, crest dividers, and story cards from universe.leagueoflegends.com." },
};

const AREA_ORDER: Area[] = ["chrome", "champ-select", "collection", "login", "store", "lobby", "merch", "launcher", "universe"];

// Stats derived from the registry at build time
const componentCount = registry.length;
const areaCount = new Set(registry.map((e) => e.area)).size;
const variantCount = registry.reduce((sum, e) => sum + e.variants.length, 0);

// Per-area component counts and first slug for "Browse →" links
const areaCounts = AREA_ORDER.reduce<Record<Area, { count: number; firstSlug: string }>>(
  (acc, area) => {
    const entries = registry.filter((e) => e.area === area);
    acc[area] = { count: entries.length, firstSlug: entries[0]?.slug ?? "" };
    return acc;
  },
  {} as Record<Area, { count: number; firstSlug: string }>,
);

// Tech stack pills — styled per issue spec
const STACK = ["Next.js App Router", "TypeScript", "Tailwind v4", "Turborepo", "Vercel"];

export default function ShowcaseLanding() {
  return (
    <div className="max-w-5xl space-y-20 pb-20">

      {/* ── 1. Hero ─────────────────────────────────────────────── */}
      <section id="hero" className="pt-4">
        <p className="text-xs uppercase tracking-widest text-gold-4">Portfolio project</p>
        <h1 className="mt-2 font-display text-4xl uppercase tracking-widest text-gold-1 md:text-5xl">
          League of Web
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-grey-1">
          A 1:1 web recreation of the League of Legends client — built component
          by component with a multi-agent agentic build system.
        </p>

        {/* Live stats row */}
        <div className="mt-6 flex flex-wrap gap-8">
          <div>
            <span className="font-display text-3xl text-gold-1">{componentCount}</span>
            <p className="mt-0.5 text-xs uppercase tracking-widest text-gold-4">Components</p>
          </div>
          <div>
            <span className="font-display text-3xl text-gold-1">{areaCount}</span>
            <p className="mt-0.5 text-xs uppercase tracking-widest text-gold-4">Client areas</p>
          </div>
          <div>
            <span className="font-display text-3xl text-gold-1">{variantCount}</span>
            <p className="mt-0.5 text-xs uppercase tracking-widest text-gold-4">Variants</p>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="#components"
            className="inline-flex items-center gap-2 border border-gold-3 px-5 py-2 text-sm uppercase tracking-widest text-gold-2 transition-colors hover:border-gold-1 hover:text-gold-1"
          >
            Browse components ↓
          </a>
          <Link
            href="/client"
            className="inline-flex items-center gap-2 border border-gold-5 px-5 py-2 text-sm uppercase tracking-widest text-gold-4 transition-colors hover:border-gold-3 hover:text-gold-2"
          >
            View the client →
          </Link>
          <a
            href="https://github.com/matintosh/league-of-web"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-gold-5 px-5 py-2 text-sm uppercase tracking-widest text-gold-4 transition-colors hover:border-gold-3 hover:text-gold-2"
          >
            GitHub ↗
          </a>
        </div>
      </section>

      {/* ── 2. Stats bar ────────────────────────────────────────── */}
      <section className="border border-gold-5 bg-blue-6">
        <dl className="grid grid-cols-2 divide-x divide-y divide-gold-5 md:grid-cols-4 md:divide-y-0">
          {[
            { value: `${componentCount}`, label: "Components registered" },
            { value: `${areaCount}`, label: "Client areas" },
            { value: "56", label: "Hextech design tokens" },
            { value: "35+", label: "Merges in one sprint" },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center py-8 text-center">
              <span className="font-display text-4xl text-gold-1">{value}</span>
              <span className="mt-2 text-xs uppercase tracking-widest text-gold-4">{label}</span>
            </div>
          ))}
        </dl>
      </section>

      {/* ── 3. Tech stack ───────────────────────────────────────── */}
      <section>
        <h2 className="font-display text-xl uppercase tracking-widest text-gold-1">Tech stack</h2>
        <p className="mt-3 max-w-xl text-grey-1">
          Built on modern React infrastructure with strict type safety throughout.
          Tailwind v4 powers a token system of 56 named Hextech color, typography,
          and spacing values — no raw hex values anywhere in the codebase.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {STACK.map((tech) => (
            <span
              key={tech}
              className="rounded-sm border border-gold-4 px-3 py-1 text-xs uppercase tracking-widest text-gold-2"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* ── 4. How it was built ─────────────────────────────────── */}
      <section>
        <h2 className="font-display text-xl uppercase tracking-widest text-gold-1">
          How it was built
        </h2>

        <div className="mt-6 grid gap-8 md:grid-cols-2">
          {/* Left: conventional narrative */}
          <div className="space-y-4 text-grey-1">
            <h3 className="text-sm uppercase tracking-widest text-gold-3">
              Conventional approach
            </h3>
            <p>
              A typical portfolio clone is built one component at a time by a
              single developer: design, implement, review, repeat. Fidelity is
              eyeballed rather than measured, velocity is limited to one engineer,
              and the build log is a linear sequence of commits.
            </p>
            <p>
              The conventional approach tops out around one component per
              session and struggles to maintain pixel-level fidelity across a
              large component library without systematic tooling.
            </p>
          </div>

          {/* Right: agentic build system — the differentiator */}
          <div className="space-y-4 rounded-sm border border-gold-4 bg-blue-6 p-6">
            <h3 className="text-sm uppercase tracking-widest text-gold-2">
              What actually happened: agentic build system
            </h3>

            <ol className="space-y-4">
              <li className="flex gap-3">
                <span className="shrink-0 font-display text-gold-3">01</span>
                <p className="text-grey-1">
                  <span className="text-gold-2">Auditor agents</span> measure
                  pixel deltas against reference screenshots, then file GitHub
                  Issues with full acceptance criteria — exact measurements,
                  component variants required, and visual targets.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 font-display text-gold-3">02</span>
                <p className="text-grey-1">
                  <span className="text-gold-2">Parallel builder agents</span> claim
                  issues concurrently, each working in an isolated git worktree.
                  They implement components to spec, write showcase entries, and
                  open pull requests — independently, in parallel.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 font-display text-gold-3">03</span>
                <p className="text-grey-1">
                  <span className="text-gold-2">Independent reviewer agents</span> assess
                  each PR for correctness, token compliance, and visual fidelity
                  before merging — a separate agent from the one that built it.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 font-display text-gold-3">04</span>
                <p className="text-grey-1">
                  <span className="text-gold-2">35+ pull requests merged in a single day</span> at
                  peak throughput — a build rate no solo developer can match.
                </p>
              </li>
            </ol>

            <a
              href="https://github.com/matintosh/league-of-web"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-gold-3 underline underline-offset-2 hover:text-gold-1"
            >
              View the build history on GitHub ↗
            </a>
          </div>
        </div>
      </section>

      {/* ── 5. Component area grid ──────────────────────────────── */}
      <section id="components">
        <h2 className="font-display text-xl uppercase tracking-widest text-gold-1">
          Component areas
        </h2>
        <p className="mt-3 max-w-xl text-grey-1">
          Every component is browsable with its variants. Measured against{" "}
          <span className="text-gold-2">69 reference screenshots</span> of the live client.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AREA_ORDER.map((area) => {
            const meta = AREA_META[area];
            const { count, firstSlug } = areaCounts[area];
            return (
              <Link
                key={area}
                href={firstSlug ? `/showcase/${firstSlug}` : "/showcase"}
                className="group flex flex-col rounded-sm border border-gold-5 bg-blue-6 p-6 transition-colors hover:border-gold-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg uppercase tracking-widest text-gold-2 transition-colors group-hover:text-gold-1">
                    {meta.label}
                  </h3>
                  <span className="font-display text-2xl text-gold-3">{count}</span>
                </div>
                <p className="mt-3 flex-1 text-sm text-grey-2">{meta.description}</p>
                <span className="mt-4 text-xs uppercase tracking-widest text-gold-4 transition-colors group-hover:text-gold-3">
                  Browse →
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
