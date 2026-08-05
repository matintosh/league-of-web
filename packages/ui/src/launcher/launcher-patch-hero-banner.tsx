/**
 * LauncherPatchHeroBanner — patch notes hero for the Patch Notes tab.
 *
 * Layout (per lol-launcher-ref/image-2.png, issue #745):
 *   - Champion splash bounded to ~421px (top ~58% of 720px container);
 *     splash uses object-cover center-top within that fixed-height band.
 *   - Below the splash: solid --color-launcher-bg band that holds all text.
 *   - Text block: heading (~33px, 2-line wrap) → subtitle → thin divider rule
 *     → bottom-anchored byline row [gold category] | [authors] | [date].
 *   - NO category chip above the heading; "Game Updates" lives only in byline.
 *
 * Token source: packages/tokens/src/theme.css — --color-launcher-* set.
 * Issue #745 (fixes #688).
 */

export interface LauncherPatchHeroBannerProps {
  /** Champion splash URL supplied by the page via championSplashUrl(). */
  splashUrl: string;
  /** E.g. "LEAGUE OF LEGENDS PATCH 26.15 NOTES" */
  patchTitle: string;
  /** E.g. "We're kicking off Season 3...but of what year?!" */
  subtitle: string;
  /**
   * Category label in the byline row. Default "Game Updates".
   * Rendered in gold; no chip/pill — plain text with pipe separators.
   */
  category?: string;
  /** Byline author string. E.g. "Riot Cashout, slernied, Riot Yisu" */
  authors?: string;
  /** ISO date or display string. E.g. "7/18/2026" */
  date?: string;
}

/**
 * Patch notes hero for the launcher Patch Notes tab.
 *
 * Stacks vertically:
 *   1. Splash band — fixed ~421px, splash fills it via object-cover center-top.
 *   2. Text band  — flex column, solid launcher-bg, holds heading + subtitle +
 *      divider + bottom-anchored byline row.
 *
 * Measured from lol-launcher-ref/image-2.png (1536px ref ÷ 1.2 = our space).
 * Splash height 421px ≈ 58% of 720px container. Text band fills the remainder.
 */
export function LauncherPatchHeroBanner({
  splashUrl,
  patchTitle,
  subtitle,
  category = "Game Updates",
  authors,
  date,
}: LauncherPatchHeroBannerProps) {
  /** Build the byline segments; only include non-empty parts. */
  const bylineSegments: Array<{ gold?: boolean; text: string }> = [];
  if (category) bylineSegments.push({ gold: true, text: category });
  if (authors) bylineSegments.push({ text: authors });
  if (date) bylineSegments.push({ text: date });

  return (
    <div
      className="flex h-full w-full flex-col overflow-hidden"
      style={{ backgroundColor: "var(--color-launcher-bg)" }}
    >
      {/* ── Splash band — bounded to ~421px ── */}
      <div className="relative w-full shrink-0" style={{ height: 421 }}>
        <img
          src={splashUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "center top" }}
        />
      </div>

      {/* ── Text band — solid launcher-bg, fills remainder ── */}
      <div
        className="relative flex min-h-0 flex-1 flex-col items-center px-8 pt-8"
        style={{ backgroundColor: "var(--color-launcher-bg)" }}
      >
        {/* Patch title — Beaufort display font, all-caps, white, ~33px, 2-line wrap */}
        <h2
          className="text-center"
          style={{
            color: "var(--color-launcher-ink)",
            fontFamily: "var(--font-display)",
            fontSize: 33,
            fontWeight: 800,
            textTransform: "uppercase",
            lineHeight: 1.15,
            marginBottom: 14,
            maxWidth: 460,
          }}
        >
          {patchTitle}
        </h2>

        {/* Subtitle — muted secondary text */}
        <p
          className="text-center"
          style={{
            color: "var(--color-launcher-ink-muted)",
            fontSize: 14,
            fontWeight: 400,
            lineHeight: 1.4,
            marginBottom: 14,
            maxWidth: 460,
          }}
        >
          {subtitle}
        </p>

        {/* Divider rule — 1px, launcher border token, spans content width */}
        <div
          style={{
            width: "100%",
            maxWidth: 460,
            height: 1,
            backgroundColor: "var(--color-launcher-border)",
            marginBottom: 12,
          }}
        />

        {/* Byline row — [gold category] | [authors] | [date] with pipe separators */}
        {bylineSegments.length > 0 && (
          <div
            className="flex items-center gap-0"
            style={{
              fontSize: 11,
              fontWeight: 400,
              lineHeight: 1,
            }}
          >
            {bylineSegments.map((seg, i) => (
              <span key={i} className="flex items-center">
                {i > 0 && (
                  <span
                    style={{
                      color: "var(--color-launcher-ink-subtle)",
                      padding: "0 8px",
                    }}
                  >
                    |
                  </span>
                )}
                <span
                  style={{
                    color: seg.gold
                      ? "var(--color-launcher-accent)"
                      : "var(--color-launcher-ink-subtle)",
                  }}
                >
                  {seg.text}
                </span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
