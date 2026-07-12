"use client";

// ---------------------------------------------------------------------------
// LobbyHeader
// ---------------------------------------------------------------------------
// Strip rendered directly under the top navbar in the pre-game lobby.
// Left side: gold back-chevron · optional queue crest image · queue title
//            · info-circle glyph button.
// Right side: party-visibility pill toggle (green check + person glyphs).
// ---------------------------------------------------------------------------

export interface LobbyHeaderProps {
  /** Queue / game mode title, e.g. "SR · Normal Draft". CSS uppercase applied. */
  title: string;
  /**
   * Resolved URL for the small square queue crest image (from gameModeMapUrl).
   * Omit to hide the crest entirely — layout stays left-aligned.
   */
  crestSrc?: string;
  /** Called when the back chevron is clicked. */
  onBack?: () => void;
  /**
   * Called when the info circle button is clicked.
   * Optional; button renders but is visually de-emphasised when absent.
   */
  onInfo?: () => void;
  /** Whether the party panel is currently open (controls the pill's aria-pressed). */
  partyOpen: boolean;
  /**
   * Called with the new boolean value when the pill toggle is clicked.
   * Receives `!partyOpen` — callers update their own state.
   */
  onPartyToggle: (value: boolean) => void;
}

// ---------------------------------------------------------------------------
// Inline SVG glyphs
// ---------------------------------------------------------------------------

/** Left-pointing chevron (back navigation). 16×16. */
function ChevronLeft() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 3L5 8l5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Circle "i" info glyph. 16×16. */
function InfoCircle() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M8 7v4M8 5.5v.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Checkmark glyph for the pill toggle (party open). 12×12. */
function CheckMark() {
  return (
    <svg
      aria-hidden="true"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 6l3 3 5-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Person / silhouette glyph for the pill toggle. 12×12. */
function PersonIcon() {
  return (
    <svg
      aria-hidden="true"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="6" cy="3.5" r="2" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M1.5 10.5c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// LobbyHeader
// ---------------------------------------------------------------------------

/**
 * LobbyHeader — the strip beneath the top navbar in the pre-game lobby.
 *
 * Left cluster: gold back-chevron button · optional queue-crest <img> (24×24,
 * aria-hidden) · queue title in display-font CSS-uppercase gold-1 · info-circle
 * glyph button (aria-label "Queue info").
 *
 * Right cluster: pill toggle (dark bordered rounded-full container) with an
 * inline checkmark + person glyph. Controlled via `partyOpen` / `onPartyToggle`.
 * aria-pressed reflects the current state; accessible name "Open party".
 *
 * Marked 'use client' because onBack, onInfo, onPartyToggle are event handlers.
 */
export function LobbyHeader({
  title,
  crestSrc,
  onBack,
  onInfo,
  partyOpen,
  onPartyToggle,
}: LobbyHeaderProps) {
  return (
    <div
      data-shot="lobby-header"
      className="flex w-full items-center gap-2 border-b border-gold-5 bg-blue-7 px-3 py-2"
    >
      {/* ------------------------------------------------------------------ */}
      {/* Left cluster: back · crest · title · info                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {/* Back chevron */}
        <button
          type="button"
          aria-label="Back"
          onClick={onBack}
          className="flex shrink-0 cursor-pointer items-center justify-center text-gold-3 transition-colors duration-150 hover:text-gold-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3"
        >
          <ChevronLeft />
        </button>

        {/* Queue crest — only rendered when crestSrc is provided */}
        {crestSrc && (
          <img
            src={crestSrc}
            alt=""
            aria-hidden="true"
            width={24}
            height={24}
            className="h-6 w-6 shrink-0 object-contain"
          />
        )}

        {/* Queue title — display font, CSS uppercase, truncated */}
        <span className="min-w-0 truncate font-display text-sm uppercase tracking-widest text-gold-1">
          {title}
        </span>

        {/* Info circle button */}
        <button
          type="button"
          aria-label="Queue info"
          onClick={onInfo}
          className="flex shrink-0 cursor-pointer items-center justify-center text-grey-2 transition-colors duration-150 hover:text-grey-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3"
        >
          <InfoCircle />
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Right cluster: party-visibility pill toggle                         */}
      {/* ------------------------------------------------------------------ */}
      <button
        type="button"
        aria-label="Open party"
        aria-pressed={partyOpen}
        onClick={() => onPartyToggle(!partyOpen)}
        className={[
          // Pill shape: dark fill, gold border, rounded-full
          "flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1",
          "transition-colors duration-150",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
          partyOpen
            ? "border-gold-3 bg-blue-6 text-gold-2"
            : "border-gold-5 bg-blue-7 text-grey-2 hover:border-gold-4 hover:text-grey-1",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <CheckMark />
        <PersonIcon />
      </button>
    </div>
  );
}
