/**
 * UniverseChampionCard — tall portrait champion card from the Champions index on
 * universe.leagueoflegends.com.
 *
 * Structure:
 *   ┌──────────────────────────┐
 *   │  Full-bleed splash art   │  ← championSplashUrl, object-cover, ~3:4 portrait
 *   │  (zoom on hover)         │
 *   │                          │
 *   │  [dark bottom gradient]  │
 *   │  REGION                  │  ← gold-2, small caps, letter-spaced (overline)
 *   │  CHAMPION NAME           │  ← font-display serif caps, gold-3 dark gold, larger
 *   └──────────────────────────┘
 *
 * Borderless card; hover → splash zooms + subtle brightness lift.
 * Whole card is a link/button. Tokens-only. Server-safe (no 'use client').
 * Issue #969.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UniverseChampionCardProps {
  /** Champion display name, e.g. "AHRI". Shown in large font-display caps. */
  name: string;
  /** Region label, e.g. "IONIA". Shown in gold-2 overline above name. */
  region: string;
  /** Full splash art URL. Use championSplashUrl() from @low/fixtures. */
  splashUrl: string;
  /** Link href. @default "#" */
  href?: string;
  /** Callback fired when the card is clicked. */
  onSelect?: () => void;
  /** Additional CSS class names applied to the root element. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * UniverseChampionCard — tall champion splash card (portrait ~3:4).
 *
 * Presentational, server-safe (no 'use client'). Hover via CSS group-hover.
 * Tokens-only — no raw hex colors outside packages/tokens.
 */
export function UniverseChampionCard({
  name,
  region,
  splashUrl,
  href = "#",
  onSelect,
  className,
}: UniverseChampionCardProps) {
  return (
    <a
      href={href}
      onClick={
        onSelect
          ? (e) => {
              e.preventDefault();
              onSelect();
            }
          : undefined
      }
      className={`group relative block overflow-hidden transition-[filter] duration-200 hover:brightness-110${className ? ` ${className}` : ""}`}
      style={{
        aspectRatio: "243 / 425",
        textDecoration: "none",
      }}
      aria-label={`${name} — ${region}`}
    >
      {/* Splash art — full-bleed, zooms on hover */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={splashUrl}
        alt={name}
        className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
      />

      {/* Soft gradient behind the panel so the seam reads over bright splashes */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background:
            "linear-gradient(to top, color-mix(in srgb, var(--color-hextech-black) 70%, transparent) 0%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/*
        Name/faction panel — real values (extract_styles on live champions page,
        `copy_xxN7`): translucent near-black bg rgba(10,10,12,0.9), border-top 1px
        gold #937341 seam, name 14px/500/#937341/2px tracking (h1), faction below (h2).
      */}
      <div
        className="absolute inset-x-0 bottom-0 px-4 pt-3 pb-4"
        style={{
          backgroundColor: "color-mix(in srgb, var(--color-hextech-black) 90%, transparent)",
          borderTop: "1px solid var(--color-universe-overline)",
        }}
      >
        {/* Champion name — Beaufort caps, dark gold #937341 */}
        <p
          className="truncate font-display uppercase leading-tight"
          style={{
            color: "var(--color-universe-overline)",
            fontSize: "14px",
            fontWeight: 500,
            letterSpacing: "2px",
          }}
        >
          {name}
        </p>
        {/* Faction — muted, small caps, below the name */}
        <p
          className="mt-0.5 truncate uppercase"
          style={{
            color: "color-mix(in srgb, var(--color-universe-story-ink) 55%, transparent)",
            fontFamily: "var(--font-body)",
            fontSize: "10px",
            letterSpacing: "0.12em",
          }}
        >
          {region}
        </p>
      </div>
    </a>
  );
}
