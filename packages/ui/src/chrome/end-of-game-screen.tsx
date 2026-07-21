"use client";

/**
 * EndOfGameScreen — the post-match stats scoreboard the client shows after a
 * game resolves (issue #441). Faithful to the modern client's "Overview" tab:
 *
 *   - VICTORY / DEFEAT banner header (team-tinted), with queue + duration subline.
 *   - Two stacked team blocks (ally first). Each has a team header (result tag +
 *     objective totals + column labels) and five player rows. A row is:
 *     portrait + champion_frame + level badge · role icon · name/rank ·
 *     KDA (ratio) · CS (minions icon) · gold (coin icon) · 6-slot item build +
 *     trinket · a mastery banner + score meter.
 *   - An objectives summary strip between the teams: dragons (elemental) /
 *     baron / herald / towers / inhibitors with the 144×144 match-history icons,
 *     blue count vs red count.
 *   - Footer: PLAY AGAIN (primary) + CONTINUE.
 *
 * Team tints map to tokens: blue side → blue-* family, red side → ban-red /
 * riot-red family.
 * The local player row (isMe) is highlighted; a leaver row is dimmed with a
 * leaver glyph. All icon URLs arrive pre-resolved as props (component contract:
 * URLs in, no fetch). Presentational — props in, callbacks out.
 */

import type {
  EndOfGameResult,
  ScoreboardTeam,
  ScoreboardPlayer,
  TeamObjectives,
  TeamSide,
} from "@low/fixtures";

