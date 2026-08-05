"use client";

/**
 * LauncherSocialPanel — right-side friends panel for the /launcher section.
 *
 * Floating inset rounded card (~252px wide) matching the lol-launcher-ref right
 * column. Sections:
 *   - Account header: borderless avatar + collapse arrow (no separate icon buttons)
 *   - 3-tab segmented strip: Friends / Chat / Add-Friend with red active underline + badge
 *   - Search field: full-width input with search icon
 *   - Friend groups: collapsible header (mixed-case + gold coin glyph + inline count)
 *     with Online / Offline sub-sections and presence DOTS (not avatar rings)
 *
 * Launcher-specific dark palette (--color-launcher-*). Distinct from the
 * Hextech chrome SocialPanel in src/chrome/social-panel.tsx.
 *
 * Presentational: props in / callbacks out. No data fetching. Types reused from
 * @low/fixtures (Summoner, Availability). Stateful demos live in
 * launcher-social-panel.demo.tsx.
 */

import { useId } from "react";
import type { ReactNode } from "react";
import type { Summoner, Availability } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Type exports
// ---------------------------------------------------------------------------

export interface LauncherFriendEntry {
  summoner: Summoner;
  availability: Availability;
  /** E.g. "League of Legends", "In Champ Select". */
  statusText?: string;
  /** Resolved profile icon URL (caller derives via profileIconUrl()). */
  profileIconSrc: string;
}

export interface LauncherFriendGroup {
  /** E.g. "League of Legends". */
  name: string;
  onlineFriends: LauncherFriendEntry[];
  offlineFriends: LauncherFriendEntry[];
  /** Whether the group is collapsed. */
  collapsed?: boolean;
}

/** Tab ids for the segmented strip below the account header. */
export type SocialPanelTab = "friends" | "chat" | "add";

export interface LauncherSocialPanelProps {
  /** The viewer's own account. */
  viewer: Summoner;
  viewerAvailability?: Availability;
  /** Resolved URL for the viewer's avatar. */
  viewerIconSrc: string;
  /** Friend groups (typically one per game). */
  groups: LauncherFriendGroup[];
  /** Currently active tab in the segmented strip. Defaults to "friends". */
  activeTab?: SocialPanelTab;
  onTabChange?: (tab: SocialPanelTab) => void;
  /** Badge count on the add-friend tab (0 = hidden). */
  addFriendBadge?: number;
  /** Current search query string. Controlled by caller. */
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onToggleGroup?: (name: string) => void;
  onFriendClick?: (summoner: Summoner) => void;
  /** Called when the panel collapse arrow is clicked. */
  onCollapse?: () => void;
}

// ---------------------------------------------------------------------------
// Availability → token mappings (launcher palette)
// ---------------------------------------------------------------------------

/** Presence dot fill color per availability. */
const dotColor: Record<Availability, string> = {
  online: "var(--color-status-online)",
  "in-game": "var(--color-blue-2)",
  "in-queue": "var(--color-blue-2)",
  away: "var(--color-gold-3)",
  offline: "var(--color-launcher-text-dim)",
};

/** Status text color per availability. */
const statusColor: Record<Availability, string> = {
  online: "var(--color-status-online)",
  "in-game": "var(--color-blue-2)",
  "in-queue": "var(--color-blue-2)",
  away: "var(--color-gold-3)",
  offline: "var(--color-launcher-text-dim)",
};

/** Status label when no explicit statusText is provided. */
const defaultStatusLabel: Record<Availability, string> = {
  online: "Online",
  "in-game": "In Game",
  "in-queue": "In Queue",
  away: "Away",
  offline: "Offline",
};

// ---------------------------------------------------------------------------
// Internal sub-components
// ---------------------------------------------------------------------------

/**
 * Circular borderless avatar with a small bottom-right presence DOT.
 * The dot (6px) is positioned absolutely over the avatar's bottom-right corner.
 * No ring border — matches the ref (borderless avatars, dot only).
 */
function PresenceAvatar({
  src,
  alt,
  size,
  availability,
  dim = false,
}: {
  src: string;
  alt: string;
  size: number;
  availability: Availability;
  dim?: boolean;
}) {
  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
    >
      <img
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={[
          "rounded-full object-cover",
          dim ? "brightness-50 grayscale-[0.4]" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ width: size, height: size }}
      />
      {/* Presence dot — bottom-right corner */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: dotColor[availability],
          border: "1.5px solid var(--color-launcher-panel-bg)",
        }}
      />
    </div>
  );
}

