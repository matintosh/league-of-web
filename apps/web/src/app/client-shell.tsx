"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CLIENT_WIDTH, CLIENT_HEIGHT } from "../lib/client-window";
import { useSound } from "../lib/use-sound";
import {
  WindowFrame,
  TopNavbar,
  NavProductSwitcher,
  PlayButton,
  CurrencyDisplay,
  ProfileChip,
  PartyStatusPanel,
  FindingMatchPanel,
  SettingsModal,
  SettingsRow,
  LaunchSplash,
  HextechToggle,
  HomeNewsScreen,
  HomeContentRail,
  LeagueHomeScreen,
  SocialPanel,
  SocialDock,
  ArcadeEventTab,
  BattlePassScreen,
  JourneyTab,
  LevelUpRewardsDetail,
  TftHubScreen,
  ClashScreen,
  YourShopScreen,
  RpTopUpButton,
  ObjectivesModal,
  UpdatesFlyout,
} from "@low/ui";
import type { NavItem, NavProduct, SettingsSection, FriendGroup, DockButton, EventSkinCard, OrbOfEnlightenmentPanelProps, TftRankBannerProps, WeeklyMissionsPanelProps, TftBetaPassTrackProps, MissionRow, RewardItem, ClashTournament, ClashTeam, ClashPlayer, ClashScoutingTab, StoreTab, PlayButtonVideoSources, PlayButtonMedallionVideoSources, YourShopIconVideoSources, YourShopCard, UpdateNotification } from "@low/ui";
import {
  demoSummoner,
  demoWallet,
  demoFriends,
  profileIconUrl,
  championSplashUrl,
  skinUncenteredSplashUrl,
  championSquareUrl,
  loadingArtUrl,
  rpIconUrl,
  blueEssenceIconUrl,
  lorArrowUrl,
  notificationBellUrl,
  avatarBorderUrl,
  rpTopUpIconUrl,
  yourShopIconVideoUrl,
  gameModeMapUrl,
  positionIconUrl,
  rankedEmblemUrl,
  partiesBgLoopUrl,
  playButtonVideoUrl,
  buttonParticlesVideoUrl,
  leagueLogoVideoUrl,
  demoBattlePassChapters,
  demoBattlePassLevelRewards,
  DEMO_STARTER_PACK,
  DEMO_AWAKENING_MISSIONS,
  DEMO_LEVEL_UP_REWARDS,
  DEMO_DAILY_PLAY_REWARDS,
  DEMO_LEVEL_REWARD_CARDS,
  DEMO_OBJECTIVES,
  DEMO_UPDATES,
  poroUrl,
  friendFinderImageUrl,
  socialMaskUrl,
  uikitSoundUrl,
} from "@low/fixtures";
import type { ClashScoutingPlayer } from "@low/fixtures";
import type { NewsArticle, HomeContentRailItem, LeagueHomeFeatured, LeagueHomeSkin } from "@low/ui";
import { BanPhaseScreen } from "./ban-phase-screen";
import { DeclarePhaseScreen } from "./declare-phase-screen";
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
// "declare" view added (#348): declare-intent / position-assignment phase is
// the FIRST champ-select beat — ACCEPT → declare → ban.
type View = "home" | "mode-select" | "party-lobby" | "collection" | "declare" | "ban" | "pick" | "loadout" | "profile" | "store" | "tft" | "competitive";

// Screen-navigation tabs. Post-#403 the current-era product switcher owns the
// left zone (LEAGUE/TFT/LoR); the switcher's LEAGUE tab routes to home and its
// TFT tab routes to the TFT hub, so HOME and TEAMFIGHT TACTICS are dropped from
// this text row as redundant. The remaining screen-only destinations — Profile,
// Collection, Competitive (Clash — #244), Store — stay here so their routes are
// preserved (the ROUTING-PRESERVATION adjudication is binding). This compresses
// the row to fit the band between the switcher and the current-era right
// cluster; the residual tension (the reference has NO screen-nav text row in
// this band at all — screen access lives in an "activity center") is a #403
// follow-up epic, documented in the PR.
// Profile has NO nav tab (#425) — the real client opens the profile screen
// from the top-right avatar chip (ProfileChip onOpenProfile below).
const NAV_ITEMS: NavItem[] = [
  { id: "collection",  label: "Collection" },
  { id: "competitive", label: "Competitive" },
  { id: "store",       label: "Store" },
];

// Current-era left-zone product switcher (issue #403). LEAGUE = this client
// (active by default); TFT maps to our TFT hub view (the existing `tft`
// destination); LoR is a disabled gold pill — Legends of Runeterra has no
// screen in this clone, so per issue #403 it is a non-routing placeholder.
// Screen navigation (NAV_ITEMS) is UNCHANGED — the switcher is mounted as a
// distinct slot left of the screen tabs (option 2, pragmatic hybrid).
const PRODUCTS: NavProduct[] = [
  { id: "league", label: "LEAGUE" },
  { id: "tft",    label: "TFT" },
  { id: "lor",    label: "LoR", pill: true, disabled: true, external: true },
];

// v8 PLAY-button magic-layer videos (issue #309). Real client webm streamed from
// CommunityDragon via @low/fixtures — the frame state machine (146×58) and the
// league-logo medallion socket (64×54). Defined once at module scope so the URLs
// are stable across renders (each object identity is constant).
const PLAY_BUTTON_VIDEO_SOURCES: PlayButtonVideoSources = {
  enabledIntro: playButtonVideoUrl("enabled-intro"),
  hoverIntro: playButtonVideoUrl("hover-intro"),
  hoverLoop: playButtonVideoUrl("hover-loop"),
  hoverOutro: playButtonVideoUrl("hover-outro"),
  magicRelease: playButtonVideoUrl("magic-release"),
  release: playButtonVideoUrl("release"),
  particles: buttonParticlesVideoUrl("default"),
};

