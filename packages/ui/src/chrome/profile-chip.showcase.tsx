import type { ShowcaseEntry } from "../showcase";
import {
  ProfileChipOnlineDemo,
  ProfileChipAwayDemo,
  ProfileChipInGameDemo,
  ProfileChipOfflineDemo,
  ProfileChipLongNameDemo,
  ProfileChipStatusTextDemo,
  ProfileChipRailBorderDemo,
  ProfileChipNavbandDemo,
  ProfileChipNavbandInGameDemo,
  ProfileChipNavbandStatusTextDemo,
} from "./profile-chip.demo";

export const profileChipShowcase: ShowcaseEntry = {
  slug: "profile-chip",
  name: "Profile Chip",
  area: "chrome",
  description:
    "Local player identity: circular avatar framed by the real client themed-border (avatarBorderUrl, #489) — with a hand-drawn OrnateRing fallback when no border src is given — plus level badge, summoner name, availability dot, and notification bell. Two variants — 'rail' (social-rail header, #146) and 'navband' (compact current-era chip in the TopNavbar band, #387).",
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
      name: "Rail — real themed border (#489)",
      notes:
        "Rail variant with the REAL client themed-border frame via `avatarBorderSrc={avatarBorderUrl(3)}` (theme-3: gold ring + cyan accents + level-plate) — supersedes the hand-drawn OrnateRing. The 512px PNG is only downscaled (to a ~137px border box for the 48px avatar), so it stays crisp; the avatar seats concentrically inside the ring's transparent centre while the frame's wings/plate overflow the avatar box. Omit avatarBorderSrc (the other rail demos above) to keep the drawn-ring fallback.",
      render: () => <ProfileChipRailBorderDemo />,
    },
    {
      name: "Navband — Online",
      notes:
        "variant='navband': the current-era compact chip that sits at the top-right of the TopNavbar band (#387). 34px avatar, cream (gold-1) name, green 'Online' status, transparent background. Bell uses the real-client `notifications_button_icon` mask glyph (#399) via `notificationBellSrc={notificationBellUrl()}` — tinted through CSS mask-image so it keeps the grey-1 → gold-1 hover. Shown over bg-blue-7 to mimic the nav band.",
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
