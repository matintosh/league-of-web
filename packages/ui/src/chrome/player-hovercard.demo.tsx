"use client";

import { demoSummoner, profileIconUrl } from "@low/fixtures";
import { PlayerHovercard } from "./player-hovercard";
import type { Summoner } from "@low/fixtures";

/** Demo that wires up an onClick handler to show button semantics. */
export function PlayerHovercardClickableDemo() {
  const src = profileIconUrl(demoSummoner.profileIconId);
  return (
    <PlayerHovercard
      summoner={demoSummoner}
      profileIconSrc={src}
      onClick={() => console.log("open profile panel")}
    />
  );
}

/** Demo for a summoner with a very long gameName — verifies truncation. */
export function PlayerHovercardLongNameDemo() {
  const longName: Summoner = {
    ...demoSummoner,
    gameName: "AVeryLongSummonerNameThatShouldTruncate",
    tagLine: "NA1",
  };
  const src = profileIconUrl(longName.profileIconId);
  return (
    <div className="w-48">
      <PlayerHovercard summoner={longName} profileIconSrc={src} />
    </div>
  );
}
