/**
 * MerchSupportHero — shared SUPPORT page hero band for /merch/pages/[slug].
 *
 * MERCH COMPONENT — use the merch design system: --color-merch-* tokens.
 * This is NOT the Hextech client.
 * Presentational: props in, no callbacks needed.
 * Types are imported from @low/fixtures; mascot image URL is supplied by the page.
 *
 * Measured from merch.riotgames.com/en-us/faqs/ (desktop 1280px):
 *   - Background: red splash (#eb0029 == --color-merch-support-band) filling the band.
 *   - h1 "SUPPORT": 48px desktop / 38px mobile, font-weight 700, uppercase
 *     letter-spacing -0.02em desktop (-0.76px at 38px @390), color --color-merch-ink-dark (pure black),
 *     left-aligned, line-height ~1.1 (leading-none/tight).
 *   - Mascot illustration: full-band-height (~140px), right-edge bleeding, occupying ~30% right.
 *     Real asset is a Riot CDN PNG (unavailable — accept any URL or fall back to decorative block).
 *   - Band height: ~140px desktop; auto on mobile (padding 32px 24px).
 *   - Padding: px-6 md:px-10 lg:px-16, py-8.
 *
 * NOTE — mascot asset limitation: the real panda mascot image is hosted on
 * Riot's CDN with no public stable URL. A `mascotSrc` prop accepts any URL;
 * when omitted a decorative colour-block placeholder is shown instead.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MerchSupportHeroProps {
  /**
   * URL of the mascot illustration shown on the right of the hero.
   * Real mascot art is unavailable (Riot CDN, no stable URL) — supply a
   * placeholder image (e.g. championSplashUrl) from the page route.
   * When omitted, a decorative placeholder block is rendered.
   */
  mascotSrc?: string;
  /** Alt text for the mascot image. @default "Support mascot" */
  mascotAlt?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * MerchSupportHero — red-splash hero band with h1 "SUPPORT" and a
 * mascot illustration slot. Shared across all /merch/pages/[slug] info pages.
 * Real: red diagonal splash fills the band; large panda mascot ~30% right.
 */
export function MerchSupportHero({
  mascotSrc,
  mascotAlt = "Support mascot",
}: MerchSupportHeroProps) {
  return (
    /* Red-splash hero band — measured: --color-merch-support-band (#eb0029) */
    <div
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: "var(--color-merch-support-band)",
        /* Band height: ~140px desktop; auto on mobile */
        minHeight: 140,
      }}
    >
      {/* Diagonal splash overlay — decorative red-on-red tint for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(118deg, var(--color-merch-support-band) 60%, var(--color-merch-red-dark) 100%)",
        }}
      />

      <div
        className="relative mx-auto flex max-w-screen-xl items-center justify-between px-6 py-8 md:px-10 lg:px-16"
        style={{ minHeight: 140 }}
      >
        {/* Left — SUPPORT h1 */}
        {/*
          letter-spacing: -0.02em — real: -0.76px@38px @390 (was -0.03em which gave -1.44px desktop / -1.14px mobile).
          line-height ~1.1 (leading-tight) — real: 52.8px at 48px font-size.
          color: --color-merch-ink-dark (pure black #000000) — real: #000 on the h1.
        */}
        <h1
          className="text-[38px] font-bold uppercase leading-tight md:text-[48px]"
          style={{
            color: "var(--color-merch-ink-dark)",
            letterSpacing: "-0.02em",
          }}
        >
          SUPPORT
        </h1>

        {/* Right — mascot illustration or placeholder — full band height, ~30% width */}
        <div
          className="relative ml-6 shrink-0 self-stretch"
          style={{
            width: "clamp(120px, 30%, 340px)",
            /* Mascot bleeds to band edges vertically */
          }}
          aria-hidden={!mascotSrc}
        >
          {mascotSrc ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={mascotSrc}
              alt={mascotAlt}
              className="absolute inset-0 h-full w-full object-cover object-left-top"
              draggable={false}
            />
          ) : (
            /* Decorative colour-block — mascot asset unavailable (Riot CDN, no stable public URL) */
            <div
              className="flex h-full w-full items-center justify-center"
              aria-label="Mascot placeholder"
              style={{ backgroundColor: "var(--color-merch-red-dark)", opacity: 0.4 }}
            >
              <svg
                width={56}
                height={56}
                viewBox="0 0 40 40"
                fill="none"
                aria-hidden
              >
                {/* Simple paw-print silhouette as placeholder */}
                <circle cx="20" cy="24" r="10" fill="var(--color-merch-on-dark)" />
                <circle cx="10" cy="14" r="5" fill="var(--color-merch-on-dark)" />
                <circle cx="30" cy="14" r="5" fill="var(--color-merch-on-dark)" />
                <circle cx="15" cy="10" r="3.5" fill="var(--color-merch-on-dark)" />
                <circle cx="25" cy="10" r="3.5" fill="var(--color-merch-on-dark)" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