const LEAGUE_LOGO_VIDEO_SOURCES: PlayButtonMedallionVideoSources = {
  intro: leagueLogoVideoUrl("intro"),
  loopIdle: leagueLogoVideoUrl("loop-idle"),
  loopActive: leagueLogoVideoUrl("loop-active"),
  magic: leagueLogoVideoUrl("magic"),
};

// Your Shop navbar-icon CTA videos (issue #317/#361). Real-client webm streamed
// from CommunityDragon via @low/fixtures — the intro→loop attention state
// machine (120×120) plus the click burst. Defined once at module scope so the
// object identity is stable across renders (the icon keys its video layer on it).
const YOUR_SHOP_ICON_VIDEO_SOURCES: YourShopIconVideoSources = {
  ctaIntro: yourShopIconVideoUrl("call-to-action-intro"),
  ctaLoop: yourShopIconVideoUrl("call-to-action-loop"),
  click: yourShopIconVideoUrl("click"),
};

// Your Shop personalised offers (October 2024 era) — page-level fixture values
// (no data in @low/ui). The shell owns which cards are revealed; `revealed`,
// `onReveal`, and `onPurchase` are attached per-render from shell state below.
const YOUR_SHOP_CARDS: Omit<YourShopCard, "revealed" | "onReveal" | "onPurchase">[] = [
  { id: "offer-vi-neon-strike",      artSrc: championSplashUrl("Vi", 4),      discountPct: 20, originalRpPrice: 1350, rpPrice: 1080, skinName: "Neon Strike Vi" },
  { id: "offer-sona-arcade",         artSrc: championSplashUrl("Sona", 6),    discountPct: 50, originalRpPrice: 1350, rpPrice: 675,  skinName: "Arcade Sona" },
  { id: "offer-jinx-project",        artSrc: championSplashUrl("Jinx", 2),    discountPct: 40, originalRpPrice: 1350, rpPrice: 810,  skinName: "PROJECT: Jinx" },
  { id: "offer-nidalee-challenger",  artSrc: championSplashUrl("Nidalee", 3), discountPct: 50, originalRpPrice: 1350, rpPrice: 675,  skinName: "Challenger Nidalee" },
  { id: "offer-amumu-little-knight", artSrc: championSplashUrl("Amumu", 5),   discountPct: 60, originalRpPrice: 520,  rpPrice: 208,  skinName: "Little Knight Amumu" },
  { id: "offer-annie-goth",          artSrc: championSplashUrl("Annie", 3),   discountPct: 40, originalRpPrice: 1350, rpPrice: 810,  skinName: "Goth Annie" },
];

const YOUR_SHOP_EXPIRY = "Offers expire October 30 at 18:00 EET";


// ---------------------------------------------------------------------------
// Right nav-cluster glyphs (#463) — the 2025 reference right cluster reads as
// two groups of three split by a divider: A(hand"2", cards"10", crest) |
// B(mail•, crossed-swords, coins). No clean CommunityDragon nav asset matches
// the hand / crest / crossed-swords shapes, so per the #386 placeholder rule
// these are faithful inline token-filled glyphs (currentColor → gold via the
// parent's text-gold class). ~22px on a 24px canvas, matching the icon pitch.
// ---------------------------------------------------------------------------

