/**
 * UniverseRegionCard — editorial region tile from the Regions index on
 * universe.leagueoflegends.com.
 *
 * Structure:
 *   ┌──────────────────────────┐
 *   │  Full-bleed region art   │  ← championSplashUrl stand-in, object-cover
 *   │  (zoom on hover)         │
 *   │                          │
 *   │  [dark full-bleed scrim] │
 *   │  REGION NAME             │  ← font-display serif caps, gold-1, centered
 *   └──────────────────────────┘
 *
 * Wider-than-tall landscape tile (~4:3). Whole card is a link/button.
 * Hover → art zooms + subtle brightness lift. Tokens-only. Server-safe.
 * Issue: universe-region-card.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UniverseRegionCardProps {
  /** Region display name, e.g. "DEMACIA". Shown in large font-display caps. */
  name: string;
  /** URL slug for the region, e.g. "demacia". Used in href if href is omitted. */
  slug: string;
  /**
   * Optional art URL override. Falls back to the provided championSplashUrl
   * stand-in if not supplied.
   */
  art?: string;
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
 * UniverseRegionCard — landscape region tile (~4:3) for the Regions grid.
 *
 * Presentational, server-safe (no 'use client'). Hover via CSS group-hover.
 * Tokens-only — no raw hex colors outside packages/tokens.
 */
export function UniverseRegionCard({
  name,
  slug: _slug,
  art,
  href = "#",
  onSelect,
  className,
}: UniverseRegionCardProps) {
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
        aspectRatio: "4 / 3",
        textDecoration: "none",
      }}
      aria-label={name}
    >
      {/* Region art — full-bleed, zooms on hover */}
      {art ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={art}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        /* Fallback: deep editorial gradient using Hextech palette tokens */
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, var(--color-blue-6) 0%, var(--color-grey-4) 40%, var(--color-hextech-black) 100%)",
          }}
          aria-hidden="true"
        />
      )}

      {/* Full-bleed dark scrim — preserves editorial mood & text legibility */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, color-mix(in srgb, var(--color-hextech-black) 80%, transparent) 0%, color-mix(in srgb, var(--color-hextech-black) 40%, transparent) 50%, color-mix(in srgb, var(--color-hextech-black) 20%, transparent) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Gold hairline border — subtle frame matching Universe editorial aesthetic */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          border: "1px solid color-mix(in srgb, var(--color-gold-4) 60%, transparent)",
          opacity: 0.5,
        }}
        aria-hidden="true"
      />

      {/* Region name — font-display Beaufort caps, gold-1, centered vertically lower */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center pb-5">
        <p
          className="font-display text-lg uppercase leading-tight tracking-[0.1em]"
          style={{
            color: "var(--color-gold-1)",
            fontWeight: 700,
            textShadow:
              "0 2px 8px color-mix(in srgb, var(--color-hextech-black) 80%, transparent)",
          }}
        >
          {name}
        </p>
      </div>
    </a>
  );
}
