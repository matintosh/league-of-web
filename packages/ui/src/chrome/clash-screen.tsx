"use client";

import { useId } from "react";
import type { ClashScoutingPlayer } from "@low/fixtures";

// Re-export so consumers can import the type from "@low/ui" without reaching
// into @low/fixtures directly.
export type { ClashScoutingPlayer };

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * A Clash tournament entry shown in the left panel card.
 */
export interface ClashTournament {
  /** Display name, e.g. "DEMACIAN CUP" */
  name: string;
  /** Week number, e.g. 1 */
  week: number;
  /** Day number, e.g. 2 */
  day: number;
  /** Number of tickets held by the player */
  ticketCount: number;
  /** Bracket size, e.g. 8 */
  bracketSize: number;
  /**
   * Reward capsule multiplier displayed on the card (e.g. 5 means "5×").
   * Shown as "5× TEAM MEMBER" reward art stack.
   */
  rewardMultiplier: number;
  /** Reward tier label, e.g. "TEAM MEMBER" */
  rewardLabel: string;
}

/** Team information shown in the center panel header */
export interface ClashTeam {
  /** Short tag displayed large, e.g. "TTM" */
  tag: string;
  /** Full team name, e.g. "TEAM TACO MEAT" */
  name: string;
  /** Tier numeral string, e.g. "III" */
  tier: string;
  /** URL for the team logo / crest image */
  logoSrc: string;
}

/** Player row entry in the roster */
export interface ClashPlayer {
  summonerName: string;
  /** DDragon champion icon URL — undefined = pending/no pick */
  championIconSrc?: string;
  /** Position icon URL from positionIconUrl() */
  roleIconSrc?: string;
  /** Lock status for this player slot */
  status: "locked-in" | "not-locked-in" | "ticket-required" | "pending";
  /** True for the local player row (highlighted treatment) */
  isLocalPlayer?: boolean;
}

/** Active sub-tab in the left panel */
export type ClashSubTab = "tournaments" | "team" | "bracket";

/** Active view tab in the scouting panel header */
export type ClashScoutingTab = "ranked" | "mastery" | "history";

export interface ClashScreenProps {
  /** Tournament shown in the left panel card */
  tournament: ClashTournament;
  /** Team shown in center panel header */
  team: ClashTeam;
  /** Exactly 5 player rows */
  players: ClashPlayer[];
  /** Countdown large label, e.g. "15m 38s" */
  countdownLabel: string;
  /** Countdown sublabel, e.g. "Until Scouting Starts" */
  countdownSublabel: string;
  /** Scouting time chip label, e.g. "7:00 pm" */
  scoutingTime?: string;
  /** Match start time chip label, e.g. "7:07 pm" */
  matchStartTime?: string;
  /** Which sub-tab is active in the left panel */
  activeSubTab?: ClashSubTab;
  /** Called when user switches left-panel sub-tab */
  onSubTabChange?: (tab: ClashSubTab) => void;
  /** Called when user clicks LOCK IN */
  onLockIn?: () => void;
  /**
   * Called by the scouting affordances: the SCOUT button on the registration
   * view and the BACK TO TEAM button on the scouting header. The shell flips
   * `scoutingPhase` — the component never owns the phase.
   */
  onToggleScouting?: () => void;
  /** Called when user clicks the × leave button */
  onLeaveTeam?: () => void;
  /**
   * When true, the center area shows the scouting panel (5-column opponent
   * stats grid) instead of the team registration roster.
   */
  scoutingPhase?: boolean;
  /**
   * Five opponent player columns for the scouting panel.
   * Required when scoutingPhase is true.
   */
  opponents?: ClashScoutingPlayer[];
  /** Active tab in the scouting panel header. Defaults to "ranked". */
  scoutingTab?: ClashScoutingTab;
  /** Called when the user switches scouting view tabs. */
  onScoutingTabChange?: (tab: ClashScoutingTab) => void;
}

// ---------------------------------------------------------------------------
// Sub-tab configuration
// ---------------------------------------------------------------------------

const SUB_TABS: { id: ClashSubTab; label: string }[] = [
  { id: "tournaments", label: "Tournaments" },
  { id: "team",        label: "Team" },
  { id: "bracket",     label: "Bracket" },
];

