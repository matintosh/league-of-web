/**
 * UniverseChampionBioHero — full-bleed champion splash hero for bio pages.
 *
 * Ref: docs/reference/universe-live-champion-bio.png
 *
 * Full-bleed champion splash art (championSplashUrl, object-cover, ~460px tall).
 * Heavy dark vignette on bottom and sides. Centered lower third overlaid text:
 *   - optional small crest SVG glyph
 *   - huge champion name (font-display serif caps, ~72px, gold-2 amber, letter-spaced)
 *   - gold subtitle beneath (e.g. "THE LADY OF LUMINOSITY", gold-2 caps, tracked)
 *
 * Props-in / callbacks-out. Server-safe (no 'use client').
 * Tokens-only — no raw hex. SVG crest ids via useId. CDN art via championSplashUrl.
 * Issues #978.
 */

import { useId } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UniverseChampionBioHeroProps {
  /** Champion display name, e.g. "Lux". */
  name: string;
  /** Champion title/subtitle, e.g. "The Lady of Luminosity". */
  title: string;
  /**
   * Splash art URL. Use championSplashUrl(championId, skin) from @low/fixtures.
   * Falls back to a dark placeholder if not provided.
   */
  splashUrl?: string;
  /**
   * Show the small shield crest glyph above the champion name.
   * @default true
   */
  showCrest?: boolean;
  /** Hero height in pixels. @default 460 */
  height?: number;
}

// ---------------------------------------------------------------------------
// Crest glyph
// ---------------------------------------------------------------------------

function ChampionCrest({ svgId }: { svgId: string }) {
  const clipId = `${svgId}-clip`;
  return (
    <svg
      aria-hidden="true"
      width="40"
      height="44"
      viewBox="0 0 40 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mb-3"
    >
      <defs>
        <clipPath id={clipId}>
          <path d="M20 1 L39 9 L39 28 Q39 40 20 43 Q1 40 1 28 L1 9 Z" />
        </clipPath>
      </defs>
      {/* Shield body — gold outline */}
      <path
        d="M20 1 L39 9 L39 28 Q39 40 20 43 Q1 40 1 28 L1 9 Z"
        stroke="var(--color-gold-3)"
        strokeWidth="1"
        fill="color-mix(in srgb, var(--color-gold-5) 40%, transparent)"
      />
      {/* Inner shield line */}
      <path
        d="M20 5 L35 11 L35 27 Q35 37 20 40 Q5 37 5 27 L5 11 Z"
        stroke="var(--color-gold-4)"
        strokeWidth="0.75"
        fill="none"
      />
      {/* Central diamond pip */}
      <rect
        x="17"
        y="17"
        width="6"
        height="6"
        transform="rotate(45 20 20)"
        fill="var(--color-gold-3)"
        opacity="0.85"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * UniverseChampionBioHero — full-bleed splash hero for champion bio pages.
 *
 * Presentational, server-safe (no 'use client').
 * Tokens-only — no raw hex outside packages/tokens.
 */
export function UniverseChampionBioHero({
  name,
  title,
  splashUrl,
  showCrest = true,
  height = 460,
}: UniverseChampionBioHeroProps) {
  const svgId = useId();

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: `${height}px` }}
      role="banner"
      aria-label={`${name} — ${title}`}
    >
      {/* Champion splash art — full-bleed, object-cover */}
      {splashUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={splashUrl}
          alt={`${name} splash art`}
          className="absolute inset-0 h-full w-full object-cover object-center"
          aria-hidden="true"
        />
      ) : (
        /* Fallback dark bg if no splash provided */
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "var(--color-universe-bg)" }}
          aria-hidden="true"
        />
      )}

      {/* Bottom vignette — heavy dark gradient covering the lower 60% */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          height: "70%",
          background:
            "linear-gradient(to top, var(--color-universe-bg) 0%, color-mix(in srgb, var(--color-universe-bg) 70%, transparent) 40%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Left side vignette */}
      <div
        className="absolute inset-y-0 left-0 w-1/4"
        style={{
          background:
            "linear-gradient(to right, color-mix(in srgb, var(--color-universe-bg) 55%, transparent), transparent)",
        }}
        aria-hidden="true"
      />

      {/* Right side vignette */}
      <div
        className="absolute inset-y-0 right-0 w-1/4"
        style={{
          background:
            "linear-gradient(to left, color-mix(in srgb, var(--color-universe-bg) 55%, transparent), transparent)",
        }}
        aria-hidden="true"
      />

      {/* Text overlay — centered in lower third */}
      <div className="absolute inset-x-0 bottom-10 flex flex-col items-center text-center px-4">
        {showCrest && <ChampionCrest svgId={svgId} />}

        {/* Champion name — real live-site values (extract_styles, h1.title_2YYZ):
            42px / 500 / rgb(196,185,152)=#c4b998 (--color-universe-title) / 1px tracking.
            (Corrects earlier guesses of gold-2 amber + weight 900.) */}
        <h1
          className="font-display uppercase leading-none"
          style={{
            fontSize: "clamp(32px, 3vw, 44px)",
            fontWeight: 500,
            letterSpacing: "1px",
            color: "var(--color-universe-title)",
            textShadow:
              "0 2px 24px color-mix(in srgb, var(--color-hextech-black) 70%, transparent)",
          }}
        >
          {name.toUpperCase()}
        </h1>

        {/* Thin gold hairline below name */}
        <div
          className="my-2 w-24 h-px"
          style={{ backgroundColor: "var(--color-gold-4)" }}
          aria-hidden="true"
        />

        {/* Title / subtitle — gold-2, caps, tracked */}
        <p
          className="uppercase tracking-[0.22em] text-sm"
          style={{
            color: "var(--color-gold-2)",
            fontFamily: "var(--font-body)",
            letterSpacing: "0.22em",
          }}
        >
          {title.toUpperCase()}
        </p>
      </div>
    </div>
  );
}
