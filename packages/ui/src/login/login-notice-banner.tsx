/** LoginNoticeBanner is a presentational-only component — no client state. */

export interface LoginNoticeBannerProps {
  /** The notice text to display. */
  text: string;
  /**
   * Optional ARIA role override. Defaults to "status" for live-region
   * announcements. Use "alert" for urgent notices.
   */
  role?: "status" | "alert";
}

/**
 * LoginNoticeBanner renders a warning strip overlaid at the top of the
 * splash area on the Classic login screen (issue #676).
 *
 * Visual spec (pixel-sampled from ref):
 * - Slim horizontal band pinned at the top of the splash.
 * - Translucent dark gold-brown background (semi-transparent).
 * - Warning triangle icon (⚠) in gold-3 on the left.
 * - Text in gold-1 (cream), font-body text-xs.
 *
 * Presentational — no internal state, no 'use client' needed.
 */
export function LoginNoticeBanner({ text, role = "status" }: LoginNoticeBannerProps) {
  return (
    <div
      role={role}
      className={[
        "flex items-center gap-2",
        "px-3 py-1.5",
        "font-body text-xs text-gold-1",
      ].join(" ")}
      style={{ background: "var(--color-login-classic-notice-bg)" }}
    >
      {/* Warning triangle — simplified original glyph */}
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="h-3.5 w-3.5 shrink-0 fill-gold-3"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
      {text}
    </div>
  );
}
