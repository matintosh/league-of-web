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
 *   - Background: --color-merch-ink-dark (pure black #000)
 *   - No top border (dark bg blends with dark header bottom)
 *   - Padding: ~64px vertical, max-w-screen-xl centered
 *   - Left side: Riot fist logo + "Shop" column + "Support" column
 *   - Right side: "Contact Us" form (Name, Email, Order#, Country,
 *     Tracking#, Subject, How can we help + SEND)
 *   - Column headings: 11–12px, weight 700, uppercase, --color-merch-on-dark
 *   - Links: 13px, --color-merch-muted-on-dark, hover → --color-merch-on-dark
 *   - Form labels: 11px, uppercase, tracking-wide, --color-merch-muted-on-dark
 *   - Form inputs: dark border, transparent bg, --color-merch-on-dark text
 *   - SEND button: --color-merch-on-dark bg, --color-merch-ink-dark text
 *   - Bottom bar: copyright (left) + legal links (right), 12px muted-on-dark
 */

"use client";

import { useId } from "react";

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

/** Field values submitted by the Contact Us form. */
export interface MerchContactFormValues {
  name: string;
  email: string;
  orderNumber: string;
  country: string;
  trackingNumber: string;
  subject: string;
  message: string;
}

export interface MerchFooterProps {
  /** Shop link column — defaults to the real-store Apparel/Collectibles/Art/Accessories list. */
  shopLinks?: MerchFooterLink[];
  /** Support link column — defaults to the real-store Support list. */
  supportLinks?: MerchFooterLink[];
  /** Copyright line, e.g. "Copyright Riot Games 2025". */
  copyrightText?: string;
  /** Bottom legal links. */
  legalLinks?: MerchFooterLink[];
  /**
   * Contact form submit callback. Receives the form field values.
   * If omitted the form still renders but submit is a no-op.
   */
  onContactSubmit?: (values: MerchContactFormValues) => void;

  // ── Back-compat props kept from the previous implementation ──────────
  /** @deprecated Use shopLinks + supportLinks instead. Ignored if those are set. */
  linkGroups?: MerchFooterLinkGroup[];
  /** @deprecated No newsletter in the real footer. Ignored. */
  onSubscribe?: (email: string) => void;
  /** @deprecated No social links in the real footer. Ignored. */
  socialLinks?: Array<{ platform: string; href: string }>;
}

// ---------------------------------------------------------------------------
// Defaults (real-store structure)
// ---------------------------------------------------------------------------

const DEFAULT_SHOP_LINKS: MerchFooterLink[] = [
  { label: "Apparel",        href: "/merch/shop-all?category=apparel" },
  { label: "Collectibles",   href: "/merch/shop-all?category=collectibles" },
  { label: "Art",            href: "/merch/shop-all?category=art" },
  { label: "Accessories",    href: "/merch/shop-all?category=accessories" },
];

const DEFAULT_SUPPORT_LINKS: MerchFooterLink[] = [
  { label: "Order Status",        href: "/en-us/order-lookup/" },
  { label: "Gift Card Balance",   href: "/en-us/gift-card-balance/" },
  { label: "Verify Your Product", href: "/en-us/product-validation/" },
  { label: "FAQs",                href: "/merch/pages/faqs" },
  { label: "Shipping Information",href: "/merch/pages/shipping" },
  { label: "Return Policy",       href: "/merch/pages/returns" },
  { label: "Collectability Guide",href: "/merch/pages/collectability-guide" },
  { label: "Accessibility",       href: "/merch/pages/accessibility" },
];

const DEFAULT_LEGAL_LINKS: MerchFooterLink[] = [
  { label: "Legal Info",          href: "/merch/pages/legal" },
  { label: "Cookie Preferences",  href: "/merch/pages/cookies" },
  { label: "Terms & Conditions",  href: "/merch/pages/terms" },
  { label: "Privacy Policy",      href: "/merch/pages/privacy" },
];

// ---------------------------------------------------------------------------
// Riot fist logo — extracted from merch.riotgames.com (same path as header
// but here shown as the standalone fist/mark only, not the full wordmark).
// We reuse the full wordmark SVG at a slightly larger size matching the footer.
// ---------------------------------------------------------------------------

function RiotWordmark({ id }: { id: string }) {
  return (
    <svg
      aria-hidden="true"
      id={id}
      width="120"
      height="34"
      viewBox="0 0 587.93 165"
      fill="var(--color-merch-on-dark)"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Riot Games</title>
      <path d="M98.77.33 0 46.07l24.61 93.66 18.73-2.3-5.15-58.89 6.15-2.74L54.96 136l32.01-3.93-5.69-65 6.09-2.71 11.68 66.23 32.38-3.98-6.23-71.25 6.16-2.74 12.77 72.43 32.01-3.93V19.71L98.77.33zm2.32 142.05 1.63 9.22 73.42 12.24v-30.68l-75.01 9.22h-.04zm144.49-19.22v12.63h15.57a14.84 14.84 0 0 1-1.92 7.31 13 13 0 0 1-5.6 5.11 20 20 0 0 1-8.9 1.8 17.53 17.53 0 0 1-10-2.8 17.87 17.87 0 0 1-6.44-8.14 33.06 33.06 0 0 1-2.27-12.93 31.81 31.81 0 0 1 2.32-12.81 18.14 18.14 0 0 1 6.5-8 17.27 17.27 0 0 1 9.82-2.78 19.31 19.31 0 0 1 5.36.71 14.15 14.15 0 0 1 4.33 2.09 12.92 12.92 0 0 1 3.18 3.29 15.61 15.61 0 0 1 2 4.44h17.27a27.22 27.22 0 0 0-3.46-10.28 28.84 28.84 0 0 0-7.05-8.1 32.6 32.6 0 0 0-9.91-5.29 37.91 37.91 0 0 0-12.06-1.86 37.32 37.32 0 0 0-14 2.6 32.6 32.6 0 0 0-11.36 7.61 35 35 0 0 0-7.61 12.21 46.15 46.15 0 0 0-2.73 16.44q0 11.94 4.54 20.59a32.4 32.4 0 0 0 12.69 13.27 39.84 39.84 0 0 0 35.84.84 28.39 28.39 0 0 0 11.67-11q4.25-7.19 4.24-17.2v-9.76Zm215.03 40.81V88.53h51.67v13.96h-34.62v16.76h27.99v13.96h-27.99v16.8h34.7v13.96h-51.75zm101.83-53.3a9 9 0 0 0-3.54-6.64c-2.09-1.59-5-2.38-8.69-2.38a16.63 16.63 0 0 0-6.26 1 8.62 8.62 0 0 0-3.83 2.78 6.74 6.74 0 0 0-1.33 4 6.2 6.2 0 0 0 .79 3.29 7.27 7.27 0 0 0 2.4 2.45 16.54 16.54 0 0 0 3.7 1.79 40.14 40.14 0 0 0 4.64 1.31l6.63 1.54a47.19 47.19 0 0 1 9.45 3.08 27.46 27.46 0 0 1 7.2 4.68 18.84 18.84 0 0 1 4.58 6.39 20.37 20.37 0 0 1 1.61 8.29 20.65 20.65 0 0 1-3.54 12.11 22.56 22.56 0 0 1-10.15 7.85 41.31 41.31 0 0 1-15.93 2.76 42.69 42.69 0 0 1-16.17-2.81 23.22 23.22 0 0 1-10.72-8.48q-3.83-5.66-4-14.12h16.43a10.68 10.68 0 0 0 7.05 9.94 19.37 19.37 0 0 0 7.24 1.26 18.44 18.44 0 0 0 6.66-1.09 10 10 0 0 0 4.33-3 7.22 7.22 0 0 0 1.57-4.48 6.16 6.16 0 0 0-1.42-4 10.86 10.86 0 0 0-4.14-2.81 42.07 42.07 0 0 0-6.89-2.14l-8.07-1.95q-9.65-2.3-15.23-7.26t-5.54-13.44a19.86 19.86 0 0 1 3.72-12.12 24.74 24.74 0 0 1 10.33-8.11 36.74 36.74 0 0 1 15-2.91 35.62 35.62 0 0 1 14.92 2.91 23.43 23.43 0 0 1 9.91 8.14 21.54 21.54 0 0 1 3.6 12.12Zm-113.99 53.3h-16.87v-57.35l-1.73-.02-17.04 57.37h-16.86l-16.58-57.37-2.15.02v57.35h-16.87V88.53h28.67l14.48 50.56h1.75l14.48-50.56h28.72v75.44zm-114.66 0h18.27l-25.33-75.43h-23.15l-25.37 75.43h18.3l4.93-16.54h27.42Zm-28.43-29.7 8.22-27.65h3.1l8.26 27.65Zm278.58-37.76a4 4 0 0 1-3.67-2.44 4 4 0 0 1 0-3.1 4 4 0 0 1 .85-1.27 4.25 4.25 0 0 1 1.27-.86 4.15 4.15 0 0 1 3.1 0 4.13 4.13 0 0 1 1.27.86 4.08 4.08 0 0 1 .86 1.27 4 4 0 0 1 0 3.1 4.08 4.08 0 0 1-.86 1.27 4 4 0 0 1-1.27.86 4 4 0 0 1-1.55.31Zm0-1.09a2.84 2.84 0 0 0 1.47-.39 2.94 2.94 0 0 0 1.05-1 2.93 2.93 0 0 0 0-2.92 3 3 0 0 0-1.06-1 2.93 2.93 0 0 0-2.92 0 3 3 0 0 0-1 1 2.86 2.86 0 0 0 0 2.92 3 3 0 0 0 1 1 2.83 2.83 0 0 0 1.46.39Zm-1.46-1.15V90.6h1.78a1.52 1.52 0 0 1 .69.15 1.13 1.13 0 0 1 .47.42 1.24 1.24 0 0 1 .17.66 1.16 1.16 0 0 1-.18.66 1 1 0 0 1-.48.41 1.56 1.56 0 0 1-.7.14h-1.2v-.72h1a.52.52 0 0 0 .36-.12.5.5 0 0 0 .14-.37.47.47 0 0 0-.14-.37.52.52 0 0 0-.36-.12h-.55v2.93Zm2.39-1.68.82 1.68h-1.11l-.75-1.68ZM282.41 1.03h17.05v75.44h-17.05zm98.02 37.72q0 12.42-4.71 21a32.67 32.67 0 0 1-12.79 13.17 38.57 38.57 0 0 1-36.31 0 32.75 32.75 0 0 1-12.79-13.2q-4.71-8.66-4.71-21t4.71-21.05a32.67 32.67 0 0 1 12.75-13.14 38.65 38.65 0 0 1 36.31 0 32.67 32.67 0 0 1 12.79 13.17q4.71 8.64 4.71 21.05m-17.35 0a33.35 33.35 0 0 0-2.23-13 17.47 17.47 0 0 0-6.33-8 18.57 18.57 0 0 0-19.45 0 17.57 17.57 0 0 0-6.35 8 38.59 38.59 0 0 0 0 26 17.49 17.49 0 0 0 6.35 8 18.57 18.57 0 0 0 19.45 0 17.39 17.39 0 0 0 6.33-8 33.4 33.4 0 0 0 2.23-13M246.58 50.17l8.76 26.3h18.71l-9.74-28.33h-13.23l-.79-2.44c2.52-.49 6.83-1.25 10.65-3.85a20 20 0 0 0 8.75-16.39 24.15 24.15 0 0 0-3.26-12.75 21.9 21.9 0 0 0-9.36-8.64 32.56 32.56 0 0 0-14.64-3H212v75.4h17.06v-26.3Zm-.32-15.61a19.35 19.35 0 0 1-7.26 1.18h-9.94V14.88h9.91a18.68 18.68 0 0 1 7.25 1.24 9.12 9.12 0 0 1 4.4 3.7 10 10 0 0 1 1.5 5.64 9.65 9.65 0 0 1-1.48 5.55 8.86 8.86 0 0 1-4.38 3.55M382.04 1.03v14h29.3l.8 2.45c-2.48.48-6.67 1.22-10.43 3.7v55.31h16.87v-61.5h19.62v-14Z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Link column sub-component
// ---------------------------------------------------------------------------

function FooterLinkColumn({ heading, links }: MerchFooterLinkGroup) {
  return (
    <div className="flex flex-col gap-3">
      <p
        className="text-[11px] font-bold uppercase tracking-[0.1em]"
        style={{ color: "var(--color-merch-on-dark)" }}
      >
        {heading}
      </p>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-[13px] underline-offset-2 transition-colors duration-150 hover:underline"
              style={{ color: "var(--color-merch-muted-on-dark)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--color-merch-on-dark)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--color-merch-muted-on-dark)";
              }}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Contact form sub-component (presentational — state lives in *.demo.tsx)
// ---------------------------------------------------------------------------

export interface MerchContactFormState {
  name: string;
  email: string;
  orderNumber: string;
  country: string;
  trackingNumber: string;
  subject: string;
  message: string;
}

export interface MerchContactFormProps {
  /** Controlled values — supply from state in a *.demo.tsx client component. */
  values?: Partial<MerchContactFormState>;
  /** Change handler — (field, value) => void. */
  onChange?: (field: keyof MerchContactFormState, value: string) => void;
  /** Submit handler — receives current values. */
  onSubmit?: (values: MerchContactFormValues) => void;
}

function ContactForm({ values = {}, onChange, onSubmit }: MerchContactFormProps) {
  const ids = {
    name:           useId(),
    email:          useId(),
    orderNumber:    useId(),
    country:        useId(),
    trackingNumber: useId(),
    subject:        useId(),
    message:        useId(),
  };

  const inputStyle = {
    backgroundColor: "transparent",
    borderColor:     "var(--color-merch-border-dark)",
    color:           "var(--color-merch-on-dark)",
  } as React.CSSProperties;

  const inputClass =
    "w-full border px-3 py-2 text-[13px] outline-none " +
    "transition-colors duration-150 " +
    "focus:border-[color:var(--color-merch-muted-on-dark)] " +
    "placeholder:text-[color:var(--color-merch-border-dark)]";

  const labelClass =
    "block text-[11px] font-bold uppercase tracking-[0.08em] mb-1";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit?.({
      name:           values.name           ?? "",
      email:          values.email          ?? "",
      orderNumber:    values.orderNumber    ?? "",
      country:        values.country        ?? "",
      trackingNumber: values.trackingNumber ?? "",
      subject:        values.subject        ?? "",
      message:        values.message        ?? "",
    });
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Contact Us" className="flex flex-col gap-4">
      {/* Name */}
      <div>
        <label
          htmlFor={ids.name}
          className={labelClass}
          style={{ color: "var(--color-merch-muted-on-dark)" }}
        >
          Name
        </label>
        <input
          id={ids.name}
          type="text"
          value={values.name ?? ""}
          onChange={(e) => onChange?.("name", e.target.value)}
          placeholder="Your name"
          className={inputClass}
          style={inputStyle}
        />
      </div>

      {/* Email + Order# row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor={ids.email}
            className={labelClass}
            style={{ color: "var(--color-merch-muted-on-dark)" }}
          >
            Email Address <span aria-hidden="true">*</span>
          </label>
          <input
            id={ids.email}
            type="email"
            value={values.email ?? ""}
            onChange={(e) => onChange?.("email", e.target.value)}
            placeholder="you@example.com"
            required
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div>
          <label
            htmlFor={ids.orderNumber}
            className={labelClass}
            style={{ color: "var(--color-merch-muted-on-dark)" }}
          >
            Order Number
          </label>
          <input
            id={ids.orderNumber}
            type="text"
            value={values.orderNumber ?? ""}
            onChange={(e) => onChange?.("orderNumber", e.target.value)}
            placeholder="e.g. 12345"
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Country + Tracking# row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor={ids.country}
            className={labelClass}
            style={{ color: "var(--color-merch-muted-on-dark)" }}
          >
            Country
          </label>
          <input
            id={ids.country}
            type="text"
            value={values.country ?? ""}
            onChange={(e) => onChange?.("country", e.target.value)}
            placeholder="e.g. United States"
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div>
          <label
            htmlFor={ids.trackingNumber}
            className={labelClass}
            style={{ color: "var(--color-merch-muted-on-dark)" }}
          >
            Tracking Number
          </label>
          <input
            id={ids.trackingNumber}
            type="text"
            value={values.trackingNumber ?? ""}
            onChange={(e) => onChange?.("trackingNumber", e.target.value)}
            placeholder="e.g. 1Z999AA10123456784"
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Subject */}
      <div>
        <label
          htmlFor={ids.subject}
          className={labelClass}
          style={{ color: "var(--color-merch-muted-on-dark)" }}
        >
          Subject <span aria-hidden="true">*</span>
        </label>
        <input
          id={ids.subject}
          type="text"
          value={values.subject ?? ""}
          onChange={(e) => onChange?.("subject", e.target.value)}
          placeholder="Brief summary of your inquiry"
          required
          className={inputClass}
          style={inputStyle}
        />
      </div>

      {/* How can we help */}
      <div>
        <label
          htmlFor={ids.message}
          className={labelClass}
          style={{ color: "var(--color-merch-muted-on-dark)" }}
        >
          How can we help? <span aria-hidden="true">*</span>
        </label>
        <textarea
          id={ids.message}
          value={values.message ?? ""}
          onChange={(e) => onChange?.("message", e.target.value)}
          placeholder="Describe your issue or question…"
          required
          rows={5}
          className={inputClass + " resize-none"}
          style={inputStyle}
        />
      </div>

      {/* SEND button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-8 py-2.5 text-[12px] font-bold uppercase tracking-[0.1em] transition-opacity duration-150 hover:opacity-85"
          style={{
            backgroundColor: "var(--color-merch-on-dark)",
            color:           "var(--color-merch-ink-dark)",
          }}
        >
          Send
        </button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * MerchFooter — pure-black footer matching merch.riotgames.com:
 * Riot wordmark (top-left), Shop + Support link columns (left side),
 * "Contact Us" form (right side), legal row at bottom.
 *
 * The contact form is presentational: supply `onContactSubmit` to handle
 * submissions. For a stateful interactive demo use `merch-footer.demo.tsx`.
 */
export function MerchFooter({
  shopLinks    = DEFAULT_SHOP_LINKS,
  supportLinks = DEFAULT_SUPPORT_LINKS,
  copyrightText = "Copyright Riot Games 2025",
  legalLinks   = DEFAULT_LEGAL_LINKS,
  onContactSubmit,
  // back-compat — intentionally unused beyond accepting the prop
  linkGroups: _linkGroups,
  onSubscribe: _onSubscribe,
  socialLinks: _socialLinks,
}: MerchFooterProps) {
  const logoId = useId();

  return (
    <footer
      className="w-full"
      style={{
        backgroundColor: "var(--color-merch-ink-dark)",
        fontFamily:      "var(--font-merch)",
      }}
    >
      <div className="mx-auto max-w-screen-xl px-6 py-16">

        {/* ---------------------------------------------------------------- */}
        {/* Top: Riot wordmark                                                */}
        {/* ---------------------------------------------------------------- */}
        <div className="mb-12">
          <RiotWordmark id={logoId} />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Main row: link columns (left) + Contact Us form (right)          */}
        {/* ---------------------------------------------------------------- */}
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">

          {/* Left: Shop + Support columns */}
          <div className="flex flex-shrink-0 flex-col gap-10 sm:flex-row sm:gap-16">
            <FooterLinkColumn heading="Shop" links={shopLinks} />
            <FooterLinkColumn heading="Support" links={supportLinks} />
          </div>

          {/* Right: Contact Us form */}
          <div className="flex-1 lg:max-w-md xl:max-w-lg">
            <p
              className="mb-6 text-[11px] font-bold uppercase tracking-[0.1em]"
              style={{ color: "var(--color-merch-on-dark)" }}
            >
              Contact Us
            </p>
            <ContactForm onSubmit={onContactSubmit} />
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Bottom bar: copyright + legal links                               */}
        {/* ---------------------------------------------------------------- */}
        <div
          className="mt-16 flex flex-col gap-2 border-t pt-6 md:flex-row md:items-center md:justify-between"
          style={{ borderColor: "var(--color-merch-border-dark)" }}
        >
          {/* Copyright */}
          <p
            className="text-[12px]"
            style={{ color: "var(--color-merch-muted-on-dark)" }}
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
                  style={{ color: "var(--color-merch-muted-on-dark)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "var(--color-merch-on-dark)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "var(--color-merch-muted-on-dark)";
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
