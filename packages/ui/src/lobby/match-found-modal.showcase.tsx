import type { ShowcaseEntry } from "../showcase";
import {
  MatchFoundModalFullCountdownDemo,
  MatchFoundModalHalfwayDemo,
  MatchFoundModalNearlyExpiredDemo,
  MatchFoundModalWithKeyartDemo,
  MatchFoundModalNoCrestDemo,
  MatchFoundModalEntranceReplayDemo,
  MatchFoundModalAcceptFlowDemo,
  MatchFoundModalDemo,
} from "./match-found-modal.demo";

export const matchFoundModalShowcase: ShowcaseEntry = {
  slug: "match-found-modal",
  name: "Match Found Modal",
  area: "lobby",
  description:
    "Full-screen circular takeover when a match is found: countdown ring (parent-driven timer), ACCEPT trapezoid inside the circle bottom, DECLINE rectangle below the circle. Not dismissible via backdrop. When countdownVideoSrc is supplied the WAD ready-check ring videos (straight-alpha, registered to the gold ring) become the visual timer — draining countdown ring on mount, swapping to the accepted intro→idle loop when accepted; the #299 CSS ring sweep remains the fallback under prefers-reduced-motion / video error. crestSrc renders the game-mode map crest (single lit frame) in a gold double-border frame; falls back to HexCrest placeholder when absent.",
  referenceImage: "client-match-found-crest.png",
  referenceNote: "docs/reference/client-match-found-crest.png — the full MATCH FOUND circular takeover (crest, title, mode line, ACCEPT/DECLINE)",
  variants: [
    {
      name: "Full countdown (ring) + map crest + video",
      notes:
        "secondsRemaining=10/totalSeconds=10. countdownVideoSrc supplies the WAD ready-check ring video (straight-alpha, registered to the gold ring); the CSS arc is hidden under motion-safe to avoid a double ring. crestSrc=SR map crest in gold double-border frame per reference (client-match-found-crest.png).",
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
      name: "Accept flow (video state machine)",
      notes:
        'Interactive: "Find Match" plays the countdown ring video; ACCEPT swaps the overlay to the accepted intro → idle loop (modal stays mounted so the swap is visible); DECLINE / 0s resets. Honors prefers-reduced-motion (video hidden, CSS ring shows).',
      render: () => <MatchFoundModalAcceptFlowDemo />,
    },
    {
      name: "Trigger + ticking demo",
      notes: 'Interactive: click "Find Match" to open the modal. Countdown ring video plays; auto-declines at 0.',
      render: () => <MatchFoundModalDemo />,
    },
  ],
};
