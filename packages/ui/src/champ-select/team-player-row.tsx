import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PickState = "picking" | "locked";

export interface TeamPlayerRowProps {
  /** Pick state drives all visual treatment — ring color, portrait, label. */
  state: PickState;
  summonerName: string;
  /** Champion display name; absent while picking. */
  championName?: string;
  /** Champion square icon URL (from `championSquareUrl` in @low/fixtures); shown when locked. */
  portraitSrc?: string;
  /**
   * Tuple of two summoner-spell image URLs, top to bottom.
   * Each renders as a 28×28 square with a 1px grey-3 border.
   */
  spellSrcs?: [string, string];
  /**
   * When true the local player: champion name renders in gold-2,
   * summoner name in gold-cream instead of grey-2.
   */
  isSelf?: boolean;
}

// ---------------------------------------------------------------------------
// Style maps — exhaustive Record<PickState, …> (no ternary chains)
// ---------------------------------------------------------------------------

/** Ring color around the 56px portrait circle. */
const RING_COLOR: Record<PickState, string> = {
  picking: "ring-blue-2",
  locked: "ring-gold-3",
};

/** Extra animation on the ring while picking. */
const RING_ANIMATION: Record<PickState, string> = {
  picking: "animate-pulse",
  locked: "",
};

/** Portrait background while picking (empty / dark). */
const PORTRAIT_BG: Record<PickState, string> = {
  picking: "bg-grey-4",
  locked: "",
};

/** Champion name / "Picking..." label color. */
const CHAMP_LABEL_COLOR: Record<PickState, (isSelf: boolean) => string> = {
  picking: () => "text-grey-1",
  locked: (isSelf) => (isSelf ? "text-gold-2" : "text-grey-1"),
};

// ---------------------------------------------------------------------------
// TeamPlayerRow
// ---------------------------------------------------------------------------

/**
 * TeamPlayerRow — one row in the champ-select team rail.
 *
 * Layout (left → right): two stacked summoner-spell squares · 56px circular
 * champion portrait with state ring · text block (champion name / summoner name).
 *
 * State ring: picking = teal (blue-2) pulsing ring + dark empty portrait;
 * locked = gold-3 ring + champion icon fills the portrait.
 *
 * Presentational only — no handlers, no 'use client'.
 */
export function TeamPlayerRow({
  state,
  summonerName,
  championName,
  portraitSrc,
  spellSrcs,
  isSelf = false,
}: TeamPlayerRowProps): ReactNode {
  const champLabel = championName ?? "Picking...";
  const champColor = CHAMP_LABEL_COLOR[state](isSelf);
  const summonerColor = isSelf ? "text-gold-cream" : "text-grey-2";

  return (
    <div className="flex items-center gap-2 px-1 py-1.5">
      {/* Summoner-spell squares — two 28×28 images stacked vertically */}
      <div className="flex flex-col gap-0.5 shrink-0">
        {spellSrcs ? (
          spellSrcs.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 border border-grey-3 object-cover"
            />
          ))
        ) : (
          <>
            <div className="h-7 w-7 border border-grey-3 bg-grey-4" />
            <div className="h-7 w-7 border border-grey-3 bg-grey-4" />
          </>
        )}
      </div>

      {/* Champion portrait — 56px circle with state ring */}
      <div
        className={[
          "relative h-14 w-14 shrink-0 rounded-full",
          "ring-2",
          RING_COLOR[state],
          RING_ANIMATION[state],
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {state === "locked" && portraitSrc ? (
          <img
            src={portraitSrc}
            alt={championName ?? ""}
            width={56}
            height={56}
            className="h-14 w-14 rounded-full object-cover"
          />
        ) : (
          <div className={["h-14 w-14 rounded-full", PORTRAIT_BG[state]].join(" ")} />
        )}
      </div>

      {/* Text block */}
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className={["truncate text-sm font-body leading-tight", champColor].join(" ")}>
          {champLabel}
        </span>
        <span className={["truncate text-xs font-body leading-tight", summonerColor].join(" ")}>
          {summonerName}
        </span>
      </div>
    </div>
  );
}
