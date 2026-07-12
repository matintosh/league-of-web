import type { ShowcaseEntry } from "../showcase";
import {
  ProfileChipOnlineDemo,
  ProfileChipAwayDemo,
  ProfileChipInGameDemo,
  ProfileChipOfflineDemo,
  ProfileChipLongNameDemo,
} from "./profile-chip.demo";

export const profileChipShowcase: ShowcaseEntry = {
  slug: "profile-chip",
  name: "Profile Chip",
  area: "chrome",
  description:
    "Local player identity header at the top of the docked social rail. Circular avatar with ornate double gold ring, level badge, summoner name, availability dot, and notification bell.",
  variants: [
    {
      name: "Online",
      notes:
        "Green dot (bg-status-online). demoSummoner (Matintosh, level 247), availability=online.",
      render: () => <ProfileChipOnlineDemo />,
    },
    {
      name: "Away",
      notes: "Amber dot (bg-gold-3). Baus, availability=away.",
      render: () => <ProfileChipAwayDemo />,
    },
    {
      name: "In Game",
      notes: "Teal dot (bg-blue-2). Faker, availability=in-game.",
      render: () => <ProfileChipInGameDemo />,
    },
    {
      name: "Offline",
      notes: "Muted grey dot (bg-grey-2). availability=offline.",
      render: () => <ProfileChipOfflineDemo />,
    },
    {
      name: "Long Name (truncate)",
      notes:
        "Very long gameName in a 200px container — must truncate with ellipsis.",
      render: () => <ProfileChipLongNameDemo />,
    },
  ],
};
