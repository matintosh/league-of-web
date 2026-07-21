"use client";

import { useId } from "react";

// ---------------------------------------------------------------------------
// LobbyProgressionPanel
// ---------------------------------------------------------------------------
// The bottom-right panel of the 2025 pre-game lobby (issue #473). A tabbed
// Progression / Invited panel that replaces the older "Suggested | Invited"
// tab strip. Two tabs plus a ▾ dropdown chevron; the Progression body is a
// mission-card list (gold circular check medallion + two-line title/objective
// + a "2" stacked-card count badge + a blue check disc), the Invited body is a
// simple name list with an empty state.
//
// Presentational only — props in, callbacks out. Tokens only.
// ---------------------------------------------------------------------------

/**
 * A single mission row shown in the Progression tab body.
 */
export interface LobbyMission {
  /** Stable key. */
  id: string;
  /** Mission title — e.g. "Seasonal Victorious". Gold-cream, truncates. */
  title: string;
  /** Objective subtitle — e.g. "Win 15 Ranked games". Grey, smaller. */
  objective: string;
  /**
   * Optional challenge/mastery crest URL for the left medallion — pass
   * `challengeTokenUrl(id, level)` or `masteryCrestUrl(level)` from
   * @low/fixtures. When omitted, a token gold check medallion is drawn
   * (the reference's completed-mission look).
   */
  iconSrc?: string;
  /** When true the left medallion shows the completed gold-check styling. */
  complete?: boolean;
  /** Stacked-card count badge on the right — e.g. "2". Omit to hide. */
  progressBadge?: string;
}

/** A single pending-invite row shown in the Invited tab body. */
export interface LobbyInvitedEntry {
  id: string;
  name: string;
}

export interface LobbyProgressionPanelProps {
  /** Which tab is active. */
  activeTab: "progression" | "invited";
  /** Called with the newly-selected tab. */
  onTabChange: (tab: "progression" | "invited") => void;
  /** Count shown in the "Invited (N)" tab label. */
  invitedCount: number;
  /** Missions rendered in the Progression tab body. */
  missions: LobbyMission[];
  /** Pending invites rendered in the Invited tab body. */
  invited: LobbyInvitedEntry[];
  /** Called when the ▾ dropdown chevron is clicked. Optional. */
  onMenu?: () => void;
}

// ---------------------------------------------------------------------------
// Inline glyphs
// ---------------------------------------------------------------------------

