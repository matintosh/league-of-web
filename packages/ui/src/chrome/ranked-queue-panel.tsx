"use client";

// ---------------------------------------------------------------------------
// RankedQueuePanel — bordered panel with 3 ranked queue cells + Last Season
//
// Design: gold-5 hairline frame, 4 cells separated by vertical hairlines.
// Each cell: mini-crest image (real CommunityDragon SVG, supplied by the page
// via `crestSrcFor`), queue label in display-xs uppercase, rank string or
// "UNRANKED" in grey-2.
//
// Crest resolver pattern:
//   The component is fixture-value-free (CLAUDE.md rule 3).
//   The PAGE supplies a `crestSrcFor: (queueId: string) => string` resolver.
//   This keeps the real CommunityDragon URLs in the page/fixture layer where
//   they belong, while the component stays declarative.
//
// Unranked treatment:
//   When `rank` is absent (undefined), the crest img gets `opacity-30
//   grayscale` (grey-3 visual weight per reference) and the rank string is
//   "UNRANKED" in text-grey-2.
// ---------------------------------------------------------------------------

export interface RankedQueue {
  /** Stable identifier, e.g. "flex3v3", "soloduо", "flex5v5", "lastSeason". */
  id: string;
  /** Human-readable queue name (e.g. "FLEX 3V3", "SOLO/DUO"). */
  label: string;
  /**
   * Current rank string (e.g. "GOLD II"). When absent the queue is
   * considered Unranked — crest is dimmed and label reads "UNRANKED".
   */
  rank?: string;
  /**
   * Optional sub-label shown below the rank (e.g. "UNRANKED", "GOLD II").
   * If omitted, derived automatically from `rank`.
   */
  rankLabel?: string;
}

export interface RankedQueuePanelProps {
  /**
   * Ordered queue cells. Typically 4 entries:
   *   [Flex 3v3, Solo/Duo, Flex 5v5, Last Season].
   * The last entry is visually separated by an extra background tint.
   */
  queues: RankedQueue[];
  /**
   * Resolves a mini-crest image URL given a queue id.
   * Called for each queue. Must return a valid <img src> string.
   * Page-level implementation typically calls `rankedMiniCrestUrl(tier)` from
   * @low/fixtures for ranked queues and an emblem URL for Last Season.
   *
   * Example:
   *   crestSrcFor={(id) => id === "lastSeason"
   *     ? rankedEmblemUrl("Gold")
   *     : rankedMiniCrestUrl("unranked")}
   */
  crestSrcFor: (queueId: string) => string;
}

// ---------------------------------------------------------------------------
// QueueCell
// ---------------------------------------------------------------------------

interface QueueCellProps {
  queue: RankedQueue;
  crestSrc: string;
  isLast: boolean;
}

function QueueCell({ queue, crestSrc, isLast }: QueueCellProps) {
  const unranked = !queue.rank;
  const displayRank = queue.rankLabel ?? (queue.rank ?? "UNRANKED");

  return (
    <div
      className={[
        "flex flex-1 flex-col items-center justify-center gap-3 py-6 px-3",
        isLast ? "bg-white/[0.02]" : "",
      ].join(" ")}
    >
      {/* Mini-crest image */}
      <img
        src={crestSrc}
        alt={unranked ? `${queue.label} unranked crest` : `${queue.label} ${displayRank} crest`}
        width={72}
        height={72}
        className={[
          "h-[72px] w-[72px] object-contain",
          unranked ? "opacity-25 grayscale" : "opacity-90",
        ].join(" ")}
      />

      {/* Horizontal hairline separator between crest and labels */}
      <div className="w-full border-t border-gold-5 opacity-50" aria-hidden="true" />

      {/* Queue label */}
      <div className="flex flex-col items-center gap-1">
        <span className="font-display text-[11px] uppercase tracking-widest text-gold-cream">
          {queue.label}
        </span>
        <span
          className={[
            "font-display text-[10px] uppercase tracking-widest",
            unranked ? "text-grey-2" : "text-grey-1",
          ].join(" ")}
        >
          {displayRank}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// RankedQueuePanel
// ---------------------------------------------------------------------------

/**
 * RankedQueuePanel — the ranked queue summary panel on the Profile Overview
 * page. Renders 3–4 queue cells in a gold-bordered row with vertical hairline
 * separators.
 *
 * Presentational: no data fetching. Crest URLs are resolved by the caller's
 * `crestSrcFor` resolver prop, keeping real asset URLs in the page/fixture
 * layer per the component contract.
 *
 * Unranked queues are displayed with a dimmed/greyscale crest and "UNRANKED"
 * label per the reference.
 */
export function RankedQueuePanel({
  queues,
  crestSrcFor,
}: RankedQueuePanelProps) {
  return (
    <div
      data-shot="ranked-queue-panel"
      className="border border-gold-5 bg-blue-7"
    >
      <div className="flex divide-x divide-gold-5">
        {queues.map((queue, i) => (
          <QueueCell
            key={queue.id}
            queue={queue}
            crestSrc={crestSrcFor(queue.id)}
            isLast={i === queues.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