// Re-export so consumers can import the types from "@low/ui" without reaching
// into @low/fixtures directly.
export type {
  EndOfGameResult,
  ScoreboardTeam,
  ScoreboardPlayer,
  TeamObjectives,
  TeamSide,
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface EndOfGameScreenProps {
  /** The full match result (banner outcome + both teams). */
  result: EndOfGameResult;
  /** Victory/defeat glyph URL for the ally banner (postgameAssetUrl). */
  bannerIconSrc?: string;
  /** Leaver glyph URL for leaver rows (postgameAssetUrl). */
  leaverIconSrc?: string;
  /** CS (minions) icon URL (matchHistoryIconUrl). */
  csIconSrc?: string;
  /** Gold coin icon URL (matchHistoryIconUrl). */
  goldIconSrc?: string;
  /** Champion portrait frame URL (matchHistoryIconUrl "champion_frame.png"). */
  championFrameSrc?: string;
  /** Objective-strip icon URLs, keyed by objective + side (objectiveIconUrl). */
  objectiveIcons: ObjectiveIconMap;
  /** Called when the user clicks PLAY AGAIN. */
  onPlayAgain?: () => void;
  /** Called when the user clicks CONTINUE / close. */
  onClose?: () => void;
}

/** Both team-side tints for a single objective icon. */
export interface ObjectiveIconSides {
  blue: string;
  red: string;
}

/**
 * The elemental drakes the strip can render individually (from a team's
 * `dragonKinds`). Mirrors the drake element union carried by `TeamObjectives`.
 */
export type DrakeKind = NonNullable<TeamObjectives["dragonKinds"]>[number];

/**
 * Resolved objective-strip icon URLs. The strip renders one icon per row, tinted
 * for the winning-count side; both tints are provided so either team can lead.
 *
 * `drakes` holds the per-element drake art (fire/water/air/earth/elder), each
 * with both side tints, so the dragons row can show the SPECIFIC drakes a team
 * took (via `dragonKinds`). When a team has no `dragonKinds`, the generic
 * `dragon` icon repeats as the fallback.
 */
export interface ObjectiveIconMap {
  dragon: ObjectiveIconSides;
  baron: ObjectiveIconSides;
  herald: ObjectiveIconSides;
  tower: ObjectiveIconSides;
  inhibitor: ObjectiveIconSides;
  drakes: Record<DrakeKind, ObjectiveIconSides>;
}

// ---------------------------------------------------------------------------
// Side tint helpers — blue side vs red side token families
// ---------------------------------------------------------------------------

interface SideTint {
  /** Accent border/text color. */
  accent: string;
  /** Banner gradient stop. */
  bannerFrom: string;
  /** Row-header background wash. */
  headerBg: string;
}

const SIDE_TINT: Record<TeamSide, SideTint> = {
  blue: {
    accent: "var(--color-blue-2)",
    bannerFrom: "color-mix(in srgb, var(--color-blue-4) 55%, var(--color-hextech-black))",
    headerBg: "color-mix(in srgb, var(--color-blue-6) 70%, var(--color-hextech-black))",
  },
  red: {
    accent: "var(--color-ban-red-1)",
    bannerFrom: "color-mix(in srgb, var(--color-ban-red-3) 60%, var(--color-hextech-black))",
    headerBg: "color-mix(in srgb, var(--color-ban-red-3) 32%, var(--color-hextech-black))",
  },
};

// ---------------------------------------------------------------------------
// EndOfGameScreen
// ---------------------------------------------------------------------------

export function EndOfGameScreen({
  result,
  bannerIconSrc,
  leaverIconSrc,
  csIconSrc,
  goldIconSrc,
  championFrameSrc,
  objectiveIcons,
  onPlayAgain,
  onClose,
}: EndOfGameScreenProps) {
  const [ally, enemy] = result.teams;
  const victory = result.outcome === "victory";

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-hextech-black">
      {/* ---------------------------------------------------------------- */}
      {/* Banner header                                                     */}
      {/* ---------------------------------------------------------------- */}
      <BannerHeader
        outcome={result.outcome}
        side={ally.side}
        queueLabel={result.queueLabel}
        durationLabel={result.durationLabel}
        dateLabel={result.dateLabel}
        iconSrc={bannerIconSrc}
      />

      {/* ---------------------------------------------------------------- */}
      {/* Scoreboard body — ally team, objectives strip, enemy team         */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        <TeamBlock
          team={ally}
          resultTag={ally.won ? "Victory" : "Defeat"}
          leaverIconSrc={leaverIconSrc}
          csIconSrc={csIconSrc}
          goldIconSrc={goldIconSrc}
          championFrameSrc={championFrameSrc}
        />

        <ObjectivesStrip
          ally={ally.objectives}
          enemy={enemy.objectives}
          allySide={ally.side}
          enemySide={enemy.side}
          icons={objectiveIcons}
        />

        <TeamBlock
          team={enemy}
          resultTag={enemy.won ? "Victory" : "Defeat"}
          leaverIconSrc={leaverIconSrc}
          csIconSrc={csIconSrc}
          goldIconSrc={goldIconSrc}
          championFrameSrc={championFrameSrc}
        />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Footer actions                                                    */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex shrink-0 items-center justify-end gap-3 border-t border-gold-5 bg-blue-8 px-6 py-3">
        <button
          type="button"
          onClick={onClose}
          className="border border-gold-5 bg-transparent px-5 py-2 font-display text-xs uppercase tracking-widest text-gold-2 transition-colors duration-150 hover:border-gold-4 hover:text-gold-1 cursor-pointer"
        >
          Continue
        </button>
        <button
          type="button"
          onClick={onPlayAgain}
          className={[
            "px-6 py-2 font-display text-xs uppercase tracking-widest cursor-pointer",
            "border transition-colors duration-150",
            victory
              ? "border-gold-4 bg-gold-5 text-gold-1 hover:bg-gold-4 hover:text-hextech-black"
              : "border-gold-5 bg-blue-6 text-gold-2 hover:border-gold-4 hover:text-gold-1",
          ].join(" ")}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// BannerHeader — VICTORY / DEFEAT ribbon
// ---------------------------------------------------------------------------

interface BannerHeaderProps {
  outcome: "victory" | "defeat";
  side: TeamSide;
  queueLabel: string;
  durationLabel: string;
  dateLabel?: string;
  iconSrc?: string;
}

function BannerHeader({
  outcome,
  side,
  queueLabel,
  durationLabel,
  dateLabel,
  iconSrc,
}: BannerHeaderProps) {
  const victory = outcome === "victory";
  const tint = SIDE_TINT[side];

  return (
    <div
      className="flex shrink-0 items-center gap-4 border-b border-gold-5 px-6 py-4"
      style={{
        background: `linear-gradient(105deg, ${tint.bannerFrom} 0%, var(--color-hextech-black) 62%)`,
      }}
    >
      {iconSrc && (
        <img
          src={iconSrc}
          alt=""
          aria-hidden="true"
          width={52}
          height={52}
          className="shrink-0 object-contain"
        />
      )}

      <div className="flex flex-col">
        <span
          className="font-display text-4xl uppercase leading-none tracking-[0.14em]"
          style={{
            color: victory ? "var(--color-gold-1)" : "var(--color-ban-red-1)",
            textShadow: victory
              ? "0 0 18px color-mix(in srgb, var(--color-gold-3) 60%, transparent)"
              : "0 0 18px color-mix(in srgb, var(--color-ban-red-1) 45%, transparent)",
          }}
        >
          {victory ? "Victory" : "Defeat"}
        </span>
        <span className="mt-1 font-body text-xs uppercase tracking-widest text-grey-1">
          {queueLabel}
          <span className="mx-2 text-grey-3">·</span>
          {durationLabel}
          {dateLabel && (
            <>
              <span className="mx-2 text-grey-3">·</span>
              {dateLabel}
            </>
          )}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TeamBlock — a team header + five player rows
// ---------------------------------------------------------------------------

interface TeamBlockProps {
  team: ScoreboardTeam;
  resultTag: string;
  leaverIconSrc?: string;
  csIconSrc?: string;
  goldIconSrc?: string;
  championFrameSrc?: string;
}

function TeamBlock({
  team,
  resultTag,
  leaverIconSrc,
  csIconSrc,
  goldIconSrc,
  championFrameSrc,
}: TeamBlockProps) {
  const tint = SIDE_TINT[team.side];

  return (
    <div className="flex flex-col">
      {/* Team header — result tag + column labels */}
      <div
        className="flex items-center gap-3 px-6 py-1.5 text-[10px] uppercase tracking-widest"
        style={{ background: tint.headerBg }}
      >
        <span
          className="font-display text-sm tracking-widest"
          style={{ color: team.won ? "var(--color-gold-1)" : tint.accent }}
        >
          {resultTag}
        </span>
        {/* Column labels — align with the row grid below */}
        <div className="ml-auto grid grid-cols-[minmax(0,1fr)_64px_88px_minmax(0,190px)_minmax(0,140px)] items-center gap-3 font-body text-grey-2">
          <span />
          <span className="text-center">KDA</span>
          <span className="text-center">CS / Gold</span>
          <span className="text-center">Items</span>
          <span className="text-center">Score</span>
        </div>
      </div>

      {/* Player rows */}
      <div className="flex flex-col divide-y divide-blue-8">
        {team.players.map((player, idx) => (
          <PlayerRow
            key={idx}
            player={player}
            side={team.side}
            leaverIconSrc={leaverIconSrc}
            csIconSrc={csIconSrc}
            goldIconSrc={goldIconSrc}
            championFrameSrc={championFrameSrc}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PlayerRow
// ---------------------------------------------------------------------------

interface PlayerRowProps {
  player: ScoreboardPlayer;
  side: TeamSide;
  leaverIconSrc?: string;
  csIconSrc?: string;
  goldIconSrc?: string;
  championFrameSrc?: string;
}

function PlayerRow({
  player,
  side,
  leaverIconSrc,
  csIconSrc,
  goldIconSrc,
  championFrameSrc,
}: PlayerRowProps) {
  const tint = SIDE_TINT[side];
  const { kda } = player;
  const ratio =
    kda.deaths === 0
      ? "Perfect"
      : `${((kda.kills + kda.assists) / kda.deaths).toFixed(1)}:1 KDA`;

  return (
    <div
      className={[
        "grid grid-cols-[minmax(0,1fr)_64px_88px_minmax(0,190px)_minmax(0,140px)] items-center gap-3 px-6 py-2",
        "transition-colors duration-150",
        player.isMe ? "bg-blue-7/70" : "hover:bg-blue-8/60",
        player.isLeaver ? "opacity-60" : "",
      ].join(" ")}
      style={
        player.isMe
          ? { boxShadow: `inset 3px 0 0 ${tint.accent}` }
          : undefined
      }
    >
      {/* Portrait + role + name */}
      <div className="flex min-w-0 items-center gap-2.5">
        <Portrait
          player={player}
          championFrameSrc={championFrameSrc}
          leaverIconSrc={leaverIconSrc}
        />
        <img
          src={player.roleIconSrc}
          alt=""
          aria-hidden="true"
          width={20}
          height={20}
          className="shrink-0 opacity-80"
        />
        <div className="flex min-w-0 flex-col">
          <span
            className={[
              "truncate font-body text-sm leading-tight",
              player.isMe ? "text-gold-1" : "text-grey-1",
            ].join(" ")}
          >
            {player.summonerName}
          </span>
          {player.tagline && (
            <span className="truncate font-body text-[10px] uppercase tracking-wide text-grey-2 leading-tight">
              {player.tagline}
            </span>
          )}
        </div>
      </div>

      {/* KDA */}
      <div className="flex flex-col items-center">
        <span className="font-body text-sm tabular-nums text-grey-1 leading-tight">
          {kda.kills}
          <span className="mx-0.5 text-grey-3">/</span>
          <span className="text-ban-red-1">{kda.deaths}</span>
          <span className="mx-0.5 text-grey-3">/</span>
          {kda.assists}
        </span>
        <span className="font-body text-[10px] text-grey-2 leading-tight">
          {ratio}
        </span>
      </div>

      {/* CS / Gold */}
      <div className="flex flex-col items-center gap-0.5">
        <span className="flex items-center gap-1 font-body text-xs tabular-nums text-grey-1">
          {csIconSrc && (
            <img src={csIconSrc} alt="" aria-hidden="true" width={12} height={12} className="opacity-70" />
          )}
          {player.cs}
        </span>
        <span className="flex items-center gap-1 font-body text-xs tabular-nums text-gold-2">
          {goldIconSrc && (
            <img src={goldIconSrc} alt="" aria-hidden="true" width={12} height={12} />
          )}
          {formatGold(player.gold)}
        </span>
      </div>

      {/* Item build */}
      <ItemBuild player={player} />

      {/* Mastery banner + score meter */}
      <ScoreMeter player={player} side={side} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Portrait — champion square + frame + level badge (+ leaver glyph)
// ---------------------------------------------------------------------------

interface PortraitProps {
  player: ScoreboardPlayer;
  championFrameSrc?: string;
  leaverIconSrc?: string;
}

function Portrait({ player, championFrameSrc, leaverIconSrc }: PortraitProps) {
  return (
    <div className="relative shrink-0" style={{ width: 42, height: 42 }}>
      <img
        src={player.championIconSrc}
        alt={player.championName}
        width={42}
        height={42}
        className="h-full w-full object-cover"
      />
      {/* Gold portrait frame overlay */}
      {championFrameSrc ? (
        <img
          src={championFrameSrc}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-fill"
        />
      ) : (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 border border-gold-4"
        />
      )}
      {/* Level badge */}
      <span
        aria-hidden="true"
        className="absolute -bottom-1 -left-1 flex h-4 min-w-4 items-center justify-center rounded-full border border-gold-5 bg-hextech-black px-1 font-body text-[9px] tabular-nums text-gold-cream leading-none"
      >
        {player.champLevel}
      </span>
      {/* Leaver glyph */}
      {player.isLeaver && leaverIconSrc && (
        <img
          src={leaverIconSrc}
          alt="Left game"
          title="Left game"
          width={16}
          height={16}
          className="absolute -right-1 -top-1"
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ItemBuild — six item slots + trinket
// ---------------------------------------------------------------------------

function ItemBuild({ player }: { player: ScoreboardPlayer }) {
  const slots = Array.from({ length: 6 }, (_, i) => player.itemIconSrcs[i] ?? null);

  return (
    <div className="flex items-center justify-center gap-1">
      {slots.map((src, i) => (
        <div
          key={i}
          className="flex items-center justify-center overflow-hidden border border-blue-8 bg-blue-8"
          style={{ width: 22, height: 22 }}
        >
          {src && (
            <img src={src} alt="" aria-hidden="true" width={22} height={22} className="object-cover" />
          )}
        </div>
      ))}
      {/* Trinket slot — visually separated */}
      <div
        className="ml-0.5 flex items-center justify-center overflow-hidden rounded-full border border-blue-8 bg-blue-8"
        style={{ width: 22, height: 22 }}
      >
        {player.trinketIconSrc && (
          <img
            src={player.trinketIconSrc}
            alt=""
            aria-hidden="true"
            width={22}
            height={22}
            className="object-cover"
          />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ScoreMeter — mastery banner behind a 0–100 fill meter
// ---------------------------------------------------------------------------

function ScoreMeter({ player, side }: { player: ScoreboardPlayer; side: TeamSide }) {
  const tint = SIDE_TINT[side];
  const pct = Math.max(0, Math.min(100, player.score));

  return (
    <div className="flex items-center gap-2">
      {/* Mastery banner pennant */}
      <img
        src={player.masteryBannerSrc}
        alt={player.masteryLevel > 0 ? `Mastery ${player.masteryLevel}` : "No mastery"}
        width={22}
        height={30}
        className="shrink-0 object-contain"
      />
      {/* Score meter track + fill */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="h-1.5 w-full overflow-hidden rounded-full border border-gold-5 bg-blue-8">
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(to right, ${tint.accent}, var(--color-gold-3))`,
            }}
          />
        </div>
        <span className="font-body text-[9px] tabular-nums text-grey-2 leading-none">
          {pct} pts
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ObjectivesStrip — dragons / baron / herald / towers / inhibitors
// ---------------------------------------------------------------------------

interface ObjectivesStripProps {
  ally: TeamObjectives;
  enemy: TeamObjectives;
  allySide: TeamSide;
  enemySide: TeamSide;
  icons: ObjectiveIconMap;
}

const OBJECTIVE_ROWS: {
  key: Exclude<keyof ObjectiveIconMap, "drakes">;
  label: string;
  field: keyof Omit<TeamObjectives, "dragonKinds">;
}[] = [
  { key: "baron", label: "Baron", field: "barons" },
  { key: "dragon", label: "Dragons", field: "dragons" },
  { key: "herald", label: "Herald", field: "heralds" },
  { key: "tower", label: "Towers", field: "towers" },
  { key: "inhibitor", label: "Inhibitors", field: "inhibitors" },
];

function ObjectivesStrip({ ally, enemy, allySide, enemySide, icons }: ObjectivesStripProps) {
  const allyTint = SIDE_TINT[allySide];
  const enemyTint = SIDE_TINT[enemySide];

  return (
    <div className="flex items-stretch justify-center gap-6 border-y border-gold-5 bg-blue-8/70 px-6 py-3">
      {OBJECTIVE_ROWS.map((row) => {
        const allyCount = ally[row.field];
        const enemyCount = enemy[row.field];
        // Tint the shared icon toward whichever side leads (ally on ties).
        const leadSide = enemyCount > allyCount ? enemySide : allySide;

        // Dragons row: when either team named its drakes, show the SPECIFIC
        // elemental drake icons (per side tint) instead of the generic dragon.
        const isDragon = row.key === "dragon";
        const allyDrakes = isDragon ? ally.dragonKinds ?? [] : [];
        const enemyDrakes = isDragon ? enemy.dragonKinds ?? [] : [];
        const showDrakes = allyDrakes.length > 0 || enemyDrakes.length > 0;

        return (
          <div key={row.key} className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <span
                className="w-6 text-right font-display text-lg tabular-nums leading-none"
                style={{ color: allyTint.accent }}
              >
                {allyCount}
              </span>
              {showDrakes ? (
                <div className="flex items-center gap-1">
                  <DrakeRow kinds={allyDrakes} side={allySide} icons={icons} />
                  {/* A team with drakes but no named kinds falls back to the
                      generic drake; a team with zero drakes shows nothing. */}
                  {allyDrakes.length === 0 && allyCount > 0 && (
                    <img
                      src={icons.dragon[allySide]}
                      alt={row.label}
                      width={22}
                      height={22}
                      className="object-contain"
                    />
                  )}
                  <DrakeRow kinds={enemyDrakes} side={enemySide} icons={icons} />
                  {enemyDrakes.length === 0 && enemyCount > 0 && (
                    <img
                      src={icons.dragon[enemySide]}
                      alt={row.label}
                      width={22}
                      height={22}
                      className="object-contain"
                    />
                  )}
                </div>
              ) : (
                <img
                  src={icons[row.key][leadSide]}
                  alt={row.label}
                  width={30}
                  height={30}
                  className="object-contain"
                />
              )}
              <span
                className="w-6 text-left font-display text-lg tabular-nums leading-none"
                style={{ color: enemyTint.accent }}
              >
                {enemyCount}
              </span>
            </div>
            <span className="font-body text-[9px] uppercase tracking-widest text-grey-2">
              {row.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** Renders a team's specific elemental drakes, side-tinted, in take order. */
function DrakeRow({
  kinds,
  side,
  icons,
}: {
  kinds: readonly DrakeKind[];
  side: TeamSide;
  icons: ObjectiveIconMap;
}) {
  if (kinds.length === 0) return null;
  return (
    <div className="flex items-center gap-0.5">
      {kinds.map((kind, i) => (
        <img
          key={`${kind}-${i}`}
          src={icons.drakes[kind][side]}
          alt={`${kind} drake`}
          width={24}
          height={24}
          className="object-contain"
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

/** Compact gold, e.g. 12_400 → "12.4k". */
function formatGold(gold: number): string {
  return gold >= 1000 ? `${(gold / 1000).toFixed(1)}k` : `${gold}`;
}
