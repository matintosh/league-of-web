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
 *   - Content container: max-w-screen-md centered, left-aligned prose
 *   - Page title (h1): ~28–32px, font-weight 700, --color-merch-ink, uppercase
 *   - Section headings (h2): ~16–18px, font-weight 700, uppercase, letter-spacing 0.05em
 *   - Sub-headings (h3): ~15px, font-weight 600, --color-merch-ink
 *   - Body paragraph: 14–15px, line-height ~1.6, --color-merch-body
 *   - Lists: default browser list style, 14px, --color-merch-body, left-indented ~1.5rem
 *   - Section divider: 1px --color-merch-border between major h2 sections
 *   - Page top padding: ~40–48px (py-10 md:py-12); bottom ~64px (pb-16)
 *   - No breadcrumb on info pages
 */

import type { MerchInfoBlock } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MerchInfoPageProps {
  /** Page title rendered as <h1>. */
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
        <h2
          className="mb-3 mt-6 text-[17px] font-bold uppercase tracking-[0.05em] first:mt-0"
          style={{ color: "var(--color-merch-ink)" }}
        >
          {content as string}
        </h2>
      </>
    );
  }

  if (type === "heading3") {
    return (
      <h3
        className="mb-2 mt-4 text-[15px] font-semibold"
        style={{ color: "var(--color-merch-ink)" }}
      >
        {content as string}
      </h3>
    );
  }

  if (type === "paragraph") {
    return (
      <p
        className="mb-4 text-[14px] leading-relaxed"
        style={{ color: "var(--color-merch-body)" }}
      >
        {content as string}
      </p>
    );
  }

  if (type === "ul") {
    return (
      <ul
        className="mb-4 list-disc pl-6 text-[14px] leading-relaxed"
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
        className="mb-4 list-decimal pl-6 text-[14px] leading-relaxed"
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
 * MerchInfoPage — renders a title + prose block list inside a centered
 * max-w-screen-md container, matching the real store's info-page template.
 * Wrap with MerchHeader + MerchFooter in the page route.
 */
export function MerchInfoPage({ title, blocks }: MerchInfoPageProps) {
  return (
    <main
      className="w-full flex-1"
      style={{ backgroundColor: "var(--color-merch-bg)", fontFamily: "var(--font-merch)" }}
    >
      <div className="mx-auto max-w-screen-md px-6 py-10 md:py-12 pb-16">
        {/* Page title */}
        <h1
          className="mb-8 text-[30px] font-bold uppercase"
          style={{ color: "var(--color-merch-ink)" }}
        >
          {title}
        </h1>

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
