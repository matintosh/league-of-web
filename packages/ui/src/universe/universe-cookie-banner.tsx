/**
 * UniverseCookieBanner — bottom cookie-consent bar for Universe pages.
 *
 * Ref: docs/reference/universe-landing.png (bottom edge).
 *
 * Full-width fixed-bottom bar (~56px tall), dark near-black surface with a thin
 * top hairline. Left: cookie notice text (small, story-ink) with an inline
 * 'Privacy Notice' link (gold-2, underline). Right: 'Manage Preferences' pill
 * button (bordered, gold-2 caps, small).
 *
 * Dismiss state is managed by the caller (or in *.demo.tsx for showcase).
 * Props-in / callbacks-out. Server-safe (no 'use client').
 * Tokens-only — no raw hex. CSS hover used instead of JS event handlers. Issues #980.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UniverseCookieBannerProps {
  /**
   * Main banner text (before the Privacy Notice link).
   * @default "This website utilizes technologies such as cookies to enable essential site functionality, as well as for analytics, personalization, and targeted advertising. To learn more, use the following link:"
   */
  text?: string;
  /** Href for the 'Privacy Notice' inline link. */
  privacyHref: string;
  /** Callback for when 'Manage Preferences' is clicked. */
  onManage?: () => void;
  /** Optional callback for accept/dismiss — hides the banner. */
  onAccept?: () => void;
  /**
   * Controls whether the banner is visible.
   * Pass `false` to hide after the user accepts/dismisses.
   * @default true
   */
  visible?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const DEFAULT_TEXT =
  "This website utilizes technologies such as cookies to enable essential site functionality, as well as for analytics, personalization, and targeted advertising. To learn more, use the following link:";

/**
 * UniverseCookieBanner — bottom cookie-consent bar.
 *
 * Presentational, server-safe (no 'use client').
 * Dismiss state lives in the caller or *.demo.tsx.
 * CSS hover used for color transitions (server-safe, no JS event handlers).
 */
export function UniverseCookieBanner({
  text = DEFAULT_TEXT,
  privacyHref,
  onManage,
  onAccept,
  visible = true,
}: UniverseCookieBannerProps) {
  if (!visible) return null;

  return (
    <>
      {/* CSS-only hover for gold-2 → gold-1 on interactive elements */}
      <style>{`
        .univ-cookie-link { color: var(--color-gold-2); }
        .univ-cookie-link:hover { color: var(--color-gold-1); }
        .univ-cookie-btn { color: var(--color-gold-2); border-color: var(--color-gold-4); }
        .univ-cookie-btn:hover { color: var(--color-gold-1); border-color: var(--color-gold-3); }
        .univ-cookie-dismiss { color: var(--color-gold-4); opacity: 0.7; }
        .univ-cookie-dismiss:hover { opacity: 1; color: var(--color-gold-2); }
      `}</style>

      <div
        role="region"
        aria-label="Cookie consent"
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-4 px-6 py-0"
        style={{
          height: "56px",
          backgroundColor: "color-mix(in srgb, var(--color-universe-bg) 96%, var(--color-gold-6) 4%)",
          borderTop: "1px solid var(--color-universe-nav-border)",
          maxWidth: "100vw",
        }}
      >
        {/* Left: notice text + Privacy Notice link */}
        <p
          className="flex-1 min-w-0 truncate text-[11px] leading-snug"
          style={{
            color: "var(--color-universe-story-ink)",
            fontFamily: "var(--font-body)",
            opacity: 0.85,
          }}
        >
          {text}{" "}
          <a
            href={privacyHref}
            className="univ-cookie-link inline underline transition-colors duration-150"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Notice
          </a>
        </p>

        {/* Right: Manage Preferences pill button */}
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={onManage}
            className="univ-cookie-btn rounded-full px-4 py-1 text-[11px] uppercase tracking-[0.1em] transition-colors duration-150"
            style={{
              border: "1px solid",
              backgroundColor: "transparent",
              fontFamily: "var(--font-body)",
              letterSpacing: "0.1em",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Manage Preferences
          </button>

          {/* Optional dismiss × */}
          {onAccept && (
            <button
              type="button"
              onClick={onAccept}
              aria-label="Dismiss cookie notice"
              className="univ-cookie-dismiss flex h-5 w-5 items-center justify-center rounded-full text-[14px] transition-all duration-150"
              style={{
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                lineHeight: 1,
              }}
            >
              ×
            </button>
          )}
        </div>
      </div>
    </>
  );
}
