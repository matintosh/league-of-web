import type { ShowcaseEntry } from "../showcase";
import {
  LobbyHeaderDefaultDemo,
  LobbyHeaderNoCrestDemo,
  LobbyHeaderPartyOpenDemo,
  LobbyHeaderInteractiveDemo,
  LobbyHeaderLongTitleDemo,
  LobbyHeaderSegmentedDemo,
  LobbyHeaderSegmentsNoCMDemo,
} from "./lobby-header.demo";

export const lobbyHeaderShowcase: ShowcaseEntry = {
  slug: "lobby-header",
  name: "Lobby Header",
  area: "lobby",
  description:
    "Strip beneath the top navbar in the pre-game lobby. Left: gold back-chevron · optional queue-crest · queue title · info-circle. Right: party-visibility pill toggle (check + person glyphs, controlled, aria-pressed).",
  variants: [
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
        "segments prop: ['Intro', 'Blind', \"Summoner's Rift 5v5\"] renders with ◆ diamond separators. (30) chip + ward glyph dead decorations. Change Mode secondary button to right of title.",
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
