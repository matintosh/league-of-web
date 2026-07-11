#!/usr/bin/env node
/**
 * loadout-overlap-check.mjs
 *
 * Drives the full champ-select flow to the loadout screen, screenshots it at
 * 1280×720, then measures every zone's bounding rect and checks for unintended
 * overlapping pairs.
 *
 * Usage:
 *   node tools/loadout-overlap-check.mjs [--out <path.png>] [--base-url <url>]
 *
 * Defaults:
 *   --out      /tmp/loadout-screenshot.png
 *   --base-url http://localhost:3000
 *
 * Exit code 0 = no unintended overlaps; 1 = overlaps found (or navigation failed).
 *
 * Navigation flow:
 *   / → PLAY button → Confirm (mode-select) → Top role → Find Match →
 *   wait for Accept (up to 15 s) → click → wait 1.5 s → measure
 *
 * Intentional overlaps (whitelisted — by design):
 *   - carouselSvg ∩ splashSvg: the two SVGs are stacked absolutely in the same
 *     frame container (outer ring on top of splash image), same rect.
 *   - teamRail row divider lines: rows share their bottom/top pixel (divide-y).
 *
 * Re-run after fixes to verify zero unintended intersections.
 */

import { chromium } from "/Users/matintosh/dev/league-of-web/node_modules/playwright/index.mjs";
import { writeFileSync } from "fs";

const args = process.argv.slice(2);
const outArg = args.indexOf("--out");
const baseArg = args.indexOf("--base-url");
const OUT = outArg !== -1 ? args[outArg + 1] : "/tmp/loadout-screenshot.png";
const BASE = baseArg !== -1 ? args[baseArg + 1] : "http://localhost:3000";

// ---------------------------------------------------------------------------
// Rect helpers
// ---------------------------------------------------------------------------
function intersects(r1, r2) {
  return (
    r1.left < r2.right &&
    r1.right > r2.left &&
    r1.top < r2.bottom &&
    r1.bottom > r2.top
  );
}

function intersectionArea(r1, r2) {
  const xOverlap = Math.max(0, Math.min(r1.right, r2.right) - Math.max(r1.left, r2.left));
  const yOverlap = Math.max(0, Math.min(r1.bottom, r2.bottom) - Math.max(r1.top, r2.top));
  return xOverlap * yOverlap;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 720 });

console.log(`Navigating to ${BASE} …`);
await page.goto(BASE, { waitUntil: "networkidle" });

// ── Navigate to loadout ──

// 1. Click PLAY
console.log("Step 1: Click Play …");
await page.locator("button", { hasText: "Play" }).first().click();
await page.waitForTimeout(800);

// 2. Mode select → Confirm
console.log("Step 2: Confirm mode …");
try {
  await page.locator("button:has-text('Confirm')").first().waitFor({ state: "visible", timeout: 5000 });
  await page.locator("button:has-text('Confirm')").first().click();
  await page.waitForTimeout(800);
} catch (e) {
  console.error("Mode-select Confirm not found:", e.message);
  await browser.close();
  process.exit(1);
}

// 3. Select a primary role (Top) and Find Match
console.log("Step 3: Select Top role + Find Match …");
await page.locator("button[aria-label='Top']").first().click();
await page.waitForTimeout(300);
await page.locator("button:has-text('Find Match')").click();
await page.waitForTimeout(500);

// 4. Wait for Accept (match found auto-triggers after 5–10 s)
console.log("Step 4: Waiting for match found (up to 15 s) …");
try {
  await page.locator("button:has-text('Accept')").first().waitFor({ state: "visible", timeout: 15000 });
  await page.locator("button:has-text('Accept')").first().click();
} catch (e) {
  console.error("Accept button never appeared:", e.message);
  await browser.close();
  process.exit(1);
}
await page.waitForTimeout(1500);

// Verify we're on the loadout screen by checking for the progressbar
const onLoadout = await page.locator("[role='progressbar']").count();
if (onLoadout === 0) {
  console.error("ERROR: Could not reach loadout screen (no progressbar found).");
  await browser.close();
  process.exit(1);
}
console.log("✓ Loadout screen reached.");

// Screenshot
const screenshotBuffer = await page.screenshot({ fullPage: false });
writeFileSync(OUT, screenshotBuffer);
console.log(`Screenshot saved → ${OUT}`);

