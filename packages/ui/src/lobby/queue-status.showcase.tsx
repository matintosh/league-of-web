import type { ShowcaseEntry } from "../showcase";
import {
  QueueStatusTickingDemo,
  QueueStatusFreshDemo,
  QueueStatusOverEstimateDemo,
  QueueStatusNoEstimateDemo,
} from "./queue-status.demo";

export const queueStatusShowcase: ShowcaseEntry = {
  slug: "queue-status",
  name: "Queue Status",
  area: "lobby",
  description:
    "In-queue status strip shown while matchmaking: pulsing indicator, elapsed timer (parent-driven), estimated wait, and a cancel affordance.",
  variants: [
    {
      name: "Live ticking",
      notes:
        "Interval runs in the demo component. Click ✕ to reset.",
      render: () => <QueueStatusTickingDemo />,
    },
    {
      name: "Fresh (0:03, estimated 0:30)",
      notes: "Elapsed well within estimate — timer in text-gold-1.",
      render: () => <QueueStatusFreshDemo />,
    },
    {
      name: "Over estimate (7:42 > 2:00)",
      notes: "elapsedSeconds > estimatedSeconds — elapsed turns text-gold-3.",
      render: () => <QueueStatusOverEstimateDemo />,
    },
    {
      name: "No estimate",
      notes: "estimatedSeconds omitted — right side shows only the cancel button.",
      render: () => <QueueStatusNoEstimateDemo />,
    },
  ],
};
