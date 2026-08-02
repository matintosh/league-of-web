/**
 * MerchFooter — global footer for the Riot Games merch store clone.
 *
 * MERCH COMPONENT — use the merch design system: --color-merch-* tokens
 * (add a token to @low/tokens if one is missing, sampled from the real store)
 * and a modern e-commerce layout. This is NOT the Hextech client — IGNORE the
 * client Hextech-only / no-default-Tailwind-palette guidance; still tokens-only
 * (no raw hex outside packages/tokens), presentational (props in/callbacks out,
 * NO fetching in @low/ui, types from @low/fixtures), showcase server-safe
 * (no 'use client'), SVG/gradient ids from useId.
 *
 * Measured from merch.riotgames.com footer (~1280px desktop):
 *   - Background: --color-merch-surface (#f5f5f5) — slightly elevated from page white
 *   - Top border: 1px --color-merch-border (#e5e5e5)
 *   - Padding: ~48px vertical, max-w-screen-xl centered
 *   - Link columns: 3 columns (Support, Shipping, About) with bold ALL-CAPS heading
 *   - Column heading: ~11–12px, letter-spacing 0.1em, weight 700, ink color
 *   - Links: ~13px, muted color, hover → ink + underline
 *   - Bottom bar: copyright (left) + legal links (right), ~12px muted
 *   - Newsletter: optional — email input + "Subscribe" button fires onSubscribe(email)
 *   - Social icons: optional — rendered as labeled icon slots
 */

"use client";

