"use client";

/**
 * UniverseTopNav — the global top navigation bar for universe.leagueoflegends.com.
 *
 * ~48px tall, near-black background (#0a0a0e via --color-universe-bg), thin warm-gold
 * hairline at the bottom.
 *
 * Layout (left → right):
 *   [Riot fist logo] [gold divider] [Universe wordmark + crest glyph]
 *   [nav links: CHAMPIONS · REGIONS · COMICS · ALT UNIVERSE · MAP▾ · EXPLORE · SEARCH]
 *   [globe locale icon] [SIGN IN] [PLAY NOW pill]
 *
 * Nav links are caps, letter-spaced, small — idle near-white (#976), hover gold-1.
 * PLAY NOW is a left→right cyan gradient pill (#977).
 *
 * Props-in / callbacks-out. No data fetching. Requires 'use client' for hover state.
 * Tokens-only — all colors via var(--color-*). Issues #966, #976, #977.
 */

import { useState } from "react";
import { useId } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type UniverseNavKey =
  | "champions"
  | "regions"
  | "comics"
  | "alt-universe"
  | "map"
  | "explore"
  | "search";

export interface UniverseTopNavProps {
  /** Currently active nav link key. */
  activeKey?: UniverseNavKey;
  /** Fired when a nav link is clicked. */
  onNavigate?: (key: UniverseNavKey) => void;
  /** Fired when the Riot logo / Universe wordmark is clicked (→ home). */
  onHome?: () => void;
  /** Fired when the SIGN IN button is clicked. */
  onSignIn?: () => void;
  /** Fired when the PLAY NOW button is clicked. */
  onPlayNow?: () => void;
}

// ---------------------------------------------------------------------------
// Nav link config
// ---------------------------------------------------------------------------

