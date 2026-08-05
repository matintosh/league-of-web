/**
 * Showcase for LauncherSocialPanel — server-safe (no 'use client').
 * Stateful / interactive demo lives in launcher-social-panel.demo.tsx.
 */

import type { ShowcaseEntry } from "../showcase";
import { profileIconUrl } from "@low/fixtures";
import { LauncherSocialPanel } from "./launcher-social-panel";
import type { LauncherFriendEntry, LauncherFriendGroup } from "./launcher-social-panel";
import { LauncherSocialPanelDemo } from "./launcher-social-panel.demo";

// ---------------------------------------------------------------------------
// Fixture data (resolved URLs supplied by this showcase file, not the component)
// ---------------------------------------------------------------------------

const VIEWER = {
  gameName: "matintosh",
  tagLine: "LAS",
  level: 247,
  profileIconId: 5212,
  availability: "online" as const,
};

const onlineFriends: LauncherFriendEntry[] = [
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

const offlineFriends: LauncherFriendEntry[] = [
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

const LOL_GROUP: LauncherFriendGroup = {
  name: "League of Legends",
  onlineFriends,
  offlineFriends,
};

const COLLAPSED_GROUP: LauncherFriendGroup = {
  ...LOL_GROUP,
  collapsed: true,
};

// ---------------------------------------------------------------------------
// Showcase entry
// ---------------------------------------------------------------------------

export const launcherSocialPanelShowcase: ShowcaseEntry = {
  slug: "launcher-social-panel",
  name: "LauncherSocialPanel",
  area: "launcher",
  referenceImage: "launcher-social-panel-crop.png",
  referenceNote: "Real launcher — right social/friends panel (cropped from Overview): account header, search field, friend list grouped by game with presence rings",
  description:
    "Launcher right-column friends panel: account header with presence avatar + icon buttons, search field, collapsible game group with Online/Offline sub-sections, and friend rows with presence rings. Uses --color-launcher-* dark tokens. Distinct from the Hextech chrome SocialPanel.",
  variants: [
    {
      name: "Full panel — expanded group",
      notes:
        "280px panel at full height. Account header (matintosh / Online), search field, League of Legends group expanded with 4 online + 2 offline friends. All availability states visible.",
      render: () => (
        <div style={{ width: 280, height: 520 }}>
          <LauncherSocialPanel
            viewer={VIEWER}
            viewerAvailability="online"
            viewerIconSrc={profileIconUrl(VIEWER.profileIconId)}
            groups={[LOL_GROUP]}
          />
        </div>
      ),
    },
    {
      name: "Group collapsed",
      notes: "collapsed=true on the group — only the group header row is shown, list hidden.",
      render: () => (
        <div style={{ width: 280, height: 180 }}>
          <LauncherSocialPanel
            viewer={VIEWER}
            viewerAvailability="online"
            viewerIconSrc={profileIconUrl(VIEWER.profileIconId)}
            groups={[COLLAPSED_GROUP]}
          />
        </div>
      ),
    },
    {
      name: "Viewer — away",
      notes: "Viewer presence ring shows gold (away state).",
      render: () => (
        <div style={{ width: 280, height: 200 }}>
          <LauncherSocialPanel
            viewer={{ ...VIEWER, availability: "away" }}
            viewerAvailability="away"
            viewerIconSrc={profileIconUrl(VIEWER.profileIconId)}
            groups={[{ name: "League of Legends", onlineFriends: [], offlineFriends }]}
          />
        </div>
      ),
    },
    {
      name: "Empty panel",
      notes: "No groups provided — shows empty state message.",
      render: () => (
        <div style={{ width: 280, height: 180 }}>
          <LauncherSocialPanel
            viewer={VIEWER}
            viewerAvailability="online"
            viewerIconSrc={profileIconUrl(VIEWER.profileIconId)}
            groups={[]}
          />
        </div>
      ),
    },
    {
      name: "Interactive demo",
      notes: "Fully interactive — search filters friend names; click group header to collapse/expand.",
      render: () => (
        <div style={{ width: 280, height: 520 }}>
          <LauncherSocialPanelDemo />
        </div>
      ),
    },
  ],
};
