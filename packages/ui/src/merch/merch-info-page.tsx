"use client";

/**
 * MerchInfoPage — long-form prose + FAQ accordion template for /merch/pages/[slug].
 *
 * MERCH COMPONENT — use the merch design system: --color-merch-* tokens.
 * This is NOT the Hextech client.
 * Presentational: props in, no callbacks needed (static content).
 * Types (MerchInfoBlock, MerchFaqSection) are imported from @low/fixtures.
 *
 * 'use client' is required for accordion toggling state (issue #826).
 * The showcase wraps stateful accordion in merch-info-page.demo.tsx.
 *
 * Measured from merch.riotgames.com info pages (/en-us/faqs/, /en-us/shipping/):
 *   - Page background: --color-merch-bg (white).
 *   - Content container: max-w-[1000px] centered, left-aligned prose (real content ~936px wide at 1280).
 *   - Page title (h2 'FAQs'): 32px top+bottom padding; riotSans 38px desktop / 28px mobile (same as before).
 *   - FAQ category h2: Inter 18px/600, no uppercase, black (--color-merch-ink-dark).
 *   - FAQ question h3 triggers: riotSans 18.72px/700, right chevron, collapsible.
 *   - FAQ answer: 16px, line-height normal (~1.2), --color-merch-body; hidden until expanded.
 *   - Body paragraph: 16px, line-height normal (~1.2), --color-merch-body.
 *   - Lists: default browser list style, 16px, --color-merch-body, left-indented ~1.5rem.
 *   - Section divider: 1px --color-merch-border between major h2 sections.
 *   - Page top padding: ~40–48px (py-10 md:py-12); bottom ~64px (pb-16).
 */

import { useState } from "react";
import type { MerchInfoBlock, MerchFaqSection } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MerchInfoPageProps {
  /** Section title rendered as <h2> in the content area (the shared SUPPORT h1 is in MerchSupportHero). */
  title: string;
  /** Ordered list of content blocks — paragraphs, headings, lists, or faq-accordion. */
  blocks: MerchInfoBlock[];
}

// ---------------------------------------------------------------------------
// FAQ Accordion
// ---------------------------------------------------------------------------

interface FaqAccordionProps {
  sections: MerchFaqSection[];
}

/** FAQ accordion — category headings with collapsible Q&A items. */
function FaqAccordion({ sections }: FaqAccordionProps) {
  /* Tracks which question indexes are open: key = "sectionIdx-itemIdx" */
  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set());

  function toggle(key: string) {
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  return (
    <div>
      {sections.map((section, si) => (
        <div key={section.heading} className="mb-8">
          {/* Category heading: Inter 18px/600, no uppercase, black — real: "GENERAL QUESTIONS" etc. */}
          <h2
            className="mb-4 text-[18px] font-semibold"
            style={{
              color: "var(--color-merch-ink-dark)",
              fontFamily: "Inter, sans-serif",
              textTransform: "none",
              letterSpacing: "normal",
            }}
          >
            {section.heading}
          </h2>

          {/* Q&A pairs */}
          <div
            className="divide-y"
            style={{ borderColor: "var(--color-merch-border)" }}
          >
            {section.items.map((item, ii) => {
              const key = `${si}-${ii}`;
              const isOpen = openKeys.has(key);
              return (
                <div key={key}>
                  {/*
                    Question trigger — riotSans 18.72px/700, right chevron.
                    Real: collapsible h3 button with chevron pointing right (collapsed) / down (expanded).
                  */}
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => toggle(key)}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left"
                    style={{
                      color: "var(--color-merch-ink-dark)",
                      background: "none",
                      border: "none",
                    }}
                  >
                    <h3
                      className="text-[18.72px] font-bold leading-normal"
                      style={{ color: "var(--color-merch-ink-dark)" }}
                    >
                      {item.question}
                    </h3>
                    {/* Chevron — right when collapsed, down when expanded */}
                    <svg
                      width={20}
                      height={20}
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden
                      className="shrink-0 transition-transform duration-200"
                      style={{
                        transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                        color: "var(--color-merch-ink)",
                      }}
                    >
                      <path
                        d="M7 4l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {/* Answer panel — hidden until expanded */}
                  {isOpen && (
                    <div className="pb-4">
                      <p
                        className="text-[16px] leading-normal"
                        style={{ color: "var(--color-merch-body)" }}
                      >
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Block renderer
// ---------------------------------------------------------------------------

function Block({ block, index }: { block: MerchInfoBlock; index: number }) {
  const { type, content } = block;

  if (type === "faq-accordion") {
    /* Render accordion — sections are attached to the block. */
    if (!block.sections?.length) return null;
    return <FaqAccordion sections={block.sections} />;
  }

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
        {/* 28px on mobile → 38px on md+; ls -0.02em */}
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
    /* real h3: 18.72px / 700 (measured live) */
    return (
      <h3
        className="mb-2 mt-4 text-[19px] font-bold leading-normal"
        style={{ color: "var(--color-merch-ink)" }}
      >
        {content as string}
      </h3>
    );
  }

  if (type === "paragraph") {
    return (
      /* 16px / line-height normal — real: ~19px@16 (was leading-relaxed) */
      <p
        className="mb-4 text-[16px] leading-normal"
        style={{ color: "var(--color-merch-body)" }}
      >
        {content as string}
      </p>
    );
  }

  if (type === "ul") {
    return (
      <ul
        className="mb-4 list-disc pl-6 text-[16px] leading-normal"
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
        className="mb-4 list-decimal pl-6 text-[16px] leading-normal"
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
 * MerchInfoPage — renders a section title (h2) + prose block list (or FAQ
 * accordion) inside a centered max-w-[1000px] container, matching the real
 * store's info-page template.
 *
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
      {/*
        max-w-[1000px]: real content ~936px wide at x=172 (left edge measured live).
        Page title has 32px top+bottom padding (py-8) matching real 'FAQs' h2.
      */}
      <div className="mx-auto max-w-[1000px] px-6 pb-16 pt-10 md:pt-12">
        {/* Section title — h2, 32px top+bottom spacing, riotSans */}
        <h2
          className="mb-8 text-[28px] font-bold uppercase md:text-[38px]"
          style={{ color: "var(--color-merch-ink-dark)", letterSpacing: "-0.02em" }}
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
