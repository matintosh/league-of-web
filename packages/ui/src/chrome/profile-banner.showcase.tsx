import type { ShowcaseEntry } from "../showcase";
import {
  ProfileBannerDefaultDemo,
  ProfileBannerHighLevelDemo,
  ProfileBannerNoStatsDemo,
  ProfileBannerLongNameDemo,
  ProfileBannerEmptyXpDemo,
} from "./profile-banner.demo";

export const profileBannerShowcase: ShowcaseEntry = {
  slug: "profile-banner",
  name: "Profile Banner",
  area: "chrome",
  description:
    "Left-column identity panel on the Profile Overview page. Summoner name (gold-1 display), level XP bar, ornate 180px ring medallion with profile icon and level badge, V-ornament, and optional stat icon row.",
  variants: [
    {
      name: "Level 15 — partial XP, with stats",
      notes: "xpFraction=0.45. Shows all stat glyphs at the bottom.",
      render: () => <ProfileBannerDefaultDemo />,
    },
    {
      name: "High-level summoner — full XP bar",
      notes: "xpFraction=0.92, level=247 (demoSummoner).",
      render: () => <ProfileBannerHighLevelDemo />,
    },
    {
      name: "Without stat row",
      notes: "stats prop omitted — stat row is absent.",
      render: () => <ProfileBannerNoStatsDemo />,
    },
    {
      name: "Long summoner name — truncation",
      notes: "Name wider than 260px column — must truncate with ellipsis.",
      render: () => <ProfileBannerLongNameDemo />,
    },
    {
      name: "Empty XP bar (just leveled up)",
      notes: "xpFraction=0, level=1.",
      render: () => <ProfileBannerEmptyXpDemo />,
    },
  ],
};
