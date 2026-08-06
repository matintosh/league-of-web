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
 * Homepage feed (matching real merch.riotgames.com ~9286px at 1280px):
 *   - Hero banner + franchise strip
 *   - Full franchise groups, each starting with a full-width featured first card
 *     (featuredFirst=true on MerchProductGrid), then regular 2-col tiles at 225px
 *     image height (375px row rhythm = 57px header + 225px image + ~93px info strip)
 *   - Groups in order: LoL, MSI/LoL Esports, TFT, VCT, Riftbound, VALORANT, 2XKO
 *   - LOAD MORE button — gold (#C4993B) at ALL viewports; centered 239×50 at 1280,
 *     full-bleed 390×50 at 390; black text + 1px white offset frame
 *   - Gift card promo band
 *   - LATEST COLLABORATIONS section (MerchCollabCarousel — HP/OMEN + Secretlab)
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
import type { MerchCartItem } from "@low/fixtures";
import type { MerchHeroSlide } from "@low/ui";
import { useRouter } from "next/navigation";
import { useMerchNav } from "@/lib/merch-nav";

// ---------------------------------------------------------------------------
// Franchise groups — products organised by brand for the homepage feed.
// Real homepage order: LoL → MSI/LoL Esports → TFT → VCT → Riftbound → VALORANT → 2XKO.
// Each group opens with a full-width featured card then regular 2-col cards.
// ---------------------------------------------------------------------------

/** Image height (px) for regular homepage cards — drives 375px row rhythm.
 *  Real: 57px header + 225px image + ~93px info strip ≈ 375px per row. */
const HP_IMAGE_HEIGHT = 225;

/** Ordered franchise group keys for the homepage feed. */
const FRANCHISE_ORDER = [
  "League of Legends",
  "LoL Esports",
  "Teamfight Tactics",
  "VCT",
  "Riftbound",
  "VALORANT",
  "2XKO",
];

/** Group all products by franchiseLabel, preserving fixture order within each group. */
function groupProductsByFranchise(
  products: typeof MERCH_PRODUCTS,
): { label: string; products: typeof MERCH_PRODUCTS }[] {
  const map = new Map<string, typeof MERCH_PRODUCTS>();
  for (const p of products) {
    const key = p.franchiseLabel ?? "Other";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(p);
  }
  // Return in the defined franchise order, then any remaining groups
  const result: { label: string; products: typeof MERCH_PRODUCTS }[] = [];
  for (const label of FRANCHISE_ORDER) {
    const group = map.get(label);
    if (group && group.length > 0) {
      result.push({ label, products: group });
      map.delete(label);
    }
  }
  // Remaining groups not in FRANCHISE_ORDER (e.g. Sale, Arcane)
  for (const [label, products] of map.entries()) {
    if (products.length > 0) result.push({ label, products });
  }
  return result;
}

/** All products excluding sale items — sale items appear in their own trailing block. */
const ALL_PRODUCTS = MERCH_PRODUCTS;

/** Initial number of franchise groups visible before Load More. */
const INITIAL_GROUP_COUNT = 4;

// ---------------------------------------------------------------------------
// Hero slides
// ---------------------------------------------------------------------------

// Real hero banners — full-art campaign banners sourced from cdn.sanity.io (hotlinkable).
// Slide A: League of Legends Classic campaign (consumer_products_live, 3296x1030).
//   → This is the FIRST slide matching the real site's initial active hero.
// Slide B: Riftbound Vendetta (consumer_products_live, 3296x1030).
//
// mobileImageUrl: same Sanity asset at w=390 gives the campaign art mobile crop
// (purple checkered set + PC box, 390×316) — matching the real site which shows
// the SAME campaign art on mobile (not a different champion splash).
const HERO_SLIDES: MerchHeroSlide[] = [
  {
    id: "slide-classic",
    imageUrl: merchAssetUrl("3dbbf5ce0d30940b0db3741cdb9d1bed12afce48-3296x1030.png", {
      w: 1920,
      dataset: "consumer_products_live",
    }),
    mobileImageUrl: merchAssetUrl("3dbbf5ce0d30940b0db3741cdb9d1bed12afce48-3296x1030.png", {
      w: 390,
      dataset: "consumer_products_live",
    }),
    imageAlt: "League of Legends Classic — Shop the Collection",
    ctaLabel: "Shop Now",
    ctaVariant: "red",
    ctaCorner: "bottom-right",
    align: "left",
  },
  {
    id: "slide-vendetta",
    imageUrl: merchAssetUrl("a01262bae9dcf03621b7f850c89b86535b76638a-3296x1030.jpg", {
      w: 1920,
      dataset: "consumer_products_live",
    }),
    mobileImageUrl: merchAssetUrl("a01262bae9dcf03621b7f850c89b86535b76638a-3296x1030.jpg", {
      w: 390,
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
    headline: "HyperX OMEN 16 VALORANT Edition",
    copy: "A unique VALORANT design built with every competitive advantage. Performance laptops and peripherals built for the competitive edge.",
    imageUrl: championSplashUrl("Vi", 0),
  },
  {
    slug: "secretlab",
    partnerName: "Secretlab",
    headline: "Secretlab TITAN Evo",
    copy: "Engineered for the long session — the official gaming chair of Riot esports.",
    imageUrl: championSplashUrl("Jinx", 0),
  },
];

// ---------------------------------------------------------------------------
// Announcement
// ---------------------------------------------------------------------------

const ANNOUNCEMENT =
  "We're upgrading our warehouse! Orders (Riftbound excluded) may experience shipping delays, but we expect to resume normal operations before…";

// ---------------------------------------------------------------------------
// Footer artwork — faint character-art background wash (real site has this)
// ---------------------------------------------------------------------------

const FOOTER_ARTWORK_SRC = championSplashUrl("Jinx", 0);

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
  const [visibleGroupCount, setVisibleGroupCount] = useState(INITIAL_GROUP_COUNT);

  function handleContactSubmit(values: MerchContactFormValues) {
    // Presentational stub — a real implementation would POST to a support API.
    console.log("[MerchFooter] Contact form submitted:", values);
  }

  const allGroups = groupProductsByFranchise(ALL_PRODUCTS);
  const visibleGroups = allGroups.slice(0, visibleGroupCount);
  const hasMore = visibleGroupCount < allGroups.length;

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
        {/* Hero banner — franchise control bar is INSIDE the hero (1:1 real site).
            Tiles with slideId switch the hero slide; others route to their collection. */}
        <MerchHeroBanner
          slides={HERO_SLIDES}
          autoPlayMs={5000}
          franchises={FRANCHISE_TILES}
          onSelectFranchise={(slug) => router.push(`/merch/collection/${slug}`)}
        />

        {/* ── Franchise group sections ───────────────────────────────────────
            Real homepage: each brand opens with a full-width featured card
            (featuredFirst=true) then standard 2-col tiles at HP_IMAGE_HEIGHT (225px).
            Row rhythm: 57px header + 225px image + ~93px info strip ≈ 375px.
            Groups are shown in FRANCHISE_ORDER; Load More reveals additional groups. */}
        {visibleGroups.map(({ label, products }) => {
          // Look up a feature card for this franchise group (LoL and Riftbound have real assets)
          const featureCard = MERCH_FRANCHISE_FEATURE_CARDS.find(
            (fc) => fc.franchiseLabel === label,
          );

          // Guard: groups always have at least one product (ensured by groupProductsByFranchise)
          const firstProduct = products[0];
          if (!firstProduct) return null;
          const collectionSlug = label.toLowerCase().replace(/\s+/g, "-");

          return (
            <MerchProductGrid
              key={label}
              columns={2}
              featuredFirst={true}
            >
              {/* Featured first card — full-width, 600px image, object-contain.
                  Uses the franchise feature card asset if available; otherwise the
                  first product image serves as the featured card artwork. */}
              <MerchProductCard
                key={`${label}-featured`}
                slug={featureCard ? `collection-${collectionSlug}` : firstProduct.slug}
                title={featureCard ? featureCard.headline : firstProduct.title}
                imageUrl={featureCard ? featureCard.imageUrl : firstProduct.imageUrl}
                price={featureCard ? "" : firstProduct.price}
                badges={featureCard ? [] : (firstProduct.badges ?? [])}
                franchiseLabel={label}
                imageFit="contain"
                imageHeight={600}
                hasAddToCart={!featureCard}
                onClick={() => router.push(`/merch/collection/${collectionSlug}`)}
              />

              {/* Regular grid cards — 225px image height for 375px row rhythm */}
              {(featureCard ? products : products.slice(1)).map((product) => (
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
                  imageFit="contain"
                  imageHeight={HP_IMAGE_HEIGHT}
                  onClick={() => router.push(`/merch/product/${product.slug}`)}
                />
              ))}
            </MerchProductGrid>
          );
        })}

        {/* ── Load More — gold at ALL viewports (measured from real merch.riotgames.com).
            Centered 239×50 at 1280; full-bleed 390×50 at 390. Gold (#C4993B) bg,
            black riotSans 16/600 text, 1px white offset outline frame.
            data-hp-load-more: picked up by merch-layout.css for responsive sizing. */}
        {hasMore && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "32px 0 40px",
            }}
          >
            <button
              type="button"
              data-hp-load-more
              onClick={() => setVisibleGroupCount((n) => n + INITIAL_GROUP_COUNT)}
              style={{
                height: 50,
                fontSize: 16,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.32px",
                border: "none",
                cursor: "pointer",
                transition: "opacity 150ms",
                fontFamily: "var(--font-merch-display)",
              }}
            >
              Load more
            </button>
          </div>
        )}

        {/* ── Gift card promo band — BEFORE collabs (real section order) ── */}
        <MerchGiftCardBand
          cards={GIFT_CARDS}
          onCtaClick={() => router.push("/merch/shop-all")}
        />

        {/* ── Latest Collaborations — after gift band, before footer ──── */}
        <MerchCollabCarousel
          collabs={LATEST_COLLABS.map((c) => ({
            ...c,
            onCtaClick: () => router.push(`/merch/collection/${c.slug}`),
          }))}
        />
      </main>

      {/* Footer — artworkSrc supplies the faint character-art background wash */}
      <MerchFooter
        copyrightText="Copyright Riot Games 2025"
        artworkSrc={FOOTER_ARTWORK_SRC}
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
