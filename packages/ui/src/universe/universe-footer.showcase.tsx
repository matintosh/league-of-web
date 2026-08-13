import type { ShowcaseEntry } from "../showcase";
import { UniverseFooter } from "./universe-footer";

const FULL_LINK_GROUPS = [
  {
    heading: "Explore",
    links: [
      { label: "Champions", href: "/universe/champions" },
      { label: "Regions", href: "/universe/regions" },
      { label: "Comics", href: "/universe/comics" },
      { label: "Stories", href: "/universe/stories" },
    ],
  },
  {
    heading: "Universe",
    links: [
      { label: "Alt Universe", href: "/universe/alt" },
      { label: "Map", href: "/universe/map" },
      { label: "Search", href: "/universe/search" },
    ],
  },
  {
    heading: "Riot Games",
    links: [
      { label: "League of Legends", href: "https://leagueoflegends.com" },
      { label: "Valorant", href: "https://playvalorant.com" },
      { label: "Wild Rift", href: "https://wildrift.leagueoflegends.com" },
      { label: "Teamfight Tactics", href: "https://teamfighttactics.leagueoflegends.com" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Help Center", href: "https://support.riotgames.com" },
      { label: "Terms of Service", href: "https://www.riotgames.com/en/terms-of-service" },
      { label: "Privacy Policy", href: "https://www.riotgames.com/en/privacy-notice" },
      { label: "Cookie Policy", href: "https://www.riotgames.com/en/cookie-policy" },
    ],
  },
];

const SOCIAL_LINKS = [
  { label: "Twitter", href: "https://twitter.com/LoLUniverse" },
  { label: "Facebook", href: "https://facebook.com/LeagueOfLegends" },
  { label: "Instagram", href: "https://instagram.com/leagueoflegends" },
  { label: "YouTube", href: "https://youtube.com/leagueoflegends" },
];

const LEGAL =
  "© 2025 Riot Games, Inc. All rights reserved. Riot Games, League of Legends and affiliated logos are trademarks, service marks, and/or registered trademarks of Riot Games, Inc.";

export const universeFooterShowcase: ShowcaseEntry = {
  slug: "universe-footer",
  name: "Universe Footer",
  area: "universe",
  description:
    "Riot Universe site footer. Dark near-black band, thin top hairline, Riot fist logo, link columns (caps gold-2), social row, legal line. Responsive auto columns.",
  referenceImage: "universe-landing.png",
  referenceNote: "Real universe.leagueoflegends.com footer — dark band below page content.",
  variants: [
    {
      name: "Full footer — 4 columns + social + legal",
      notes: "All props populated. Matches reference: muted logo, 4 link groups, social row, copyright.",
      backgrounds: ["dark"],
      render: () => (
        <div style={{ backgroundColor: "var(--color-universe-bg)" }}>
          <UniverseFooter
            linkGroups={FULL_LINK_GROUPS}
            social={SOCIAL_LINKS}
            legal={LEGAL}
          />
        </div>
      ),
    },
    {
      name: "Minimal — no columns, no social",
      notes: "linkGroups=[], social=undefined — just logo + legal.",
      backgrounds: ["dark"],
      render: () => (
        <div style={{ backgroundColor: "var(--color-universe-bg)" }}>
          <UniverseFooter
            linkGroups={[]}
            legal={LEGAL}
          />
        </div>
      ),
    },
    {
      name: "2 columns + no social",
      notes: "Shorter variant — two link groups, no social row.",
      backgrounds: ["dark"],
      render: () => (
        <div style={{ backgroundColor: "var(--color-universe-bg)" }}>
          <UniverseFooter
            linkGroups={FULL_LINK_GROUPS.slice(0, 2)}
            legal="© 2025 Riot Games, Inc."
          />
        </div>
      ),
    },
  ],
};
