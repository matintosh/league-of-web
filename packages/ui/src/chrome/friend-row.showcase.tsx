import type { ShowcaseEntry } from "../showcase";
import { demoFriends, demoSummoner, profileIconUrl } from "@low/fixtures";
import { FriendRow } from "./friend-row";
import { FriendRowClickableDemo } from "./friend-row.demo";

// demoFriends order: Faker=in-game [0], Tyler1=in-queue [1], Baus=away [2],
// Doublelift=online [3], Sneaky=offline [4]
const inGameFriend = demoFriends[0]!;
const inQueueFriend = demoFriends[1]!;
const awayFriend = demoFriends[2]!;
const offlineFriend = demoFriends[4]!;

export const friendRowShowcase: ShowcaseEntry = {
  slug: "friend-row",
  name: "FriendRow",
  area: "chrome",
  description:
    "Single row in the social sidebar friends list — 30px circular avatar with a presence-colored ring + status pip, name, and colored status line (current-era slim metrics: 48px pitch). Offline avatars are dimmed with a neutral grey ring and no pip.",
  variants: [
    {
      name: "Online",
      notes:
        "Full-color avatar, status-online green ring + pip, grey-1 name, status text in status-online green. availability=online.",
      render: () => (
        <div className="w-56 bg-blue-7">
          <FriendRow
            summoner={demoSummoner}
            statusText="Online"
            profileIconSrc={profileIconUrl(demoSummoner.profileIconId)}
          />
        </div>
      ),
    },
    {
      name: "In Game",
      notes:
        "Full-color avatar, bright cyan (blue-2) ring + pip and status text, matched to the current-era reference rgb(21,194,221). Faker, availability=in-game.",
      render: () => (
        <div className="w-56 bg-blue-7">
          <FriendRow
            summoner={inGameFriend.summoner}
            statusText={inGameFriend.statusText ?? "League of Legends"}
            profileIconSrc={profileIconUrl(inGameFriend.summoner.profileIconId)}
          />
        </div>
      ),
    },
    {
      name: "In Queue",
      notes:
        "Full-color avatar, blue-2 cyan ring + pip and status text (same active-cyan family as in-game). Tyler1, availability=in-queue.",
      render: () => (
        <div className="w-56 bg-blue-7">
          <FriendRow
            summoner={inQueueFriend.summoner}
            statusText={inQueueFriend.statusText ?? "Ranked Solo/Duo"}
            profileIconSrc={profileIconUrl(inQueueFriend.summoner.profileIconId)}
          />
        </div>
      ),
    },
    {
      name: "Away",
      notes:
        "Full-color avatar, gold-3 amber ring + pip and status text. Baus, availability=away.",
      render: () => (
        <div className="w-56 bg-blue-7">
          <FriendRow
            summoner={awayFriend.summoner}
            statusText="Away"
            profileIconSrc={profileIconUrl(awayFriend.summoner.profileIconId)}
          />
        </div>
      ),
    },
    {
      name: "Offline",
      notes:
        "Avatar dimmed with brightness-50 + grayscale-[0.4], neutral grey-2 ring and NO pip, grey-2 name and status text. Sneaky, availability=offline.",
      render: () => (
        <div className="w-56 bg-blue-7">
          <FriendRow
            summoner={offlineFriend.summoner}
            statusText="Offline"
            profileIconSrc={profileIconUrl(offlineFriend.summoner.profileIconId)}
          />
        </div>
      ),
    },
    {
      name: "Clickable",
      notes:
        "onClick provided → renders as <button> with aria-label. Click logs to console.",
      render: () => (
        <div className="w-56 bg-blue-7">
          <FriendRowClickableDemo />
        </div>
      ),
    },
    {
      name: "Stack of 5 (sidebar replica)",
      notes:
        "Five-friend list matching the reference screenshot rows — one in-game, four offline. Hover any row to see bg-grey-cool.",
      render: () => (
        <div
          data-shot="friend-row-stack"
          className="w-56 bg-blue-7 py-1"
        >
          {/* In-game friend */}
          <FriendRow
            summoner={inGameFriend.summoner}
            statusText="League of Legends"
            profileIconSrc={profileIconUrl(inGameFriend.summoner.profileIconId)}
          />
          {/* Offline friends */}
          {demoFriends.slice(1).map((f) => (
            <FriendRow
              key={f.summoner.gameName}
              summoner={f.summoner}
              statusText={f.summoner.availability === "offline" ? "Offline" : (f.statusText ?? f.summoner.availability)}
              profileIconSrc={profileIconUrl(f.summoner.profileIconId)}
            />
          ))}
          {/* Extra offline entry to reach 5 rows */}
          <FriendRow
            summoner={{
              gameName: "Spaceduck",
              tagLine: "EUW",
              level: 310,
              profileIconId: 29,
              availability: "offline",
            }}
            statusText="Offline"
            profileIconSrc={profileIconUrl(29)}
          />
        </div>
      ),
    },
  ],
};
