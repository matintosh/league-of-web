"use client";

/**
 * LauncherClient — full client-side launcher shell with tab state.
 *
 * Assembles LauncherShell with:
 *   - windowBar: LauncherWindowBar (title + minimize/maximize/close stubs)
 *   - rail: LauncherRail (home + LoL + TFT icons; LoL active)
 *   - socialPanel: LauncherSocialPanel (viewer + two friend groups)
 *   - children: LauncherTabBar (4 tabs) + LauncherPlayButton + active tab content
 *
 * Tab state (activeTab) defaults to "overview". Overview tab renders the full
 * LauncherOverviewPage composition; Esports tab renders LauncherEsportsPage;
 * other tabs render a minimal placeholder.
 *
 * All callbacks are console stubs — this is presentational.
 *
 * Fixture data: champion splashes via championSplashUrl, profile icons via
 * profileIconUrl, all from @low/fixtures. Types from @low/fixtures; values
 * hardcoded here (app-level page).
 */

import { useState } from "react";
import {
  LauncherShell,
  LauncherWindowBar,
  LauncherRail,
  LauncherTabBar,
  LauncherPlayButton,
  LauncherSocialPanel,
  LauncherOverviewPage,
  LauncherEsportsPage,
  LauncherMerchPage,
  LauncherPatchNotesPage,
  GameLolLogo,
  GameTftLogo,
  GameValorantLogo,
  GameTwoXkoLogo,
  GameWildRiftLogo,
  GameRiotShieldLogo,
} from "@low/ui";
import type { LauncherRailItem, LauncherTab, LauncherGameMode, LauncherFriendGroup } from "@low/ui";
import { profileIconUrl, championSquareUrl } from "@low/fixtures";
import type { Summoner } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Static fixture data — values supplied at app level
// ---------------------------------------------------------------------------

/** Viewer summoner (the logged-in player). */
const VIEWER: Summoner = {
  gameName: "Matintosh",
  tagLine: "LAS",
  level: 247,
  profileIconId: 5212,
  availability: "online",
};

/** Riot fist / brand icon */
function RiotFistIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 4h10v2H7V4zm-1 3h12v1.5l1 2v4.5H5v-4.5l1-2V7zm2 6.5h8V11H8v2.5zm-2 2h12v1H6v-1zm1 2h10v1H7v-1z" />
    </svg>
  );
}

/** Home house icon */
function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 12L12 3l9 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** All-games 2×2 grid icon */
function GamesGridIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="currentColor">
      <rect x="2" y="2" width="7" height="7" rx="1" />
      <rect x="11" y="2" width="7" height="7" rx="1" />
      <rect x="2" y="11" width="7" height="7" rx="1" />
      <rect x="11" y="11" width="7" height="7" rx="1" />
    </svg>
  );
}

/**
 * Full Riot roster — 9 items matching the ref (image.png left rail).
 * Top: Riot fist, Home, All-games grid, LoL, Valorant, Wild Rift, 2XKO, TFT.
 * Bottom pinned: Riot R shield.
 *
 * Compact `variant="emblem"` at size=28 so icons fit the 64px rail slot.
 */
const RAIL_ITEMS: LauncherRailItem[] = [
  { id: "riot",       label: "Riot Games",              icon: <RiotFistIcon />,                          position: "top"    },
  { id: "home",       label: "Home",                    icon: <HomeIcon />,                              position: "top"    },
  { id: "games",      label: "All Games",               icon: <GamesGridIcon />,                         position: "top"    },
  { id: "lol",        label: "League of Legends",       icon: <GameLolLogo size={28} variant="emblem" />, position: "top"    },
  { id: "valorant",   label: "VALORANT",                icon: <GameValorantLogo size={28} variant="emblem" />, position: "top" },
  { id: "wildrift",   label: "Wild Rift",               icon: <GameWildRiftLogo size={28} variant="emblem" />, position: "top" },
  { id: "2xko",       label: "2XKO",                    icon: <GameTwoXkoLogo size={28} variant="emblem" />, position: "top"  },
  { id: "tft",        label: "Teamfight Tactics",       icon: <GameTftLogo size={28} variant="emblem" />, position: "top"    },
  { id: "riot-shield", label: "Riot",                   icon: <GameRiotShieldLogo size={28} />,          position: "bottom" },
];

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
// Coming-soon placeholder for unbuilt tabs
// ---------------------------------------------------------------------------

function ComingSoonTab({ label }: { label: string }) {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-3"
      style={{ color: "var(--color-launcher-text-muted)" }}
    >
      <p
        className="text-xs uppercase tracking-[0.3em]"
        style={{ color: "var(--color-launcher-tab-active)" }}
      >
        Coming soon
      </p>
      <h2
        className="text-2xl font-bold uppercase tracking-widest"
        style={{ color: "var(--color-launcher-text-primary)", fontFamily: "var(--font-display)" }}
      >
        {label}
      </h2>
      <p className="text-sm">This tab is not yet built.</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LauncherClient — main client shell
// ---------------------------------------------------------------------------

export function LauncherClient() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [activeRailId, setActiveRailId] = useState<string>("lol");
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [selectedModeId, setSelectedModeId] = useState<string>("lol");
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set(["Work"]));

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    console.log("[launcher] tab →", id);
  };

  const handleRailSelect = (id: string) => {
    setActiveRailId(id);
    console.log("[launcher] rail →", id);
  };

  const handlePlay = () => {
    console.log("[launcher] play clicked, mode:", selectedModeId);
    setDropdownOpen(false);
  };

  const handleToggleDropdown = () => {
    setDropdownOpen((o) => !o);
  };

  const handleSelectMode = (id: string) => {
    setSelectedModeId(id);
    setDropdownOpen(false);
    console.log("[launcher] mode selected:", id);
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
          onMinimize={() => console.log("[launcher] minimize")}
          onClose={() => console.log("[launcher] close")}
        />
      }
      rail={
        <LauncherRail
          items={RAIL_ITEMS}
          activeId={activeRailId}
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
          onFriendClick={(s) => console.log("[launcher] friend click:", s.gameName)}
          onCollapse={() => console.log("[launcher] social panel collapse")}
        />
      }
    >
      {/* Tab bar — sits at the top of the center content column */}
      <LauncherTabBar
        tabs={TABS}
        activeId={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Center content area — flex-1, fills remaining height */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {/* Active tab content */}
        {activeTab === "overview" ? (
          <LauncherOverviewPage
            carouselActiveIndex={carouselIndex}
            onCarouselSelect={(i) => {
              setCarouselIndex(i);
              console.log("[launcher] carousel →", i);
            }}
            onCta={() => console.log("[launcher] featured card CTA")}
          />
        ) : activeTab === "patch-notes" ? (
          <LauncherPatchNotesPage />
        ) : activeTab === "esports" ? (
          <LauncherEsportsPage />
        ) : activeTab === "merch" ? (
          <LauncherMerchPage />
        ) : (
          <ComingSoonTab label={activeTab} />
        )}

        {/* Play button — absolute overlay, bottom-left above the featured card,
            only shown on the overview tab to match the reference layout */}
        {activeTab === "overview" && (
          <div
            className="absolute z-20"
            style={{ bottom: 136, left: 28 }}
          >
            <LauncherPlayButton
              gameModes={GAME_MODES}
              selectedModeId={selectedModeId}
              open={dropdownOpen}
              onPlay={handlePlay}
              onToggleDropdown={handleToggleDropdown}
              onSelectMode={handleSelectMode}
            />
          </div>
        )}
      </div>
    </LauncherShell>
  );
}
