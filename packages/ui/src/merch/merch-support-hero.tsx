/**
 * MerchSupportHero — shared SUPPORT page hero band for /merch/pages/[slug].
 *
 * MERCH COMPONENT — use the merch design system: --color-merch-* tokens.
 * This is NOT the Hextech client.
 * Presentational: props in, no callbacks needed.
 * Types are imported from @low/fixtures; mascot image URL is supplied by the page.
 *
 * Measured from merch.riotgames.com/en-us/faqs/ (desktop 1280px):
 *   - Background: white (--color-merch-bg) — real: first non-transparent ancestor of SUPPORT h1 is body at rgb(255,255,255)
 *   - h1 "SUPPORT": 48px desktop / 38px mobile, font-weight 700, uppercase
 *     letter-spacing -0.03em (scales with font size; -1.44px at 48px measured, -0.76px at 390px), color --color-merch-ink, left-aligned
 *   - Mascot illustration: right-aligned image; real asset is a Riot CDN PNG
 *     (unavailable — accept any URL or fall back to a decorative placeholder block)
 *   - Band height: ~140px desktop; auto on mobile (padding 32px 24px)
 *   - Padding: px-6 md:px-10 lg:px-16, py-8 md:py-10
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
 * MerchSupportHero — light-background hero band with h1 "SUPPORT" and a
 * mascot illustration slot. Shared across all /merch/pages/[slug] info pages.
 */
export function MerchSupportHero({
  mascotSrc,
  mascotAlt = "Support mascot",
}: MerchSupportHeroProps) {
  return (
    /* White hero band — real: first non-transparent ancestor of SUPPORT h1 is body at rgb(255,255,255) */
    <div
      className="w-full"
      style={{ backgroundColor: "var(--color-merch-bg)" }}
    >
      <div
        className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-8 md:px-10 md:py-10 lg:px-16"
      >
        {/* Left — SUPPORT h1 */}
        {/* letter-spacing: -0.03em scales with font size (-1.44px at 48px desktop, -0.76px at mobile ~38px) */}
        <h1
          className="text-[38px] font-bold uppercase leading-none md:text-[48px]"
          style={{
            color: "var(--color-merch-ink)",
            letterSpacing: "-0.03em",
          }}
        >
          SUPPORT
        </h1>

        {/* Right — mascot illustration or placeholder */}
        <div
          className="relative ml-6 shrink-0 overflow-hidden"
          style={{
            width: 120,
            height: 120,
            /* Placeholder bg shown when no mascotSrc is supplied */
            backgroundColor: mascotSrc ? "transparent" : "var(--color-merch-border)",
            borderRadius: 4,
          }}
          aria-hidden={!mascotSrc}
        >
          {mascotSrc ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={mascotSrc}
              alt={mascotAlt}
              className="h-full w-full object-cover"
              draggable={false}
            />
          ) : (
            /* Decorative colour-block — mascot asset unavailable (Riot CDN, no stable public URL) */
            <div
              className="flex h-full w-full items-center justify-center"
              aria-label="Mascot placeholder"
            >
              <svg
                width={40}
                height={40}
                viewBox="0 0 40 40"
                fill="none"
                aria-hidden
              >
                {/* Simple paw-print silhouette as placeholder */}
                <circle cx="20" cy="24" r="10" fill="var(--color-merch-muted)" />
                <circle cx="10" cy="14" r="5" fill="var(--color-merch-muted)" />
                <circle cx="30" cy="14" r="5" fill="var(--color-merch-muted)" />
                <circle cx="15" cy="10" r="3.5" fill="var(--color-merch-muted)" />
                <circle cx="25" cy="10" r="3.5" fill="var(--color-merch-muted)" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
