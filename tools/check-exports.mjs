#!/usr/bin/env node
// Guard: every component module in packages/ui/src/<area>/ must be re-exported
// from packages/ui/src/index.ts. Catches the thrice-recurring missing-export bug.
// Skips *.showcase.tsx and *.demo.tsx (registry-only files).
import { readdirSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "packages", "ui", "src");
const index = readFileSync(join(root, "index.ts"), "utf8");
const areas = readdirSync(root, { withFileTypes: true }).filter((d) => d.isDirectory());

const missing = [];
for (const area of areas) {
  for (const f of readdirSync(join(root, area.name))) {
    if (!f.endsWith(".tsx") || f.includes(".showcase.") || f.includes(".demo.")) continue;
    const stem = f.replace(/\.tsx$/, "");
    const pascal = stem.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase());
    const path = `./${area.name}/${stem}`;
    if (!index.includes(`export { ${pascal} }`) || !index.includes(path)) {
      missing.push(`${area.name}/${f} → expected: export { ${pascal} } from "${path}";`);
    }
  }
}
if (missing.length) {
  console.error("check-exports FAILED — components missing from packages/ui/src/index.ts:");
  for (const m of missing) console.error("  " + m);
  process.exit(1);
}
console.log(`check-exports OK (${areas.length} areas scanned)`);
