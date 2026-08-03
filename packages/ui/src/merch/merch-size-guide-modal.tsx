"use client";

/**
 * MerchSizeGuideModal — centered apparel size-guide dialog.
 *
 * Measured from merch.riotgames.com (~1280×900 desktop):
 *   Dialog: 800×484px, centered in viewport, white bg
 *   Overlay: full-viewport, var(--color-merch-overlay) = rgba(0,0,0,0.45)
 *   Header: ~60px tall — "SIZE GUIDE" H2 left (24px/700), CLOSE button right
 *   Left column: product silhouette ~200px wide, flex-shrink 0
 *   Right column: [in][cm] unit toggle tabs, then size table
 *   Table rows: S / M / L / XL / 2XL; cols: Size | A | B | C
 *   CLOSE button: "CLOSE ×", 1px border var(--color-merch-border)
 *
 * Fully presentational — no internal useState.
 * Callers control open/unit selection via props.
 */
import React, { useId, useEffect, useRef } from "react";

export interface MerchSizeGuideRow {
  /** Size label, e.g. "S", "M", "L" */
  size: string;
  /**
   * Measurements in inches.
   * Component converts to cm on display when unit === "cm".
   */
  measurements: { a: number; b: number; c: number };
}

export interface MerchSizeGuideModalProps {
  /** Whether the modal is open — controlled */
  open: boolean;
  /** Called when the user dismisses (CLOSE button or backdrop click or ESC) */
  onClose?: () => void;
  /** Product silhouette image URL (supplied by page — no fetch inside @low/ui) */
  silhouetteImageUrl?: string;
  /** Size rows to display */
  rows: MerchSizeGuideRow[];
  /** Column labels for the measurement axes. Defaults to ["A", "B", "C"] */
  measurementLabels?: [string, string, string];
  /** Active unit — "in" or "cm". Controlled by caller. Defaults to "in". */
  unit?: "in" | "cm";
  /** Called when the user switches unit tabs. */
  onUnitChange?: (unit: "in" | "cm") => void;
}

const CM_FACTOR = 2.54;

function fmt(val: number, unit: "in" | "cm"): string {
  const converted = unit === "cm" ? val * CM_FACTOR : val;
  // Trim trailing zeros: 24.25 → "24.25"; 25.00 → "25"
  return parseFloat(converted.toFixed(2)).toString();
}

