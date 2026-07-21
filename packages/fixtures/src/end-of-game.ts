/**
 * End-of-Game (post-match) scoreboard types — issue #441.
 *
 * TYPES ONLY. Per the types-not-values rule, the dummy 5v5 result VALUE is
 * supplied by the page / showcase, never here. Icon URLs are built with the
 * fixture helpers (`itemIconUrl`, `championSquareUrl`, `scoreboardRoleIconUrl`,
 * `objectiveIconUrl`, `masteryBannerUrl`) and passed in as resolved strings.
 */

import type { ScoreboardRole, ObjectiveIcon } from "./cdragon";

/** Which team side a block belongs to — drives the blue/red token tint. */
export type TeamSide = "blue" | "red";

/** Kills / deaths / assists for one player. */
export interface Kda {
  kills: number;
  deaths: number;
  assists: number;
}

/**
 * One player row in the scoreboard.
 *
 * Icon fields are pre-resolved URLs (component contract: URLs in, no fetch):
 * - `championIconSrc` from `championSquareUrl`
 * - `roleIconSrc` from `scoreboardRoleIconUrl`
 * - `itemIconSrcs` from `itemIconUrl` (0–6 build items; render pads to 6 slots)
 * - `trinketIconSrc` from `itemIconUrl` (the trinket slot, optional)
 */
export interface ScoreboardPlayer {
  /** Display summoner name (Riot ID game name). */
  summonerName: string;
  /** Optional tagline / rank string shown under the name. */
  tagline?: string;
  /** Champion display name (alt text). */
  championName: string;
  /** Resolved champion square-icon URL. */
  championIconSrc: string;
  /** Champion level reached in the match (badge on the portrait). */
  champLevel: number;
  /** Role/class of the player — also selects the small role icon. */
  role: ScoreboardRole;
  /** Resolved role-icon URL. */
  roleIconSrc: string;
  /** Kills / deaths / assists. */
  kda: Kda;
  /** Creep score (minions + monsters killed). */
  cs: number;
  /** Gold earned. */
  gold: number;
  /** Resolved item build icon URLs (0–6). */
  itemIconSrcs: string[];
  /** Resolved trinket icon URL (optional 7th slot). */
  trinketIconSrc?: string;
  /**
   * Champion-mastery level 0–7 — selects the mastery banner behind the score
   * meter. 0 = no mastery (empty banner).
   */
  masteryLevel: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  /** Resolved mastery-banner URL. */
  masteryBannerSrc: string;
  /**
   * Post-game performance score 0–100 — fills the score meter. In the real
   * client this is the champion-mastery-grade meter; here it's a simple 0–100.
   */
  score: number;
  /** True for the local player row (highlighted treatment). */
  isMe?: boolean;
  /** True if the player left / went AFK (leaver icon + dimmed row). */
  isLeaver?: boolean;
}

/**
 * Neutral-objective tallies for one team, shown in the objectives summary strip.
 * `dragonKinds` optionally names each drake taken (in order) so the strip can
 * render the elemental drake icons; otherwise the generic dragon icon repeats.
 */
export interface TeamObjectives {
  dragons: number;
  barons: number;
  heralds: number;
  towers: number;
  inhibitors: number;
  /** Optional per-drake element order (length ≤ `dragons`). */
  dragonKinds?: Extract<ObjectiveIcon, "fire" | "water" | "air" | "earth" | "elder">[];
}

/** One team block: side tint, win flag, five players, and objective counts. */
export interface ScoreboardTeam {
  side: TeamSide;
  /** True if this team won the match. */
  won: boolean;
  /** The five player rows. */
  players: ScoreboardPlayer[];
  /** Neutral objectives this team secured. */
  objectives: TeamObjectives;
}

/**
 * Full end-of-game result fed to `EndOfGameScreen`.
 *
 * `outcome` mirrors the local player's team result and drives the top banner
 * (victory vs defeat). The two teams are ordered [ally, enemy] for display.
 */
export interface EndOfGameResult {
  /** Local player's outcome — banner + accent. */
  outcome: "victory" | "defeat";
  /** Queue / game-mode label, e.g. "Ranked Solo/Duo". */
  queueLabel: string;
  /** Match duration label, e.g. "32:14". */
  durationLabel: string;
  /** When the match was played, e.g. "Today". */
  dateLabel?: string;
  /** The two teams, ally first. */
  teams: [ScoreboardTeam, ScoreboardTeam];
}
