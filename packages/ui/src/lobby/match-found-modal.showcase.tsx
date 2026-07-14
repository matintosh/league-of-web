import type { ShowcaseEntry } from "../showcase";
import {
  MatchFoundModalFullCountdownDemo,
  MatchFoundModalHalfwayDemo,
  MatchFoundModalNearlyExpiredDemo,
  MatchFoundModalWithKeyartDemo,
  MatchFoundModalNoCrestDemo,
  MatchFoundModalEntranceReplayDemo,
  MatchFoundModalDemo,
} from "./match-found-modal.demo";

export const matchFoundModalShowcase: ShowcaseEntry = {
  slug: "match-found-modal",
  name: "Match Found Modal",
  area: "lobby",
  description:
    "Full-screen circular takeover when a match is found: countdown arc (parent-driven, arc is sole visual timer), ACCEPT trapezoid inside the circle bottom, DECLINE rectangle below the circle. Not dismissible via backdrop. crestSrc renders the game-mode map crest (single lit frame) in a gold double-border frame; falls back to HexCrest placeholder when absent.",
  referenceImage: "client-match-found-crest.png",
  referenceNote: "docs/reference/client-match-found-crest.png — the full MATCH FOUND circular takeover (crest, title, mode line, ACCEPT/DECLINE)",
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
      notes: "secondsRemaining=2 — arc almost gone. Countdown is sr-only (arc is sole visual timer); urgency read only from arc depletion.",
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
      name: "Entrance replay",
      notes:
        'Click "Replay entrance" to remount and replay the on-mount animation: teal ring sweeps around (soft easing), modal scales/fades in (snap easing), ACCEPT glow pulses. Honors prefers-reduced-motion (instant, fully visible).',
      render: () => <MatchFoundModalEntranceReplayDemo />,
    },
    {
      name: "Trigger + ticking demo",
      notes: 'Interactive: click "Find Match" to open the modal. Arc drains; auto-declines at 0.',
      render: () => <MatchFoundModalDemo />,
    },
  ],
};
