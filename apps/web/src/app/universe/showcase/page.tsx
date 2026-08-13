/**
 * /universe/showcase — Universe-scoped component showcase index.
 *
 * Lists all components with area === "universe" from the shared registry,
 * themed in the Universe dark/gold editorial language. Nested under
 * /universe/layout.tsx so --color-universe-* tokens and the UniverseTopNav
 * resolve here (mirrors /merch/showcase for the merch surface).
 *
 * Server component: no 'use client', no event handlers. Hover effects use a
 * <style> block + CSS classes so no JS is required.
 */

import Link from "next/link";
import { registry } from "@low/ui/registry";

const universeEntries = registry.filter((e) => e.area === "universe");
const variantCount = universeEntries.reduce(
  (sum, e) => sum + e.variants.length,
  0,
);

export const metadata = {
  title: "Universe — Component Showcase",
  description:
    "Independent component showcase for the League Universe surface clone.",
};

export default function UniverseShowcasePage() {
  return (
    <div style={{ minHeight: "100vh", color: "var(--color-universe-story-ink)" }}>
      {/* Hover styles — CSS only, no JS event handlers */}
      <style>{`
        .usc-card {
          border: 1px solid var(--color-universe-nav-border);
          padding: 24px;
          background-color: var(--color-universe-card-bg);
          transition: border-color 150ms, box-shadow 150ms, transform 150ms;
          height: 100%;
          box-sizing: border-box;
        }
        .usc-card:hover {
          border-color: var(--color-gold-3);
          box-shadow: 0 2px 18px color-mix(in srgb, var(--color-hextech-black) 60%, transparent);
          transform: translateY(-2px);
        }
        .usc-card-link { text-decoration: none; display: block; }
        .usc-back-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--color-gold-2); text-decoration: none; transition: color 150ms;
        }
        .usc-back-link:hover { color: var(--color-gold-1); }
        .usc-slug {
          color: var(--color-gold-2); text-decoration: none; font-size: 13px;
          letter-spacing: 0.04em; transition: color 150ms;
        }
        .usc-slug:hover { color: var(--color-gold-1); }
      `}</style>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section
        style={{
          borderBottom: "1px solid var(--color-universe-nav-border)",
          padding: "56px 24px 44px",
        }}
      >
        <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <Link href="/showcase" className="usc-back-link">
              ← All components
            </Link>
            <Link href="/universe/showcase/map" className="usc-back-link">
              Site map →
            </Link>
          </div>
          <h1
            className="font-display"
            style={{
              marginTop: "20px",
              fontSize: "40px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--color-gold-1)",
            }}
          >
            Universe
          </h1>
          <p
            style={{
              marginTop: "10px",
              maxWidth: "620px",
              fontSize: "15px",
              lineHeight: 1.6,
              color: "var(--color-universe-story-ink)",
            }}
          >
            Independent component showcase for the League Universe surface — a
            1:1 clone of universe.leagueoflegends.com. {universeEntries.length}{" "}
            components · {variantCount} variants.
          </p>
        </div>
      </section>

      {/* ── Component grid ───────────────────────────────────────── */}
      <section style={{ padding: "40px 24px 80px" }}>
        <div
          style={{
            maxWidth: "1120px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
          {universeEntries.map((entry) => (
            <Link
              key={entry.slug}
              href={`/showcase/${entry.slug}`}
              className="usc-card-link"
            >
              <div className="usc-card">
                <h2
                  className="font-display"
                  style={{
                    fontSize: "18px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--color-gold-1)",
                  }}
                >
                  {entry.name}
                </h2>
                <span
                  className="usc-slug"
                  style={{ display: "block", marginTop: "4px" }}
                >
                  /{entry.slug}
                </span>
                <p
                  style={{
                    marginTop: "12px",
                    fontSize: "14px",
                    lineHeight: 1.55,
                    color: "var(--color-universe-story-ink)",
                  }}
                >
                  {entry.description}
                </p>
                <span
                  style={{
                    display: "inline-block",
                    marginTop: "14px",
                    fontSize: "12px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--color-gold-2)",
                  }}
                >
                  {entry.variants.length} variant
                  {entry.variants.length === 1 ? "" : "s"} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
