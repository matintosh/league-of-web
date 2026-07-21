"use client";

import { HextechButton } from "../chrome/hextech-button";
import { MapCrestImg } from "../chrome/map-crest-img";

// ---------------------------------------------------------------------------
// LobbyHeader
// ---------------------------------------------------------------------------
// Strip rendered directly under the top navbar in the pre-game lobby.
// Left side: gold back-chevron · optional queue crest image · queue title
//            · info-circle glyph button.
// Right side: party-visibility pill toggle (green check + person glyphs).
// ---------------------------------------------------------------------------

export interface LobbyHeaderProps {
  /** Queue / game mode title, e.g. "SR · Normal Draft". CSS uppercase applied.
   *  When `segments` is provided, this prop is used as the aria-label fallback only. */
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
  /**
   * Multi-segment title tokens — rendered with ◆ diamond separators between them.
   * When provided, replaces the plain `title` text in the header.
   * Example: ["Intro", "Blind", "Summoner's Rift 5v5"]
   * → renders "INTRO ◆ BLIND ◆ SUMMONER'S RIFT 5V5"
   */
  segments?: string[];
  /**
   * (30) chip count — dead decoration matching the reference queue chip.
   * aria-hidden. Rendered inline after the title/segments.
   */
  queueCount?: number;
  /**
   * Called when the "CHANGE MODE" button is clicked.
   * When omitted, the button is not rendered.
   */
  onChangeMode?: () => void;
  /** Whether the party panel is currently open (controls the pill's aria-pressed). */
  partyOpen: boolean;
  /**
   * Called with the new boolean value when the pill toggle is clicked.
   * Receives `!partyOpen` — callers update their own state.
   */
  onPartyToggle: (value: boolean) => void;

  // ---- 2025 redesign (additive) -----------------------------------------
  // When `breadcrumb` is supplied the header renders the current-client 2025
  // look: bold gold double-chevron back «, an inline mode gem, a middot
  // breadcrumb (no count chip, no ◆ diamonds, no Change Mode button), an
  // info circle, then a right cluster of copy + stats icons and a joined
  // green toggle pair (party-privacy + invite-permission). The legacy
  // `segments` / `onChangeMode` path is preserved as a fallback for callers
  // that have not migrated.

  /**
   * Middot breadcrumb tokens — rendered with `·` separators and NO count chip.
   * When provided, the header switches to the 2025 look and this replaces the
   * legacy ◆ `segments` rendering.
   * Example: ["SR", "RANKED SOLO/DUO", "DRAFT"]
   * → renders "SR · RANKED SOLO/DUO · DRAFT"
   */
  breadcrumb?: string[];
  /** Share / copy invite-link click (2025 right cluster). */
  onCopyInvite?: () => void;
  /** Open lobby stats (2025 right cluster). */
  onStats?: () => void;
  /**
   * Invite-permission state — the second half of the joined green switch.
   * Controls whether party members may invite others.
   */
  invitePermission?: boolean;
  /** Called with the new boolean value when the invite-permission half is clicked. */
  onInvitePermissionToggle?: (value: boolean) => void;
}

// ---------------------------------------------------------------------------
// Inline SVG glyphs
// ---------------------------------------------------------------------------

/**
 * Bold left-pointing double-chevron « (2025 back navigation). 18×16.
 * Two stacked chevron strokes for a heavier, more legible gold back affordance
 * than the single ChevronLeft used by the legacy header path.
 */
function DoubleChevronLeft() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="16"
      viewBox="0 0 18 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 3L3 8l5 5M14 3L9 8l5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Copy / link "share invite" glyph — two overlapping rounded squares. 16×16. */
function CopyLinkIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M10.5 5.5V4a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 4v5A1.5 1.5 0 0 0 4 10.5h1.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Stats / bars glyph — three ascending vertical bars. 16×16. */
function StatsBarsIcon() {
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
        d="M3 13V9M8 13V5M13 13V3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

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

/** ◆ diamond separator between title segments. 8×8. */
function DiamondSep() {
  return (
    <svg
      aria-hidden="true"
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 1L7 4L4 7L1 4Z" fill="currentColor" />
    </svg>
  );
}

/**
 * Summoner's Rift wings badge — flat double-chevron wings shape, ~22×18px.
 * Two stacked outward-sweeping chevron tiers, aria-hidden decoration.
 * Matches the ranked wings insignia shown after the queue-count chip in the
 * reference client (docs/reference/client-lobby-subbar.jpg).
 */
function SRWingsGlyph() {
  return (
    <svg
      aria-hidden="true"
      width="22"
      height="18"
      viewBox="0 0 22 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Upper wing tier — two chevrons sweeping outward and upward */}
      <path
        d="M11 4 L3 1 L1 3 L11 7 L21 3 L19 1 Z"
        fill="currentColor"
      />
      {/* Lower wing tier — slightly wider, angled more outward */}
      <path
        d="M11 10 L2 6.5 L0.5 8.5 L11 13 L21.5 8.5 L20 6.5 Z"
        fill="currentColor"
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
 * Two renderings, chosen by props:
 *
 * 2025 redesign (when `breadcrumb` is supplied): bold gold double-chevron back
 * « · inline mode gem (MapCrestImg in a gold frame) · middot breadcrumb
 * ("SR · RANKED SOLO/DUO · DRAFT", no count chip, no ◆ diamonds) · info circle.
 * Right cluster: copy/share icon (onCopyInvite) · stats icon (onStats) · a
 * joined green toggle pair — party-privacy (partyOpen) + invite-permission
 * (invitePermission) halves inside one rounded track, active halves filled with
 * status-online green. NO Change Mode button.
 *
 * Legacy path (no `breadcrumb`), preserved for un-migrated callers —
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
  segments,
  queueCount,
  onChangeMode,
  partyOpen,
  onPartyToggle,
  breadcrumb,
  onCopyInvite,
  onStats,
  invitePermission = false,
  onInvitePermissionToggle,
}: LobbyHeaderProps) {
  // 2025 redesign renders when a middot breadcrumb is supplied.
  const isRedesign = breadcrumb !== undefined && breadcrumb.length > 0;

  if (isRedesign) {
    return (
      <div
        data-shot="lobby-header"
        className="flex w-full items-center gap-3 border-b border-gold-5 bg-blue-7 px-3 py-2"
      >
        {/* ---------------------------------------------------------------- */}
        {/* Left cluster: back « · mode gem · middot breadcrumb · info       */}
        {/* ---------------------------------------------------------------- */}
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          {/* Bold gold double-chevron back */}
          <button
            type="button"
            aria-label="Back"
            onClick={onBack}
            className="flex shrink-0 cursor-pointer items-center justify-center text-gold-2 transition-colors duration-150 hover:text-gold-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3"
          >
            <DoubleChevronLeft />
          </button>

          {/* Mode gem — small square crest in a gold frame, inline before text */}
          {crestSrc && (
            <MapCrestImg
              src={crestSrc}
              frame="active"
              size={22}
              className="shrink-0 rounded-sm border border-gold-4"
            />
          )}

          {/* Middot breadcrumb — no count chip, no diamonds */}
          <span className="flex min-w-0 shrink items-center gap-2 overflow-hidden">
            {breadcrumb.map((seg, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && (
                  <span aria-hidden="true" className="shrink-0 text-gold-4">
                    ·
                  </span>
                )}
                <span className="truncate font-display text-sm uppercase tracking-widest text-gold-1">
                  {seg}
                </span>
              </span>
            ))}
          </span>

          {/* Info circle button */}
          <button
            type="button"
            aria-label="Queue info"
            onClick={onInfo}
            className="flex shrink-0 cursor-pointer items-center justify-center text-gold-3 transition-colors duration-150 hover:text-gold-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3"
          >
            <InfoCircle />
          </button>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Right cluster: copy · stats · joined green toggle pair           */}
        {/* ---------------------------------------------------------------- */}
        <div className="flex shrink-0 items-center gap-2.5">
          {/* Copy / share invite */}
          <button
            type="button"
            aria-label="Copy invite link"
            onClick={onCopyInvite}
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded border border-gold-5 text-gold-3 transition-colors duration-150 hover:border-gold-4 hover:text-gold-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3"
          >
            <CopyLinkIcon />
          </button>

          {/* Lobby stats */}
          <button
            type="button"
            aria-label="Lobby stats"
            onClick={onStats}
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded border border-gold-5 text-gold-3 transition-colors duration-150 hover:border-gold-4 hover:text-gold-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3"
          >
            <StatsBarsIcon />
          </button>

          {/* Joined green toggle pair — party-privacy + invite-permission.
              Two halves inside one rounded-full track; each half is a
              switch. Active halves fill with status-online green. */}
          <div className="flex shrink-0 items-center overflow-hidden rounded-full border border-gold-5 bg-blue-8">
            {/* Party-privacy half (left) */}
            <button
              type="button"
              aria-label="Party privacy"
              aria-pressed={partyOpen}
              onClick={() => onPartyToggle(!partyOpen)}
              className={[
                "flex h-6 w-8 cursor-pointer items-center justify-center transition-colors duration-150",
                "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gold-3",
                partyOpen
                  ? "bg-status-online text-blue-8"
                  : "text-grey-2 hover:text-grey-1",
              ].join(" ")}
            >
              <CheckMark />
            </button>
            {/* Invite-permission half (right) */}
            <button
              type="button"
              aria-label="Allow party members to invite"
              aria-pressed={invitePermission}
              onClick={() => onInvitePermissionToggle?.(!invitePermission)}
              className={[
                "flex h-6 w-8 cursor-pointer items-center justify-center border-l border-gold-5 transition-colors duration-150",
                "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gold-3",
                invitePermission
                  ? "bg-status-online text-blue-8"
                  : "text-grey-2 hover:text-grey-1",
              ].join(" ")}
            >
              <PersonIcon />
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          <MapCrestImg
            src={crestSrc}
            frame="active"
            size={24}
            className="shrink-0 rounded-sm"
          />
        )}

        {/* Queue title — either segmented or plain string */}
        {segments && segments.length > 0 ? (
          <span className="flex min-w-0 shrink items-center gap-1 overflow-hidden">
            {segments.map((seg, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && (
                  <span className="shrink-0 text-gold-4 opacity-70">
                    <DiamondSep />
                  </span>
                )}
                <span className="font-display text-sm uppercase tracking-widest text-gold-1 whitespace-nowrap">
                  {seg}
                </span>
              </span>
            ))}
            {/* (30) chip — dead decoration */}
            {queueCount !== undefined && (
              <span
                aria-hidden="true"
                className="shrink-0 rounded border border-grey-3 bg-grey-5 px-1 font-body text-[10px] leading-none text-grey-1 ml-1"
              >
                {queueCount}
              </span>
            )}
            {/* SR wings badge — dead decoration */}
            <span aria-hidden="true" className="shrink-0 text-grey-1 ml-0.5">
              <SRWingsGlyph />
            </span>
          </span>
        ) : (
          <span className="min-w-0 truncate font-display text-sm uppercase tracking-widest text-gold-1">
            {title}
          </span>
        )}

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
      {/* Center: Change Mode button (when onChangeMode is provided)          */}
      {/* ------------------------------------------------------------------ */}
      {onChangeMode && (
        <HextechButton
          variant="secondary"
          onClick={onChangeMode}
          className="shrink-0"
        >
          Change Mode
        </HextechButton>
      )}

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