/** Single friend row inside a group section. */
function FriendRow({
  entry,
  onFriendClick,
}: {
  entry: LauncherFriendEntry;
  onFriendClick?: (summoner: Summoner) => void;
}) {
  const { summoner, availability, statusText, profileIconSrc } = entry;
  const { gameName } = summoner;
  const isOffline = availability === "offline";
  const displayStatus = statusText ?? defaultStatusLabel[availability];

  const inner = (
    <div className="flex w-full items-center gap-2 px-2 py-[6px]">
      <PresenceAvatar
        src={profileIconSrc}
        alt={gameName}
        size={28}
        availability={availability}
        dim={isOffline}
      />
      <div className="min-w-0 flex-1">
        <p
          className={`truncate font-body text-[12px] leading-tight ${isOffline ? "font-normal" : "font-bold"}`}
          style={{
            color: isOffline
              ? "var(--color-launcher-text-dim)"
              : "var(--color-launcher-text-primary)",
          }}
        >
          {gameName}
        </p>
        <p
          className="truncate font-body text-[11px] leading-tight"
          style={{ color: statusColor[availability] }}
        >
          {displayStatus}
        </p>
      </div>
    </div>
  );

  if (onFriendClick) {
    return (
      <button
        type="button"
        onClick={() => onFriendClick(summoner)}
        aria-label={`${gameName} — ${availability}`}
        className="flex w-full items-center text-left transition-colors duration-100"
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "var(--color-launcher-panel-header)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "";
        }}
      >
        {inner}
      </button>
    );
  }

  return (
    <div
      className="flex w-full items-center transition-colors duration-100"
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.backgroundColor =
          "var(--color-launcher-panel-header)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.backgroundColor = "";
      }}
    >
      {inner}
    </div>
  );
}

/**
 * Online/Offline sub-section header.
 * Mixed-case label + plain trailing count (no middot, no uppercase per ref).
 */
function SectionHeader({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center gap-1 px-2 py-1">
      <span
        className="font-body text-[11px] font-semibold"
        style={{ color: "var(--color-launcher-text-muted)" }}
      >
        {label}{" "}
        <span style={{ color: "var(--color-launcher-text-dim)" }}>{count}</span>
      </span>
    </div>
  );
}

/** Magnifier / search icon ~14px. */
function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
      <path d="M9.5 8.5l3.5 3.5-1 1-3.5-3.5A5 5 0 1 1 9.5 8.5zM6 10A4 4 0 1 0 6 2a4 4 0 0 0 0 8z" />
    </svg>
  );
}

/** Collapse arrow — single chevron pointing left; used in the panel header top-right. */
function CollapseArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Group section collapse caret — rotates when collapsed. */
function GroupCollapseArrow({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      width="10"
      height="6"
      viewBox="0 0 10 6"
      fill="currentColor"
      aria-hidden="true"
      style={{
        transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)",
        transition: "transform 0.15s ease",
      }}
    >
      <path d="M0 0 L5 6 L10 0 Z" />
    </svg>
  );
}

/** Small gold coin / game glyph for the group header leading icon. */
function CoinGlyph() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <circle cx="6" cy="6" r="5" stroke="var(--color-launcher-accent)" strokeWidth="1.25" />
      <circle cx="6" cy="6" r="2.5" fill="var(--color-launcher-accent)" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Segmented tab strip icons (friends / chat / add-friend)
// ---------------------------------------------------------------------------

/** Friends list icon ~16px. */
function FriendsTabIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M6 7a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm0 1c-2.2 0-4 1.35-4 3v1h8v-1c0-1.65-1.8-3-4-3zm6.5-1a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 1c-.6 0-1.15.13-1.63.35C11.6 8.9 12 9.9 12 11v.5h3V11c0-1.38-1.12-2.5-2.5-2.5z" />
    </svg>
  );
}

/** Chat bubble icon ~16px. */
function ChatTabIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M2 2h12v9H9.5l-3 3V11H2V2zm1 1v7h3.5v2.25L9.08 10H13V3H3z" />
    </svg>
  );
}

/** Add friend (person+) icon ~16px. */
function AddFriendTabIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M6 7a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm0 1c-2.2 0-4 1.35-4 3v1h8v-1c0-1.65-1.8-3-4-3zm7-3v2h-2V6h2zM14 8h-2V6h2v2z" />
      <path d="M13 3v6M10 6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * LauncherSocialPanel — dark friends panel for the launcher right column.
 *
 * Renders inside the `socialPanel` slot of LauncherShell (which wraps it in the
 * floating inset card with rounded corners). Full height, scrollable friend list.
 * Uses inline style for --color-launcher-* tokens.
 */
