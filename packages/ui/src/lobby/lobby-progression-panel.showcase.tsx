import type { ShowcaseEntry } from "../showcase";
import {
  LobbyProgressionPanelDefaultDemo,
  LobbyProgressionPanelMixedDemo,
  LobbyProgressionPanelLongDemo,
  LobbyProgressionPanelInvitedEmptyDemo,
  LobbyProgressionPanelInvitedListDemo,
  LobbyProgressionPanelInteractiveDemo,
} from "./lobby-progression-panel.demo";

export const lobbyProgressionPanelShowcase: ShowcaseEntry = {
  slug: "lobby-progression-panel",
  name: "Lobby Progression Panel",
  area: "lobby",
  description:
    "The 2025 bottom-right lobby panel: a Progression / Invited (N) tab strip with a ▾ dropdown chevron. Progression body is a mission-card list — a gold circular check medallion, a two-line title/objective, and a right-side 'N' stacked-card badge + blue check disc. Invited body is a name list with an empty state. Presentational, tokens only.",
  referenceImage: "client-current-lobby-2025.png",
  referenceNote: "Bottom-right panel (crop: lobby-progression.png).",
  variants: [
    {
      name: "Progression — completed mission (reference)",
      notes:
        "Progression tab active (gold underline). One completed 'Seasonal Victorious / Win 15 Ranked games' row: token gold-check medallion + '2' stacked-card badge + blue check disc. Invited (0).",
      render: () => <LobbyProgressionPanelDefaultDemo />,
    },
    {
      name: "Progression — complete + in-progress",
      notes:
        "Two rows: the completed reference mission (token check medallion) and an in-progress row using a real challenge-token crest (challengeTokenUrl). complete=false dims the fallback medallion check.",
      render: () => <LobbyProgressionPanelMixedDemo />,
    },
    {
      name: "Progression — long title (truncate)",
      notes:
        "Overlong title + objective — both lines truncate with ellipsis; medallion and right badges never shift.",
      render: () => <LobbyProgressionPanelLongDemo />,
    },
    {
      name: "Invited — empty (0)",
      notes:
        "Invited tab active with count 0 — empty-state 'No pending invites' line.",
      render: () => <LobbyProgressionPanelInvitedEmptyDemo />,
    },
    {
      name: "Invited — name list (≥1)",
      notes:
        "Invited tab active with one pending invite — checkmark + name row.",
      render: () => <LobbyProgressionPanelInvitedListDemo />,
    },
    {
      name: "Interactive tabs",
      notes:
        "Live controlled demo — click Progression / Invited to switch the body. aria-selected reflects state.",
      render: () => <LobbyProgressionPanelInteractiveDemo />,
    },
  ],
};
