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
 *   - Band height: ~250px desktop (h1 baseline y=229, tab strip y=380 measured live).
 *     Ours was 140px — too short. New: minHeight 250px.
 *   - h1 "SUPPORT": 48px desktop / 38px mobile, font-weight 700, uppercase,
 *     letter-spacing -0.03em desktop (== -1.44px at 48px) / -0.02em mobile (== -0.76px at 38px).
 *     line-height 1.1 (52.8px at 48px), color --color-merch-ink-dark (pure black).
 *     x=16 mobile (px-4) / x=32 desktop (px-8) — real h1 x=16 at 390, 32px at desktop.
 *   - Mascot: object-contain top-right (not object-cover) per issue #897 round-4 re-review.
 *   - Background decoration: faint light-grey dot/texture pattern on the left half
 *     + a hard diagonal red splash wedge behind the mascot (clip-path polygon).
 *   - Mascot illustration: right-edge of the band, occupying ~30% right.
 *     Real asset is a Riot CDN PNG (unavailable — accept any URL or fall back to decorative block).
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
 * Real: 250px tall, 32px left-gutter h1, diagonal wedge behind mascot,
 * faint pattern texture on the left half.
 */
export function MerchSupportHero({
  mascotSrc,
  mascotAlt = "Support mascot",
}: MerchSupportHeroProps) {
  return (
    /* Red-splash hero band — measured: --color-merch-support-band (#eb0029) */
    /* Band height: 250px desktop (h1 baseline y=229, tab strip y=380 measured) */
    <div
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: "var(--color-merch-support-band)",
        minHeight: 250,
      }}
    >
      {/*
        Faint light-grey dot/texture pattern on the left half of the band.
        Real: a subtle repeating pattern is visible left of the mascot.
        Using a radial-gradient dot pattern as a CSS approximation.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0"
        style={{
          width: "60%",
          backgroundImage:
            "radial-gradient(circle, color-mix(in srgb, var(--color-merch-on-dark) 12%, transparent) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      {/*
        Hard diagonal red splash wedge behind the mascot (right side).
        Real: a diagonal red-on-red lighter wedge sits behind the mascot area,
        giving the band depth. clip-path creates a hard diagonal edge from
        lower-left to upper-right, lighter shade on the masked area.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: "var(--color-merch-red-dark)",
          clipPath: "polygon(55% 0%, 100% 0%, 100% 100%, 40% 100%)",
        }}
      />

      {/*
        Content row: h1 at 16px left gutter mobile (px-4) / 32px desktop (px-8).
        Real x=16 at 390px, x=32 at 1280px — NOT centered within max-w-screen-xl.
      */}
      <div
        className="relative flex w-full items-center justify-between px-4 md:px-8"
        style={{ minHeight: 250 }}
      >
        {/* Left — SUPPORT h1 */}
        {/*
          letter-spacing: -0.02em mobile (−0.76px at 38px) / -0.03em desktop (−1.44px at 48px).
          line-height 1.1 (leading-tight ~1.1) — real: 52.8px at 48px.
          color: --color-merch-ink-dark (pure black #000000) — real: #000 on the h1.
        */}
        <h1
          className="text-[38px] font-bold uppercase md:text-[48px]"
          style={{
            color: "var(--color-merch-ink-dark)",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          SUPPORT
        </h1>

        {/* Right — mascot illustration or placeholder — full band height, ~30% width */}
        <div
          className="relative ml-6 shrink-0 self-stretch"
          style={{
            width: "clamp(120px, 30%, 340px)",
          }}
          aria-hidden={!mascotSrc}
        >
          {mascotSrc ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={mascotSrc}
              alt={mascotAlt}
              className="absolute inset-0 h-full w-full object-contain object-right-top"
              draggable={false}
            />
          ) : (
            /* Decorative colour-block — mascot asset unavailable (Riot CDN, no stable public URL) */
            <div
              className="flex h-full w-full items-center justify-center"
              aria-label="Mascot placeholder"
              style={{ opacity: 0.4 }}
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
