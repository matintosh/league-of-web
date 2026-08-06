/**
 * MerchSearchHero — permanent hero for /merch/search.
 *
 * MERCH COMPONENT — use the merch design system: --color-merch-* tokens.
 * This is NOT the Hextech client.
 * Presentational: props in, callbacks out. NO fetch.
 * Types imported from @low/fixtures; art URLs supplied by the page route
 * (Riot Sanity CDN or local stub).
 *
 * Measured from merch.riotgames.com/en-us/search (all URLs — no ?q=, ?q=jinx,
 * any query) at desktop 1280px AND mobile 390px. The real page is a PERMANENT
 * non-functional placeholder — it ALWAYS shows the "NO SEARCH TERM PROVIDED"
 * hero regardless of query. There is no working search results view.
 *
 * Desktop 1280 measurements:
 *   - Hero band: y=130, h=800, full-viewport width
 *   - Background: LIGHT near-white (#ffffff) base + THREE layered art assets:
 *       1. arcade_riven_ahri.svg — full-bleed cover, intrinsically faint/grayscale
 *       2. pattern-404.svg — contain, anchored top-right (background-position 100% 0)
 *       3. ziggs.png — 320×288, absolute at x=704 y=338 (right side of band)
 *   - H1 "NO SEARCH TERM PROVIDED":
 *       font: riotSans / 48px / 700 / uppercase
 *       letter-spacing: -1.44px (≈ -0.03em)
 *       line-height: 52.8px (1.1)
 *       color: BLACK rgb(0,0,0)
 *       container ~714px (pad 0 32px), single line at 1280
 *       y≈450 (320px from top of band) — high-anchored, NOT centred
 *   - H1→CTA gap: 12px (mt-3)
 *   - CTA "SEARCH PRODUCTS":
 *       16px / 600 / white / uppercase / letter-spacing 0.32px (0.02em)
 *       padding: 0 16px; height 50px; line-height 18px; min-width 239px
 *       fill: --color-merch-purple (#4500d5 measured live)
 *       hover: --color-merch-purple-dark
 *       chamfered: clip-path polygon top-right + bottom-left corners cut 10px
 *       x=32, below h1; border: none; border-radius: 0
 *
 * Mobile 390 measurements:
 *   - H1: 38px / ls -0.76px / lh 41.8px / one line
 *   - H1 y≈370 (240px from top of band) — high-anchored
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
   * URL for the full-bleed arcade art SVG (arcade_riven_ahri.svg).
   * Intrinsically faint/grayscale — cover-fills the 800px band.
   * When omitted a subtle diagonal placeholder is rendered.
   */
  arcadeSrc?: string;
  /** Alt text for the arcade art. @default "" (decorative) */
  arcadeAlt?: string;
  /**
   * URL for the repeating pattern overlay (pattern-404.svg).
   * Contained at top-right of the band. When omitted the layer is skipped.
   */
  patternSrc?: string;
  /**
   * URL for the Ziggs character PNG, positioned right-side of band.
   * Absolute: 320×288 at x=704, y=338 (measured from the real site).
   * When omitted the layer is skipped.
   */
  ziggsSrc?: string;
  /** Alt text for the Ziggs character. @default "" (decorative) */
  ziggsAlt?: string;
  /**
   * @deprecated Use arcadeSrc instead. Kept for backwards compat with the
   * showcase's "With champion splash" variant — treated as arcadeSrc.
   */
  artSrc?: string;
  /** @deprecated Use arcadeAlt instead. */
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
 * Content is high-anchored (320px top padding desktop, 240px mobile).
 * Three layered background assets (arcade SVG, pattern SVG, Ziggs PNG)
 * supplied by the page via props (Riot Sanity CDN).
 */
