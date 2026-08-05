"use client";

/**
 * LauncherSocialPanel — right-side friends panel for the /launcher section.
 *
 * 280px dark panel matching the lol-launcher-ref right column. Sections:
 *   - Account header: avatar (with presence ring) + username + status + 3 icon buttons
 *   - Search field: full-width input with search icon
 *   - Friend groups: each group has a collapsible header + Online / Offline sub-sections
 *   - Friend rows: avatar, name, status text, presence ring — color-coded by availability
 *
 * Launcher-specific dark palette (--color-launcher-*). Distinct from the
 * Hextech chrome SocialPanel in src/chrome/social-panel.tsx.
 *
 * Presentational: props in / callbacks out. No data fetching. Types reused from
 * @low/fixtures (Summoner, Availability). Stateful demos live in
 * launcher-social-panel.demo.tsx.
 */

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

export interface LauncherSocialPanelProps {
  /** The viewer's own account. */
  viewer: Summoner;
  viewerAvailability?: Availability;
  /** Resolved URL for the viewer's avatar. */
  viewerIconSrc: string;
  /** Friend groups (typically one per game). */
  groups: LauncherFriendGroup[];
  /** Current search query string. Controlled by caller. */
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onToggleGroup?: (name: string) => void;
  onFriendClick?: (summoner: Summoner) => void;
  /** Called when clicking the header icon buttons. */
  onHeaderAction?: (action: "chat" | "social" | "settings") => void;
}

// ---------------------------------------------------------------------------
// Availability → token mappings (launcher palette)
// ---------------------------------------------------------------------------

/** Presence ring border color per availability, using existing token classes. */
const ringClass: Record<Availability, string> = {
  online: "border-status-online",
  "in-game": "border-blue-2",
  "in-queue": "border-blue-2",
  away: "border-gold-3",
  offline: "border-launcher-text-dim",
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

/** Circular avatar with a 2px presence ring. */
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
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={[
        `shrink-0 rounded-full border-2 object-cover`,
        ringClass[availability],
        dim ? "brightness-50 grayscale-[0.4]" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ width: size, height: size }}
    />
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

/** Online/Offline sub-section header row. */
function SectionHeader({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center gap-1 px-2 py-1">
      <span
        className="font-body text-[11px] uppercase tracking-[0.08em]"
        style={{ color: "var(--color-launcher-text-dim)" }}
      >
        {label} · {count}
      </span>
    </div>
  );
}

/** Inline icon button used in the account header. */
function HeaderIconButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded transition-colors duration-100"
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
      {icon}
    </button>
  );
}

// ---------------------------------------------------------------------------
// SVG icon glyphs (header actions)
// ---------------------------------------------------------------------------

/** Chat bubble outline ~16px. */
function ChatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M2 2h12v9H9.5l-3 3V11H2V2zm1 1v7h3.5v2.25L9.08 10H13V3H3z" />
    </svg>
  );
}

/** People / social icon ~16px. */
function SocialIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M6 7a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm0 1c-2.2 0-4 1.35-4 3v1h8v-1c0-1.65-1.8-3-4-3zm6.5-1a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 1c-.6 0-1.15.13-1.63.35C11.6 8.9 12 9.9 12 11v.5h3V11c0-1.38-1.12-2.5-2.5-2.5z" />
    </svg>
  );
}

