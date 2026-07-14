"use client";

import { AmbientVideoLayer } from "./ambient-video-layer";
import { MapCrestImg } from "./map-crest-img";

// ---------------------------------------------------------------------------
// PartyStatusPanel — Open Party rail indicator (issue #163)
//
// Renders between ProfileChip and the SOCIAL section header when the player
// is in a lobby. Shows a green band with 5 person silhouettes (filled = self +
// invited members, dimmed = empty slots), a left-anchored crest chip, and a
// queue-label caption below.
//
// Props: queueLabel, crestSrc?, filled, capacity, onToggleOpen?, open?
// Presentational only — no data fetching.
// ---------------------------------------------------------------------------

export interface PartyStatusPanelProps {
  /** Queue label displayed under the crest chip and after the count in sr-only text. */
  queueLabel: string;
  /**
   * URL for the map/mode crest image displayed at the left of the green band.
   * When omitted the crest slot is hidden (no broken-image placeholder).
   */
  crestSrc?: string;
  /**
   * Number of filled (white) silhouettes.
   * Minimum 1 (self is always present), maximum = capacity.
   */
  filled: number;
  /**
   * Total party capacity. Determines total number of silhouettes rendered.
   * Standard 5v5 = 5; ARAM = 5; etc.
   */
  capacity: number;
  /**
   * Called when the user clicks the header row toggle button.
   * When omitted, the header renders as a presentational <div> (no pointer).
   */
  onToggleOpen?: () => void;
  /**
   * Whether the party is currently open to friends.
   * Affects the header label and aria-pressed state when onToggleOpen is set.
   * Defaults to true (open) when not provided.
   */
  open?: boolean;
  /**
   * Optional ambient "magic" loop webm shown subtly behind the widget — the
   * client's animated party backdrop (supply `partiesBgLoopUrl("party-status")`
   * from @low/fixtures). Additive: when omitted the flat `bg-blue-7` panel is
   * unchanged. The loop is opaque (bright Hextech glow on near-black), so it
   * composites screen-blended — the dark field drops out and only the glow adds.
   * Hidden under `prefers-reduced-motion`.
   */
  ambientVideoSrc?: string;
}

// ---------------------------------------------------------------------------
// Silhouette inline SVG — person outline, aria-hidden
// ---------------------------------------------------------------------------

/** Filled (white) person silhouette — represents a party member. */
function FilledSilhouette() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="22"
      viewBox="0 0 20 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <circle cx="10" cy="6" r="4.5" fill="white" />
      <path
        d="M1 20c0-4.418 4.029-8 9-8s9 3.582 9 8"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/** Dimmed person silhouette — represents an empty party slot. */
function DimmedSilhouette() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="22"
      viewBox="0 0 20 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 opacity-30"
    >
      <circle cx="10" cy="6" r="4.5" fill="white" />
      <path
        d="M1 20c0-4.418 4.029-8 9-8s9 3.582 9 8"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// PersonGroupIcon — header glyph (two-person group icon)
// ---------------------------------------------------------------------------

function PersonGroupIcon() {
  return (
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M1 14c0-2.761 2.239-4 5-4s5 1.239 5 4"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M12 11c1.5.3 3 1.1 3 3"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// PartyStatusPanel
// ---------------------------------------------------------------------------

/**
 * PartyStatusPanel — Open Party lobby indicator for the social rail.
 *
 * Renders at the top of the rail (below ProfileChip) only when the player is
 * in a party lobby. Structure (top → bottom):
 *   1. Header row — glyph + "Open Party" label (optionally a toggle button)
 *   2. Green band — crest chip overlapping left edge + 5 person silhouettes
 *   3. Queue label caption — xs text under the band
 *
 * The crest chip uses drop-shadow glow per the Hextech drop-shadow rule for
 * overlapping elements. The header button uses aria-pressed when interactive.
 *
 * Width: inherits parent (200px rail). No internal width is set.
 */
export function PartyStatusPanel({
  queueLabel,
  crestSrc,
  filled,
  capacity,
  onToggleOpen,
  open = true,
  ambientVideoSrc,
}: PartyStatusPanelProps) {
  const clampedFilled = Math.min(Math.max(filled, 0), capacity);

  // Render silhouettes: first `clampedFilled` are filled, rest are dimmed
  const silhouettes = Array.from({ length: capacity }, (_, i) => i < clampedFilled);

  const headerLabel = open ? "Open Party" : "Closed Party";

  // Screen-reader member count summary
  const srCount = `${clampedFilled} of ${capacity} party members`;

  return (
    <div
      data-shot="party-status-panel"
      className="relative w-full overflow-hidden border-b border-gold-5 bg-blue-7"
    >
      {/* Ambient "magic" backdrop — subtle animated Hextech loop behind the
          widget. Opaque loop → screen-blended so only the glow adds over
          bg-blue-7; hidden under reduced-motion. */}
      <AmbientVideoLayer src={ambientVideoSrc} opacity={0.4} />

      {/* ------------------------------------------------------------------ */}
      {/* 1. Header row — icon + "Open Party" label                           */}
      {/* When onToggleOpen is provided → interactive toggle button           */}
      {/* ------------------------------------------------------------------ */}
      {onToggleOpen ? (
        <button
          type="button"
          aria-pressed={open}
          onClick={onToggleOpen}
          className={[
            "relative z-10 flex w-full cursor-pointer items-center gap-1.5 px-3 py-1.5",
            "font-display text-xs uppercase tracking-widest",
            "text-status-online transition-colors duration-150 hover:opacity-80",
          ].join(" ")}
        >
          <PersonGroupIcon />
          <span>{headerLabel}</span>
        </button>
      ) : (
        <div
          className={[
            "relative z-10 flex items-center gap-1.5 px-3 py-1.5",
            "font-display text-xs uppercase tracking-widest",
            "text-status-online",
          ].join(" ")}
        >
          <PersonGroupIcon />
          <span>{headerLabel}</span>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 2. Green band — dark forest green bg with crest + silhouettes       */}
      {/* crestSrc chip overlaps the left edge with a drop-shadow glow        */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="relative z-10 mx-0 flex items-center"
        style={{
          background: "var(--color-party-band)",
          minHeight: 48,
          paddingLeft: crestSrc ? 44 : 12,
          paddingRight: 8,
          paddingTop: 4,
          paddingBottom: 4,
        }}
      >
        {/* Screen-reader count — hidden visually */}
        <span className="sr-only">{srCount}</span>

        {/* Crest chip — overlaps left edge, slight drop shadow glow */}
        {crestSrc && (
          <div
            className="absolute"
            style={{
              left: 4,
              top: "50%",
              transform: "translateY(-50%)",
              filter: "drop-shadow(0 0 4px var(--color-status-online))",
              zIndex: 1,
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <MapCrestImg src={crestSrc} frame="active" size={36} />
          </div>
        )}

        {/* Silhouette row — 5 persons horizontally, small gap */}
        <div className="flex items-end gap-0.5" aria-hidden="true">
          {silhouettes.map((isFilled, i) =>
            isFilled ? (
              <FilledSilhouette key={i} />
            ) : (
              <DimmedSilhouette key={i} />
            ),
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 3. Queue label caption — below the band, xs text                    */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative z-10 truncate px-3 pb-1.5 pt-0.5 font-body text-xs text-grey-1">
        {queueLabel}
      </div>
    </div>
  );
}
