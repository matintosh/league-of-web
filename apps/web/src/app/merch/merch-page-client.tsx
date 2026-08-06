"use client";

/**
 * MerchPageClient — client shell for the /merch homepage.
 * Extracted so the server page.tsx can delegate all callback-bearing props here.
 * Receives pre-built product cards and hero slides as children/props.
 *
 * Hero + franchise strip are now UNIFIED: the franchise control bar lives
 * INSIDE MerchHeroBanner (as its control-bar footer), matching the real site.
 * The standalone <MerchCategoryStrip> is no longer rendered on this page.
 *
 * Slide mapping decision:
 *   - We have 2 real hero images (slide-classic → LoL, slide-vendetta → Riftbound).
 *   - The first two franchise tiles (LoL, Riftbound) are wired to those slides
 *     via slideId. The remaining 6 tiles have no dedicated slide — clicking them
 *     calls onSelectFranchise → router.push('/merch/collection/<slug>'), matching
 *     real behavior where extra tiles route to their collection page.
 *
 * Homepage depth (matching real merch.riotgames.com ~9286px at 1280px):
 *   - Hero banner + franchise strip
 *   - Per-franchise group: full-width 1278×748 feature card + 4-up product grid
 *   - LOAD MORE button (presentational; matches the real red gold CTA)
 *   - LATEST COLLABORATIONS section (MerchCollabCarousel — HP/OMEN + Secretlab)
 *   - Gift card promo band
 *   - Footer
 */

import { useState } from "react";
import {
  MerchHeader,
  MerchProductCard,
  MerchFooter,
  MerchGiftCardBand,
  MerchHeroBanner,
  MerchProductGrid,
  MerchCartDrawer,
  MerchCollabCarousel,
} from "@low/ui";
import type { MerchContactFormValues, MerchGiftCard, MerchHeroFranchise, MerchCollabEntry } from "@low/ui";
import {
  LolWordmark,
  RiftboundLogo,
  LolEsportsLogo,
  TftLogo,
  VctLogo,
  ValorantLogo,
  TwoXkoLogo,
  ArcaneLogo,
} from "@low/ui";
import {
  championSplashUrl,
  MERCH_PRODUCTS,
  MERCH_FRANCHISE_FEATURE_CARDS,
  merchAssetUrl,
} from "@low/fixtures";
import type { MerchCartItem, MerchProduct, MerchFranchiseFeatureCard } from "@low/fixtures";
import type { MerchHeroSlide } from "@low/ui";
import { useRouter } from "next/navigation";
import { useMerchNav } from "@/lib/merch-nav";

// ---------------------------------------------------------------------------
// Product groups — partition MERCH_PRODUCTS by franchiseLabel for section layout
// ---------------------------------------------------------------------------

/** Franchise groups in the order they appear on the real homepage. */
const FRANCHISE_ORDER = [
  "League of Legends",
  "LoL Esports",
  "Teamfight Tactics",
  "VALORANT",
  "Riftbound",
  "Arcane",
];

function groupProductsByFranchise(products: MerchProduct[]): Map<string, MerchProduct[]> {
  const map = new Map<string, MerchProduct[]>();
  // Insert in franchise order first so Map iteration order is deterministic.
  for (const label of FRANCHISE_ORDER) {
    map.set(label, []);
  }
  for (const p of products) {
    const label = p.franchiseLabel ?? "Other";
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(p);
  }
  // Drop empty groups (e.g. if a franchise has no products).
  for (const [k, v] of map.entries()) {
    if (v.length === 0) map.delete(k);
  }
  return map;
}

// Products excluding sale items — sale items appear in a separate Sale group at the end
const MAIN_PRODUCTS = MERCH_PRODUCTS.filter((p) => !p.badges?.includes("Sale"));
const SALE_PRODUCTS = MERCH_PRODUCTS.filter((p) => p.badges?.includes("Sale"));

// How many groups to show before the LOAD MORE button
const INITIAL_GROUP_LIMIT = 4;

// ---------------------------------------------------------------------------
// Hero slides
// ---------------------------------------------------------------------------

