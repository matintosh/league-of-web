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
 *   │  CHAMPION NAME           │  ← font-display serif caps, gold-1/near-white, larger
 *   └──────────────────────────┘
 *
 * Thin dark frame border; hover → splash zooms + gold hairline brightens.
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
      className={`group relative block overflow-hidden border border-gold-5 hover:border-gold-3 transition-[border-color] duration-200${className ? ` ${className}` : ""}`}
      style={{
        aspectRatio: "3 / 4",
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

      {/* Dark bottom gradient scrim — covers bottom ~50% for text legibility */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
        style={{
          background:
            "linear-gradient(to top, color-mix(in srgb, var(--color-hextech-black) 95%, transparent) 0%, color-mix(in srgb, var(--color-hextech-black) 70%, transparent) 50%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Text overlay — region overline + champion name */}
      <div className="absolute inset-x-0 bottom-0 px-3 pb-4">
        {/* Region overline — gold-2, small caps, letter-spaced */}
        <p
          className="mb-1 truncate text-[10px] uppercase"
          style={{
            color: "var(--color-gold-2)",
            fontFamily: "var(--font-body)",
            letterSpacing: "0.14em",
          }}
        >
          {region}
        </p>
        {/* Champion name — font-display serif caps, near-white/gold-1 */}
        <p
          className="font-display text-base uppercase leading-tight"
          style={{
            color: "var(--color-universe-story-ink)",
            letterSpacing: "0.06em",
            textShadow: "0 1px 4px color-mix(in srgb, var(--color-hextech-black) 60%, transparent)",
          }}
        >
          {name}
        </p>
      </div>
    </a>
  );
}
