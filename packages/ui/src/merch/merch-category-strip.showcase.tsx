import type { ShowcaseEntry } from "../showcase";
import { MerchCategoryStrip } from "./merch-category-strip";
import type { MerchFranchiseChip } from "./merch-category-strip";
import { MerchCategoryStripScrollDemo } from "./merch-category-strip.demo";

/** Default set of franchise chips matching the real merch.riotgames.com strip. */
const DEFAULT_CATEGORIES: MerchFranchiseChip[] = [
  {
    slug: "league-of-legends",
    label: "League of Legends",
    colorVar: "--color-merch-cat-lol",
    textColorVar: "--color-merch-on-dark",
  },
  {
    slug: "riftbound",
    label: "Riftbound",
    colorVar: "--color-merch-cat-riftbound",
    textColorVar: "--color-merch-on-dark",
    subLabel: "League of Legends",
  },
  {
    slug: "lol-esports",
    label: "LoL Esports",
    colorVar: "--color-merch-cat-esports",
    textColorVar: "--color-merch-ink",
  },
  {
    slug: "tft",
    label: "Teamfight Tactics",
    colorVar: "--color-merch-cat-tft",
    textColorVar: "--color-merch-on-dark",
  },
  {
    slug: "vct",
    label: "VCT",
    colorVar: "--color-merch-cat-vct",
    textColorVar: "--color-merch-on-dark",
  },
  {
    slug: "valorant",
    label: "Valorant",
    colorVar: "--color-merch-cat-valorant",
    textColorVar: "--color-merch-on-dark",
  },
  {
    slug: "2xko",
    label: "2XKO",
    colorVar: "--color-merch-cat-2xko",
    textColorVar: "--color-merch-ink",
  },
];

export const merchCategoryStripShowcase: ShowcaseEntry = {
  slug: "merch-category-strip",
  name: "Merch Category Strip",
  area: "merch",
  description:
    "Horizontal franchise chip strip that sits directly under the hero on the /merch homepage. Skewed parallelogram tiles (skewX(-12deg)), brand-colored backgrounds from --color-merch-cat-* tokens, › scroll affordance at right. Measured from merch.riotgames.com at 1280px.",
  variants: [
    {
      name: "Full strip — all 7 franchises",
      notes:
        "All franchise chips at full viewport width matching the real store layout. Brand colors from --color-merch-cat-* tokens.",
      backgrounds: ["dark"],
      render: () => (
        <div style={{ width: "100%" }}>
          <MerchCategoryStrip categories={DEFAULT_CATEGORIES} />
        </div>
      ),
    },
    {
      name: "Narrow viewport — scroll demo",
      notes:
        "At ~480px width chips overflow; the › affordance remains visible. Stateful scroll interaction in MerchCategoryStripScrollDemo (client component).",
      backgrounds: ["dark"],
      render: () => <MerchCategoryStripScrollDemo />,
    },
    {
      name: "Light-text chips only (LoL Esports + 2XKO)",
      notes:
        "Chips where textColorVar is --color-merch-ink (dark text on cyan/lime). Contrast check.",
      backgrounds: ["dark"],
      render: () => (
        <div style={{ width: "100%" }}>
          <MerchCategoryStrip
            categories={[
              {
                slug: "lol-esports",
                label: "LoL Esports",
                colorVar: "--color-merch-cat-esports",
                textColorVar: "--color-merch-ink",
              },
              {
                slug: "2xko",
                label: "2XKO",
                colorVar: "--color-merch-cat-2xko",
                textColorVar: "--color-merch-ink",
              },
            ]}
          />
        </div>
      ),
    },
    {
      name: "Without onSelectFranchise (presentational)",
      notes:
        "When no callback is supplied the strip is presentational — buttons are still keyboard-reachable but do nothing on click.",
      backgrounds: ["dark"],
      render: () => (
        <div style={{ width: "100%" }}>
          <MerchCategoryStrip categories={DEFAULT_CATEGORIES} />
        </div>
      ),
    },
  ],
};
