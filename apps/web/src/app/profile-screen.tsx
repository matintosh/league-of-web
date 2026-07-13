"use client";

import { useState } from "react";
import { ProfileBanner, RankedQueuePanel, MasteryEternalsPanel, SearchInput, ClubsEmptyState, ProfileRankedScreen, StatsTab, WelcomeToSeasonModal, ChallengesScreen } from "@low/ui";
import type { ProfileBannerStat, RankedFeatureColumn, RankedSplitProgress, PlayStyleStat, SeasonStats } from "@low/ui";
import {
  demoSummoner,
  demoMasteryEntries,
  demoEternalEntries,
  profileIconUrl,
  rankedIntroUrl,
  rankedEmblemUrl,
  rankedUnrankedEmblemUrl,
  SAMPLE_CHALLENGES,
} from "@low/fixtures";
import type { ChallengeCategory } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Profile sub-tab strip data
// ---------------------------------------------------------------------------

interface ProfileTab {
  id: string;
  label: string;
  disabled?: boolean;
}

const PROFILE_TABS: ProfileTab[] = [
  { id: "overview",    label: "OVERVIEW" },
  { id: "challenges",  label: "CHALLENGES" },
  { id: "match-history", label: "MATCH HISTORY", disabled: true },
  { id: "ranked",      label: "RANKED" },
  { id: "clubs",       label: "CLUBS" },
  { id: "highlights",  label: "HIGHLIGHTS", disabled: true },
  { id: "stats",       label: "STATS" },
];

// ---------------------------------------------------------------------------
// Ranked queues fixture (page-level — component is fixture-value-free)
// ---------------------------------------------------------------------------

const RANKED_QUEUES = [
  { id: "flex3v3",    label: "FLEX 3V3" },
  { id: "soloduo",    label: "SOLO/DUO" },
  { id: "flex5v5",    label: "FLEX 5V5" },
  { id: "lastSeason", label: "LAST SEASON'S RANK" },
];

/**
 * Resolves the crest image URL for each queue cell.
 * All queues are unranked (demo profile) → `rankedUnrankedEmblemUrl()`.
 *
 * `rankedUnrankedEmblemUrl` returns the Iron shield emblem (512×585px) from
 * the magisteriis set — the same shield family shown in the reference
 * screenshot. The component applies `opacity-25 grayscale` for unranked queues,
 * producing the dimmed grey metallic shield the reference shows.
 *
 * When the profile is ranked the page would supply the correct tier string via
 * `rankedMiniCrestUrl(tier)` for live queues and `rankedEmblemUrl(tier)` for
 * the last-season cell; this resolver is the single callsite to update.
 */
function crestSrcFor(id: string): string {
  // Demo summoner is fully unranked. All cells use the emblem-family shield
  // (Iron grayscale) rather than the 16px ring SVG from ranked-mini-crests.
  void id;
  return rankedUnrankedEmblemUrl();
}

// ---------------------------------------------------------------------------
// Ranked screen fixture data (page-level — component is fixture-value-free)
// ---------------------------------------------------------------------------

const RANKED_FEATURE_COLUMNS: RankedFeatureColumn[] = [
  {
    // CDragon ranked-intro: blue "MATCH FOUND" modal screenshot (276×157)
    imageUrl: rankedIntroUrl("squad-up"),
    title: "Conquer the Rift",
    description:
      "Dish out damage solo or tag-team combos with a friend as you face opponents in games that test individual skill.",
  },
  {
    // CDragon ranked-intro: Challenger/Diamond wings rank emblem with electric-blue glow (276×157)
    imageUrl: rankedIntroUrl("earn-rank"),
    title: "Start Your Climb",
    description:
      "Play placement games to earn your rank. During placements, games have bonus LP gains and no LP losses. You'll unlock a provisional rank after your first placement game.",
  },
  {
    // CDragon ranked-intro: Sivir victorious skin face close-up in silver helmet (276×157)
    imageUrl: rankedIntroUrl("epic-loot"),
    title: "Earn Rewards",
    description:
      "This season, unlock rewards across splits and at the end of the season. Finishing Gold or above in any ranked queue unlocks a Victorious skin.",
  },
];

const RANKED_SPLIT_PROGRESS: RankedSplitProgress = {
  splitLabel: "Split 2 of 2",
  timeRemaining: "12D 4H 16M",
  currentSP: 0,
  // iconSrc omitted — MilestoneNode renders the fixed hexagonal SP checkpoint SVG
  milestones: [
    { label: "0/150 SP", reached: false },
    { label: "250 SP",   reached: false },
    { label: "500 SP",   reached: false },
  ],
};

// ---------------------------------------------------------------------------
// Stats tab fixture data (page-level — component is fixture-value-free)
// ---------------------------------------------------------------------------

const STATS_PLAYSTYLE: PlayStyleStat[] = [
  { role: "Fighter",  value: 0.15 },
  { role: "Mage",     value: 0.15 },
  { role: "Assassin", value: 0.15 },
  { role: "Support",  value: 0.15 },
  { role: "Tank",     value: 0.15 },
];

