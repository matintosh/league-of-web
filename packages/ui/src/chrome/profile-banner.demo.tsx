"use client";

import { ProfileBanner } from "./profile-banner";
import { profileIconUrl } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Stat icon glyphs — inline SVGs (aria-hidden, purely decorative)
// ---------------------------------------------------------------------------

function ChampionIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.25" />
      <path d="M4 8h8M8 4v8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function HonorIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2l1.5 4h4l-3.25 2.5L11.5 13 8 10.5 4.5 13l1.25-4.5L2.5 6h4L8 2Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
    </svg>
  );
}

function RerollIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8a5 5 0 1 1 1.5 3.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M3 12V8.5h3.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const DEMO_STATS = [
  { icon: <ChampionIcon />, value: 4,  label: "Champions mastered" },
  { icon: <HonorIcon />,    value: 2,  label: "Honor count" },
  { icon: <RerollIcon />,   value: 0,  label: "Rerolls available" },
];

// ---------------------------------------------------------------------------
// Named demo variants
// ---------------------------------------------------------------------------

export function ProfileBannerDefaultDemo() {
  return (
    <div className="bg-hextech-black p-4">
      <ProfileBanner
        name="cherwood"
        level={15}
        xpFraction={0.45}
        profileIconSrc={profileIconUrl(5212)}
        stats={DEMO_STATS}
      />
    </div>
  );
}

export function ProfileBannerHighLevelDemo() {
  return (
    <div className="bg-hextech-black p-4">
      <ProfileBanner
        name="Matintosh"
        level={247}
        xpFraction={0.92}
        profileIconSrc={profileIconUrl(5212)}
        stats={DEMO_STATS}
      />
    </div>
  );
}

export function ProfileBannerNoStatsDemo() {
  return (
    <div className="bg-hextech-black p-4">
      <ProfileBanner
        name="Faker"
        level={812}
        xpFraction={0.1}
        profileIconSrc={profileIconUrl(6402)}
      />
    </div>
  );
}

export function ProfileBannerLongNameDemo() {
  return (
    <div className="bg-hextech-black p-4">
      <ProfileBanner
        name="VeryLongSummonerNameThatShouldTruncate"
        level={53}
        xpFraction={0.6}
        profileIconSrc={profileIconUrl(1)}
        stats={DEMO_STATS}
      />
    </div>
  );
}

export function ProfileBannerEmptyXpDemo() {
  return (
    <div className="bg-hextech-black p-4">
      <ProfileBanner
        name="NewSummoner"
        level={1}
        xpFraction={0}
        profileIconSrc={profileIconUrl(29)}
      />
    </div>
  );
}
