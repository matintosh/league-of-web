"use client";

import { useState } from "react";
import { LobbyProgressionPanel } from "./lobby-progression-panel";
import type { LobbyMission, LobbyInvitedEntry } from "./lobby-progression-panel";
import { challengeTokenUrl } from "@low/fixtures";

// Fixture missions — the reference row is a completed "Seasonal Victorious"
// mission. iconSrc uses a real challenge-token crest where art is wanted; the
// default row leans on the component's token gold-check medallion.
const MISSIONS: LobbyMission[] = [
  {
    id: "seasonal-victorious",
    title: "Seasonal Victorious",
    objective: "Win 15 Ranked games",
    complete: true,
    progressBadge: "2",
  },
];

const MISSIONS_MIXED: LobbyMission[] = [
  {
    id: "seasonal-victorious",
    title: "Seasonal Victorious",
    objective: "Win 15 Ranked games",
    complete: true,
    progressBadge: "2",
  },
  {
    id: "aram-authority",
    title: "ARAM Authority",
    objective: "Reach Master in the ARAM challenge",
    iconSrc: challengeTokenUrl(101000, "challenger"),
    complete: false,
    progressBadge: "5",
  },
];

const MISSIONS_LONG: LobbyMission[] = [
  {
    id: "long",
    title: "The Extraordinarily Long Seasonal Victorious Grandmaster Mission Title",
    objective: "Win a truly excessive number of Ranked games this split to complete",
    complete: true,
    progressBadge: "12",
  },
];

const INVITED: LobbyInvitedEntry[] = [{ id: "i1", name: "Matintosh" }];

const PANEL_W = "w-[280px]";

/** Progression tab active with the reference completed mission row. */
export function LobbyProgressionPanelDefaultDemo() {
  return (
    <div className={PANEL_W}>
      <LobbyProgressionPanel
        activeTab="progression"
        onTabChange={() => {}}
        invitedCount={0}
        missions={MISSIONS}
        invited={[]}
        onMenu={() => console.log("menu")}
      />
    </div>
  );
}

/** Progression tab with a completed + in-progress mission (real crest art). */
export function LobbyProgressionPanelMixedDemo() {
  return (
    <div className={PANEL_W}>
      <LobbyProgressionPanel
        activeTab="progression"
        onTabChange={() => {}}
        invitedCount={1}
        missions={MISSIONS_MIXED}
        invited={INVITED}
        onMenu={() => {}}
      />
    </div>
  );
}

/** Long mission title/objective — both lines truncate. */
export function LobbyProgressionPanelLongDemo() {
  return (
    <div className={PANEL_W}>
      <LobbyProgressionPanel
        activeTab="progression"
        onTabChange={() => {}}
        invitedCount={0}
        missions={MISSIONS_LONG}
        invited={[]}
        onMenu={() => {}}
      />
    </div>
  );
}

/** Invited tab active, empty (count 0). */
export function LobbyProgressionPanelInvitedEmptyDemo() {
  return (
    <div className={PANEL_W}>
      <LobbyProgressionPanel
        activeTab="invited"
        onTabChange={() => {}}
        invitedCount={0}
        missions={MISSIONS}
        invited={[]}
        onMenu={() => {}}
      />
    </div>
  );
}

/** Invited tab active with one pending invite (count ≥1). */
export function LobbyProgressionPanelInvitedListDemo() {
  return (
    <div className={PANEL_W}>
      <LobbyProgressionPanel
        activeTab="invited"
        onTabChange={() => {}}
        invitedCount={1}
        missions={MISSIONS}
        invited={INVITED}
        onMenu={() => {}}
      />
    </div>
  );
}

/** Interactive — click the tabs to switch bodies. */
export function LobbyProgressionPanelInteractiveDemo() {
  const [tab, setTab] = useState<"progression" | "invited">("progression");
  return (
    <div className={PANEL_W}>
      <LobbyProgressionPanel
        activeTab={tab}
        onTabChange={setTab}
        invitedCount={INVITED.length}
        missions={MISSIONS_MIXED}
        invited={INVITED}
        onMenu={() => console.log("menu")}
      />
    </div>
  );
}
