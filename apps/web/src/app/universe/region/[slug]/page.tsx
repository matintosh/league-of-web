/**
 * /universe/region/[slug] — Region detail page.
 *
 * Composition:
 *   - UniverseBreadcrumb (Regions › NAME)
 *   - UniverseChampionBioHero (champion splash as region hero art)
 *   - Region crest icon + lore blurb
 *   - UniverseCrestDivider label="Champions of [REGION]"
 *   - UniverseRegionCard cross-links to other regions
 *
 * Server component — no 'use client'. All fixture data supplied in-file.
 * generateStaticParams pre-renders all 13 canonical Runeterra regions.
 * Champion splashes from @low/fixtures are stand-in region art.
 */

import { notFound } from "next/navigation";
import {
  UniverseBreadcrumb,
  UniverseChampionBioHero,
  UniverseCrestDivider,
  UniverseRegionCard,
} from "@low/ui";
import { championSplashUrl, regionCrestUrl } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Fixture map — region data keyed by slug
// ---------------------------------------------------------------------------

interface RegionFixture {
  /** Display name (Title Case). */
  name: string;
  /** URL slug — matches the index page. */
  slug: string;
  /** DDragon champion id for splash art stand-in. */
  championId: string;
  /** Region label (ALL CAPS, shown in breadcrumb + hero). */
  label: string;
  /** Short lore blurb. */
  lore: string;
  /** Canonical region name for regionCrestUrl lookup. */
  crestKey: string;
}

const REGION_MAP: Record<string, RegionFixture> = {
  demacia: {
    name: "Demacia",
    slug: "demacia",
    championId: "Garen",
    label: "DEMACIA",
    crestKey: "demacia",
    lore: "A powerful monarchy that has long stood as a bastion of justice, order, and military strength. Deep within its borders magic is feared and suppressed — those who wield it risk imprisonment or worse. Even so, the kingdom's champions fight to protect the realm they love.",
  },
  noxus: {
    name: "Noxus",
    slug: "noxus",
    championId: "Darius",
    label: "NOXUS",
    crestKey: "noxus",
    lore: "A brutal yet calculating empire that values strength above all else. Noxian society is built on conquest and might — those who prove themselves earn power, regardless of their birth. Its armies have carved an empire across half of Runeterra through iron will and relentless ambition.",
  },
  ionia: {
    name: "Ionia",
    slug: "ionia",
    championId: "Irelia",
    label: "IONIA",
    crestKey: "ionia",
    lore: "A land of ancient traditions, spiritual wisdom, and breathtaking natural beauty. Ionia is attuned to the magic that flows through all living things. Its people prize balance and harmony — but when that balance is threatened, Ionia's warriors defend it with fierce resolve.",
  },
  piltover: {
    name: "Piltover",
    slug: "piltover",
    championId: "Caitlyn",
    label: "PILTOVER",
    crestKey: "piltover",
    lore: "Known as the City of Progress, Piltover is a gleaming metropolis where human ingenuity and hextech invention have turned ambition into reality. Its merchant princes and Enforcer corps keep the city prosperous — though progress always casts long shadows.",
  },
  zaun: {
    name: "Zaun",
    slug: "zaun",
    championId: "Jinx",
    label: "ZAUN",
    crestKey: "zaun",
    lore: "Beneath Piltover's gleaming spires lies Zaun — a tangled underworld of haze-choked streets, brilliant inventors, and desperate survivors. Discarded by the city above, Zaunites forge their own destiny through cunning, chemistry, and sheer will to live.",
  },
  freljord: {
    name: "Freljord",
    slug: "freljord",
    championId: "Ashe",
    label: "FRELJORD",
    crestKey: "freljord",
    lore: "A vast, frozen wilderness home to warring tribes, ancient ice-magic, and gods older than memory. Life in the Freljord demands strength and sacrifice. Three queens vie for dominion over the permafrost, while darker powers stir beneath the ice.",
  },
  shurima: {
    name: "Shurima",
    slug: "shurima",
    championId: "Azir",
    label: "SHURIMA",
    crestKey: "shurima",
    lore: "Once the greatest empire the world had ever known, Shurima rose and fell over millennia. Now its golden sun disc blazes anew, and an emperor reborn rallies the sands. Ancient god-warriors, scheming Ascended, and forgotten dynasties wake to reclaim what was lost.",
  },
  ixtal: {
    name: "Ixtal",
    slug: "ixtal",
    championId: "Qiyana",
    label: "IXTAL",
    crestKey: "ixtal",
    lore: "Hidden deep within Runeterra's oldest jungles, Ixtal is a secluded empire of elemental mastery. Its people retreated from the wider world long ago, developing sorcery and civilization in isolation. Today its ruling caste guards its secrets from all outsiders.",
  },
  bilgewater: {
    name: "Bilgewater",
    slug: "bilgewater",
    championId: "MissFortune",
    label: "BILGEWATER",
    crestKey: "bilgewater",
    lore: "A city of pirates, bounty hunters, and monster hunters — built on a cluster of islands at the edge of the known world. Bilgewater is dangerous, vibrant, and utterly lawless. If you have coin and nerve, anything is possible in its salt-soaked streets.",
  },
  "bandle-city": {
    name: "Bandle City",
    slug: "bandle-city",
    championId: "Tristana",
    label: "BANDLE CITY",
    crestKey: "bandle city",
    lore: "A whimsical realm that exists just beyond mortal sight, Bandle City is home to the yordles — a mischievous and warm-hearted people. Their homeland shifts through many places at once, visible only to those who believe. Yordles venture into the wider world out of insatiable curiosity.",
  },
  "shadow-isles": {
    name: "Shadow Isles",
    slug: "shadow-isles",
    championId: "Thresh",
    label: "SHADOW ISLES",
    crestKey: "shadow isles",
    lore: "Once a beautiful archipelago now cursed by a catastrophe known as the Ruination, the Shadow Isles are a realm of the undead and the living dead. A spectral mist called the Black Mist rolls endlessly across these blighted shores, twisting everything it touches.",
  },
  targon: {
    name: "Targon",
    slug: "targon",
    championId: "Leona",
    label: "TARGON",
    crestKey: "targon",
    lore: "Towering above the clouds of southern Runeterra, Mount Targon is the most daunting peak in the known world. Those few who survive its slopes gain access to vast celestial power — or are consumed by it. Godlike beings known as Aspects descend here to inhabit mortal hosts.",
  },
  void: {
    name: "The Void",
    slug: "void",
    championId: "Khazix",
    label: "THE VOID",
    crestKey: "the void",
    lore: "Beyond the edges of the known world lies a realm of pure, ravenous nothingness. The Void exists in opposition to all life — a dimension of unfathomable alien consciousness and gnawing hunger. When its rifts tear open, creatures of pure malice pour through to devour everything.",
  },
};

