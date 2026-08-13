/**
 * UniverseFooter — Riot Universe site footer.
 *
 * Ref: real universe.leagueoflegends.com footer (dark near-black band below
 * content; captures on scroll).
 *
 * Dark band (universe-bg / slightly lifted from the page bg), thin top hairline.
 * Riot Games fist logo (small, muted). Rows of footer links (caps, gold-2,
 * letter-spaced, small): navigation + social + legal.
 * Bottom legal line: copyright + policy links (Terms / Privacy).
 *
 * Props-in / callbacks-out. Server-safe (no 'use client').
 * Tokens-only — no raw hex. SVG ids via useId. CSS hover instead of JS handlers.
 * Issues #981.
 */

import { useId } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UniverseFooterLink {
  /** Link label text. */
  label: string;
  /** href for the link. */
  href: string;
}

export interface UniverseFooterLinkGroup {
  /** Column heading, e.g. "EXPLORE". */
  heading: string;
  /** Links in this column. */
  links: UniverseFooterLink[];
}

export interface UniverseFooterProps {
  /** Column groups of footer navigation links. */
  linkGroups: UniverseFooterLinkGroup[];
  /** Legal / copyright notice text, e.g. "© 2025 Riot Games. All rights reserved." */
  legal: string;
  /** Social links, e.g. Twitter, Instagram. */
  social?: UniverseFooterLink[];
}

// ---------------------------------------------------------------------------
// Riot fist logo
// ---------------------------------------------------------------------------

function RiotFistLogo({ svgId }: { svgId: string }) {
  return (
    <svg
      aria-label="Riot Games"
      role="img"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      id={svgId}
    >
      {/* Stylised shield/fist silhouette — muted gold */}
      <path
        d="M12 2 L20 6 L20 15 Q20 20 12 23 Q4 20 4 15 L4 6 Z"
        fill="color-mix(in srgb, var(--color-gold-4) 60%, var(--color-universe-bg))"
      />
      <path
        d="M9 10 L9 16 M12 9 L12 16 M15 10 L15 16"
        stroke="var(--color-universe-bg)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * UniverseFooter — site footer for universe.leagueoflegends.com.
 *
 * Presentational, server-safe. Tokens-only.
 * Responsive columns; no 1280w overflow.
 * CSS hover used for color transitions (server-safe, no JS event handlers).
 */
export function UniverseFooter({ linkGroups, legal, social }: UniverseFooterProps) {
  const svgId = useId();

  return (
    <>
      {/* CSS-only hover for link gold-2 → gold-1 */}
      <style>{`
        .univ-footer-link { color: var(--color-gold-2); text-decoration: none; }
        .univ-footer-link:hover { color: var(--color-gold-1); }
      `}</style>

      <footer
        aria-label="Site footer"
        style={{
          backgroundColor: "color-mix(in srgb, var(--color-universe-bg) 85%, var(--color-hextech-black) 15%)",
          borderTop: "1px solid var(--color-universe-nav-border)",
        }}
      >
        {/* Main footer band */}
        <div className="mx-auto max-w-screen-xl px-6 py-10">

          {/* Top row: Riot logo + "RIOT GAMES" label */}
          <div className="mb-8 flex items-center gap-3">
            <RiotFistLogo svgId={`${svgId}-logo`} />
            <span
              className="uppercase tracking-[0.18em] text-[11px]"
              style={{
                color: "var(--color-gold-4)",
                fontFamily: "var(--font-body)",
                letterSpacing: "0.18em",
              }}
            >
              Riot Games
            </span>
          </div>

          {/* Link columns */}
          {linkGroups.length > 0 && (
            <div
              className="mb-8 grid gap-y-6 gap-x-8"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}
            >
              {linkGroups.map((group) => (
                <div key={group.heading}>
                  {/* Column heading */}
                  <h2
                    className="mb-3 text-[10px] uppercase tracking-[0.2em]"
                    style={{
                      color: "var(--color-gold-4)",
                      fontFamily: "var(--font-body)",
                      letterSpacing: "0.2em",
                    }}
                  >
                    {group.heading}
                  </h2>
                  <ul className="flex flex-col gap-2 list-none p-0 m-0">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          className="univ-footer-link text-[11px] uppercase tracking-[0.1em] transition-colors duration-150"
                          style={{
                            fontFamily: "var(--font-body)",
                            letterSpacing: "0.1em",
                          }}
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Social links row */}
          {social && social.length > 0 && (
            <div className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-2">
              {social.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="univ-footer-link text-[11px] uppercase tracking-[0.1em] transition-colors duration-150"
                  style={{
                    fontFamily: "var(--font-body)",
                    letterSpacing: "0.1em",
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}

          {/* Thin divider hairline */}
          <div
            className="mb-6 w-full h-px"
            style={{ backgroundColor: "var(--color-universe-nav-border)" }}
            aria-hidden="true"
          />

          {/* Legal / copyright line */}
          <p
            className="text-[10px] leading-relaxed"
            style={{
              color: "var(--color-gold-4)",
              fontFamily: "var(--font-body)",
              opacity: 0.7,
            }}
          >
            {legal}
          </p>
        </div>
      </footer>
    </>
  );
}