const STATS_SEASON: SeasonStats = {
  gamesPlayed: null,
  timePlayed:  null,
  kdaRatio:    null,
};

// ---------------------------------------------------------------------------
// Trophy shelf — 5 category columns (page-level markup)
// ---------------------------------------------------------------------------

interface TrophyCategory {
  label: string;
  subLabel?: string;
  /** Whether this slot has the highlighted band (first slot per reference). */
  highlighted?: boolean;
}

const TROPHY_CATEGORIES: TrophyCategory[] = [
  { label: "SOLO/DUO",      subLabel: "UNRANKED", highlighted: true },
  { label: "HONOR",         subLabel: "LEVEL 2" },
  { label: "MASTERY SCORE" },
  { label: "TROPHY" },
  { label: "BANNER" },
];

// ---------------------------------------------------------------------------
// Banner stat icons (inline SVG, aria-hidden — purely decorative glyphs)
// ---------------------------------------------------------------------------

function ChampionMasteryIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="1.5" y="1.5" width="15" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M5 9h8M9 5v8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function HonorIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 2.5l1.75 4.5H15l-3.5 2.75 1.5 4.75L9 12l-4 2.5 1.5-4.75L3 7h4.25L9 2.5Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
    </svg>
  );
}

function RerollIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M3.5 9a5.5 5.5 0 1 1 1.6 3.9" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M3.5 13.5V9.5h4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const DEMO_STATS: ProfileBannerStat[] = [
  { icon: <ChampionMasteryIcon />, value: 4,  label: "Champions mastered" },
  { icon: <HonorIcon />,           value: 2,  label: "Honor count" },
  { icon: <RerollIcon />,          value: 0,  label: "Rerolls available" },
];

// ---------------------------------------------------------------------------
// TrophyShelf — 5 dimmed emblem slots with category labels above
// ---------------------------------------------------------------------------

/**
 * Emblem glyph placeholder SVG — dimmed circular shield outline.
 * Represents unlocked trophy/emblem content (greyed out when not earned).
 */
function EmblemPlaceholder({ highlighted }: { highlighted?: boolean }) {
  return (
    <div
      className={[
        "flex h-[90px] w-[90px] items-center justify-center rounded-full",
        highlighted
          ? "bg-gold-5/20 ring-1 ring-gold-4/40"
          : "bg-transparent",
      ].join(" ")}
    >
      <svg
        aria-hidden="true"
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        className="text-grey-3 opacity-60"
      >
        <path
          d="M32 4L8 16v20c0 14 12 22 24 24 12-2 24-10 24-24V16L32 4Z"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
        <circle cx="32" cy="30" r="10" stroke="currentColor" strokeWidth="1.25" fill="none" />
      </svg>
    </div>
  );
}