export function LauncherSocialPanel({
  viewer,
  viewerAvailability = "online",
  viewerIconSrc,
  groups,
  activeTab = "friends",
  onTabChange,
  addFriendBadge = 0,
  searchQuery = "",
  onSearchChange,
  onToggleGroup,
  onFriendClick,
  onCollapse,
}: LauncherSocialPanelProps) {
  const uid = useId();

  return (
    <div
      className="flex h-full flex-col overflow-hidden"
      style={{ backgroundColor: "var(--color-launcher-panel-bg)" }}
    >
      {/* Account header — borderless avatar + name + single collapse arrow */}
      <div
        className="flex shrink-0 items-center gap-2 px-3 py-[10px]"
        style={{
          backgroundColor: "var(--color-launcher-panel-header)",
          borderBottom: "1px solid var(--color-launcher-border)",
          minHeight: 52,
        }}
      >
        {/* Viewer avatar with presence dot (borderless) */}
        <PresenceAvatar
          src={viewerIconSrc}
          alt={viewer.gameName}
          size={32}
          availability={viewerAvailability}
        />

        {/* Name + status */}
        <div className="min-w-0 flex-1">
          <p
            className="truncate font-body text-[13px] font-bold leading-tight"
            style={{ color: "var(--color-launcher-text-primary)" }}
          >
            {viewer.gameName}
          </p>
          <p
            className="truncate font-body text-[11px] leading-tight"
            style={{ color: "var(--color-launcher-text-muted)" }}
          >
            {defaultStatusLabel[viewerAvailability]}
          </p>
        </div>

        {/* Single collapse arrow — replaces the 3 inline icon buttons */}
        <button
          type="button"
          aria-label="Collapse social panel"
          onClick={onCollapse}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded transition-colors duration-100"
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--color-launcher-text-primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--color-launcher-text-muted)";
          }}
          style={{ color: "var(--color-launcher-text-muted)" }}
        >
          <CollapseArrowIcon />
        </button>
      </div>

      {/* Segmented 3-tab strip: Friends / Chat / Add-Friend */}
      <div
        className="flex shrink-0 items-stretch"
        style={{ borderBottom: "1px solid var(--color-launcher-border)" }}
        role="tablist"
        aria-label="Social panel tabs"
      >
        {(
          [
            { id: "friends" as SocialPanelTab, label: "Friends", icon: <FriendsTabIcon />, badge: 0 },
            { id: "chat" as SocialPanelTab, label: "Chat", icon: <ChatTabIcon />, badge: 0 },
            { id: "add" as SocialPanelTab, label: "Add Friend", icon: <AddFriendTabIcon />, badge: addFriendBadge },
          ] satisfies { id: SocialPanelTab; label: string; icon: ReactNode; badge: number }[]
        ).map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`${uid}-tab-${tab.id}`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`${uid}-tabpanel`}
              type="button"
              onClick={() => onTabChange?.(tab.id)}
              className="relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2 transition-colors duration-100"
              style={{
                color: isActive
                  ? "var(--color-launcher-text-primary)"
                  : "var(--color-launcher-text-dim)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              title={tab.label}
            >
              {/* Icon with optional badge dot */}
              <span className="relative">
                {tab.icon}
                {tab.badge != null && tab.badge > 0 && (
                  <span
                    className="absolute -right-1.5 -top-1.5 flex items-center justify-center rounded-full font-body text-[9px] font-bold"
                    style={{
                      minWidth: 14,
                      height: 14,
                      padding: "0 3px",
                      backgroundColor: "var(--color-launcher-social-active)",
                      color: "var(--color-launcher-ink)",
                      lineHeight: 1,
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </span>

              {/* Active underline */}
              {isActive && (
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: "20%",
                    right: "20%",
                    height: 2,
                    backgroundColor: "var(--color-launcher-social-active)",
                    borderRadius: "2px 2px 0 0",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content panel — only friends list has content; chat/add are stubs */}
      <div
        id={`${uid}-tabpanel`}
        role="tabpanel"
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        {activeTab === "friends" ? (
          <>
            {/* Search field */}
            <div className="shrink-0 px-2 py-2">
              <div
                className="flex items-center gap-2 rounded-[4px] border px-2 py-1.5"
                style={{
                  backgroundColor: "var(--color-launcher-input-bg)",
                  borderColor: "var(--color-launcher-input-border)",
                }}
              >
                <span style={{ color: "var(--color-launcher-text-dim)" }}>
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="min-w-0 flex-1 bg-transparent font-body text-[12px] outline-none"
                  style={{ color: "var(--color-launcher-text-primary)" }}
                  aria-label="Search friends"
                />
              </div>
            </div>

            {/* Friend groups — scrollable */}
            <div className="min-h-0 flex-1 overflow-y-auto">
              {groups.map((group) => {
                const totalOnline = group.onlineFriends.length;
                const totalOffline = group.offlineFriends.length;
                const isCollapsed = group.collapsed === true;

                // Filter by search query (case-insensitive on gameName)
                const q = searchQuery.trim().toLowerCase();
                const filterFn = (e: LauncherFriendEntry) =>
                  q === "" || e.summoner.gameName.toLowerCase().includes(q);

                const visibleOnline = group.onlineFriends.filter(filterFn);
                const visibleOffline = group.offlineFriends.filter(filterFn);

                return (
                  <div key={group.name}>
                    {/* Group header — mixed-case, leading coin glyph, inline count */}
                    <button
                      type="button"
                      className="flex w-full items-center gap-1.5 px-2 py-1.5 text-left transition-colors duration-100"
                      onClick={() => onToggleGroup?.(group.name)}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                          "var(--color-launcher-panel-header)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "";
                      }}
                      aria-expanded={!isCollapsed}
                    >
                      <span style={{ color: "var(--color-launcher-text-dim)" }}>
                        <GroupCollapseArrow collapsed={isCollapsed} />
                      </span>
                      {/* Leading gold game/coin glyph */}
                      <CoinGlyph />
                      <span
                        className="flex-1 truncate font-body text-[12px] font-bold"
                        style={{ color: "var(--color-launcher-text-muted)" }}
                      >
                        {group.name}
                      </span>
                      <span
                        className="font-body text-[11px]"
                        style={{ color: "var(--color-launcher-text-dim)" }}
                      >
                        {totalOnline + totalOffline}
                      </span>
                    </button>

                    {/* Expanded content */}
                    {!isCollapsed && (
                      <div>
                        {/* Online section */}
                        {visibleOnline.length > 0 && (
                          <>
                            <SectionHeader label="Online" count={visibleOnline.length} />
                            {visibleOnline.map((entry) => (
                              <FriendRow
                                key={entry.summoner.gameName}
                                entry={entry}
                                onFriendClick={onFriendClick}
                              />
                            ))}
                          </>
                        )}

                        {/* Divider between online/offline when both are visible */}
                        {visibleOnline.length > 0 && visibleOffline.length > 0 && (
                          <div
                            className="mx-2 my-1"
                            style={{
                              height: 1,
                              backgroundColor: "var(--color-launcher-divider)",
                            }}
                            aria-hidden="true"
                          />
                        )}

                        {/* Offline section */}
                        {visibleOffline.length > 0 && (
                          <>
                            <SectionHeader label="Offline" count={visibleOffline.length} />
                            {visibleOffline.map((entry) => (
                              <FriendRow
                                key={entry.summoner.gameName}
                                entry={entry}
                                onFriendClick={onFriendClick}
                              />
                            ))}
                          </>
                        )}

                        {/* Empty state within a group */}
                        {visibleOnline.length === 0 && visibleOffline.length === 0 && (
                          <p
                            className="px-2 py-2 font-body text-[11px]"
                            style={{ color: "var(--color-launcher-text-dim)" }}
                          >
                            No friends match your search.
                          </p>
                        )}
                      </div>
                    )}

                    {/* Group separator */}
                    <div
                      style={{
                        height: 1,
                        backgroundColor: "var(--color-launcher-divider)",
                        margin: "4px 0",
                      }}
                      aria-hidden="true"
                    />
                  </div>
                );
              })}

              {/* Empty state — no groups */}
              {groups.length === 0 && (
                <p
                  className="px-4 py-6 text-center font-body text-[12px]"
                  style={{ color: "var(--color-launcher-text-dim)" }}
                >
                  No friends to show.
                </p>
              )}
            </div>
          </>
        ) : (
          /* Chat / Add-Friend stubs — content not yet built */
          <div
            className="flex flex-1 flex-col items-center justify-center"
            style={{ color: "var(--color-launcher-text-dim)" }}
          >
            <p className="font-body text-[12px]">
              {activeTab === "chat" ? "Chat" : "Add Friend"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