// Cross-link data matches the index exactly
const ALL_REGIONS = [
  { name: "DEMACIA", slug: "demacia", championId: "Garen" },
  { name: "NOXUS", slug: "noxus", championId: "Darius" },
  { name: "IONIA", slug: "ionia", championId: "Irelia" },
  { name: "PILTOVER", slug: "piltover", championId: "Caitlyn" },
  { name: "ZAUN", slug: "zaun", championId: "Jinx" },
  { name: "FRELJORD", slug: "freljord", championId: "Ashe" },
  { name: "SHURIMA", slug: "shurima", championId: "Azir" },
  { name: "IXTAL", slug: "ixtal", championId: "Qiyana" },
  { name: "BILGEWATER", slug: "bilgewater", championId: "MissFortune" },
  { name: "BANDLE CITY", slug: "bandle-city", championId: "Tristana" },
  { name: "SHADOW ISLES", slug: "shadow-isles", championId: "Thresh" },
  { name: "TARGON", slug: "targon", championId: "Leona" },
  { name: "THE VOID", slug: "void", championId: "Khazix" },
] as const;

// ---------------------------------------------------------------------------
// Static params — pre-render all 13 canonical region slugs at build time
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return Object.keys(REGION_MAP).map((slug) => ({ slug }));
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function RegionDetailPage({ params }: Props) {
  const { slug } = await params;
  const region = REGION_MAP[slug];

  if (!region) notFound();

  const crestUrl = regionCrestUrl(region.crestKey);
  const splashUrl = championSplashUrl(region.championId);

  // Pick 4 other regions for cross-links (skip current)
  const crossLinks = ALL_REGIONS.filter((r) => r.slug !== slug).slice(0, 4);

  return (
    <div style={{ backgroundColor: "var(--color-universe-bg)" }}>
      {/* Breadcrumb */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-6">
        <UniverseBreadcrumb
          items={[
            { label: "Regions", href: "/universe/region" },
            { label: region.name },
          ]}
        />
      </div>

      {/* Region hero — champion splash as full-bleed art, negative margin bleeds under breadcrumb */}
      <div className="-mt-8">
        <UniverseChampionBioHero
          name={region.label}
          title={region.name}
          splashUrl={splashUrl}
          height={480}
          showCrest={false}
        />
      </div>

      {/* Lore section */}
      <section className="mx-auto max-w-3xl px-6 py-10 text-center">
        {/* Region crest icon — real CDN asset */}
        {crestUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={crestUrl}
            alt={`${region.name} crest`}
            width={80}
            height={80}
            className="mx-auto mb-6 object-contain"
          />
        )}

        {/* Lore blurb */}
        <p
          className="text-base leading-relaxed"
          style={{ color: "var(--color-universe-story-ink)" }}
        >
          {region.lore}
        </p>
      </section>

      {/* Explore other regions */}
      <section
        className="mx-auto max-w-6xl px-6 pb-16"
        aria-labelledby="other-regions-heading"
      >
        <div id="other-regions-heading">
          <UniverseCrestDivider label="Explore Other Regions" />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4">
          {crossLinks.map((r) => (
            <UniverseRegionCard
              key={r.slug}
              name={r.name}
              slug={r.slug}
              art={championSplashUrl(r.championId)}
              href={`/universe/region/${r.slug}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
