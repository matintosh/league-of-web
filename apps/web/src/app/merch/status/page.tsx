/**
 * /merch/status — Merch build status: site map + fidelity scorecard.
 *
 * SERVER component — reads docs/merch-coverage.md and docs/merch-fidelity.md
 * at request/build time via fs (no fetch, no client-side JS). Nested under
 * /merch/layout.tsx so --color-merch-* tokens and Inter are available.
 *
 * Path resolution: the parser walks up from process.cwd() until it finds
 * docs/merch-coverage.md, handling both turbo (repo root cwd) and direct
 * pnpm dev from apps/web.
 *
 * No showcase entry needed — this is an app-level route, not a @low/ui component.
 */

import Link from "next/link";
import { loadMerchDocs, type StatusEmoji, type VerdictEmoji } from "@/lib/parse-merch-docs";

// ── Badge helpers ────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<StatusEmoji, string> = {
  "✅": "Live",
  "🔨": "In Progress",
  "⬜": "Missing",
  "⛔": "Out of Scope",
};

const STATUS_STYLE: Record<StatusEmoji, React.CSSProperties> = {
  "✅": {
    backgroundColor: "var(--color-merch-badge-new)",
    color: "var(--color-merch-ink)",
  },
  "🔨": {
    backgroundColor: "var(--color-merch-badge-progress)",
    color: "var(--color-merch-ink)",
  },
  "⬜": {
    backgroundColor: "var(--color-merch-surface)",
    color: "var(--color-merch-muted)",
    border: "1px solid var(--color-merch-border)",
  },
  "⛔": {
    backgroundColor: "var(--color-merch-surface)",
    color: "var(--color-merch-muted)",
    border: "1px solid var(--color-merch-border)",
    textDecoration: "line-through",
  },
};

const VERDICT_LABEL: Record<VerdictEmoji, string> = {
  "✅": "Pixel-match",
  "⚠️": "Deltas open",
  "🔁": "Re-diff queued",
  "⬜": "Never diffed",
  "⛔": "Out of scope",
};

const VERDICT_STYLE: Record<VerdictEmoji, React.CSSProperties> = {
  "✅": {
    backgroundColor: "var(--color-merch-badge-new)",
    color: "var(--color-merch-ink)",
  },
  "⚠️": {
    backgroundColor: "var(--color-merch-badge-progress)",
    color: "var(--color-merch-ink)",
  },
  "🔁": {
    backgroundColor: "var(--color-merch-badge-limited)",
    color: "var(--color-merch-ink)",
  },
  "⬜": {
    backgroundColor: "var(--color-merch-surface)",
    color: "var(--color-merch-muted)",
    border: "1px solid var(--color-merch-border)",
  },
  "⛔": {
    backgroundColor: "var(--color-merch-surface)",
    color: "var(--color-merch-muted)",
    border: "1px solid var(--color-merch-border)",
  },
};

function Badge({
  label,
  style,
}: {
  label: string;
  style: React.CSSProperties;
}) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: "4px",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {label}
    </span>
  );
}

// ── Route link — links to our route if it's a real /merch/... path ────────────

function RouteCell({ route }: { route: string }) {
  const isMerchRoute = route.startsWith("/merch");
  // Only link concrete routes (no [handle] dynamic segments that would 404)
  const isDynamic = route.includes("[");
  if (isMerchRoute && !isDynamic) {
    return (
      <Link
        href={route}
        style={{
          color: "var(--color-merch-red)",
          textDecoration: "none",
          fontFamily: "monospace",
          fontSize: "13px",
        }}
      >
        {route}
      </Link>
    );
  }
  return (
    <span style={{ fontFamily: "monospace", fontSize: "13px", color: "var(--color-merch-body)" }}>
      {route}
    </span>
  );
}

// ── Shared table styles ───────────────────────────────────────────────────────

const TH: React.CSSProperties = {
  padding: "10px 12px",
  textAlign: "left",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--color-merch-muted)",
  borderBottom: "2px solid var(--color-merch-border)",
  whiteSpace: "nowrap",
};

const TD: React.CSSProperties = {
  padding: "10px 12px",
  fontSize: "13px",
  color: "var(--color-merch-body)",
  borderBottom: "1px solid var(--color-merch-border)",
  verticalAlign: "top",
};