/** Open hand / summon glyph — group-A slot 1 (badge "2"). */
function HandGlyph() {
  return (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gold-2">
      <path d="M8 11V5.5a1.3 1.3 0 0 1 2.6 0V10m0 0V4.2a1.3 1.3 0 0 1 2.6 0V10m0 0V5a1.3 1.3 0 0 1 2.6 0v6m0 0V7.5a1.3 1.3 0 0 1 2.6 0V14c0 3.9-2.6 6.5-6 6.5-2.2 0-3.7-.9-4.9-2.6l-2.5-3.6a1.4 1.4 0 0 1 2.1-1.8L8 14.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Stacked cards / loot glyph — group-A slot 2 (badge "10"). */
function CardsGlyph() {
  return (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gold-2">
      <rect x="4" y="8" width="9" height="12" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 6.5 15.5 4.8a1.2 1.2 0 0 1 1.45.9l2.4 10.5a1.2 1.2 0 0 1-.9 1.45L15 18.7" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

/** Crest / trophy-flame emblem — group-A slot 3 (no badge). */
function CrestGlyph() {
  return (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gold-2">
      <path d="M12 3c.9 1.6.6 2.9-.4 3.9C10.4 8 10 9.2 11 10.4c.5-.7 1-1 1-1 .3 1.2 1.2 1.6 1.2 3 0 1.3-1 2.2-2.2 2.2S8.8 13.7 8.8 12.4c0-.5.1-.9.3-1.3-1.6 1-1.8 3.1-.6 4.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 6.5V11c0 3.4 2.4 5.6 5.5 6.8 3.1-1.2 5.5-3.4 5.5-6.8V6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 18.5h5M10 20.5h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/** Satchel / mail bag — group-B slot 4 (carries a small notification dot). */
function SatchelGlyph() {
  return (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gold-2">
      <path d="M6 9h12l1 10.5a1 1 0 0 1-1 1.1H6a1 1 0 0 1-1-1.1L6 9Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M8.5 9V7.5a3.5 3.5 0 0 1 7 0V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M5.2 13.5h13.6" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

/** Crossed sword + pickaxe — group-B slot 5. */
function CrossedSwordsGlyph() {
  return (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gold-2">
      <path d="M5 5l9 9m0-9-9 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 4.5 19.5 4.5 19.5 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 14 4.5 19.5 10 19.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m14 14 5.5 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/** Stacked coins — group-B slot 6 (opens Your Shop). */
function CoinsGlyph() {
  return (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gold-2">
      <ellipse cx="12" cy="7" rx="6" ry="2.4" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6 7v3.5c0 1.3 2.7 2.4 6 2.4s6-1.1 6-2.4V7" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6 10.5V14c0 1.3 2.7 2.4 6 2.4s6-1.1 6-2.4v-3.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6 14v3.5c0 1.3 2.7 2.4 6 2.4s6-1.1 6-2.4V14" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}


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
// Social rail constants (page-level, not hardcoded hex)
// ---------------------------------------------------------------------------

/**
 * Static client-clock readout shown in the SocialDock bottom strip (issue #457).
 * The current-era reference (client-current-home-2025-mf.png) carries a running-
 * time readout here — NOT a patch/version string. This is a presentational
 * fixture value (a pre-formatted string), not a live ticking timer.
 */
const SOCIAL_CLOCK = "26.14";

/** Queue label for the party lobby — feeds ProfileChip statusText + PartyStatusPanel. */
const PARTY_QUEUE_LABEL = "Normal Draft";

/** Fixture estimated wait label fed to FindingMatchPanel when in queue. */
const ESTIMATED_LABEL = "Estimated: 3:00";

/**
 * Docked rail width in px.
 *
 * PIL-measured from the current-era reference (issue #388 / era-shift epic #384):
 * docs/reference/client-current-home-activity-center.jpg (1280×720) — the rail
 * spans x=1056→1280 = 224px. The modern rail's "slim" look comes from thin
 * friend rows (48px pitch, 28px avatars) and a near-black bg, not a narrow
 * column, so the width is close to the older client. Content area = 1280 − 224
 * = 1056px, which still fits every railed screen.
 */
const SOCIAL_RAIL_WIDTH = 224;

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
    // Party / multi-chat — carries the current-era "31" gold badge (#457).
    id: "party",
    label: "Party",
    badge: 31,
    icon: (
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 3h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4l-4 3V4a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
        <path d="M13 5h3a1 1 0 0 1 1 1v6l-2-1.5H8" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    // Microphone / voice-toggle (#457). Replaces the old add-friend dock button
    // — add-friend already lives in the SOCIAL header, so it was redundant here.
    // Hand-drawn to match the sibling dock glyphs and the reference's plain
    // (unmuted) mic: the current-era rcp-fe-lol-social plugin ships only a
    // slashed `mute_mask` (a muted state), not the neutral mic the reference
    // shows, so no correct CDN glyph resolves for this slot.
    id: "mic",
    label: "Toggle microphone",
    icon: (
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6.5" y="2" width="5" height="9" rx="2.5" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
        <path d="M4 8a5 5 0 0 0 10 0" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 13v3M6.5 16h5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
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
  /**
   * Your Shop overlay (issue #361). The navbar CTA icon opens `YourShopScreen`
   * as a full-bleed overlay above the current view; close restores it. The
   * shell owns visibility (nav-surviving) and which offers are revealed, so a
   * closed-then-reopened overlay keeps its revealed cards.
   */
  const [showYourShop, setShowYourShop] = useState(false);
  const [yourShopRevealedIds, setYourShopRevealedIds] = useState<Set<string>>(new Set());
  /**
   * Objectives modal (issue #395). The nav-band Missions icon opens the
   * ObjectivesModal as a centered dialog over the current view; the shell owns
   * visibility (nav-surviving) and which category is active. Follows the Your
   * Shop overlay conventions (Escape + ✕ + backdrop close), but as a centered
   * modal rather than a full-bleed takeover, matching the reference.
   */
  const [showObjectives, setShowObjectives] = useState(false);
  const [objectivesCategoryId, setObjectivesCategoryId] = useState(
    DEMO_OBJECTIVES.activeCategoryId,
  );
  /**
   * Updates / notifications flyout (issue #396). The nav-band Updates icon
   * toggles a compact anchored flyout (UpdatesFlyout) below the icon; the shell
   * owns visibility AND the notification list (so mark-read / dismiss mutate
   * here and the icon's unread badge stays in sync). CONVENTION-BASED: no
   * dedicated reference screenshot — the surface follows the real client's
   * anchored-dropdown convention (see the UpdatesFlyout JSDoc). Unlike the
   * Objectives centered modal, this closes on outside-click as well as Escape,
   * matching a lightweight dropdown; the shell wires both since the anchored
   * flyout can't own listeners for its own trigger.
   */
  const [showUpdates, setShowUpdates] = useState(false);
  const [updateItems, setUpdateItems] = useState<UpdateNotification[]>(DEMO_UPDATES);
  const updatesAnchorRef = useRef<HTMLDivElement | null>(null);
  const unreadUpdatesCount = updateItems.filter((n) => n.unread).length;
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

  // Sound system (#432) — the app owns audio playback (a side effect), never
  // @low/ui. Wired to a few existing component callbacks below; every call is
  // user-gesture-initiated (no autoplay).
  const { play: playSfx } = useSound();
  // Generic uikit interaction SFX (#439) — a second audio channel resolved via
  // uikitSoundUrl (uikit plugin root, not the friend-finder sounds/ base). Wired
  // to a few existing chrome-primitive callbacks below (PlayButton press,
  // settings toggles, product-switcher select); every call is user-gesture-
  // initiated (no autoplay) and a missing clip degrades to a no-op.
  const { play: playUikit } = useSound(uikitSoundUrl);

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

  const toggleSocialPanel = () =>
    setSocialExpanded((prev) => {
      // Status-window open/close SFX (#432) — play the matching clip for the
      // direction we're toggling toward.
      playSfx(prev ? "statuswindow-close" : "statuswindow-open");
      return !prev;
    });

  // Champ-select phases are a full-screen takeover (issue #341): the TopNavbar
  // is hidden and the champ-select screen stretches to the window's top edge.
  // Window controls survive because they float in WindowFrame's integrated
  // chrome (#385) — layered above this content column, not in the navbar.
  const champSelectActive = view === "declare" || view === "ban" || view === "pick" || view === "loadout";

  // Views that show the docked social rail alongside content.
  // ban, pick, and loadout are full-bleed (no rail) per issue spec — the
  // reference replaces the docked rail with compact corner chat buttons.
  // Rail hiding here is safe for queue UX: by ban/pick/loadout the queue is
  // long over (match was accepted in the party-lobby view, which keeps its
  // rail + FindingMatchPanel). The match-found/queue widgets live only in the
  // party-lobby phase, so no queue function is lost by dropping the rail here.
  const railVisible = !champSelectActive;

  // Your Shop cards with shell-owned reveal state + callbacks attached. The
  // shell holds `yourShopRevealedIds`; each card's onReveal flips it, and
  // onPurchase is only wired once revealed (matching the showcase demo).
  const yourShopCards: YourShopCard[] = YOUR_SHOP_CARDS.map((base) => ({
    ...base,
    revealed: yourShopRevealedIds.has(base.id),
    onReveal: () =>
      setYourShopRevealedIds((prev) => new Set([...prev, base.id])),
    onPurchase: yourShopRevealedIds.has(base.id)
      ? () => console.log("your shop purchase:", base.skinName)
      : undefined,
  }));

  // Escape closes the Your Shop overlay (same path as the ✕ button). Listener is
  // only attached while the overlay is open, and torn down on close/unmount.
  useEffect(() => {
    if (!showYourShop) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowYourShop(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showYourShop]);

  // Escape closes the Objectives modal (same path as the ✕ / backdrop). Listener
  // is only attached while the modal is open, torn down on close/unmount.
  useEffect(() => {
    if (!showObjectives) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowObjectives(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showObjectives]);

  // Escape + outside-click close the Updates flyout. Listeners are only
  // attached while it's open, torn down on close/unmount. The pointerdown
  // handler ignores clicks inside the anchor wrapper (the icon + the flyout) so
  // toggling via the icon and interacting with rows don't self-close.
  useEffect(() => {
    if (!showUpdates) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowUpdates(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      const anchor = updatesAnchorRef.current;
      if (anchor && !anchor.contains(e.target as Node)) setShowUpdates(false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [showUpdates]);

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
              onChange={(v) => {
                // Checkbox/toggle click SFX (#439) — the settings toggle is the
                // client's checkbox primitive; play the toggle stinger.
                playUikit("checkbox-click");
                setMasterMute(v);
              }}
              label="Mute all sound"
            />
          </SettingsRow>
          <SettingsRow label="Music" description="Play background music in the client.">
            <HextechToggle
              checked={musicEnabled}
              onChange={(v) => {
                playUikit("checkbox-click");
                setMusicEnabled(v);
              }}
              label="Music"
            />
          </SettingsRow>
          <SettingsRow
            label="Sound effects"
            description="Play UI sound effects (button clicks, notifications)."
          >
            <HextechToggle
              checked={soundEffectsEnabled}
              onChange={(v) => {
                playUikit("checkbox-click");
                setSoundEffectsEnabled(v);
              }}
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
      className="relative overflow-hidden"
      style={{ width: CLIENT_WIDTH, height: CLIENT_HEIGHT }}
    >
      <WindowFrame
        chrome="integrated"
        // Leading amber status dot in the window-control row (● ? ─ ⚙ ✕),
        // matching the 2025 reference (#464). Integrated chrome only.
        showStatusDot
        onHelp={() => console.log("help")}
        onMinimize={() => console.log("minimize")}
        onClose={() => console.log("close")}
        // Settings gear lives in the window-control row (help → minimize →
        // settings → close), matching the reference (#401). Passing onSettings
        // renders the ⚙ there; the shell owns the SettingsModal open state.
        onSettings={() => setSettingsOpen(true)}
      >
        <div className="flex h-full flex-col">
          {/* TopNavbar is hidden during champ-select phases (#341): those
              screens are a full-screen takeover. Window controls stay because
              they float in WindowFrame's integrated chrome (a sibling above
              this content column, #385), not in the navbar. */}
          {!champSelectActive && (
          <TopNavbar
            playSlot={
              // PlayButton lives permanently in the navbar (zone 1).
              // On home: enabled → click → mode-select.
              // On every other view: disabled (greyed v5 treatment).
              <PlayButton
                disabled={playDisabled}
                label={playLabel}
                emblemSrc="/lol-emblem.png"
                // v8 real-client magic-layer videos (issue #309). The frame +
                // medallion video state machines auto-suppress while disabled, so
                // they only animate on the home view where PLAY is enabled. URLs
                // stream from CommunityDragon via @low/fixtures (no repo commits).
                videoSources={PLAY_BUTTON_VIDEO_SOURCES}
                medallionVideoSources={LEAGUE_LOGO_VIDEO_SOURCES}
                onClick={() => {
                  if (!playDisabled) {
                    // Gold-button press SFX (#439) — the primary CTA click.
                    playUikit("button-gold-click");
                    setView("mode-select");
                  }
                }}
              />
            }
            productSwitcherSlot={
              // Current-era product switcher (#403) in the left zone, right of
              // PLAY. Active product tracks the view: the TFT hub reads as TFT,
              // everything else in our client reads as LEAGUE. Selecting TFT
              // routes to the existing tft view and syncs the screen-nav active
              // id; LEAGUE returns to home. LoR is a disabled placeholder pill.
              <NavProductSwitcher
                products={PRODUCTS}
                externalLinkSrc={lorArrowUrl()}
                activeId={view === "tft" ? "tft" : "league"}
                onSelect={(id) => {
                  // Dropdown-select SFX (#439) — the product switcher is the
                  // client's league/TFT/LoR selector; play the select stinger.
                  playUikit("dropdown-select");
                  if (id === "tft") { setView("tft"); setActiveNavId("tft"); }
                  else if (id === "league") { setView("home"); setActiveNavId("home"); }
                }}
              />
            }
            navItems={NAV_ITEMS}
            activeId={activeNavId}
            onNavigate={(id) => {
              setActiveNavId(id);
              if (id === "collection") setView("collection");
              else if (id === "store") { setActiveStoreTab("featured"); setView("store"); }
              else if (id === "tft") setView("tft");
              else if (id === "competitive") setView("competitive");
              else if (id === "home") setView("home");
            }}
            currencySlot={
              // Current-era right region (era shift #384 / #386): a menu-access
              // ICON CLUSTER, then the gold Your Shop CTA, a divider, and the
              // stacked currency block with an RP top-up disc. Measured from
              // docs/reference/client-current-home-activity-center.jpg (1280×720):
              // six ~53px-pitch glyph slots, then the gold CTA disc, then the RP
              // capsule (2152 + `+` disc) with BE below. Composed at page level so
              // TopNavbar stays slot-agnostic. Profile identity is NOT here — it
              // lives in the rail ProfileChip (#146) and the reserved top-right
              // profile-chip slot is #387's scope (handoff below).
              <div className="flex items-center gap-3">
                {/* Menu-access icon cluster (#463) — the 2025 reference reads as
                    TWO groups of three split by a vertical divider:
                      A: hand "2" (missions) · cards "10" (loot) · crest (collection)
                      | divider |
                      B: satchel• (updates) · crossed-swords (store) · coins (shop)
                    Glyphs are faithful inline token-filled SVGs (no clean CDN nav
                    asset matches these exact shapes — #386 placeholder rule). The
                    existing entry points (objectives, loot, collection, updates
                    flyout, store, Your Shop) are preserved, remapped onto the
                    reference glyphs/order. opacity hover lift matches the client. */}
                <div className="flex items-center gap-1.5">
                  {/* Group A */}
                  <button
                    type="button"
                    aria-label="Missions"
                    className="relative flex h-7 w-7 cursor-pointer items-center justify-center opacity-80 transition-opacity duration-150 hover:opacity-100"
                    onClick={() => setShowObjectives(true)}
                  >
                    <HandGlyph />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-1 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-[3px] bg-gold-3 px-0.5 font-body text-[9px] font-bold leading-none text-hextech-black"
                    >
                      2
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label="Loot"
                    className="relative flex h-7 w-7 cursor-pointer items-center justify-center opacity-80 transition-opacity duration-150 hover:opacity-100"
                    onClick={() => {
                      setActiveStoreTab("loot");
                      setView("store");
                      setActiveNavId("store");
                    }}
                  >
                    <CardsGlyph />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-1.5 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-[3px] bg-gold-3 px-0.5 font-body text-[9px] font-bold leading-none text-hextech-black"
                    >
                      10
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label="Collection"
                    className="flex h-7 w-7 cursor-pointer items-center justify-center opacity-80 transition-opacity duration-150 hover:opacity-100"
                    onClick={() => { setView("collection"); setActiveNavId("collection"); }}
                  >
                    <CrestGlyph />
                  </button>

                  {/* Divider between group A and group B */}
                  <div className="mx-1 h-5 w-px bg-gold-5 shrink-0" aria-hidden="true" />

                  {/* Group B — updates satchel with the anchored UpdatesFlyout
                      (issue #396). The relative wrapper anchors the flyout; the
                      outside-click guard ignores clicks inside this ref. The gold
                      notification dot shows when there are unread items. */}
                  <div ref={updatesAnchorRef} className="relative">
                    <button
                      type="button"
                      aria-label="Updates"
                      aria-haspopup="dialog"
                      aria-expanded={showUpdates}
                      className="flex h-7 w-7 cursor-pointer items-center justify-center opacity-80 transition-opacity duration-150 hover:opacity-100"
                      onClick={() => setShowUpdates((v) => !v)}
                    >
                      <SatchelGlyph />
                    </button>
                    {/* Unread notification dot — small gold disc at the icon's
                        top-right, shown only when there are unread items. */}
                    {unreadUpdatesCount > 0 && (
                      <span
                        aria-label={`${unreadUpdatesCount} unread updates`}
                        className="pointer-events-none absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-gold-3"
                      />
                    )}
                    <UpdatesFlyout
                      open={showUpdates}
                      notifications={updateItems}
                      onItemClick={(id) =>
                        setUpdateItems((prev) =>
                          prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
                        )
                      }
                      onDismiss={(id) =>
                        setUpdateItems((prev) => prev.filter((n) => n.id !== id))
                      }
                      onMarkAllRead={() =>
                        setUpdateItems((prev) => prev.map((n) => ({ ...n, unread: false })))
                      }
                    />
                  </div>
                  <button
                    type="button"
                    aria-label="Store"
                    className="flex h-7 w-7 cursor-pointer items-center justify-center opacity-80 transition-opacity duration-150 hover:opacity-100"
                    onClick={() => { setActiveStoreTab("featured"); setView("store"); setActiveNavId("store"); }}
                  >
                    <CrossedSwordsGlyph />
                  </button>
                  {/* Coins → Your Shop. The 2025 reference has no gold chest in
                      this row (that CTA was retired here); the coins glyph opens
                      the same Your Shop overlay (issue #361/#364). */}
                  <button
                    type="button"
                    aria-label="Your Shop"
                    className="flex h-7 w-7 cursor-pointer items-center justify-center opacity-80 transition-opacity duration-150 hover:opacity-100"
                    onClick={() => setShowYourShop(true)}
                  >
                    <CoinsGlyph />
                  </button>
                </div>

                {/* 1px vertical divider between the icon cluster and currency */}
                <div className="h-5 w-px bg-gold-5 shrink-0" aria-hidden="true" />

                {/* Stacked currency (RP on top, BE below, right-aligned) with the
                    RP top-up disc. Per the reference the RP row carries a circular
                    gold `+` top-up disc at its right end (real rp-top-up-nav-*.svg,
                    3-state); BE has no top-up affordance. We pass no-op buy handlers
                    to CurrencyDisplay's inline `+` (kept for the BE row / non-nav
                    call sites) — the visible top-up here is the RpTopUpButton. */}
                <div className="flex items-center gap-2">
                  {/* RP row framed as a capsule (#464) — the `＋` top-up disc
                      lives INSIDE the capsule via rpTrailingSlot; BE stays
                      unframed below. */}
                  <CurrencyDisplay
                    wallet={demoWallet}
                    onBuyRp={() => console.log("buy rp")}
                    onBuyBe={() => console.log("buy be")}
                    stacked
                    capsule
                    showBuyButtons={false}
                    rpIconSrc={rpIconUrl()}
                    beIconSrc={blueEssenceIconUrl()}
                    rpTrailingSlot={
                      <RpTopUpButton
                        restingSrc={rpTopUpIconUrl("resting")}
                        hoverSrc={rpTopUpIconUrl("hover")}
                        pressedSrc={rpTopUpIconUrl("pressed")}
                        onClick={() => console.log("buy rp")}
                      />
                    }
                  />
                </div>
              </div>
            }
            playerSlot={
              /* Current-era top-right (era shift #384 / #387, strict-fidelity
                 #401): the compact ProfileChip OWNS identity here — icon + name
                 + status + bell, and NOTHING else. Measured from
                 client-current-home-activity-center.jpg, whose top-right band is
                 chip + bell only. The settings gear moved into the window-control
                 row (WindowFrame onSettings, #401) and the social-rail collapse
                 toggle folded into the SOCIAL header (SocialPanel
                 onToggleCollapse), so neither lives beside the chip anymore. The
                 chip sits BELOW the floating window controls (?─⚙✕) via
                 TopNavbar's `items-end` playerSlot placement. */
              <ProfileChip
                variant="navband"
                summoner={demoSummoner}
                level={demoSummoner.level}
                profileIconSrc={profileIconUrl(demoSummoner.profileIconId)}
                avatarBorderSrc={avatarBorderUrl(3)}
                notificationBellSrc={notificationBellUrl()}
                onNotifications={() => console.log("notifications")}
                onOpenProfile={() => {
                  // "profile" is absent from NAV_ITEMS, so no tab highlights
                  // while the profile screen is open (same pattern as home/tft).
                  setActiveNavId("profile");
                  setView("profile");
                }}
                statusText={profileChipStatusText}
              />
            }
          />
          )}

          {/* Content row — flex row containing the screen (flex-1 min-w-0) and,
              on railed views, the docked social rail as a normal in-flow column.
              pick / loadout are full-bleed: rail is absent entirely on those views. */}
          <div className="relative flex flex-1 overflow-hidden">
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
              ) : view === "declare" ? (
                // Declare-intent phase (#348): the FIRST champ-select beat,
                // before bans. Timer + auto-advance live inside the wrapper;
                // shell transitions to the ban phase on complete.
                <DeclarePhaseScreen
                  onDeclareComplete={() => setView("ban")}
                />
              ) : view === "ban" ? (
                // Ban phase (#275): inserted between declare and pick.
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
                  onAccept={() => { handleLeaveLobby("declare"); }}
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
                <HomeView
                  onGoToStore={() => { setActiveStoreTab("featured"); setView("store"); setActiveNavId("store"); }}
                />
              )}
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* Docked social rail — in-flow right column, visible on home /      */}
            {/* mode-select / matchmaking / collection; absent on pick / loadout. */}
            {/* Width: 224px (17.5% of 1280) — measured from client-current-home-activity-center ref (#388). */}
            {/* Collapse: socialExpanded=false → display:none → content reflows.  */}
            {/* ---------------------------------------------------------------- */}
            {railVisible && socialExpanded && (
              <div
                aria-label="Social panel"
                className="flex shrink-0 flex-col border-l border-gold-5"
                style={{ width: SOCIAL_RAIL_WIDTH }}
              >
                {/* Identity no longer heads the rail (era shift #384 / #387):
                    the compact ProfileChip moved to the TopNavbar band. Identity
                    lives in ONE place (#211). The rail now opens straight into
                    its widget zone / SocialPanel (whose SocialHeader keeps the
                    SOCIAL label + add/groups/list/search glyphs). */}

                {/* Rail widget — only shown on the party-lobby view.
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
                      ambientVideoSrc={partiesBgLoopUrl("queue-delay")}
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
                      ambientVideoSrc={partiesBgLoopUrl("party-status")}
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
                    onFriendClick={(s) => {
                      // Generic UI click SFX (#432).
                      playSfx("click-generic");
                      console.log("friend click:", s.gameName);
                    }}
                    profileIconSrcFor={(s) => profileIconUrl(s.profileIconId)}
                    // Real-client SOCIAL header mask glyphs, threaded live (#444).
                    // #434 add-friend + #440 groups/list/search — forwarded through
                    // SocialPanel to SocialHeader so the running client's rail shows
                    // the authentic grey→gold mask glyphs, not the fallback SVGs.
                    addIconSrc={friendFinderImageUrl("add_person_mask")}
                    groupsIconSrc={socialMaskUrl("add_folder_mask")}
                    listIconSrc={socialMaskUrl("sort_mask")}
                    searchIconSrc={socialMaskUrl("search_mask")}
                    // Poro empty state (#433) — shows the "?" mascot live when the
                    // friends list is empty. Non-empty demo data won't trigger it,
                    // but wiring the resolver makes an empty rail render the poro.
                    emptyStatePoro="question"
                    poroSrcFor={poroUrl}
                    // Collapse toggle folded into the SOCIAL header (#401) — the
                    // « chevron there collapses the rail. The matching EXPAND
                    // affordance (below) lives at the window edge because this
                    // whole panel unmounts when collapsed.
                    onToggleCollapse={toggleSocialPanel}
                  />
                </div>

                {/* SocialDock pinned at panel bottom */}
                <SocialDock
                  buttons={DOCK_BUTTONS}
                  clockLabel={SOCIAL_CLOCK}
                  onAction={(id) => {
                    // Suggested-tab-click SFX (#432) — the dock action tabs.
                    playSfx("suggested-tab-click");
                    console.log("dock action:", id);
                  }}
                />
              </div>
            )}

            {/* Collapsed-rail EXPAND affordance (#401). When the rail is
                collapsed the SOCIAL header (which now owns the collapse « ) is
                unmounted, so the only way back is a persistent handle at the
                window's right edge — a slim gold-bordered strip carrying a »
                chevron. The reference pictures only the EXPANDED rail, so the
                collapsed state is adjudicated: keep a minimal edge affordance so
                collapse works in BOTH directions. aria-expanded="false" here (and
                "true" on the header chevron) means a single [aria-expanded]
                selector resolves the toggle in either state.

                It is absolutely positioned (overlays the content's right edge)
                rather than an in-flow column, so the screen content still reflows
                to the full 1280px when collapsed — matching the real client,
                whose re-open handle floats over the content. Only on railed
                views, never during champ-select. */}
            {railVisible && !socialExpanded && (
              <button
                type="button"
                aria-label="Expand social panel"
                aria-expanded={false}
                onClick={toggleSocialPanel}
                className="absolute inset-y-0 right-0 z-20 flex w-7 cursor-pointer items-start justify-center border-l border-gold-5 bg-[color-mix(in_srgb,var(--color-blue-7)_22%,var(--color-hextech-black))] pt-3 text-grey-1 transition-colors duration-150 hover:text-gold-1"
              >
                {/* » double-chevron pointing inward (expand) */}
                <svg
                  aria-hidden="true"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6,2 10,6 6,10" />
                  <polyline points="2,2 6,6 2,10" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </WindowFrame>

      {/* Your Shop overlay (issue #361) — a full-window takeover opened by the
          navbar CTA icon, matching the real client: it covers the entire client
          content (navbar + view), and the ONLY way out is its ✕ (or Escape).
          The SettingsModal / social toggle in the navbar are intentionally
          unreachable while it's open — this mirrors the real client's Your Shop.
          Shell owns visibility so it survives across nav; close restores the
          underlying view untouched.

          Inset by the frame's 1px border on all sides. There is no title bar
          in the integrated chrome (#385), so the overlay spans the full window
          height. The floating window controls (?, minimize, close) live inside
          WindowFrame at z-[60] — above this z-40 overlay — so they stay
          clickable over it. z-40 sits under the fixed launch splash (z-100). */}
      {showYourShop && (
        <div
          className="absolute inset-px z-40"
          aria-modal="true"
          role="dialog"
          aria-label="Your Shop"
        >
          <YourShopScreen
            cards={yourShopCards}
            expiryLabel={YOUR_SHOP_EXPIRY}
            includesChampionNote
            rpIconSrc={rpIconUrl()}
            iconVideoSources={YOUR_SHOP_ICON_VIDEO_SOURCES}
            onClose={() => setShowYourShop(false)}
            onRevealAll={() =>
              setYourShopRevealedIds(new Set(YOUR_SHOP_CARDS.map((c) => c.id)))
            }
          />
        </div>
      )}

      {/* Objectives modal (issue #395) — the nav-band Missions icon opens this
          centered dialog over the current view. Unlike Your Shop's full-bleed
          takeover, the reference shows a centered modal over the (still visible,
          dimmed) lobby; the ObjectivesModal renders its own inset-px backdrop +
          centered card (inside the 1px gold frame border, matching the Your Shop
          overlay). Its internal root is z-40. The floating window controls
          (?─minimize─⚙─✕) sit at z-[60] inside WindowFrame, whose own root is
          z-auto (no stacking context of its own), so the z-40 modal and the
          z-[60] controls compare directly on the shared page layer — the
          controls win and stay clickable above the modal; the launch splash
          (z-100) stays above both. Escape (effect above), the ✕, and the
          backdrop all close it; the shell owns visibility so it survives nav. */}
      <ObjectivesModal
        open={showObjectives}
        header={DEMO_OBJECTIVES.header}
        bxp={DEMO_OBJECTIVES.bxp}
        categories={DEMO_OBJECTIVES.categories}
        activeCategoryId={objectivesCategoryId}
        sectionLabel={DEMO_OBJECTIVES.sectionLabel}
        sectionCount={DEMO_OBJECTIVES.sectionCount}
        missions={DEMO_OBJECTIVES.missions}
        onSelectCategory={setObjectivesCategoryId}
        onClose={() => setShowObjectives(false)}
        onBackdropClick={() => setShowObjectives(false)}
      />

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
// LeagueHomeScreen fixtures — page-level values (no fetching in @low/ui)
// The current-era OVERVIEW landing: content-link rail + featured splash/copy +
// skins strip. Rail selection lives in HomeView; each rail id maps to a
// featured copy/splash/skins block below.
// ---------------------------------------------------------------------------

const HOME_RAIL_ITEMS: HomeContentRailItem[] = [
  { id: "mvp-mf", label: "MVP T1\nMISS FORTUNE", thumbnailSrc: championSquareUrl("MissFortune") },
  { id: "world-champions", label: "WORLD\nCHAMPIONS: 2025\nSKINS" },
  { id: "ranked", label: "RANKED" },
  { id: "mordekaiser", label: "SAHN-UZAL\nMORDEKAISER", thumbnailSrc: championSquareUrl("Mordekaiser") },
  { id: "diana", label: "ECLIPSE ETERNAL\nASPECT DIANA", thumbnailSrc: championSquareUrl("Diana") },
  { id: "season", label: "SEASON:\nPANDEMONIUM" },
];

const HOME_RAIL_PINNED = { id: "patch-notes", label: "PATCH NOTES" };

const HOME_FEATURED_DEFAULT: LeagueHomeFeatured = {
  eyebrow: "NEW SKIN",
  title: "MVP T1\nMISS FORTUNE",
  body: "Celebrate 2025 Worlds Winners with new skins and the 'Together as 1' Nexus Finisher.",
  // MVP T1 Miss Fortune (skin69) full-art UNCENTERED splash — the real featured
  // background, not the plain default MF loading splash (issue #481).
  splashSrc: skinUncenteredSplashUrl("missfortune", 69),
};

const HOME_FEATURED: Record<string, LeagueHomeFeatured> = {
  "mvp-mf": HOME_FEATURED_DEFAULT,
  mordekaiser: {
    eyebrow: "NEW SKIN",
    title: "SAHN-UZAL\nMORDEKAISER",
    body: "The fallen general returns. Wield the ascended armor of Sahn-Uzal in this legendary skin.",
    splashSrc: championSplashUrl("Mordekaiser"),
  },
  diana: {
    eyebrow: "NEW SKIN",
    title: "ECLIPSE ETERNAL\nASPECT DIANA",
    body: "Embrace the moonfall. Diana ascends as an Eternal Aspect in this shimmering new skin line.",
    splashSrc: championSplashUrl("Diana"),
  },
};

const HOME_SKINS_DEFAULT: LeagueHomeSkin[] = [
  { id: "mvp-mf-skin", name: "MVP T1 Miss Fortune", artSrc: skinUncenteredSplashUrl("missfortune", 69, "centered"), owned: true },
  { id: "together-as-1", name: "'Together as 1' Nexus Finisher", artSrc: championSplashUrl("MissFortune", 4) },
];

const HOME_SKINS: Record<string, LeagueHomeSkin[]> = {
  "mvp-mf": HOME_SKINS_DEFAULT,
  mordekaiser: [
    { id: "sahn-uzal", name: "Sahn-Uzal Mordekaiser", artSrc: loadingArtUrl("Mordekaiser", 0) },
    { id: "morde-border", name: "Sahn-Uzal Signature Border", artSrc: championSplashUrl("Mordekaiser", 1) },
  ],
  diana: [
    { id: "eclipse-diana", name: "Eclipse Eternal Aspect Diana", artSrc: loadingArtUrl("Diana", 0) },
    { id: "diana-chroma", name: "Aspect Diana Chroma Bundle", artSrc: championSplashUrl("Diana", 3) },
  ],
};

// ---------------------------------------------------------------------------
// HomeView — wraps the sub-tab strip + content for the home route.
// Sub-nav is a narrow bar (~32px) across the full content width.
// OVERVIEW and ARCADE 2019 are live; NEWS and PATCH NOTES remain dead.
// ---------------------------------------------------------------------------

interface HomeViewProps {
  /** Routes the shell to the store view (GO TO STORE pill on the OVERVIEW landing). */
  onGoToStore: () => void;
}

/** Renders the home sub-tab strip and the active sub-tab content. */
function HomeView({ onGoToStore }: HomeViewProps) {
  const [activeTabId, setActiveTabId] = useState<string>("overview");
  // OVERVIEW content-link rail selection — drives the featured splash/copy/skins.
  const [homeRailId, setHomeRailId] = useState<string>("mvp-mf");
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
          // OVERVIEW — current-era featured-content landing (#455): content-link
          // rail + full-bleed featured splash + skins strip + GO TO STORE. Rail
          // items without a dedicated featured block fall back to MVP MF.
          <LeagueHomeScreen
            featured={HOME_FEATURED[homeRailId] ?? HOME_FEATURED_DEFAULT}
            railSlot={
              <HomeContentRail
                items={HOME_RAIL_ITEMS}
                activeId={homeRailId}
                onSelect={setHomeRailId}
                pinnedItem={HOME_RAIL_PINNED}
              />
            }
            skins={HOME_SKINS[homeRailId] ?? HOME_SKINS_DEFAULT}
            onSelectSkin={(id) => console.log("home: select skin", id)}
            onGoToStore={onGoToStore}
            onToggleMute={() => console.log("home: toggle mute")}
          />
        )}
      </div>
    </div>
  );
}

