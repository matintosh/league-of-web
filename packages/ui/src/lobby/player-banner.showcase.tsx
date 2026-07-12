import type { ShowcaseEntry } from "../showcase";
import {
  PlayerBannerSelfDemo,
  PlayerBannerFullPartyDemo,
  PlayerBannerEmptyDemo,
  PlayerBannerWingTiersDemo,
  PlayerBannerTruncationDemo,
  PlayerBannerAutofillDemo,
} from "./player-banner.demo";

export const playerBannerShowcase: ShowcaseEntry = {
  slug: "player-banner",
  name: "Player Banner",
  area: "lobby",
  description:
    "Vertical party lobby banner card. Center (self): larger scale + gold wings + crown chip + autofill chip. Flanks (teammates): narrower, dimmed. Empty variant for unfilled slots. Wing art from CommunityDragon ranked-emblem PNGs.",
  variants: [
    {
      name: "Self banner (gold wings, autofill protected)",
      notes:
        "isSelf=true: wider panel, gold wings, crown chip, autofill-protected chip at foot, bright gold ring. Contains a RoleSlotRow (mid + support).",
      render: () => <PlayerBannerSelfDemo />,
    },
    {
      name: "Full party (5 banners)",
      notes:
        "All five banner cards side by side: self (center, gold) + four teammates in teal, green, blue, and bronze wings. Matches the reference lobby screenshot layout.",
      render: () => <PlayerBannerFullPartyDemo />,
    },
    {
      name: "Empty slots",
      notes:
        "empty=true: dark panel, no avatar or name, opacity-dimmed. Represents unfilled lobby slots with no invite affordance (dead visual per spec).",
      render: () => <PlayerBannerEmptyDemo />,
    },
    {
      name: "All WingTiers",
      notes:
        "Every WingTier value side by side: default (iron), bronze, gold, teal (platinum), green (emerald), blue (diamond). Real CommunityDragon ranked-emblem wing PNGs.",
      render: () => <PlayerBannerWingTiersDemo />,
    },
    {
      name: "Long name + title truncation",
      notes:
        "Extremely long summoner name and title — both truncated via CSS. Shows both teammate and self banner truncation behaviour.",
      render: () => <PlayerBannerTruncationDemo />,
    },
    {
      name: "Autofill chip (non-self)",
      notes:
        "autofillProtected=true on a teammate banner (no isSelf). Shield glyph + text chip at banner foot.",
      render: () => <PlayerBannerAutofillDemo />,
    },
  ],
};
