"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CLIENT_WIDTH, CLIENT_HEIGHT } from "../lib/client-window";
import {
  WindowFrame,
  TopNavbar,
  PlayButton,
  CurrencyDisplay,
  PlayerHovercard,
  ProfileChip,
  SettingsModal,
  SettingsRow,
  HextechToggle,
  NewsCard,
  SocialPanel,
  SocialDock,
} from "@low/ui";
import type { NavItem, SettingsSection, NewsCardProps, FriendGroup, DockButton } from "@low/ui";
import {
  demoSummoner,
  demoWallet,
  demoFriends,
  profileIconUrl,
  championSplashUrl,
} from "@low/fixtures";
import { MatchmakingScreen } from "./matchmaking-screen";
import { CollectionScreen } from "./collection-screen";
import { ModeSelectScreen } from "./mode-select-screen";
import { PickScreen } from "./pick-screen";
import { LoadoutScreen } from "./loadout-screen";

type View = "home" | "mode-select" | "matchmaking" | "collection" | "pick" | "loadout";

// Nav set matches the reference left→right: Home (live), Profile (dead),
// Collection (live), Teamfight Tactics (dead).
// Dead items use aria-disabled and a no-op onClick per the issue spec.
const NAV_ITEMS: NavItem[] = [
  { id: "home",       label: "Home" },
  { id: "profile",    label: "Profile",           disabled: true },
  { id: "collection", label: "Collection" },
  { id: "tft",        label: "Teamfight Tactics", disabled: true },
];

