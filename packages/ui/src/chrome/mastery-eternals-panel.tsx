// ---------------------------------------------------------------------------
// MasteryEternalsPanel — Profile Overview dual-column panel
//
// Renders two adjacent zones separated by a gold-5 vertical hairline:
//   Left (~63%): "HIGHEST CHAMPION MASTERY" — 3 champion columns.
//     Center column (index 1, highest mastery) is rendered visually larger
//     per the reference screenshot (Draven center ~20% larger).
//   Right (~37%): "HIGHEST ETERNALS" — 3 eternals stat columns.
//
// Era note: reference `client-profile-champion-mastery.jpg` is from the modern
// client (post-2020, shows Eternals + Honor Level 4 emblem). Per the relaxed
// era rule this is acceptable; the panel matches that design using Hextech tokens.
//
// Presentational: props in, no data fetching. All image URLs supplied by caller.
// Fixture types imported from @low/fixtures (never duplicated here).
// ---------------------------------------------------------------------------

import type { ChampionMasteryEntry, EternalEntry } from "@low/fixtures";

export interface MasteryEternalsPanelProps {
  /**
   * Top 3 champion mastery entries in descending point order.
   * Index 1 is the center (highest) and rendered larger.
   * Pass an empty array or fewer entries to show placeholder crests.
   */
  masteryEntries: ChampionMasteryEntry[];
  /**
   * Top 3 eternals entries to display in the right panel.
   * Pass an empty array to show the "No Eternals earned" empty state.
   */
  eternalEntries: EternalEntry[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Format a mastery point total with comma separators, e.g. 412105 → "412,105". */
function formatPoints(n: number): string {
  return n.toLocaleString("en-US");
}

// ---------------------------------------------------------------------------
// MasteryCrestColumn — one champion column in the left panel
// ---------------------------------------------------------------------------

interface MasteryCrestColumnProps {
  entry: ChampionMasteryEntry;
  /** When true, renders at ~20% larger size (the center / highest column). */
  isCenter: boolean;
}

function MasteryCrestColumn({ entry, isCenter }: MasteryCrestColumnProps) {
  const crestSize = isCenter ? 96 : 80;

  return (
    <div className="flex flex-1 flex-col items-center gap-2 px-3 py-4">
      {/* Mastery crest image */}
      <img
        src={entry.masteryCrestSrc}
        alt={`Mastery level ${entry.masteryLevel} crest for ${entry.championName}`}
        width={crestSize}
        height={crestSize}
        className="object-contain"
        style={{ width: crestSize, height: crestSize }}
      />

      {/* Champion name */}
      <span className="font-display text-xs uppercase tracking-widest text-gold-cream text-center leading-tight">
        {entry.championName}
      </span>

      {/* Mastery wing icon + point total */}
      <span className="text-grey-1 text-xs text-center tabular-nums">
        {/* ψ is the mastery wing glyph used in the reference */}
        ψ {formatPoints(entry.points)} pts
      </span>

      {/* Best grade */}
      <span className="text-grey-2 text-[10px] text-center">
        Best grade: {entry.bestGrade}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// EternalColumn — one stat column in the right panel
// ---------------------------------------------------------------------------

interface EternalColumnProps {
  entry: EternalEntry;
}

function EternalColumn({ entry }: EternalColumnProps) {
  return (
    <div className="flex flex-1 flex-col items-center gap-2 px-3 py-4">
      {/* Eternals icon — champion portrait with teal ring (CDragon 3D renders
          not available at a stable public URL; portrait circle is the closest
          substitute — see demoEternalEntries divergence note in @low/fixtures). */}
      <div className="relative h-[60px] w-[60px] shrink-0">
        <div className="absolute inset-0 rounded-full ring-2 ring-blue-2/70" />
        <img
          src={entry.iconSrc}
          alt={`${entry.championId} eternals icon`}
          width={60}
          height={60}
          className="h-[60px] w-[60px] rounded-full object-cover"
        />
      </div>

      {/* Numeric stat value */}
      <span className="font-display text-2xl text-gold-cream tabular-nums leading-none">
        {entry.value.toLocaleString("en-US")}
      </span>

      {/* Stat label */}
      <span className="text-grey-2 text-xs text-center leading-tight px-1">
        {entry.name}
      </span>

      {/* Small champion icon */}
      <img
        src={entry.championIconSrc}
        alt={entry.championId}
        width={24}
        height={24}
        className="h-6 w-6 rounded-full object-cover ring-1 ring-gold-5"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// MasteryEternalsPanel
// ---------------------------------------------------------------------------

/**
 * MasteryEternalsPanel — the "HIGHEST CHAMPION MASTERY / HIGHEST ETERNALS"
 * dual-column panel on the Profile > OVERVIEW tab.
 *
 * Sits between RankedQueuePanel and TrophyShelf in the right column.
 * Two zones separated by a `border-gold-5` vertical hairline:
 *   - Left (~63%): 3 champion mastery columns; center is largest.
 *   - Right (~37%): 3 eternals stat columns; or empty-state text.
 *
 * Presentational: props in, callbacks out. No data fetching.
 * Era: modern client (post-2020) per relaxed era rule — issue #245.
 */
export function MasteryEternalsPanel({
  masteryEntries,
  eternalEntries,
}: MasteryEternalsPanelProps) {
  return (
    <div
      data-shot="mastery-eternals-panel"
      className="w-full border border-gold-5 bg-hextech-black"
    >
      <div className="flex">
        {/* ── Left: HIGHEST CHAMPION MASTERY ── */}
        <div className="flex min-w-0 flex-[63] flex-col">
          {/* Section heading */}
          <div className="border-b border-gold-5 px-4 py-2">
            <span className="font-display text-[10px] uppercase tracking-widest text-gold-cream">
              Highest Champion Mastery
            </span>
          </div>

          {/* Champion columns row */}
          <div className="flex flex-1 divide-x divide-gold-5/50">
            {masteryEntries.length === 0 ? (
              // Empty mastery state — 3 placeholder slots
              <>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex flex-1 flex-col items-center justify-center gap-2 px-3 py-6"
                  >
                    <div className="h-[80px] w-[80px] rounded-full bg-grey-3/30" />
                    <span className="text-grey-2 text-[10px]">No data</span>
                  </div>
                ))}
              </>
            ) : (
              masteryEntries.map((entry, i) => (
                <MasteryCrestColumn
                  key={entry.championId}
                  entry={entry}
                  isCenter={i === 1}
                />
              ))
            )}
          </div>
        </div>

        {/* ── Vertical divider ── */}
        <div className="w-px shrink-0 bg-gold-5" aria-hidden="true" />

        {/* ── Right: HIGHEST ETERNALS ── */}
        <div className="flex min-w-0 flex-[37] flex-col">
          {/* Section heading */}
          <div className="border-b border-gold-5 px-4 py-2">
            <span className="font-display text-[10px] uppercase tracking-widest text-gold-cream">
              Highest Eternals
            </span>
          </div>

          {/* Eternals content */}
          {eternalEntries.length === 0 ? (
            // Empty eternals state
            <div className="flex flex-1 items-center justify-center px-4 py-6">
              <span className="text-grey-2 text-xs text-center">
                No Eternals earned
              </span>
            </div>
          ) : (
            <div className="flex flex-1 divide-x divide-gold-5/50">
              {eternalEntries.map((entry, i) => (
                <EternalColumn key={`${entry.championId}-${i}`} entry={entry} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
