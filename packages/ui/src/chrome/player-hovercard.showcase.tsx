import type { ShowcaseEntry } from "../showcase";
import {
  demoSummoner,
  demoFriends,
  profileIconUrl,
} from "@low/fixtures";
import { PlayerHovercard } from "./player-hovercard";
import {
  PlayerHovercardClickableDemo,
  PlayerHovercardLongNameDemo,
} from "./player-hovercard.demo";

// Index into demoFriends to cover remaining availability states.
// demoFriends order: Faker=in-game [0], Tyler1=in-queue [1], Baus=away [2], Phreak=offline [3]
const inGameFriend = demoFriends[0]!;
const inQueueFriend = demoFriends[1]!;
const awayFriend = demoFriends[2]!;
const offlineFriend = demoFriends[3]!;

export const playerHovercardShowcase: ShowcaseEntry = {
  slug: "player-hovercard",
  name: "Player Hovercard",
  area: "chrome",
  description:
    "Compact summoner identity card showing profile icon, level badge, gameName#tagLine, and a colored availability dot — used in the navbar and friends list.",
  variants: [
    {
      name: "Online",
      notes: "Green dot (--color-status-online). demoSummoner, availability=online.",
      render: () => (
        <PlayerHovercard
          summoner={demoSummoner}
          profileIconSrc={profileIconUrl(demoSummoner.profileIconId)}
        />
      ),
    },
    {
      name: "Away",
      notes: "Amber dot (bg-gold-3). Baus, availability=away.",
      render: () => (
        <PlayerHovercard
          summoner={awayFriend.summoner}
          profileIconSrc={profileIconUrl(awayFriend.summoner.profileIconId)}
        />
      ),
    },
    {
      name: "In Game",
      notes: "Teal dot (bg-blue-2). Faker, availability=in-game.",
      render: () => (
        <PlayerHovercard
          summoner={inGameFriend.summoner}
          profileIconSrc={profileIconUrl(inGameFriend.summoner.profileIconId)}
        />
      ),
    },
    {
      name: "In Queue",
      notes: "Darker teal dot (bg-blue-3). Tyler1, availability=in-queue.",
      render: () => (
        <PlayerHovercard
          summoner={inQueueFriend.summoner}
          profileIconSrc={profileIconUrl(inQueueFriend.summoner.profileIconId)}
        />
      ),
    },
    {
      name: "Offline",
      notes: "Muted grey dot (bg-grey-2). Phreak, availability=offline.",
      render: () => (
        <PlayerHovercard
          summoner={offlineFriend.summoner}
          profileIconSrc={profileIconUrl(offlineFriend.summoner.profileIconId)}
        />
      ),
    },
    {
      name: "Clickable",
      notes: "onClick provided → renders as <button>. Logs to console on click.",
      render: () => <PlayerHovercardClickableDemo />,
    },
    {
      name: "Long Name (truncate)",
      notes: "Very long gameName in a 192px container — must truncate with ellipsis.",
      render: () => <PlayerHovercardLongNameDemo />,
    },
  ],
};
