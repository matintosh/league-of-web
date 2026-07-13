import type { ShowcaseEntry } from "../showcase";
import {
  ClashScreenPreLockInDemo,
  ClashScreenAllLockedInDemo,
  ClashScreenTicketRequiredDemo,
  ClashScreenCountdownToMatchDemo,
} from "./clash-screen.demo";

export const clashScreenShowcase: ShowcaseEntry = {
  slug: "clash-screen",
  name: "ClashScreen",
  area: "chrome",
  description:
    "2019 Clash Beta tournament registration + team management screen. Left panel: sub-tabs (TOURNAMENTS/TEAM/BRACKET) + tournament card with reward art, ticket count, bracket size, and pagination. Center panel: team header with logo/tag/tier, 5-player roster with role icons and lock status, countdown, and LOCK IN action bar.",
  variants: [
    {
      name: "Pre lock-in — mixed statuses (locked-in / not-locked-in / ticket-required / pending)",
      notes:
        "Matches docs/reference/client-clash-team-creation.png. TOURNAMENTS sub-tab active. Two players not locked in, one pending, one ticket-required.",
      render: () => <ClashScreenPreLockInDemo />,
    },
    {
      name: "All locked in — countdown to scouting",
      notes:
        "All 5 players show Locked In status. TOURNAMENTS sub-tab active. Tier II team.",
      render: () => <ClashScreenAllLockedInDemo />,
    },
    {
      name: "Ticket required — local player needs ticket",
      notes:
        "Local player row shows Ticket Required. TEAM sub-tab active.",
      render: () => <ClashScreenTicketRequiredDemo />,
    },
    {
      name: "Countdown to match — BRACKET sub-tab active",
      notes:
        "All locked in. Countdown shows 'Until Match Starts'. BRACKET sub-tab active. Different team name/tier (Trinity Fire, Tier IV).",
      render: () => <ClashScreenCountdownToMatchDemo />,
    },
  ],
};
