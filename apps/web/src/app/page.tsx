import { LandingHub } from "@low/ui";
import type { LandingHubCard } from "@low/ui";

const HUB_CARDS: LandingHubCard[] = [
  {
    id: "client",
    label: "Client",
    description:
      "1:1 web recreation of the League of Legends client — fully interactive, component-for-component faithful.",
    href: "/client",
    badge: "Hextech design system",
  },
  {
    id: "login",
    label: "Login",
    description:
      "The League of Legends sign-in screen — animated background, credential form, and Hextech chrome.",
    href: "/login",
    badge: "Hextech design system",
  },
  {
    id: "launcher",
    label: "Launcher",
    description:
      "The Riot/League game launcher — the screen after login, before the client opens. LoL launcher (Overview · Patch Notes · Esports · Merch) plus the Riot multi-game Home and Games library.",
    href: "/launcher",
    badge: "Launcher design system",
  },
  {
    id: "merch",
    label: "Merch",
    description:
      "Riot merch store scaffold — a new section with its own modern e-commerce design language.",
    href: "/merch",
    badge: "Merch design system",
    showcaseLink: { label: "Browse components →", href: "/merch/showcase" },
  },
];

/**
 * Landing hub — root of league-of-web.
 *
 * Offers three primary entry points: the LoL client clone (/client), the login
 * screen (/login), and the Riot merch store scaffold (/merch). A secondary
 * utility link to the component showcase (/showcase) is rendered separately.
 *
 * Uses Hextech tokens for hub chrome (the site-wide token theme is already
 * loaded by the root layout); no merch tokens are needed here.
 */
export default function Home() {
  return (
    <LandingHub
      title="League of Web"
      subtitle="A portfolio project: a 1:1 web recreation of the LoL client, the game launcher, a Riot merch store scaffold, and a component showcase."
      cards={HUB_CARDS}
      utilityLink={{ label: "Component Showcase →", href: "/showcase" }}
    />
  );
}
