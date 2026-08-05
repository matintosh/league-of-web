/**
 * LauncherOverviewHero — full-bleed splash background for the Overview tab.
 *
 * Fills the entire content area (approximately 1080×660 px at 1536px viewport,
 * accounting for left rail ~56px and right friends panel ~280px). Renders a
 * champion/promo splash image as object-cover shifted right, a softened left
 * vignette scrim, the "LEAGUE OF / LEGENDS" gold metallic logotype TOP-anchored
 * in the overlay, and exposes render slots for the overlay card + carousel.
 *
 * Layout measured from lol-launcher-ref/image.png at 1536×864, ÷1.2 → our 1280×720 space:
 *   overlay left edge x≈150, wordmark bbox ≈240×120, featured card top y≈408.
 *
 * Token source: packages/tokens/src/theme.css — --color-launcher-* set (issues #679, #681, #732, #742).
 */

import type { ReactNode } from "react";

export interface LauncherOverviewHeroProps {
  /** Champion/promo splash URL from championSplashUrl(). Supplied by the page. */
  splashUrl: string;
  /** Featured card anchored bottom-left of the hero at y≈408 (LauncherFeaturedCard). */
  featuredCard?: ReactNode;
  /** Content anchored to the bottom edge, partially clipped by the viewport (LauncherContentCarousel). */
  carousel?: ReactNode;
  /**
   * Optional play button slot between the wordmark and the featured card gap.
   * Matches the gold "▶ Play ▾" pill in lol-launcher-ref/image.png (~y180 ref). Presentational slot.
   */
  playButton?: ReactNode;
}

/**
 * Full-bleed hero for the launcher Overview tab.
 *
 * Layout (measured from lol-launcher-ref/image.png at 1536×864, ÷1.2 → our 1280×720 space):
 *   - Splash image object-cover, objectPosition ~70% 0% — art pushed right of center
 *   - Softened left→right vignette (~40% width) so art reads through behind the wordmark zone
 *   - Bottom gradient scrim ensures text legibility
 *   - "LEAGUE OF" row 1 (small superscript "OF" at END of row 1) + "LEGENDS" row 2
 *     Gold metallic, bbox ≈240×120 at x≈150, top y≈53 (our space, ref ÷1.2)
 *   - Play button slot at y≈150 (ref ÷1.2 ≈ y180-185)
 *   - featuredCard BOTTOM-anchored so headline top lands at y≈408
 *   - carousel rendered as the bottom strip, partially clipped at the fold
 */
export function LauncherOverviewHero({
  splashUrl,
  featuredCard,
  carousel,
  playButton,
}: LauncherOverviewHeroProps) {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      {/* Hero body — splash + scrims + top-left overlay zone.
          height 652px keeps the carousel anchored to y≈652 at 1280×720 (ref band top);
          the outer overflow-hidden clips the carousel at the 720px fold (~68px visible).
          The featured card is bottom-anchored absolutely at top:408 within this 652 zone (#742). */}
      <div className="relative shrink-0" style={{ height: 652 }}>
        {/* Champion/promo splash — shifted right so the champion is not behind text */}
        <img
          src={splashUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "70% 0%" }}
        />

        {/* Left vignette scrim — softened (~40% width) so splash art reads through.
            Ref shows the splash visible behind the wordmark zone; previously too heavy. */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0"
          style={{
            width: "40%",
            background:
              "linear-gradient(to right, var(--color-launcher-scrim-side) 0%, var(--color-launcher-scrim-side) 20%, transparent 100%)",
          }}
        />

        {/* Bottom scrim — gradient so bottom-zone text stays legible */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0"
          style={{
            height: "45%",
            background:
              "linear-gradient(to top, var(--color-launcher-scrim-bottom) 0%, transparent 100%)",
          }}
        />

        {/* TOP-LEFT overlay zone — wordmark (x≈150, y≈53) + play button (~y150) */}
        {/* left=86px puts the stack at x≈150 (rail 64px + 86px padding). */}
        <div
          className="absolute left-0 top-0 flex flex-col gap-3"
          style={{ paddingTop: 53, paddingLeft: 86, paddingRight: 24 }}
        >
          {/* "LEAGUE OF / LEGENDS" 2-row wordmark — gold metallic treatment.
              Row 1: "LEAGUE" large + small superscript "OF" at end (ref arrangement).
              Row 2: "LEGENDS" large.
              Bbox target ≈240×120, metallic gold gradient (background-clip: text). */}
          <div
            aria-label="League of Legends"
            style={{
              width: 240,
              lineHeight: 1,
              userSelect: "none",
              fontFamily: "var(--font-display)",
            }}
          >
            {/* Row 1: LEAGUE + superscript OF */}
            <div
              className="flex items-end gap-[6px]"
              style={{ lineHeight: 1 }}
            >
              <span
                style={{
                  fontSize: 48,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  background:
                    "linear-gradient(160deg, var(--color-gold-1) 0%, var(--color-gold-2) 35%, var(--color-gold-3) 55%, var(--color-gold-1) 75%, var(--color-gold-coin) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 2px 4px var(--color-launcher-wordmark-shadow))",
                }}
              >
                League
              </span>
              {/* Superscript "OF" — small caps, sits at the end of row 1 per ref */}
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                  background:
                    "linear-gradient(160deg, var(--color-gold-1) 0%, var(--color-gold-2) 40%, var(--color-gold-3) 60%, var(--color-gold-1) 80%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 1px 3px var(--color-launcher-wordmark-shadow))",
                }}
              >
                of
              </span>
            </div>
            {/* Row 2: LEGENDS */}
            <div
              style={{
                fontSize: 46,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginTop: -2,
                background:
                  "linear-gradient(160deg, var(--color-gold-1) 0%, var(--color-gold-2) 35%, var(--color-gold-3) 55%, var(--color-gold-1) 75%, var(--color-gold-coin) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 2px 4px var(--color-launcher-wordmark-shadow))",
              }}
            >
              Legends
            </div>
          </div>

          {/* Play button slot — between wordmark and featured card (y≈150 our space). */}
          {playButton}
        </div>

        {/* BOTTOM-ANCHORED featured card — headline top at y≈408 our space.
            Positioned absolute so it doesn't push down from the wordmark flex chain. */}
        {featuredCard && (
          <div
            className="absolute left-0"
            style={{
              top: 408,
              paddingLeft: 86,
              paddingRight: 24,
            }}
          >
            {featuredCard}
          </div>
        )}
      </div>

      {/* Carousel strip — anchored to the bottom, partially clipped by the 720 viewport fold.
          The strip begins near y≈652 (ref) and is ~68px visible before the edge clips it. */}
      {carousel && (
        <div className="w-full shrink-0">{carousel}</div>
      )}
    </div>
  );
}
