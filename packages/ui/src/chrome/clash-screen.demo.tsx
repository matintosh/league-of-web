"use client";

import { useState } from "react";
import { ClashScreen } from "./clash-screen";
import type { ClashPlayer, ClashTeam, ClashTournament, ClashSubTab } from "./clash-screen";
import { profileIconUrl, positionIconUrl } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Shared fixture data
// ---------------------------------------------------------------------------

const DEMO_TOURNAMENT: ClashTournament = {
  name: "Demacian Cup",
  week: 1,
  day: 2,
  ticketCount: 47,
  bracketSize: 8,
  rewardMultiplier: 5,
  rewardLabel: "Team Member",
};

const DEMO_TEAM: ClashTeam = {
  tag: "TTM",
  name: "Team Taco Meat",
  tier: "III",
  logoSrc: "",
};

const PLAYERS_PRE_LOCKIN: ClashPlayer[] = [
  {
    summonerName: "PotatoPlayer123",
    championIconSrc: profileIconUrl(4217),
    roleIconSrc: positionIconUrl("top"),
    status: "locked-in",
    isLocalPlayer: true,
  },
  {
    summonerName: "AlphaJungler",
    championIconSrc: profileIconUrl(1),
    roleIconSrc: positionIconUrl("jungle"),
    status: "not-locked-in",
  },
  {
    summonerName: "MidOrFeed99",
    roleIconSrc: positionIconUrl("middle"),
    status: "ticket-required",
  },
  {
    summonerName: "BotCarry",
    roleIconSrc: positionIconUrl("bottom"),
    status: "pending",
  },
  {
    summonerName: "SupportGod",
    championIconSrc: profileIconUrl(24),
    roleIconSrc: positionIconUrl("utility"),
    status: "not-locked-in",
  },
];

const PLAYERS_ALL_LOCKEDIN: ClashPlayer[] = [
  {
    summonerName: "PotatoPlayer123",
    championIconSrc: profileIconUrl(4217),
    roleIconSrc: positionIconUrl("top"),
    status: "locked-in",
    isLocalPlayer: true,
  },
  {
    summonerName: "AlphaJungler",
    championIconSrc: profileIconUrl(1),
    roleIconSrc: positionIconUrl("jungle"),
    status: "locked-in",
  },
  {
    summonerName: "MidOrFeed99",
    championIconSrc: profileIconUrl(24),
    roleIconSrc: positionIconUrl("middle"),
    status: "locked-in",
  },
  {
    summonerName: "BotCarry",
    championIconSrc: profileIconUrl(7),
    roleIconSrc: positionIconUrl("bottom"),
    status: "locked-in",
  },
  {
    summonerName: "SupportGod",
    championIconSrc: profileIconUrl(16),
    roleIconSrc: positionIconUrl("utility"),
    status: "locked-in",
  },
];

const PLAYERS_TICKET_REQUIRED: ClashPlayer[] = [
  {
    summonerName: "PotatoPlayer123",
    championIconSrc: profileIconUrl(4217),
    roleIconSrc: positionIconUrl("top"),
    status: "ticket-required",
    isLocalPlayer: true,
  },
  {
    summonerName: "AlphaJungler",
    championIconSrc: profileIconUrl(1),
    roleIconSrc: positionIconUrl("jungle"),
    status: "not-locked-in",
  },
  {
    summonerName: "MidOrFeed99",
    roleIconSrc: positionIconUrl("middle"),
    status: "ticket-required",
  },
  {
    summonerName: "BotCarry",
    roleIconSrc: positionIconUrl("bottom"),
    status: "pending",
  },
  {
    summonerName: "SupportGod",
    roleIconSrc: positionIconUrl("utility"),
    status: "not-locked-in",
  },
];

// ---------------------------------------------------------------------------
// Demos
// ---------------------------------------------------------------------------

export function ClashScreenPreLockInDemo() {
  const [activeSubTab, setActiveSubTab] = useState<ClashSubTab>("tournaments");
  return (
    <div style={{ height: 665 }}>
      <ClashScreen
        tournament={DEMO_TOURNAMENT}
        team={DEMO_TEAM}
        players={PLAYERS_PRE_LOCKIN}
        countdownLabel="15m 38s"
        countdownSublabel="Until Scouting Starts"
        scoutingTime="7:00 pm"
        matchStartTime="7:07 pm"
        activeSubTab={activeSubTab}
        onSubTabChange={setActiveSubTab}
        onLockIn={() => console.log("clash: lock in")}
        onLeaveTeam={() => console.log("clash: leave team")}
      />
    </div>
  );
}

export function ClashScreenAllLockedInDemo() {
  const [activeSubTab, setActiveSubTab] = useState<ClashSubTab>("tournaments");
  return (
    <div style={{ height: 665 }}>
      <ClashScreen
        tournament={DEMO_TOURNAMENT}
        team={{ ...DEMO_TEAM, tier: "II" }}
        players={PLAYERS_ALL_LOCKEDIN}
        countdownLabel="5m 12s"
        countdownSublabel="Until Scouting Starts"
        scoutingTime="7:00 pm"
        matchStartTime="7:07 pm"
        activeSubTab={activeSubTab}
        onSubTabChange={setActiveSubTab}
        onLockIn={() => console.log("clash: lock in")}
        onLeaveTeam={() => console.log("clash: leave team")}
      />
    </div>
  );
}

export function ClashScreenTicketRequiredDemo() {
  const [activeSubTab, setActiveSubTab] = useState<ClashSubTab>("team");
  return (
    <div style={{ height: 665 }}>
      <ClashScreen
        tournament={DEMO_TOURNAMENT}
        team={DEMO_TEAM}
        players={PLAYERS_TICKET_REQUIRED}
        countdownLabel="42m 00s"
        countdownSublabel="Until Lock In Closes"
        scoutingTime="8:00 pm"
        matchStartTime="8:07 pm"
        activeSubTab={activeSubTab}
        onSubTabChange={setActiveSubTab}
        onLockIn={() => console.log("clash: lock in")}
        onLeaveTeam={() => console.log("clash: leave team")}
      />
    </div>
  );
}

export function ClashScreenCountdownToMatchDemo() {
  const [activeSubTab, setActiveSubTab] = useState<ClashSubTab>("bracket");
  return (
    <div style={{ height: 665 }}>
      <ClashScreen
        tournament={{ ...DEMO_TOURNAMENT, name: "Noxian Wars" }}
        team={{ ...DEMO_TEAM, tag: "TTF", name: "Trinity Fire", tier: "IV" }}
        players={PLAYERS_ALL_LOCKEDIN}
        countdownLabel="2m 07s"
        countdownSublabel="Until Match Starts"
        matchStartTime="9:30 pm"
        activeSubTab={activeSubTab}
        onSubTabChange={setActiveSubTab}
        onLockIn={() => console.log("clash: lock in")}
        onLeaveTeam={() => console.log("clash: leave team")}
      />
    </div>
  );
}