// Real hero banners — full-art campaign banners sourced from cdn.sanity.io (hotlinkable).
// Slide A: League of Legends Classic campaign (consumer_products_live, 3296x1030).
// Slide B: Riftbound Vendetta Akali (consumer_products_live, 3296x1030).
const HERO_SLIDES: MerchHeroSlide[] = [
  {
    id: "slide-classic",
    imageUrl: merchAssetUrl("3dbbf5ce0d30940b0db3741cdb9d1bed12afce48-3296x1030.png", {
      w: 1920,
      dataset: "consumer_products_live",
    }),
    imageAlt: "League of Legends Classic — Shop the Collection",
    ctaLabel: "Shop All",
    ctaVariant: "light",
    ctaCorner: "bottom-right",
    align: "left",
  },
  {
    id: "slide-vendetta",
    imageUrl: merchAssetUrl("a01262bae9dcf03621b7f850c89b86535b76638a-3296x1030.jpg", {
      w: 1920,
      dataset: "consumer_products_live",
    }),
    imageAlt: "Riftbound Vendetta — New TCG Products",
    ctaLabel: "Shop Now",
    ctaVariant: "red",
    ctaCorner: "bottom-right",
    align: "left",
  },
];

// ---------------------------------------------------------------------------
// Gift cards
// ---------------------------------------------------------------------------

const GIFT_CARDS: [MerchGiftCard, MerchGiftCard] = [
  {
    imageUrl: championSplashUrl("Jinx", 0),
    label: "Riot merch gift card — OMEN 16 Edition",
  },
  {
    imageUrl: championSplashUrl("Vi", 0),
    label: "Riot merch gift card — VALORANT Edition",
  },
];

// ---------------------------------------------------------------------------
// Franchise tiles
// ---------------------------------------------------------------------------

/**
 * Franchise tiles — 8 real brands from the live site.
 * Background colors sampled from merch.riotgames.com via Playwright at 1280px.
 * slideId wires LoL→slide-classic and Riftbound→slide-vendetta.
 * All other tiles have no slideId and route to /merch/collection/<slug>.
 */
const FRANCHISE_TILES: MerchHeroFranchise[] = [
  {
    slug: "league-of-legends",
    label: "League of Legends",
    logo: <LolWordmark />,
    colorVar: "--color-merch-cat-lol",
    textColorVar: "--color-merch-on-dark",
    slideId: "slide-classic",
  },
  {
    slug: "riftbound",
    label: "Riftbound",
    logo: <RiftboundLogo />,
    colorVar: "--color-merch-cat-riftbound",
    textColorVar: "--color-merch-on-dark",
    slideId: "slide-vendetta",
  },
  {
    slug: "lol-esports",
    label: "LoL Esports",
    logo: <LolEsportsLogo />,
    colorVar: "--color-merch-cat-esports",
    textColorVar: "--color-merch-ink",
    // No slideId — routes to /merch/collection/lol-esports
  },
  {
    slug: "tft",
    label: "Teamfight Tactics",
    logo: <TftLogo />,
    colorVar: "--color-merch-cat-tft",
    textColorVar: "--color-merch-on-dark",
    // No slideId — routes to /merch/collection/tft
  },
  {
    slug: "vct",
    label: "VCT",
    logo: <VctLogo />,
    colorVar: "--color-merch-cat-vct",
    textColorVar: "--color-merch-on-dark",
    // No slideId — routes to /merch/collection/vct
  },
  {
    slug: "valorant",
    label: "VALORANT",
    logo: <ValorantLogo />,
    colorVar: "--color-merch-cat-valorant",
    textColorVar: "--color-merch-on-dark",
    // No slideId — routes to /merch/collection/valorant
  },
  {
    slug: "2xko",
    label: "2XKO",
    logo: <TwoXkoLogo />,
    colorVar: "--color-merch-cat-2xko",
    textColorVar: "--color-merch-ink",
    // No slideId — routes to /merch/collection/2xko
  },
  {
    slug: "arcane",
    label: "Arcane",
    logo: <ArcaneLogo />,
    colorVar: "--color-merch-cat-arcane",
    textColorVar: "--color-merch-ink",
    // No slideId — routes to /merch/collection/arcane
  },
];

// ---------------------------------------------------------------------------
// Latest Collaborations
// ---------------------------------------------------------------------------

const LATEST_COLLABS: MerchCollabEntry[] = [
  {
    slug: "hp-omen",
    partnerName: "HP OMEN",
    headline: "GAME ON",
    copy: "HP OMEN x Riot Games. Built for champions — performance laptops and peripherals for the Rift and beyond.",
    imageUrl: championSplashUrl("Vi", 0),
    ctaLabel: "Shop HP OMEN",
  },
  {
    slug: "secretlab",
    partnerName: "Secretlab",
    headline: "PLAY IN COMFORT",
    copy: "Secretlab x Riot Games. Engineered for the long session — the official gaming chair of Riot esports.",
    imageUrl: championSplashUrl("Jinx", 0),
    ctaLabel: "Shop Secretlab",
  },
];

// ---------------------------------------------------------------------------
// Franchise feature card component (page-local, not exported)
// ---------------------------------------------------------------------------

