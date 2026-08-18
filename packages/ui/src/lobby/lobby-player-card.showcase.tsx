import { profileIconUrl } from "@low/fixtures";
import type { ShowcaseEntry } from "../showcase";
import { LobbyPlayerCard } from "./lobby-player-card";
import {
  LobbyPlayerCardFilledDemo,
  LobbyPlayerCardEmphasizedDemo,
  LobbyPlayerCardLongNameDemo,
  LobbyPlayerCardEmptyDemo,
  LobbyPlayerCardRowDemo,
} from "./lobby-player-card.demo";

export const lobbyPlayerCardShowcase: ShowcaseEntry = {
  slug: "lobby-player-card",
  name: "Lobby Player Card",
  area: "lobby",
  description:
    "Vertical player card in the pre-game lobby: profile icon with level pill, gameName#tagLine, and a role-picker slot. Empty slots invite a friend.",
  variants: [
    {
      name: "Filled — interactive",
      notes: "Filled card with a live RoleSelector injected via roleSlot.",
      render: () => <LobbyPlayerCardFilledDemo />,
    },
    {
      name: "Filled — emphasized (self / leader)",
      notes: "emphasized=true brightens the border to gold-4.",
      render: () => <LobbyPlayerCardEmphasizedDemo />,
    },
    {
      name: "Filled — no role slot",
      notes: "roleSlot omitted; role area is empty.",
      render: () => (
        <div className="p-6">
          <LobbyPlayerCard
            summoner={{
              gameName: "Matintosh",
              tagLine: "LAS",
              level: 247,
              profileIconId: 5212,
              availability: "online",
            }}
            profileIconSrc={profileIconUrl(5212)}
          />
        </div>
      ),
    },
    {
      name: "Filled — long name truncation",
      notes: "gameName overflows — truncated with ellipsis.",
      render: () => <LobbyPlayerCardLongNameDemo />,
    },
    {
      name: "Empty slot",
      notes: "summoner=undefined → circular ~120px button, dashed border, + glyph only. Calls onInvite.",
      render: () => <LobbyPlayerCardEmptyDemo />,
    },
    {
      name: "Full lobby row",
      notes: "3 filled cards (first is leader/self) + 2 empty invite slots.",
      render: () => <LobbyPlayerCardRowDemo />,
    },
  ],
};
