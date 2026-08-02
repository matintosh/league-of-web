import type { ShowcaseEntry } from "../showcase";
import {
  MatchFoundModalFullCountdownDemo,
  MatchFoundModalHalfwayDemo,
  MatchFoundModalNearlyExpiredDemo,
  MatchFoundModalWithKeyartDemo,
  MatchFoundModalNoCrestDemo,
  MatchFoundModalEntranceReplayDemo,
  MatchFoundModalAcceptFlowDemo,
  MatchFoundModalDeclinedFlowDemo,
  MatchFoundModalDemo,
} from "./match-found-modal.demo";

export const matchFoundModalShowcase: ShowcaseEntry = {
  slug: "match-found-modal",
  name: "Match Found Modal",
  area: "lobby",
  description:
    "Full-screen circular takeover when a match is found: dark bezel band → bright cyan countdown arc (WAD video) → thin solid gold ring → keyart disc. Bare gold 'blind pick' overlapping-cards glyph (inline SVG, no frame) as crest. Title 'MATCH FOUND!' at text-3xl; subtitle uppercase + letter-spaced in component. ACCEPT! is a rounded-rect with bright cyan top edge + glow, dark navy fill, gold label (replaces trapezoid). DECLINE is a compact gold-lined bezel tab inside the circle bottom (not floating below). WAD ready-check ring videos (straight-alpha, registered to the gold ring) are the visual timer — draining countdown on mount, swapping to accepted intro→idle loop when accepted; the CSS ring sweep is the reduced-motion fallback.",
  referenceImage: "match-found-modal-clean-2.png",
  referenceNote: "docs/reference/match-found-modal-clean-2.png — hi-detail clean render: dark bezel, bright cyan arc, solid gold ring, blind-pick glyph, MATCH FOUND!, ACCEPT! rounded-rect, DECLINE bezel tab",
  variants: [
    {
      name: "Full countdown (ring) + blind-pick glyph + video",
      notes:
        "secondsRemaining=10/totalSeconds=10. countdownVideoSrc supplies the WAD ready-check ring video (straight-alpha, registered to the gold ring); the CSS arc is hidden under motion-safe to avoid a double ring. Crest is the bare gold blind-pick glyph (#564).",
      render: () => <MatchFoundModalFullCountdownDemo />,
    },
    {
      name: "Half countdown (arc 50%)",
      notes: "secondsRemaining=5/totalSeconds=10 — CSS arc fallback at halfway point (no video). Reduced-motion / no-video state.",
      render: () => <MatchFoundModalHalfwayDemo />,
    },
    {
      name: "Nearly expired (≤2s)",
      notes: "secondsRemaining=2 — arc almost gone. Countdown is sr-only (arc is sole visual timer); urgency read only from arc depletion.",
      render: () => <MatchFoundModalNearlyExpiredDemo />,
    },
    {
      name: "With champion keyart + subtitle",
      notes: "keyartSrc=Ahri splash, subtitle prop shown (component styles it uppercase+spaced). Arc at 80%.",
      render: () => <MatchFoundModalWithKeyartDemo />,
    },
    {
      name: "No keyart (gradient disc fallback)",
      notes: "keyartSrc absent — renders the blue-6→blue-7 gradient disc. Blind-pick glyph still shows.",
      render: () => <MatchFoundModalNoCrestDemo />,
    },
    {
      name: "Entrance replay",
      notes:
        'Click "Replay entrance" to remount and replay the on-mount animation: teal ring sweeps around (soft easing), modal scales/fades in (snap easing), ACCEPT! rounded-rect glow pulses. Honors prefers-reduced-motion (instant, fully visible).',
      render: () => <MatchFoundModalEntranceReplayDemo />,
    },
    {
      name: "Accept flow (video state machine)",
      notes:
        'Interactive: "Find Match" plays the countdown ring video; ACCEPT! swaps the overlay to the accepted intro → idle loop (modal stays mounted so the swap is visible); DECLINE / 0s resets. Honors prefers-reduced-motion (video hidden, CSS ring shows).',
      render: () => <MatchFoundModalAcceptFlowDemo />,
    },
    {
      name: "Decline flow (video state machine)",
      notes:
        'Interactive: "Find Match" plays the countdown ring video; DECLINE swaps the overlay to the declined ring (plays once, holds final frame). accepted wins if both accepted/declined are set. Under prefers-reduced-motion the video is hidden and the CSS ring shows.',
      render: () => <MatchFoundModalDeclinedFlowDemo />,
    },
    {
      name: "Trigger + ticking demo",
      notes: 'Interactive: click "Find Match" to open the modal. Countdown ring video plays; ACCEPT!/DECLINE bezel tab both wired; auto-declines at 0.',
      render: () => <MatchFoundModalDemo />,
    },
  ],
};
