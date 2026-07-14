"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CLIENT_WIDTH, CLIENT_HEIGHT } from "../lib/client-window";
import {
  WindowFrame,
  TopNavbar,
  PlayButton,
  CurrencyDisplay,
  ProfileChip,
  PartyStatusPanel,
  FindingMatchPanel,
  SettingsModal,
  SettingsRow,
  LaunchSplash,
  HextechToggle,
  NewsCard,
  HomeNewsScreen,
  SocialPanel,
  SocialDock,
  ArcadeEventTab,
  BattlePassScreen,
  JourneyTab,
  LevelUpRewardsDetail,
  TftHubScreen,
  ClashScreen,
} from "@low/ui";
import type { NavItem, SettingsSection, NewsCardProps, FriendGroup, DockButton, EventSkinCard, OrbOfEnlightenmentPanelProps, TftRankBannerProps, WeeklyMissionsPanelProps, TftBetaPassTrackProps, MissionRow, RewardItem, ClashTournament, ClashTeam, ClashPlayer, ClashScoutingTab, StoreTab } from "@low/ui";
import {
  demoSummoner,
  demoWallet,
  demoFriends,
  profileIconUrl,
  championSplashUrl,
  championSquareUrl,
  loadingArtUrl,
  rpIconUrl,
  blueEssenceIconUrl,
  navIconUrl,
  gameModeMapUrl,
  positionIconUrl,
  rankedEmblemUrl,
  demoBattlePassChapters,
  demoBattlePassLevelRewards,
  DEMO_STARTER_PACK,
  DEMO_AWAKENING_MISSIONS,
  DEMO_LEVEL_UP_REWARDS,
  DEMO_DAILY_PLAY_REWARDS,
  DEMO_LEVEL_REWARD_CARDS,
} from "@low/fixtures";
import type { ClashScoutingPlayer } from "@low/fixtures";
import type { NewsArticle } from "@low/ui";
import { BanPhaseScreen } from "./ban-phase-screen";
import { CollectionScreen } from "./collection-screen";
import { ModeSelectScreen } from "./mode-select-screen";
import { PartyLobbyScreen } from "./party-lobby-screen";
import { PickScreen } from "./pick-screen";
import { LoadoutScreen } from "./loadout-screen";
import { ProfileScreen } from "./profile-screen";
import { StoreScreen } from "./store-screen";

// "matchmaking" view has been retired (issue #174): queue state now lives
// inside PartyLobbyScreen; the shell no longer has a separate queue route.
// "ban" view added (#275): ban phase sits between ACCEPT and the pick screen.
type View = "home" | "mode-select" | "party-lobby" | "collection" | "ban" | "pick" | "loadout" | "profile" | "store" | "tft" | "competitive";

// Nav set matches the reference left→right: Home, Profile, Collection,
// Competitive (Clash — #244), Store, Teamfight Tactics.
const NAV_ITEMS: NavItem[] = [
  { id: "home",        label: "Home" },
  { id: "profile",     label: "Profile" },
  { id: "collection",  label: "Collection" },
  { id: "competitive", label: "Competitive" },
  { id: "store",       label: "Store" },
  { id: "tft",         label: "Teamfight Tactics" },
];

const KEYART_CHAMPION = "Jinx";

// ---------------------------------------------------------------------------
// TFT Hub fixtures — page-level values (no fetching in @low/ui)
// ---------------------------------------------------------------------------

const TFT_ORB: OrbOfEnlightenmentPanelProps = {
  countdownLabel: "AVAILABLE IN 21H 59M 55S",
  progress: 0.45,
  claimable: false,
  onPlay: () => console.log("tft: play"),
  onClaim: () => console.log("tft: claim"),
};

const TFT_MISSIONS: MissionRow[] = [
  { counters: [{ current: 0, total: 5 }],  description: "Play 5 games of TFT to Round 20", daysLabel: "5 days", rewardPts: 50 },
  { counters: [{ current: 0, total: 30 }, { current: 0, total: 30 }], description: "Play 30 Nobles OR Play 30 Pirates", daysLabel: "5 days", rewardPts: 50 },
  { counters: [{ current: 0, total: 1 }],  description: "Mine 20 gold in one stage", daysLabel: "5 days", rewardPts: 50 },
];

const TFT_PASS_ITEMS: RewardItem[] = [
  { id: "1", position: 1, locked: false },
  { id: "2", position: 2, locked: true },
  { id: "3", position: 3, locked: false },
  { id: "4", position: 4, locked: true },
  { id: "5", position: 5, locked: true },
  { id: "6", position: 6, locked: true },
];

// ---------------------------------------------------------------------------
// Clash fixtures — page-level values (no fetching in @low/ui) (#244)
// ---------------------------------------------------------------------------

const CLASH_TOURNAMENT: ClashTournament = {
  name: "Demacian Cup",
  week: 1,
  day: 2,
  ticketCount: 47,
  bracketSize: 8,
  rewardMultiplier: 5,
  rewardLabel: "Team Member",
};

const CLASH_TEAM: ClashTeam = {
  tag: "TTM",
  name: "Team Taco Meat",
  tier: "III",
  logoSrc: "",
};

const CLASH_PLAYERS: ClashPlayer[] = [
  {
    summonerName: demoSummoner.gameName,
    championIconSrc: profileIconUrl(demoSummoner.profileIconId),
    roleIconSrc: positionIconUrl("top"),
    status: "locked-in",
    isLocalPlayer: true,
  },
  {
    summonerName: "AlphaJungler",
    championIconSrc: profileIconUrl(1),
    roleIconSrc: positionIconUrl("jungle"),
    status: "not-locked-in",
  },
  {
    summonerName: "MidOrFeed99",
    roleIconSrc: positionIconUrl("middle"),
    status: "ticket-required",
  },
  {
    summonerName: "BotCarry",
    roleIconSrc: positionIconUrl("bottom"),
    status: "pending",
  },
  {
    summonerName: "SupportGod",
    championIconSrc: profileIconUrl(24),
    roleIconSrc: positionIconUrl("utility"),
    status: "not-locked-in",
  },
];

// ---------------------------------------------------------------------------
// Clash scouting fixtures — 5 opponent columns (page-level) (#257)
// ---------------------------------------------------------------------------

