"use client";

import { useState } from "react";
import type { Summoner } from "@low/fixtures";
import { profileIconUrl, socialPanelBgLoopUrl } from "@low/fixtures";
import type { FriendGroup } from "./social-panel";
import { SocialPanel } from "./social-panel";

// ---------------------------------------------------------------------------
// Shared resolver — lives in the demo/client layer so the panel never imports
// fixture values directly.
// ---------------------------------------------------------------------------

function iconSrc(s: Summoner): string {
  return profileIconUrl(s.profileIconId);
}

// ---------------------------------------------------------------------------
// Fixture groups shared across demos
// ---------------------------------------------------------------------------

const FULL_REPLICA_GROUPS: FriendGroup[] = [
  {
    name: "General",
    collapsed: false,
    friends: [
      {
        summoner: {
          gameName: "Faker",
          tagLine: "KR1",
          level: 812,
          profileIconId: 6402,
          availability: "in-game",
        },
        statusText: "League of Legends",
      },
      {
        summoner: {
          gameName: "Tyler1",
          tagLine: "NA1",
          level: 623,
          profileIconId: 4368,
          availability: "in-queue",
        },
        statusText: "Ranked Solo/Duo",
      },
      {
        summoner: {
          gameName: "Baus",
          tagLine: "EUW",
          level: 590,
          profileIconId: 5205,
          availability: "away",
        },
      },
      {
        summoner: {
          gameName: "Doublelift",
          tagLine: "NA1",
          level: 455,
          profileIconId: 29,
          availability: "offline",
        },
        statusText: "Offline",
      },
    ],
  },
  {
    // Second group starts collapsed to show derived (1/2) count even when hidden
    name: "Work",
    collapsed: true,
    friends: [
      {
        summoner: {
          gameName: "Phreak",
          tagLine: "NA1",
          level: 431,
          profileIconId: 743,
          availability: "offline",
        },
        statusText: "Offline",
      },
      {
        summoner: {
          gameName: "RiotMeddler",
          tagLine: "NA1",
          level: 200,
          profileIconId: 1,
          availability: "online",
        },
        statusText: "Available",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Static replica demo (no interactivity needed — groups are already in final state)
// ---------------------------------------------------------------------------

/**
 * Full replica of the social sidebar with 2 groups (one collapsed), a requests
 * badge, and mixed availabilities. Used as the primary data-shot target.
 */
export function SocialPanelFullReplicaDemo() {
  return (
    <div data-shot="social-panel" className="h-[480px]">
      <SocialPanel
        groups={FULL_REPLICA_GROUPS}
        requestCount={2}
        profileIconSrcFor={iconSrc}
      />
    </div>
  );
}

/**
 * Full replica WITH the ambient social-panel loop wired — the real client's
 * animated Hextech backdrop, screen-blended subtly behind the friends list.
 * Hidden under prefers-reduced-motion.
 */
export function SocialPanelAmbientDemo() {
  return (
    <div data-shot="social-panel-ambient" className="h-[480px]">
      <SocialPanel
        groups={FULL_REPLICA_GROUPS}
        requestCount={2}
        profileIconSrcFor={iconSrc}
        ambientVideoSrc={socialPanelBgLoopUrl()}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty group demo
// ---------------------------------------------------------------------------

const EMPTY_GROUP: FriendGroup[] = [
  { name: "General", collapsed: false, friends: [] },
];

/**
 * Group with zero friends — header shows (0/0) and no rows appear.
 */
export function SocialPanelEmptyGroupDemo() {
  return (
    <div className="h-[200px]">
      <SocialPanel groups={EMPTY_GROUP} profileIconSrcFor={iconSrc} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// No requests demo (requestCount=0 → row hidden)
// ---------------------------------------------------------------------------

const NO_REQUESTS_GROUPS: FriendGroup[] = [
  {
    name: "Solo",
    collapsed: false,
    friends: [
      {
        summoner: {
          gameName: "Doublelift",
          tagLine: "NA1",
          level: 455,
          profileIconId: 29,
          availability: "online",
        },
        statusText: "Available",
      },
    ],
  },
];

/**
 * Panel with requestCount=0 — FriendRequestsRow is hidden entirely.
 */
export function SocialPanelNoRequestsDemo() {
  return (
    <div className="h-[200px]">
      <SocialPanel
        groups={NO_REQUESTS_GROUPS}
        requestCount={0}
        profileIconSrcFor={iconSrc}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Interactive demo — owns group collapse state and click log
// ---------------------------------------------------------------------------

const INITIAL_GROUPS: FriendGroup[] = [
  {
    name: "General",
    collapsed: false,
    friends: [
      {
        summoner: {
          gameName: "Faker",
          tagLine: "KR1",
          level: 812,
          profileIconId: 6402,
          availability: "in-game",
        },
        statusText: "League of Legends",
      },
      {
        summoner: {
          gameName: "Tyler1",
          tagLine: "NA1",
          level: 623,
          profileIconId: 4368,
          availability: "in-queue",
        },
        statusText: "Ranked Solo/Duo",
      },
      {
        summoner: {
          gameName: "Baus",
          tagLine: "EUW",
          level: 590,
          profileIconId: 5205,
          availability: "away",
        },
      },
      {
        summoner: {
          gameName: "Doublelift",
          tagLine: "NA1",
          level: 455,
          profileIconId: 29,
          availability: "offline",
        },
        statusText: "Offline",
      },
    ],
  },
  {
    name: "Work",
    collapsed: false,
    friends: [
      {
        summoner: {
          gameName: "Phreak",
          tagLine: "NA1",
          level: 431,
          profileIconId: 743,
          availability: "offline",
        },
        statusText: "Offline",
      },
      {
        summoner: {
          gameName: "RiotMeddler",
          tagLine: "NA1",
          level: 200,
          profileIconId: 1,
          availability: "online",
        },
        statusText: "Available",
      },
    ],
  },
];

/**
 * SocialPanelInteractiveDemo — interactive demo wiring group collapse state
 * and logging friend clicks. This is a 'use client' component so it can own
 * useState; the showcase file is server-safe and imports only this demo.
 */
export function SocialPanelInteractiveDemo() {
  const [groups, setGroups] = useState<FriendGroup[]>(INITIAL_GROUPS);
  const [lastClicked, setLastClicked] = useState<string | null>(null);
  const [lastHeaderAction, setLastHeaderAction] = useState<string | null>(null);

  function handleToggleGroup(name: string) {
    setGroups((prev) =>
      prev.map((g) =>
        g.name === name ? { ...g, collapsed: !g.collapsed } : g,
      ),
    );
  }

  function handleFriendClick(summoner: Summoner) {
    setLastClicked(summoner.gameName);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="h-[480px]">
        <SocialPanel
          groups={groups}
          requestCount={3}
          onToggleGroup={handleToggleGroup}
          onFriendClick={handleFriendClick}
          onHeaderAction={(action) => setLastHeaderAction(action)}
          profileIconSrcFor={iconSrc}
        />
      </div>
      <p className="font-body text-xs text-grey-2">
        {lastClicked
          ? `Last clicked: ${lastClicked}`
          : "Click a friend row to see their gameName logged here."}
      </p>
      <p className="font-body text-xs text-grey-2">
        {lastHeaderAction
          ? `Last header action: ${lastHeaderAction} (the search glyph fires "search")`
          : "Click a header glyph (add / groups / list / search) to log the action."}
      </p>
    </div>
  );
}
