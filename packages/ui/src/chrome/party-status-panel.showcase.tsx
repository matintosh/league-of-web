import type { ShowcaseEntry } from "../showcase";
import { PartyStatusPanel } from "./party-status-panel";
import { PartyStatusPanelToggleDemo } from "./party-status-panel.demo";
import { gameModeMapUrl } from "@low/fixtures";

const SR_CREST = gameModeMapUrl("sr");

export const partyStatusPanelShowcase: ShowcaseEntry = {
  slug: "party-status-panel",
  name: "PartyStatusPanel",
  area: "chrome",
  description:
    "OPEN PARTY rail block — green band with silhouettes, crest chip, and queue label. Renders below ProfileChip on party-lobby view.",
  variants: [
    {
      name: "Open — 1 of 5 (default)",
      notes: 'data-shot="party-status-panel"; self only, 4 empty slots',
      render: () => (
        <div className="w-[200px] bg-blue-7" data-shot="party-status-panel">
          <PartyStatusPanel
            queueLabel="Normal Draft"
            crestSrc={SR_CREST}
            filled={1}
            capacity={5}
            open={true}
          />
        </div>
      ),
    },
    {
      name: "Open — full party (5 of 5)",
      notes: "All silhouettes filled",
      render: () => (
        <div className="w-[200px] bg-blue-7">
          <PartyStatusPanel
            queueLabel="Ranked Solo/Duo"
            crestSrc={SR_CREST}
            filled={5}
            capacity={5}
            open={true}
          />
        </div>
      ),
    },
    {
      name: "Open — 3 of 5",
      render: () => (
        <div className="w-[200px] bg-blue-7">
          <PartyStatusPanel
            queueLabel="ARAM"
            crestSrc={gameModeMapUrl("ha")}
            filled={3}
            capacity={5}
            open={true}
          />
        </div>
      ),
    },
    {
      name: "Closed party",
      notes: "open=false — header shows 'Closed Party'",
      render: () => (
        <div className="w-[200px] bg-blue-7">
          <PartyStatusPanel
            queueLabel="Normal Draft"
            crestSrc={SR_CREST}
            filled={2}
            capacity={5}
            open={false}
          />
        </div>
      ),
    },
    {
      name: "Long queue label truncation",
      notes: "Label text truncated with ellipsis at 200px width",
      render: () => (
        <div className="w-[200px] bg-blue-7">
          <PartyStatusPanel
            queueLabel="Co-op vs. AI — Intro Bots (Summoner's Rift 5v5)"
            crestSrc={SR_CREST}
            filled={1}
            capacity={5}
            open={true}
          />
        </div>
      ),
    },
    {
      name: "No crest",
      notes: "crestSrc omitted — silhouettes start from left edge",
      render: () => (
        <div className="w-[200px] bg-blue-7">
          <PartyStatusPanel
            queueLabel="Normal Draft"
            filled={1}
            capacity={5}
            open={true}
          />
        </div>
      ),
    },
    {
      name: "With toggle (interactive header)",
      notes:
        "onToggleOpen provided → header is a button with aria-pressed. Click the header to toggle open/closed.",
      render: () => <PartyStatusPanelToggleDemo />,
    },
  ],
};
