import type { ShowcaseEntry } from "../showcase";
import {
  MatchFoundModalFullCountdownDemo,
  MatchFoundModalHalfwayDemo,
  MatchFoundModalNearlyExpiredDemo,
  MatchFoundModalWithKeyartDemo,
  MatchFoundModalDemo,
} from "./match-found-modal.demo";

export const matchFoundModalShowcase: ShowcaseEntry = {
  slug: "match-found-modal",
  name: "Match Found Modal",
  area: "lobby",
  description:
    "Full-screen circular takeover when a match is found: countdown arc (parent-driven), ACCEPT and DECLINE buttons. Not dismissible via backdrop.",
  variants: [
    {
      name: "Full countdown (arc full)",
      notes: "secondsRemaining=10/totalSeconds=10 — arc is complete, no keyart fallback (gradient disc).",
      render: () => <MatchFoundModalFullCountdownDemo />,
    },
    {
      name: "Half countdown (arc 50%)",
      notes: "secondsRemaining=5/totalSeconds=10 — arc at halfway point.",
      render: () => <MatchFoundModalHalfwayDemo />,
    },
    {
      name: "Nearly expired (≤2s)",
      notes: "secondsRemaining=2 — arc almost gone, countdown text turns text-gold-3 urgency colour.",
      render: () => <MatchFoundModalNearlyExpiredDemo />,
    },
    {
      name: "With champion keyart",
      notes: "keyartSrc=Ahri splash, subtitle prop shown. Arc at 80%.",
      render: () => <MatchFoundModalWithKeyartDemo />,
    },
    {
      name: "Trigger + ticking demo",
      notes: 'Interactive: click "Find Match" to open the modal. Arc drains; auto-declines at 0.',
      render: () => <MatchFoundModalDemo />,
    },
  ],
};
