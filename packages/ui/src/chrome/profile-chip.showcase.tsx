import type { ShowcaseEntry } from "../showcase";
import {
  ProfileChipOnlineDemo,
  ProfileChipAwayDemo,
  ProfileChipInGameDemo,
  ProfileChipOfflineDemo,
  ProfileChipLongNameDemo,
  ProfileChipStatusTextDemo,
  ProfileChipNavbandDemo,
  ProfileChipNavbandInGameDemo,
  ProfileChipNavbandStatusTextDemo,
} from "./profile-chip.demo";

export const profileChipShowcase: ShowcaseEntry = {
  slug: "profile-chip",
  name: "Profile Chip",
  area: "chrome",
  description:
    "Local player identity: circular avatar with ornate double gold ring, level badge, summoner name, availability dot, and notification bell. Two variants — 'rail' (social-rail header, #146) and 'navband' (compact current-era chip in the TopNavbar band, #387).",
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
    {
      name: "Custom statusText (truncate)",
      notes:
        "statusText prop replaces the availability label with a custom string. Dot color still reflects availability (online=green). Long text truncates within the chip width — chip width must not grow.",
      render: () => <ProfileChipStatusTextDemo />,
    },
    {
      name: "Navband — Online",
      notes:
        "variant='navband': the current-era compact chip that sits at the top-right of the TopNavbar band (#387). 34px avatar, cream (gold-1) name, green 'Online' status, transparent background. Shown over bg-blue-7 to mimic the nav band.",
      render: () => <ProfileChipNavbandDemo />,
    },
    {
      name: "Navband — In Game",
      notes:
        "Navband variant with availability=in-game — status text tints teal (text-blue-2) to match its dot.",
      render: () => <ProfileChipNavbandInGameDemo />,
    },
    {
      name: "Navband — Custom statusText",
      notes:
        "Navband variant with a custom statusText ('In Queue'). Dot color still reflects true availability (online=green).",
      render: () => <ProfileChipNavbandStatusTextDemo />,
    },
  ],
};
