#!/usr/bin/env node
/**
 * spell-icon-check.mjs
 *
 * Regression assertion for #284: verifies that zero spell-icon <img> elements
 * render as blank 1×1 GIFs across the full champ-select flow and the showcase.
 *
 * Surfaces checked:
 *   1. /showcase/team-player-row       — static showcase page
 *   2. /showcase/champ-select-action-bar — static showcase page
 *   3. Ban phase screen                — navigated via full flow
 *   4. Pick screen                     — navigated via full flow (post-ban)
 *   5. Loadout screen                  — navigated via full flow (post-lock-in)
 *
 * Pass criterion: every <img> whose src contains "communitydragon" resolves
 * to naturalWidth > 1 (i.e. not a 1×1 blank GIF placeholder).
 *
 * Usage:
 *   node tools/spell-icon-check.mjs [--base-url <url>]
 *
 * PORT env var allows parallel lane runs: PORT=3284 node tools/spell-icon-check.mjs
 *
 * Exit 0 = all spell images loaded; 1 = blank images found or navigation failed.
 */

import { chromium } from "/Users/matintosh/dev/league-of-web/node_modules/playwright/index.mjs";

const args = process.argv.slice(2);
const baseArg = args.indexOf("--base-url");
const PORT = process.env.PORT ?? 3000;
const BASE = baseArg !== -1 ? args[baseArg + 1] : `http://localhost:${PORT}`;

let failed = 0;

/**
 * Assert that every CDragon <img> on the current page has naturalWidth > 1.
 * Returns the count of failing images.
 */
async function assertSpellImgs(page, label) {
  await page.waitForTimeout(2000);

  const results = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll("img"));
    return imgs
      .filter((img) => img.src.includes("communitydragon"))
      .map((img) => ({ src: img.src, naturalWidth: img.naturalWidth }));
  });

  if (results.length === 0) {
    console.log(`  [WARN] ${label}: no CDragon img elements found on page`);
    return 0;
  }

  let localFail = 0;
  for (const { src, naturalWidth } of results) {
    if (naturalWidth <= 1) {
      console.error(`  [FAIL] ${label}: blank img — naturalWidth=${naturalWidth} src=${src}`);
      localFail++;
    } else {
      console.log(`  [OK]   ${label}: naturalWidth=${naturalWidth} src=${src.split("/").pop()}`);
    }
  }
  return localFail;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });

try {
  // -------------------------------------------------------------------------
  // 1. /showcase/team-player-row
  // -------------------------------------------------------------------------
  console.log("\n=== showcase/team-player-row ===");
  const p1 = await ctx.newPage();
  await p1.goto(`${BASE}/showcase/team-player-row`, { waitUntil: "networkidle" });
  failed += await assertSpellImgs(p1, "team-player-row showcase");
  await p1.close();

  // -------------------------------------------------------------------------
  // 2. /showcase/champ-select-action-bar
  // -------------------------------------------------------------------------
  console.log("\n=== showcase/champ-select-action-bar ===");
  const p2 = await ctx.newPage();
  await p2.goto(`${BASE}/showcase/champ-select-action-bar`, { waitUntil: "networkidle" });
  failed += await assertSpellImgs(p2, "champ-select-action-bar showcase");
  await p2.close();

  // -------------------------------------------------------------------------
  // 3–5. Full flow: home → ban → pick → loadout
  // Mirrors the navigation logic from tools/loadout-overlap-check.mjs
  // -------------------------------------------------------------------------
  console.log("\n=== Full champ-select flow ===");
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });

  // Step 1: PLAY
  console.log("Step 1: Click Play …");
  await page.locator("button", { hasText: "Play" }).first().click();
  await page.waitForTimeout(800);

  // Step 2: Mode select → Confirm
  console.log("Step 2: Confirm mode …");
  await page.locator("button:has-text('Confirm')").first().waitFor({ state: "visible", timeout: 5000 });
  await page.locator("button:has-text('Confirm')").first().click();
  await page.waitForTimeout(800);

  // Step 3: Party lobby → Find Match
  console.log("Step 3: Find Match …");
  await page.locator("button:has-text('Find Match')").first().waitFor({ state: "visible", timeout: 5000 });
  await page.locator("button:has-text('Find Match')").first().click();
  await page.waitForTimeout(500);

  // Step 4: Wait for Accept
  console.log("Step 4: Waiting for Accept (up to 15 s) …");
  await page.locator("button:has-text('Accept')").first().waitFor({ state: "visible", timeout: 15000 });
  await page.locator("button:has-text('Accept')").first().click();
  await page.waitForTimeout(1500);

  // Step 4b: Ban phase
  console.log("Step 4b: Ban phase …");
  const onBan = await page.getByText("Ban a Champion!", { exact: false }).count();
  if (onBan === 0) {
    throw new Error("Could not reach ban phase screen ('Ban a Champion!' not found)");
  }
  console.log("✓ Ban phase screen reached.");

  console.log("\n--- ban phase spell icons ---");
  failed += await assertSpellImgs(page, "ban phase team rail");

  // Click champion and BAN
  await page.locator("[role='listbox'] > *").first().waitFor({ state: "visible", timeout: 5000 });
  await page.locator("[role='listbox'] > *").first().click();
  await page.waitForTimeout(300);
  const banBtn = page.locator("main button").filter({ hasText: /^ban$/i });
  await banBtn.waitFor({ state: "visible", timeout: 3000 });
  await banBtn.click();
  await page.waitForTimeout(1000);

  // Step 5: Pick phase
  const onPick = await page.getByText("Choose Your Champion!", { exact: false }).count();
  if (onPick === 0) {
    throw new Error("Could not reach pick screen ('Choose Your Champion!' not found)");
  }
  console.log("✓ Pick screen reached.");

  console.log("\n--- pick screen spell icons ---");
  failed += await assertSpellImgs(page, "pick screen team rail + action bar");

  // Click champion and Lock In
  await page.locator("[role='listbox'] > *").first().waitFor({ state: "visible", timeout: 5000 });
  await page.locator("[role='listbox'] > *").first().click();
  await page.waitForTimeout(300);
  await page.locator("main button:has-text('Lock In')").first().waitFor({ state: "visible", timeout: 3000 });
  await page.locator("main button:has-text('Lock In')").first().click();
  await page.waitForTimeout(1000);

  // Step 6: Loadout phase
  console.log("\n--- loadout screen spell icons ---");
  failed += await assertSpellImgs(page, "loadout screen team rail + action bar");

  await page.close();

} catch (err) {
  console.error("Navigation error:", err.message);
  failed++;
} finally {
  await browser.close();
}

// -------------------------------------------------------------------------
// Summary
// -------------------------------------------------------------------------
console.log(`\n=== RESULT: ${failed === 0 ? "PASS" : "FAIL"} ===`);
if (failed > 0) {
  console.error(`${failed} blank spell image(s) found or navigation error(s).`);
  process.exit(1);
} else {
  console.log("All CDragon spell images loaded correctly (naturalWidth > 1).");
  process.exit(0);
}
