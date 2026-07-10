"use client";

import { useState } from "react";
import { demoSummoner, demoFriends, profileIconUrl } from "@low/fixtures";
import { LobbyPlayerCard } from "./lobby-player-card";
import { RoleSelector } from "./role-selector";
import type { Role } from "./role-selector";

// ---------------------------------------------------------------------------
// Filled — interactive role selector
// ---------------------------------------------------------------------------

/** Filled card with a live RoleSelector in the role slot. */
export function LobbyPlayerCardFilledDemo() {
  const [selected, setSelected] = useState<Role | null>("mid");

  return (
    <div className="p-6">
      <LobbyPlayerCard
        summoner={demoSummoner}
        profileIconSrc={profileIconUrl(demoSummoner.profileIconId)}
        roleSlot={
          <RoleSelector
            label="Primary role"
            selected={selected}
            onSelect={setSelected}
          />
        }
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Filled emphasized (self / leader)
// ---------------------------------------------------------------------------

/** Filled card with emphasized=true (gold-4 border). */
export function LobbyPlayerCardEmphasizedDemo() {
  const [selected, setSelected] = useState<Role | null>("top");

  return (
    <div className="p-6">
      <LobbyPlayerCard
        summoner={demoSummoner}
        profileIconSrc={profileIconUrl(demoSummoner.profileIconId)}
        emphasized
        roleSlot={
          <RoleSelector
            label="Primary role"
            selected={selected}
            onSelect={setSelected}
          />
        }
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Long name truncation
// ---------------------------------------------------------------------------

/** Filled card with a very long gameName to demonstrate truncation. */
export function LobbyPlayerCardLongNameDemo() {
  const longNameSummoner = {
    ...demoFriends[0]!.summoner,
    gameName: "VeryLongSummonerNameThatOverflows",
    tagLine: "LAS1",
  };

  return (
    <div className="p-6">
      <LobbyPlayerCard
        summoner={longNameSummoner}
        profileIconSrc={profileIconUrl(longNameSummoner.profileIconId)}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty slot — interactive
// ---------------------------------------------------------------------------

/** Empty invite slot — click logs to console. */
export function LobbyPlayerCardEmptyDemo() {
  const [invited, setInvited] = useState(false);

  return (
    <div className="flex flex-col items-center gap-3 p-6">
      <LobbyPlayerCard onInvite={() => setInvited(true)} />
      {invited && (
        <p className="font-body text-xs text-gold-2">Invite dialog would open.</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Full lobby row — 5 cards
// ---------------------------------------------------------------------------

const lobbyMembers = [
  { summoner: demoSummoner, role: "mid" as Role, emphasized: true },
  { summoner: demoFriends[0]!.summoner, role: "jungle" as Role },
  { summoner: demoFriends[1]!.summoner, role: "bottom" as Role },
  null,
  null,
];

/** A full lobby row: 3 filled cards + 2 empty invite slots. */
export function LobbyPlayerCardRowDemo() {
  const [roles, setRoles] = useState<(Role | null)[]>(
    lobbyMembers.map((m) => (m ? m.role : null))
  );

  return (
    <div className="flex gap-3 p-6">
      {lobbyMembers.map((member, i) =>
        member ? (
          <LobbyPlayerCard
            key={i}
            summoner={member.summoner}
            profileIconSrc={profileIconUrl(member.summoner.profileIconId)}
            emphasized={member.emphasized}
            roleSlot={
              <RoleSelector
                label="Primary role"
                selected={roles[i] ?? null}
                onSelect={(role) =>
                  setRoles((prev) => {
                    const next = [...prev];
                    next[i] = role;
                    return next;
                  })
                }
              />
            }
          />
        ) : (
          <LobbyPlayerCard key={i} onInvite={() => {}} />
        )
      )}
    </div>
  );
}
