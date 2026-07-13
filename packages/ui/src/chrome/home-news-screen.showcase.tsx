import type { ShowcaseEntry } from "../showcase";
import { HomeNewsScreenDemo } from "./home-news-screen.demo";

export const homeNewsScreenShowcase: ShowcaseEntry = {
  slug: "home-news-screen",
  name: "HomeNewsScreen",
  area: "chrome",
  description:
    "Home → NEWS sub-tab: hero tile, 2 promo tiles, 5 side articles, See all news link.",
  variants: [
    {
      name: "Default (fully populated)",
      notes: "Matches docs/reference/client-home-news.jpg",
      render: () => <HomeNewsScreenDemo />,
    },
  ],
};
