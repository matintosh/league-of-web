"use client";

import type { Summoner } from "@low/fixtures";
import { AmbientVideoLayer } from "./ambient-video-layer";
import { FriendGroupHeader } from "./friend-group-header";
import { FriendRequestsRow } from "./friend-requests-row";
import { FriendRow } from "./friend-row";
import { SocialHeader } from "./social-header";

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
   * Defaults to `250` for back-compat with the original overlay implementation.
   * Pass a smaller value (e.g. `200`) when the panel is docked as an in-flow
   * column so the content area has enough room at 1280×720.
   *
   * Measured from the real client pvp-mode-select reference: rail ≈ 15–16% of
   * the 1280px window ≈ 192–205px. Recommended docked value: 200.
   */
  width?: number;
  /**
   * Optional ambient "magic" loop webm shown subtly behind the friends list —
   * the client's animated social backdrop (supply `socialPanelBgLoopUrl()` from
   * @low/fixtures). Additive: when omitted the flat `bg-blue-7` panel is
   * unchanged. The loop is opaque (bright Hextech glow on near-black), so it
   * composites screen-blended — the dark field drops out and only the glow adds.
   * Hidden under `prefers-reduced-motion`.
   */
  ambientVideoSrc?: string;
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
 * Width: ~250px (w-[250px]). Background: bg-blue-7 (near-black slate used by
 * the real LoL client sidebar — sampled from reference screenshot).
 * The friend list area is independently scrollable via a min-h-0 flex chain.
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
  width = 250,
  ambientVideoSrc,
}: SocialPanelProps) {
  const showRequests = requestCount != null && requestCount > 0;

  return (
    <div
      className="relative flex h-full flex-col overflow-hidden bg-blue-7"
      style={{ width }}
    >
      {/* Ambient "magic" backdrop — subtle animated Hextech loop behind the
          friends list. Opaque loop → screen-blended so only the glow adds over
          bg-blue-7; hidden under reduced-motion. */}
      <AmbientVideoLayer src={ambientVideoSrc} opacity={0.35} />

      {/* ── 1. Social header strip ── */}
      <div className="relative z-10">
        <SocialHeader />
      </div>

      {/* ── 2. Friend requests row (hidden when count is 0 or undefined) ── */}
      {showRequests && (
        <div className="relative z-10">
          <FriendRequestsRow count={requestCount!} />
        </div>
      )}

      {/* ── 3. Friend groups — scrollable ── */}
      <div className="relative z-10 min-h-0 flex-1 overflow-y-auto">
        {groups.map((group) => {
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
