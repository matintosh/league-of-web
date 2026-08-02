import type { ShowcaseEntry } from "../showcase";
import { LandingHub } from "./landing-hub";

const DEMO_CARDS = [
  {
    id: "client",
    label: "Client",
    description: "1:1 web recreation of the League of Legends client — fully interactive, component-for-component faithful.",
    href: "/client",
    badge: "Hextech design system",
  },
  {
    id: "merch",
    label: "Merch",
    description: "Riot merch store scaffold — a new section with its own modern e-commerce design language.",
    href: "/merch",
    badge: "Merch design system",
  },
  {
    id: "showcase",
    label: "Showcase",
    description: "Browse every UI component built for this project: props, variants, and reference screenshots.",
    href: "/showcase",
  },
];

export const landingHubShowcase: ShowcaseEntry = {
  slug: "landing-hub",
  name: "Landing Hub",
  area: "chrome",
  description:
    "Root portfolio hub offering three section choices: Client (/client), Merch (/merch), and Showcase (/showcase). Uses Hextech tokens for chrome; links use plain <a> so next/link wires at the page layer.",
  variants: [
    {
      name: "Default — three sections",
      render: () => (
        <LandingHub
          title="League of Web"
          subtitle="A portfolio project: a 1:1 web recreation of the LoL client, a Riot merch store scaffold, and a component showcase."
          cards={DEMO_CARDS}
        />
      ),
    },
    {
      name: "Minimal — title only, no subtitle",
      render: () => (
        <LandingHub
          cards={DEMO_CARDS}
        />
      ),
    },
  ],
};
