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
    id: "merch",
    label: "Merch",
    description:
      "Riot merch store scaffold — a new section with its own modern e-commerce design language.",
    href: "/merch",
    badge: "Merch design system",
  },
  {
    id: "showcase",
    label: "Showcase",
    description:
      "Browse every UI component built for this project: props, variants, and reference screenshots.",
    href: "/showcase",
  },
];

/**
 * Landing hub — root of league-of-web.
 *
 * Offers three entry points: the LoL client clone (/client), the Riot merch
 * store scaffold (/merch), and the component showcase (/showcase). The login
 * page (/login) is reachable via the client's sign-out path.
 *
 * Uses Hextech tokens for hub chrome (the site-wide token theme is already
 * loaded by the root layout); no merch tokens are needed here.
 */
export default function Home() {
  return (
    <LandingHub
      title="League of Web"
      subtitle="A portfolio project: a 1:1 web recreation of the LoL client, a Riot merch store scaffold, and a component showcase."
      cards={HUB_CARDS}
    />
  );
}
