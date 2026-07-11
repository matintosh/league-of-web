import type { ShowcaseEntry } from "../showcase";
import { ChampionCard } from "./champion-card";
import { loadingArtUrl, demoChampions } from "@low/fixtures";
import { ChampionCardClickableDemo } from "./champion-card.demo";

// Aatrox — first entry in demoChampions, always present
const aatrox = demoChampions[0]!;

export const championCardShowcase: ShowcaseEntry = {
  slug: "champion-card",
  name: "Champion Card",
  area: "collection",
  description: "Grid card for a champion in the collection browser. Loading-art portrait with a name bar; art zooms on hover.",
  variants: [
    {
      name: "Default",
      notes: "size=default (160×244), static",
      render: () => (
        <div data-shot="champ-default" className="p-6">
          <ChampionCard champion={aatrox} artSrc={loadingArtUrl(aatrox.id)} />
        </div>
      ),
    },
    {
      name: "Large",
      notes: "size=large (240×366)",
      render: () => (
        <div className="p-6">
          <ChampionCard champion={aatrox} artSrc={loadingArtUrl(aatrox.id)} size="large" />
        </div>
      ),
    },
    {
      name: "Long name truncation",
      notes: "Miss Fortune — long name truncated with ellipsis",
      render: () => (
        <div className="p-6">
          <ChampionCard
            champion={{ id: "MissFortune", name: "Miss Fortune" }}
            artSrc={loadingArtUrl("MissFortune")}
          />
        </div>
      ),
    },
    {
      name: "Clickable (interactive)",
      notes: "onSelect provided — card becomes a button, hover zooms art (use mouse to see zoom)",
      render: () => <ChampionCardClickableDemo />,
    },
    {
      name: "Grid of 4",
      notes: "Composition: 4 champions in a grid",
      render: () => (
        <div className="p-6 grid grid-cols-4 gap-2">
          {demoChampions.slice(0, 4).map((c) => (
            <ChampionCard key={c.id} champion={c} artSrc={loadingArtUrl(c.id)} />
          ))}
        </div>
      ),
    },
  ],
};
