"use client";

import { demoFriends, profileIconUrl } from "@low/fixtures";
import { FriendRow } from "./friend-row";

const clickableFriend = demoFriends[0]!; // Faker, in-game

/** Demo for the clickable variant — logs to console on click. */
export function FriendRowClickableDemo() {
  return (
    <FriendRow
      summoner={clickableFriend.summoner}
      statusText="League of Legends"
      profileIconSrc={profileIconUrl(clickableFriend.summoner.profileIconId)}
      onClick={() => console.log("FriendRow clicked:", clickableFriend.summoner.gameName)}
    />
  );
}
