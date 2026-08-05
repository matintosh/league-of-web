"use client";

/**
 * Stateful interactive demo for LauncherSocialPanel.
 * Lives in a separate client component so the showcase file stays server-safe.
 */

import { useState } from "react";
import { profileIconUrl } from "@low/fixtures";
import { LauncherSocialPanel } from "./launcher-social-panel";
import type { LauncherFriendEntry, LauncherFriendGroup } from "./launcher-social-panel";

const VIEWER = {
  gameName: "matintosh",
  tagLine: "LAS",
  level: 247,
  profileIconId: 5212,
  availability: "online" as const,
};

const ONLINE_FRIENDS: LauncherFriendEntry[] = [
  {
    summoner: { gameName: "Faker", tagLine: "KR1", level: 812, profileIconId: 6402, availability: "in-game" },
    availability: "in-game",
    statusText: "League of Legends",
    profileIconSrc: profileIconUrl(6402),
  },
  {
    summoner: { gameName: "Tyler1", tagLine: "NA1", level: 623, profileIconId: 4368, availability: "in-queue" },
    availability: "in-queue",
    statusText: "Ranked Solo/Duo",
    profileIconSrc: profileIconUrl(4368),
  },
  {
    summoner: { gameName: "Baus", tagLine: "EUW", level: 590, profileIconId: 5205, availability: "away" },
    availability: "away",
    profileIconSrc: profileIconUrl(5205),
  },
  {
    summoner: { gameName: "Doublelift", tagLine: "NA1", level: 445, profileIconId: 29, availability: "online" },
    availability: "online",
    statusText: "In the lobby",
    profileIconSrc: profileIconUrl(29),
  },
];

const OFFLINE_FRIENDS: LauncherFriendEntry[] = [
  {
    summoner: { gameName: "Sneaky", tagLine: "NA1", level: 301, profileIconId: 1, availability: "offline" },
    availability: "offline",
    profileIconSrc: profileIconUrl(1),
  },
  {
    summoner: { gameName: "Phreak", tagLine: "NA1", level: 431, profileIconId: 743, availability: "offline" },
    availability: "offline",
    profileIconSrc: profileIconUrl(743),
  },
];

const INITIAL_GROUPS: LauncherFriendGroup[] = [
  {
    name: "League of Legends",
    onlineFriends: ONLINE_FRIENDS,
    offlineFriends: OFFLINE_FRIENDS,
    collapsed: false,
  },
];

/** Interactive demo: manages search query and group collapsed state internally. */
export function LauncherSocialPanelDemo() {
  const [searchQuery, setSearchQuery] = useState("");
  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [lastAction, setLastAction] = useState<string | null>(null);

  function handleToggleGroup(name: string) {
    setGroups((prev) =>
      prev.map((g) =>
        g.name === name ? { ...g, collapsed: !g.collapsed } : g
      )
    );
  }

  function handleFriendClick(summoner: { gameName: string }) {
    setLastAction(`Clicked: ${summoner.gameName}`);
  }

  return (
    <div className="flex flex-col gap-2">
      <LauncherSocialPanel
        viewer={VIEWER}
        viewerAvailability="online"
        viewerIconSrc={profileIconUrl(VIEWER.profileIconId)}
        groups={groups}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onToggleGroup={handleToggleGroup}
        onFriendClick={handleFriendClick}
        onCollapse={() => setLastAction("Collapsed panel")}
      />
      {lastAction != null && (
        <p
          className="px-1 font-body text-[11px]"
          style={{ color: "var(--color-launcher-text-muted)" }}
        >
          {lastAction}
        </p>
      )}
    </div>
  );
}
