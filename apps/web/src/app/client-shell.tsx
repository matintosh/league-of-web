"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CLIENT_WIDTH, CLIENT_HEIGHT } from "../lib/client-window";
import {
  WindowFrame,
  TopNavbar,
  HextechButton,
  PlayButton,
  CurrencyDisplay,
  PlayerHovercard,
  SettingsModal,
  SettingsRow,
  HextechToggle,
  NewsCard,
} from "@low/ui";
import type { NavItem, SettingsSection, NewsCardProps } from "@low/ui";
import {
  demoSummoner,
  demoWallet,
  profileIconUrl,
  championSplashUrl,
} from "@low/fixtures";
import { MatchmakingScreen } from "./matchmaking-screen";
import { CollectionScreen } from "./collection-screen";
import { ModeSelectScreen } from "./mode-select-screen";

type View = "home" | "mode-select" | "matchmaking" | "collection";

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home" },
  { id: "tft", label: "TFT" },
  { id: "collection", label: "Collection" },
  { id: "loot", label: "Loot" },
  { id: "store", label: "Store" },
  { id: "profile", label: "Profile" },
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

export function ClientShell() {
  const [view, setView] = useState<View>("home");
  const [activeNavId, setActiveNavId] = useState("home");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState("general");

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
          <div className="border-t border-gold-5 pt-4">
            <span className="text-xs text-grey-2">league-of-web v1.0.0</span>
          </div>
        </div>
      ),
    },
  ];

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
              <HextechButton size="large" onClick={() => setView("mode-select")}>
                Play
              </HextechButton>
            }
            navItems={NAV_ITEMS}
            activeId={activeNavId}
            onNavigate={(id) => {
              setActiveNavId(id);
              if (id === "collection") setView("collection");
              else if (id === "home") setView("home");
            }}
            currencySlot={
              <CurrencyDisplay
                wallet={demoWallet}
                onBuyRp={() => console.log("buy rp")}
                onBuyBe={() => console.log("buy be")}
              />
            }
            playerSlot={
              <div className="flex items-center gap-2">
                <PlayerHovercard
                  summoner={demoSummoner}
                  profileIconSrc={profileIconUrl(demoSummoner.profileIconId)}
                />
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

          {/* Content area — switches between home, mode-select, matchmaking, and collection */}
          <div className="relative flex-1 overflow-hidden">
            {view === "collection" ? (
              <CollectionScreen />
            ) : view === "matchmaking" ? (
              <MatchmakingScreen onBack={() => { setView("home"); setActiveNavId("home"); }} />
            ) : view === "mode-select" ? (
              <ModeSelectScreen
                onConfirm={() => setView("matchmaking")}
                onBack={() => { setView("home"); setActiveNavId("home"); }}
              />
            ) : (
              <HomeLanding onPlay={() => setView("mode-select")} newsItems={NEWS_ITEMS} />
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
// CTA decision: PlayButton is placed in the home CONTENT left panel as the
// primary landing CTA. The TopNavbar playSlot retains its HextechButton so the
// play action remains reachable from every view (matchmaking, collection, etc.)
// Both CTAs call setView("mode-select") with the same effect.
// ---------------------------------------------------------------------------

interface HomeLandingProps {
  onPlay: () => void;
  newsItems: NewsCardProps[];
}

function HomeLanding({ onPlay, newsItems }: HomeLandingProps) {
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

        {/* 3-card row */}
        <div className="relative flex gap-4" style={{ zIndex: 1 }}>
          {newsItems.map((item, i) => (
            <div key={item.title} style={{ width: 210, flexShrink: 0 }}>
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
          <div className="mb-8 h-px w-32 bg-gold-4" />

          {/* Play CTA — PlayButton from issue #35 */}
          <PlayButton onClick={onPlay} />
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