// NOTE: mirrors SCOUTING_OPPONENTS in clash-screen.demo.tsx (packages/ui demos
// cannot share app-level fixture constants; keep the two in sync by hand).
const CLASH_OPPONENTS: ClashScoutingPlayer[] = [
  {
    summonerName: "whostolebaron",
    rankLabel: "Gold IV",
    rankEmblemSrc: rankedEmblemUrl("Gold"),
    champions: [
      { iconSrc: championSquareUrl("Vayne"),     winPct: 56, games: 167, kda: 3.7 },
      { iconSrc: championSquareUrl("Jinx"),      winPct: 49, games: 127, kda: 6.7 },
      { iconSrc: championSquareUrl("Caitlyn"),   winPct: 45, games: 89,  kda: 4.6 },
      { iconSrc: championSquareUrl("Ashe"),      winPct: 56, games: 36,  kda: 4.9 },
    ],
  },
  {
    summonerName: "TwinkleToes",
    rankLabel: "Silver IV",
    rankEmblemSrc: rankedEmblemUrl("Silver"),
    champions: [
      { iconSrc: championSquareUrl("Ahri"),      winPct: 58, games: 131, kda: 5.2 },
      { iconSrc: championSquareUrl("Lux"),       winPct: 60, games: 89,  kda: 7.0 },
      { iconSrc: championSquareUrl("Orianna"),   winPct: 62, games: 43,  kda: 5.7 },
      { iconSrc: championSquareUrl("Syndra"),    winPct: 69, games: 42,  kda: 5.4 },
    ],
  },
  {
    summonerName: "TankyBits",
    rankLabel: "Silver I",
    rankEmblemSrc: rankedEmblemUrl("Silver"),
    champions: [
      { iconSrc: championSquareUrl("Malphite"),  winPct: 45, games: 733, kda: 3.6 },
      { iconSrc: championSquareUrl("Garen"),     winPct: 56, games: 91,  kda: 2.1 },
      { iconSrc: championSquareUrl("Nasus"),     winPct: 29, games: 7,   kda: 1.1 },
      { iconSrc: championSquareUrl("Sion"),      winPct: 14, games: 7,   kda: 1.7 },
    ],
  },
  {
    summonerName: "CaffeinatedGanks",
    rankLabel: "Gold III",
    rankEmblemSrc: rankedEmblemUrl("Gold"),
    champions: [
      { iconSrc: championSquareUrl("Khazix"),    winPct: 54, games: 174, kda: 2.7 },
      { iconSrc: championSquareUrl("Elise"),     winPct: 50, games: 48,  kda: 3.1 },
      { iconSrc: championSquareUrl("Rengar"),    winPct: 44, games: 36,  kda: 2.9 },
      { iconSrc: championSquareUrl("Nidalee"),   winPct: 48, games: 33,  kda: 3.7 },
    ],
  },
  {
    summonerName: "ToasterMiner",
    rankLabel: "Silver III",
    rankEmblemSrc: rankedEmblemUrl("Silver"),
    champions: [
      { iconSrc: championSquareUrl("Thresh"),    winPct: 50, games: 120, kda: 3.1 },
      { iconSrc: championSquareUrl("Leona"),     winPct: 56, games: 75,  kda: 2.3 },
      { iconSrc: championSquareUrl("Blitzcrank"),winPct: 62, games: 66,  kda: 3.2 },
      { iconSrc: championSquareUrl("Morgana"),   winPct: 57, games: 54,  kda: 4.7 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Fixture news items — 3 entries (page-level, no data fetching)
// ---------------------------------------------------------------------------
const NEWS_ITEMS: NewsCardProps[] = [
  {
    category: "GAME UPDATES",
    date: "7/10/2026",
    title: "Patch 26.14 Notes — Midseason Balance Pass",
    imageSrc: championSplashUrl("Ahri"),
    onOpen: () => console.log("open: Patch 26.14 Notes"),
  },
  {
    category: "ESPORTS",
    date: "7/8/2026",
    title: "MSI 2026: Group Stage Results and Highlights",
    imageSrc: championSplashUrl("Jinx"),
    onOpen: () => console.log("open: MSI 2026 Group Stage"),
  },
  {
    category: "EVENT",
    date: "7/5/2026",
    title: "Void Awakening Event — Missions & Rewards Now Live",
    imageSrc: championSplashUrl("Khazix"),
    onOpen: () => console.log("open: Void Awakening Event"),
  },
];

// ---------------------------------------------------------------------------
// Diagonal split constants (1280×720 viewport)
// Left panel: ~38% = 486px. Diagonal: top of art starts ~80px right of panel
// edge, bottom flush with panel edge — clip polygon on art container.
// Panel width px: Math.round(1280 * 0.38) = 486
// ---------------------------------------------------------------------------
const PANEL_WIDTH = 486; // px — ~38% of 1280
const DIAGONAL_OFFSET = 80; // px — how much the top edge is inset further right

// ---------------------------------------------------------------------------
// Social rail constants (page-level, not hardcoded hex)
// ---------------------------------------------------------------------------

/** Version string shown in the SocialDock bottom strip. */
const SOCIAL_VERSION = "V26.14";

/** Queue label for the party lobby — feeds ProfileChip statusText + PartyStatusPanel. */
const PARTY_QUEUE_LABEL = "Normal Draft";

/** Fixture estimated wait label fed to FindingMatchPanel when in queue. */
const ESTIMATED_LABEL = "Estimated: 3:00";

/**
 * Docked rail width in px.
 *
 * Measured from the real client pvp-mode-select reference (client-pvp-mode-select.jpg):
 * - Reference image is approximately 1440px wide.
 * - Rail starts at ~x=1190, ends at ~x=1440 → rail ≈ 250px on a 1440px frame.
 * - Ratio: 250/1440 ≈ 17.4% — slightly above the 15–16% spec range.
 * - At our 1280px window, 15.6% ≈ 200px (matching issue guidance and leaving
 *   ~1080px for content, which comfortably fits all railed screens).
 * - We land on 200px: content area = 1280 − 200 = 1080px.
 */
const SOCIAL_RAIL_WIDTH = 200;

// ---------------------------------------------------------------------------
// Social rail fixtures — groups built from demoFriends (page-level values)
// ---------------------------------------------------------------------------

/**
 * Builds the FriendGroup array from the flat demoFriends list.
 * Groups are ordered: General first, then Work.
 * Called once at module level; stable reference, no closures.
 */
function buildFriendGroups(): FriendGroup[] {
  const groupMap = new Map<string, FriendGroup>();
  for (const f of demoFriends) {
    if (!groupMap.has(f.groupName)) {
      groupMap.set(f.groupName, { name: f.groupName, friends: [], collapsed: false });
    }
    groupMap.get(f.groupName)!.friends.push({ summoner: f.summoner, statusText: f.statusText });
  }
  // Explicit ordering: General, then Work, then any extra groups
  const ordered: FriendGroup[] = [];
  for (const name of ["General", "Work"]) {
    const g = groupMap.get(name);
    if (g) ordered.push(g);
    groupMap.delete(name);
  }
  for (const g of groupMap.values()) ordered.push(g);
  return ordered;
}

const INITIAL_FRIEND_GROUPS: FriendGroup[] = buildFriendGroups();

// ---------------------------------------------------------------------------
// SocialDock button definitions — SVG icons as ReactNodes (page-supplied)
// ---------------------------------------------------------------------------

const DOCK_BUTTONS: DockButton[] = [
  {
    id: "chat",
    label: "Chat",
    badge: 3,
    icon: (
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 2h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H5l-4 3V3a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "group-chat",
    label: "Group chat",
    icon: (
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 3h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4l-4 3V4a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
        <path d="M13 5h3a1 1 0 0 1 1 1v6l-2-1.5H8" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "add-friend",
    label: "Add friend",
    icon: (
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="7" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.25" />
        <path d="M1 16c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        <path d="M14 8v4M12 10h4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "social-settings",
    label: "Social settings",
    icon: (
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M7.5 1h3l.45 1.8a5.6 5.6 0 0 1 1.35.79l1.8-.56 1.5 2.6-1.35 1.23c.03.37.03.74 0 1.11l1.35 1.23-1.5 2.6-1.8-.56c-.43.3-.87.56-1.35.79L10.5 14h-3l-.45-1.8a5.6 5.6 0 0 1-1.35-.79l-1.8.56-1.5-2.6 1.35-1.23a5.7 5.7 0 0 1 0-1.11L2.25 5.63l1.5-2.6 1.8.56c.43-.3.87-.56 1.35-.79L7.5 1ZM9 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" fill="currentColor" />
      </svg>
    ),
  },
];

export function ClientShell() {
  const router = useRouter();
  const [view, setView] = useState<View>("home");
  // Launch splash — Riot ident video on initial load (#300). Plain useState so
  // every hard reload is a launch; client-side navs never remount the shell,
  // so this stays true→false once per page load. The shell owns visibility;
  // LaunchSplash calls onFinished (video ended / click / Escape / reduced-motion).
  const [splashVisible, setSplashVisible] = useState(true);
  // Season-intro modal dismissal lives here (not in ProfileScreen): the
  // profile screen unmounts on main-nav switches, and "once per session"
  // must survive that (#227 review finding).
  const [seasonModalDismissed, setSeasonModalDismissed] = useState(false);
  const [activeNavId, setActiveNavId] = useState("home");
  /**
   * Active Store sub-tab — lifted here so loot nav-bar icon click can switch
   * it even when the Store screen is already mounted (fixes the stale-useState
   * initialTab bug where `useState(initialTab)` only reads the prop once).
   */
  const [activeStoreTab, setActiveStoreTab] = useState<StoreTab>("featured");
  /** DDragon champion id chosen in the pick phase; passed to LoadoutScreen. */
  const [chosenChampionId, setChosenChampionId] = useState<string | undefined>(undefined);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState("general");

  // Clash scouting phase state (#257)
  const [clashScoutingTab, setClashScoutingTab] = useState<ClashScoutingTab>("ranked");
  // Scouting phase entered via SCOUT OPPONENTS, exited via the header back button.
  const [clashScouting, setClashScouting] = useState(false);

  // Social rail state — expanded/collapsed, group collapse map.
  // Default EXPANDED per issue spec (real client keeps rail visible by default).
  const [socialExpanded, setSocialExpanded] = useState(true);
  const [friendGroups, setFriendGroups] = useState<FriendGroup[]>(INITIAL_FRIEND_GROUPS);

  // Party open/closed toggle — wired to PartyStatusPanel header when in lobby.
  // Defaults to open (true) matching the reference; toggling reflects both the
  // panel header label and the PARTY text in the TopNavbar PARTY pill.
  const [partyOpen, setPartyOpen] = useState(true);

  // Queue phase lifted from PartyLobbyScreen — drives FindingMatchPanel vs
  // PartyStatusPanel in the rail, and ProfileChip statusText while queueing.
  // "idle" means no queue; "queue" / "found" mean in-progress.
  const [queuePhase, setQueuePhase] = useState<"idle" | "queue" | "found">("idle");
  const [queueElapsedLabel, setQueueElapsedLabel] = useState<string>("0:00");

  // Stable callback passed to PartyLobbyScreen — never recreated so the
  // screen's useEffect dep on it does not re-fire unnecessarily.
  const handleQueuePhaseChange = useCallback(
    (phase: "idle" | "queue" | "found", elapsedLabel?: string) => {
      setQueuePhase(phase);
      if (elapsedLabel !== undefined) setQueueElapsedLabel(elapsedLabel);
    },
    [],
  );

  const toggleSocialPanel = () => setSocialExpanded((prev) => !prev);

  // Views that show the docked social rail alongside content.
  // ban, pick, and loadout are full-bleed (no rail) per issue spec.
  const railVisible = view !== "ban" && view !== "pick" && view !== "loadout";

  // Reset queue state when leaving the party-lobby view so rail reverts to PartyStatusPanel.
  // This runs synchronously with the view change so there's no flash.
  const handleLeaveLobby = useCallback((nextView: View) => {
    setQueuePhase("idle");
    setQueueElapsedLabel("0:00");
    setView(nextView);
  }, []);

  // Ref to PartyLobbyScreen's cancelQueue function.
  // PartyLobbyScreen registers it via onRegisterCancel. The shell calls it when
  // the FindingMatchPanel rail widget ✕ is clicked — this lets the widget cancel
  // the queue while keeping all timer cleanup inside the lobby screen.
  const lobbyCancel = useRef<(() => void) | null>(null);

  // ProfileChip statusText:
  //   idle lobby  → "1/5 Normal Draft" (filled/capacity + queue label)
  //   in queue    → "In Queue" (per issue #174)
  //   other views → undefined (ProfileChip renders availability)
  const profileChipStatusText =
    view === "party-lobby"
      ? (queuePhase !== "idle" ? "In Queue" : `1/5 ${PARTY_QUEUE_LABEL}`)
      : undefined;

  const handleToggleFriendGroup = (name: string) => {
    setFriendGroups((groups) =>
      groups.map((g) => g.name === name ? { ...g, collapsed: !g.collapsed } : g),
    );
  };

  // Dummy toggle states for Settings > General
  const [autoJoinVoice, setAutoJoinVoice] = useState(false);
  const [showEnemyEmotes, setShowEnemyEmotes] = useState(true);
  const [alwaysShowHealthBars, setAlwaysShowHealthBars] = useState(true);

  // Dummy toggle states for Settings > Sound
  const [masterMute, setMasterMute] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(true);

  const settingsSections: SettingsSection[] = [
    {
      id: "general",
      label: "General",
      content: (
        <div>
          <SettingsRow
            label="Auto-join voice channel"
            description="Automatically join the team voice channel when a game starts."
          >
            <HextechToggle
              checked={autoJoinVoice}
              onChange={setAutoJoinVoice}
              label="Auto-join voice channel"
            />
          </SettingsRow>
          <SettingsRow
            label="Show enemy emotes"
            description="Display emotes sent by opponents during the game."
          >
            <HextechToggle
              checked={showEnemyEmotes}
              onChange={setShowEnemyEmotes}
              label="Show enemy emotes"
            />
          </SettingsRow>
          <SettingsRow
            label="Always show health bars"
            description="Keep health bars visible at all times, not just on hover."
          >
            <HextechToggle
              checked={alwaysShowHealthBars}
              onChange={setAlwaysShowHealthBars}
              label="Always show health bars"
            />
          </SettingsRow>
        </div>
      ),
    },
    {
      id: "sound",
      label: "Sound",
      content: (
        <div>
          <SettingsRow label="Mute all sound" description="Silence all audio in the client.">
            <HextechToggle
              checked={masterMute}
              onChange={setMasterMute}
              label="Mute all sound"
            />
          </SettingsRow>
          <SettingsRow label="Music" description="Play background music in the client.">
            <HextechToggle
              checked={musicEnabled}
              onChange={setMusicEnabled}
              label="Music"
            />
          </SettingsRow>
          <SettingsRow
            label="Sound effects"
            description="Play UI sound effects (button clicks, notifications)."
          >
            <HextechToggle
              checked={soundEffectsEnabled}
              onChange={setSoundEffectsEnabled}
              label="Sound effects"
            />
          </SettingsRow>
        </div>
      ),
    },
    {
      id: "developer",
      label: "Developer",
      content: (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-body text-sm text-gold-1">Component Showcase</span>
            <span className="text-xs text-grey-1">
              Browse all UI components built for league-of-web.
            </span>
            <div className="mt-2">
              <Link
                href="/showcase"
                className="inline-flex items-center border border-grey-3 px-6 py-2 font-display text-sm uppercase tracking-widest text-grey-1 transition-colors duration-150 hover:border-gold-4 hover:text-gold-1"
              >
                Open Showcase
              </Link>
            </div>
          </div>
          <div className="border-t border-gold-5 pt-4 flex items-center justify-between">
            <span className="text-xs text-grey-2">league-of-web v1.0.0</span>
            {/* Sign out — navigates to /login (no real auth; portfolio discovery path) */}
            <button
              type="button"
              onClick={() => {
                setSettingsOpen(false);
                router.push("/login");
              }}
              className="font-body text-xs text-grey-2 underline transition-colors duration-150 hover:text-gold-1 cursor-pointer"
            >
              Sign out
            </button>
          </div>
        </div>
      ),
    },
  ];

  // PLAY button label + disabled state per view:
  //   home         → label "PLAY",  enabled
  //   mode-select  → label "PLAY",  disabled (greyed — choosing a mode)
  //   party-lobby  → label "PARTY", disabled (reference: greyed "PARTY" while in lobby)
  //   pick/loadout → label "PLAY",  disabled (full-bleed screens, flow locked)
  //   collection/profile → label "PLAY", disabled
  const playDisabled = view !== "home";
  const playLabel = view === "party-lobby" ? "PARTY" : undefined;

  return (
    <div
      className="overflow-hidden"
      style={{ width: CLIENT_WIDTH, height: CLIENT_HEIGHT }}
    >
      <WindowFrame
        title="League of Web"
        onHelp={() => console.log("help")}
        onMinimize={() => console.log("minimize")}
        onClose={() => console.log("close")}
      >
        <div className="flex h-full flex-col">
          <TopNavbar
            playSlot={
              // PlayButton lives permanently in the navbar (zone 1).
              // On home: enabled → click → mode-select.
              // On every other view: disabled (greyed v5 treatment).
              <PlayButton
                disabled={playDisabled}
                label={playLabel}
                emblemSrc="/lol-emblem.png"
                onClick={() => { if (!playDisabled) setView("mode-select"); }}
              />
            }
            navItems={NAV_ITEMS}
            activeId={activeNavId}
            onNavigate={(id) => {
              setActiveNavId(id);
              if (id === "collection") setView("collection");
              else if (id === "profile") setView("profile");
              else if (id === "store") { setActiveStoreTab("featured"); setView("store"); }
              else if (id === "tft") setView("tft");
              else if (id === "competitive") setView("competitive");
              else if (id === "home") setView("home");
            }}
            currencySlot={
              // Right region: icon pair (zone 3) + divider (zone 4) + stacked currency (zone 5)
              // Composed at page level so TopNavbar stays slot-agnostic.
              <div className="flex items-center gap-3">
                {/* Zone 3 — Loot + Essence icon buttons (dead, no-op).
                    Real nav icons from CommunityDragon static-assets. */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    aria-label="Loot"
                    className="flex h-7 w-7 cursor-default items-center justify-center opacity-80 transition-opacity duration-150 hover:opacity-100"
                    onClick={() => {
                      setActiveStoreTab("loot");
                      setView("store");
                      setActiveNavId("store");
                    }}
                  >
                    {/* Real nav-icon-loot.svg — hardcoded gold fills, no filter needed */}
                    <img src={navIconUrl("loot")} alt="" aria-hidden="true" width={22} height={22} />
                  </button>
                  <button
                    type="button"
                    aria-label="Essence"
                    className="flex h-7 w-7 cursor-default items-center justify-center opacity-80 transition-opacity duration-150 hover:opacity-100"
                    onClick={() => console.log("essence")}
                  >
                    {/* BE icon — no dedicated nav-icon-essence; use be-icon.png at nav size.
                        The CommunityDragon be-icon.png is the canonical blue-essence hexagon. */}
                    <img src={blueEssenceIconUrl()} alt="" aria-hidden="true" width={18} height={18} />
                  </button>
                </div>

                {/* Zone 4 — 1px vertical divider */}
                <div className="h-5 w-px bg-gold-5 shrink-0" aria-hidden="true" />

                {/* Zone 5 — stacked currency (RP on top, BE below, right-aligned).
                    Real currency icons from CommunityDragon. */}
                <CurrencyDisplay
                  wallet={demoWallet}
                  onBuyRp={() => console.log("buy rp")}
                  onBuyBe={() => console.log("buy be")}
                  stacked
                  rpIconSrc={rpIconUrl()}
                  beIconSrc={blueEssenceIconUrl()}
                />
              </div>
            }
            playerSlot={
              /* Controls slot — social-rail toggle + settings gear.
                 Identity is owned solely by the rail's ProfileChip header (#146).
                 PlayerHovercard removed here to fix the duplication (#211). */
              <div className="flex items-center gap-2">
                {/* Social toggle button — collapses/expands the docked rail.
                    aria-expanded reflects current expanded state per ARIA spec. */}
                <button
                  type="button"
                  aria-label={socialExpanded ? "Collapse social panel" : "Expand social panel"}
                  aria-expanded={socialExpanded}
                  onClick={toggleSocialPanel}
                  className={[
                    "flex h-7 w-7 cursor-pointer items-center justify-center transition-colors duration-150",
                    socialExpanded ? "text-gold-2" : "text-grey-1 hover:text-gold-1",
                  ].join(" ")}
                >
                  {/* People/social icon */}
                  <svg
                    aria-hidden="true"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.25" />
                    <path d="M1 14c0-2.761 2.239-4 5-4s5 1.239 5 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                    <circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="1.25" />
                    <path d="M12 11c1.5.3 3 1.1 3 3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                  </svg>
                </button>
                {/* Settings modal opens at z-50 — overlays the docked rail without
                    closing it (no coupling needed; z-50 > rail's in-flow z). */}
                <button
                  type="button"
                  aria-label="Settings"
                  onClick={() => setSettingsOpen(true)}
                  className="flex h-7 w-7 cursor-pointer items-center justify-center text-grey-1 transition-colors duration-150 hover:text-gold-1"
                >
                  {/* Gear icon */}
                  <svg
                    aria-hidden="true"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6.5 1h3l.4 1.6a5.1 5.1 0 0 1 1.2.7l1.6-.5 1.5 2.6-1.2 1.1c.03.33.03.67 0 1l1.2 1.1-1.5 2.6-1.6-.5c-.37.27-.77.5-1.2.7L9.5 15h-3l-.4-1.6a5.1 5.1 0 0 1-1.2-.7l-1.6.5-1.5-2.6 1.2-1.1a5.2 5.2 0 0 1 0-1L1.8 7.4l1.5-2.6 1.6.5c.37-.27.77-.5 1.2-.7L6.5 1ZM8 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>
            }
          />

          {/* Content row — flex row containing the screen (flex-1 min-w-0) and,
              on railed views, the docked social rail as a normal in-flow column.
              pick / loadout are full-bleed: rail is absent entirely on those views. */}
          <div className="flex flex-1 overflow-hidden">
            {/* Screen content — fills all available width (minus rail when present) */}
            <div className="relative flex-1 min-w-0 overflow-hidden">
              {view === "competitive" ? (
                <ClashScreen
                  tournament={CLASH_TOURNAMENT}
                  team={CLASH_TEAM}
                  players={CLASH_PLAYERS}
                  countdownLabel="15m 38s"
                  countdownSublabel="Until Scouting Starts"
                  scoutingTime="7:00 pm"
                  matchStartTime="7:07 pm"
                  onLockIn={() => console.log("clash: lock in")}
                  onLeaveTeam={() => console.log("clash: leave team")}
                  scoutingPhase={clashScouting}
                  onToggleScouting={() => setClashScouting((v) => !v)}
                  opponents={CLASH_OPPONENTS}
                  scoutingTab={clashScoutingTab}
                  onScoutingTabChange={setClashScoutingTab}
                />
              ) : view === "tft" ? (
                <TftHubScreen
                  orb={TFT_ORB}
                  rank={{
                    profileIconSrc: profileIconUrl(4217),
                    rankLabel: "UNRANKED",
                  }}
                  missions={{ missions: TFT_MISSIONS }}
                  pass={{
                    items: TFT_PASS_ITEMS,
                    currentPts: 0,
                    totalPts: 100,
                    onOpenLoot: () => console.log("tft: open loot"),
                  }}
                />
              ) : view === "store" ? (
                <StoreScreen activeTab={activeStoreTab} onTabChange={setActiveStoreTab} />
              ) : view === "profile" ? (
                <ProfileScreen
                  seasonModalDismissed={seasonModalDismissed}
                  onSeasonModalDismiss={() => setSeasonModalDismissed(true)}
                />
              ) : view === "collection" ? (
                <CollectionScreen />
              ) : view === "loadout" ? (
                <LoadoutScreen
                  chosenChampionId={chosenChampionId}
                  onComplete={() => { setView("home"); setActiveNavId("home"); }}
                />
              ) : view === "ban" ? (
                // Ban phase (#275): inserted between ACCEPT and pick.
                // Timer state lives inside BanPhaseScreen; shell transitions on complete.
                <BanPhaseScreen
                  onBanComplete={() => setView("pick")}
                />
              ) : view === "pick" ? (
                <PickScreen
                  onLockIn={(championId) => {
                    setChosenChampionId(championId);
                    setView("loadout");
                  }}
                />
              ) : view === "party-lobby" ? (
                // Queue state machine now lives inside PartyLobbyScreen (issue #174).
                // The shell receives phase changes via onQueuePhaseChange and updates
                // the rail column (FindingMatchPanel vs PartyStatusPanel) accordingly.
                <PartyLobbyScreen
                  onBack={() => handleLeaveLobby("mode-select")}
                  onAccept={() => { handleLeaveLobby("ban"); }}
                  partyOpen={partyOpen}
                  onPartyToggle={setPartyOpen}
                  onQueuePhaseChange={handleQueuePhaseChange}
                  onRegisterCancel={(fn) => { lobbyCancel.current = fn; }}
                  onChangeMode={() => handleLeaveLobby("mode-select")}
                />
              ) : view === "mode-select" ? (
                <ModeSelectScreen
                  onConfirm={() => setView("party-lobby")}
                  onBack={() => { setView("home"); setActiveNavId("home"); }}
                />
              ) : (
                <HomeView newsItems={NEWS_ITEMS} />
              )}
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* Docked social rail — in-flow right column, visible on home /      */}
            {/* mode-select / matchmaking / collection; absent on pick / loadout. */}
            {/* Width: 200px (15.6% of 1280) — measured from pvp-mode-select ref. */}
            {/* Collapse: socialExpanded=false → display:none → content reflows.  */}
            {/* ---------------------------------------------------------------- */}
            {railVisible && socialExpanded && (
              <div
                aria-label="Social panel"
                className="flex shrink-0 flex-col border-l border-gold-5"
                style={{ width: SOCIAL_RAIL_WIDTH }}
              >
                {/* Zone 6 — ProfileChip heads the rail column (above SocialPanel).
                    Width inherits from the 200px rail parent; chip is full-width. */}
                <ProfileChip
                  summoner={demoSummoner}
                  level={demoSummoner.level}
                  profileIconSrc={profileIconUrl(demoSummoner.profileIconId)}
                  onNotifications={() => console.log("notifications")}
                  statusText={profileChipStatusText}
                />

                {/* Rail widget below ProfileChip — only shown on the party-lobby view.
                    Idle: PartyStatusPanel (party info + open/closed toggle).
                    Queueing (queue|found): FindingMatchPanel (elapsed timer + ✕ cancel).
                    The shell owns which panel renders; PartyLobbyScreen notifies via
                    onQueuePhaseChange. FindingMatchPanel ✕ calls lobbyCancel.current()
                    which is the lobby screen's cancelQueue — all timer cleanup stays
                    inside the lobby screen. */}
                {view === "party-lobby" && (
                  queuePhase !== "idle" ? (
                    <FindingMatchPanel
                      elapsedLabel={queueElapsedLabel}
                      estimatedLabel={ESTIMATED_LABEL}
                      crestSrc={gameModeMapUrl("sr")}
                      onCancel={() => lobbyCancel.current?.()}
                    />
                  ) : (
                    <PartyStatusPanel
                      queueLabel={PARTY_QUEUE_LABEL}
                      crestSrc={gameModeMapUrl("sr")}
                      filled={1}
                      capacity={5}
                      open={partyOpen}
                      onToggleOpen={() => setPartyOpen((prev) => !prev)}
                    />
                  )
                )}

                {/* SocialPanel fills all height except the dock */}
                <div className="min-h-0 flex-1">
                  <SocialPanel
                    width={SOCIAL_RAIL_WIDTH}
                    groups={friendGroups}
                    requestCount={2}
                    onToggleGroup={handleToggleFriendGroup}
                    onFriendClick={(s) => console.log("friend click:", s.gameName)}
                    profileIconSrcFor={(s) => profileIconUrl(s.profileIconId)}
                  />
                </div>

                {/* SocialDock pinned at panel bottom */}
                <SocialDock
                  buttons={DOCK_BUTTONS}
                  version={SOCIAL_VERSION}
                  onAction={(id) => console.log("dock action:", id)}
                />
              </div>
            )}
          </div>
        </div>
      </WindowFrame>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        sections={settingsSections}
        activeSectionId={activeSectionId}
        onSelectSection={setActiveSectionId}
      />

      {/* Launch splash — fixed full-viewport ident video over the whole client
          on initial load. Client renders underneath so there's no pop-in after
          the fade. Shell owns visibility (#300). */}
      {splashVisible && (
        <LaunchSplash
          videoSrc="/media/riot-splash-jinx.webm"
          onFinished={() => setSplashVisible(false)}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-tab strip data — tabs under the home navbar (issue #145)
// Overview is the only live tab; others are dead (aria-disabled).
// ---------------------------------------------------------------------------

/** Tab descriptor for the home sub-nav strip. */
interface HomeTab {
  id: string;
  label: string;
  disabled?: boolean;
  /** Decorative gold dot badge (notification marker, per reference). */
  dot?: boolean;
}

const HOME_TABS: HomeTab[] = [
  { id: "overview",     label: "OVERVIEW" },
  { id: "arcade",       label: "ARCADE 2019", dot: true },
  { id: "battle-pass",  label: "BATTLE PASS", dot: true },
  { id: "journey",      label: "JOURNEY" },
  { id: "news",         label: "NEWS" },
  { id: "patch-notes",  label: "PATCH NOTES", disabled: true },
];

// ---------------------------------------------------------------------------
// Skin promo fixtures — two compact cards for the media row (issue #145)
// Using DDragon loading art (308×560 crop) for the portrait tiles.
// ---------------------------------------------------------------------------

interface SkinPromo {
  championId: string;
  skin: number;
  name: string;
  price: number;
}

const SKIN_PROMOS: SkinPromo[] = [
  { championId: "Garen",  skin: 6, name: "Demacia Vice Garen",  price: 1350 },
  { championId: "Lucian", skin: 8, name: "Demacia Vice Lucian", price: 1350 },
];

// ---------------------------------------------------------------------------
// Arcade 2019 skin fixtures — page-level values fed to ArcadeEventTab
// ---------------------------------------------------------------------------

const ARCADE_SKINS: EventSkinCard[] = [
  {
    id: "demacia-vice-garen",
    championName: "Garen",
    skinName: "Demacia Vice",
    rpPrice: 1350,
    splashUrl: loadingArtUrl("Garen", 6),
  },
  {
    id: "demacia-vice-lucian",
    championName: "Lucian",
    skinName: "Demacia Vice",
    rpPrice: 1350,
    splashUrl: loadingArtUrl("Lucian", 8),
  },
  {
    id: "battle-boss-yasuo",
    championName: "Yasuo",
    skinName: "Battle Boss",
    rpPrice: 1350,
    splashUrl: loadingArtUrl("Yasuo", 17),
  },
  {
    id: "arcade-kaisa",
    championName: "Kai'Sa",
    skinName: "Arcade",
    rpPrice: 1350,
    splashUrl: loadingArtUrl("Kaisa", 17),
  },
];

// ---------------------------------------------------------------------------
// HomeNewsScreen fixtures — page-level values (no fetching in @low/ui)
// ---------------------------------------------------------------------------

const NEWS_HERO: NewsArticle = {
  id: "euphoria-origen",
  title: "EUPHORIA | ORIGEN",
  description:
    "Drakos and Froskvinn talk to Kold and Guilhoto about Origen's latest performance.",
  category: "ESPORTS / TRIVIA",
  thumbnailUrl: championSplashUrl("Jhin"),
  externalUrl: "#",
};

const NEWS_PROMOS: NewsArticle[] = [
  {
    id: "beemo-plush",
    title: "Beemo Plush",
    thumbnailUrl: loadingArtUrl("Teemo", 8),
    externalUrl: "#",
  },
  {
    id: "eu-masters",
    title: "EU Masters returns for ESL Summer 2019",
    thumbnailUrl: championSplashUrl("Jinx"),
    externalUrl: "#",
  },
];

const NEWS_SIDE: NewsArticle[] = [
  {
    id: "play-lucian",
    title: "Play Lucian like Hans Sama",
    description:
      "Hans Sama gives us the lowdown on how best to play The Purifier.",
    thumbnailUrl: championSplashUrl("Lucian"),
    externalUrl: "#",
  },
  {
    id: "arcade-compensation",
    title: "Compensation tokens for ARCADE pass...",
    description: "A bug caused some rewards to go afk.",
    thumbnailUrl: loadingArtUrl("MissFortune", 9),
    externalUrl: "#",
  },
  {
    id: "week5-picks",
    title: "Week 5's top five picks",
    description:
      "With Week 5 done and dusted, these were the five players — and their...",
    thumbnailUrl: championSplashUrl("Yasuo"),
    externalUrl: "#",
  },
  {
    id: "excel-g2",
    title: "Excel vs G2: Nothing to lose",
    description:
      "Excel finally have their first win of the Summer Split and will be hoping to...",
    thumbnailUrl: championSplashUrl("Garen"),
    externalUrl: "#",
  },
  {
    id: "lec-mic-check",
    title: "LEC Mic Check: Week 4",
    description:
      "Listen to the comms around Caps' surprise pick in this week's #LEC Mic...",
    thumbnailUrl: championSplashUrl("Ahri"),
    externalUrl: "#",
  },
];

// ---------------------------------------------------------------------------
// HomeView — wraps the sub-tab strip + content for the home route.
// Sub-nav is a narrow bar (~32px) across the full content width.
// OVERVIEW and ARCADE 2019 are live; NEWS and PATCH NOTES remain dead.
// ---------------------------------------------------------------------------

interface HomeViewProps {
  newsItems: NewsCardProps[];
}

/** Renders the home sub-tab strip and the active sub-tab content. */
function HomeView({ newsItems }: HomeViewProps) {
  const [activeTabId, setActiveTabId] = useState<string>("overview");
  // Arcade skin selection state — lifted here so it persists across tab switches.
  const [selectedSkinId, setSelectedSkinId] = useState<string>("battle-boss-yasuo");
  // Battle Pass: selected level index (undefined = chapter overview view)
  const [battlePassLevelIdx, setBattlePassLevelIdx] = useState<number | undefined>(undefined);
  // Journey: active sub-view ("overview" | "level-rewards") and selected level (1-based)
  const [journeyView, setJourneyView] = useState<"overview" | "level-rewards">("overview");
  const [journeySelectedLevel, setJourneySelectedLevel] = useState<number>(1);

  return (
    <div className="flex h-full flex-col">
      {/* ------------------------------------------------------------------ */}
      {/* Sub-tab strip — full content width, ~32px tall (issue #145)         */}
      {/* Sits just below the TopNavbar; uses same bottom-border treatment as  */}
      {/* Profile / Collection sub-navs for visual consistency.               */}
      {/* ------------------------------------------------------------------ */}
      <div
        role="tablist"
        aria-label="Home sections"
        className="flex shrink-0 items-end border-b border-gold-5 bg-hextech-black"
        style={{ height: 32 }}
      >
        {HOME_TABS.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-disabled={tab.disabled ? true : undefined}
              disabled={tab.disabled}
              onClick={
                !tab.disabled
                  ? () => {
                      setActiveTabId(tab.id);
                      // Reset battle-pass level-detail on tab navigation so the
                      // user never gets trapped in LevelView when re-entering.
                      if (tab.id !== "battle-pass") setBattlePassLevelIdx(undefined);
                      // Reset journey sub-view and level selection on any tab click,
                      // including a re-click of JOURNEY itself (re-click = return to overview).
                      setJourneyView("overview");
                      setJourneySelectedLevel(1);
                    }
                  : undefined
              }
              className={[
                "relative flex h-full shrink-0 items-center gap-1.5 px-4",
                "font-display text-xs uppercase tracking-widest transition-colors duration-150",
                "border-b-2",
                tab.disabled
                  ? "cursor-default opacity-50"
                  : "cursor-pointer",
                isActive
                  ? "border-gold-4 text-gold-1"
                  : tab.disabled
                  ? "border-transparent text-gold-cream"
                  : "border-transparent text-gold-cream hover:text-gold-2",
              ].join(" ")}
            >
              {tab.label}
              {/* Decorative gold dot notification marker on Arcade 2019 tab */}
              {tab.dot && (
                <span
                  aria-hidden="true"
                  className="inline-block h-1.5 w-1.5 rounded-full bg-gold-3 mb-0.5"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content area — fills remaining height */}
      <div className="relative flex-1 min-h-0">
        {activeTabId === "arcade" ? (
          <ArcadeEventTab
            skins={ARCADE_SKINS}
            selectedSkinId={selectedSkinId}
            onSkinSelect={setSelectedSkinId}
            onLearnMore={() => console.log("arcade: learn more")}
            onTrailerClick={() => console.log("arcade: trailer")}
            onNewChampionClick={() => console.log("arcade: new champion")}
            newChampionSplashUrl={championSplashUrl("Qiyana")}
          />
        ) : activeTabId === "battle-pass" ? (
          <BattlePassScreen
            eventName="Welcome to Noxus: Act 2"
            endsIn="Ends in 6 weeks"
            chapters={demoBattlePassChapters}
            activeChapterIndex={3}
            currentXp={400}
            totalXp={500}
            playerLevel={30}
            selectedLevelIndex={battlePassLevelIdx}
            levelRewards={demoBattlePassLevelRewards}
            onSelectLevel={setBattlePassLevelIdx}
            onClaim={() => console.log("battle-pass: claim")}
            onPurchasePass={() => console.log("battle-pass: purchase pass")}
          />
        ) : activeTabId === "journey" && journeyView === "level-rewards" ? (
          <LevelUpRewardsDetail
            levels={DEMO_LEVEL_REWARD_CARDS}
            selectedLevel={journeySelectedLevel}
            onSelectLevel={setJourneySelectedLevel}
            onBack={() => setJourneyView("overview")}
          />
        ) : activeTabId === "journey" ? (
          <JourneyTab
            starterPack={DEMO_STARTER_PACK}
            awakeningMissions={DEMO_AWAKENING_MISSIONS}
            levelUpRewards={DEMO_LEVEL_UP_REWARDS}
            dailyPlayRewards={DEMO_DAILY_PLAY_REWARDS}
            onViewLevelRewards={() => {
              setJourneySelectedLevel(1);
              setJourneyView("level-rewards");
            }}
          />
        ) : activeTabId === "news" ? (
          <HomeNewsScreen
            heroArticle={NEWS_HERO}
            promoTiles={NEWS_PROMOS}
            sideArticles={NEWS_SIDE}
            onArticleClick={(a) => console.log("news: article click", a.id)}
            onSeeAllNews={() => console.log("news: see all")}
          />
        ) : (
          <HomeLanding newsItems={newsItems} />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// HomeLanding — diagonal-split layout per issue #37 / Figma node 50-583
//
// CTA decision (superseded by issue #139): The PlayButton now lives permanently
// in TopNavbar (enabled on home, disabled elsewhere). The home content panel
// no longer has its own PlayButton CTA.
// ---------------------------------------------------------------------------

interface HomeLandingProps {
  newsItems: NewsCardProps[];
}

function HomeLanding({ newsItems }: HomeLandingProps) {
  // Art container clip: top-left starts at PANEL_WIDTH + DIAGONAL_OFFSET px,
  // bottom-left starts at PANEL_WIDTH px. Right side is full width.
  // polygon: top-left, top-right, bottom-right, bottom-left
  const artClip = `polygon(${PANEL_WIDTH + DIAGONAL_OFFSET}px 0%, 100% 0%, 100% 100%, ${PANEL_WIDTH}px 100%)`;

  // Gold seam: 2px wide sliver along the diagonal — same clip as art but
  // shifted 2px left so it peeks out behind the art as a gold stripe.
  const seamClip = `polygon(${PANEL_WIDTH + DIAGONAL_OFFSET - 2}px 0%, ${PANEL_WIDTH + DIAGONAL_OFFSET + 2}px 0%, ${PANEL_WIDTH + 2}px 100%, ${PANEL_WIDTH - 2}px 100%)`;

  return (
    <div className="relative h-full w-full bg-hextech-black">
      {/* ------------------------------------------------------------------ */}
      {/* RIGHT — keyart with diagonal clip                                    */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="absolute inset-0"
        style={{ clipPath: artClip }}
      >
        <Image
          src={championSplashUrl(KEYART_CHAMPION)}
          alt={`${KEYART_CHAMPION} splash art`}
          fill
          priority
          className="object-cover object-center"
        />
        {/* Subtle vignette on the left edge of the art so it blends with the panel */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right, color-mix(in srgb, var(--color-hextech-black) 60%, transparent) 0%, transparent 35%)`,
          }}
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* FREE CHAMPION ROTATION chip — top-right of content area (issue #145) */}
      {/* Dead control: aria-disabled, no-op click. Hover lightens border.    */}
      {/* ------------------------------------------------------------------ */}
      <div className="absolute top-3 right-3 z-10">
        <button
          type="button"
          aria-label="Free Champion Rotation — view this week's free champions"
          aria-disabled="true"
          disabled
          className={[
            "cursor-default px-3 py-1",
            "border border-gold-5 bg-grey-4",
            "font-display text-xs uppercase tracking-widest text-gold-cream",
            "transition-colors duration-150 hover:border-gold-1",
          ].join(" ")}
        >
          Free Champion Rotation
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* MEDIA ROW — gradient scrim + mixed card row, lower-right (issue #145) */}
      {/* 1 wide NewsCard (LEC Mic Check) + 2 compact skin promo cards.       */}
      {/* Replaces the previous 3-card news feed; news items now unused here  */}
      {/* (kept in NewsItems fixture for future use / showcase reuse).        */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="absolute bottom-0 right-0 flex flex-col justify-end"
        style={{
          left: PANEL_WIDTH + DIAGONAL_OFFSET,
          paddingBottom: 20,
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        {/* Gradient scrim — upward from hextech-black */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0"
          style={{
            height: 260,
            background: `linear-gradient(to top, color-mix(in srgb, var(--color-hextech-black) 90%, transparent) 0%, color-mix(in srgb, var(--color-hextech-black) 50%, transparent) 55%, transparent 100%)`,
          }}
        />

        {/* Card row — wide NewsCard + 2 compact skin promos */}
        <div className="relative flex items-end gap-3" style={{ zIndex: 1 }}>
          {/* Wide media card: "LEC Mic Check: Week 5 ↗" — reuse NewsCard */}
          <div className="flex-[2] min-w-0">
            <NewsCard
              category="ESPORTS"
              date="7/8/2026"
              title="LEC Mic Check: Week 5 ↗"
              imageSrc={championSplashUrl("Jinx")}
              onOpen={() => console.log("open: LEC Mic Check")}
            />
          </div>

          {/* 2 compact skin promo cards — page-level markup, no new @low/ui component */}
          {SKIN_PROMOS.map((promo) => (
            <div
              key={promo.championId}
              className="shrink-0 flex flex-col bg-blue-7/60 border border-grey-4"
              style={{ width: 110 }}
            >
              {/* Loading art portrait — 308×560 source, cropped to card width */}
              <div className="relative overflow-hidden" style={{ height: 120 }}>
                <img
                  src={loadingArtUrl(promo.championId, promo.skin)}
                  alt={promo.name}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
              </div>

              {/* Price row + caption */}
              <div className="flex flex-col gap-0.5 p-2">
                {/* RP glyph + price — aria-hidden icon copy per issue guidance */}
                <div className="flex items-center gap-1">
                  {/* Inline RP glyph (aria-hidden copy — not exported from CurrencyDisplay) */}
                  <svg
                    aria-hidden="true"
                    width="12"
                    height="12"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-blue-2 shrink-0"
                  >
                    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M5 4h2.5a2 2 0 0 1 0 4H5V4Z" fill="currentColor" />
                    <line x1="5" y1="8" x2="5" y2="10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="7" y1="8" x2="9" y2="10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span className="font-body text-xs text-gold-cream tabular-nums">
                    {promo.price}
                  </span>
                </div>
                {/* Skin name caption */}
                <span className="font-body text-xs text-gold-2 leading-tight line-clamp-2">
                  {promo.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* GOLD SEAM — 2px diagonal strip between panel and art                */}
      {/* drop-shadow lives on an unclipped parent; seam itself is clipped.   */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          filter: "drop-shadow(0 0 4px var(--color-gold-3))",
        }}
      >
        <div
          className="absolute inset-0 bg-gold-3"
          style={{ clipPath: seamClip }}
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* LEFT PANEL — hextech-black, ~38% width                              */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="absolute inset-y-0 left-0 flex flex-col bg-hextech-black"
        style={{ width: PANEL_WIDTH }}
      >
        {/* Wordmark — vertically centered in the panel */}
        <div className="flex flex-1 flex-col items-start justify-center px-12">
          {/* Stacked wordmark lockup */}
          <div className="mb-8 flex flex-col gap-0">
            <span className="font-display text-5xl uppercase leading-none tracking-widest text-gold-1">
              League
            </span>
            <span className="font-display text-5xl uppercase leading-none tracking-widest text-gold-1">
              of Web
            </span>
          </div>

          {/* Thin gold divider under wordmark */}
          <div className="h-px w-32 bg-gold-4" />
          {/* PlayButton CTA removed: superseded by issue #139 — PLAY now lives
              permanently in TopNavbar (enabled on home, disabled elsewhere). */}
        </div>

        {/* Footer caption — bottom-left */}
        <div className="px-12 pb-6">
          <p className="font-body text-xs text-grey-2">
            A 1:1 web recreation of the League of Legends client.
          </p>
          <p className="font-body text-xs text-grey-2">
            {demoSummoner.gameName} — Ready to play
          </p>
        </div>
      </div>
    </div>
  );
}