// ---------------------------------------------------------------------------
// Measure zones using actual DOM structure
// ---------------------------------------------------------------------------
console.log("\n=== Zone bounding rects ===");

const zones = await page.evaluate(() => {
  function r(el) {
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return {
      top: Math.round(rect.top), bottom: Math.round(rect.bottom),
      left: Math.round(rect.left), right: Math.round(rect.right),
      w: Math.round(rect.width), h: Math.round(rect.height),
    };
  }

  const mainEl = document.querySelector("main");
  const svgs = mainEl ? Array.from(mainEl.querySelectorAll("svg")) : [];

  return {
    // CountdownHeader progress bar
    progressbar: r(document.querySelector("[role='progressbar']")),
    // Team rail aside
    teamRail: r(document.querySelector("aside[aria-label='Team']")),
    // main center area
    mainArea: r(mainEl),
    // First two SVGs in main are the carousel ring (outer ring + splash image)
    carouselRingSvg: r(svgs[0] || null),
    carouselSplashSvg: r(svgs[1] || null),
    // Bottom strip (fixed-height row with border-t)
    bottomStrip: r(document.querySelector(".relative.flex.shrink-0.items-stretch.border-t")),
    // Thumb buttons (90×50 each)
    thumbs: Array.from(document.querySelectorAll("button[style*='width: 90px']")).map(r),
    // Pagination dots (role=tab)
    dots: Array.from(document.querySelectorAll("button[role='tab']")).map(r),
    // Chevron buttons
    chevPrev: r(document.querySelector("button[aria-label='Previous skin']")),
    chevNext: r(document.querySelector("button[aria-label='Next skin']")),
    // Team rows
    teamRows: Array.from(document.querySelectorAll("aside[aria-label='Team'] > *")).map(r),
    // Chat panel wrapper (direct child of bottom strip, 220px wide)
    chatPanelWrapper: (() => {
      const strip = document.querySelector(".relative.flex.shrink-0.items-stretch.border-t");
      return strip ? r(strip.children[0]) : null;
    })(),
  };
});

// Print all zones
for (const [name, rect] of Object.entries(zones)) {
  if (!rect || Array.isArray(rect)) continue;
  console.log(
    `  ${name}: top=${rect.top} bottom=${rect.bottom} left=${rect.left} right=${rect.right} (${rect.w}×${rect.h})`
  );
}

// ---------------------------------------------------------------------------
// Intersection checks
// ---------------------------------------------------------------------------
console.log("\n=== Pairwise intersection checks ===");

// Intentional / containment relationships (not defects):
//   carouselRingSvg|carouselSplashSvg — same SVG frame, stacked absolutely
//   mainArea|carouselRingSvg          — carousel is a child of main (containment)
//   mainArea|progressbar              — progressbar is above main but may share border
//   bottomStrip|chatPanelWrapper      — chatPanel is a child of bottomStrip (containment)
const WHITELIST = new Set([
  "carouselRingSvg|carouselSplashSvg",
  "carouselRingSvg|mainArea",
  "mainArea|progressbar",
  "bottomStrip|chatPanelWrapper",
]);
function wlKey(a, b) { return [a, b].sort().join("|"); }

// Named zones to check pairwise — only check non-containment pairs
const CHECK_ZONES = {
  progressbar: zones.progressbar,
  teamRail: zones.teamRail,
  mainArea: zones.mainArea,
  carouselRingSvg: zones.carouselRingSvg,
  bottomStrip: zones.bottomStrip,
  chatPanelWrapper: zones.chatPanelWrapper,
};

const zoneNames = Object.keys(CHECK_ZONES);
let unintendedOverlaps = 0;

for (let i = 0; i < zoneNames.length; i++) {
  for (let j = i + 1; j < zoneNames.length; j++) {
    const na = zoneNames[i];
    const nb = zoneNames[j];
    const a = CHECK_ZONES[na];
    const b = CHECK_ZONES[nb];
    if (!a || !b) continue;
    if (intersects(a, b)) {
      const area = intersectionArea(a, b);
      if (area <= 1) continue; // ignore single-pixel border touches
      const key = wlKey(na, nb);
      if (WHITELIST.has(key)) {
        console.log(`  ○ ${na} ∩ ${nb}: ${area}px² (whitelisted)`);
      } else {
        console.log(`  ✗ ${na} ∩ ${nb}: ${area}px² ← UNINTENDED`);
        unintendedOverlaps++;
      }
    }
  }
}
if (unintendedOverlaps === 0) console.log("  ✓ no unintended zone overlaps");