/**
 * FranchiseFeatureCard — full-width 1278×748 campaign card opening each brand
 * section. Matches the real merch homepage feature card design: full-bleed image
 * with a dark gradient scrim, franchise label, campaign headline, and CTA.
 */
function FranchiseFeatureCard({
  card,
  onCtaClick,
}: {
  card: MerchFranchiseFeatureCard;
  onCtaClick?: () => void;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        // Real: 1278×748 → aspect ratio ~17:10; we pin height at desktop to match.
        aspectRatio: "1278 / 748",
        maxHeight: 748,
        overflow: "hidden",
        backgroundColor: "var(--color-merch-ink-dark)",
      }}
    >
      {/* Feature image */}
      <img
        src={card.imageUrl}
        alt={`${card.franchiseLabel} — ${card.headline}`}
        draggable={false}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Scrim — dark gradient from bottom-left so text reads clearly */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--color-merch-ink-dark) 72%, transparent) 0%, color-mix(in srgb, var(--color-merch-ink-dark) 35%, transparent) 55%, color-mix(in srgb, var(--color-merch-ink-dark) 8%, transparent) 100%)",
        }}
      />

      {/* Content overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "40px 48px",
          gap: 16,
          fontFamily: "var(--font-merch)",
        }}
      >
        {/* Franchise label — small uppercase muted */}
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-merch-muted-on-dark)",
            fontFamily: "var(--font-merch-display)",
          }}
        >
          {card.franchiseLabel}
        </span>

        {/* Headline */}
        <h2
          style={{
            margin: 0,
            fontFamily: "var(--font-merch-display)",
            fontSize: "clamp(32px, 4vw, 56px)",
            fontWeight: 700,
            lineHeight: 1.1,
            color: "var(--color-merch-on-dark)",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {card.headline}
        </h2>

        {/* Subcopy */}
        {card.subcopy && (
          <p
            style={{
              margin: 0,
              fontSize: 16,
              lineHeight: 1.6,
              color: "var(--color-merch-body-on-dark)",
              maxWidth: 420,
            }}
          >
            {card.subcopy}
          </p>
        )}

        {/* CTA */}
        {card.ctaLabel && (
          <button
            type="button"
            onClick={onCtaClick}
            style={{
              alignSelf: "flex-start",
              padding: "13px 32px",
              backgroundColor: "var(--color-merch-red)",
              color: "var(--color-merch-on-dark)",
              fontFamily: "var(--font-merch-display)",
              fontSize: 16,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              border: "none",
              cursor: "pointer",
              transition: "background-color 150ms",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "var(--color-merch-red-dark)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "var(--color-merch-red)";
            }}
          >
            {card.ctaLabel}
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Announcement
// ---------------------------------------------------------------------------

const ANNOUNCEMENT =
  "We're upgrading our warehouse! Orders placed between July 3–7 may be delayed. We apologize for the inconvenience.";

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

/** /merch interactive page shell — client component hosting all callbacks. */
export function MerchPageClient() {
  const router = useRouter();
  const handleNavSelect = useMerchNav();
  const [announcement, setAnnouncement] = useState<string | undefined>(ANNOUNCEMENT);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems] = useState<MerchCartItem[]>([]);
  const [showAllGroups, setShowAllGroups] = useState(false);

  function handleContactSubmit(values: MerchContactFormValues) {
    // Presentational stub — a real implementation would POST to a support API.
    console.log("[MerchFooter] Contact form submitted:", values);
  }

  // Build franchise groups from main (non-sale) products
  const franchiseGroups = groupProductsByFranchise(MAIN_PRODUCTS);
  const groupEntries = Array.from(franchiseGroups.entries());
  const visibleGroups = showAllGroups
    ? groupEntries
    : groupEntries.slice(0, INITIAL_GROUP_LIMIT);
  const hasMoreGroups = groupEntries.length > INITIAL_GROUP_LIMIT && !showAllGroups;

  // Build a lookup from franchiseSlug → feature card
  const featureCardByFranchise = new Map<string, MerchFranchiseFeatureCard>(
    MERCH_FRANCHISE_FEATURE_CARDS.map((c) => [c.franchiseSlug, c]),
  );

  // Slug map: franchiseLabel → route slug
  const labelToSlug: Record<string, string> = {
    "League of Legends": "league-of-legends",
    "LoL Esports": "lol-esports",
    "Teamfight Tactics": "tft",
    "VALORANT": "valorant",
    "Riftbound": "riftbound",
    "Arcane": "arcane",
  };

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        backgroundColor: "var(--color-merch-bg)",
        fontFamily: "var(--font-merch)",
      }}
    >
      {/* Header */}
      <MerchHeader
        activeCategory="shop-all"
        cartCount={cartItems.length}
        announcement={announcement}
        onDismissAnnouncement={() => setAnnouncement(undefined)}
        onCategoryClick={handleNavSelect}
        onSearchClick={() => router.push("/merch/search")}
        onCartClick={() => setCartOpen(true)}
      />

      {/* Main content */}
      <main className="flex-1">
        {/* Hero banner — franchise control bar is NOW INSIDE the hero (1:1 real site).
            The standalone MerchCategoryStrip is no longer rendered on this page.
            Tiles with slideId switch the hero slide; others route to their collection. */}
        <MerchHeroBanner
          slides={HERO_SLIDES}
          autoPlayMs={5000}
          franchises={FRANCHISE_TILES}
          onSelectFranchise={(slug) => router.push(`/merch/collection/${slug}`)}
        />

        {/* Franchise product sections — feature card + 4-up product grid per brand */}
        {visibleGroups.map(([label, products]) => {
          const slug = labelToSlug[label] ?? label.toLowerCase().replace(/\s+/g, "-");
          const featureCard = featureCardByFranchise.get(slug);
          return (
            <section key={label} aria-label={label}>
              {/* Full-width franchise feature card (1278×748) */}
              {featureCard && (
                <FranchiseFeatureCard
                  card={featureCard}
                  onCtaClick={() => router.push(`/merch/collection/${slug}`)}
                />
              )}

              {/* 4-up product grid with brand rail */}
              <MerchProductGrid
                brandRail={label.toUpperCase()}
                filterBadges={[
                  { label: "New", active: true },
                  { label: "Limited Edition" },
                  { label: "Preorder" },
                ]}
                columns={4}
                onShopAll={() => router.push(`/merch/collection/${slug}`)}
              >
                {products.map((product) => (
                  <MerchProductCard
                    key={product.slug}
                    slug={product.slug}
                    title={product.title}
                    imageUrl={product.imageUrl}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    badge={product.badge}
                    badges={product.badges}
                    franchiseLabel={product.franchiseLabel}
                    onClick={() => router.push(`/merch/product/${product.slug}`)}
                  />
                ))}
              </MerchProductGrid>
            </section>
          );
        })}

        {/* Sale section — always at the end */}
        {SALE_PRODUCTS.length > 0 && (
          <section aria-label="Sale">
            <MerchProductGrid
              brandRail="SALE"
              filterBadges={[{ label: "Sale", active: true }]}
              columns={4}
              onShopAll={() => router.push("/merch/collection/sale")}
            >
              {SALE_PRODUCTS.map((product) => (
                <MerchProductCard
                  key={product.slug}
                  slug={product.slug}
                  title={product.title}
                  imageUrl={product.imageUrl}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  badge={product.badge}
                  badges={product.badges}
                  franchiseLabel={product.franchiseLabel}
                  onClick={() => router.push(`/merch/product/${product.slug}`)}
                />
              ))}
            </MerchProductGrid>
          </section>
        )}

        {/* LOAD MORE button — red riotSans CTA, centered, 239×50, matches real site */}
        {hasMoreGroups && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "32px 24px 48px",
            }}
          >
            <button
              type="button"
              onClick={() => setShowAllGroups(true)}
              style={{
                width: 239,
                height: 50,
                backgroundColor: "var(--color-merch-red)",
                color: "var(--color-merch-on-dark)",
                fontFamily: "var(--font-merch-display)",
                fontSize: 16,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                border: "none",
                cursor: "pointer",
                transition: "background-color 150ms",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "var(--color-merch-red-dark)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "var(--color-merch-red)";
              }}
            >
              LOAD MORE
            </button>
          </div>
        )}

        {/* LATEST COLLABORATIONS — ~506px section, after products, before gift band */}
        <MerchCollabCarousel
          collabs={LATEST_COLLABS.map((c) => ({
            ...c,
            onCtaClick: () => router.push(`/merch/collection/${c.slug}`),
          }))}
        />
      </main>

      {/* Gift card promo band — above footer, ~447px */}
      <MerchGiftCardBand
        cards={GIFT_CARDS}
        onCtaClick={() => router.push("/merch/shop-all")}
      />

      {/* Footer */}
      <MerchFooter
        copyrightText="Copyright Riot Games 2025"
        onContactSubmit={handleContactSubmit}
      />

      <MerchCartDrawer
        open={cartOpen}
        items={cartItems}
        subtotal="$0.00"
        onClose={() => setCartOpen(false)}
        onContinueShopping={() => setCartOpen(false)}
        onCheckout={() => router.push("/merch/cart")}
      />
    </div>
  );
}
