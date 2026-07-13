import Link from "next/link";

// ---------------------------------------------------------------------------
// Client Flow Map — /showcase/client-map
//
// Static server component. No 'use client', no data fetching.
// Renders a visual sitemap of all cloned LoL client screens.
// Node inventory verified against client-shell.tsx and each *-screen.tsx.
// ---------------------------------------------------------------------------

// Node status types and their visual meaning:
// "live"           — implemented and visible in the live client shell (/)
// "stub"           — tab rendered but shows a "Coming soon" placeholder
// "disabled"       — tab present in the UI but aria-disabled (greyed out)
// "showcase-only"  — component built, accessible only through /showcase
type NodeStatus = "live" | "stub" | "disabled" | "showcase-only";

interface FlowNode {
  label: string;
  status: NodeStatus;
  /** Absolute path to the live route or /showcase/[slug] */
  href?: string;
}

// ---------------------------------------------------------------------------
// Status legend config
// ---------------------------------------------------------------------------

const LEGEND: { status: NodeStatus; dotClass: string; label: string; desc: string }[] = [
  { status: "live",          dotClass: "bg-blue-2",   label: "Live",           desc: "Implemented in the client shell" },
  { status: "stub",          dotClass: "bg-gold-3",   label: "Stub",           desc: "Tab exists — shows placeholder" },
  { status: "disabled",      dotClass: "bg-grey-3",   label: "Disabled",       desc: "Tab rendered but aria-disabled" },
  { status: "showcase-only", dotClass: "bg-blue-4",   label: "Showcase only",  desc: "Built component, not in client flow" },
];

function statusDot(status: NodeStatus) {
  const dot = LEGEND.find((l) => l.status === status);
  return dot?.dotClass ?? "bg-grey-3";
}

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

function StatusDot({ status }: { status: NodeStatus }) {
  const cls = statusDot(status);
  const legend = LEGEND.find((l) => l.status === status);
  return (
    <span
      aria-label={legend?.label}
      title={legend?.label}
      className={`inline-block h-2 w-2 shrink-0 rounded-full ${cls}`}
    />
  );
}

function Node({ node }: { node: FlowNode }) {
  const base =
    "inline-flex items-center gap-2 rounded-sm border border-gold-5 bg-blue-6 px-3 py-1.5 text-sm text-grey-1";
  const inner = (
    <>
      <StatusDot status={node.status} />
      <span>{node.label}</span>
    </>
  );
  if (node.href) {
    return (
      <Link href={node.href} className={`${base} transition-colors duration-150 hover:border-gold-3 hover:text-gold-1`}>
        {inner}
      </Link>
    );
  }
  return <span className={base}>{inner}</span>;
}

// ---------------------------------------------------------------------------
// Tree helpers — vertical connector list
// ---------------------------------------------------------------------------

interface TreeItemProps {
  node: FlowNode;
  /** Child subtrees, if any */
  children?: React.ReactNode;
  /** True if this is the last sibling (removes the bottom connector line) */
  last?: boolean;
}

function TreeItem({ node, children, last }: TreeItemProps) {
  return (
    <li className="relative flex flex-col">
      {/* Horizontal branch arm */}
      <div className="flex items-start gap-0">
        {/* Vertical + horizontal T-connector */}
        <div className="flex flex-col items-center" style={{ width: 20 }}>
          {/* Vertical line above the arm (connects back up to parent) */}
          <div className={`w-px bg-gold-5 ${last ? "h-4" : "flex-1 min-h-[1rem]"}`} />
          {/* Horizontal arm */}
          <div className="h-px w-5 bg-gold-5" style={{ marginTop: 0, alignSelf: "center" }} />
          {/* Vertical line below (continues the list) — hidden on last */}
          {!last && <div className="w-px flex-1 bg-gold-5" />}
          {last && <div className="flex-1" />}
        </div>

        <div className="ml-1 flex flex-col gap-2 py-1">
          <Node node={node} />
          {children && (
            <ul className="flex flex-col border-l border-gold-5 ml-3 gap-0">
              {children}
            </ul>
          )}
        </div>
      </div>
    </li>
  );
}

// ---------------------------------------------------------------------------
// Section block — a top-level nav section with its sub-nodes
// ---------------------------------------------------------------------------

interface SectionProps {
  heading: FlowNode;
  children?: React.ReactNode;
}

