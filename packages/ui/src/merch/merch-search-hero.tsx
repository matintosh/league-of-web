/**
 * MerchSearchHero — permanent hero for /merch/search.
 *
 * MERCH COMPONENT — use the merch design system: --color-merch-* tokens.
 * This is NOT the Hextech client.
 * Presentational: props in, callbacks out. NO fetch.
 * Types imported from @low/fixtures; art URL supplied by the page route.
 *
 * Measured from merch.riotgames.com/en-us/search (all URLs — no ?q=, ?q=jinx,
 * any query) at desktop 1280px AND mobile 390px. The real page is a PERMANENT
 * non-functional placeholder — it ALWAYS shows the "NO SEARCH TERM PROVIDED"
 * hero regardless of query. There is no working search results view.
 *
 * Desktop 1280 measurements:
 *   - Hero band: y=130, h=800, full-viewport width
 *   - Background: LIGHT near-white (#ffffff) base + grayscale SVG art layer
 *     (arcade_riven_ahri.svg — faint full-bleed cover). NOT dark/gradient.
 *   - H1 "NO SEARCH TERM PROVIDED":
 *       font: riotSans / 48px / 700 / uppercase
 *       letter-spacing: -1.44px (≈ -0.03em)
 *       line-height: 52.8px (1.1)
 *       color: BLACK rgb(0,0,0)  ← was white; now corrected
 *       container ~714px (pad 0 32px), single line at 1280
 *   - CTA "SEARCH PRODUCTS":
 *       16px / 600 / white / uppercase / letter-spacing 0.32px (0.02em)
 *       padding: 0 16px; height 50px; line-height 18px; min-width 239px
 *       fill: --color-merch-purple (#4500d5 measured live)
 *       hover: --color-merch-purple-dark
 *       chamfered: clip-path polygon top-right + bottom-left corners cut 10px
 *       x=32, below h1; border: none; border-radius: 0
 *
 * Mobile 390 measurements:
 *   - H1: 38px / ls -0.76px / lh 41.8px / one line (not 32px + hard -1.44px)
 *   - Hero content padding: 16px (px-4) — not 32px (px-8)
 *   - No horizontal overflow
 *
 * Server-safe: no event handlers beyond onClick (fine for RSC serialisation).
 * Hover is handled via a scoped <style> block + CSS class.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MerchSearchHeroProps {
  /**
   * Called when the user clicks "SEARCH PRODUCTS".
   * The containing page can use this to focus a search input or navigate.
   */
  onSearchClick?: () => void;
  /**
   * Optional champion art URL for the hero background illustration.
   * Real asset is Riot CDN (no stable public URL). When omitted a faint
   * decorative placeholder layer is rendered at the correct opacity.
   */
  artSrc?: string;
  /** Alt text for the art image. @default "Search hero art" */
  artAlt?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * MerchSearchHero — permanent hero shown on /merch/search at ALL times.
 * The real merch.riotgames.com/en-us/search never shows a results view;
 * this hero is the entire page content (above the footer).
 *
 * Light bg (#ffffff), black H1, chamfered purple CTA.
 */
export function MerchSearchHero({
  onSearchClick,
  artSrc,
  artAlt = "Search hero art",
}: MerchSearchHeroProps) {
  return (
    /* Full-viewport hero band — ~800px tall on desktop. Light background
       matching the real merch.riotgames.com/en-us/search permanent placeholder. */
    <div
      className="relative w-full overflow-hidden"
      style={{
        minHeight: "800px",
        backgroundColor: "var(--color-merch-bg)",
      }}
    >
      {/*
       * Scoped hover + clip-path styles for the CTA button.
       * CSS class keeps this prerender-safe (server-renderable in showcase).
       * Chamfer: clip-path cuts top-right and bottom-left corners by 10px,
       * matching the measured shape on the real merch.riotgames.com search page.
       */}
      <style>{`
        .merch-search-hero-cta {
          background-color: var(--color-merch-purple);
          clip-path: polygon(
            0 0,
            calc(100% - 10px) 0,
            100% 10px,
            100% 100%,
            10px 100%,
            0 calc(100% - 10px)
          );
        }
        .merch-search-hero-cta:hover {
          background-color: var(--color-merch-purple-dark);
        }
        /* H1 typography — desktop fixed at 48px/-1.44px (one line at ~650px).
           Mobile (<640px breakpoint): 38px/-0.76px, matches real @390 measurement. */
        .merch-search-hero-h1 {
          font-size: 48px;
          letter-spacing: -1.44px;
          line-height: 1.1;
        }
        @media (max-width: 639px) {
          .merch-search-hero-h1 {
            font-size: 38px;
            letter-spacing: -0.76px;
            line-height: 1.1;
          }
        }
      `}</style>

      {/* ---------------------------------------------------------------- */}
      {/* Background art — full-bleed cover, faint grayscale overlay        */}
      {/* Real: arcade_riven_ahri.svg at low opacity across the full band.  */}
      {/* No dark gradient; base is pure white (--color-merch-bg).          */}
      {/* ---------------------------------------------------------------- */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ opacity: "var(--color-merch-search-hero-art-opacity, 0.08)" }}
      >
        {artSrc ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={artSrc}
            alt={artAlt}
            className="h-full w-full object-cover"
            draggable={false}
          />
        ) : (
          /* Decorative placeholder — subtle diagonal pattern evokes arcade art.
             Very low opacity (controlled by token above) so the white bg reads. */
          <div
            className="h-full w-full"
            style={{
              background:
                "repeating-linear-gradient(-55deg, transparent, transparent 40px, var(--color-merch-ink) 40px, var(--color-merch-ink) 80px)",
            }}
          />
        )}
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Content — left-aligned, px-4 mobile / px-8 desktop (x=32 real)  */}
      {/* Vertically centred in the 800px band.                            */}
      {/* maxWidth ~720 so H1 stays one line at 1280px desktop.            */}
      {/* ---------------------------------------------------------------- */}
      <div
        className="relative z-10 flex flex-col justify-center px-4 md:px-8"
        style={{
          minHeight: "800px",
          maxWidth: 720,
        }}
      >
        {/* H1: "NO SEARCH TERM PROVIDED"
            Desktop: 48px / -1.44px / lh 52.8px — one line at ~650px text width.
            Mobile (390): 38px / -0.76px / lh 41.8px — no overflow.
            Color: BLACK (rgb(0,0,0) via --color-merch-ink = #1a1a1a near-black).
            Typography applied via .merch-search-hero-h1 class + media query above
            to avoid the CSS clamp() letterSpacing pitfall. */}
        <h1
          className="merch-search-hero-h1 font-bold uppercase"
          style={{
            /* Issue specifies BLACK rgb(0,0,0) — use --color-merch-ink-dark (#000000) */
            color: "var(--color-merch-ink-dark)",
          }}
        >
          NO SEARCH TERM PROVIDED
        </h1>

        {/* CTA: "SEARCH PRODUCTS"
            16px / 600 / white / uppercase / ls 0.32px / lh 18px
            239×50 / no border / no radius / chamfered via clip-path
            fill: --color-merch-purple (#4500d5 measured from real site)
            Hover: --color-merch-purple-dark — handled by .merch-search-hero-cta class. */}
        <button
          type="button"
          onClick={onSearchClick}
          className="merch-search-hero-cta mt-6 font-semibold uppercase"
          style={{
            color: "var(--color-merch-on-dark)",
            fontFamily: "var(--font-merch-display)",
            fontSize: "16px",
            letterSpacing: "0.32px",
            lineHeight: "18px",
            padding: "0 16px",
            height: "50px",
            minWidth: "239px",
            border: "none",
            cursor: "pointer",
            /* Left-align: match x=32 reference position */
            alignSelf: "flex-start",
          }}
        >
          SEARCH PRODUCTS
        </button>
      </div>
    </div>
  );
}