/** Gear / settings icon ~16px. */
function SettingsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 5a3 3 0 1 1 0 6A3 3 0 0 1 8 5zm0 1a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM6.56 1h2.88l.44 1.76c.37.14.72.31 1.05.52l1.73-.75 2.04 2.04-.75 1.73c.21.33.38.68.52 1.05L16 7.56v2.88l-1.76.44c-.14.37-.31.72-.52 1.05l.75 1.73-2.04 2.04-1.73-.75c-.33.21-.68.38-1.05.52L9.44 17H6.56l-.44-1.76a6.07 6.07 0 0 1-1.05-.52l-1.73.75L1.3 13.43l.75-1.73a6.07 6.07 0 0 1-.52-1.05L0 10.44V7.56l1.76-.44c.14-.37.31-.72.52-1.05l-.75-1.73L3.57 2.3l1.73.75c.33-.21.68-.38 1.05-.52L6.56 1zm1.44 1H8l-.35 1.42-.48.18c-.44.16-.85.38-1.22.64l-.4.29-1.36-.59-.56.56.59 1.36-.29.4a4.97 4.97 0 0 0-.64 1.22l-.18.48L2 8v.01h1l-.35 1.42.18.48c.16.44.38.85.64 1.22l.29.4-.59 1.36.56.56 1.36-.59.4.29c.37.26.78.48 1.22.64l.48.18L7 15h1l.35-1.42.48-.18c.44-.16.85-.38 1.22-.64l.4-.29 1.36.59.56-.56-.59-1.36.29-.4c.26-.37.48-.78.64-1.22l.18-.48L14 8v-.01h-1l.35-1.42-.18-.48a4.97 4.97 0 0 0-.64-1.22l-.29-.4.59-1.36-.56-.56-1.36.59-.4-.29a4.97 4.97 0 0 0-1.22-.64l-.48-.18L8 2z" />
    </svg>
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

/** Collapse caret — rotates when collapsed. */
function CollapseArrow({ collapsed }: { collapsed: boolean }) {
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

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * LauncherSocialPanel — dark friends panel for the launcher right column.
 *
 * Renders inside the `socialPanel` slot of LauncherShell. Full height,
 * scrollable friend list. Uses inline style for --color-launcher-* tokens;
 * uses Tailwind token classes (border-status-online, border-gold-3, etc.) for
 * presence rings to keep hex out of component code.
 */
export function LauncherSocialPanel({
  viewer,
  viewerAvailability = "online",
  viewerIconSrc,
  groups,
  searchQuery = "",
  onSearchChange,
  onToggleGroup,
  onFriendClick,
  onHeaderAction,
}: LauncherSocialPanelProps) {
  return (
    <div
      className="flex h-full flex-col overflow-hidden"
      style={{
        backgroundColor: "var(--color-launcher-panel-bg)",
        borderLeft: "1px solid var(--color-launcher-border)",
      }}
    >
      {/* Account header */}
      <div
        className="flex shrink-0 items-center gap-2 px-3 py-[10px]"
        style={{
          backgroundColor: "var(--color-launcher-panel-header)",
          borderBottom: "1px solid var(--color-launcher-border)",
          minHeight: 52,
        }}
      >
        {/* Viewer avatar with presence ring */}
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

        {/* Header action icon buttons */}
        <div className="flex shrink-0 items-center">
          <HeaderIconButton
            label="Chat"
            icon={<ChatIcon />}
            onClick={() => onHeaderAction?.("chat")}
          />
          <HeaderIconButton
            label="Social"
            icon={<SocialIcon />}
            onClick={() => onHeaderAction?.("social")}
          />
          <HeaderIconButton
            label="Settings"
            icon={<SettingsIcon />}
            onClick={() => onHeaderAction?.("settings")}
          />
        </div>
      </div>

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
            style={{
              color: "var(--color-launcher-text-primary)",
              // ::placeholder styling via inline — scoped to launcher palette
            }}
            // No 'use client' — input is functional as a controlled input via props
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
              {/* Group header */}
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
                  <CollapseArrow collapsed={isCollapsed} />
                </span>
                <span
                  className="flex-1 truncate font-body text-[12px] font-bold uppercase tracking-[0.06em]"
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

        {/* Empty state — no groups or all collapsed */}
        {groups.length === 0 && (
          <p
            className="px-4 py-6 text-center font-body text-[12px]"
            style={{ color: "var(--color-launcher-text-dim)" }}
          >
            No friends to show.
          </p>
        )}
      </div>
    </div>
  );
}