// ---------------------------------------------------------------------------
// Trapezoid clip path (matches LockInButton geometry)
// ---------------------------------------------------------------------------
const TRAP_CLIP = "polygon(0% 0%, 100% 0%, 88% 100%, 12% 100%)";
const BORDER_PX = 2;

// ---------------------------------------------------------------------------
// ClashScreen
// ---------------------------------------------------------------------------

/**
 * ClashScreen — 2019 Clash Beta tournament registration + team management view.
 *
 * Layout: left panel (w≈270px) contains tournament card + sub-tabs;
 * center panel fills remaining width with team header, 5-player roster,
 * countdown, and action bar.  The social rail is provided by client-shell
 * and is not part of this component.
 *
 * Presentational: props in, callbacks out.  No data fetching.
 */
export function ClashScreen({
  tournament,
  team,
  players,
  countdownLabel,
  countdownSublabel,
  scoutingTime,
  matchStartTime,
  activeSubTab = "tournaments",
  onSubTabChange,
  onLockIn,
  onLeaveTeam,
  onToggleScouting,
  scoutingPhase = false,
  opponents = [],
  scoutingTab = "ranked",
  onScoutingTabChange,
}: ClashScreenProps) {
  const gradId = useId();

  return (
    <div className="flex h-full w-full overflow-hidden bg-hextech-black">
      {/* ------------------------------------------------------------------ */}
      {/* LEFT PANEL — tournament card + sub-tabs                             */}
      {/* ------------------------------------------------------------------ */}
      <LeftPanel
        tournament={tournament}
        activeSubTab={activeSubTab}
        onSubTabChange={onSubTabChange}
        gradId={gradId}
      />

      {/* Vertical divider */}
      <div className="w-px shrink-0 bg-gold-5" aria-hidden="true" />

      {/* ------------------------------------------------------------------ */}
      {/* CENTER PANEL — registration roster OR scouting panel                */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-1 min-w-0 flex-col overflow-hidden">
        {scoutingPhase ? (
          <ScoutingPanel
            team={team}
            opponents={opponents}
            activeTab={scoutingTab}
            onTabChange={onScoutingTabChange}
            onBackToTeam={onToggleScouting}
          />
        ) : (
          <CenterPanel
            team={team}
            players={players}
            countdownLabel={countdownLabel}
            countdownSublabel={countdownSublabel}
            scoutingTime={scoutingTime}
            matchStartTime={matchStartTime}
            onLockIn={onLockIn}
            onLeaveTeam={onLeaveTeam}
            onScout={onToggleScouting}
          />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LeftPanel
// ---------------------------------------------------------------------------

interface LeftPanelProps {
  tournament: ClashTournament;
  activeSubTab: ClashSubTab;
  onSubTabChange?: (tab: ClashSubTab) => void;
  gradId: string;
}

function LeftPanel({ tournament, activeSubTab, onSubTabChange, gradId }: LeftPanelProps) {
  return (
    <div
      className="flex shrink-0 flex-col bg-blue-7"
      style={{ width: 270 }}
    >
      {/* Sub-tab strip */}
      <div
        role="tablist"
        aria-label="Clash panels"
        className="flex shrink-0 items-end border-b border-gold-5"
        style={{ height: 34 }}
      >
        {SUB_TABS.map((tab) => {
          const isActive = tab.id === activeSubTab;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSubTabChange?.(tab.id)}
              className={[
                "relative flex h-full flex-1 items-center justify-center px-2",
                "font-display text-xs uppercase tracking-widest transition-colors duration-150",
                "border-b-2 cursor-pointer",
                isActive
                  ? "border-gold-4 text-gold-1"
                  : "border-transparent text-gold-cream hover:text-gold-2",
              ].join(" ")}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tournament card — fills remaining height, scrollable */}
      <div className="flex flex-1 flex-col overflow-y-auto p-3 gap-3">
        <TournamentCard tournament={tournament} gradId={gradId} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TournamentCard
// ---------------------------------------------------------------------------

interface TournamentCardProps {
  tournament: ClashTournament;
  gradId: string;
}

function TournamentCard({ tournament, gradId }: TournamentCardProps) {
  return (
    <div className="flex flex-col border border-gold-5 bg-blue-7">
      {/* Card header — gold gradient strip */}
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{
          background: `linear-gradient(to right, color-mix(in srgb, var(--color-gold-4) 30%, var(--color-blue-7) 70%), var(--color-blue-7))`,
        }}
      >
        <span className="font-display text-sm uppercase tracking-widest text-gold-1">
          {tournament.name}
        </span>
        {/* BETA badge per the 2019 era reference */}
        <span className="border border-gold-5 px-1.5 py-0.5 font-display text-[10px] uppercase tracking-wider text-gold-2">
          Beta
        </span>
      </div>

      {/* Week · Day row */}
      <div className="border-t border-gold-5 px-3 py-1.5 flex items-center justify-between">
        <span className="font-body text-xs text-grey-1">
          Week {tournament.week} · Day {tournament.day}
        </span>
        {/* Tickets chip */}
        <div className="flex items-center gap-1">
          {/* Ticket icon — inline SVG approximation */}
          <svg
            aria-hidden="true"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-blue-2"
          >
            <path
              d="M1 4.5C1 3.67 1.67 3 2.5 3h7C10.33 3 11 3.67 11 4.5v.25a1.25 1.25 0 0 0 0 2.5V7.5C11 8.33 10.33 9 9.5 9h-7A1.5 1.5 0 0 1 1 7.5v-.25a1.25 1.25 0 0 0 0-2.5V4.5Z"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />
          </svg>
          <span className="font-body text-xs text-gold-2 tabular-nums">
            My Tickets {tournament.ticketCount}
          </span>
        </div>
      </div>

      {/* Reward art area — placeholder stack with multiplier */}
      <div className="flex flex-col items-center py-4 gap-2 border-t border-gold-5">
        {/* Stacked capsule placeholder — 5 layered boxes */}
        <div className="relative flex items-center justify-center" style={{ height: 80, width: 80 }}>
          {Array.from({ length: Math.min(tournament.rewardMultiplier, 5) }).map((_, i) => (
            <div
              key={i}
              aria-hidden="true"
              className="absolute border border-gold-5 bg-blue-6"
              style={{
                width: 52 - i * 3,
                height: 52 - i * 3,
                top: i * 4,
                left: `calc(50% - ${(52 - i * 3) / 2}px)`,
                opacity: 1 - i * 0.12,
              }}
            />
          ))}
          <span
            className="relative z-10 font-display text-xl text-gold-1 uppercase tracking-wider"
            style={{ textShadow: "0 0 8px var(--color-gold-3)" }}
          >
            {tournament.rewardMultiplier}×
          </span>
        </div>
        <span className="font-display text-xs uppercase tracking-widest text-gold-2">
          {tournament.rewardLabel}
        </span>
      </div>

      {/* Bracket size */}
      <div className="border-t border-gold-5 px-3 py-2 text-center">
        <span className="font-display text-xs uppercase tracking-widest text-grey-1">
          {tournament.bracketSize} Team Bracket
        </span>
      </div>

      {/* Pagination dots */}
      <div className="flex items-center justify-center gap-2 border-t border-gold-5 py-2">
        <button
          type="button"
          aria-label="Previous tournament"
          className="text-grey-2 hover:text-gold-1 transition-colors duration-150 cursor-pointer px-1"
        >
          ◁
        </button>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            aria-hidden="true"
            className={[
              "inline-block h-1.5 w-1.5 rounded-full transition-colors duration-150",
              i === 0 ? "bg-gold-3" : "bg-grey-3",
            ].join(" ")}
          />
        ))}
        <button
          type="button"
          aria-label="Next tournament"
          className="text-grey-2 hover:text-gold-1 transition-colors duration-150 cursor-pointer px-1"
        >
          ▷
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CenterPanel
// ---------------------------------------------------------------------------

interface CenterPanelProps {
  team: ClashTeam;
  players: ClashPlayer[];
  countdownLabel: string;
  countdownSublabel: string;
  scoutingTime?: string;
  matchStartTime?: string;
  onLockIn?: () => void;
  onLeaveTeam?: () => void;
  /** Renders the SCOUT OPPONENTS affordance when provided. */
  onScout?: () => void;
}

function CenterPanel({
  team,
  players,
  countdownLabel,
  countdownSublabel,
  scoutingTime,
  matchStartTime,
  onLockIn,
  onLeaveTeam,
  onScout,
}: CenterPanelProps) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Team header */}
      <TeamHeader team={team} />

      {/* Divider */}
      <div className="h-px shrink-0 bg-gold-5" aria-hidden="true" />

      {/* Player roster */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex flex-col divide-y divide-gold-5">
          {players.map((player, idx) => (
            <PlayerRow key={idx} player={player} />
          ))}
        </div>
      </div>

      {/* Countdown + action bar */}
      <div className="shrink-0 border-t border-gold-5 bg-blue-7">
        {/* Countdown */}
        <div className="flex flex-col items-center py-3 gap-0.5">
          <span
            className="font-display text-2xl uppercase tracking-widest"
            style={{ color: "var(--color-gold-2)" }}
          >
            {countdownLabel}
          </span>
          <span className="font-body text-xs text-grey-1 uppercase tracking-wide">
            {countdownSublabel}
          </span>
        </div>

        {/* Time chips */}
        {(scoutingTime || matchStartTime) && (
          <div className="flex items-center justify-center gap-6 pb-2">
            {scoutingTime && (
              <div className="flex flex-col items-center gap-0.5">
                <span className="font-body text-[10px] uppercase tracking-widest text-grey-2">
                  Scouting
                </span>
                <span className="font-body text-xs text-gold-cream">
                  {scoutingTime}
                </span>
              </div>
            )}
            {matchStartTime && (
              <div className="flex flex-col items-center gap-0.5">
                <span className="font-body text-[10px] uppercase tracking-widest text-grey-2">
                  Match
                </span>
                <span className="font-body text-xs text-gold-cream">
                  {matchStartTime}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Scouting entry affordance — demo gesture into the scouting phase */}
        {onScout && (
          <div className="flex justify-center pb-2">
            <button
              type="button"
              onClick={onScout}
              className="border border-gold-5 bg-transparent px-4 py-1 font-display text-[11px] uppercase tracking-widest text-gold-2 hover:border-gold-4 hover:text-gold-1 transition-colors duration-150 cursor-pointer"
            >
              Scout Opponents
            </button>
          </div>
        )}

        {/* Action bar: × leave + LOCK IN trapezoid */}
        <div className="flex items-center gap-2 px-4 pb-4 pt-2">
          {/* Leave team button */}
          <button
            type="button"
            aria-label="Leave team"
            onClick={onLeaveTeam}
            className={[
              "flex h-10 w-10 shrink-0 items-center justify-center",
              "border border-gold-5 bg-grey-cool text-grey-1",
              "hover:border-gold-4 hover:text-gold-1 transition-colors duration-150 cursor-pointer",
              "font-display text-lg",
            ].join(" ")}
          >
            ×
          </button>

          {/* LOCK IN trapezoid button */}
          <div className="flex-1">
            <LockInTrapezoid onLockIn={onLockIn} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TeamHeader
// ---------------------------------------------------------------------------

interface TeamHeaderProps {
  team: ClashTeam;
}

function TeamHeader({ team }: TeamHeaderProps) {
  return (
    <div className="flex items-center gap-4 px-5 py-3 bg-blue-7">
      {/* Team logo */}
      <div
        className="flex shrink-0 items-center justify-center border border-gold-5 bg-blue-6 overflow-hidden"
        style={{ width: 56, height: 56 }}
      >
        {team.logoSrc ? (
          <img
            src={team.logoSrc}
            alt={`${team.tag} logo`}
            width={48}
            height={48}
            className="object-contain"
          />
        ) : (
          /* Inline SVG shield placeholder */
          <svg
            aria-hidden="true"
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gold-4"
          >
            <path
              d="M18 3L4 9v10c0 8 6 14 14 17 8-3 14-9 14-17V9L18 3Z"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
            <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle"
              fontFamily="var(--font-display)" fontSize="10" fill="currentColor"
              letterSpacing="1">
              {team.tag}
            </text>
          </svg>
        )}
      </div>

      {/* Tag + name + tier */}
      <div className="flex flex-col gap-0.5">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-2xl uppercase tracking-widest text-grey-1">
            {team.tag}
          </span>
          {/* Tier badge — dark red bg, white numeral */}
          <span
            className="inline-flex items-center border border-gold-5 px-2 py-0.5 font-display text-xs uppercase tracking-wider text-grey-1"
            style={{ background: "color-mix(in srgb, var(--color-riot-red) 12%, var(--color-hextech-black) 88%)" }}
          >
            Tier {team.tier}
          </span>
        </div>
        <span className="font-display text-sm uppercase tracking-widest text-grey-1">
          {team.name}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PlayerRow
// ---------------------------------------------------------------------------

interface PlayerRowProps {
  player: ClashPlayer;
}

function PlayerRow({ player }: PlayerRowProps) {
  const { status, summonerName, championIconSrc, roleIconSrc, isLocalPlayer } = player;

  const statusLabel =
    status === "locked-in"     ? "Locked In"        :
    status === "not-locked-in" ? "Not Locked In"    :
    status === "ticket-required" ? "Ticket Required..." :
    "Pending...";

  const statusColor =
    status === "locked-in"       ? "text-gold-2"  :
    status === "not-locked-in"   ? "text-grey-2"  :
    status === "ticket-required" ? "text-gold-3"  :
    "text-grey-2";

  return (
    <div
      className={[
        "flex items-center gap-3 px-5 py-2",
        "transition-colors duration-150",
        isLocalPlayer ? "bg-blue-6/60" : "hover:bg-blue-6/30",
      ].join(" ")}
    >
      {/* Champion icon or placeholder */}
      <div
        className="flex shrink-0 items-center justify-center border border-gold-5 bg-blue-6 overflow-hidden"
        style={{ width: 36, height: 36 }}
      >
        {championIconSrc ? (
          <img
            src={championIconSrc}
            alt=""
            width={36}
            height={36}
            className="object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="font-display text-xs text-grey-3"
          >
            ?
          </span>
        )}
      </div>

      {/* Summoner name */}
      <span className="flex-1 min-w-0 font-body text-sm text-grey-1 truncate">
        {summonerName}
      </span>

      {/* Role icon */}
      {roleIconSrc && (
        <img
          src={roleIconSrc}
          alt=""
          aria-hidden="true"
          width={18}
          height={18}
          className="shrink-0 opacity-70"
        />
      )}

      {/* Lock status text */}
      <span
        className={[
          "shrink-0 font-body text-xs",
          statusColor,
        ].join(" ")}
      >
        {statusLabel}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ScoutingPanel — 5-column opponent stats view (scouting phase)
// Reference: docs/reference/client-clash-scouting.png
// ---------------------------------------------------------------------------

const SCOUTING_TABS: { id: ClashScoutingTab; label: string }[] = [
  { id: "ranked",  label: "Ranked" },
  { id: "mastery", label: "Mastery" },
  { id: "history", label: "History" },
];

interface ScoutingPanelProps {
  team: ClashTeam;
  opponents: ClashScoutingPlayer[];
  activeTab: ClashScoutingTab;
  onTabChange?: (tab: ClashScoutingTab) => void;
  /** Returns to the registration/team view. */
  onBackToTeam?: () => void;
}

function ScoutingPanel({ team, opponents, activeTab, onTabChange, onBackToTeam }: ScoutingPanelProps) {

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* ---------------------------------------------------------------- */}
      {/* Scouting header — team info left, BETA badge center, tabs right  */}
      {/* ---------------------------------------------------------------- */}
      <div
        className="flex shrink-0 items-center gap-4 px-5"
        style={{
          height: 60,
          background: `linear-gradient(to right, color-mix(in srgb, var(--color-riot-red) 35%, var(--color-hextech-black) 65%), var(--color-hextech-black))`,
        }}
      >
        {/* Back to registration */}
        {onBackToTeam && (
          <button
            type="button"
            aria-label="Back to team"
            onClick={onBackToTeam}
            className="flex h-8 w-8 shrink-0 items-center justify-center border border-gold-5 bg-transparent text-gold-2 hover:border-gold-4 hover:text-gold-1 transition-colors duration-150 cursor-pointer font-display"
          >
            ‹
          </button>
        )}

        {/* Team logo */}
        <div
          className="flex shrink-0 items-center justify-center border border-gold-5 overflow-hidden"
          style={{
            width: 44,
            height: 44,
            background: "color-mix(in srgb, var(--color-riot-red) 20%, var(--color-hextech-black) 80%)",
          }}
        >
          {team.logoSrc ? (
            <img
              src={team.logoSrc}
              alt={`${team.tag} logo`}
              width={36}
              height={36}
              className="object-contain"
            />
          ) : (
            <svg
              aria-hidden="true"
              width="28"
              height="28"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gold-4"
            >
              <path
                d="M18 3L4 9v10c0 8 6 14 14 17 8-3 14-9 14-17V9L18 3Z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              <text
                x="50%"
                y="58%"
                dominantBaseline="middle"
                textAnchor="middle"
                fontFamily="var(--font-display)"
                fontSize="9"
                fill="currentColor"
                letterSpacing="1"
              >
                {team.tag}
              </text>
            </svg>
          )}
        </div>

        {/* Team name + tier */}
        <div className="flex flex-col gap-0.5">
          <span className="font-display text-lg uppercase tracking-widest text-grey-1 leading-none">
            {team.name}
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className="inline-flex items-center border border-gold-5 px-1.5 py-0.5 font-display text-[10px] uppercase tracking-wider text-grey-1"
              style={{ background: "color-mix(in srgb, var(--color-riot-red) 12%, var(--color-hextech-black) 88%)" }}
            >
              Tier {team.tier}
            </span>
          </div>
        </div>

        {/* BETA chip — center */}
        <div className="flex flex-1 items-center justify-center">
          <span
            className="border border-gold-5 px-2 py-1 font-display text-xs uppercase tracking-widest text-gold-2"
            style={{ background: "color-mix(in srgb, var(--color-gold-5) 20%, var(--color-hextech-black) 80%)" }}
          >
            Beta
          </span>
        </div>

        {/* View tabs — right side */}
        <div
          role="tablist"
          aria-label="Scouting views"
          className="flex items-end self-stretch gap-1"
        >
          {SCOUTING_TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onTabChange?.(tab.id)}
                className={[
                  "relative flex h-full items-center px-4 pb-1",
                  "font-display text-xs uppercase tracking-widest transition-colors duration-150",
                  "border-b-2",
                  isActive
                    ? "border-gold-4 text-gold-1"
                    : "border-transparent text-gold-cream hover:text-gold-2 cursor-pointer",
                  onTabChange ? "cursor-pointer" : "",
                ].join(" ")}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px shrink-0 bg-gold-5" aria-hidden="true" />

      {/* ---------------------------------------------------------------- */}
      {/* Body — tabbed content                                             */}
      {/* ---------------------------------------------------------------- */}
      <div
        className="flex flex-1 overflow-hidden"
        style={{ background: "color-mix(in srgb, var(--color-hextech-black) 85%, var(--color-blue-7) 15%)" }}
      >
        {activeTab === "ranked" ? (
          <ScoutingGridRanked opponents={opponents} />
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <span className="font-body text-sm text-grey-2 uppercase tracking-widest">
              Coming Soon
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ScoutingGridRanked — the 5-column ranked stats view
// ---------------------------------------------------------------------------

interface ScoutingGridRankedProps {
  opponents: ClashScoutingPlayer[];
}

function ScoutingGridRanked({ opponents }: ScoutingGridRankedProps) {
  // Pad to 5 columns if fewer opponents are provided
  const columns = Array.from({ length: 5 }, (_, i) => opponents[i] ?? null);

  return (
    <div className="flex flex-1 divide-x divide-gold-5 overflow-hidden">
      {columns.map((player, colIdx) => (
        <div
          key={colIdx}
          className="flex flex-1 min-w-0 flex-col overflow-hidden"
          style={{
            // Alternating column backgrounds per reference (darker / lighter)
            background: colIdx % 2 === 0
              ? "color-mix(in srgb, var(--color-blue-7) 60%, var(--color-hextech-black) 40%)"
              : "color-mix(in srgb, var(--color-hextech-black) 85%, var(--color-blue-7) 15%)",
          }}
        >
          {player ? (
            <ScoutingColumn player={player} />
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <span className="font-body text-xs text-grey-3">—</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ScoutingColumn — one player's stats column
// ---------------------------------------------------------------------------

interface ScoutingColumnProps {
  player: ClashScoutingPlayer;
}

function ScoutingColumn({ player }: ScoutingColumnProps) {
  const { summonerName, rankLabel, rankEmblemSrc, champions } = player;
  // Show at most 4 champion rows per reference
  const topChamps = champions.slice(0, 4);

  return (
    <div className="flex flex-col items-center px-2 pt-3 pb-2 gap-2 overflow-hidden">
      {/* Summoner name */}
      <span className="w-full truncate text-center font-body text-xs text-grey-1 leading-tight">
        {summonerName}
      </span>

      {/* Rank emblem */}
      <div className="flex flex-col items-center gap-1">
        <img
          src={rankEmblemSrc}
          alt={rankLabel}
          width={56}
          height={64}
          className="object-contain"
          style={{ imageRendering: "auto" }}
        />
        <span className="font-display text-[10px] uppercase tracking-wider text-gold-2 text-center leading-none">
          {rankLabel}
        </span>
      </div>

      {/* Champion strip — up to 4 rows */}
      <div className="flex w-full flex-col gap-1 overflow-hidden">
        {topChamps.map((champ, i) => (
          <ScoutingChampRow key={i} champ={champ} />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ScoutingChampRow — one champion row: icon + win% + KDA
// ---------------------------------------------------------------------------

interface ScoutingChampRowProps {
  champ: {
    iconSrc: string;
    winPct: number;
    games: number;
    kda: number;
  };
}

function ScoutingChampRow({ champ }: ScoutingChampRowProps) {
  const { iconSrc, winPct, games, kda } = champ;

  return (
    <div className="flex items-center gap-1.5 min-w-0">
      {/* Champion icon */}
      <div
        className="flex shrink-0 overflow-hidden border border-gold-5"
        style={{ width: 32, height: 32 }}
      >
        <img
          src={iconSrc}
          alt=""
          width={32}
          height={32}
          className="object-cover"
        />
      </div>

      {/* Stats */}
      <div className="flex flex-1 min-w-0 flex-col gap-0 overflow-hidden">
        <span className="font-body text-[10px] text-gold-cream tabular-nums leading-tight truncate">
          {winPct}% ({games})
        </span>
        <span className="font-body text-[10px] text-grey-1 tabular-nums leading-tight">
          {kda.toFixed(1)} KDA
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LockInTrapezoid — Clash-specific LOCK IN button
// Reuses the same trapezoid geometry as LockInButton (champ-select) but with
// the gold/dark Hextech color scheme instead of cyan (Clash era uses gold CTA).
// ---------------------------------------------------------------------------

interface LockInTrapezoidProps {
  onLockIn?: () => void;
  disabled?: boolean;
}

function LockInTrapezoid({ onLockIn, disabled = false }: LockInTrapezoidProps) {
  const borderColor = disabled ? "var(--color-grey-3)" : "var(--color-gold-4)";
  const fillBg = disabled
    ? "var(--color-grey-cool)"
    : `linear-gradient(to bottom, var(--color-gold-5) 0%, var(--color-grey-cool) 100%)`;
  const textColor = disabled ? "var(--color-grey-2)" : "var(--color-gold-1)";

  return (
    <button
      type="button"
      aria-disabled={disabled ? "true" : undefined}
      onClick={disabled ? undefined : onLockIn}
      className={[
        "group relative flex w-full items-center justify-center py-3",
        !disabled && "[filter:drop-shadow(0_0_6px_color-mix(in_srgb,var(--color-gold-3)_40%,transparent))]",
        !disabled &&
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-4 focus-visible:outline-offset-2",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Border shell */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ clipPath: TRAP_CLIP, background: borderColor, transition: "background 150ms" }}
      />
      {/* Fill */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          inset: BORDER_PX,
          clipPath: TRAP_CLIP,
          background: fillBg,
          transition: "background 150ms",
        }}
      />
      {/* Hover overlay */}
      {!disabled && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          style={{
            inset: BORDER_PX,
            clipPath: TRAP_CLIP,
            background: `linear-gradient(to bottom, color-mix(in srgb, var(--color-gold-4) 60%, transparent), var(--color-grey-cool))`,
          }}
        />
      )}
      {/* Label */}
      <span
        className="relative z-10 font-display text-sm tracking-[0.2em] uppercase select-none"
        style={{ color: textColor, transition: "color 150ms" }}
      >
        Lock In
      </span>
    </button>
  );
}
