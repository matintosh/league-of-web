import type { ShowcaseEntry } from "../showcase";
import {
  PlayerBannerSelfDemo,
  PlayerBannerFullPartyDemo,
  PlayerBannerEmptyDemo,
  PlayerBannerWingTiersDemo,
  PlayerBannerTruncationDemo,
  PlayerBannerAutofillDemo,
  PlayerBannerHeraldShapeDemo,
} from "./player-banner.demo";

export const playerBannerShowcase: ShowcaseEntry = {
  slug: "player-banner",
  name: "Player Banner",
  area: "lobby",
  description:
    "Vertical heraldic banner card for the pre-game lobby. Pointed double-V bottom with gold trim via clip-path shell technique. Crown+name above the shape. Self: larger scale, gold wings, level badge, autofill chip. Empty: large grey + circle (~90px). Wing art from CommunityDragon ranked-emblem PNGs.",
  variants: [
    {
      name: "Heraldic shape — self + teammate + empty circle",
      notes:
        "Shows the pointed bottom silhouette on self (gold) and teammate (teal) banners with gold trim, crown+name floating above, level badge on medallion, and the new + circle empty slot side by side.",
      render: () => <PlayerBannerHeraldShapeDemo />,
    },
    {
      name: "Self banner (gold wings, autofill protected)",
      notes:
        "isSelf=true: wider panel, gold wings, crown glyph + name above shape, heraldic silhouette, level badge, autofill-protected chip at foot. RoleSlotRow (mid + support).",
      render: () => <PlayerBannerSelfDemo />,
    },
    {
      name: "Full party (5 banners)",
      notes:
        "All five banner cards side by side: self (center, gold) + four teammates in teal, green, blue, and bronze wings.",
      render: () => <PlayerBannerFullPartyDemo />,
    },
    {
      name: "Empty slots (+ circles)",
      notes:
        "empty=true: 90px grey double-ring + circle. Matches solo lobby reference showing 4 large circular empty slots.",
      render: () => <PlayerBannerEmptyDemo />,
    },
    {
      name: "All WingTiers",
      notes:
        "Every WingTier: default (iron), bronze, gold, teal (platinum), green (emerald), blue (diamond). All use heraldic shape.",
      render: () => <PlayerBannerWingTiersDemo />,
    },
    {
      name: "Long name + title truncation",
      notes:
        "Extremely long summoner name and title. Name truncates in above-banner row; title truncates inside the shape.",
      render: () => <PlayerBannerTruncationDemo />,
    },
    {
      name: "Autofill chip (non-self)",
      notes:
        "autofillProtected=true on a teammate banner. Shield glyph + text chip at banner foot.",
      render: () => <PlayerBannerAutofillDemo />,
    },
  ],
};
