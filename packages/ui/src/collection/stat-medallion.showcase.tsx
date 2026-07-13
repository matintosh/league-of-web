import type { ShowcaseEntry } from "../showcase";
import { StatMedallion } from "./stat-medallion";
import type { TierEntry } from "./stat-medallion";

// ---------------------------------------------------------------------------
// CDragon asset URLs — same base used by the Skins sidebar in collection-screen
// ---------------------------------------------------------------------------

const CDRAGON_GEMS =
  "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/rarity-gem-icons";
const CDRAGON_SKINS =
  "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-collections/global/default/images/skins-viewer";
const CDRAGON_GEMS_COLS =
  "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-collections/global/default/images/gems";

// Row A — 4 skin-tier gem icons (Legendary, Epic, Legacy/Rare, Mythic)
const TIER_ROW_A: TierEntry[] = [
  { label: "Legendary", count: 0, iconSrc: `${CDRAGON_GEMS}/legendary.png` },
  { label: "Epic",      count: 0, iconSrc: `${CDRAGON_GEMS}/epic.png` },
  { label: "Rare",      count: 0, iconSrc: `${CDRAGON_GEMS_COLS}/rare.png` },
  { label: "Mythic",    count: 0, iconSrc: `${CDRAGON_GEMS}/mythic.png` },
];

// Row B — 2 special-currency icons (ward skin token, chroma token)
const TIER_ROW_B: TierEntry[] = [
  { label: "Ward Skins",     count: 2, iconSrc: `${CDRAGON_SKINS}/icon-legacy.png` },
  { label: "Chroma Tokens",  count: 0, iconSrc: `${CDRAGON_SKINS}/icon-chroma.png` },
];

export const statMedallionShowcase: ShowcaseEntry = {
  slug: "stat-medallion",
  name: "Stat Medallion",
  area: "collection",
  description:
    "Circular ornate stat emblem from the collection sidebar — double gold ring with diamond finials, large number, and caption. Optionally renders skin-tier breakdown rows below the ring.",
  variants: [
    {
      name: "Default",
      render: () => <StatMedallion value="4" caption="TOTAL SKINS OWNED" />,
    },
    {
      name: "Large number",
      render: () => <StatMedallion value="147" caption="TOTAL SKINS OWNED" />,
    },
    {
      name: "Long caption",
      render: () => (
        <StatMedallion value="12" caption="TOTAL CHAMPIONS OWNED IN COLLECTION" />
      ),
    },
    {
      name: "With tier breakdown (Skins sidebar)",
      render: () => (
        <StatMedallion
          value="4"
          caption="TOTAL SKINS OWNED"
          tierBreakdown={[TIER_ROW_A, TIER_ROW_B]}
        />
      ),
    },
    {
      name: "With tier breakdown — counts populated",
      render: () => (
        <StatMedallion
          value="8"
          caption="TOTAL SKINS OWNED"
          tierBreakdown={[
            [
              { label: "Legendary", count: 1, iconSrc: `${CDRAGON_GEMS}/legendary.png` },
              { label: "Epic",      count: 3, iconSrc: `${CDRAGON_GEMS}/epic.png` },
              { label: "Rare",      count: 2, iconSrc: `${CDRAGON_GEMS_COLS}/rare.png` },
              { label: "Mythic",    count: 1, iconSrc: `${CDRAGON_GEMS}/mythic.png` },
            ],
            [
              { label: "Ward Skins",    count: 5, iconSrc: `${CDRAGON_SKINS}/icon-legacy.png` },
              { label: "Chroma Tokens", count: 2, iconSrc: `${CDRAGON_SKINS}/icon-chroma.png` },
            ],
          ]}
        />
      ),
    },
  ],
};
