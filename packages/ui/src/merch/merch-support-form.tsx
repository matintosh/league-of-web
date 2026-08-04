"use client";

/**
 * MerchSupportForm — presentational form widget for the 3 support pages:
 *   - order-status       (variant: "row", 3 fields)
 *   - gift-card-balance  (variant: "row", 2 fields)
 *   - verify-your-product (variant: "lookup", 1 field + illustration)
 *
 * MERCH COMPONENT — uses --color-merch-* tokens only. NOT Hextech.
 * Presentational: props in, onSubmit callback out. No real network calls.
 * This file is a client component ('use client') because it manages
 * controlled input state. Its showcase MUST NOT use 'use client' — see
 * merch-support-form.showcase.tsx and merch-support-form.demo.tsx.
 *
 * Measured specs from merch.riotgames.com (2026-08-03):
 *   Content wrapper: max-w 1000px, padding 0 32px, centered.
 *   Section h2: 38px/700/uppercase/letter-spacing -0.76px desktop;
 *               28px/700/uppercase/letter-spacing -0.28px mobile.
 *   Input: 52px height (text), 54px height (email), padding 16px all, radius 0.
 *   Label: 16px/400/--color-merch-ink, wraps input (<label> element).
 *   Row form: flex row, gap 24px desktop; flex col, full-width mobile.
 *   Submit button: transparent bg, --color-merch-ink text, uppercase, 16px/600/0.32px,
 *                  no border, no radius; disabled = --color-merch-input-disabled fill.
 *   Lookup form: 2-col grid desktop (illustration | field+button); 1-col mobile.
 */

import { useState, useId } from "react";
import type { MerchSupportFormConfig, MerchSupportFormField } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MerchSupportFormProps {
  /** Section title rendered as <h2> above the form (the page h1 is in MerchSupportHero). */
  title: string;
  /** Form layout config — variant, fields, button label, optional illustration. */
  config: MerchSupportFormConfig;
  /** Called with a Record<fieldId, value> on submit. No real backend call. */
  onSubmit: (values: Record<string, string>) => void;
}

// ---------------------------------------------------------------------------
// Card-of-Authenticity illustration (lookup variant left column)
// Inline SVG mock matching the real Riot card: black card, red header band,
// Riot logo text, serial number, barcode representation.
// SVG ids are generated with useId to avoid collisions when used multiple times.
// ---------------------------------------------------------------------------

