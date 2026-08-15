/**
 * UniverseBreadcrumb — breadcrumb trail for Universe interior pages.
 *
 * Ref: docs/reference/universe-live-champion-bio.png (top) +
 *      docs/reference/universe-live-champions.png.
 *
 * Small gold diamond glyph + caps trail segments separated by a thin '›'.
 * Segments: gold-2 caps, letter-spaced, ~11-12px; last (current) segment gold-1.
 * Links on all but the last segment.
 *
 * Props-in / callbacks-out. Server-safe (no 'use client').
 * Tokens-only — no raw hex. SVG glyph ids via useId. Issues #979.
 *
 * NOTE: hover color transitions use CSS custom property via Tailwind-compatible
 * inline vars rather than JS event handlers, keeping the component server-safe.
 */

import { useId } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UniverseBreadcrumbItem {
  /** Label text shown in the breadcrumb segment, e.g. "CHAMPIONS". */
  label: string;
  /** Optional href for link segments. Last item should have no href. */
  href?: string;
}

export interface UniverseBreadcrumbProps {
  /** Ordered trail items. Last item is treated as current (no link, gold-1). */
  items: UniverseBreadcrumbItem[];
  /** Callback fired when a link segment is clicked (receives the item index). */
  onNavigate?: (index: number) => void;
}

// ---------------------------------------------------------------------------
// Diamond glyph
// ---------------------------------------------------------------------------

function DiamondGlyph({ svgId }: { svgId: string }) {
  return (
    <svg
      aria-hidden="true"
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer diamond outline */}
      <rect
        x="1"
        y="1"
        width="6"
        height="6"
        transform={`rotate(45 4 4)`}
        stroke="var(--color-gold-3)"
        strokeWidth="0.75"
        fill="var(--color-gold-4)"
        opacity="0.75"
        id={`${svgId}-outer`}
      />
      {/* Inner pip */}
      <rect
        x="2.5"
        y="2.5"
        width="3"
        height="3"
        transform={`rotate(45 4 4)`}
        fill="var(--color-gold-3)"
        id={`${svgId}-inner`}
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Separator chevron
// ---------------------------------------------------------------------------

function Separator() {
  return (
    <span
      aria-hidden="true"
      className="mx-1.5 select-none text-[10px]"
      style={{ color: "var(--color-gold-4)" }}
    >
      ›
    </span>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * UniverseBreadcrumb — ordered caps breadcrumb trail for Universe pages.
 *
 * Presentational, server-safe. Links on all items except the last.
 * Last item is current page (gold-1, no link, aria-current="page").
 * Hover color transition uses CSS (no JS event handlers → server-safe).
 */
export function UniverseBreadcrumb({ items, onNavigate }: UniverseBreadcrumbProps) {
  const svgId = useId();

  if (!items.length) return null;

  return (
    <>
      {/* CSS-only hover for gold-2 → gold-1 on anchor segments */}
      <style>{`
        .univ-bc-link { color: var(--color-universe-overline); }
        .univ-bc-link:hover { color: var(--color-gold-1); }
      `}</style>

      <nav aria-label="Breadcrumb" className="flex items-center gap-0">
        {/* Diamond glyph prefix */}
        <DiamondGlyph svgId={svgId} />
        <span className="mx-2" aria-hidden="true" />

        <ol className="flex items-center list-none m-0 p-0">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isLink = !isLast && Boolean(item.href);

            return (
              <li key={`${item.label}-${index}`} className="flex items-center">
                {/* Separator between items (not before the first) */}
                {index > 0 && <Separator />}

                {isLink ? (
                  <a
                    href={item.href}
                    data-navigate-index={onNavigate ? String(index) : undefined}
                    className="univ-bc-link uppercase tracking-[2px] transition-colors duration-150"
                    style={{
                      fontSize: "14px",
                      fontFamily: "var(--font-display)", fontWeight: 500,
                      textDecoration: "none",
                      letterSpacing: "2px",
                    }}
                  >
                    {item.label.toUpperCase()}
                  </a>
                ) : isLast ? (
                  <span
                    aria-current="page"
                    className="uppercase tracking-[2px]"
                    style={{
                      fontSize: "14px",
                      color: "var(--color-gold-1)",
                      fontFamily: "var(--font-display)", fontWeight: 500,
                      letterSpacing: "2px",
                    }}
                  >
                    {item.label.toUpperCase()}
                  </span>
                ) : (
                  /* Non-link, non-last segment — muted gold-2 */
                  <span
                    className="uppercase tracking-[2px]"
                    style={{
                      fontSize: "14px",
                      color: "var(--color-universe-overline)",
                      fontFamily: "var(--font-display)", fontWeight: 500,
                      letterSpacing: "2px",
                    }}
                  >
                    {item.label.toUpperCase()}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
