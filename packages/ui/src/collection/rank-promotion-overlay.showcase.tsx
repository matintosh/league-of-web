import type { ShowcaseEntry } from "../showcase";
import { RankPromotionOverlayReplayDemo } from "./rank-promotion-overlay.demo";

export const rankPromotionOverlayShowcase: ShowcaseEntry = {
  slug: "rank-promotion-overlay",
  name: "Rank Promotion Overlay",
  area: "collection",
  description:
    "Full-panel ranked tier-promotion celebration: the WAD 'from' (old tier) clip plays once, crossfades (var(--motion-crossfade)) into the 'to' (new tier) payoff, then onFinished fires. Interactive-blocking by design (dialog semantics, dimmed backdrop) and skippable — clicking anywhere or pressing Escape fades out (~300ms) and finishes on a single idempotent path. The 1280×720 straight-alpha videos are pointer-events-none and object-contain; the overlay catches the skip click. Under prefers-reduced-motion the videos are skipped entirely and onFinished fires on mount (nothing renders). Presentational: page/demo supplies fromSrc/toSrc via @low/fixtures tierPromotionVideoUrl(). Not wired into ProfileRankedScreen's live flow — no promotion trigger exists yet; showcase-only consumption today.",
  referenceNote:
    "docs/reference/VIDEO-ASSETS.md — ranked/ tier-promotion-from-{tier} (10) + tier-promotion-to-{tier} (10), 1280×720 alpha webm.",
  variants: [
    {
      name: "Replay demo (tier pairs)",
      notes:
        "Pick Gold→Platinum, Diamond→Master, or Grandmaster→Challenger to play its celebration in a framed stage. Each play key-remounts the overlay so the from → crossfade → to sequence restarts from frame 0; a counter shows onFinished firing once per run (natural end or skip). Click the stage or press Escape to skip. Honors prefers-reduced-motion (nothing renders, onFinished fires immediately — counter still increments).",
      render: () => <RankPromotionOverlayReplayDemo />,
    },
  ],
};
