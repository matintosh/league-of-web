/**
 * /universe — League Universe landing page.
 *
 * A 1:1 recreation of universe.leagueoflegends.com/en_US/ showcasing:
 *   - UniverseHeroCarousel (full-width sliding hero — wired via LandingHeroClient)
 *   - UniverseCrestDivider (LATEST / FEATURED section headers)
 *   - UniverseStoryCard (story card grid)
 *
 * Art thumbnails use championSplashUrl() from @low/fixtures (Riot CDN, public).
 * This page is a server component — no 'use client'. Client state lives in
 * LandingHeroClient (apps/web/src/app/universe/landing-hero-client.tsx).
 */

import { UniverseCrestDivider } from "@low/ui";
import { UniverseStoryCard } from "@low/ui";
import type { UniverseHeroSlide } from "@low/ui";
import { championSplashUrl } from "@low/fixtures";
import { LandingHeroClient } from "./landing-hero-client";

// ---------------------------------------------------------------------------
// Hero carousel slides — 5 slides, verified DDragon IDs (200 on 16.13.1 splash)
// ---------------------------------------------------------------------------

const HERO_SLIDES: UniverseHeroSlide[] = [
  {
    overline: "The Unforgiven",
    title: "YASUO",
    splashUrl: championSplashUrl("Yasuo"),
    href: "/universe/champion/yasuo",
  },
  {
    overline: "The Rebel",
    title: "XAYAH",
    splashUrl: championSplashUrl("Xayah"),
    href: "/universe/champion/xayah",
  },
  {
    overline: "The Unshackled",
    title: "KAYN",
    splashUrl: championSplashUrl("Kayn"),
    href: "/universe/champion/kayn",
  },
  {
    overline: "The Nine-Tailed Fox",
    title: "AHRI",
    splashUrl: championSplashUrl("Ahri"),
    href: "/universe/champion/ahri",
  },
  {
    overline: "The Loose Cannon",
    title: "JINX",
    splashUrl: championSplashUrl("Jinx"),
    href: "/universe/champion/jinx",
  },
];

// ---------------------------------------------------------------------------
// Static fixture data — story cards
// ---------------------------------------------------------------------------

const LATEST_CARDS = [
  {
    id: "1",
    art: championSplashUrl("Kayn"),
    overline: "The Unshackled",
    title: "KAYN",
    kind: "story" as const,
  },
  {
    id: "2",
    art: championSplashUrl("XinZhao"),
    overline: "The Seneschal of Demacia",
    title: "XIN ZHAO",
    kind: "story" as const,
  },
  {
    id: "3",
    art: championSplashUrl("Xayah"),
    overline: "The Rebel",
    title: "XAYAH",
    kind: "story" as const,
  },
  {
    id: "4",
    art: championSplashUrl("Leblanc"),
    overline: "The Deceiver",
    title: "LEBLANC",
    kind: "story" as const,
  },
  {
    id: "5",
    art: championSplashUrl("Jhin"),
    overline: "The Virtuoso",
    title: "JHIN",
    kind: "comic" as const,
    badgeText: "8 Pages",
  },
  {
    id: "6",
    art: championSplashUrl("Ekko"),
    overline: "The Boy Who Shattered Time",
    title: "EKKO",
    kind: "story" as const,
  },
];

const FEATURED_CARDS = [
  {
    id: "f1",
    art: championSplashUrl("Ahri"),
    overline: "Ionia",
    title: "EVERYWHERE, AND EVERYONE",
    kind: "story" as const,
  },
  {
    id: "f2",
    art: championSplashUrl("Jinx"),
    overline: "Zaun · Short Stories",
    title: "PAINTINGS FRAMED IN HALF-LIGHT",
    kind: "comic" as const,
    badgeText: "6 Pages",
  },
  {
    id: "f3",
    art: championSplashUrl("Nasus"),
    overline: "Shurima",
    title: "HOUNDS OF IRON",
    kind: "story" as const,
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function UniversePage() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-universe-bg)" }}
    >
      {/* Hero carousel — controlled by LandingHeroClient (client boundary) */}
      <LandingHeroClient slides={HERO_SLIDES} />

      {/* LATEST section */}
      <section className="mx-auto max-w-6xl px-6 py-10" aria-labelledby="latest-heading">
        <div id="latest-heading">
          <UniverseCrestDivider label="LATEST" />
        </div>
        {/*
          Asymmetric hero layout (#975):
          Col 1–2, Row 1: cards 0 + 1 (portrait)
          Col 3, Rows 1–2: card 2 (tall hero, row-span-2)
          Col 1–2, Row 2: cards 3 + 4 (portrait)
          Card 5 goes after if present (new row).
          grid-rows-2 constrains the 2-row hero block.
        */}
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:grid-rows-2">
          {LATEST_CARDS.map((card, idx) => (
            <div
              key={card.id}
              className={
                idx === 2
                  ? "md:col-start-3 md:row-span-2 md:row-start-1 h-full"
                  : idx === 3
                    ? "md:col-start-1 md:row-start-2"
                    : idx === 4
                      ? "md:col-start-2 md:row-start-2"
                      : ""
              }
            >
              <UniverseStoryCard
                art={card.art}
                overline={card.overline}
                title={card.title}
                kind={card.kind}
                badgeText={card.badgeText}
                className={idx === 2 ? "h-full" : undefined}
              />
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED section */}
      <section className="mx-auto max-w-6xl px-6 py-10" aria-labelledby="featured-heading">
        <div id="featured-heading">
          <UniverseCrestDivider label="FEATURED" />
        </div>
        <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-3">
          {FEATURED_CARDS.map((card) => (
            <UniverseStoryCard
              key={card.id}
              art={card.art}
              overline={card.overline}
              title={card.title}
              kind={card.kind}
              badgeText={card.badgeText}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
