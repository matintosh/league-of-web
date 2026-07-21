import type { PoroVariant } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface SocialPanelEmptyStateProps {
  /**
   * Which poro mascot + copy pairing to show:
   *
   * - `"question"` → "?" poro, "Add a friend to get started" — the new-account
   *                  / no-friends empty state (default).
   * - `"sad"`      → droopy poro, "No results found" — a friend-search that
   *                  returned nothing.
   * - `"sleeping"` → dozing poro, "Loading your friends…" — an away / loading
   *                  placeholder.
   *
   * Defaults to `"question"`.
   */
  poro?: PoroVariant;
  /**
   * Resolver that converts the {@link poro} variant to an `<img>` src URL.
   * Injected by the caller (page/showcase) so this component never imports
   * fixture values directly — keeping @low/ui fixture-value-free. Wire it to
   * `poroUrl` from @low/fixtures:
   *
   *   poroSrcFor={(v) => poroUrl(v)}
   */
  poroSrcFor: (variant: PoroVariant) => string;
}

// ---------------------------------------------------------------------------
// Copy
// ---------------------------------------------------------------------------

/**
 * Faithful copy pairing for each poro variant. `heading` is the primary line;
 * `sub` is an optional smaller supporting line below it.
 */
const COPY: Record<PoroVariant, { heading: string; sub?: string }> = {
  question: {
    heading: "Add a friend to get started",
    sub: "Your friends list is looking a little lonely.",
  },
  sad: {
    heading: "No results found",
    sub: "Try a different Riot ID.",
  },
  sleeping: {
    heading: "Loading your friends…",
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * SocialPanelEmptyState — the poro empty state shown in the friends rail when
 * there is nothing to list (new account, empty search, or loading).
 *
 * A centered poro mascot (102×96 PNG from the pinned patch-7.5 friend-finder
 * set; see `poroUrl` in @low/fixtures) sits above a short copy line. The poro
 * art is dark-outlined on transparent, so it reads cleanly on the near-black
 * navy social-panel background.
 *
 * Layout: fills its flex parent (`w-full h-full`), centering its content both
 * axes. Drop it into SocialPanel's scroll area in place of the group list.
 *
 * Presentational only. No data fetching — the poro src is resolved by the
 * caller-supplied {@link SocialPanelEmptyStateProps.poroSrcFor} resolver.
 */
export function SocialPanelEmptyState({
  poro = "question",
  poroSrcFor,
}: SocialPanelEmptyStateProps) {
  const copy = COPY[poro];

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-6 text-center">
      {/* Poro mascot — intrinsic 102×96; alt kept generic so screen readers
          announce the empty state, not the specific mascot art. */}
      <img
        src={poroSrcFor(poro)}
        alt=""
        width={102}
        height={96}
        className="h-24 w-auto select-none opacity-90"
        draggable={false}
      />

      <div className="flex flex-col gap-1">
        <p className="font-display text-sm text-grey-1">{copy.heading}</p>
        {copy.sub && (
          <p className="font-body text-xs text-grey-2">{copy.sub}</p>
        )}
      </div>
    </div>
  );
}
