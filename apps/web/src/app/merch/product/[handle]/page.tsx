/**
 * /merch/product/[handle] — canonical PDP route.
 * Wires MerchProductGallery (left column) + MerchPurchasePanel (right column)
 * with static fixture data. The merch layout.tsx already imports merch.css.
 *
 * This is the new canonical path (1:1 with merch.riotgames.com/en-us/product/<handle>).
 * The old /merch/[handle] route issues a 308 permanentRedirect here.
 *
 * For interactive demos (variant switching, qty stepper) see the /showcase entries.
 */
import { championSplashUrl } from "@low/fixtures";
import { MerchProductGallery, MerchPurchasePanel } from "@low/ui";

/** Static fixture product for PDP demo. */
const DEMO_PRODUCT = {
  title: "MSI 2026 Tee",
  price: "$39.99",
  originalPrice: undefined as string | undefined,
  badges: ["New"] as string[],
  description:
    "Celebrate Midseason Showdown with this officially licensed apparel. 100% cotton preshrunk jersey tee. Machine washable. Unisex sizing.",
  breadcrumb: ["Home", "Apparel", "MSI 2026 Tee"],
  variants: [
    { label: "XS", available: true },
    { label: "S", available: true },
    { label: "M", available: true },
    { label: "L", available: false },
    { label: "XL", available: true },
    { label: "XXL", available: false },
  ],
  images: [
    championSplashUrl("Jinx", 0),
    championSplashUrl("Lux", 0),
    championSplashUrl("Vi", 0),
    championSplashUrl("Ahri", 0),
  ],
};

interface Props {
  params: Promise<{ handle: string }>;
}

export default async function MerchProductPage({ params }: Props) {
  // `handle` is available for future dynamic fixture resolution.
  const { handle: _handle } = await params;

  return (
    <main
      style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: "40px 32px",
        fontFamily: "var(--font-merch)",
        backgroundColor: "var(--color-merch-bg)",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 48,
          alignItems: "flex-start",
        }}
      >
        {/* Left: gallery — ~560px */}
        <div style={{ flex: "0 0 560px", maxWidth: 560 }}>
          <MerchProductGallery
            images={DEMO_PRODUCT.images}
            alt={DEMO_PRODUCT.title}
            selectedIndex={0}
          />
        </div>

        {/* Right: purchase panel — flex-1 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <MerchPurchasePanel
            title={DEMO_PRODUCT.title}
            price={DEMO_PRODUCT.price}
            originalPrice={DEMO_PRODUCT.originalPrice}
            badges={DEMO_PRODUCT.badges}
            description={DEMO_PRODUCT.description}
            breadcrumb={DEMO_PRODUCT.breadcrumb}
            variants={DEMO_PRODUCT.variants}
            variantLabel="Size"
            selectedVariant="M"
            quantity={1}
          />
        </div>
      </div>

      <p
        style={{
          marginTop: 32,
          fontSize: 12,
          color: "var(--color-merch-muted)",
        }}
      >
        Demo route — static props. For interactive variant/qty/cart demo see{" "}
        <a
          href="/showcase/merch-purchase-panel"
          style={{ color: "var(--color-merch-red)" }}
        >
          /showcase/merch-purchase-panel
        </a>
        .
      </p>
    </main>
  );
}
