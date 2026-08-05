"use client";

/**
 * /launcher/lol — assembled LoL launcher shell route.
 *
 * Renders the full 3-column LoL launcher: window bar + left rail (LoL active) +
 * center content (4 tabs) + right social panel. Default tab: Overview. Tab
 * switching is client-side state. Rail items link to /launcher/home (Home),
 * /launcher/lol (LoL — active), /launcher/games (Games).
 *
 * This is the primary launcher surface: /launcher redirects here so the iconic
 * LoL overview screen is the landing page. Fixture data supplied here (no fetch
 * in @low/ui).
 *
 * Closes #718. #720 is covered by LauncherOverviewPage's default play button.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LauncherShell,
  LauncherWindowBar,
  LauncherRail,
  LauncherTabBar,
  LauncherSocialPanel,
  LauncherOverviewPage,
  LauncherEsportsPage,
  LauncherMerchPage,
  LauncherPatchNotesPage,
  GameLolLogo,
  GameTftLogo,
} from "@low/ui";
import type { LauncherRailItem, LauncherTab, LauncherGameMode, LauncherFriendGroup } from "@low/ui";
import { profileIconUrl } from "@low/fixtures";
import type { Summoner } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Static fixture data — values supplied at app (page) level, types from @low/fixtures
// ---------------------------------------------------------------------------

/** Viewer summoner (the logged-in player). */
const VIEWER: Summoner = {
  gameName: "Matintosh",
  tagLine: "LAS",
  level: 247,
  profileIconId: 5212,
  availability: "online",
};

/** Home icon SVG for the rail. */
function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="currentColor">
      <path d="M10 2L2 9h2v9h5v-5h2v5h5V9h2L10 2z" />
    </svg>
  );
}

/** Games grid icon for the rail. */
function GamesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="currentColor">
      <rect x="2" y="2" width="7" height="7" rx="1" />
      <rect x="11" y="2" width="7" height="7" rx="1" />
      <rect x="2" y="11" width="7" height="7" rx="1" />
      <rect x="11" y="11" width="7" height="7" rx="1" />
    </svg>
  );
}

/** LoL rail icon — compact crest + wordmark from the launcher game-logos set. */
function LolIcon() {
  return <GameLolLogo size={28} />;
}

/** TFT rail icon — "TFT" acronym + subtitle from the launcher game-logos set. */
function TftIcon() {
  return <GameTftLogo size={28} />;
}

/** Rail items for the LoL launcher left column. */
const RAIL_ITEMS: LauncherRailItem[] = [
  {
    id: "home",
    label: "Home",
    icon: <HomeIcon />,
    position: "top",
  },
  {
    id: "lol",
    label: "League of Legends",
    icon: <LolIcon />,
    position: "top",
  },
  {
    id: "tft",
    label: "Teamfight Tactics",
    icon: <TftIcon />,
    position: "top",
  },
  {
    id: "games",
    label: "All Games",
    icon: <GamesIcon />,
    position: "bottom",
  },
];

/** Rail id → route path mapping for cross-surface navigation. */
const RAIL_ROUTES: Record<string, string> = {
  home: "/launcher/home",
  lol: "/launcher/lol",
  games: "/launcher/games",
};

/** Tab bar definitions — Overview is default. */
const TABS: LauncherTab[] = [
  { id: "overview", label: "Overview" },
  { id: "patch-notes", label: "Patch Notes" },
  { id: "esports", label: "Esports" },
  { id: "merch", label: "Merch" },
];

/** Game modes for the play button dropdown. */
const GAME_MODES: LauncherGameMode[] = [
  { id: "lol", label: "League of Legends" },
  { id: "lol-pbe", label: "League of Legends", isPbe: true },
];