// Check carousel SVG vs bottom strip
const carSvg = zones.carouselRingSvg;
const botStrip = zones.bottomStrip;
if (carSvg && botStrip) {
  if (intersects(carSvg, botStrip)) {
    const area = intersectionArea(carSvg, botStrip);
    console.log(`  ✗ carousel ring ∩ bottom strip: ${area}px² ← UNINTENDED`);
    unintendedOverlaps++;
  } else {
    console.log(`  ✓ carousel ring clears bottom strip by ${botStrip.top - carSvg.bottom}px`);
  }
}

// Check thumbs vs main area (they should be in bottom strip, not main)
const thumbsInMain = (zones.thumbs || []).filter(t => t && t.top < (botStrip?.top ?? 720));
if (thumbsInMain.length > 0) {
  console.log(`  ✗ ${thumbsInMain.length} thumb(s) above bottom strip — overlapping main area`);
  unintendedOverlaps++;
} else {
  console.log(`  ✓ all ${(zones.thumbs || []).length} thumb(s) inside bottom strip`);
}

// Team row pairwise overlaps
console.log("\n=== Team row overlaps ===");
const rows = zones.teamRows || [];
let rowOverlaps = 0;
for (let i = 0; i < rows.length - 1; i++) {
  const a = rows[i];
  const b = rows[i + 1];
  if (a && b) {
    // rows share their border pixel (divide-y), so allow 1px overlap
    const area = intersectionArea(a, b);
    if (area > rows[0]?.w) { // area > row width means more than a border line
      console.log(`  ✗ row[${i}] ∩ row[${i+1}]: ${area}px² ← significant overlap`);
      rowOverlaps++;
    } else {
      console.log(`  ✓ row[${i}]→row[${i+1}]: border-only or clear (gap=${b.top - a.bottom}px)`);
    }
  }
}
if (rows.length === 0) console.log("  (no rows found)");

// ---------------------------------------------------------------------------
// Spacing measurements
// ---------------------------------------------------------------------------
console.log("\n=== Spacing measurements ===");
const pr = zones.progressbar;
const tr = zones.teamRail;
const cr = zones.carouselRingSvg;
const bs = zones.bottomStrip;
const ma = zones.mainArea;

if (pr && tr) console.log(`  progressbar bottom → teamRail top: ${tr.top - pr.bottom}px`);
if (pr && cr) console.log(`  progressbar bottom → carouselSVG top: ${cr.top - pr.bottom}px`);
if (cr && bs) console.log(`  carouselSVG bottom → bottomStrip top: ${bs.top - cr.bottom}px`);
if (tr && cr) console.log(`  teamRail right → carouselSVG left: ${cr.left - tr.right}px`);
if (ma) console.log(`  mainArea height: ${ma.h}px`);
if (cr) console.log(`  carouselSVG size: ${cr.w}×${cr.h}px`);
if (bs) console.log(`  bottomStrip height: ${bs.h}px`);

// ---------------------------------------------------------------------------
// Viewport overflow
// ---------------------------------------------------------------------------
console.log("\n=== Viewport overflow ===");
const { scrollH, scrollW } = await page.evaluate(() => ({
  scrollH: document.body.scrollHeight,
  scrollW: document.body.scrollWidth,
}));
console.log(`  body: ${scrollW}×${scrollH} (target 1280×720)`);
const overflow = scrollH > 720 || scrollW > 1280;
if (overflow) console.log(`  ✗ OVERFLOW`);
else console.log(`  ✓ no overflow`);

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log("\n=== Summary ===");
const totalIssues = unintendedOverlaps + rowOverlaps + (overflow ? 1 : 0);
if (totalIssues === 0) {
  console.log("✓ PASS — zero unintended overlaps, no overflow");
} else {
  console.log(`✗ FAIL — ${totalIssues} issue(s) found`);
}

await browser.close();
process.exit(totalIssues > 0 ? 1 : 0);
