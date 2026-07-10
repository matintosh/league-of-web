import type { ShowcaseEntry } from "../showcase";
import {
  MatchFoundModalFullCountdownDemo,
  MatchFoundModalNearlyExpiredDemo,
  MatchFoundModalDemo,
} from "./match-found-modal.demo";

export const matchFoundModalShowcase: ShowcaseEntry = {
  slug: "match-found-modal",
  name: "Match Found Modal",
  area: "lobby",
  description:
    "Alert dialog shown when a match is found: countdown timer (parent-driven), ACCEPT and DECLINE buttons. Not dismissible via backdrop.",
  variants: [
    {
      name: "Full countdown (10)",
      notes:
        "Always-open static variant. secondsRemaining=10 — countdown displays in text-blue-2.",
      render: () => <MatchFoundModalFullCountdownDemo />,
    },
    {
      name: "Nearly expired (2)",
      notes:
        "secondsRemaining=2 — countdown turns text-gold-3 to signal urgency.",
      render: () => <MatchFoundModalNearlyExpiredDemo />,
    },
    {
      name: "Trigger + ticking demo",
      notes:
        'Interactive: click "Find Match" to open the modal. Countdown ticks every second; auto-declines at 0.',
      render: () => <MatchFoundModalDemo />,
    },
  ],
};
