import type { ShowcaseEntry } from "../showcase";
import {
  LobbyHeaderDefaultDemo,
  LobbyHeaderNoCrestDemo,
  LobbyHeaderPartyOpenDemo,
  LobbyHeaderInteractiveDemo,
  LobbyHeaderLongTitleDemo,
  LobbyHeaderSegmentedDemo,
  LobbyHeaderSegmentsNoCMDemo,
  LobbyHeader2025DefaultDemo,
  LobbyHeader2025PartyOpenDemo,
  LobbyHeader2025InvitePermissionDemo,
  LobbyHeader2025InteractiveDemo,
  LobbyHeader2025LongDemo,
} from "./lobby-header.demo";

export const lobbyHeaderShowcase: ShowcaseEntry = {
  slug: "lobby-header",
  name: "Lobby Header",
  area: "lobby",
  description:
    "Strip beneath the top navbar in the pre-game lobby. 2025 look (supply `breadcrumb`): bold gold « back · mode gem · middot breadcrumb · info circle; right cluster of copy + stats icons and a joined green toggle pair (party-privacy + invite-permission). Legacy look (no breadcrumb): ◆ segments + optional Change Mode button + single pill toggle, kept for un-migrated callers.",
  variants: [
    {
      name: "2025 — default breadcrumb",
      notes:
        "breadcrumb=['SR','RANKED SOLO/DUO','DRAFT'] with · middots, mode gem, (i). Right: copy + stats icons + joined green toggle pair (both off). NO Change Mode button.",
      render: () => <LobbyHeader2025DefaultDemo />,
    },
    {
      name: "2025 — party privacy on",
      notes:
        "partyOpen=true — left half of the green toggle pair fills status-online green with the checkmark. aria-pressed='true'.",
      render: () => <LobbyHeader2025PartyOpenDemo />,
    },
    {
      name: "2025 — invite permission on",
      notes:
        "invitePermission=true — right (person) half of the green toggle pair fills green. Independent from party privacy.",
      render: () => <LobbyHeader2025InvitePermissionDemo />,
    },
    {
      name: "2025 — interactive toggles",
      notes:
        "Live controlled demo — click either half of the green pair to toggle party privacy / invite permission independently.",
      render: () => <LobbyHeader2025InteractiveDemo />,
    },
    {
      name: "2025 — long breadcrumb (truncate)",
      notes:
        "Narrow container — middle breadcrumb segment truncates with ellipsis; right cluster never overflows.",
      render: () => <LobbyHeader2025LongDemo />,
    },
    {
      name: "Default (party closed)",
      notes:
        "Back button + SR crest + 'SR · Normal Draft' title + info circle. Pill in closed state (muted border, grey text).",
      render: () => <LobbyHeaderDefaultDemo />,
    },
    {
      name: "No crest",
      notes:
        "crestSrc omitted — layout closes the gap; title aligns directly after the back chevron.",
      render: () => <LobbyHeaderNoCrestDemo />,
    },
    {
      name: "Party open",
      notes:
        "partyOpen=true — pill border brightens to gold-3, text shifts to gold-2. aria-pressed='true'.",
      render: () => <LobbyHeaderPartyOpenDemo />,
    },
    {
      name: "Interactive pill toggle",
      notes:
        "Live controlled demo — click the pill to toggle partyOpen. aria-pressed reflects state.",
      render: () => <LobbyHeaderInteractiveDemo />,
    },
    {
      name: "Long title (truncate)",
      notes:
        "Very long title string — must truncate with ellipsis; chip width must not overflow the container.",
      render: () => <LobbyHeaderLongTitleDemo />,
    },
    {
      name: "Segmented title + Change Mode + (30) chip",
      notes:
        "segments prop: ['Intro', 'Blind', \"Summoner's Rift 5v5\"] renders with ◆ diamond separators. (30) chip + SR wings badge dead decorations. Change Mode secondary button to right of title.",
      render: () => <LobbyHeaderSegmentedDemo />,
    },
    {
      name: "Segmented title (no Change Mode)",
      notes:
        "segments without onChangeMode — button absent. Verifies additive prop is truly optional.",
      render: () => <LobbyHeaderSegmentsNoCMDemo />,
    },
  ],
};
