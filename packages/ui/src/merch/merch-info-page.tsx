/**
 * MerchInfoPage — long-form prose template for /merch/pages/[slug].
 *
 * MERCH COMPONENT — use the merch design system: --color-merch-* tokens.
 * This is NOT the Hextech client.
 * Presentational: props in, no callbacks needed (static content).
 * Types (MerchInfoBlock) are imported from @low/fixtures.
 *
 * Measured from merch.riotgames.com info pages (/en-us/faqs/, /en-us/shipping/):
 *   - Page background: --color-merch-bg (white)
 *   - Content container: max-w-[1000px] centered, left-aligned prose (real content ~936px wide at 1280)
 *   - Section headings (h2): 28px mobile / 38px desktop, font-weight 700, uppercase
 *   - Sub-headings (h3): ~19px (real: 18.72px), font-weight 700, --color-merch-ink
 *   - Body paragraph: 16px, line-height ~1.6, --color-merch-body
 *   - Lists: default browser list style, 16px, --color-merch-body, left-indented ~1.5rem
 *   - Section divider: 1px --color-merch-border between major h2 sections
 *   - Page top padding: ~40–48px (py-10 md:py-12); bottom ~64px (pb-16)
 *   - No breadcrumb on info pages; no standalone h1 (shared hero provides it)
 */

import type { MerchInfoBlock } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MerchInfoPageProps {
  /** Section title rendered as <h2> in the content area (the shared SUPPORT h1 is in MerchSupportHero). */
  title: string;
  /** Ordered list of content blocks — paragraphs, headings, lists. */
  blocks: MerchInfoBlock[];
}

// ---------------------------------------------------------------------------
// Block renderer
// ---------------------------------------------------------------------------

function Block({ block, index }: { block: MerchInfoBlock; index: number }) {
  const { type, content } = block;

  if (type === "heading2") {
    return (
      <>
        {/* Divider before every h2 except the first */}
        {index > 0 && (
          <hr
            className="my-6"
            style={{ borderColor: "var(--color-merch-border)" }}
          />
        )}
        {/* 28px on mobile → 38px on md+; ls -0.02em (real: -0.76px@38px / -0.28px@390; was +0.05em — wrong direction) */}
        <h2
          className="mb-3 mt-6 text-[28px] font-bold uppercase first:mt-0 md:text-[38px]"
          style={{ color: "var(--color-merch-ink)", letterSpacing: "-0.02em" }}
        >
          {content as string}
        </h2>
      </>
    );
  }

  if (type === "heading3") {
    /* real h3: 18.72px / 700 (measured live 2026-08-06) — ours was 15px/600 */
    return (
      <h3
        className="mb-2 mt-4 text-[19px] font-bold"
        style={{ color: "var(--color-merch-ink)" }}
      >
        {content as string}
      </h3>
    );
  }

  if (type === "paragraph") {
    return (
      /* 16px measured from real merch.riotgames.com (was 14px) */
      <p
        className="mb-4 text-[16px] leading-relaxed"
        style={{ color: "var(--color-merch-body)" }}
      >
        {content as string}
      </p>
    );
  }

  if (type === "ul") {
    return (
      <ul
        className="mb-4 list-disc pl-6 text-[16px] leading-relaxed"
        style={{ color: "var(--color-merch-body)" }}
      >
        {(content as string[]).map((item, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={i} className="mb-1">
            {item}
          </li>
        ))}
      </ul>
    );
  }

  if (type === "ol") {
    return (
      <ol
        className="mb-4 list-decimal pl-6 text-[16px] leading-relaxed"
        style={{ color: "var(--color-merch-body)" }}
      >
        {(content as string[]).map((item, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={i} className="mb-1">
            {item}
          </li>
        ))}
      </ol>
    );
  }

  return null;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * MerchInfoPage — renders a section title (h2) + prose block list inside a
 * centered max-w-screen-md container, matching the real store's info-page template.
 * The shared page h1 ("SUPPORT") is rendered by MerchSupportHero, which wraps this.
 * Wrap with MerchHeader + MerchSupportHero + MerchSupportTabStrip + MerchFooter
 * in the page route.
 */
export function MerchInfoPage({ title, blocks }: MerchInfoPageProps) {
  return (
    <main
      className="w-full flex-1"
      style={{ backgroundColor: "var(--color-merch-bg)", fontFamily: "var(--font-merch)" }}
    >
      {/* max-w-[1000px]: real content ~936px wide at x=172 (left edge measured live); was max-w-screen-md=720px */}
      <div className="mx-auto max-w-[1000px] px-6 pb-16 pt-10 md:pt-12">
        {/* Section title — h2 because the page h1 is "SUPPORT" in the shared hero */}
        {/* ls -0.02em: real h2 ls -0.76px@1280 / -0.28px@390; was normal (no tracking) */}
        <h2
          className="mb-8 text-[28px] font-bold uppercase md:text-[38px]"
          style={{ color: "var(--color-merch-ink)", letterSpacing: "-0.02em" }}
        >
          {title}
        </h2>

        {/* Content blocks */}
        <div>
          {blocks.map((block, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <Block key={i} block={block} index={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