const NAV_LINKS: { key: UniverseNavKey; label: string; hasArrow?: boolean }[] = [
  { key: "champions", label: "CHAMPIONS" },
  { key: "regions", label: "REGIONS" },
  { key: "comics", label: "COMICS" },
  { key: "alt-universe", label: "ALT UNIVERSE" },
  { key: "map", label: "MAP", hasArrow: true },
  { key: "explore", label: "EXPLORE" },
  { key: "search", label: "SEARCH" },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/**
 * Riot Games fist / wordmark logo — rendered white per reference (#976).
 * The Universe nav uses white for all chrome except the Universe wordmark.
 */
function RiotFistLogo() {
  return (
    <svg
      aria-label="Riot Games"
      role="img"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stylised fist / shield silhouette — white fill per ref (#976) */}
      <path
        d="M12 2 L20 6 L20 15 Q20 20 12 23 Q4 20 4 15 L4 6 Z"
        fill="var(--color-universe-nav-text)"
        opacity="0.9"
      />
      <path
        d="M9 10 L9 16 M12 9 L12 16 M15 10 L15 16"
        stroke="var(--color-universe-bg)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Universe wordmark with a small diamond crest glyph to the left of the text. */
function UniverseWordmark() {
  return (
    <div className="flex items-center gap-1.5">
      {/* Small diamond crest glyph — stays gold per reference */}
      <svg
        aria-hidden="true"
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="1"
          y="1"
          width="8"
          height="8"
          transform="rotate(45 5 5)"
          fill="var(--color-gold-3)"
          opacity="0.85"
        />
      </svg>
      {/* Universe wordmark stays gold per reference — only nav links/SIGN IN go white */}
      <span
        className="font-display text-sm tracking-widest text-gold-1 uppercase"
        style={{ letterSpacing: "0.2em" }}
      >
        Universe
      </span>
    </div>
  );
}

/** Globe / locale icon — white tint matching nav text (#976). */
function GlobeIcon() {
  return (
    <svg
      aria-label="Select locale"
      role="img"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="9" cy="9" r="7.5" stroke="var(--color-universe-nav-text)" strokeWidth="1" />
      <ellipse cx="9" cy="9" rx="3.5" ry="7.5" stroke="var(--color-universe-nav-text)" strokeWidth="1" />
      <line x1="2" y1="7" x2="16" y2="7" stroke="var(--color-universe-nav-text)" strokeWidth="1" />
      <line x1="2" y1="11" x2="16" y2="11" stroke="var(--color-universe-nav-text)" strokeWidth="1" />
    </svg>
  );
}

/** Search magnifier icon — used as the SEARCH link icon. */
function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.5" />
      <line x1="9" y1="9" x2="13" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** Downward caret for MAP link. */
function CaretDown() {
  return (
    <svg
      aria-hidden="true"
      width="8"
      height="6"
      viewBox="0 0 8 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1 1 L4 5 L7 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * UniverseTopNav — global site navigation for universe.leagueoflegends.com.
 *
 * Presentational: props in, callbacks out. Requires 'use client' for hover state.
 * All colors from Hextech/Universe design tokens — no raw hex.
 *
 * Fix #976: nav link text, SIGN IN, and Riot logo changed from gold-2 to
 *   --color-universe-nav-text (near-white #f0f0ee) to match reference.
 * Fix #977: PLAY NOW pill changed from flat blue-3 to left→right cyan gradient
 *   using --color-universe-cta-from and --color-universe-cta-to tokens.
 */
export function UniverseTopNav({
  activeKey,
  onNavigate,
  onHome,
  onSignIn,
  onPlayNow,
}: UniverseTopNavProps) {
  const [hoveredKey, setHoveredKey] = useState<UniverseNavKey | null>(null);
  const navId = useId();

  return (
    <nav
      aria-label="Universe site navigation"
      className="flex w-full items-center px-4 md:px-6"
      style={{
        height: "48px",
        backgroundColor: "var(--color-universe-bg)",
        borderBottom: "1px solid var(--color-universe-nav-border)",
      }}
    >
      {/* ── Left: Riot logo + gold divider + Universe wordmark (→ home) ── */}
      <button
        type="button"
        onClick={onHome}
        aria-label="Universe home"
        className="flex shrink-0 items-center gap-3 mr-6"
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        <RiotFistLogo />
        {/* Gold vertical divider */}
        <div
          className="h-5 w-px"
          style={{ backgroundColor: "var(--color-gold-4)" }}
          aria-hidden="true"
        />
        <UniverseWordmark />
      </button>

      {/* ── Centre: Nav links — idle near-white (#976), hover gold-1 ── */}
      <ul
        id={navId}
        className="flex flex-1 items-center gap-1 list-none"
        role="list"
      >
        {NAV_LINKS.map(({ key, label, hasArrow }) => {
          const isActive = key === activeKey;
          const isHovered = key === hoveredKey;
          const isSearch = key === "search";

          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => onNavigate?.(key)}
                onMouseEnter={() => setHoveredKey(key)}
                onMouseLeave={() => setHoveredKey(null)}
                aria-current={isActive ? "page" : undefined}
                className="flex items-center gap-1 px-2 py-1 text-[11px] font-body uppercase tracking-[0.12em] transition-colors duration-150"
                style={{
                  color:
                    isActive || isHovered
                      ? "var(--color-gold-1)"
                      : "var(--color-universe-nav-text)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  letterSpacing: "0.12em",
                }}
              >
                {isSearch ? (
                  <SearchIcon />
                ) : (
                  label
                )}
                {hasArrow && <CaretDown />}
              </button>
            </li>
          );
        })}
      </ul>

      {/* ── Right: Globe + SIGN IN + PLAY NOW ── */}
      <div className="flex shrink-0 items-center gap-3 ml-4">
        {/* Globe locale selector */}
        <button
          type="button"
          aria-label="Select locale"
          className="flex items-center justify-center transition-opacity duration-150 hover:opacity-80"
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <GlobeIcon />
        </button>

        {/* SIGN IN — near-white text (#976) */}
        <button
          type="button"
          onClick={onSignIn}
          className="text-[11px] uppercase tracking-[0.12em] transition-colors duration-150"
          style={{
            color: "var(--color-universe-nav-text)",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            letterSpacing: "0.12em",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--color-gold-1)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--color-universe-nav-text)";
          }}
        >
          SIGN IN
        </button>

        {/* PLAY NOW — cyan gradient pill (#977): cta-from → cta-to left→right */}
        <button
          type="button"
          onClick={onPlayNow}
          className="rounded-full px-4 py-1 text-[11px] uppercase tracking-[0.1em] font-body font-semibold"
          style={{
            background:
              "linear-gradient(to right, var(--color-universe-cta-from), var(--color-universe-cta-to))",
            color: "var(--color-blue-1)",
            border: "none",
            cursor: "pointer",
            letterSpacing: "0.1em",
            transition: "opacity 150ms",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = "0.85";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = "1";
          }}
        >
          PLAY NOW
        </button>
      </div>
    </nav>
  );
}