/** Friend groups — two groups matching real launcher layout. */
const FRIEND_GROUPS: LauncherFriendGroup[] = [
  {
    name: "League of Legends",
    onlineFriends: [
      {
        summoner: {
          gameName: "Faker",
          tagLine: "KR1",
          level: 812,
          profileIconId: 6402,
          availability: "in-game",
        },
        availability: "in-game",
        statusText: "League of Legends",
        profileIconSrc: profileIconUrl(6402),
      },
      {
        summoner: {
          gameName: "Tyler1",
          tagLine: "NA1",
          level: 623,
          profileIconId: 4368,
          availability: "in-queue",
        },
        availability: "in-queue",
        statusText: "Ranked Solo/Duo",
        profileIconSrc: profileIconUrl(4368),
      },
      {
        summoner: {
          gameName: "Doublelift",
          tagLine: "NA1",
          level: 445,
          profileIconId: 29,
          availability: "online",
        },
        availability: "online",
        statusText: "In the lobby",
        profileIconSrc: profileIconUrl(29),
      },
      {
        summoner: {
          gameName: "Baus",
          tagLine: "EUW",
          level: 590,
          profileIconId: 5205,
          availability: "away",
        },
        availability: "away",
        profileIconSrc: profileIconUrl(5205),
      },
    ],
    offlineFriends: [
      {
        summoner: {
          gameName: "Sneaky",
          tagLine: "NA1",
          level: 301,
          profileIconId: 1,
          availability: "offline",
        },
        availability: "offline",
        profileIconSrc: profileIconUrl(1),
      },
    ],
  },
  {
    name: "Work",
    onlineFriends: [
      {
        summoner: {
          gameName: "RiotAugust",
          tagLine: "NA1",
          level: 520,
          profileIconId: 4294,
          availability: "in-game",
        },
        availability: "in-game",
        statusText: "League of Legends",
        profileIconSrc: profileIconUrl(4294),
      },
    ],
    offlineFriends: [
      {
        summoner: {
          gameName: "Phreak",
          tagLine: "NA1",
          level: 431,
          profileIconId: 743,
          availability: "offline",
        },
        availability: "offline",
        profileIconSrc: profileIconUrl(743),
      },
      {
        summoner: {
          gameName: "RiotMeddler",
          tagLine: "NA1",
          level: 388,
          profileIconId: 3,
          availability: "away",
        },
        availability: "offline",
        profileIconSrc: profileIconUrl(3),
      },
    ],
    collapsed: true,
  },
];

// ---------------------------------------------------------------------------
// Page component — client shell with tab + play button state
// ---------------------------------------------------------------------------

export default function LauncherLolPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<string>("overview");
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [selectedModeId, setSelectedModeId] = useState<string>("lol");
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set(["Work"]));

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    // Close play button dropdown when switching tabs
    if (dropdownOpen) setDropdownOpen(false);
  };

  const handleRailSelect = (id: string) => {
    const route = RAIL_ROUTES[id];
    if (route) {
      router.push(route);
    }
  };

  const handlePlay = () => {
    console.log("[lol] play clicked, mode:", selectedModeId);
    setDropdownOpen(false);
  };

  const handleToggleDropdown = () => {
    setDropdownOpen((o) => !o);
  };

  const handleSelectMode = (id: string) => {
    setSelectedModeId(id);
    setDropdownOpen(false);
  };

  const handleToggleGroup = (name: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  // Merge collapsed state into the groups array
  const groupsWithState: LauncherFriendGroup[] = FRIEND_GROUPS.map((g) => ({
    ...g,
    collapsed: collapsedGroups.has(g.name),
  }));

  return (
    <LauncherShell
      windowBar={
        <LauncherWindowBar
          onMinimize={() => console.log("[lol] minimize")}
          onMaximize={() => console.log("[lol] maximize")}
          onClose={() => console.log("[lol] close")}
        />
      }
      rail={
        <LauncherRail
          items={RAIL_ITEMS}
          activeId="lol"
          onSelect={handleRailSelect}
        />
      }
      socialPanel={
        <LauncherSocialPanel
          viewer={VIEWER}
          viewerAvailability="online"
          viewerIconSrc={profileIconUrl(VIEWER.profileIconId)}
          groups={groupsWithState}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleGroup={handleToggleGroup}
          onFriendClick={(s) => console.log("[lol] friend click:", s.gameName)}
          onHeaderAction={(a) => console.log("[lol] header action:", a)}
        />
      }
    >
      {/* Tab bar — 40px strip at the top of the center content column */}
      <LauncherTabBar
        tabs={TABS}
        activeId={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Center content area — flex-1, fills remaining height below the tab bar */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {activeTab === "overview" ? (
          <LauncherOverviewPage
            carouselActiveIndex={carouselIndex}
            onCarouselSelect={(i) => setCarouselIndex(i)}
            onCta={() => console.log("[lol] featured card CTA")}
            gameModes={GAME_MODES}
            playButtonOpen={dropdownOpen}
            selectedModeId={selectedModeId}
            onPlay={handlePlay}
            onToggleDropdown={handleToggleDropdown}
            onSelectMode={handleSelectMode}
          />
        ) : activeTab === "patch-notes" ? (
          <LauncherPatchNotesPage />
        ) : activeTab === "esports" ? (
          <LauncherEsportsPage />
        ) : activeTab === "merch" ? (
          <LauncherMerchPage />
        ) : null}
      </div>
    </LauncherShell>
  );
}
