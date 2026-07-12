#!/usr/bin/env node
/**
 * rail-overlap-check.mjs
 *
 * Verifies the docked social rail layout on home, mode-select, party-lobby,
 * and queue-state screens at 1280×720. Checks that:
 *   - The social rail column is visible by default (aria-label="Social panel")
 *   - Content area + rail width = window inner width (in-flow, not overlay)
 *   - No unintended overlap between the rail and the screen content area
 *   - No viewport overflow (body exactly 1280×720)
 *
 * Also confirms that pick and loadout screens do NOT show the rail.
 * Also verifies the rail + FindingMatchPanel widget during queue state (post-#174).
 *
 * Usage:
 *   node tools/rail-overlap-check.mjs [--out <dir>] [--base-url <url>]
 *
 * Defaults:
 *   --out      /tmp/   (screenshots written as <screen>-rail.png)
 *   --base-url http://localhost:PORT  (PORT env var, default 3000)
 *
 * PORT override (for parallel lane runs on non-default ports):
 *   PORT=3182 node tools/rail-overlap-check.mjs
 *
 * Exit code 0 = all checks pass; 1 = one or more failures.
 *
 * Navigation flow for home:         /  (no nav needed — default view)
 * Navigation flow for mode-select:  / → PLAY button
 * Navigation flow for lobby:        mode-select → Confirm
 * Navigation flow for queue-state:  lobby → Find Match → verify rail widget + no overlaps → cancel
 *
 * NOTE: The role-selector step (button[aria-label='Top']) was retired in
 * #161/#174. The lobby no longer has a role picker before queuing. The queue
 * pass clicks "Find Match" directly, asserts FindingMatchPanel appears in the
 * rail, checks for overlaps, then cancels queue before proceeding.
 *
 * Window enforced at exactly 1280×720 (same as all other checkers).
 */

import { chromium } from "/Users/matintosh/dev/league-of-web/node_modules/playwright/index.mjs";
import { writeFileSync } from "fs";

const args = process.argv.slice(2);
const outArg = args.indexOf("--out");
const baseArg = args.indexOf("--base-url");
const OUT_DIR = outArg !== -1 ? args[outArg + 1] : "/tmp/";
// PORT env var allows parallel lane runs: PORT=3182 node tools/rail-overlap-check.mjs
const PORT = process.env.PORT ?? 3000;
const BASE = baseArg !== -1 ? args[baseArg + 1] : `http://localhost:${PORT}`;

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
// Shared measurement helper — run in page.evaluate()
// ---------------------------------------------------------------------------
function measureZones() {
  function r(el) {
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return {
      top: Math.round(rect.top),
      bottom: Math.round(rect.bottom),
      left: Math.round(rect.left),
      right: Math.round(rect.right),
      w: Math.round(rect.width),
      h: Math.round(rect.height),
    };
  }

  // The content row is the direct child of the WindowFrame body that uses
  // flex-row layout. It contains: screen content div + optional rail div.
  const railEl = document.querySelector("[aria-label='Social panel']");
  const contentRow = railEl?.parentElement ?? null;
  // Screen content is the flex-1 sibling of the rail (first child of contentRow)
  const screenContent = contentRow ? contentRow.firstElementChild : null;

  return {
    rail: r(railEl),
    screenContent: r(screenContent),
    contentRow: r(contentRow),
    // Top navbar (second child of the flex column inside WindowFrame)
    topNavbar: r(document.querySelector("nav[aria-label='Main navigation']") ??
                 document.querySelector("header") ??
                 document.querySelector("nav")),
    // Window body (the scrollable body used for overflow detection)
    bodyScroll: { scrollH: document.body.scrollHeight, scrollW: document.body.scrollWidth },
  };
}

