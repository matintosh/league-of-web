import type { ShowcaseEntry } from "../showcase";
import { NewsCard } from "./news-card";
import { championSplashUrl } from "@low/fixtures";
import { NewsCardDemo } from "./news-card.demo";

export const newsCardShowcase: ShowcaseEntry = {
  slug: "news-card",
  name: "NewsCard",
  area: "chrome",
  description: "Home-feed card matching leagueoflegends.com/news — dark-panel adaptation.",
  variants: [
    {
      name: "Full card",
      notes: 'data-shot="news-full"',
      render: () => (
        <div data-shot="news-full" className="w-80">
          <NewsCard
            category="GAME UPDATES"
            date="6/23/2026"
            title="League of Legends Patch 26.13 Notes"
            description="Absolutely no demons allowed. — Locke"
            imageSrc={championSplashUrl("Ahri")}
          />
        </div>
      ),
    },
    {
      name: "No description",
      render: () => (
        <div className="w-80">
          <NewsCard
            category="ESPORTS"
            date="6/20/2026"
            title="MSI 2026 Bracket Stage — Week One"
            imageSrc={championSplashUrl("Jinx")}
          />
        </div>
      ),
    },
    {
      name: "Long title clamp",
      notes: "title exceeds 2 lines → ellipsis",
      render: () => (
        <div className="w-80">
          <NewsCard
            category="CHAMPIONS"
            date="6/18/2026"
            title="Call Your Shot with Broken Covenant Rin — Which players made their mark on the MSI 2026 stage?"
            description="A story so long it wraps beyond the two-line clamp and gets cut off cleanly."
            imageSrc={championSplashUrl("Lux")}
          />
        </div>
      ),
    },
    {
      name: "Clickable",
      notes: "onOpen provided → renders as <button>; click increments counter",
      render: () => <NewsCardDemo />,
    },
    {
      name: "Hover note",
      notes:
        "Hover the card above to see the thumbnail zoom (group-hover:scale-105). The div branch also zooms — both branches have group class.",
      render: () => null,
    },
  ],
};
