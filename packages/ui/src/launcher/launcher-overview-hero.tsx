/**
 * LauncherOverviewHero — full-bleed splash background for the Overview tab.
 *
 * Fills the entire content area (approximately 1080×660 px at 1536px viewport,
 * accounting for left rail ~56px and right friends panel ~280px). Renders a
 * champion/promo splash image as object-cover shifted right, a strong left
 * vignette scrim, the "LEAGUE OF LEGENDS" gold metallic logotype TOP-anchored
 * in the overlay, and exposes render slots for the overlay card + carousel.
 *
 * Token source: packages/tokens/src/theme.css — --color-launcher-* set (issues #679, #681, #732).
 */

import type { ReactNode } from "react";

export interface LauncherOverviewHeroProps {
  /** Champion splash URL from championSplashUrl(). Supplied by the page. */
  splashUrl: string;
  /** Content overlaid in the upper-left zone (wordmark + playButton + featuredCard). */
  featuredCard?: ReactNode;
  /** Content anchored to the bottom edge, partially clipped by the viewport (LauncherContentCarousel). */
  carousel?: ReactNode;
  /**
   * Optional play button overlaid between the wordmark and the featured card.
   * Matches the gold "▶ Play ▾" pill in lol-launcher-ref/image.png. Presentational slot.
   */
  playButton?: ReactNode;
}

/**
 * Full-bleed hero for the launcher Overview tab.
 *
 * Layout (measured from lol-launcher-ref/image.png at 1536×864, ÷1.2 → our 1280×720 space):
 *   - Splash image object-cover, objectPosition ~75% 0% — champion pushed right of center
 *   - Strong left→right vignette (--color-launcher-scrim-side) fills full height
 *   - Bottom gradient scrim ensures text legibility
 *   - "LEAGUE OF LEGENDS" 2-row gold metallic wordmark TOP-anchored (y≈64–97 ref)
 *   - Play button slot below wordmark (~y218 ref)
 *   - featuredCard slot below play button
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
          minHeight 652px keeps the carousel anchored to y≈652 at 1280×720 (ref band top).
          The outer overflow-hidden clips the carousel at the 720px fold (~68px visible). */}
      <div className="relative shrink-0" style={{ height: 652 }}>
        {/* Champion/promo splash — shifted right so the champion is not behind text */}
        <img
          src={splashUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "75% 0%" }}
        />

        {/* Left vignette scrim — strong column that lets wordmark + text read clearly.
            Extends full height; fades from solid launcher-scrim-side to transparent. */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0"
          style={{
            width: "55%",
            background:
              "linear-gradient(to right, var(--color-launcher-scrim-side) 0%, var(--color-launcher-scrim-side) 30%, transparent 100%)",
          }}
        />

        {/* Bottom scrim — secondary gradient so any bottom-zone text stays legible */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0"
          style={{
            height: "45%",
            background:
              "linear-gradient(to top, var(--color-launcher-scrim-bottom) 0%, transparent 100%)",
          }}
        />

        {/* TOP-LEFT overlay zone — wordmark (y≈64 ref) + play button + featured card */}
        <div
          className="absolute left-0 top-0 flex flex-col gap-3"
          style={{ padding: "64px 28px 24px" }}
        >
          {/* "LEAGUE OF LEGENDS" 2-row wordmark — gold metallic treatment.
              Measured box: ~237px wide × ~90–120px tall (two tight rows, display font).
              Gold gradient (background-clip: text) mimics the metallic bevel in the ref. */}
          <div
            aria-label="League of Legends"
            style={{
              maxWidth: 237,
              lineHeight: 1,
              userSelect: "none",
              fontFamily: "var(--font-display)",
            }}
          >
            <div
              style={{
                fontSize: 42,
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
            </div>
            <div
              className="flex items-baseline gap-[5px]"
              style={{ marginTop: 2 }}
            >
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  background:
                    "linear-gradient(160deg, var(--color-gold-1) 0%, var(--color-gold-2) 40%, var(--color-gold-3) 60%, var(--color-gold-1) 80%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 2px 4px var(--color-launcher-wordmark-shadow))",
                }}
              >
                of
              </span>
              <span
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  background:
                    "linear-gradient(160deg, var(--color-gold-1) 0%, var(--color-gold-2) 35%, var(--color-gold-3) 55%, var(--color-gold-1) 75%, var(--color-gold-coin) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 2px 4px var(--color-launcher-wordmark-shadow))",
                }}
              >
                Legends
              </span>
            </div>
          </div>

          {/* Play button slot — rendered between wordmark and featured card.
              Matches the gold pill position in lol-launcher-ref/image.png (~y218 ref). */}
          {playButton}

          {/* Featured card slot — LauncherFeaturedCard renders here */}
          {featuredCard}
        </div>
      </div>

      {/* Carousel strip — anchored to the bottom, partially clipped by the 720 viewport fold.
          The strip begins near y≈652 (ref) and is ~68px visible before the edge clips it. */}
      {carousel && (
        <div className="w-full shrink-0">{carousel}</div>
      )}
    </div>
  );
}