/** Down chevron ▾ for the dropdown affordance. 12×12. */
function ChevronDown() {
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
        d="M3 4.5L6 7.5L9 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Bare checkmark stroke. Sized by the wrapping element via width/height. */
function CheckStroke({ size = 16 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 8.5L7 11.5L12.5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Two stacked cards behind a count — the "2" progress badge mark. 16×16. */
function StackedCardsGlyph() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="4.5" y="2.5" width="9" height="6" rx="1" stroke="currentColor" strokeWidth="1" />
      <rect x="2.5" y="5.5" width="9" height="6" rx="1" stroke="currentColor" strokeWidth="1" fill="var(--color-blue-8)" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// MissionMedallion — gold circular crest on the left of a mission row
// ---------------------------------------------------------------------------

/**
 * Circular gold-rimmed medallion. Draws the supplied crest art when `iconSrc`
 * is given; otherwise a token gold ring with a centred checkmark (the
 * reference's completed-mission look). SVG gradient ids are per-instance.
 */
function MissionMedallion({
  iconSrc,
  complete,
  uid,
}: {
  iconSrc?: string;
  complete?: boolean;
  uid: string;
}) {
  const size = 40;
  const gradId = `${uid}-mm`;

  return (
    <div
      className="relative flex shrink-0 items-center justify-center rounded-full bg-blue-8"
      style={{
        width: size,
        height: size,
        border: "2px solid var(--color-gold-3)",
        boxShadow:
          "0 0 6px color-mix(in srgb, var(--color-gold-3) 45%, transparent), inset 0 0 5px color-mix(in srgb, var(--color-gold-4) 40%, transparent)",
      }}
    >
      {iconSrc ? (
        <img
          src={iconSrc}
          alt=""
          aria-hidden="true"
          width={size - 8}
          height={size - 8}
          className="object-contain"
        />
      ) : (
        <svg
          aria-hidden="true"
          width={size - 6}
          height={size - 6}
          viewBox="0 0 34 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-gold-1)" />
              <stop offset="100%" stopColor="var(--color-gold-3)" />
            </linearGradient>
          </defs>
          <path
            d="M9 17.5L14.5 23L25 11.5"
            stroke={complete === false ? "var(--color-gold-4)" : `url(#${gradId})`}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// LobbyProgressionPanel
// ---------------------------------------------------------------------------

/**
 * LobbyProgressionPanel — the docked bottom-right lobby panel.
 *
 * Header: a tab strip — "Progression" (active gold underline) · "Invited (N)"
 * · a ▾ dropdown chevron button. Body switches by `activeTab`:
 *   - progression: a list of mission rows (gold check medallion + two-line
 *     title/objective + optional "N" stacked-card badge + blue check disc).
 *   - invited: a name list, or an empty-state line when there are none.
 *
 * Marked 'use client' because onTabChange / onMenu are event handlers.
 * `w-full` fill root so it stretches the docked column it is placed in.
 */
export function LobbyProgressionPanel({
  activeTab,
  onTabChange,
  invitedCount,
  missions,
  invited,
  onMenu,
}: LobbyProgressionPanelProps) {
  const uid = useId();

  const tabBase =
    "font-display text-xs uppercase tracking-wider cursor-pointer border-b-2 pb-1.5 pt-2 transition-colors duration-150";

  return (
    <div
      data-shot="lobby-progression-panel"
      className="flex w-full flex-col overflow-hidden rounded-sm border border-gold-5 bg-blue-7"
    >
      {/* ---------------------------------------------------------------- */}
      {/* Tab strip — Progression · Invited (N) · ▾                        */}
      {/* ---------------------------------------------------------------- */}
      <div
        role="tablist"
        aria-label="Lobby panel"
        className="flex items-center gap-4 border-b border-gold-5 px-3"
      >
        <button
          type="button"
          role="tab"
          id={`${uid}-tab-progression`}
          aria-controls={`${uid}-panel-progression`}
          aria-selected={activeTab === "progression"}
          tabIndex={activeTab === "progression" ? 0 : -1}
          onClick={() => onTabChange("progression")}
          className={[
            tabBase,
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
            activeTab === "progression"
              ? "border-gold-3 text-gold-1"
              : "border-transparent text-grey-2 hover:text-grey-1",
          ].join(" ")}
        >
          Progression
        </button>
        <button
          type="button"
          role="tab"
          id={`${uid}-tab-invited`}
          aria-controls={`${uid}-panel-invited`}
          aria-selected={activeTab === "invited"}
          tabIndex={activeTab === "invited" ? 0 : -1}
          onClick={() => onTabChange("invited")}
          className={[
            tabBase,
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
            activeTab === "invited"
              ? "border-gold-3 text-gold-1"
              : "border-transparent text-grey-2 hover:text-grey-1",
          ].join(" ")}
        >
          {`Invited (${invitedCount})`}
        </button>

        {/* ▾ dropdown chevron — pushed to the right end */}
        <button
          type="button"
          aria-label="Panel options"
          onClick={onMenu}
          className="ml-auto flex size-6 shrink-0 cursor-pointer items-center justify-center rounded text-gold-3 transition-colors duration-150 hover:text-gold-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3"
        >
          <ChevronDown />
        </button>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Body                                                              */}
      {/* ---------------------------------------------------------------- */}
      {activeTab === "progression" ? (
        <div
          id={`${uid}-panel-progression`}
          role="tabpanel"
          aria-labelledby={`${uid}-tab-progression`}
          className="flex flex-col gap-2 p-2"
        >
          {missions.length > 0 ? (
            missions.map((m) => (
              <div
                key={m.id}
                data-shot="lobby-mission-row"
                className="flex items-center gap-3 rounded-sm border border-gold-5 bg-blue-8/70 px-3 py-2"
              >
                {/* Left: gold check medallion */}
                <MissionMedallion iconSrc={m.iconSrc} complete={m.complete} uid={`${uid}-${m.id}`} />

                {/* Center: two-line title / objective */}
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-display text-[13px] tracking-wide text-grey-1">
                    {m.title}
                  </span>
                  <span className="truncate font-body text-[11px] text-grey-2">
                    {m.objective}
                  </span>
                </div>

                {/* Right: stacked-card count badge + blue check disc */}
                <div className="flex shrink-0 items-center gap-2 border-l border-gold-5 pl-3">
                  {m.progressBadge !== undefined && (
                    <span className="relative flex items-center justify-center text-gold-3">
                      <StackedCardsGlyph />
                      <span className="absolute inset-0 flex items-center justify-center font-body text-[9px] font-semibold leading-none text-gold-1">
                        {m.progressBadge}
                      </span>
                    </span>
                  )}
                  <span
                    className="flex size-5 items-center justify-center rounded-full bg-blue-6 text-blue-2"
                    style={{ border: "1px solid var(--color-blue-3)" }}
                    aria-hidden="true"
                  >
                    <CheckStroke size={12} />
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center px-2 py-4">
              <span className="text-center font-body text-xs text-grey-3">
                No missions
              </span>
            </div>
          )}
        </div>
      ) : (
        <div
          id={`${uid}-panel-invited`}
          role="tabpanel"
          aria-labelledby={`${uid}-tab-invited`}
          className="flex flex-col p-1"
        >
          {invited.length > 0 ? (
            <ul className="flex flex-col py-1">
              {invited.map((entry) => (
                <li key={entry.id} className="flex items-center gap-2 px-3 py-1.5">
                  <span className="shrink-0 text-gold-2" aria-hidden="true">
                    <CheckStroke size={12} />
                  </span>
                  <span className="truncate font-body text-xs text-grey-1">
                    {entry.name}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center justify-center px-2 py-4">
              <span className="text-center font-body text-xs text-grey-3">
                No pending invites
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
