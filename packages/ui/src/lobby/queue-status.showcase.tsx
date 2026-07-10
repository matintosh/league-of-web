import type { ShowcaseEntry } from "../showcase";
import {
  QueueStatusTickingDemo,
  QueueStatusFreshDemo,
  QueueStatusOverEstimateDemo,
  QueueStatusNoEstimateDemo,
  QueueStatusPanelTickingDemo,
  QueueStatusPanelFreshDemo,
  QueueStatusPanelOverEstimateDemo,
  QueueStatusPanelNoEstimateDemo,
} from "./queue-status.demo";

export const queueStatusShowcase: ShowcaseEntry = {
  slug: "queue-status",
  name: "Queue Status",
  area: "lobby",
  description:
    "In-queue status indicator shown while matchmaking: pulsing indicator, elapsed timer (parent-driven), estimated wait, and a cancel affordance. Two layout variants: strip (default horizontal bar) and panel (compact vertical box for top-right sidebar).",
  variants: [
    // ---- Strip variants ----
    {
      name: "Strip — Live ticking",
      notes:
        "Interval runs in the demo component. Click ✕ to reset.",
      render: () => <QueueStatusTickingDemo />,
    },
    {
      name: "Strip — Fresh (0:03, estimated 0:30)",
      notes: "Elapsed well within estimate — timer in text-gold-1.",
      render: () => <QueueStatusFreshDemo />,
    },
    {
      name: "Strip — Over estimate (7:42 > 2:00)",
      notes: "elapsedSeconds > estimatedSeconds — elapsed turns text-gold-3.",
      render: () => <QueueStatusOverEstimateDemo />,
    },
    {
      name: "Strip — No estimate",
      notes: "estimatedSeconds omitted — right side shows only the cancel button.",
      render: () => <QueueStatusNoEstimateDemo />,
    },
    // ---- Panel variants ----
    {
      name: "Panel — Live ticking",
      notes:
        "layout=\"panel\": compact ~200×96 vertical box with teal glow. Interval runs in the demo. Click ✕ to reset.",
      render: () => <QueueStatusPanelTickingDemo />,
    },
    {
      name: "Panel — Fresh (0:03, estimated 3:00)",
      notes: "Panel layout, elapsed within estimate — large timer in text-gold-1.",
      render: () => <QueueStatusPanelFreshDemo />,
    },
    {
      name: "Panel — Over estimate (7:42 > 2:00)",
      notes: "Panel layout, elapsed exceeds estimate — large timer turns text-gold-3.",
      render: () => <QueueStatusPanelOverEstimateDemo />,
    },
    {
      name: "Panel — No estimate",
      notes: "Panel layout, estimatedSeconds omitted — only header and timer shown.",
      render: () => <QueueStatusPanelNoEstimateDemo />,
    },
  ],
};
