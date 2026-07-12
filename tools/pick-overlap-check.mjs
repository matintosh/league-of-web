#!/usr/bin/env node
/**
 * pick-overlap-check.mjs
 *
 * Drives the full champ-select flow to the pick screen, screenshots it at
 * 1280×720, then measures every zone's bounding rect and checks for unintended
 * overlapping pairs.
 *
 * Usage:
 *   node tools/pick-overlap-check.mjs [--out <path.png>] [--base-url <url>]
 *
 * Defaults:
 *   --out      /tmp/pick-screenshot.png
 *   --base-url http://localhost:3000
 *
 * Exit code 0 = no unintended overlaps; 1 = overlaps found (or navigation failed).
 *
 * Navigation flow:
 *   / → PLAY button → Confirm (mode-select) → Top role → Find Match →
 *   wait for Accept (up to 15 s) → click → wait 1.5 s → measure pick screen
 *
 * Intentional overlaps (whitelisted — by design):
 *   - progressbar/mainArea: progressbar is above main (border-touch parent)
 *   - bottomStrip/chatPanelWrapper: chatPanel is a child of bottomStrip
 *   - teamRail/selfChip: self countdown chip overlaps the self row region (designed)
 */

import { chromium } from "/Users/matintosh/dev/league-of-web/node_modules/playwright/index.mjs";
import { writeFileSync } from "fs";

const args = process.argv.slice(2);
const outArg = args.indexOf("--out");
const baseArg = args.indexOf("--base-url");
const OUT = outArg !== -1 ? args[outArg + 1] : "/tmp/pick-screenshot.png";
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

// ── Navigate to pick screen ──

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

// 4. Wait for Accept
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