function TrophyShelf() {
  return (
    <div className="flex items-start justify-around px-4 pt-4">
      {TROPHY_CATEGORIES.map((cat, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          {/* Category label + sub-label */}
          <div className="flex flex-col items-center gap-0.5 text-center">
            <span className="font-display text-[10px] uppercase tracking-widest text-gold-cream">
              {cat.label}
            </span>
            {cat.subLabel && (
              <span className="font-display text-[10px] uppercase tracking-widest text-grey-2">
                {cat.subLabel}
              </span>
            )}
          </div>
          {/* Emblem slot */}
          <EmblemPlaceholder highlighted={cat.highlighted} />
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// GearIcon — small gear for the dead settings button next to search
// ---------------------------------------------------------------------------

function GearIcon() {
  return (
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
  );
}

// ---------------------------------------------------------------------------
// ProfileScreen
// ---------------------------------------------------------------------------

/**
 * ProfileScreen — Profile view with Overview and Clubs sub-tabs live.
 *
 * Layout per reference:
 *  - Sub-tab strip (full width, ~36px): Overview + Clubs (live), 4 dead tabs,
 *    SearchInput + gear button on right.
 *  - Overview content: 260px ProfileBanner on left; RankedQueuePanel + TrophyShelf right.
 *  - Clubs content: full-width ClubsEmptyState (no banner — matches reference).
 *
 * All fixture values are supplied at this page level; components remain
 * fixture-value-free per the component contract.
 */
export interface ProfileScreenProps {
  /**
   * Whether the season-intro modal has been dismissed this session.
   * Owned by the shell (not this screen) so it survives main-nav
   * switches — ProfileScreen unmounts when the user leaves Profile.
   */
  seasonModalDismissed: boolean;
  /** Called when the user dismisses the season-intro modal via its CTA. */
  onSeasonModalDismiss: () => void;
}

export function ProfileScreen({
  seasonModalDismissed,
  onSeasonModalDismiss,
}: ProfileScreenProps) {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [challengeCategory, setChallengeCategory] = useState<ChallengeCategory>("all");

  const filteredChallenges =
    challengeCategory === "all"
      ? SAMPLE_CHALLENGES
      : SAMPLE_CHALLENGES.filter((c) => c.category === challengeCategory);

  const summoner = demoSummoner;
  const profileIconSrc = profileIconUrl(summoner.profileIconId);
  // demoSummoner.level = 247; xp fraction arbitrary demo value
  const XP_FRACTION = 0.45;

  return (
    <div
      data-shot="profile-screen"
      className="flex h-full flex-col bg-hextech-black"
    >
      {/* ------------------------------------------------------------------ */}
      {/* Sub-tab strip                                                        */}
      {/* ------------------------------------------------------------------ */}
      <div
        role="tablist"
        aria-label="Profile sections"
        className="flex shrink-0 items-end border-b border-gold-5 bg-hextech-black"
        style={{ height: 36 }}
      >
        {/* Left: tab buttons */}
        <div className="flex h-full flex-1 items-end">
          {PROFILE_TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            const isClickable = !tab.disabled;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-disabled={tab.disabled ? true : undefined}
                disabled={tab.disabled}
                onClick={isClickable ? () => setActiveTab(tab.id) : undefined}
                className={[
                  "relative flex h-full shrink-0 items-center px-4",
                  "font-display text-xs uppercase tracking-widest transition-colors duration-150",
                  "border-b-2",
                  isClickable ? "cursor-pointer" : "cursor-default",
                  isActive
                    ? "border-gold-4 text-gold-1"
                    : "border-transparent text-gold-cream opacity-60",
                ].join(" ")}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right: search + gear — only shown on overview tab (matches reference) */}
        {activeTab === "overview" && (
          <div className="mb-1.5 mr-2 flex shrink-0 items-center gap-2">
            <SearchInput
              value=""
              onChange={() => {}}
              placeholder="Summoner Search"
              aria-label="Summoner Search"
            />
            <button
              type="button"
              aria-label="Profile settings"
              aria-disabled="true"
              disabled
              className="flex h-7 w-7 cursor-default items-center justify-center rounded border border-gold-5 text-grey-2 opacity-70 transition-colors duration-150 hover:border-gold-4 hover:text-gold-1"
            >
              <GearIcon />
            </button>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Content area — switches per active tab                              */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === "clubs" ? (
        /* Clubs tab: full-width empty state, no banner column */
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <ClubsEmptyState
            onCreateClub={() => {}}
            onLearnMore={() => {}}
            onSummonerSearch={() => {}}
          />
        </div>
      ) : activeTab === "ranked" ? (
        /* Ranked tab: full-width season overview with feature strip + QUEUE UP */
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <ProfileRankedScreen
            season="2019 Season"
            queueType="Solo/Duo"
            featureColumns={RANKED_FEATURE_COLUMNS}
            splitProgress={RANKED_SPLIT_PROGRESS}
            onQueueUp={() => {}}
            onSearchSummoner={() => {}}
          />
        </div>
      ) : activeTab === "challenges" ? (
        /* Challenges tab: score sidebar + 5-column card grid (era: 2022+) */
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <ChallengesScreen
            totalScore={4725}
            scoreTier="silver"
            activeCategory={challengeCategory}
            onCategoryChange={setChallengeCategory}
            challenges={filteredChallenges}
          />
        </div>
      ) : activeTab === "stats" ? (
        /* Stats tab: play-style radar + season stats + season intro modal on first visit */
        <div className="relative flex flex-1 min-h-0 overflow-hidden">
          <StatsTab
            playstyle={STATS_PLAYSTYLE}
            seasonLabel="Season 2019"
            seasonStats={STATS_SEASON}
            searchValue=""
            onSearchChange={() => {}}
            championFilter=""
            onChampionFilterChange={() => {}}
          />
          <WelcomeToSeasonModal
            open={activeTab === "stats" && !seasonModalDismissed}
            season="2019"
            onStart={onSeasonModalDismiss}
          />
        </div>
      ) : (
        /* Overview tab: banner left, ranked + trophy right */
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Left: ProfileBanner column */}
          <div className="shrink-0 overflow-y-auto border-r border-gold-5">
            <ProfileBanner
              name={summoner.gameName}
              level={summoner.level}
              xpFraction={XP_FRACTION}
              profileIconSrc={profileIconSrc}
              stats={DEMO_STATS}
            />
          </div>

          {/* Right: ranked panel + trophy shelf */}
          <div className="flex flex-1 min-w-0 flex-col gap-6 overflow-y-auto p-6">
            {/* Ranked queue panel */}
            <RankedQueuePanel
              queues={RANKED_QUEUES}
              crestSrcFor={crestSrcFor}
            />

            {/* Highest Champion Mastery + Highest Eternals dual-column panel */}
            <MasteryEternalsPanel
              masteryEntries={demoMasteryEntries}
              eternalEntries={demoEternalEntries}
            />

            {/* Trophy shelf */}
            <TrophyShelf />
          </div>
        </div>
      )}
    </div>
  );
}