function CardOfAuthenticity({ uid }: { uid: string }) {
  const gradId = `${uid}-grad`;
  const clipId = `${uid}-clip`;
  const barcodeId = `${uid}-barcode`;

  return (
    <svg
      viewBox="0 0 280 175"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: "block", width: "100%", maxWidth: "280px" }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: "var(--color-merch-ink)" }} />
          <stop offset="100%" style={{ stopColor: "var(--color-merch-ink-dark)" }} />
        </linearGradient>
        <clipPath id={clipId}>
          <rect width="280" height="175" rx="8" ry="8" />
        </clipPath>
        {/* Barcode pattern — groups of thin/wide vertical bars */}
        <pattern id={barcodeId} x="0" y="0" width="6" height="1" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="1" height="1" fill="var(--color-merch-on-dark)" />
          <rect x="2" y="0" width="2" height="1" fill="var(--color-merch-on-dark)" />
          <rect x="5" y="0" width="1" height="1" fill="var(--color-merch-on-dark)" />
        </pattern>
      </defs>

      {/* Card body */}
      <rect width="280" height="175" rx="8" ry="8" fill={`url(#${gradId})`} />

      {/* Red header band — sampled from real card (Riot merch red) */}
      <rect x="0" y="0" width="280" height="36" rx="0" ry="0" fill="var(--color-merch-red)" clipPath={`url(#${clipId})`} />
      <rect x="0" y="26" width="280" height="10" fill="var(--color-merch-red)" />

      {/* "CARD OF AUTHENTICITY" in header */}
      <text
        x="140"
        y="22"
        textAnchor="middle"
        fontFamily="var(--font-merch)"
        fontWeight="700"
        fontSize="11"
        letterSpacing="1.5"
        fill="var(--color-merch-on-dark)"
        style={{ textTransform: "uppercase" }}
      >
        CARD OF AUTHENTICITY
      </text>

      {/* Riot Games logo text */}
      <text
        x="140"
        y="68"
        textAnchor="middle"
        fontFamily="var(--font-merch)"
        fontWeight="800"
        fontSize="18"
        letterSpacing="2"
        fill="var(--color-merch-on-dark)"
      >
        RIOT GAMES
      </text>

      {/* Divider line */}
      <line x1="24" y1="80" x2="256" y2="80" stroke="var(--color-merch-on-dark)" strokeOpacity="0.25" strokeWidth="1" />

      {/* Serial number label */}
      <text
        x="24"
        y="100"
        fontFamily="var(--font-merch)"
        fontWeight="400"
        fontSize="9"
        letterSpacing="1"
        fill="var(--color-merch-on-dark)"
        fillOpacity="0.6"
      >
        SERIAL NUMBER
      </text>

      {/* Serial number value */}
      <text
        x="24"
        y="116"
        fontFamily="monospace"
        fontWeight="700"
        fontSize="13"
        letterSpacing="2"
        fill="var(--color-merch-on-dark)"
      >
        12345789
      </text>

      {/* Barcode representation */}
      <rect x="24" y="130" width="160" height="28" fill={`url(#${barcodeId})`} />

      {/* Quiet zone lines on barcode edges */}
      <rect x="24" y="130" width="3" height="28" fill="var(--color-merch-on-dark)" />
      <rect x="181" y="130" width="3" height="28" fill="var(--color-merch-on-dark)" />

      {/* "RIOT" faint watermark in bottom right */}
      <text
        x="256"
        y="162"
        textAnchor="end"
        fontFamily="var(--font-merch)"
        fontWeight="900"
        fontSize="28"
        fill="var(--color-merch-on-dark)"
        fillOpacity="0.07"
        letterSpacing="3"
      >
        RIOT
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Single field (label + input) — used in both row and lookup variants
// ---------------------------------------------------------------------------

interface SupportFieldProps {
  field: MerchSupportFormField;
  value: string;
  onChange: (value: string) => void;
}