// ── Page ─────────────────────────────────────────────────────────────────────

export default function MerchStatusPage() {
  const data = loadMerchDocs();
  const docsAvailable = data.pages.length > 0 || data.fidelity.length > 0;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-merch-bg)",
        color: "var(--color-merch-ink)",
        fontFamily: "var(--font-merch)",
      }}
    >
      <style>{`
        .status-table { width: 100%; border-collapse: collapse; }
        .status-table tbody tr:hover { background-color: var(--color-merch-surface); }
        .status-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        @media (max-width: 480px) {
          .status-hero-h1 { font-size: 24px !important; }
        }
      `}</style>

      {/* ── Header bar ──────────────────────────────────────────────── */}
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
            gap: "16px",
          }}
        >
          {/* Left: wordmark */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <svg
              aria-hidden="true"
              width="26"
              height="26"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50" cy="50" r="50" fill="var(--color-merch-red)" />
              <path
                d="M38 70 L38 42 Q38 36 44 36 L44 30 Q44 24 50 24 Q56 24 56 30 L56 36 Q60 36 62 40 L62 48 Q64 48 66 52 L66 62 Q66 68 60 70 Z"
                fill="var(--color-merch-on-dark)"
              />
              <rect
                x="34"
                y="42"
                width="8"
                height="28"
                rx="3"
                fill="var(--color-merch-on-dark)"
              />
            </svg>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--color-merch-muted-on-dark)",
              }}
            >
              Merch Build Status
            </span>
          </div>

          {/* Right: navigation links */}
          <div style={{ display: "flex", gap: "20px", alignItems: "center", flexShrink: 0 }}>
            <Link
              href="/merch"
              style={{
                color: "var(--color-merch-muted-on-dark)",
                textDecoration: "none",
                fontSize: "13px",
                letterSpacing: "0.04em",
              }}
            >
              ← Merch store
            </Link>
            <Link
              href="/merch/showcase"
              style={{
                color: "var(--color-merch-muted-on-dark)",
                textDecoration: "none",
                fontSize: "13px",
                letterSpacing: "0.04em",
              }}
            >
              Design system
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section
        style={{
          borderBottom: "1px solid var(--color-merch-border)",
          padding: "48px 24px 40px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--color-merch-red)",
              marginBottom: "8px",
            }}
          >
            Build tracker · auto-generated from docs/
          </p>
          <h1
            className="status-hero-h1"
            style={{
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 800,
              letterSpacing: "-0.01em",
              color: "var(--color-merch-ink)",
              marginBottom: "12px",
            }}
          >
            Merch Build Status
          </h1>

          {docsAvailable ? (
            <>
              {data.statusHeadline && (
                <p
                  style={{
                    fontSize: "15px",
                    color: "var(--color-merch-body)",
                    lineHeight: 1.6,
                    maxWidth: "700px",
                  }}
                >
                  {data.statusHeadline}
                </p>
              )}
            </>
          ) : (
            <p
              style={{
                fontSize: "15px",
                color: "var(--color-merch-muted)",
                fontStyle: "italic",
              }}
            >
              Status docs unavailable — docs/merch-coverage.md or
              docs/merch-fidelity.md could not be found at build time.
            </p>
          )}

          {/* Legend */}
          <div
            style={{
              marginTop: "24px",
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-merch-muted)",
                marginRight: "4px",
              }}
            >
              Legend:
            </span>
            {(["✅", "🔨", "⬜", "⛔"] as StatusEmoji[]).map((e) => (
              <Badge key={e} label={`${e} ${STATUS_LABEL[e]}`} style={STATUS_STYLE[e]} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Main content ────────────────────────────────────────────── */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* ── Section 1: Store pages ───────────────────────────────── */}
        <section style={{ marginBottom: "56px" }}>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 800,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "var(--color-merch-ink)",
              marginBottom: "4px",
            }}
          >
            Store pages
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "var(--color-merch-muted)",
              marginBottom: "16px",
            }}
          >
            Site-map of every /merch page vs the real merch.riotgames.com page.
          </p>

          {data.pages.length > 0 ? (
            <div className="status-scroll">
              <table className="status-table">
                <thead>
                  <tr>
                    <th style={TH}>Page</th>
                    <th style={TH}>Status</th>
                    <th style={TH}>Our route</th>
                    <th style={TH}>Real URL</th>
                    <th style={TH}>Composes</th>
                  </tr>
                </thead>
                <tbody>
                  {data.pages.map((row, i) => (
                    <tr key={i}>
                      <td style={{ ...TD, fontWeight: 600, color: "var(--color-merch-ink)" }}>
                        {row.page}
                      </td>
                      <td style={TD}>
                        <Badge
                          label={`${row.status} ${STATUS_LABEL[row.status]}`}
                          style={STATUS_STYLE[row.status]}
                        />
                      </td>
                      <td style={TD}>
                        <RouteCell route={row.ourRoute} />
                      </td>
                      <td style={{ ...TD, fontFamily: "monospace", fontSize: "12px" }}>
                        {row.realUrl}
                      </td>
                      <td style={{ ...TD, color: "var(--color-merch-muted)", maxWidth: "260px" }}>
                        {row.composes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: "var(--color-merch-muted)", fontStyle: "italic", fontSize: "14px" }}>
              No page data parsed.
            </p>
          )}
        </section>

        {/* ── Section 2: Nav-destination routes ───────────────────── */}
        {data.navRoutes.length > 0 && (
          <section style={{ marginBottom: "56px" }}>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 800,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "var(--color-merch-ink)",
                marginBottom: "4px",
              }}
            >
              Nav-destination routes
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "var(--color-merch-muted)",
                marginBottom: "16px",
              }}
            >
              Header navigation must be able to reach these routes.
            </p>

            <div className="status-scroll">
              <table className="status-table">
                <thead>
                  <tr>
                    <th style={TH}>Page</th>
                    <th style={TH}>Status</th>
                    <th style={TH}>Our route</th>
                    <th style={TH}>Real URL</th>
                    <th style={TH}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {data.navRoutes.map((row, i) => (
                    <tr key={i}>
                      <td style={{ ...TD, fontWeight: 600, color: "var(--color-merch-ink)" }}>
                        {row.page}
                      </td>
                      <td style={TD}>
                        <Badge
                          label={`${row.status} ${STATUS_LABEL[row.status]}`}
                          style={STATUS_STYLE[row.status]}
                        />
                      </td>
                      <td style={TD}>
                        <RouteCell route={row.ourRoute} />
                      </td>
                      <td style={{ ...TD, fontFamily: "monospace", fontSize: "12px" }}>
                        {row.realUrl}
                      </td>
                      <td style={{ ...TD, color: "var(--color-merch-muted)", maxWidth: "220px" }}>
                        {row.composes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── Section 3: Supporting routes ────────────────────────── */}
        {data.supportingRoutes.length > 0 && (
          <section style={{ marginBottom: "56px" }}>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 800,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "var(--color-merch-ink)",
                marginBottom: "4px",
              }}
            >
              Supporting routes
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "var(--color-merch-muted)",
                marginBottom: "16px",
              }}
            >
              Routes in the app that are not store pages (redirects, design system, showcase).
            </p>

            <div className="status-scroll">
              <table className="status-table">
                <thead>
                  <tr>
                    <th style={TH}>Page</th>
                    <th style={TH}>Status</th>
                    <th style={TH}>Our route</th>
                    <th style={TH}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {data.supportingRoutes.map((row, i) => (
                    <tr key={i}>
                      <td style={{ ...TD, fontWeight: 600, color: "var(--color-merch-ink)" }}>
                        {row.page}
                      </td>
                      <td style={TD}>
                        <Badge
                          label={`${row.status} ${STATUS_LABEL[row.status]}`}
                          style={STATUS_STYLE[row.status]}
                        />
                      </td>
                      <td style={TD}>
                        <RouteCell route={row.ourRoute} />
                      </td>
                      <td style={{ ...TD, color: "var(--color-merch-muted)", maxWidth: "320px" }}>
                        {row.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── Section 4: Fidelity scorecard ───────────────────────── */}
        <section style={{ marginBottom: "56px" }}>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 800,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "var(--color-merch-ink)",
              marginBottom: "4px",
            }}
          >
            Fidelity vs real site
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "var(--color-merch-muted)",
              marginBottom: "4px",
            }}
          >
            Playwright pixel-diff results at 1280px + 390px vs merch.riotgames.com.
          </p>
          {/* Fidelity legend */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-merch-muted)",
                marginRight: "4px",
              }}
            >
              Verdict:
            </span>
            {(["✅", "⚠️", "🔁", "⬜", "⛔"] as VerdictEmoji[]).map((e) => (
              <Badge key={e} label={`${e} ${VERDICT_LABEL[e]}`} style={VERDICT_STYLE[e]} />
            ))}
          </div>

          {data.fidelity.length > 0 ? (
            <div className="status-scroll">
              <table className="status-table">
                <thead>
                  <tr>
                    <th style={TH}>Target</th>
                    <th style={TH}>Verdict</th>
                    <th style={TH}>Our route</th>
                    <th style={TH}>Last diff</th>
                    <th style={TH}>Residual deltas</th>
                  </tr>
                </thead>
                <tbody>
                  {data.fidelity.map((row, i) => (
                    <tr key={i}>
                      <td style={{ ...TD, fontWeight: 600, color: "var(--color-merch-ink)" }}>
                        {row.target}
                      </td>
                      <td style={TD}>
                        <Badge
                          label={`${row.verdict} ${VERDICT_LABEL[row.verdict]}`}
                          style={VERDICT_STYLE[row.verdict]}
                        />
                      </td>
                      <td style={TD}>
                        <RouteCell route={row.ourRoute} />
                      </td>
                      <td
                        style={{
                          ...TD,
                          fontSize: "12px",
                          color: "var(--color-merch-muted)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {row.lastDiff}
                      </td>
                      <td
                        style={{
                          ...TD,
                          color: "var(--color-merch-muted)",
                          fontSize: "12px",
                          maxWidth: "340px",
                        }}
                      >
                        {row.residual}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: "var(--color-merch-muted)", fontStyle: "italic", fontSize: "14px" }}>
              No fidelity data parsed.
            </p>
          )}
        </section>

        {/* ── Section 5: Known residual deltas ───────────────────── */}
        {data.residualDeltas.length > 0 && (
          <section style={{ marginBottom: "40px" }}>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 800,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "var(--color-merch-ink)",
                marginBottom: "4px",
              }}
            >
              Known residual deltas
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "var(--color-merch-muted)",
                marginBottom: "16px",
              }}
            >
              Open items awaiting user decision or build — from docs/merch-fidelity.md.
            </p>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {data.residualDeltas.map((delta, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    gap: "12px",
                    padding: "12px 16px",
                    backgroundColor: "var(--color-merch-surface)",
                    borderLeft: "3px solid var(--color-merch-badge-limited)",
                    borderRadius: "0 4px 4px 0",
                    fontSize: "13px",
                    color: "var(--color-merch-body)",
                    lineHeight: 1.5,
                  }}
                >
                  <span
                    style={{
                      color: "var(--color-merch-muted)",
                      fontWeight: 600,
                      flexShrink: 0,
                      fontSize: "11px",
                      paddingTop: "2px",
                    }}
                  >
                    {i + 1}.
                  </span>
                  <span>{delta}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Docs note ───────────────────────────────────────────── */}
        <aside
          style={{
            padding: "16px 20px",
            backgroundColor: "var(--color-merch-surface)",
            border: "1px solid var(--color-merch-border)",
            borderRadius: "6px",
            fontSize: "12px",
            color: "var(--color-merch-muted)",
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: "var(--color-merch-ink)" }}>Source: </strong>
          This page is generated at request time from{" "}
          <code style={{ fontFamily: "monospace", color: "var(--color-merch-red)" }}>
            docs/merch-coverage.md
          </code>{" "}
          and{" "}
          <code style={{ fontFamily: "monospace", color: "var(--color-merch-red)" }}>
            docs/merch-fidelity.md
          </code>
          . Edit those files to update this dashboard — no code change needed.
        </aside>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────── */}
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
          league-of-web · merch build status ·{" "}
          <Link
            href="/merch"
            style={{ color: "var(--color-merch-muted)", textDecoration: "underline" }}
          >
            Merch store
          </Link>{" "}
          ·{" "}
          <Link
            href="/merch/showcase"
            style={{ color: "var(--color-merch-muted)", textDecoration: "underline" }}
          >
            Design system
          </Link>
        </p>
      </footer>
    </div>
  );
}