// Verify we're on the pick screen by checking for "Choose Your Champion!"
const onPick = await page.getByText("Choose Your Champion!", { exact: false }).count();
if (onPick === 0) {
  console.error("ERROR: Could not reach pick screen ('Choose Your Champion!' not found).");
  await browser.close();
  process.exit(1);
}
console.log("✓ Pick screen reached.");

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

  return {
    // CountdownHeader progress bar
    progressbar: r(document.querySelector("[role='progressbar']")),
    // Team rail aside
    teamRail: r(document.querySelector("aside[aria-label='Team']")),
    // main center area
    mainArea: r(mainEl),
    // Champion grid (role=listbox)
    championGrid: r(document.querySelector("[role='listbox']")),
    // LOCK IN button
    lockInBtn: r(document.querySelector("button[aria-disabled='true']") ?? document.querySelector("button[class*='blue-2']")),
    // Bottom strip (fixed-height row with border-t)
    bottomStrip: r(document.querySelector(".relative.flex.shrink-0.items-stretch.border-t")),
    // Chat panel wrapper (direct child of bottom strip, 220px wide)
    chatPanelWrapper: (() => {
      const strip = document.querySelector(".relative.flex.shrink-0.items-stretch.border-t");
      return strip ? r(strip.children[0]) : null;
    })(),
    // Filter bar (role=radiogroup)
    filterBar: r(document.querySelector("[role='radiogroup']")),
    // Team rows
    teamRows: Array.from(document.querySelectorAll("aside[aria-label='Team'] > *")).map(r),
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
//
// All children of mainArea will overlap with mainArea's rect by design (containment).
// The pairwise check is only meaningful for SIBLING regions at the same layout level.
// Children of mainArea: championGrid, filterBar, lockInBtn.
//
// getBoundingClientRect() on a scrollable element returns its full scroll-height rect,
// which may extend beyond the visual clip set by an ancestor's overflow-hidden.
// The grid (role=listbox) scrolls inside a flex-1/min-h-0 container — its content
// rect extends to 716px even though it's visually clipped at ~608px.
// This causes championGrid ∩ bottomStrip to appear as an overlap in the checker,
// but it is NOT a visual defect — the grid is properly clipped.
//
// The true overlap check for these zones is: does mainArea overlap bottomStrip?
// (mainArea bottom=608, bottomStrip top=608 — border-only, not an overlap)
// NOTE: wlKey sorts pair names alphabetically — keys must use sorted order.
const WHITELIST = new Set([
  // Parent–child containment (mainArea contains all three)
  // wlKey sorts: "championGrid|mainArea", "filterBar|mainArea", "lockInBtn|mainArea"
  "championGrid|mainArea",
  "filterBar|mainArea",
  "lockInBtn|mainArea",
  // Grid scroll-content height extends past visual clip into bottomStrip region
  // wlKey sorts: "bottomStrip|championGrid"
  "bottomStrip|championGrid",
  // lockInBtn is below grid in same flex-col scroll context
  // wlKey sorts: "championGrid|lockInBtn"
  "championGrid|lockInBtn",
  // chatPanelWrapper is a child of bottomStrip
  // wlKey sorts: "bottomStrip|chatPanelWrapper"
  "bottomStrip|chatPanelWrapper",
]);
function wlKey(a, b) { return [a, b].sort().join("|"); }

const CHECK_ZONES = {
  progressbar: zones.progressbar,
  teamRail: zones.teamRail,
  mainArea: zones.mainArea,
  championGrid: zones.championGrid,
  filterBar: zones.filterBar,
  lockInBtn: zones.lockInBtn,
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

// Check champion grid vs bottom strip.
// Note: the grid's getBoundingClientRect includes scrollable content height that
// extends beyond its visual clip (set by overflow-y-auto container and overflow-hidden
// on the main parent). We check the grid CONTAINER (mainArea) vs bottom strip instead.
const grid = zones.championGrid;
const botStrip = zones.bottomStrip;
const mainArea = zones.mainArea;
if (mainArea && botStrip) {
  if (intersects(mainArea, botStrip)) {
    const area = intersectionArea(mainArea, botStrip);
    if (area > 1) {
      console.log(`  ✗ mainArea ∩ bottom strip: ${area}px² ← UNINTENDED (main area overflows into bottom strip)`);
      unintendedOverlaps++;
    }
  } else {
    console.log(`  ✓ mainArea clears bottom strip by ${botStrip.top - mainArea.bottom}px`);
  }
} else if (grid && botStrip && !intersects(grid, botStrip)) {
  console.log(`  ✓ champion grid clears bottom strip by ${botStrip.top - grid.bottom}px`);
}

// Check teamRail vs mainArea (side by side, should not overlap)
const tr = zones.teamRail;
const ma = zones.mainArea;
if (tr && ma) {
  // TeamRail is a sibling of main — they should share the vertical space but not overlap
  const area = intersectionArea(tr, ma);
  if (area > 50) {
    console.log(`  ✗ teamRail ∩ mainArea: ${area}px² ← UNINTENDED`);
    unintendedOverlaps++;
  } else {
    console.log(`  ✓ teamRail/mainArea: side-by-side (overlap ${area}px² border-only)`);
  }
}

// Team row pairwise overlaps
console.log("\n=== Team row overlaps ===");
const rows = zones.teamRows || [];
let rowOverlaps = 0;
for (let i = 0; i < rows.length - 1; i++) {
  const a = rows[i];
  const b = rows[i + 1];
  if (a && b) {
    const area = intersectionArea(a, b);
    if (area > (rows[0]?.w ?? 220)) {
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
const cr = zones.championGrid;
const bs = zones.bottomStrip;

if (pr && tr) console.log(`  progressbar bottom → teamRail top: ${tr.top - pr.bottom}px`);
if (pr && cr) console.log(`  progressbar bottom → championGrid top: ${cr.top - pr.bottom}px`);
if (cr && bs) console.log(`  championGrid bottom → bottomStrip top: ${bs.top - cr.bottom}px`);
if (tr && cr) console.log(`  teamRail right → championGrid left: ${cr.left - tr.right}px`);
if (ma) console.log(`  mainArea height: ${ma.h}px`);
if (cr) console.log(`  championGrid size: ${cr.w}×${cr.h}px`);
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
if (overflow) {
  console.log(`  ✗ OVERFLOW — body ${scrollW}×${scrollH}`);
} else {
  console.log(`  ✓ no overflow`);
}

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
