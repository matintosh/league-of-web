"use client";

import type { PoroVariant, Summoner } from "@low/fixtures";
import { AmbientVideoLayer } from "./ambient-video-layer";
import { FriendGroupHeader } from "./friend-group-header";
import { FriendRequestsRow } from "./friend-requests-row";
import { FriendRow } from "./friend-row";
import { SocialHeader, type SocialAction } from "./social-header";
import { SocialPanelEmptyState } from "./social-panel-empty-state";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface FriendEntry {
  /** The summoner to display. */
  summoner: Summoner;
  /**
   * Optional status line text below the name (e.g. "League of Legends",
   * "Ranked Solo/Duo"). Forwarded verbatim to FriendRow.
   */
  statusText?: string;
}

export interface FriendGroup {
  /** Human-readable group name, e.g. "General", "Work". */
  name: string;
  /** Members in this group. */
  friends: FriendEntry[];
  /**
   * Whether the group's friend list is currently hidden.
   * Controlled by the caller via `onToggleGroup`.
   */
  collapsed?: boolean;
}

export interface SocialPanelProps {
  /** Ordered list of friend groups to render. */
  groups: FriendGroup[];
  /**
   * Number of pending friend requests shown in the FriendRequestsRow badge.
   *
   * - `undefined` → row is hidden entirely.
   * - `0`         → row is also hidden (real client hides the row when the
   *                 queue is empty; showing "0" would be confusing noise).
   * - `>0`        → row is visible with the badge count.
   *
   * Use `requestCount != null && requestCount > 0` to gate visibility.
   */
  requestCount?: number;
  /**
   * Called when the user clicks a group header to collapse or expand it.
   * Receives the group `name` so the caller can flip `collapsed` in its state.
   */
  onToggleGroup?: (name: string) => void;
  /**
   * Called when the user clicks a friend row. Receives the summoner.
   */
  onFriendClick?: (summoner: Summoner) => void;
  /**
   * Resolver that converts a summoner to a profile-icon `<img>` src URL.
   * Injected by the caller so that the panel never imports fixture values
   * directly — keeping @low/ui fixture-value-free.
   *
   * Example (in a page or showcase):
   *   profileIconSrcFor={(s) => profileIconUrl(s.profileIconId)}
   */
  profileIconSrcFor: (s: Summoner) => string;
  /**
   * Panel width in pixels.
   *
   * Defaults to `224` — PIL-measured from the current-era reference
   * (docs/reference/client-current-home-activity-center.jpg, 1280×720): the
   * rail spans x=1056→1280 = 224px. The "slim" feel of the modern rail comes
   * from thin friend rows (48px pitch, 28px avatars) and a near-black bg, not
   * from a narrow column — the width itself is close to the older 250px.
   */
  width?: number;
  /**
   * Optional ambient "magic" loop webm shown subtly behind the friends list —
   * the client's animated social backdrop (supply `socialPanelBgLoopUrl()` from
   * @low/fixtures). Additive: when omitted the flat near-black navy panel is
   * unchanged. The loop is opaque (bright Hextech glow on near-black), so it
   * composites screen-blended — the dark field drops out and only the glow adds.
   * Hidden under `prefers-reduced-motion`.
   */
  ambientVideoSrc?: string;
  /**
   * Called when a SocialHeader icon action fires — `"add" | "groups" | "list"
   * | "search"`. The current-era rail carries a magnifying-glass **search**
   * glyph in this header (confirmed in the committed reference capture, per
   * ICON-SOURCES.md #388). The affordance is presentational: leave this
   * undefined for a visual-only no-op, or wire it to open a friend-search
   * field. No search UI is owned by this component.
   */
  onHeaderAction?: (action: SocialAction) => void;
  /**
   * Called when the SocialHeader's collapse chevron is clicked (issue #401).
   * When provided, the header renders a leading « affordance that folds the
   * rail-collapse toggle into the SOCIAL row (the reference has no beside-chip
   * toggle). Omit it and no chevron renders. The matching EXPAND affordance,
   * shown when the rail is collapsed and this whole panel is unmounted, is
   * owned by the shell at the window edge.
   */
  onToggleCollapse?: () => void;
  /**
   * Optional pass-through URL for the SocialHeader "add friend" MASK glyph
   * (issue #434, threaded live in #444). Supply
   * `friendFinderImageUrl("add_person_mask")` from `@low/fixtures` at the
   * page/showcase level — forwarded verbatim to {@link SocialHeader}'s
   * `addIconSrc`. Omit it and the header falls back to its hand-drawn SVG.
   */
  addIconSrc?: string;
  /**
   * Optional pass-through URL for the SocialHeader "groups" MASK glyph (issue
   * #440, threaded live in #444). Supply `socialMaskUrl("add_folder_mask")` —
   * forwarded verbatim to {@link SocialHeader}'s `groupsIconSrc`.
   */
  groupsIconSrc?: string;
  /**
   * Optional pass-through URL for the SocialHeader "list" (sort) MASK glyph
   * (issue #440, threaded live in #444). Supply `socialMaskUrl("sort_mask")` —
   * forwarded verbatim to {@link SocialHeader}'s `listIconSrc`.
   */
  listIconSrc?: string;
  /**
   * Optional pass-through URL for the SocialHeader "search" MASK glyph (issue
   * #440, threaded live in #444). Supply `socialMaskUrl("search_mask")` —
   * forwarded verbatim to {@link SocialHeader}'s `searchIconSrc`.
   */
  searchIconSrc?: string;
  /**
   * Which poro mascot the empty state shows when `groups` is empty (issue
   * #433). Defaults to `"question"` (the new-account "add a friend" poro). Set
   * `"sad"` when an empty `groups` array is the result of a search that
   * returned nothing, or `"sleeping"` for a loading placeholder.
   *
   * The empty state only renders when {@link poroSrcFor} is also supplied —
   * without a resolver the scroll area is left empty (prior behaviour).
   */
  emptyStatePoro?: PoroVariant;
  /**
   * Resolver that converts the {@link emptyStatePoro} variant to an `<img>`
   * src URL. Injected by the caller so the panel never imports fixture values
   * directly — keeping @low/ui fixture-value-free. Wire it to `poroUrl` from
   * @low/fixtures:
   *
   *   poroSrcFor={(v) => poroUrl(v)}
   *
   * Required for the empty state to render; omit it to keep the legacy
   * empty-scroll-area behaviour.
   */
  poroSrcFor?: (variant: PoroVariant) => string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns true when the summoner is considered "online" for the purposes of
 * the group count — i.e. availability is anything except "offline".
 */
function isOnline(summoner: Summoner): boolean {
  return summoner.availability !== "offline";
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * SocialPanel — friends-list sidebar composition.
 *
 * Composes (top → bottom):
 *   1. SocialHeader — "SOCIAL" label + icon actions
 *   2. FriendRequestsRow — only when `requestCount` is a positive number
 *   3. Per-group sections: FriendGroupHeader + FriendRow list
 *      (rows hidden when group.collapsed === true)
 *
 * Width: 224px (current-era measured). Background: near-black navy
 * (color-mix blue-7 22% over hextech-black ≈ rgb(3,10,18), sampled from the
 * current-era reference). The friend list area is independently scrollable via
 * a min-h-0 flex chain.
 *
 * Controlled collapse: the panel reads `group.collapsed` and calls
 * `onToggleGroup?.(name)` — it owns no internal group state.
 *
 * Presentational only. No data fetching. Place fixture values in pages/showcase.
 */
export function SocialPanel({
  groups,
  requestCount,
  onToggleGroup,
  onFriendClick,
  profileIconSrcFor,
  width = 224,
  ambientVideoSrc,
  onHeaderAction,
  onToggleCollapse,
  addIconSrc,
  groupsIconSrc,
  listIconSrc,
  searchIconSrc,
  emptyStatePoro = "question",
  poroSrcFor,
}: SocialPanelProps) {
  const showRequests = requestCount != null && requestCount > 0;
  const showEmptyState = groups.length === 0 && poroSrcFor != null;

  return (
    <div
      // 1px white/50% LEFT hairline — the vertical divider separating the rail
      // from the main content, matching the home rail's right border (#529).
      // border-box (Tailwind default) keeps the border inside `width`, so the
      // 224px total is unchanged (only the inner content loses 1px).
      className="relative flex h-full flex-col overflow-hidden border-l border-white/50 bg-[color-mix(in_srgb,var(--color-blue-7)_22%,var(--color-hextech-black))]"
      style={{ width }}
    >
      {/* Ambient "magic" backdrop — subtle animated Hextech loop behind the
          friends list. Opaque loop → screen-blended so only the glow adds over
          bg-blue-7; hidden under reduced-motion. */}
      <AmbientVideoLayer src={ambientVideoSrc} opacity={0.35} />

      {/* ── 1. Social header strip ── */}
      <div className="relative z-10">
        <SocialHeader
          onAction={onHeaderAction}
          onToggleCollapse={onToggleCollapse}
          addIconSrc={addIconSrc}
          groupsIconSrc={groupsIconSrc}
          listIconSrc={listIconSrc}
          searchIconSrc={searchIconSrc}
        />
      </div>

      {/* ── 2. Friend requests row (hidden when count is 0 or undefined) ── */}
      {showRequests && (
        <div className="relative z-10">
          <FriendRequestsRow count={requestCount!} />
        </div>
      )}

      {/* ── 3. Friend groups — scrollable (or the poro empty state) ── */}
      {/* scrollbar-hextech: thin gold overlay scrollbar (#516). */}
      <div className="scrollbar-hextech relative z-10 min-h-0 flex-1 overflow-y-auto">
        {showEmptyState && (
          <SocialPanelEmptyState poro={emptyStatePoro} poroSrcFor={poroSrcFor} />
        )}
        {!showEmptyState &&
          groups.map((group) => {
          const online = group.friends.filter((f) => isOnline(f.summoner)).length;
          const total = group.friends.length;

          return (
            <div key={group.name}>
              <FriendGroupHeader
                name={group.name}
                online={online}
                total={total}
                collapsed={group.collapsed ?? false}
                onToggle={() => onToggleGroup?.(group.name)}
              />

              {/* Friend rows — hidden when collapsed */}
              {!group.collapsed &&
                group.friends.map((entry) => (
                  <FriendRow
                    key={entry.summoner.gameName}
                    summoner={entry.summoner}
                    statusText={entry.statusText}
                    profileIconSrc={profileIconSrcFor(entry.summoner)}
                    onClick={
                      onFriendClick
                        ? () => onFriendClick(entry.summoner)
                        : undefined
                    }
                  />
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
