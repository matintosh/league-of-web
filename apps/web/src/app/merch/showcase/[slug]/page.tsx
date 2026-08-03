/**
 * /merch/showcase/[slug] — merch component detail page.
 *
 * Looks up the ShowcaseEntry by slug (area === "merch" only), renders
 * its variants using the shared VariantCanvas and ReferenceToggle client
 * components — reusing the existing rendering machinery rather than
 * duplicating it.
 *
 * Nested under /merch/layout.tsx so --color-merch-* tokens and var(--font-merch)
 * (Inter) resolve here — this is the token-fix rationale for this route.
 *
 * Server component: no 'use client' needed.
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { registry } from "@low/ui/registry";
import { VariantCanvas } from "../../../showcase/[slug]/variant-canvas.client";
import { ReferenceToggle } from "../../../showcase/[slug]/reference-toggle.client";

export function generateStaticParams() {
  return registry
    .filter((e) => e.area === "merch")
    .map((e) => ({ slug: e.slug }));
}

export default async function MerchComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = registry.find((e) => e.slug === slug && e.area === "merch");
  if (!entry) notFound();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-merch-bg)",
        color: "var(--color-merch-ink)",
        fontFamily: "var(--font-merch)",
      }}
    >
      {/* ── Header bar ────────────────────────────────────────────── */}
      <header
        style={{
          backgroundColor: "var(--color-merch-ink-dark)",
          color: "var(--color-merch-on-dark)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 24px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {/* Riot fist emblem */}
          <svg
            aria-hidden="true"
            width="24"
            height="24"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="50" fill="var(--color-merch-red)" />
            <path
              d="M38 70 L38 42 Q38 36 44 36 L44 30 Q44 24 50 24 Q56 24 56 30 L56 36 Q60 36 62 40 L62 48 Q64 48 66 52 L66 62 Q66 68 60 70 Z"
              fill="var(--color-merch-on-dark)"
            />
            <rect x="34" y="42" width="8" height="28" rx="3" fill="var(--color-merch-on-dark)" />
          </svg>

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
            <Link
              href="/merch/showcase"
              style={{
                fontSize: "13px",
                color: "var(--color-merch-muted-on-dark)",
                textDecoration: "none",
                letterSpacing: "0.04em",
              }}
            >
              Merch Showcase
            </Link>
            <span
              style={{
                color: "var(--color-merch-muted-on-dark)",
                fontSize: "13px",
              }}
            >
              /
            </span>
            <span
              style={{
                fontSize: "13px",
                color: "var(--color-merch-on-dark)",
                fontWeight: 600,
              }}
            >
              {entry.name}
            </span>
          </nav>

          {/* Back to shared showcase */}
          <Link
            href="/showcase"
            style={{
              fontSize: "12px",
              color: "var(--color-merch-muted-on-dark)",
              textDecoration: "none",
              letterSpacing: "0.04em",
              whiteSpace: "nowrap",
            }}
          >
            All components →
          </Link>
        </div>
      </header>

      {/* ── Component hero ────────────────────────────────────────── */}
      <div
        style={{
          borderBottom: "1px solid var(--color-merch-border)",
          padding: "40px 24px 32px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p
            style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--color-merch-red)",
              marginBottom: "8px",
            }}
          >
            Merch · {entry.area}
          </p>
          <h1
            style={{
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 800,
              letterSpacing: "-0.01em",
              color: "var(--color-merch-ink)",
              marginBottom: "12px",
            }}
          >
            {entry.name}
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: "var(--color-merch-body)",
              maxWidth: "640px",
              lineHeight: 1.6,
            }}
          >
            {entry.description}
          </p>
        </div>
      </div>

      {/* ── Variants ──────────────────────────────────────────────── */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px 80px" }}>
        {/* Reference image toggle (shared client island) */}
        {entry.referenceImage && (
          <div style={{ marginBottom: "32px" }}>
            <ReferenceToggle
              referenceImage={entry.referenceImage}
              referenceNote={entry.referenceNote}
            />
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
          {entry.variants.map((variant) => (
            <section key={variant.name}>
              {/* Variant header */}
              <h2
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--color-merch-muted)",
                  borderBottom: "1px solid var(--color-merch-border)",
                  paddingBottom: "10px",
                  marginBottom: "16px",
                }}
              >
                {variant.name}
              </h2>

              {/* Reuse the shared VariantCanvas client island — no logic duplicated */}
              <VariantCanvas backgrounds={variant.backgrounds ?? ["dark"]}>
                {variant.render()}
              </VariantCanvas>

              {/* Variant notes */}
              {variant.notes && (
                <div
                  style={{
                    marginTop: "12px",
                    borderLeft: "3px solid var(--color-merch-red)",
                    paddingLeft: "12px",
                    paddingTop: "8px",
                    paddingBottom: "8px",
                    backgroundColor: "var(--color-merch-surface)",
                    fontSize: "13px",
                    color: "var(--color-merch-body)",
                    lineHeight: 1.5,
                  }}
                >
                  {variant.notes}
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Back link */}
        <div style={{ marginTop: "64px", paddingTop: "32px", borderTop: "1px solid var(--color-merch-border)" }}>
          <Link
            href="/merch/showcase"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--color-merch-red)",
              textDecoration: "none",
              letterSpacing: "0.04em",
            }}
          >
            ← Back to Merch Showcase
          </Link>
        </div>
      </main>
    </div>
  );
}