export function MerchSearchHero({
  onSearchClick,
  arcadeSrc,
  arcadeAlt = "",
  patternSrc,
  ziggsSrc,
  ziggsAlt = "",
  /* backwards-compat aliases */
  artSrc,
  artAlt,
}: MerchSearchHeroProps) {
  /* Resolve backwards-compat aliases so old callers still render art. */
  const resolvedArcadeSrc = arcadeSrc ?? artSrc;
  const resolvedArcadeAlt = arcadeAlt || artAlt || "";

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
        /* Content top padding — high-anchored, not centred.
           Desktop: 320px (H1 y=450 at 1280px, band top y=130 → 450-130=320).
           Mobile:  240px (H1 y=370 at 390px,  band top y=130 → 370-130=240). */
        .merch-search-hero-content {
          padding-top: 320px;
        }
        @media (max-width: 639px) {
          .merch-search-hero-content {
            padding-top: 240px;
          }
        }
      `}</style>

      {/* ---------------------------------------------------------------- */}
      {/* Layer 1: arcade_riven_ahri.svg — full-bleed cover.               */}
      {/* Intrinsically faint/light-grayscale; no extra opacity needed.    */}
      {/* When absent a subtle diagonal placeholder renders at 0.08 opacity */}
      {/* (--color-merch-search-hero-art-opacity token).                   */}
      {/* ---------------------------------------------------------------- */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={
          resolvedArcadeSrc
            ? undefined
            : { opacity: "var(--color-merch-search-hero-art-opacity, 0.08)" }
        }
      >
        {resolvedArcadeSrc ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={resolvedArcadeSrc}
            alt={resolvedArcadeAlt}
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
      {/* Layer 2: pattern-404.svg — contained at top-right of band.       */}
      {/* Only rendered when patternSrc is supplied by the page.           */}
      {/* ---------------------------------------------------------------- */}
      {patternSrc && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url(${patternSrc})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "100% 0",
          }}
        />
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Layer 3: ziggs.png — character art, right side of band.          */}
      {/* Measured from real site: position absolute within the hero band.  */}
      {/*   left: 704px, top: 208px, width: 320px, height: 288px           */}
      {/*   (band-relative: rect.y 338 = band-top 130 + top 208)           */}
      {/* background-size: contain, background-position: 100% 0            */}
      {/* Only rendered when ziggsSrc is supplied by the page.             */}
      {/* ---------------------------------------------------------------- */}
      {ziggsSrc && (
        <div
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            left: "704px",
            top: "208px",
            width: "320px",
            height: "288px",
            backgroundImage: `url(${ziggsSrc})`,
            backgroundSize: "contain",
            backgroundPosition: "100% 0",
            backgroundRepeat: "no-repeat",
          }}
        />
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Content — left-aligned, px-4 mobile / px-8 desktop (x=32 real)  */}
      {/* High-anchored: paddingTop 320px desktop / 240px mobile.          */}
      {/* Measured: H1 y=450 @1280 (320px from band top at y=130);        */}
      {/*           H1 y=370 @390  (240px from band top at y=130).         */}
      {/* maxWidth 714px — matches title-container measured from real site. */}
      {/* ---------------------------------------------------------------- */}
      <div
        className="merch-search-hero-content relative z-10 flex flex-col px-4 md:px-8"
        style={{
          minHeight: "800px",
          maxWidth: 714,
        }}
      >
        {/* H1: "NO SEARCH TERM PROVIDED"
            Desktop: 48px / -1.44px / lh 52.8px — one line at ~650px text width.
            Mobile (390): 38px / -0.76px / lh 41.8px — no overflow.
            Color: BLACK (rgb(0,0,0) via --color-merch-ink-dark = #000000).
            Typography via .merch-search-hero-h1 class + media query in style block. */}
        <h1
          className="merch-search-hero-h1 font-bold uppercase"
          style={{
            color: "var(--color-merch-ink-dark)",
          }}
        >
          NO SEARCH TERM PROVIDED
        </h1>

        {/* CTA: "SEARCH PRODUCTS"
            16px / 600 / white / uppercase / ls 0.32px / lh 18px
            239×50 / no border / no radius / chamfered via clip-path
            fill: --color-merch-purple (#4500d5 measured from real site)
            Hover: --color-merch-purple-dark — handled by .merch-search-hero-cta class.
            Gap to H1: 12px (mt-3) — measured from real site (H1 bottom 503 → CTA top 515). */}
        <button
          type="button"
          onClick={onSearchClick}
          className="merch-search-hero-cta mt-3 font-semibold uppercase"
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
