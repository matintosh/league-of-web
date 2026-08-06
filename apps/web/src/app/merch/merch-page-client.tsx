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
 *   - ONE continuous 2-column add-to-cart product grid (no section headings,
 *     no per-franchise rails, no feature cards, no SALE section)
 *   - LOAD MORE button (gold full-bleed at 390; centered red at desktop)
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
  merchAssetUrl,
} from "@low/fixtures";
import type { MerchCartItem } from "@low/fixtures";
import type { MerchHeroSlide } from "@low/ui";
import { useRouter } from "next/navigation";
import { useMerchNav } from "@/lib/merch-nav";

// ---------------------------------------------------------------------------
// Product list — all products shown in one continuous grid (no Sale split)
// ---------------------------------------------------------------------------

/** All products in the order the fixtures define them. */
const ALL_PRODUCTS = MERCH_PRODUCTS;

/** Initial count of products to show before Load More. */
const INITIAL_PRODUCT_COUNT = 16;

// ---------------------------------------------------------------------------
// Hero slides
// ---------------------------------------------------------------------------

// Real hero banners — full-art campaign banners sourced from cdn.sanity.io (hotlinkable).
// Slide A: League of Legends Classic campaign (consumer_products_live, 3296x1030).
//   → This is the FIRST slide matching the real site's initial active hero.
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
  const [visibleCount, setVisibleCount] = useState(INITIAL_PRODUCT_COUNT);

  function handleContactSubmit(values: MerchContactFormValues) {
    // Presentational stub — a real implementation would POST to a support API.
    console.log("[MerchFooter] Contact form submitted:", values);
  }

  const visibleProducts = ALL_PRODUCTS.slice(0, visibleCount);
  const hasMore = visibleCount < ALL_PRODUCTS.length;

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

        {/* ── Continuous 2-column product grid ──────────────────────────────
            Real homepage below the hero: ONE flush 2-col grid, NO per-franchise
            rails, NO feature-card headlines, NO section headings, NO SALE section.
            Products in the order the fixture defines them (sale items included
            in the same stream, not a separate block). */}
        <MerchProductGrid columns={2}>
          {visibleProducts.map((product) => (
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

        {/* ── Load More — homepage variant ──────────────────────────────────
            Real merch homepage (1280px): red, centered, 239×50.
            Real merch homepage (390px): full-bleed 390×50, gold (#C49933) bg,
              black text, thin white outline.
            The text is 'Load more' CSS-uppercased (not hard-coded 'LOAD MORE'). */}
        {hasMore && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            {/*
              data-hp-load-more: picked up by merch-layout.css for responsive colors:
              - mobile: full-bleed gold (#C49933) bg, black text, 1px white outline
              - desktop (≥768): centered 239×50 red, white text, no outline
            */}
            <button
              type="button"
              data-hp-load-more
              onClick={() => setVisibleCount((n) => n + INITIAL_PRODUCT_COUNT)}
              style={{
                height: 50,
                fontSize: 16,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.32px",
                border: "none",
                cursor: "pointer",
                transition: "background-color 150ms",
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
