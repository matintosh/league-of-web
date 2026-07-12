import type { ShowcaseEntry } from "../showcase";
import { FeaturedTabDemo } from "./featured-tab.demo";

export const featuredTabShowcase: ShowcaseEntry = {
  slug: "featured-tab",
  name: "Featured Tab",
  area: "store",
  description:
    "The Store landing screen. Two-column layout: left column has a 460×300px hero carousel (with dot navigation) and a TOP SELLERS strip below; right column has a 2×2 featured bundle/pass grid.",
  variants: [
    {
      name: "Full layout — fixture data",
      notes:
        "Hero carousel with 5 slides (click dots to switch), 2×2 featured grid with RP prices and wishlist toggles, 5-item TOP SELLERS strip. Click heart icons to toggle wishlist.",
      render: () => <FeaturedTabDemo />,
    },
  ],
};
