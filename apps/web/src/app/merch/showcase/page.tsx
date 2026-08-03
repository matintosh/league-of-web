/**
 * /merch/showcase — merch-scoped component showcase index.
 *
 * Lists all components with area === "merch" from the shared registry.
 * Nested under /merch/layout.tsx so --color-merch-* tokens and Inter font
 * resolve here — fixing the token gap in the shared /showcase route.
 *
 * Server component: no 'use client', no event handlers.
 * Hover effects use a <style> block + CSS classes so no JS is required.
 */

import Link from "next/link";
import { registry } from "@low/ui/registry";

const merchEntries = registry.filter((e) => e.area === "merch");
const variantCount = merchEntries.reduce((sum, e) => sum + e.variants.length, 0);

export default function MerchShowcasePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-merch-bg)",
        color: "var(--color-merch-ink)",
        fontFamily: "var(--font-merch)",
      }}
    >
      {/* Hover styles — CSS only, no JS event handlers */}
      <style>{`
        .msc-card {
          border: 1px solid var(--color-merch-border);
          border-radius: 8px;
          padding: 24px;
          background-color: var(--color-merch-bg);
          transition: border-color 150ms, box-shadow 150ms;
          height: 100%;
          box-sizing: border-box;
        }
        .msc-card:hover {
          border-color: var(--color-merch-red);
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        }
        .msc-card-link {
          text-decoration: none;
          display: block;
        }
        .msc-header-link {
          color: var(--color-merch-muted-on-dark);
          text-decoration: none;
          font-size: 13px;
          letter-spacing: 0.04em;
          transition: color 150ms;
        }
        .msc-header-link:hover {
          color: var(--color-merch-on-dark);
        }
        .msc-back-link {
          display: inline-flex;
          align-items: center;
          font-size: 14px;
          font-weight: 600;
          color: var(--color-merch-muted);
          text-decoration: none;
          letter-spacing: 0.04em;
          transition: color 150ms;
        }
        .msc-back-link:hover {
          color: var(--color-merch-red);
        }
      `}</style>

      {/* ── Header bar ────────────────────────────────────────────── */}
      <header
        style={{
          backgroundColor: "var(--color-merch-ink-dark)",
          color: "var(--color-merch-on-dark)",
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
            justifyContent: "space-between",
          }}
        >
          {/* Left: wordmark + section label */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Riot fist emblem */}
            <svg
              aria-hidden="true"
              width="28"
              height="28"
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
            <span
              style={{
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--color-merch-muted-on-dark)",
              }}
            >
              Merch Design System
            </span>
          </div>

          {/* Right: back link to main showcase */}
          <Link href="/showcase" className="msc-header-link">
            ← All components
          </Link>
        </div>
      </header>

      {/* ── Hero section ──────────────────────────────────────────── */}
      <section
        style={{
          borderBottom: "1px solid var(--color-merch-border)",
          padding: "48px 24px 40px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p
            style={{
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--color-merch-red)",
              marginBottom: "8px",
            }}
          >
            Component showcase
          </p>
          <h1
            style={{
              fontSize: "clamp(28px, 5vw, 40px)",
              fontWeight: 800,
              letterSpacing: "-0.01em",
              color: "var(--color-merch-ink)",
              marginBottom: "12px",
            }}
          >
            Merch Design System
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "var(--color-merch-body)",
              maxWidth: "560px",
              lineHeight: 1.6,
              marginBottom: "32px",
            }}
          >
            Components powering the Riot Games merch store clone — built with{" "}
            <span style={{ color: "var(--color-merch-red)", fontWeight: 600 }}>
              --color-merch-*
            </span>{" "}
            tokens and Inter. Browse and inspect each component with all its variants.
          </p>

          {/* Stats row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "40px" }}>
            {[
              { value: String(merchEntries.length), label: "Components" },
              { value: String(variantCount), label: "Variants" },
              { value: "22+", label: "Merch tokens" },
            ].map(({ value, label }) => (
              <div key={label}>
                <span
                  style={{
                    display: "block",
                    fontSize: "32px",
                    fontWeight: 800,
                    color: "var(--color-merch-ink)",
                    lineHeight: 1,
                  }}
                >
                  {value}
                </span>
                <span
                  style={{
                    display: "block",
                    marginTop: "4px",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--color-merch-muted)",
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Component grid ────────────────────────────────────────── */}
      <section style={{ padding: "40px 24px 80px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "16px",
            }}
          >
            {merchEntries.map((entry) => (
              <Link
                key={entry.slug}
                href={`/merch/showcase/${entry.slug}`}
                className="msc-card-link"
              >
                <article className="msc-card">
                  {/* Component name */}
                  <h2
                    style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "var(--color-merch-ink)",
                      marginBottom: "8px",
                    }}
                  >
                    {entry.name}
                  </h2>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--color-merch-muted)",
                      lineHeight: 1.5,
                      marginBottom: "16px",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {entry.description}
                  </p>

                  {/* Footer row: variant count + arrow */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--color-merch-muted)",
                      }}
                    >
                      {entry.variants.length} variant{entry.variants.length !== 1 ? "s" : ""}
                    </span>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "var(--color-merch-red)",
                      }}
                    >
                      Browse →
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: "1px solid var(--color-merch-border)",
          backgroundColor: "var(--color-merch-surface)",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            color: "var(--color-merch-muted)",
            letterSpacing: "0.08em",
          }}
        >
          league-of-web · merch design system · components render with{" "}
          <code
            style={{
              fontFamily: "monospace",
              color: "var(--color-merch-red)",
            }}
          >
            --color-merch-*
          </code>{" "}
          tokens ·{" "}
          <Link
            href="/merch"
            style={{ color: "var(--color-merch-muted)", textDecoration: "underline" }}
          >
            Merch store
          </Link>
        </p>
      </footer>
    </div>
  );
}
