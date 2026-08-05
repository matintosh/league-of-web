/**
 * LauncherOverviewHero — full-bleed splash background for the Overview tab.
 *
 * Fills the entire content area (approximately 1080×660 px at 1536px viewport,
 * accounting for left rail ~56px and right friends panel ~280px). Renders a
 * champion/promo splash image as object-cover, the "LEAGUE OF LEGENDS" logotype
 * in the lower-left, and exposes render slots for the overlay card + carousel.
 *
 * Token source: packages/tokens/src/theme.css — --color-launcher-* set (issues #679, #681).
 */

import type { ReactNode } from "react";

export interface LauncherOverviewHeroProps {
  /** Champion splash URL from championSplashUrl(). Supplied by the page. */
  splashUrl: string;
  /** Content overlaid in the lower-left (LauncherFeaturedCard). */
  featuredCard?: ReactNode;
  /** Content anchored to the bottom (LauncherContentCarousel). */
  carousel?: ReactNode;
  /**
   * Optional play button overlaid in the lower-left zone, between the
   * wordmark and the featured card. Matches the gold "▶ Play ▾" pill
   * in lol-launcher-ref/image.png and image-1.png. Caller passes
   * <LauncherPlayButton> (or any ReactNode). Presentational slot only.
   */
  playButton?: ReactNode;
}

/**
 * Full-bleed hero for the launcher Overview tab.
 *
 * Layout:
 *   - Splash image fills container edge-to-edge via object-cover / center top
 *   - Bottom gradient scrim (--color-launcher-scrim-bottom) ensures wordmark + card text read
 *   - "LEAGUE OF LEGENDS" 2-row wordmark sits bottom-left above the featured card slot
 *   - featuredCard renders in the bottom-left overlay zone
 *   - carousel renders anchored to the bottom below the hero body
 *
 * Measured from lol-launcher-ref/image.png + image-1.png at ~1536px.
 */
export function LauncherOverviewHero({
  splashUrl,
  featuredCard,
  carousel,
  playButton,
}: LauncherOverviewHeroProps) {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      {/* Hero body — splash + scrim + wordmark + featured card */}
      <div className="relative min-h-0 flex-1">
        {/* Champion/promo splash — fills hero body edge-to-edge */}
        <img
          src={splashUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "center top" }}
        />

        {/* Bottom scrim — ensures wordmark + card text read against any splash */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0"
          style={{
            height: "60%",
            background:
              "linear-gradient(to top, var(--color-launcher-scrim-bottom) 0%, transparent 100%)",
          }}
        />

        {/* Bottom-left overlay zone — wordmark + featured card */}
        <div
          className="absolute bottom-0 left-0 flex flex-col gap-3"
          style={{ padding: "24px 28px" }}
        >
          {/* "LEAGUE OF LEGENDS" 2-row wordmark */}
          <div
            aria-label="League of Legends"
            style={{
              color: "var(--color-launcher-wordmark)",
              fontFamily: "var(--font-display)",
              lineHeight: 1,
              userSelect: "none",
            }}
          >
            <div
              style={{
                fontSize: 38,
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              League
            </div>
            <div
              className="flex items-baseline gap-[5px]"
              style={{ marginTop: 1 }}
            >
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                of
              </span>
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Legends
              </span>
            </div>
          </div>

          {/* Play button slot — rendered between wordmark and featured card.
              Matches the gold pill position in lol-launcher-ref/image.png. */}
          {playButton}

          {/* Featured card slot — LauncherFeaturedCard renders here */}
          {featuredCard}
        </div>
      </div>

      {/* Carousel strip — anchored to the bottom of the hero, below the splash */}
      {carousel && (
        <div className="w-full shrink-0">{carousel}</div>
      )}
    </div>
  );
}
