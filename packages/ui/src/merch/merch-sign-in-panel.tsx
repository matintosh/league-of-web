/**
 * MerchSignInPanel — presentational sign-in card for /merch/account.
 *
 * MERCH COMPONENT — use the merch design system: --color-merch-* tokens.
 * This is NOT the Hextech client — IGNORE client Hextech-only guidance;
 * still tokens-only (no raw hex outside packages/tokens; NO hex fallbacks
 * in var(); NO bare hex like #ffffff — use --color-merch-on-dark),
 * presentational (props in/callbacks out; NO fetching in @low/ui; types
 * from @low/fixtures), showcase server-safe (no 'use client'), SVG ids
 * from useId.
 *
 * The real merch.riotgames.com/en-us/account page redirects to Riot SSO and
 * is not publicly viewable without an account. This component presents a
 * clean sign-in panel consistent with the merch design system:
 *   - Centered panel, max-w-[480px], on --color-merch-surface background
 *   - Riot fist emblem at top (reuses same SVG as MerchHeader)
 *   - "Sign In" heading + descriptive subtext
 *   - Full-width "SIGN IN WITH RIOT" primary CTA (--color-merch-red)
 *   - "or" divider
 *   - "Track Your Order" guest link
 *   - Footer legal disclaimer with Terms/Privacy links
 *
 * Measured values: based on the issue spec (primary research source);
 * direct Playwright measurement was not possible as the route redirects
 * to Riot SSO before any content is visible.
 */

"use client";

import { useId } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MerchSignInPanelProps {
  /** Fired when the primary "SIGN IN WITH RIOT" button is clicked. */
  onSignIn?: () => void;
  /** Fired when "Track Your Order" link is clicked. */
  onTrackOrder?: () => void;
  /** Fired when "Terms of Service" link is clicked. */
  onTerms?: () => void;
  /** Fired when "Privacy Policy" link is clicked. */
  onPrivacy?: () => void;
}

// ---------------------------------------------------------------------------
// Riot fist emblem (32×32) — same path as MerchHeader logo circle
// ---------------------------------------------------------------------------

function RiotFistEmblem({ id, size = 32 }: { id: string; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      id={id}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="50" fill="var(--color-merch-red)" />
      {/* Simplified Riot fist silhouette (presentational) */}
      <path
        d="M38 70 L38 42 Q38 36 44 36 L44 30 Q44 24 50 24 Q56 24 56 30 L56 36 Q60 36 62 40 L62 48 Q64 48 66 52 L66 62 Q66 68 60 70 Z"
        fill="var(--color-merch-on-dark)"
      />
      <rect x="34" y="42" width="8" height="28" rx="3" fill="var(--color-merch-on-dark)" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Divider — "or" between two hairlines
// ---------------------------------------------------------------------------

function OrDivider() {
  return (
    <div className="flex items-center gap-4" style={{ marginTop: "24px", marginBottom: "24px" }}>
      <span
        className="flex-1"
        style={{ height: "1px", backgroundColor: "var(--color-merch-border)" }}
        aria-hidden="true"
      />
      <span
        style={{
          fontSize: "13px",
          color: "var(--color-merch-muted)",
          textTransform: "lowercase",
          userSelect: "none",
        }}
      >
        or
      </span>
      <span
        className="flex-1"
        style={{ height: "1px", backgroundColor: "var(--color-merch-border)" }}
        aria-hidden="true"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * MerchSignInPanel — centered card with Riot emblem, heading, primary CTA,
 * divider, guest track-order link, and legal disclaimer.
 *
 * Presentational only: fires callbacks, holds no state.
 */
export function MerchSignInPanel({
  onSignIn,
  onTrackOrder,
  onTerms,
  onPrivacy,
}: MerchSignInPanelProps) {
  const emblSmId  = useId();
  const emblLgId  = useId();

  return (
    <div
      className="mx-auto"
      style={{
        maxWidth: "480px",
        backgroundColor: "var(--color-merch-surface)",
        border: "1px solid var(--color-merch-border)",
        borderRadius: "8px",
        padding: "48px 40px",
        fontFamily: "var(--font-merch)",
      }}
    >
      {/* Riot fist emblem — centered at top */}
      <div className="flex justify-center" style={{ marginBottom: "24px" }}>
        <RiotFistEmblem id={emblSmId} size={32} />
      </div>

      {/* Heading */}
      <h1
        className="text-center"
        style={{
          fontSize: "24px",
          fontWeight: 700,
          color: "var(--color-merch-ink)",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          marginBottom: "24px",
        }}
      >
        Sign In
      </h1>

      {/* Subtext */}
      <p
        className="text-center"
        style={{
          fontSize: "14px",
          color: "var(--color-merch-muted)",
          lineHeight: 1.6,
          marginBottom: "32px",
        }}
      >
        Sign in with your Riot account to access your order history, wishlist,
        and more.
      </p>

      {/* Primary CTA — SIGN IN WITH RIOT */}
      <button
        type="button"
        onClick={onSignIn}
        className="flex w-full items-center justify-center gap-3 transition-colors duration-150"
        style={{
          backgroundColor: "var(--color-merch-red)",
          color: "var(--color-merch-on-dark)",
          borderRadius: "6px",
          height: "48px",
          fontSize: "14px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          border: "none",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "var(--color-merch-red-dark)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "var(--color-merch-red)";
        }}
      >
        {/* Riot fist icon (20×20) left-aligned inside button */}
        <RiotFistEmblem id={emblLgId} size={20} />
        Sign In with Riot
      </button>

      {/* "or" divider */}
      <OrDivider />

      {/* Guest order lookup */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onTrackOrder}
          className="transition-opacity duration-150 hover:underline"
          style={{
            fontSize: "13px",
            color: "var(--color-merch-red)",
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            textDecorationLine: "none",
          }}
        >
          Track Your Order
        </button>
      </div>

      {/* Legal disclaimer */}
      <p
        className="text-center"
        style={{
          fontSize: "12px",
          color: "var(--color-merch-muted)",
          lineHeight: 1.6,
          marginTop: "32px",
        }}
      >
        By signing in you agree to Riot&apos;s{" "}
        <button
          type="button"
          onClick={onTerms}
          className="hover:underline"
          style={{
            fontSize: "12px",
            color: "var(--color-merch-red)",
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            display: "inline",
          }}
        >
          Terms of Service
        </button>{" "}
        and{" "}
        <button
          type="button"
          onClick={onPrivacy}
          className="hover:underline"
          style={{
            fontSize: "12px",
            color: "var(--color-merch-red)",
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            display: "inline",
          }}
        >
          Privacy Policy
        </button>
        .
      </p>
    </div>
  );
}
