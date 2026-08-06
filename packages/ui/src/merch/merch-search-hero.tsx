/**
 * MerchSearchHero — no-query hero for /merch/search.
 *
 * MERCH COMPONENT — use the merch design system: --color-merch-* tokens.
 * This is NOT the Hextech client.
 * Presentational: props in, callbacks out. NO fetch.
 * Types imported from @low/fixtures; art URL supplied by the page route.
 *
 * Measured from merch.riotgames.com/en-us/search (no ?q=, desktop 1280px):
 *   - Hero band: ~800px tall (y 130→930), full-viewport width
 *   - Background: diagonal red/purple split with champion illustration
 *     (arcade_riven_ahri.svg). Placeholder art acceptable for portfolio.
 *   - H1 "NO SEARCH TERM PROVIDED":
 *       font: riotSans 48px / 700 / uppercase
 *       letter-spacing: -1.44px (≈ -0.03em at 48px)
 *       line-height: 52.8px (≈ 1.1)
 *       color: white (on-dark)
 *       left-aligned, x=32, y≈450
 *   - CTA "SEARCH PRODUCTS":
 *       16px / 600 / white / uppercase / letter-spacing 0.32px (0.02em)
 *       padding: 0 16px; height ≈ 50px; min-width ≈ 239px; border-radius: 0
 *       fill: --color-merch-purple
 *       hover: --color-merch-purple-dark
 *       x=32, below h1
 *
 * Server-safe: no event handlers beyond onClick (which is fine for RSC
 * serialisation); hover is handled via a scoped <style> block + CSS class.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MerchSearchHeroProps {
  /**
   * Called when the user clicks "SEARCH PRODUCTS".
   * The page should focus/scroll to its search input.
   */
  onSearchClick?: () => void;
  /**
   * Optional champion art URL for the hero background illustration.
   * Real asset is Riot CDN (no stable public URL). When omitted a
   * decorative gradient placeholder is rendered.
   */
  artSrc?: string;
  /** Alt text for the art image. @default "Search hero art" */
  artAlt?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * MerchSearchHero — full-viewport hero shown on /merch/search when no search
 * term is provided. Displays "NO SEARCH TERM PROVIDED" h1 + purple "SEARCH
 * PRODUCTS" CTA. The containing page gates the results UI behind a non-empty
 * query, rendering this hero otherwise.
 */
export function MerchSearchHero({
  onSearchClick,
  artSrc,
  artAlt = "Search hero art",
}: MerchSearchHeroProps) {
  return (
    /* Full-viewport hero band — ~800px tall on desktop. Relative so the art
       can be positioned absolutely in the right half, matching the real site. */
    <div
      className="relative w-full overflow-hidden"
      style={{
        minHeight: "800px",
        backgroundColor: "var(--color-merch-ink)",
      }}
    >
      {/*
       * Scoped hover styles for the CTA button.
       * We use a CSS class instead of onMouseOver/onMouseOut so this
       * component stays prerender-safe (server-renderable in the showcase).
       */}
      <style>{`
        .merch-search-hero-cta {
          background-color: var(--color-merch-purple);
        }
        .merch-search-hero-cta:hover {
          background-color: var(--color-merch-purple-dark);
        }
      `}</style>

      {/* ---------------------------------------------------------------- */}
      {/* Background — diagonal purple/crimson split                        */}
      {/* Real: linear-gradient behind a champion illustration SVG.         */}
      {/* Token stops defined in packages/tokens/src/merch.css.             */}
      {/* ---------------------------------------------------------------- */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, var(--color-merch-purple) 0%, var(--color-merch-search-hero-dark) 45%, var(--color-merch-search-hero-crimson) 100%)",
        }}
      />

      {/* Art — champion illustration pinned to the right. Real site uses an
          SVG sprite (arcade_riven_ahri.svg); we accept any URL from the page
          or fall back to a decorative placeholder. */}
      <div
        aria-hidden={!artSrc}
        className="pointer-events-none absolute bottom-0 right-0 top-0"
        style={{ width: "55%", maxWidth: 720 }}
      >
        {artSrc ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={artSrc}
            alt={artAlt}
            className="h-full w-full object-cover object-left-top"
            draggable={false}
          />
        ) : (
          /* Decorative placeholder — subtle diagonal lines evoke the real art.
             Token --color-merch-search-hero-lines = rgba(255,255,255,0.03) */
          <div
            className="h-full w-full"
            style={{
              background:
                "repeating-linear-gradient(-55deg, transparent, transparent 40px, var(--color-merch-search-hero-lines) 40px, var(--color-merch-search-hero-lines) 80px)",
            }}
          />
        )}
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Content — left-aligned, x=32, centred vertically in the band     */}
      {/* ---------------------------------------------------------------- */}
      <div
        className="relative z-10 flex flex-col justify-center px-8"
        style={{
          minHeight: "800px",
          /* Max ~50% width so content never overlaps the art on desktop */
          maxWidth: 640,
        }}
      >
        {/* H1: "NO SEARCH TERM PROVIDED" */}
        {/* Measured: 48px / 700 / uppercase / ls -1.44px / lh 52.8px
            Scaled to 32px on mobile (≤390) to avoid overflow. */}
        <h1
          className="text-[32px] font-bold uppercase leading-[1.1] sm:text-[40px] md:text-[48px]"
          style={{
            color: "var(--color-merch-on-dark)",
            letterSpacing: "-1.44px",
          }}
        >
          NO SEARCH TERM PROVIDED
        </h1>

        {/* CTA: "SEARCH PRODUCTS" */}
        {/* Measured: 16px / 600 / white / uppercase / ls 0.32px
            ~239×50 / radius 0 / fill --color-merch-purple
            Hover handled by .merch-search-hero-cta CSS class above. */}
        <button
          type="button"
          onClick={onSearchClick}
          className="merch-search-hero-cta mt-6 font-semibold uppercase"
          style={{
            color: "var(--color-merch-on-dark)",
            fontSize: "16px",
            letterSpacing: "0.32px",
            padding: "0 16px",
            height: "50px",
            minWidth: "239px",
            borderRadius: 0,
            border: "none",
            cursor: "pointer",
            /* Align button to left edge (matching x=32 in the real site) */
            alignSelf: "flex-start",
          }}
        >
          SEARCH PRODUCTS
        </button>
      </div>
    </div>
  );
}