import { useId, useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MerchFooterLink {
  label: string;
  href: string;
}

export interface MerchFooterLinkGroup {
  heading: string;
  links: MerchFooterLink[];
}

export interface MerchFooterProps {
  /** Link columns — defaults to the real-store structure if omitted. */
  linkGroups?: MerchFooterLinkGroup[];
  /** Copyright line, e.g. "Copyright Riot Games 2025". */
  copyrightText?: string;
  /** Bottom legal links. */
  legalLinks?: MerchFooterLink[];
  /** Newsletter subscribe callback; if omitted, no newsletter section rendered. */
  onSubscribe?: (email: string) => void;
  /** Social media links. */
  socialLinks?: Array<{ platform: string; href: string }>;
}

// ---------------------------------------------------------------------------
// Defaults (real-store structure)
// ---------------------------------------------------------------------------

const DEFAULT_LINK_GROUPS: MerchFooterLinkGroup[] = [
  {
    heading: "Support",
    links: [
      { label: "Order Status",        href: "/en-us/order-lookup/" },
      { label: "Gift Card Balance",    href: "/en-us/gift-card-balance/" },
      { label: "Verify Your Product",  href: "/en-us/product-validation/" },
      { label: "FAQs",                 href: "/en-us/faqs/" },
    ],
  },
  {
    heading: "Shipping",
    links: [
      { label: "Shipping Information", href: "/en-us/faqs/" },
      { label: "Returns",              href: "/en-us/faqs/" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "Collectability Guide", href: "/en-us/collectability-guide/" },
      { label: "Accessibility",        href: "/en-us/accessibility/" },
    ],
  },
];

const DEFAULT_LEGAL_LINKS: MerchFooterLink[] = [
  { label: "Legal Info",          href: "/en-us/legal/" },
  { label: "Cookie Preferences",  href: "/en-us/cookies/" },
  { label: "Terms & Conditions",  href: "/en-us/terms/" },
  { label: "Privacy Policy",      href: "/en-us/privacy/" },
];

// ---------------------------------------------------------------------------
// Social icon helper — generic platform icons via SVG paths
// ---------------------------------------------------------------------------

function SocialIcon({ platform }: { platform: string }) {
  const lower = platform.toLowerCase();

  if (lower === "instagram") {
    return (
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    );
  }
  if (lower === "twitter" || lower === "x") {
    return (
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  if (lower === "facebook") {
    return (
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    );
  }
  if (lower === "youtube") {
    return (
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 1.96C1 8.12 1 12 1 12s0 3.88.46 5.58a2.78 2.78 0 0 0 1.94 1.96C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96C23 15.88 23 12 23 12s0-3.88-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
      </svg>
    );
  }
  // Fallback: globe / generic
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Newsletter sub-component (client-interactive)
// ---------------------------------------------------------------------------

function NewsletterSection({ onSubscribe }: { onSubscribe: (email: string) => void }) {
  const inputId = useId();
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      onSubscribe(email.trim());
      setEmail("");
    }
  }

  return (
    <div className="mb-10 border-b pb-10" style={{ borderColor: "var(--color-merch-border, #e5e5e5)" }}>
      <p
        className="mb-1 text-[11px] font-bold uppercase tracking-[0.1em]"
        style={{ color: "var(--color-merch-ink, #1a1a1a)" }}
      >
        Stay in the loop
      </p>
      <p className="mb-3 text-[13px]" style={{ color: "var(--color-merch-muted, #737373)" }}>
        Subscribe for exclusive drops and offers.
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex max-w-sm gap-2"
        aria-label="Newsletter signup"
      >
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>
        <input
          id={inputId}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1 border px-3 py-2 text-[13px] outline-none transition-colors duration-150 focus:border-current"
          style={{
            borderColor: "var(--color-merch-border, #e5e5e5)",
            backgroundColor: "var(--color-merch-bg, #ffffff)",
            color: "var(--color-merch-ink, #1a1a1a)",
          }}
        />
        <button
          type="submit"
          className="px-4 py-2 text-[12px] font-semibold uppercase tracking-wider text-white transition-opacity duration-150 hover:opacity-85"
          style={{ backgroundColor: "var(--color-merch-red, #d13639)" }}
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * MerchFooter — link columns, optional newsletter stub, optional social icons,
 * and a bottom bar with copyright + legal links.
 */
export function MerchFooter({
  linkGroups = DEFAULT_LINK_GROUPS,
  copyrightText = "Copyright Riot Games 2025",
  legalLinks = DEFAULT_LEGAL_LINKS,
  onSubscribe,
  socialLinks,
}: MerchFooterProps) {
  return (
    <footer
      className="w-full border-t"
      style={{
        backgroundColor: "var(--color-merch-surface, #f5f5f5)",
        borderColor: "var(--color-merch-border, #e5e5e5)",
        fontFamily: "var(--font-merch, system-ui, sans-serif)",
      }}
    >
      <div className="mx-auto max-w-screen-xl px-6 py-12">

        {/* Newsletter (optional) */}
        {onSubscribe && <NewsletterSection onSubscribe={onSubscribe} />}

        {/* Link columns + social */}
        <div className="mb-10 flex flex-col gap-8 md:flex-row md:gap-16">
          {linkGroups.map((group) => (
            <div key={group.heading} className="flex flex-col gap-3">
              <p
                className="text-[11px] font-bold uppercase tracking-[0.1em]"
                style={{ color: "var(--color-merch-ink, #1a1a1a)" }}
              >
                {group.heading}
              </p>
              <ul className="flex flex-col gap-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-[13px] underline-offset-2 transition-colors duration-150 hover:underline"
                      style={{
                        color: "var(--color-merch-muted, #737373)",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color =
                          "var(--color-merch-ink, #1a1a1a)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color =
                          "var(--color-merch-muted, #737373)";
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social links — right-aligned if present */}
          {socialLinks && socialLinks.length > 0 && (
            <div className="flex flex-col gap-3 md:ml-auto">
              <p
                className="text-[11px] font-bold uppercase tracking-[0.1em]"
                style={{ color: "var(--color-merch-ink, #1a1a1a)" }}
              >
                Follow Us
              </p>
              <div className="flex gap-4">
                {socialLinks.map(({ platform, href }) => (
                  <a
                    key={platform}
                    href={href}
                    aria-label={platform}
                    className="transition-opacity duration-150 hover:opacity-60"
                    style={{ color: "var(--color-merch-muted, #737373)" }}
                  >
                    <SocialIcon platform={platform} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom bar: copyright + legal */}
        <div
          className="flex flex-col gap-2 border-t pt-6 md:flex-row md:items-center md:justify-between"
          style={{ borderColor: "var(--color-merch-border, #e5e5e5)" }}
        >
          {/* Copyright */}
          <p
            className="text-[12px]"
            style={{ color: "var(--color-merch-muted, #737373)" }}
          >
            {copyrightText}
          </p>

          {/* Legal links */}
          {legalLinks && legalLinks.length > 0 && (
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {legalLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[12px] underline-offset-2 transition-colors duration-150 hover:underline"
                  style={{ color: "var(--color-merch-muted, #737373)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "var(--color-merch-ink, #1a1a1a)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "var(--color-merch-muted, #737373)";
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