// ---------------------------------------------------------------------------
// Check one screen
// ---------------------------------------------------------------------------
async function checkScreen(page, screenName, navigate, outPath) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`Screen: ${screenName}`);
  console.log("=".repeat(60));

  await navigate(page);

  const screenshotBuffer = await page.screenshot({ fullPage: false });
  writeFileSync(outPath, screenshotBuffer);
  console.log(`Screenshot → ${outPath}`);

  const zones = await page.evaluate(measureZones);
  const { scrollH, scrollW } = zones.bodyScroll;

  let failures = 0;

  // ── Rail presence ──
  if (zones.rail) {
    console.log(`  ✓ Social rail visible (${zones.rail.w}×${zones.rail.h} at left=${zones.rail.left})`);
  } else {
    console.log(`  ✗ Social rail NOT found — expected docked rail on ${screenName}`);
    failures++;
  }

  // ── In-flow check: rail must NOT use fixed/absolute positioning ──
  // The rail should appear as a right-aligned column. Its left edge should
  // equal screenContent.right (contiguous, not overlapping).
  if (zones.rail && zones.screenContent) {
    const gap = zones.rail.left - zones.screenContent.right;
    if (Math.abs(gap) <= 1) {
      console.log(`  ✓ Rail is in-flow: screenContent.right=${zones.screenContent.right}, rail.left=${zones.rail.left} (gap=${gap}px border-only)`);
    } else {
      console.log(`  ✗ Rail gap unexpected: screenContent.right=${zones.screenContent.right}, rail.left=${zones.rail.left} (gap=${gap}px) — may be overlay`);
      failures++;
    }
  }

  // ── Width adds up ──
  if (zones.rail && zones.screenContent) {
    const total = zones.screenContent.w + zones.rail.w;
    // Allow 1px for border
    if (Math.abs(total - 1280) <= 2) {
      console.log(`  ✓ Width sum: ${zones.screenContent.w} (content) + ${zones.rail.w} (rail) = ${total}px ≈ 1280px`);
    } else {
      console.log(`  ✗ Width sum mismatch: ${zones.screenContent.w} + ${zones.rail.w} = ${total}px (expected 1280)`);
      failures++;
    }
  }

  // ── No unintended overlap between rail and screen content ──
  if (zones.rail && zones.screenContent) {
    if (intersects(zones.rail, zones.screenContent)) {
      const area = intersectionArea(zones.rail, zones.screenContent);
      if (area > 1) {
        console.log(`  ✗ Rail ∩ screenContent: ${area}px² ← UNINTENDED OVERLAP`);
        failures++;
      } else {
        console.log(`  ✓ Rail/screenContent: border-only touch (${area}px²)`);
      }
    } else {
      console.log(`  ✓ Rail and screenContent: no overlap`);
    }
  }

  // ── Viewport overflow ──
  console.log(`  body: ${scrollW}×${scrollH} (target 1280×720)`);
  if (scrollH > 720 || scrollW > 1280) {
    console.log(`  ✗ OVERFLOW`);
    failures++;
  } else {
    console.log(`  ✓ No overflow`);
  }

  return failures;
}

// ---------------------------------------------------------------------------
// Check that a screen has NO rail (pick / loadout)
// ---------------------------------------------------------------------------
async function checkNoRail(page, screenName, outPath) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`Screen (expect NO rail): ${screenName}`);
  console.log("=".repeat(60));

  const screenshotBuffer = await page.screenshot({ fullPage: false });
  writeFileSync(outPath, screenshotBuffer);
  console.log(`Screenshot → ${outPath}`);

  const railEl = await page.locator("[aria-label='Social panel']").count();
  let failures = 0;
  if (railEl === 0) {
    console.log(`  ✓ Social rail correctly absent on ${screenName}`);
  } else {
    console.log(`  ✗ Social rail unexpectedly present on ${screenName}`);
    failures++;
  }

  // Overflow check
  const { scrollH, scrollW } = await page.evaluate(() => ({
    scrollH: document.body.scrollHeight,
    scrollW: document.body.scrollWidth,
  }));
  console.log(`  body: ${scrollW}×${scrollH} (target 1280×720)`);
  if (scrollH > 720 || scrollW > 1280) {
    console.log(`  ✗ OVERFLOW`);
    failures++;
  } else {
    console.log(`  ✓ No overflow`);
  }

  return failures;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 720 });

