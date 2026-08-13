/**
 * /universe — League Universe landing page scaffold.
 *
 * A 1:1 skeleton of universe.leagueoflegends.com/en_US/ showcasing the three
 * foundational Universe components:
 *   - UniverseTopNav (wired in the layout)
 *   - UniverseCrestDivider (LATEST / FEATURED section headers)
 *   - UniverseStoryCard (story card grid)
 *
 * Art thumbnails use championSplashUrl() from @low/fixtures (Riot CDN, public).
 * This page is a server component — no 'use client'.
 */

import { UniverseCrestDivider } from "@low/ui";
import { UniverseStoryCard } from "@low/ui";
import { championSplashUrl } from "@low/fixtures";

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
    art: championSplashUrl("Xin Zhao"),
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
    art: championSplashUrl("Mel"),
    overline: "The Medarda Heir",
    title: "MEL",
    kind: "comic" as const,
    badgeText: "8 Pages",
  },
  {
    id: "6",
    art: championSplashUrl("Yunara"),
    overline: "The Harbinger Faith",
    title: "YUNARA",
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
      {/* Hero placeholder — full-width champion art banner */}
      <section
        className="relative flex w-full items-end justify-center overflow-hidden"
        style={{ height: "440px" }}
        aria-label="Featured champion hero"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={championSplashUrl("Yone")}
          alt="Featured champion"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "center 20%" }}
        />
        {/* Dark gradient scrim */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,10,14,0.15) 0%, rgba(10,10,14,0.6) 70%, var(--color-universe-bg) 100%)",
          }}
          aria-hidden="true"
        />
        {/* Champion name lockup */}
        <div className="relative z-10 mb-10 flex flex-col items-center gap-1 text-center">
          <p
            className="text-xs uppercase tracking-[0.2em]"
            style={{ color: "var(--color-gold-2)", fontFamily: "var(--font-body)" }}
          >
            The Azakana Exorcist
          </p>
          <h1
            className="font-display text-5xl uppercase tracking-widest"
            style={{ color: "var(--color-gold-1)" }}
          >
            LOCKE
          </h1>
        </div>
      </section>

      {/* LATEST section */}
      <section className="mx-auto max-w-6xl px-6 py-10" aria-labelledby="latest-heading">
        <div id="latest-heading">
          <UniverseCrestDivider label="LATEST" />
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
          {LATEST_CARDS.map((card) => (
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
