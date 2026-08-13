/**
 * /universe/champion/[slug] — Champion bio page.
 *
 * Ref: docs/reference/universe-live-champion-bio.png
 *
 * Composition:
 *   - UniverseBreadcrumb (Champions › NAME)
 *   - UniverseChampionBioHero (full-bleed splash + name + title)
 *   - "Related Stories" UniverseCrestDivider
 *   - UniverseStoryCard rail (3-up)
 *
 * Server component — no 'use client'. Fixture data in this file only.
 * generateStaticParams pre-renders lux / jinx / ahri / aatrox / yasuo.
 */

import { notFound } from "next/navigation";
import {
  UniverseBreadcrumb,
  UniverseChampionBioHero,
  UniverseCrestDivider,
  UniverseStoryCard,
} from "@low/ui";
import { championSplashUrl } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Fixture map — champion data keyed by slug
// ---------------------------------------------------------------------------

interface ChampionFixture {
  /** DDragon champion id for splash URL. */
  ddId: string;
  /** Display name (Title Case). */
  name: string;
  /** Subtitle shown below the name on the hero. */
  title: string;
  /** Region label. */
  region: string;
  /** Related story cards (up to 4). */
  stories: {
    id: string;
    art: string;
    overline: string;
    title: string;
    kind: "story" | "comic" | "video" | "music";
    badgeText?: string;
  }[];
}

const CHAMPION_MAP: Record<string, ChampionFixture> = {
  lux: {
    ddId: "Lux",
    name: "Lux",
    title: "The Lady of Luminosity",
    region: "DEMACIA",
    stories: [
      {
        id: "ls1",
        art: championSplashUrl("Lux"),
        overline: "Demacia · Short Story",
        title: "BURNING TIDES",
        kind: "story",
      },
      {
        id: "ls2",
        art: championSplashUrl("Garen"),
        overline: "Garen",
        title: "THE WEIGHT OF LIGHT",
        kind: "story",
      },
      {
        id: "ls3",
        art: championSplashUrl("Sylas"),
        overline: "Sylas · Comics",
        title: "UNSHACKLED",
        kind: "comic",
        badgeText: "8 Pages",
      },
    ],
  },
  jinx: {
    ddId: "Jinx",
    name: "Jinx",
    title: "The Loose Cannon",
    region: "ZAUN",
    stories: [
      {
        id: "js1",
        art: championSplashUrl("Jinx"),
        overline: "Zaun · Short Stories",
        title: "PAINTINGS FRAMED IN HALF-LIGHT",
        kind: "comic",
        badgeText: "6 Pages",
      },
      {
        id: "js2",
        art: championSplashUrl("Vi"),
        overline: "Vi",
        title: "SISTERHOOD OF DESTRUCTION",
        kind: "story",
      },
      {
        id: "js3",
        art: championSplashUrl("Ekko"),
        overline: "Zaun",
        title: "FLASHBACK",
        kind: "video",
      },
    ],
  },
  ahri: {
    ddId: "Ahri",
    name: "Ahri",
    title: "The Nine-Tailed Fox",
    region: "IONIA",
    stories: [
      {
        id: "as1",
        art: championSplashUrl("Ahri"),
        overline: "Ionia",
        title: "EVERYWHERE, AND EVERYONE",
        kind: "story",
      },
      {
        id: "as2",
        art: championSplashUrl("Akali"),
        overline: "Ionia · Short Story",
        title: "THE MASK OF MANY FACES",
        kind: "story",
      },
      {
        id: "as3",
        art: championSplashUrl("Irelia"),
        overline: "Ionia",
        title: "MEMENTO MORI",
        kind: "comic",
        badgeText: "10 Pages",
      },
    ],
  },
  aatrox: {
    ddId: "Aatrox",
    name: "Aatrox",
    title: "The World Ender",
    region: "RUNETERRA",
    stories: [
      {
        id: "ax1",
        art: championSplashUrl("Aatrox"),
        overline: "Runeterra",
        title: "DARKIN BLADE",
        kind: "story",
      },
      {
        id: "ax2",
        art: championSplashUrl("Riven"),
        overline: "Noxus",
        title: "THE SILVER TONGUE",
        kind: "story",
      },
      {
        id: "ax3",
        art: championSplashUrl("Viego"),
        overline: "Shadow Isles",
        title: "RUINATION PROLOGUE",
        kind: "comic",
        badgeText: "12 Pages",
      },
    ],
  },
  yasuo: {
    ddId: "Yasuo",
    name: "Yasuo",
    title: "The Unforgiven",
    region: "IONIA",
    stories: [
      {
        id: "ys1",
        art: championSplashUrl("Yasuo"),
        overline: "4 Skins",
        title: "EVERYTHING WE SHOULD HAVE SAID",
        kind: "comic",
        badgeText: "4 Pages",
      },
      {
        id: "ys2",
        art: championSplashUrl("Yone"),
        overline: "Ionia",
        title: "YONE OF THE UNFORGOTTEN",
        kind: "story",
      },
      {
        id: "ys3",
        art: championSplashUrl("Irelia"),
        overline: "Ionia",
        title: "THE LAST SERENADE",
        kind: "music",
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Static params — pre-render these champion slugs at build time
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return Object.keys(CHAMPION_MAP).map((slug) => ({ slug }));
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ChampionBioPage({ params }: Props) {
  const { slug } = await params;
  const champ = CHAMPION_MAP[slug];

  if (!champ) notFound();

  return (
    <div style={{ backgroundColor: "var(--color-universe-bg)" }}>
      {/* Breadcrumb — overlaid above hero, padded */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-6">
        <UniverseBreadcrumb
          items={[
            { label: "Champions", href: "/universe/champions" },
            { label: champ.name },
          ]}
        />
      </div>

      {/* Champion bio hero — full-bleed splash art, negative margin to bleed under breadcrumb */}
      <div className="-mt-8">
        <UniverseChampionBioHero
          name={champ.name}
          title={champ.title}
          splashUrl={championSplashUrl(champ.ddId)}
          height={480}
        />
      </div>

      {/* Related Stories section */}
      <section
        className="mx-auto max-w-6xl px-6 py-10"
        aria-labelledby="related-stories-heading"
      >
        <div id="related-stories-heading">
          <UniverseCrestDivider label="Related Stories" />
        </div>

        {/* Story card rail — 3 columns */}
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {champ.stories.map((story) => (
            <UniverseStoryCard
              key={story.id}
              art={story.art}
              overline={story.overline}
              title={story.title}
              kind={story.kind}
              badgeText={story.badgeText}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
