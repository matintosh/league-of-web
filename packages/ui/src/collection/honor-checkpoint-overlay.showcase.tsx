import type { ShowcaseEntry } from "../showcase";
import {
  HonorCheckpointOverlayReplayDemo,
  HonorCheckpointOverlayStaticPreview,
  checkpointCrestVideo,
} from "./honor-checkpoint-overlay.demo";

export const honorCheckpointOverlayShowcase: ShowcaseEntry = {
  slug: "honor-checkpoint-overlay",
  name: "Honor Checkpoint Overlay",
  area: "collection",
  description:
    "The in-client Honor celebration full-screen overlay — 'CHECKPOINT REACHED', 'HONOR LEVEL UP', and 'HONOR UNLOCKED' (all one layout, different title + crest video). Atmospheric dark-forest gradient backdrop, top/bottom gold hairline rules, font-display uppercase title (text-gold-cream), muted subtitle, a centered animated honor crest, and a gold OK button. Crest video is an intro → loop → outro state machine layered over a static SVG crest glyph, so any missing/broken/slow clip leaves the static crest + gradient intact. Dismiss (OK, backdrop click, or Escape) plays the outro if any, fades ~300ms, then fires onFinished once on a single idempotent path. Unlike a skip-on-mount celebration, this surface has an OK button — under prefers-reduced-motion it still renders in full (static crest + gradient, no video) and waits for an explicit dismiss; it never auto-closes. Presentational: page/demo supplies crest/backdrop URLs from @low/fixtures (honorCheckpointVideoUrl / honorLevelUpVideoUrl / honorUnlockVideoUrl / honorTransitionVideoUrl / honorVotingBgVideoUrl). Not wired into a live flow — no honor trigger exists yet; showcase-driven today.",
  referenceNote:
    "docs/reference/client-honor-checkpoint-celebration.png (1599×895). Videos: docs/reference/VIDEO-ASSETS.md — honor/celebration/{2,3,4}-{1,2,3}_checkpoint_{intro,loop} (600×650), {3,4,5}_checkpoint_outro, {1..5}_levelup_{intro,loop} (450×419), {0,1,2}_unlock, transition_green + honor/voting_bg (1280×720).",
  variants: [
    {
      name: "Replay demo (checkpoint / level up / unlock)",
      notes:
        "Pick a celebration to play its overlay in a framed stage. Each play key-remounts the overlay so the intro → loop restarts from frame 0; a counter shows onFinished firing once per run (OK / backdrop click / Escape, after the outro clip if any). Honors prefers-reduced-motion (renders in full with a static crest + gradient, no video, and waits for an explicit dismiss).",
      render: () => <HonorCheckpointOverlayReplayDemo />,
    },
    {
      name: "Checkpoint reached — crest video",
      notes:
        "Persistent static preview of the reference surface (the 3-3 checkpoint crest, intro → loop → outro from honorCheckpointVideoUrl, transition_green backdrop). Matches docs/reference/client-honor-checkpoint-celebration.png.",
      render: () => (
        <HonorCheckpointOverlayStaticPreview
          title="CHECKPOINT REACHED"
          subtitle="You've reached the last checkpoint before Honor level 3"
          crestVideo={checkpointCrestVideo}
        />
      ),
    },
    {
      name: "Honor level up (title variant)",
      notes:
        "Same layout, level-up title/subtitle. Shown with no crest video supplied so the static crest glyph + gradient carry the surface (the videos-absent look).",
      render: () => (
        <HonorCheckpointOverlayStaticPreview
          title="HONOR LEVEL UP"
          subtitle="You've reached Honor level 4"
        />
      ),
    },
    {
      name: "Honor unlocked (title variant)",
      notes:
        "Unlock title/subtitle, static crest fallback only.",
      render: () => (
        <HonorCheckpointOverlayStaticPreview
          title="HONOR UNLOCKED"
          subtitle="Your Honor has been restored — rewards are available again"
        />
      ),
    },
    {
      name: "Reduced motion / videos absent (static crest)",
      notes:
        "Exactly what renders under prefers-reduced-motion or when every crest/backdrop URL is omitted: the static SVG honor crest glyph (bronze wreath + green gems) over the dark-forest gradient, hairline rules, title, subtitle, and OK button — the full surface, no video, no auto-dismiss.",
      render: () => (
        <HonorCheckpointOverlayStaticPreview
          title="CHECKPOINT REACHED"
          subtitle="You've reached the last checkpoint before Honor level 3"
        />
      ),
    },
  ],
};
