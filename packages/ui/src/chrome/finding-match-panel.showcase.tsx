import type { ShowcaseEntry } from "../showcase";
import {
  FindingMatchDefaultDemo,
  FindingMatchAmbientDemo,
  FindingMatchLongElapsedDemo,
  FindingMatchNoEstimateDemo,
  FindingMatchNoCrestDemo,
  FindingMatchInRailDemo,
  FindingMatchCancelDemo,
} from "./finding-match-panel.demo";

export const findingMatchPanelShowcase: ShowcaseEntry = {
  slug: "finding-match-panel",
  name: "FindingMatchPanel",
  area: "chrome",
  description:
    "Queue indicator rail widget — appears below ProfileChip while searching for a match. Shows header with cancel button, body band with optional crest, elapsed timer (parent-driven), and optional estimated wait.",
  variants: [
    {
      name: "Default — with crest + estimate",
      notes:
        'data-shot="finding-match-panel"; matches close-up reference: header, crest chip, large timer, teal estimate line. No ambient video (flat bg-blue-7).',
      render: () => <FindingMatchDefaultDemo />,
    },
    {
      name: "With ambient video (queue-delay loop)",
      notes:
        "ambientVideoSrc = partiesBgLoopUrl('queue-delay'): subtle animated Hextech backdrop behind the panel. Additive over bg-blue-7; hidden under prefers-reduced-motion. Compare to Default (no video).",
      render: () => <FindingMatchAmbientDemo />,
    },
    {
      name: "Long elapsed — no clip (1:23:45)",
      notes:
        "h:mm:ss format; timer must not clip or wrap at 200px width — layout accommodates extra character",
      render: () => <FindingMatchLongElapsedDemo />,
    },
    {
      name: "No estimate",
      notes: "estimatedLabel omitted — estimate line is absent, timer stands alone",
      render: () => <FindingMatchNoEstimateDemo />,
    },
    {
      name: "No crest",
      notes: "crestSrc omitted — timer column starts from left edge without chip offset",
      render: () => <FindingMatchNoCrestDemo />,
    },
    {
      name: "In-rail-width context (200px)",
      notes:
        "200px wide with gold-5 rail border — simulates social rail context from client-queue-in-lobby.png",
      render: () => <FindingMatchInRailDemo />,
    },
    {
      name: "Interactive — cancel fires callback",
      notes:
        "✕ aria-label='Cancel queue'; clicking exercises onCancel callback and shows cancelled state",
      render: () => <FindingMatchCancelDemo />,
    },
  ],
};
