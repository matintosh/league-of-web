/**
 * LauncherPatchHeroBanner — full-bleed hero for the Patch Notes tab.
 *
 * Fills the entire content area with a champion splash background, then
 * renders a centered text block in the lower portion: a gold "Game Updates"
 * chip, large patch title, subtitle, and byline.
 *
 * Token source: packages/tokens/src/theme.css — --color-launcher-* set.
 * Issue #688.
 */

export interface LauncherPatchHeroBannerProps {
  /** Champion splash URL supplied by the page via championSplashUrl(). */
  splashUrl: string;
  /** E.g. "LEAGUE OF LEGENDS PATCH 26.15 NOTES" */
  patchTitle: string;
  /** E.g. "We're kicking off Season 3...but of what year?!" */
  subtitle: string;
  /** Category chip label. Default "Game Updates". */
  categoryChip?: string;
  /** Byline author string. E.g. "Riot Cashout, slernied, Riot Yisu" */
  authors?: string;
  /** ISO date or display string. E.g. "7/18/2026" */
  date?: string;
}

/**
 * Full-bleed hero for the launcher Patch Notes tab.
 *
 * Layout:
 *   - Champion splash fills the container edge-to-edge (object-cover, center top)
 *   - Heavy bottom-up gradient scrim ensures text block legibility
 *   - Text block (chip → title → subtitle → byline) centered horizontally ~60px from bottom
 *
 * Measured from lol-launcher-ref/image-2.png at ~1536px.
 */
export function LauncherPatchHeroBanner({
  splashUrl,
  patchTitle,
  subtitle,
  categoryChip = "Game Updates",
  authors,
  date,
}: LauncherPatchHeroBannerProps) {
  const byline =
    authors && date
      ? `${authors} • ${date}`
      : authors ?? date ?? null;

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Champion splash — fills container edge-to-edge */}
      <img
        src={splashUrl}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: "center top" }}
      />

      {/* Bottom-up scrim — heavy at bottom, fades out at 70% */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: "70%",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.40) 45%, transparent 70%)",
        }}
      />

      {/* Text block — centered horizontally, ~60px from bottom */}
      <div
        className="absolute left-1/2 flex flex-col items-center text-center"
        style={{
          bottom: 60,
          transform: "translateX(-50%)",
          width: 600,
        }}
      >
        {/* Gold "Game Updates" category chip */}
        <span
          style={{
            display: "inline-block",
            backgroundColor: "var(--color-launcher-chip-game-updates-bg)",
            color: "var(--color-launcher-chip-game-updates-ink)",
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            padding: "3px 10px",
            borderRadius: 2,
            marginBottom: 12,
          }}
        >
          {categoryChip}
        </span>

        {/* Patch title — Beaufort display font, all-caps, white */}
        <h2
          style={{
            color: "var(--color-launcher-ink)",
            fontFamily: "var(--font-display)",
            fontSize: 28,
            fontWeight: 800,
            textTransform: "uppercase",
            lineHeight: 1.1,
            marginBottom: 10,
          }}
        >
          {patchTitle}
        </h2>

        {/* Subtitle — muted secondary text */}
        <p
          style={{
            color: "var(--color-launcher-ink-muted)",
            fontSize: 14,
            fontWeight: 400,
            lineHeight: 1.4,
            marginBottom: 10,
          }}
        >
          {subtitle}
        </p>

        {/* Byline — author(s) + date in subtle caption style */}
        {byline && (
          <p
            style={{
              color: "var(--color-launcher-ink-subtle)",
              fontSize: 11,
              fontWeight: 400,
            }}
          >
            {byline}
          </p>
        )}
      </div>
    </div>
  );
}
