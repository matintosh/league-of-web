import type { ShowcaseEntry } from "../showcase";
import {
  MatchFoundModalFullCountdownDemo,
  MatchFoundModalHalfwayDemo,
  MatchFoundModalNearlyExpiredDemo,
  MatchFoundModalWithKeyartDemo,
  MatchFoundModalNoCrestDemo,
  MatchFoundModalDemo,
} from "./match-found-modal.demo";

export const matchFoundModalShowcase: ShowcaseEntry = {
  slug: "match-found-modal",
  name: "Match Found Modal",
  area: "lobby",
  description:
    "Full-screen circular takeover when a match is found: countdown arc (parent-driven), ACCEPT and DECLINE buttons. Not dismissible via backdrop. crestSrc renders the game-mode map crest (single lit frame) in a gold double-border frame; falls back to HexCrest placeholder when absent.",
  variants: [
    {
      name: "Full countdown (arc full) + map crest",
      notes:
        "secondsRemaining=10/totalSeconds=10 — arc complete. crestSrc=SR map crest rendered in gold double-border frame per reference (client-match-found-crest.png).",
      render: () => <MatchFoundModalFullCountdownDemo />,
    },
    {
      name: "Half countdown (arc 50%) + map crest",
      notes: "secondsRemaining=5/totalSeconds=10 — arc at halfway point.",
      render: () => <MatchFoundModalHalfwayDemo />,
    },
    {
      name: "Nearly expired (≤2s) + map crest",
      notes: "secondsRemaining=2 — arc almost gone, countdown text turns text-gold-3 urgency colour.",
      render: () => <MatchFoundModalNearlyExpiredDemo />,
    },
    {
      name: "With champion keyart + map crest",
      notes: "keyartSrc=Ahri splash, crestSrc=SR crest, subtitle prop shown. Arc at 80%.",
      render: () => <MatchFoundModalWithKeyartDemo />,
    },
    {
      name: "No crest (HexCrest fallback)",
      notes: "crestSrc absent — renders the gold hexagon HexCrest placeholder SVG.",
      render: () => <MatchFoundModalNoCrestDemo />,
    },
    {
      name: "Trigger + ticking demo",
      notes: 'Interactive: click "Find Match" to open the modal. Arc drains; auto-declines at 0.',
      render: () => <MatchFoundModalDemo />,
    },
  ],
};
