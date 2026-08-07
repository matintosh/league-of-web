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
 * Homepage feed (matching real merch.riotgames.com ~9286px docHeight at 1280px):
 *   - Hero banner + franchise strip
 *   - ONE full-width feature card (1280×750) — the very first product in the feed
 *     (League Classic Collector's Box, $89.99). Title + price span w=1178.
 *   - Remaining products in uniform 2-col grid, grouped by franchise.
 *   - Groups in order: LoL, MSI/LoL Esports, TFT, VCT Masters London, VALORANT,
 *     Riftbound, 2XKO — NO section heading text (real site has none).
 *   - NO sale/struck prices in the homepage feed (sale items only on /merch/sale).
 *   - LOAD MORE button — gold (#C4993B) at ALL viewports; centered 239×50 at 1280,
 *     full-bleed 390×50 at 390; black text + 1px white offset frame.
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
  MERCH_PRODUCTS,
  merchAssetUrl,
} from "@low/fixtures";
import type { MerchCartItem } from "@low/fixtures";
import type { MerchHeroSlide } from "@low/ui";
import { useRouter } from "next/navigation";
import { useMerchNav } from "@/lib/merch-nav";

// ---------------------------------------------------------------------------
// Franchise groups — products organised by brand for the homepage feed.
// Real homepage order: LoL → MSI/LoL Esports → TFT → VCT → VALORANT → Riftbound → 2XKO.
// ONE full-width feature card (Collector's Box) opens the feed; all others in 2-col grid.
// ---------------------------------------------------------------------------

/** Image height (px) for regular homepage cards — drives 375px row rhythm.
 *  Real: 57px header + 225px image + ~93px info strip ≈ 375px per row. */
const HP_IMAGE_HEIGHT = 225;

/**
 * Ordered franchise group keys for the homepage feed.
 * Real section order (measured merch.riotgames.com 2026-08):
 * League → MSI/LoL Esports → TFT → VCT Masters London → VALORANT → Riftbound → 2XKO.
 */
const FRANCHISE_ORDER = [
  "League of Legends",
  "LoL Esports",
  "Teamfight Tactics",
  "VCT",
  "VALORANT",
  "Riftbound",
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

/**
 * Homepage feed products — excludes sale items and apparel-only extras.
 * Real homepage shows no struck/sale prices; sale items live on /merch/sale.
 * Apparel-slug extras are collection-page filler, not homepage items.
 */
const HOME_PRODUCTS = MERCH_PRODUCTS.filter(
  (p) => p.badge !== "Sale" && !p.slug.startsWith("apparel-"),
);

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
    // Real gift card packshots sourced from merch.riotgames.com Sanity CDN.
    imageUrl: merchAssetUrl("ed593ec11a590c788d3ec1b634ce0b72a63b1059-2560x2560.png", { w: 800 }),
    label: "Riot merch gift card — OMEN 16 Edition",
  },
  {
    imageUrl: merchAssetUrl("2482e51bfb07ecd0cc0ed90998bce58bfe1f6699-2560x2560.png", { w: 800 }),
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
    // Reuses a VALORANT-branded Sanity asset as lifestyle shot placeholder.
    imageUrl: merchAssetUrl("5c091e4fdde681d4149ae8c426f1a1851f446f9e-2560x2560.png", { w: 800 }),
  },
  {
    slug: "secretlab",
    partnerName: "Secretlab",
    headline: "Secretlab TITAN Evo",
    copy: "Engineered for the long session — the official gaming chair of Riot esports.",
    // Reuses an LoL Classic Sanity asset as lifestyle shot placeholder.
    imageUrl: merchAssetUrl("a87ba685e599a287b6f56c32fb629d0d8515c828-2560x2560.png", { w: 800 }),
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

// Footer faint character-art wash — reuses an existing Sanity asset.
const FOOTER_ARTWORK_SRC = merchAssetUrl("74c1cee04be48521280fd81d65a7ded689500c53-2560x2560.png", {
  w: 1920,
});

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

  const allGroups = groupProductsByFranchise(HOME_PRODUCTS);
  const visibleGroups = allGroups.slice(0, visibleGroupCount);
  const hasMore = visibleGroupCount < allGroups.length;

  // The very first product in the very first group is the ONE full-width feature
  // card (1280×750, title + price span w=1178). All others go in the 2-col grid.
  const firstGroup = allGroups[0];
  const featuredProduct = firstGroup?.products[0];

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

        {/* ── ONE full-width feature card (1280×750) ─────────────────────────
            Real homepage: the very first item in the feed is the Collector's Box,
            rendered full-width at 1280×750 with title + price ($89.99) underneath.
            No invented section heading. No per-franchise feature cards. */}
        {featuredProduct && (
          <MerchProductGrid columns={2} featuredFirst={true}>
            <MerchProductCard
              key={featuredProduct.slug}
              slug={featuredProduct.slug}
              title={featuredProduct.title}
              imageUrl={featuredProduct.imageUrl}
              price={featuredProduct.price}
              badges={featuredProduct.badges ?? []}
              franchiseLabel={featuredProduct.franchiseLabel}
              imageFit="contain"
              imageHeight={750}
              hasAddToCart={true}
              onClick={() => router.push(`/merch/product/${featuredProduct.slug}`)}
            />
          </MerchProductGrid>
        )}

        {/* ── Franchise group sections — uniform 2-col grid ──────────────────
            All products (including remaining LoL items after the feature card)
            appear in a single continuous 2-col grid with no section headings.
            Row rhythm: 57px header + 225px image + ~93px info strip ≈ 375px.
            Groups are shown in FRANCHISE_ORDER; Load More reveals more groups.
            NO sale/struck prices: sale items are filtered from HOME_PRODUCTS. */}
        <MerchProductGrid columns={2} featuredFirst={false}>
          {visibleGroups.flatMap(({ label, products }) => {
            // The featured product (first item of first group) is already rendered above.
            const isFirstGroup = label === (firstGroup?.label ?? "");
            const gridProducts = isFirstGroup ? products.slice(1) : products;
            return gridProducts.map((product) => (
              <MerchProductCard
                key={product.slug}
                slug={product.slug}
                title={product.title}
                imageUrl={product.imageUrl}
                price={product.price}
                badge={product.badge}
                badges={product.badges}
                franchiseLabel={product.franchiseLabel}
                imageFit="contain"
                imageHeight={HP_IMAGE_HEIGHT}
                onClick={() => router.push(`/merch/product/${product.slug}`)}
              />
            ));
          })}
        </MerchProductGrid>

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
                /* Base geometry only — bg/color/outline handled by [data-hp-load-more]
                   in merch-layout.css to keep the gold-CTA rule in one place. */
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