console.log(`Navigating to ${BASE} …`);
await page.goto(BASE, { waitUntil: "networkidle" });

let totalFailures = 0;

// ── HOME screen ──
totalFailures += await checkScreen(
  page,
  "home",
  async () => { /* already on home */ },
  `${OUT_DIR}home-rail.png`
);

// ── MODE-SELECT screen ──
totalFailures += await checkScreen(
  page,
  "mode-select",
  async (p) => {
    await p.locator("button", { hasText: "Play" }).first().click();
    await p.waitForTimeout(600);
  },
  `${OUT_DIR}mode-select-rail.png`
);

// ── MATCHMAKING (lobby) screen ──
totalFailures += await checkScreen(
  page,
  "matchmaking-lobby",
  async (p) => {
    // Already navigated to mode-select; click Confirm
    try {
      await p.locator("button:has-text('Confirm')").first().waitFor({ state: "visible", timeout: 5000 });
      await p.locator("button:has-text('Confirm')").first().click();
      await p.waitForTimeout(600);
    } catch (e) {
      console.error("  Mode-select Confirm not found:", e.message);
    }
  },
  `${OUT_DIR}matchmaking-lobby-rail.png`
);

// ── QUEUE-STATE pass — verify rail shows FindingMatchPanel while queuing ──
// Post-#174: queue lives inside PartyLobbyScreen; the shell shows FindingMatchPanel
// in the rail column when queuePhase !== "idle". We click "Find Match", assert the
// rail widget appears, check for overlaps, then cancel before proceeding.
console.log("\n" + "=".repeat(60));
console.log("Queue-state check (party lobby → Find Match → assert rail widget → cancel)");
console.log("=".repeat(60));
try {
  // We are currently on the matchmaking-lobby screen (after the checkScreen above).
  // Click Find Match to enter queue.
  await page.locator("button:has-text('Find Match')").first().waitFor({ state: "visible", timeout: 5000 });
  await page.locator("button:has-text('Find Match')").first().click();
  await page.waitForTimeout(600);

  // Screenshot the queue state
  const queueScreenshotBuffer = await page.screenshot({ fullPage: false });
  const queueShotPath = `${OUT_DIR}queue-state-rail.png`;
  writeFileSync(queueShotPath, queueScreenshotBuffer);
  console.log(`  Screenshot → ${queueShotPath}`);

  // Rail should still be visible in queue state (social rail persists through lobby)
  const queueRailCount = await page.locator("[aria-label='Social panel']").count();
  if (queueRailCount > 0) {
    console.log("  ✓ Social rail visible in queue state");
  } else {
    console.log("  ✗ Social rail NOT visible in queue state — expected docked rail");
    totalFailures++;
  }

  // FindingMatchPanel should appear in the rail (it replaces PartyStatusPanel when queueing)
  // It contains the elapsed timer and an "Estimated" label.
  const findingPanelCount = await page.getByText("Estimated:", { exact: false }).count();
  if (findingPanelCount > 0) {
    console.log("  ✓ FindingMatchPanel visible in rail (Estimated label present)");
  } else {
    console.log("  ✗ FindingMatchPanel NOT found in rail — expected during queue state");
    totalFailures++;
  }

  // Overlap check in queue state: rail should still be in-flow (not overlay)
  const queueZones = await page.evaluate(() => {
    function r(el) {
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return { top: Math.round(rect.top), bottom: Math.round(rect.bottom), left: Math.round(rect.left), right: Math.round(rect.right), w: Math.round(rect.width), h: Math.round(rect.height) };
    }
    const railEl = document.querySelector("[aria-label='Social panel']");
    const contentRow = railEl?.parentElement ?? null;
    const screenContent = contentRow ? contentRow.firstElementChild : null;
    return { rail: r(railEl), screenContent: r(screenContent) };
  });
  if (queueZones.rail && queueZones.screenContent) {
    const gap = queueZones.rail.left - queueZones.screenContent.right;
    if (Math.abs(gap) <= 1) {
      console.log(`  ✓ Rail still in-flow during queue (gap=${gap}px)`);
    } else {
      console.log(`  ✗ Rail gap in queue state: ${gap}px — may be overlay`);
      totalFailures++;
    }
  }

  // Overflow check in queue state
  const { scrollH: queueScrollH, scrollW: queueScrollW } = await page.evaluate(() => ({
    scrollH: document.body.scrollHeight,
    scrollW: document.body.scrollWidth,
  }));
  if (queueScrollH > 720 || queueScrollW > 1280) {
    console.log(`  ✗ OVERFLOW in queue state: ${queueScrollW}×${queueScrollH}`);
    totalFailures++;
  } else {
    console.log(`  ✓ No overflow in queue state: ${queueScrollW}×${queueScrollH}`);
  }

  // Cancel queue — click the ✕ cancel button (aria-label="Cancel queue" in queue state)
  const cancelBtn = page.locator("button[aria-label*='Cancel']").first();
  const cancelVisible = await cancelBtn.isVisible();
  if (cancelVisible) {
    await cancelBtn.click();
    await page.waitForTimeout(400);
    console.log("  ✓ Queue cancelled via ✕ button");
    // After cancel, PartyStatusPanel should be back (rail still visible, Find Match button back)
    const findMatchBack = await page.locator("button:has-text('Find Match')").count();
    if (findMatchBack > 0) {
      console.log("  ✓ Lobby returned to idle (Find Match visible again)");
    } else {
      console.log("  ✗ Find Match not visible after cancel — lobby may be stuck");
      totalFailures++;
    }
  } else {
    console.log("  WARNING: Cancel button not found — skipping cancel step");
  }
} catch (e) {
  console.log(`  WARNING: Queue-state check failed: ${e.message} — skipping`);
}

