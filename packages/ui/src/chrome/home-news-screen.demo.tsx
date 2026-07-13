"use client";

import { HomeNewsScreen } from "./home-news-screen";
import type { NewsArticle } from "./home-news-screen";
import { championSplashUrl, loadingArtUrl } from "@low/fixtures";

const HERO: NewsArticle = {
  id: "euphoria-origen",
  title: "EUPHORIA | ORIGEN",
  description:
    "Drakos and Froskvinn talk to Kold and Guilhoto about Origen's latest performance.",
  category: "ESPORTS / TRIVIA",
  thumbnailUrl: championSplashUrl("Jhin"),
  externalUrl: "#",
};

const PROMOS: NewsArticle[] = [
  {
    id: "beemo-plush",
    title: "Beemo Plush",
    thumbnailUrl: loadingArtUrl("Teemo", 8),
    externalUrl: "#",
  },
  {
    id: "eu-masters",
    title: "EU Masters returns for ESL Summer 2019",
    thumbnailUrl: championSplashUrl("Jinx"),
    externalUrl: "#",
  },
];

const SIDE: NewsArticle[] = [
  {
    id: "play-lucian",
    title: "Play Lucian like Hans Sama",
    description:
      "Hans Sama gives us the lowdown on how best to play The Purifier.",
    thumbnailUrl: championSplashUrl("Lucian"),
    externalUrl: "#",
  },
  {
    id: "arcade-compensation",
    title: "Compensation tokens for ARCADE pass...",
    description: "A bug caused some rewards to go afk.",
    thumbnailUrl: loadingArtUrl("MissFortune", 9),
    externalUrl: "#",
  },
  {
    id: "week5-picks",
    title: "Week 5's top five picks",
    description:
      "With Week 5 done and dusted, these were the five players — and their...",
    thumbnailUrl: championSplashUrl("Yasuo"),
    externalUrl: "#",
  },
  {
    id: "excel-g2",
    title: "Excel vs G2: Nothing to lose",
    description:
      "Excel finally have their first win of the Summer Split and will be hoping to...",
    thumbnailUrl: championSplashUrl("Garen"),
    externalUrl: "#",
  },
  {
    id: "lec-mic-check",
    title: "LEC Mic Check: Week 4",
    description:
      "Listen to the comms around Caps' surprise pick in this week's #LEC Mic...",
    thumbnailUrl: championSplashUrl("Ahri"),
    externalUrl: "#",
  },
];

export function HomeNewsScreenDemo() {
  return (
    <div style={{ width: 860, height: 580 }}>
      <HomeNewsScreen
        heroArticle={HERO}
        promoTiles={PROMOS}
        sideArticles={SIDE}
        onArticleClick={(a) => console.log("article click:", a.id)}
        onSeeAllNews={() => console.log("see all news")}
      />
    </div>
  );
}
