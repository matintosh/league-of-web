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
    id: "login",
    label: "Login",
    description: "The League of Legends sign-in screen — animated background, credential form, and Hextech chrome.",
    href: "/login",
    badge: "Hextech design system",
  },
  {
    id: "merch",
    label: "Merch",
    description: "Riot merch store scaffold — a new section with its own modern e-commerce design language.",
    href: "/merch",
    badge: "Merch design system",
  },
];

const SHOWCASE_UTILITY = { label: "Component Showcase →", href: "/showcase" };

export const landingHubShowcase: ShowcaseEntry = {
  slug: "landing-hub",
  name: "Landing Hub",
  area: "chrome",
  description:
    "Root portfolio hub with three primary section cards — Client (/client), Login (/login), Merch (/merch) — and a secondary utility link to /showcase. Uses Hextech tokens for chrome; links use plain <a> so next/link wires at the page layer.",
  variants: [
    {
      name: "Default — three primary sections + utility link",
      render: () => (
        <LandingHub
          title="League of Web"
          subtitle="A portfolio project: a 1:1 web recreation of the LoL client, a Riot merch store scaffold, and a component showcase."
          cards={DEMO_CARDS}
          utilityLink={SHOWCASE_UTILITY}
        />
      ),
    },
    {
      name: "Minimal — title only, no subtitle",
      render: () => (
        <LandingHub
          cards={DEMO_CARDS}
          utilityLink={SHOWCASE_UTILITY}
        />
      ),
    },
    {
      name: "No utility link",
      render: () => (
        <LandingHub
          title="League of Web"
          subtitle="Variant without the showcase utility link."
          cards={DEMO_CARDS}
        />
      ),
    },
  ],
};
