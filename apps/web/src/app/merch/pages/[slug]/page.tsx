import { notFound } from "next/navigation";
import { MERCH_INFO_PAGES } from "@low/fixtures";
import { MerchHeader, MerchInfoPage, MerchFooter } from "@low/ui";

/**
 * /merch/pages/[slug] — info-page template route.
 *
 * Renders: MerchHeader (no active category) → MerchInfoPage → MerchFooter.
 * Content is driven by MERCH_INFO_PAGES fixture map keyed by slug.
 * Unknown slugs → notFound() (404).
 * generateStaticParams pre-renders all 9 known slugs at build time.
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

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: "var(--color-merch-bg)", fontFamily: "var(--font-merch)" }}
    >
      <MerchHeader />
      <MerchInfoPage title={content.title} blocks={content.blocks} />
      <MerchFooter />
    </div>
  );
}