function SupportField({ field, value, onChange }: SupportFieldProps) {
  /* Email inputs have a visible border; text inputs have a filled-only bg. */
  const hasBorder = field.type === "email";
  /* Email inputs are 54px tall per spec; text inputs are 52px. */
  const inputHeight = field.type === "email" ? 54 : 52;

  return (
    <label
      style={{
        display: "block",
        fontFamily: "var(--font-merch)",
        fontSize: "16px",
        fontWeight: 400,
        color: "var(--color-merch-ink)",
        cursor: "text",
        flex: "0 0 256px",
        minWidth: 0,
      }}
    >
      <span style={{ display: "block", marginBottom: "6px" }}>{field.label}</span>
      <input
        id={field.id}
        name={field.id}
        type={field.type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          display: "block",
          width: "100%",
          height: `${inputHeight}px`,
          padding: "16px",
          fontSize: "16px",
          fontFamily: "var(--font-merch)",
          fontWeight: 400,
          color: "var(--color-merch-ink)",
          backgroundColor: "var(--color-merch-input-bg)",
          border: hasBorder ? "1px solid var(--color-merch-input-border)" : "none",
          borderRadius: 0,
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    </label>
  );
}

// ---------------------------------------------------------------------------
// Submit button — shared between both variants
// ---------------------------------------------------------------------------

interface SubmitButtonProps {
  label: string;
  disabled?: boolean;
  /** Desktop pixel width. On mobile it stretches to 100%. */
  desktopWidth?: number;
  height?: number;
}

function SubmitButton({ label, disabled = false, desktopWidth = 256, height = 50 }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      style={{
        display: "block",
        /* Desktop: fixed width matching a field (256px for row, 240px for lookup).
           Mobile override applied via className below. */
        width: `${desktopWidth}px`,
        height: `${height}px`,
        padding: 0,
        backgroundColor: disabled ? "var(--color-merch-input-disabled)" : "transparent",
        border: "none",
        borderRadius: 0,
        color: "var(--color-merch-ink)",
        fontFamily: "var(--font-merch)",
        fontSize: "16px",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.32px",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      className="merch-support-btn"
    >
      {label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Row variant (order-status / gift-card-balance)
// Fields flex-row on desktop, flex-col (full-width) on mobile.
// ---------------------------------------------------------------------------

interface RowFormProps {
  title: string;
  config: MerchSupportFormConfig;
  values: Record<string, string>;
  onFieldChange: (id: string, value: string) => void;
}

function RowForm({ title, config, values, onFieldChange }: RowFormProps) {
  return (
    <>
      {/* Section h2 — 38px desktop / 28px mobile, measured spec */}
      <h2
        style={{
          margin: "0 0 32px 0",
          fontFamily: "var(--font-merch)",
          color: "var(--color-merch-ink)",
          fontWeight: 700,
          textTransform: "uppercase",
          /* Desktop 38px / -0.76px; mobile 28px / -0.28px via className */
        }}
        className="merch-support-h2"
      >
        {title}
      </h2>

      {/*
        Field row: flex-row gap-24px on desktop; flex-col gap-16px on mobile.
        On mobile, the flex:0 0 256px on labels collapses — we override to
        flex:1 1 auto / width:100% below via CSS cascade through className.
      */}
      <div className="merch-support-row-fields">
        {config.fields.map((field) => (
          <SupportField
            key={field.id}
            field={field}
            value={values[field.id] ?? ""}
            onChange={(v) => onFieldChange(field.id, v)}
          />
        ))}
      </div>

      {/* Button row — below the fields */}
      <div style={{ marginTop: "16px" }}>
        <SubmitButton label={config.submitLabel} desktopWidth={256} />
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Lookup variant (verify-your-product)
// 2-col grid on desktop (illustration | field + button); 1-col on mobile.
// ---------------------------------------------------------------------------

interface LookupFormProps {
  title: string;
  config: MerchSupportFormConfig;
  values: Record<string, string>;
  onFieldChange: (id: string, value: string) => void;
  uid: string;
}

function LookupForm({ title, config, values, onFieldChange, uid }: LookupFormProps) {
  const field = config.fields[0];

  return (
    <>
      <h2
        style={{
          margin: "0 0 32px 0",
          fontFamily: "var(--font-merch)",
          color: "var(--color-merch-ink)",
          fontWeight: 700,
          textTransform: "uppercase",
        }}
        className="merch-support-h2"
      >
        {title}
      </h2>

      {/*
        2-col grid on desktop; 1-col on mobile (illustration hidden on mobile).
        Left col: illustration. Right col: field (393×50) + button (240×50), gap 32px.
      */}
      <div className="merch-support-lookup-grid">
        {/* Left — illustration (hidden on mobile via CSS) */}
        <div className="merch-support-lookup-illustration" aria-hidden="true">
          {config.illustrationSrc ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={config.illustrationSrc}
              alt={config.illustrationAlt ?? ""}
              style={{ display: "block", width: "100%", maxWidth: "280px" }}
            />
          ) : (
            <CardOfAuthenticity uid={uid} />
          )}
        </div>

        {/* Right — field + button stacked, gap 32px */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "32px",
          }}
        >
          {field && (
            <label
              style={{
                display: "block",
                fontFamily: "var(--font-merch)",
                fontSize: "16px",
                fontWeight: 400,
                color: "var(--color-merch-ink)",
                cursor: "text",
              }}
            >
              <span style={{ display: "block", marginBottom: "6px" }}>{field.label}</span>
              <input
                id={field.id}
                name={field.id}
                type={field.type}
                value={values[field.id] ?? ""}
                onChange={(e) => onFieldChange(field.id, e.target.value)}
                style={{
                  display: "block",
                  width: "393px",
                  maxWidth: "100%",
                  height: "50px",
                  padding: "9px 16px",
                  fontSize: "16px",
                  fontFamily: "var(--font-merch)",
                  fontWeight: 400,
                  color: "var(--color-merch-ink)",
                  backgroundColor: "var(--color-merch-input-bg)",
                  border: "1px solid var(--color-merch-input-border)",
                  borderRadius: 0,
                  outline: "none",
                  boxSizing: "border-box",
                }}
                className="merch-support-lookup-input"
              />
            </label>
          )}

          {/* 240px wide desktop / full-width mobile */}
          <div>
            <SubmitButton label={config.submitLabel} desktopWidth={240} height={50} />
          </div>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * MerchSupportForm — renders the correct form widget for a given support-page slug.
 *
 * "row" variant: fields in a flex row (desktop) → flex column (mobile).
 * "lookup" variant: 2-col grid with illustration on desktop → 1-col on mobile.
 *
 * Wrap with MerchHeader + MerchSupportHero + MerchSupportTabStrip + MerchFooter
 * in the page route (same chrome as MerchInfoPage).
 */
export function MerchSupportForm({ title, config, onSubmit }: MerchSupportFormProps) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(config.fields.map((f) => [f.id, ""]))
  );

  /* Stable uid prefix for SVG element ids — avoids collisions on same page. */
  const uid = useId().replace(/:/g, "");

  function handleFieldChange(id: string, value: string) {
    setValues((prev) => ({ ...prev, [id]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit(values);
  }

  return (
    /*
     * Content wrapper: max-w 1000px, padding 0 32px, centered.
     * bg matches the white info-page area.
     */
    <main
      className="w-full flex-1"
      style={{
        backgroundColor: "var(--color-merch-bg)",
        fontFamily: "var(--font-merch)",
      }}
    >
      {/*
        Scoped CSS for responsive layout — inline style blocks are not
        allowed per Next.js 13+ server rendering; instead we use a <style jsx>
        pattern. Since this is a client component we can use a plain <style> tag.
        We keep this minimal and token-safe: only layout/sizing, no raw hex.
      */}
      <style>{`
        /* Section heading: 38px desktop / 28px mobile */
        .merch-support-h2 {
          font-size: 38px;
          letter-spacing: -0.76px;
        }
        @media (max-width: 640px) {
          .merch-support-h2 {
            font-size: 28px;
            letter-spacing: -0.28px;
          }
        }

        /* Row variant field strip */
        .merch-support-row-fields {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          gap: 24px;
        }
        @media (max-width: 640px) {
          .merch-support-row-fields {
            flex-direction: column;
            gap: 16px;
          }
          /* On mobile, labels fill the full wrapper width (326px). */
          .merch-support-row-fields label {
            flex: 1 1 auto !important;
            width: 100%;
          }
          /* Button matches field width on mobile */
          .merch-support-btn {
            width: 100% !important;
          }
        }

        /* Lookup variant 2-col grid */
        .merch-support-lookup-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: start;
        }
        @media (max-width: 640px) {
          .merch-support-lookup-grid {
            grid-template-columns: 1fr;
          }
          /* Hide illustration on mobile */
          .merch-support-lookup-illustration {
            display: none;
          }
          /* Full-width input and button on mobile */
          .merch-support-lookup-input {
            width: 100% !important;
          }
          .merch-support-lookup-grid .merch-support-btn {
            width: 100% !important;
          }
        }
      `}</style>

      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "40px 32px 64px",
        }}
      >
        <form onSubmit={handleSubmit} noValidate>
          {config.variant === "row" ? (
            <RowForm
              title={title}
              config={config}
              values={values}
              onFieldChange={handleFieldChange}
            />
          ) : (
            <LookupForm
              title={title}
              config={config}
              values={values}
              onFieldChange={handleFieldChange}
              uid={uid}
            />
          )}
        </form>
      </div>
    </main>
  );
}