const KEYART_CHAMPION = "Jinx";

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
  const [activeNavId, setActiveNavId] = useState("home");
  /** DDragon champion id chosen in the pick phase; passed to LoadoutScreen. */
  const [chosenChampionId, setChosenChampionId] = useState<string | undefined>(undefined);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState("general");

  // Social rail state — expanded/collapsed, group collapse map.
  // Default EXPANDED per issue spec (real client keeps rail visible by default).
  const [socialExpanded, setSocialExpanded] = useState(true);
  const [friendGroups, setFriendGroups] = useState<FriendGroup[]>(INITIAL_FRIEND_GROUPS);

  const toggleSocialPanel = () => setSocialExpanded((prev) => !prev);

  // Views that show the docked social rail alongside content.
  // pick and loadout are full-bleed (no rail) per issue spec.
  const railVisible = view !== "pick" && view !== "loadout";

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

  // PLAY button is enabled only on the home view; disabled (greyed v5 treatment)
  // on every other view. This follows the reference where the greyed PLAY is
  // visible in the navbar while the mode-select screen is already shown.
  const playDisabled = view !== "home";

  return (
    <div
      className="overflow-hidden"
      style={{ width: CLIENT_WIDTH, height: CLIENT_HEIGHT }}
    >
      <WindowFrame
        title="League of Web"
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
                emblemSrc="/lol-emblem.png"
                onClick={() => { if (!playDisabled) setView("mode-select"); }}
              />
            }
            navItems={NAV_ITEMS}
            activeId={activeNavId}
            onNavigate={(id) => {
              setActiveNavId(id);
              if (id === "collection") setView("collection");
              else if (id === "home") setView("home");
            }}
            currencySlot={
              // Right region: icon pair (zone 3) + divider (zone 4) + stacked currency (zone 5)
              // Composed at page level so TopNavbar stays slot-agnostic.
              <div className="flex items-center gap-3">
                {/* Zone 3 — Loot + Essence icon buttons (dead, no-op) */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    aria-label="Loot"
                    className="flex h-7 w-7 cursor-default items-center justify-center text-grey-1 transition-colors duration-150 hover:text-gold-1"
                    onClick={() => console.log("loot")}
                  >
                    {/* Loot chest icon ~18px */}
                    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="1.5" y="7" width="15" height="9.5" rx="1" stroke="currentColor" strokeWidth="1.25" />
                      <path d="M1.5 10h15" stroke="currentColor" strokeWidth="1.25" />
                      <rect x="3" y="1.5" width="12" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.25" />
                      <path d="M7 10v2.5a2 2 0 0 0 4 0V10" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    aria-label="Essence"
                    className="flex h-7 w-7 cursor-default items-center justify-center text-grey-1 transition-colors duration-150 hover:text-gold-1"
                    onClick={() => console.log("essence")}
                  >
                    {/* Essence/coins icon ~18px */}
                    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.25" />
                      <circle cx="9" cy="9" r="4" stroke="currentColor" strokeWidth="1.25" />
                      <path d="M9 5.5v7M5.5 9h7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>

                {/* Zone 4 — 1px vertical divider */}
                <div className="h-5 w-px bg-gold-5 shrink-0" aria-hidden="true" />

                {/* Zone 5 — stacked currency (RP on top, BE below, right-aligned) */}
                <CurrencyDisplay
                  wallet={demoWallet}
                  onBuyRp={() => console.log("buy rp")}
                  onBuyBe={() => console.log("buy be")}
                  stacked
                />
              </div>
            }
            playerSlot={
              <div className="flex items-center gap-2">
                <PlayerHovercard
                  summoner={demoSummoner}
                  profileIconSrc={profileIconUrl(demoSummoner.profileIconId)}
                />
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
              {view === "collection" ? (
                <CollectionScreen />
              ) : view === "loadout" ? (
                <LoadoutScreen
                  chosenChampionId={chosenChampionId}
                  onComplete={() => { setView("home"); setActiveNavId("home"); }}
                />
              ) : view === "pick" ? (
                <PickScreen
                  onLockIn={(championId) => {
                    setChosenChampionId(championId);
                    setView("loadout");
                  }}
                />
              ) : view === "matchmaking" ? (
                <MatchmakingScreen
                  onBack={() => { setView("home"); setActiveNavId("home"); }}
                  onAccept={() => setView("pick")}
                />
              ) : view === "mode-select" ? (
                <ModeSelectScreen
                  onConfirm={() => setView("matchmaking")}
                  onBack={() => { setView("home"); setActiveNavId("home"); }}
                />
              ) : (
                <HomeLanding onPlay={() => setView("mode-select")} newsItems={NEWS_ITEMS} />
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
                />

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
    </div>
  );
}

// ---------------------------------------------------------------------------
// HomeLanding — diagonal-split layout per issue #37 / Figma node 50-583
//
// CTA decision (superseded by issue #139): The PlayButton now lives permanently
// in TopNavbar (enabled on home, disabled elsewhere). The home content panel
// no longer has its own PlayButton CTA — the onPlay prop is retained for the
// hero showcase variants but no longer used in the shell.
// ---------------------------------------------------------------------------

interface HomeLandingProps {
  onPlay: () => void;
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
      {/* NEWS FEED — gradient scrim + 3-card row, lower-right of art area     */}
      {/* z above art, pointer events active on cards                          */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="absolute bottom-0 right-0 flex flex-col justify-end"
        style={{
          // occupies right portion of art region; left edge respects panel seam
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
            height: 248,
            background: `linear-gradient(to top, color-mix(in srgb, var(--color-hextech-black) 90%, transparent) 0%, color-mix(in srgb, var(--color-hextech-black) 50%, transparent) 55%, transparent 100%)`,
          }}
        />

        {/* 3-card row — each card takes equal share of available width.
            Using flex-1 min-w-0 so cards reflow when content width changes
            (e.g. with the 200px docked rail, content is ~1080px, available
            right of the diagonal seam at 566px ≈ 494px, cards ~148px each). */}
        <div className="relative flex gap-4" style={{ zIndex: 1 }}>
          {newsItems.map((item) => (
            <div key={item.title} className="flex-1 min-w-0">
              <NewsCard {...item} />
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
