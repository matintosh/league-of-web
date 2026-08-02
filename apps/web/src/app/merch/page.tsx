import { MerchHeader, MerchProductCard, MerchFooter } from "@low/ui";
import type { MerchProduct } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Fixture products — supplied by the page (no fetching in @low/ui)
// ---------------------------------------------------------------------------

const PRODUCTS: MerchProduct[] = [
  {
    slug: "riftbound-origins-champion-deck-jinx",
    title: "Riftbound Origins Champion Deck - Jinx",
    imageUrl: "https://ddragonmedia.riotgames.com/cdn/img/champion/splash/Jinx_0.jpg",
    price: "$24.99",
    badge: "New",
  },
  {
    slug: "arcane-vi-hoodie",
    title: "Arcane Vi Graphic Hoodie",
    imageUrl: "https://ddragonmedia.riotgames.com/cdn/img/champion/splash/Vi_0.jpg",
    price: "$39.99",
    originalPrice: "$59.99",
    badge: "Sale",
  },
  {
    slug: "project-lux-art-print",
    title: "PROJECT: Lux Collector's Art Print (18×24)",
    imageUrl: "https://ddragonmedia.riotgames.com/cdn/img/champion/splash/Lux_0.jpg",
    price: "$34.99",
  },
  {
    slug: "poro-plush-limited",
    title: "Poro Limited Edition Plush — Season 14",
    imageUrl: "https://ddragonmedia.riotgames.com/cdn/img/champion/splash/Jinx_2.jpg",
    price: "$29.99",
    badge: "Out of Stock",
  },
  {
    slug: "arcane-jinx-enamel-pin",
    title: "Arcane Jinx & Vi Enamel Pin Set",
    imageUrl: "https://ddragonmedia.riotgames.com/cdn/img/champion/splash/Jinx_1.jpg",
    price: "$14.99",
    badge: "New",
  },
  {
    slug: "riot-wordmark-tee",
    title: "Riot Games Wordmark Essential T-Shirt",
    imageUrl: "https://ddragonmedia.riotgames.com/cdn/img/champion/splash/Ahri_0.jpg",
    price: "$24.99",
  },
  {
    slug: "valorant-agent-hoodie",
    title: "VALORANT Agent Collection Pullover Hoodie",
    imageUrl: "https://ddragonmedia.riotgames.com/cdn/img/champion/splash/Lux_1.jpg",
    price: "$54.99",
    badge: "Limited",
  },
  {
    slug: "ruination-teemo-plush",
    title: "Ruined Teemo 12\" Collector Plush",
    imageUrl: "https://ddragonmedia.riotgames.com/cdn/img/champion/splash/Teemo_0.jpg",
    price: "$19.99",
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

/**
 * /merch page — Riot merch store with real MerchHeader, MerchProductCard grid,
 * and MerchFooter. Merch tokens (--color-merch-*) are loaded by the /merch layout.
 */
export default function MerchPage() {
  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        backgroundColor: "var(--color-merch-bg, #ffffff)",
        fontFamily: "var(--font-merch, system-ui, sans-serif)",
      }}
    >
      {/* Header */}
      <MerchHeader activeCategory="shop-all" cartCount={0} />

      {/* Main content */}
      <main className="flex-1">
        {/* Hero / intro strip */}
        <section
          className="border-b py-10 text-center"
          style={{
            borderColor: "var(--color-merch-border, #e5e5e5)",
            backgroundColor: "var(--color-merch-surface, #f5f5f5)",
          }}
        >
          <p
            className="text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: "var(--color-merch-red, #d13639)" }}
          >
            Official Riot Games Merchandise
          </p>
          <h1
            className="mt-2 text-3xl font-bold uppercase tracking-widest"
            style={{ color: "var(--color-merch-ink, #1a1a1a)" }}
          >
            Shop All
          </h1>
        </section>

        {/* Product grid */}
        <section className="mx-auto max-w-screen-xl px-6 py-10">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {PRODUCTS.map((product) => (
              <MerchProductCard
                key={product.slug}
                slug={product.slug}
                title={product.title}
                imageUrl={product.imageUrl}
                price={product.price}
                originalPrice={product.originalPrice}
                badge={product.badge}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <MerchFooter copyrightText="Copyright Riot Games 2025" />
    </div>
  );
}
