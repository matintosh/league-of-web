"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CLIENT_WIDTH, CLIENT_HEIGHT } from "../lib/client-window";
import {
  WindowFrame,
  TopNavbar,
  HextechButton,
  CurrencyDisplay,
  PlayerHovercard,
  SettingsModal,
  SettingsRow,
  HextechToggle,
} from "@low/ui";
import type { NavItem, SettingsSection } from "@low/ui";
import {
  demoSummoner,
  demoWallet,
  profileIconUrl,
  championSplashUrl,
} from "@low/fixtures";

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home" },
  { id: "tft", label: "TFT" },
  { id: "collection", label: "Collection" },
  { id: "loot", label: "Loot" },
  { id: "store", label: "Store" },
  { id: "profile", label: "Profile" },
];

const KEYART_CHAMPION = "Jinx";

export function ClientShell() {
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
      className="w-[1280px] h-[720px] overflow-hidden"
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
              <HextechButton size="large" onClick={() => console.log("play")}>
                Play
              </HextechButton>
            }
            navItems={NAV_ITEMS}
            activeId={activeNavId}
            onNavigate={setActiveNavId}
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

          {/* Content area: full-bleed keyart */}
          <div className="relative flex-1 overflow-hidden">
            <Image
              src={championSplashUrl(KEYART_CHAMPION)}
              alt={`${KEYART_CHAMPION} splash art`}
              fill
              priority
              className="object-cover"
            />
            {/* Dark gradient overlay from bottom so chrome stays readable */}
            <div className="absolute inset-0 bg-linear-to-t from-hextech-black via-hextech-black/30 to-transparent" />

            {/* Welcome text */}
            <div className="absolute bottom-12 left-12 flex flex-col gap-2">
              <h1 className="font-display text-4xl uppercase tracking-widest text-gold-1">
                Welcome back,
              </h1>
              <p className="font-display text-2xl uppercase tracking-widest text-gold-2">
                {demoSummoner.gameName}
              </p>
            </div>
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