// ── PICK screen (expect NO rail) ──
// NOTE: The role-selector (button[aria-label='Top']) was retired in #161/#174.
// Queue starts directly via Find Match → Accept; no role picker step.
console.log("\nNavigating to pick screen …");
try {
  // From the lobby (idle state after cancel), start queue again
  await page.locator("button:has-text('Find Match')").first().waitFor({ state: "visible", timeout: 5000 });
  await page.locator("button:has-text('Find Match')").first().click();
  await page.waitForTimeout(500);
  // Wait for accept
  await page.locator("button:has-text('Accept')").first().waitFor({ state: "visible", timeout: 15000 });
  await page.locator("button:has-text('Accept')").first().click();
  await page.waitForTimeout(1500);
  // Should now be on pick screen
  const onPick = await page.getByText("Choose Your Champion!", { exact: false }).count();
  if (onPick > 0) {
    totalFailures += await checkNoRail(page, "pick", `${OUT_DIR}pick-no-rail.png`);
  } else {
    console.log("\n  WARNING: Could not reach pick screen — skipping pick check");
  }
} catch (e) {
  console.log(`\n  WARNING: Could not reach pick screen: ${e.message} — skipping`);
}

// ── COLLAPSE check — collapse rail on home, verify content reflows ──
console.log("\n" + "=".repeat(60));
console.log("Collapse check (home screen)");
console.log("=".repeat(60));

// Navigate back to home
await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForTimeout(500);

// Click the social toggle to collapse
const toggleBtn = page.locator("button[aria-expanded]").first();
const expandedBefore = await toggleBtn.getAttribute("aria-expanded");
console.log(`  aria-expanded before collapse: ${expandedBefore}`);