/** Small ruler icon for the close button area (decorative). */
function CloseX({ id }: { id: string }) {
  return (
    <svg
      aria-hidden="true"
      id={id}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * MerchSizeGuideModal — centered size-guide dialog.
 * Rendered at the page level; visibility controlled by `open` prop.
 */
export function MerchSizeGuideModal({
  open,
  onClose,
  silhouetteImageUrl,
  rows,
  measurementLabels = ["A", "B", "C"],
  unit = "in",
  onUnitChange,
}: MerchSizeGuideModalProps) {
  const uid = useId().replace(/:/g, "");
  const headingId = `msg-heading-${uid}`;
  const closeXId = `msg-x-${uid}`;
  const dialogRef = useRef<HTMLDivElement>(null);

  // Move focus to the dialog when it opens (a11y)
  useEffect(() => {
    if (open) dialogRef.current?.focus();
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose?.();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const [labelA, labelB, labelC] = measurementLabels;

  return (
    <>
      {/* ── Overlay ───────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 60,
          backgroundColor: "var(--color-merch-overlay)",
        }}
      />

      {/* ── Dialog ────────────────────────────────────────────────────── */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 61,
          width: 800,
          minHeight: 484,
          backgroundColor: "var(--color-merch-bg)",
          fontFamily: "var(--font-merch)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "var(--shadow-merch-modal)",
          outline: "none",
        }}
        // Allow focus to land on dialog for a11y
        tabIndex={-1}
      >
        {/* ── Header row ──────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px 16px",
            borderBottom: "1px solid var(--color-merch-border)",
            flexShrink: 0,
          }}
        >
          <h2
            id={headingId}
            style={{
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--color-merch-ink)",
              margin: 0,
            }}
          >
            Size Guide
          </h2>

          <button
            type="button"
            aria-label="Close size guide"
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              fontSize: 12,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--color-merch-ink)",
              backgroundColor: "var(--color-merch-bg)",
              border: "1px solid var(--color-merch-border)",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "var(--color-merch-ink)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "var(--color-merch-border)";
            }}
          >
            Close
            <CloseX id={closeXId} />
          </button>
        </div>

        {/* ── Body ────────────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            gap: 32,
            padding: 24,
            flex: 1,
            alignItems: "flex-start",
          }}
        >
          {/* Left: product silhouette */}
          <div
            style={{
              width: 200,
              flexShrink: 0,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            {silhouetteImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={silhouetteImageUrl}
                alt="Product silhouette with measurement guides"
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  objectFit: "contain",
                }}
              />
            ) : (
              /* Placeholder silhouette when no image supplied */
              <div
                aria-hidden="true"
                style={{
                  width: 200,
                  height: 300,
                  backgroundColor: "var(--color-merch-surface)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-merch-muted)",
                  fontSize: 12,
                }}
              >
                Silhouette
              </div>
            )}
          </div>

          {/* Right: unit toggle + table */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Unit toggle tabs */}
            <div
              role="tablist"
              aria-label="Measurement unit"
              style={{
                display: "flex",
                gap: 0,
                marginBottom: 16,
              }}
            >
              {(["in", "cm"] as const).map((u) => {
                const isActive = unit === u;
                return (
                  <button
                    key={u}
                    role="tab"
                    type="button"
                    aria-selected={isActive}
                    onClick={() => onUnitChange?.(u)}
                    style={{
                      padding: "6px 20px",
                      fontSize: 13,
                      fontWeight: 600,
                      textTransform: "lowercase",
                      border: "1px solid var(--color-merch-border)",
                      backgroundColor: isActive
                        ? "var(--color-merch-ink)"
                        : "var(--color-merch-bg)",
                      color: isActive
                        ? "var(--color-merch-on-dark)"
                        : "var(--color-merch-ink)",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      marginLeft: u === "cm" ? -1 : 0,
                      transition: "background-color 120ms ease, color 120ms ease",
                    }}
                  >
                    {u}
                  </button>
                );
              })}
            </div>

            {/* Size table */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
                color: "var(--color-merch-ink)",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "8px 12px",
                      fontWeight: 600,
                      borderBottom: "1px solid var(--color-merch-border)",
                      borderRight: "1px solid var(--color-merch-border)",
                      backgroundColor: "var(--color-merch-surface)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Size
                  </th>
                  {([labelA, labelB, labelC] as const).map((label) => (
                    <th
                      key={label}
                      style={{
                        textAlign: "center",
                        padding: "8px 12px",
                        fontWeight: 600,
                        borderBottom: "1px solid var(--color-merch-border)",
                        borderRight: "1px solid var(--color-merch-border)",
                        backgroundColor: "var(--color-merch-surface)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {label}({unit})
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => {
                  const isEven = idx % 2 === 0;
                  return (
                    <tr key={row.size}>
                      <td
                        style={{
                          padding: "8px 12px",
                          fontWeight: 600,
                          borderBottom: "1px solid var(--color-merch-border)",
                          borderRight: "1px solid var(--color-merch-border)",
                          backgroundColor: isEven
                            ? "var(--color-merch-bg)"
                            : "var(--color-merch-surface)",
                        }}
                      >
                        {row.size}
                      </td>
                      <td
                        style={{
                          padding: "8px 12px",
                          textAlign: "center",
                          borderBottom: "1px solid var(--color-merch-border)",
                          borderRight: "1px solid var(--color-merch-border)",
                          backgroundColor: isEven
                            ? "var(--color-merch-bg)"
                            : "var(--color-merch-surface)",
                        }}
                      >
                        {fmt(row.measurements.a, unit)}
                      </td>
                      <td
                        style={{
                          padding: "8px 12px",
                          textAlign: "center",
                          borderBottom: "1px solid var(--color-merch-border)",
                          borderRight: "1px solid var(--color-merch-border)",
                          backgroundColor: isEven
                            ? "var(--color-merch-bg)"
                            : "var(--color-merch-surface)",
                        }}
                      >
                        {fmt(row.measurements.b, unit)}
                      </td>
                      <td
                        style={{
                          padding: "8px 12px",
                          textAlign: "center",
                          borderBottom: "1px solid var(--color-merch-border)",
                          backgroundColor: isEven
                            ? "var(--color-merch-bg)"
                            : "var(--color-merch-surface)",
                        }}
                      >
                        {fmt(row.measurements.c, unit)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
