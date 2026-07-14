"use client";

import { ProfileRankedScreen } from "./profile-ranked-screen";
import type { RankedWingTier } from "@low/fixtures";
import { loadingArtUrl, rankedIntroUrl, rankedWingVideoUrl } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Shared fixture data
// ---------------------------------------------------------------------------

const FEATURE_COLUMNS = [
  {
    imageUrl: loadingArtUrl("Jinx", 0),
    title: "Conquer the Rift",
    description:
      "Dish out damage solo or tag-team combos with a friend as you face opponents in games that test individual skill.",
  },
  {
    imageUrl: loadingArtUrl("LeeSin", 0),
    title: "Start Your Climb",
    description:
      "Play placement games to earn your rank. During placements, games have bonus LP gains and no LP losses. You'll unlock a provisional rank after your first placement game.",
  },
  {
    imageUrl: loadingArtUrl("Sivir", 0),
    title: "Earn Rewards",
    description:
      "This season, unlock rewards across splits and at the end of the season. Finishing Gold or above in any ranked queue unlocks a Victorious skin.",
  },
];

/**
 * Feature columns whose "Start Your Climb" (middle) tile carries the animated
 * ranked-emblem wings for `tier`, over the real client's emblem art. The outer
 * tiles stay static so the with/without contrast is visible in one frame.
 */
function wingFeatureColumns(tier: RankedWingTier) {
  return [
    {
      imageUrl: loadingArtUrl("Jinx", 0),
      title: "Conquer the Rift",
      description:
        "Dish out damage solo or tag-team combos with a friend as you face opponents in games that test individual skill.",
    },
    {
      imageUrl: rankedIntroUrl("earn-rank"),
      wingVideoSrc: rankedWingVideoUrl(tier),
      title: "Start Your Climb",
      description:
        "Play placement games to earn your rank. During placements, games have bonus LP gains and no LP losses. You'll unlock a provisional rank after your first placement game.",
    },
    {
      imageUrl: loadingArtUrl("Sivir", 0),
      title: "Earn Rewards",
      description:
        "This season, unlock rewards across splits and at the end of the season. Finishing Gold or above in any ranked queue unlocks a Victorious skin.",
    },
  ];
}

const MILESTONES_DEFAULT = [
  { label: "0/150 SP", reached: false },
  { label: "250 SP",   reached: false },
  { label: "500 SP",   reached: false },
];

const MILESTONES_IN_PROGRESS = [
  { label: "0/150 SP", reached: true  },
  { label: "250 SP",   reached: false },
  { label: "500 SP",   reached: false },
];

const MILESTONES_COMPLETE = [
  { label: "0/150 SP", reached: true },
  { label: "250 SP",   reached: true },
  { label: "500 SP",   reached: true },
];

// ---------------------------------------------------------------------------
// Demo components (one per variant)
// ---------------------------------------------------------------------------

export function ProfileRankedDefaultDemo() {
  return (
    <div className="h-[540px] w-full">
      <ProfileRankedScreen
        season="2019 Season"
        queueType="Solo/Duo"
        featureColumns={FEATURE_COLUMNS}
        splitProgress={{
          splitLabel: "Split 2 of 2",
          timeRemaining: "12D 4H 16M",
          currentSP: 0,
          milestones: MILESTONES_DEFAULT,
        }}
        onQueueUp={() => {}}
        onSearchSummoner={() => {}}
      />
    </div>
  );
}

export function ProfileRankedInProgressDemo() {
  return (
    <div className="h-[540px] w-full">
      <ProfileRankedScreen
        season="2019 Season"
        queueType="Solo/Duo"
        featureColumns={FEATURE_COLUMNS}
        splitProgress={{
          splitLabel: "Split 2 of 2",
          timeRemaining: "5D 12H 0M",
          currentSP: 180,
          milestones: MILESTONES_IN_PROGRESS,
        }}
        onQueueUp={() => {}}
        onSearchSummoner={() => {}}
      />
    </div>
  );
}

export function ProfileRankedSplitCompleteDemo() {
  return (
    <div className="h-[540px] w-full">
      <ProfileRankedScreen
        season="2019 Season"
        queueType="Solo/Duo"
        featureColumns={FEATURE_COLUMNS}
        splitProgress={{
          splitLabel: "Split 2 of 2",
          timeRemaining: "0D 0H 0M",
          currentSP: 500,
          milestones: MILESTONES_COMPLETE,
        }}
        onQueueUp={() => {}}
        onSearchSummoner={() => {}}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Animated emblem-wings variants (issue #315) — the middle "Start Your Climb"
// tile overlays the real client's ranked-emblem wings webm on the crest art.
// ---------------------------------------------------------------------------

function ProfileRankedWingsDemo({ tier }: { tier: RankedWingTier }) {
  return (
    <div className="h-[540px] w-full">
      <ProfileRankedScreen
        season="2019 Season"
        queueType="Solo/Duo"
        featureColumns={wingFeatureColumns(tier)}
        splitProgress={{
          splitLabel: "Split 2 of 2",
          timeRemaining: "12D 4H 16M",
          currentSP: 0,
          milestones: MILESTONES_DEFAULT,
        }}
        onQueueUp={() => {}}
        onSearchSummoner={() => {}}
      />
    </div>
  );
}

export function ProfileRankedWingsGoldDemo() {
  return <ProfileRankedWingsDemo tier="gold" />;
}

export function ProfileRankedWingsEmeraldDemo() {
  return <ProfileRankedWingsDemo tier="emerald" />;
}

export function ProfileRankedWingsChallengerDemo() {
  return <ProfileRankedWingsDemo tier="challenger" />;
}
