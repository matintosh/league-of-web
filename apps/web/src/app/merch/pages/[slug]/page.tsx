import { notFound } from "next/navigation";
import { MERCH_INFO_PAGES, MERCH_SUPPORT_TABS } from "@low/fixtures";
import { MerchInfoPage, MerchFooter, MerchSupportHero, MerchSupportForm } from "@low/ui";
import { championSplashUrl } from "@low/fixtures";
import { InfoPageHeader, InfoPageTabStrip, SupportFormClient } from "./info-page-client";

/**
 * /merch/pages/[slug] — support info-page template route.
 *
 * Renders: MerchHeader → MerchSupportHero → MerchSupportTabStrip (active=slug)
 *          → MerchSupportForm (3 form slugs) OR MerchInfoPage (prose slugs)
 *          → MerchFooter.
 *
 * Form slugs (formConfig present): order-status, gift-card-balance, verify-your-product.
 * Prose slugs (no formConfig): all others — faqs, shipping, returns, etc.
 *
 * Content is driven by MERCH_INFO_PAGES fixture map keyed by slug.
 * Unknown slugs → notFound() (404).
 * generateStaticParams pre-renders all known slugs at build time.
 *
 * NOTE — mascot asset: the real Riot panda mascot is on their CDN with no
 * stable public URL. We supply a champion splash as a visual stand-in.
 */

// ---------------------------------------------------------------------------
// Static generation
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return Object.keys(MERCH_INFO_PAGES).map((slug) => ({ slug }));
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function MerchInfoPageRoute({ params }: Props) {
  const { slug } = await params;
  const content = MERCH_INFO_PAGES[slug];

  if (!content) {
    notFound();
  }

  /* Champion splash used as mascot stand-in — Riot CDN panda has no stable URL. */
  const mascotSrc = championSplashUrl("Lulu", 0);

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: "var(--color-merch-bg)", fontFamily: "var(--font-merch)" }}
    >
      {/* Dark store header */}
      <InfoPageHeader />

      {/* Shared SUPPORT hero band */}
      <MerchSupportHero
        mascotSrc={mascotSrc}
        mascotAlt="Support mascot illustration stand-in"
      />

      {/* Section-tab pill strip — active pill = current slug */}
      <InfoPageTabStrip sections={MERCH_SUPPORT_TABS} activeSlug={slug} />

      {/* Form slugs → MerchSupportForm; prose slugs → MerchInfoPage */}
      {content.formConfig ? (
        <SupportFormClient title={content.title} config={content.formConfig} />
      ) : (
        <MerchInfoPage title={content.title} blocks={content.blocks} />
      )}

      <MerchFooter />
    </div>
  );
}
