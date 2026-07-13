"use client";

import { useState } from "react";
import { ClashScreen } from "./clash-screen";
import type { ClashPlayer, ClashTeam, ClashTournament, ClashSubTab, ClashScoutingTab } from "./clash-screen";
import { profileIconUrl, positionIconUrl, championSquareUrl, rankedEmblemUrl } from "@low/fixtures";
import type { ClashScoutingPlayer } from "@low/fixtures";

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

// ---------------------------------------------------------------------------
// Scouting phase fixture data
// Matches docs/reference/client-clash-scouting.png (Trinity Fire vs 5 opponents)
// ---------------------------------------------------------------------------

const SCOUTING_OPPONENTS: ClashScoutingPlayer[] = [
  {
    summonerName: "whostolebaron",
    rankLabel: "Gold IV",
    rankEmblemSrc: rankedEmblemUrl("Gold"),
    champions: [
      { iconSrc: championSquareUrl("Vayne"),     winPct: 56, games: 167, kda: 3.7 },
      { iconSrc: championSquareUrl("Jinx"),      winPct: 49, games: 127, kda: 6.7 },
      { iconSrc: championSquareUrl("Caitlyn"),   winPct: 45, games: 89,  kda: 4.6 },
      { iconSrc: championSquareUrl("Ashe"),      winPct: 56, games: 36,  kda: 4.9 },
    ],
  },
  {
    summonerName: "TwinkleToes",
    rankLabel: "Silver IV",
    rankEmblemSrc: rankedEmblemUrl("Silver"),
    champions: [
      { iconSrc: championSquareUrl("Ahri"),      winPct: 58, games: 131, kda: 5.2 },
      { iconSrc: championSquareUrl("Lux"),       winPct: 60, games: 89,  kda: 7.0 },
      { iconSrc: championSquareUrl("Orianna"),   winPct: 62, games: 43,  kda: 5.7 },
      { iconSrc: championSquareUrl("Syndra"),    winPct: 69, games: 42,  kda: 5.4 },
    ],
  },
  {
    summonerName: "TankyBits",
    rankLabel: "Silver I",
    rankEmblemSrc: rankedEmblemUrl("Silver"),
    champions: [
      { iconSrc: championSquareUrl("Malphite"),  winPct: 45, games: 733, kda: 3.6 },
      { iconSrc: championSquareUrl("Garen"),     winPct: 56, games: 91,  kda: 2.1 },
      { iconSrc: championSquareUrl("Nasus"),     winPct: 29, games: 7,   kda: 1.1 },
      { iconSrc: championSquareUrl("Sion"),      winPct: 14, games: 7,   kda: 1.7 },
    ],
  },
  {
    summonerName: "CaffeinatedGanks",
    rankLabel: "Gold III",
    rankEmblemSrc: rankedEmblemUrl("Gold"),
    champions: [
      { iconSrc: championSquareUrl("Khazix"),    winPct: 54, games: 174, kda: 2.7 },
      { iconSrc: championSquareUrl("Elise"),     winPct: 50, games: 48,  kda: 3.1 },
      { iconSrc: championSquareUrl("Rengar"),    winPct: 44, games: 36,  kda: 2.9 },
      { iconSrc: championSquareUrl("Nidalee"),   winPct: 48, games: 33,  kda: 3.7 },
    ],
  },
  {
    summonerName: "ToasterMiner",
    rankLabel: "Silver III",
    rankEmblemSrc: rankedEmblemUrl("Silver"),
    champions: [
      { iconSrc: championSquareUrl("Thresh"),    winPct: 50, games: 120, kda: 3.1 },
      { iconSrc: championSquareUrl("Leona"),     winPct: 56, games: 75,  kda: 2.3 },
      { iconSrc: championSquareUrl("Blitzcrank"),winPct: 62, games: 66,  kda: 3.2 },
      { iconSrc: championSquareUrl("Morgana"),   winPct: 57, games: 54,  kda: 4.7 },
    ],
  },
];

const SCOUTING_TEAM: ClashTeam = {
  tag:     "TTF",
  name:    "Trinity Fire",
  tier:    "IV",
  logoSrc: "",
};

export function ClashScreenScoutingDemo() {
  const [activeSubTab, setActiveSubTab] = useState<ClashSubTab>("tournaments");
  const [scoutingTab, setScoutingTab] = useState<ClashScoutingTab>("ranked");
  return (
    <div style={{ height: 665 }}>
      <ClashScreen
        tournament={{ ...DEMO_TOURNAMENT, name: "Noxian Wars" }}
        team={SCOUTING_TEAM}
        players={PLAYERS_ALL_LOCKEDIN}
        countdownLabel="0m 00s"
        countdownSublabel="Scouting Phase"
        activeSubTab={activeSubTab}
        onSubTabChange={setActiveSubTab}
        onLockIn={() => console.log("clash: lock in")}
        onLeaveTeam={() => console.log("clash: leave team")}
        scoutingPhase
        opponents={SCOUTING_OPPONENTS}
        scoutingTab={scoutingTab}
        onScoutingTabChange={setScoutingTab}
      />
    </div>
  );
}