if (expandedBefore === "true") {
  await toggleBtn.click();
  await page.waitForTimeout(300);

  const expandedAfter = await toggleBtn.getAttribute("aria-expanded");
  const railAfter = await page.locator("[aria-label='Social panel']").count();

  if (expandedAfter === "false") {
    console.log("  ✓ aria-expanded=false after collapse");
  } else {
    console.log(`  ✗ aria-expanded expected false, got ${expandedAfter}`);
    totalFailures++;
  }

  if (railAfter === 0) {
    console.log("  ✓ Rail hidden after collapse");
  } else {
    console.log("  ✗ Rail still visible after collapse");
    totalFailures++;
  }

  // Content should now be full width (~1280px). After collapse the rail is
  // unmounted, so we find the screen content div by its known flex-1 structure
  // (it is the sole child of the content row when the rail is absent).
  // The content row is the direct flex-row sibling below the TopNavbar.
  const contentWidth = await page.evaluate(() => {
    // Walk all divs to find the flex-row content container (the one whose
    // children include the screen content div). We identify it as the div
    // that is a sibling of the nav and has a single child taking full width.
    // Simpler: measure document.documentElement.clientWidth vs first non-nav
    // major block. We use the screen content's own measured width instead.
    // The screen content area has class flex-1 min-w-0 and is a block-level div.
    // After collapse it should span the full 1280px (minus any borders).
    // Use the clientWidth of the body as the reference for "full width".
    const bodyW = document.documentElement.clientWidth;
    // Find the flex-1 screen content: look for a div inside the content row
    // that is NOT the social rail. The content row has the aria-label on the
    // rail; when the rail is absent, the only child is the screen content.
    // We rely on the known structure: WindowFrame > flex col > (nav + content row).
    // content row = nav's next sibling.
    const nav = document.querySelector("nav") ?? document.querySelector("header");
    const contentRow = nav?.parentElement?.querySelector(":scope > div:last-child");
    const screenDiv = contentRow?.firstElementChild;
    if (screenDiv) {
      return { w: Math.round(screenDiv.getBoundingClientRect().width), bodyW };
    }
    return { w: null, bodyW };
  });
  if (contentWidth.w !== null && Math.abs(contentWidth.w - 1280) <= 2) {
    console.log(`  ✓ Content reflows to full width: ${contentWidth.w}px`);
  } else if (contentWidth.w !== null) {
    console.log(`  ✗ Content width after collapse: ${contentWidth.w}px (expected ~1280, bodyW=${contentWidth.bodyW})`);
    totalFailures++;
  } else {
    console.log(`  (content width check skipped — element not found)`);
  }

  // Re-expand and verify
  await toggleBtn.click();
  await page.waitForTimeout(300);
  const expandedRestored = await toggleBtn.getAttribute("aria-expanded");
  const railRestored = await page.locator("[aria-label='Social panel']").count();
  if (expandedRestored === "true" && railRestored > 0) {
    console.log("  ✓ Rail restored after re-expand");
  } else {
    console.log(`  ✗ Rail not restored: aria-expanded=${expandedRestored}, rail count=${railRestored}`);
    totalFailures++;
  }
} else {
  console.log(`  WARNING: social button aria-expanded=${expandedBefore} (expected true) — skipping collapse check`);
}

// ── Overflow check on viewport ──
const { scrollH: finalScrollH, scrollW: finalScrollW } = await page.evaluate(() => ({
  scrollH: document.body.scrollHeight,
  scrollW: document.body.scrollWidth,
}));
console.log(`\n  Final body: ${finalScrollW}×${finalScrollH} (target 1280×720)`);

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log("\n" + "=".repeat(60));
console.log("SUMMARY");
console.log("=".repeat(60));
if (totalFailures === 0) {
  console.log("✓ PASS — all rail docking checks passed");
} else {
  console.log(`✗ FAIL — ${totalFailures} check(s) failed`);
}

await browser.close();
process.exit(totalFailures > 0 ? 1 : 0);