function Section({ heading, children }: SectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <Node node={heading} />
      {children && (
        <ul className="flex flex-col border-l border-gold-5 ml-4 gap-0">
          {children}
        </ul>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ClientMapPage() {
  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl uppercase tracking-widest text-gold-1">
          Client Flow Map
        </h1>
        <p className="mt-2 font-body text-sm text-grey-1">
          Visual sitemap of all cloned League of Legends client screens.
          Verified against{" "}
          <code className="rounded bg-blue-6 px-1 text-xs text-gold-cream">
            client-shell.tsx
          </code>{" "}
          and each{" "}
          <code className="rounded bg-blue-6 px-1 text-xs text-gold-cream">
            *-screen.tsx
          </code>.
        </p>
      </div>

      {/* Legend */}
      <div className="mb-8 flex flex-wrap gap-4 rounded-sm border border-gold-5 bg-blue-7 p-4">
        <span className="font-display text-xs uppercase tracking-widest text-gold-4 self-center">
          Legend
        </span>
        {LEGEND.map((l) => (
          <div key={l.status} className="flex items-center gap-2" title={l.desc}>
            <span className={`inline-block h-2 w-2 rounded-full ${l.dotClass}`} />
            <span className="font-body text-xs text-grey-1">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Root */}
      <div className="flex flex-col gap-6">
        {/* Root node */}
        <div className="flex items-center gap-3">
          <Node node={{ label: "Client Shell (/)", status: "live", href: "/" }} />
          <span className="font-body text-xs text-grey-2">← entry point</span>
        </div>

        {/* Vertical trunk */}
        <div className="flex gap-0">
          <div className="ml-4 w-px bg-gold-5" />
          <div className="ml-3 flex flex-col gap-6 flex-1">

            {/* ── HOME ── */}
            <Section heading={{ label: "Home", status: "live", href: "/" }}>
              <TreeItem node={{ label: "Overview", status: "live", href: "/" }} />
              <TreeItem node={{ label: "Arcade 2019", status: "live", href: "/" }} />
              <TreeItem node={{ label: "Battle Pass", status: "live", href: "/" }} />
              <TreeItem node={{ label: "Journey", status: "live", href: "/" }} />
              <TreeItem node={{ label: "News", status: "live", href: "/" }} />
              <TreeItem node={{ label: "Patch Notes", status: "disabled" }} last />
            </Section>

            {/* ── PLAY FLOW ── */}
            <Section heading={{ label: "Play Flow", status: "live" }}>
              <TreeItem node={{ label: "Mode Select", status: "live", href: "/" }}>
              </TreeItem>
              <TreeItem node={{ label: "Party Lobby", status: "live", href: "/" }}>
              </TreeItem>
              <TreeItem node={{ label: "Finding Match / Match Found", status: "live", href: "/" }}>
              </TreeItem>
              <TreeItem node={{ label: "Accept", status: "live", href: "/" }}>
              </TreeItem>
              <TreeItem node={{ label: "Ban Phase", status: "live", href: "/" }}>
              </TreeItem>
              <TreeItem node={{ label: "Champ Select (Pick)", status: "live", href: "/" }}>
              </TreeItem>
              <TreeItem node={{ label: "Loadout", status: "live", href: "/" }} last />
            </Section>

            {/* ── PROFILE ── */}
            <Section heading={{ label: "Profile", status: "live", href: "/" }}>
              <TreeItem node={{ label: "Overview", status: "live", href: "/" }} />
              <TreeItem node={{ label: "Challenges", status: "live", href: "/" }} />
              <TreeItem node={{ label: "Match History", status: "disabled" }} />
              <TreeItem node={{ label: "Ranked", status: "live", href: "/" }} />
              <TreeItem node={{ label: "Clubs", status: "live", href: "/" }} />
              <TreeItem node={{ label: "Highlights", status: "disabled" }} />
              <TreeItem node={{ label: "Stats", status: "live", href: "/" }} last />
            </Section>

            {/* ── COLLECTION ── */}
            <Section heading={{ label: "Collection", status: "live", href: "/" }}>
              <TreeItem node={{ label: "Champions", status: "live", href: "/" }} />
              <TreeItem node={{ label: "Skins", status: "live", href: "/" }} />
              <TreeItem node={{ label: "Emotes", status: "live", href: "/" }} />
              <TreeItem node={{ label: "Runes", status: "live", href: "/" }} />
              <TreeItem node={{ label: "Spells", status: "live", href: "/" }} />
              <TreeItem node={{ label: "Chromas", status: "live", href: "/" }} />
              <TreeItem node={{ label: "Items", status: "stub" }} />
              <TreeItem node={{ label: "Icons", status: "stub" }} />
              <TreeItem node={{ label: "Wards", status: "stub" }} last />
            </Section>

            {/* ── COMPETITIVE (CLASH) ── */}
            <Section heading={{ label: "Competitive (Clash)", status: "live", href: "/" }}>
              <TreeItem node={{ label: "Registration / Team Lobby", status: "live", href: "/" }} />
              <TreeItem node={{ label: "Scouting Phase", status: "live", href: "/" }} last />
            </Section>

            {/* ── STORE ── */}
            <Section heading={{ label: "Store", status: "live", href: "/" }}>
              <TreeItem node={{ label: "Featured", status: "live", href: "/" }} />
              <TreeItem node={{ label: "Champions", status: "stub" }} />
              <TreeItem node={{ label: "Skins", status: "stub" }} />
              <TreeItem
                node={{ label: "Loot", status: "live", href: "/" }}
              >
                <TreeItem node={{ label: "Crafting", status: "live", href: "/" }} />
                <TreeItem node={{ label: "Sanctum", status: "live", href: "/" }} />
                <TreeItem node={{ label: "Mythic Shop", status: "live", href: "/" }} last />
              </TreeItem>
              <TreeItem node={{ label: "Emotes", status: "stub" }} />
              <TreeItem node={{ label: "Accessories", status: "stub" }} />
              <TreeItem node={{ label: "Esports", status: "stub" }} />
              <TreeItem
                node={{ label: "Your Shop", status: "showcase-only", href: "/showcase/your-shop-screen" }}
                last
              />
            </Section>

            {/* ── TFT HUB ── */}
            <Section heading={{ label: "Teamfight Tactics Hub", status: "live", href: "/" }} />

            {/* ── LOGIN ── */}
            <Section heading={{ label: "Login", status: "live", href: "/login" }} />

          </div>
        </div>
      </div>

      {/* Footer note */}
      <p className="mt-10 font-body text-xs text-grey-2 border-t border-gold-5 pt-4">
        Statuses verified against the client-shell source, 2026-07-13.
      </p>
    </div>
  );
}
