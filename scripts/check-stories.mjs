#!/usr/bin/env node
// CI guard: every component in src/components/ui/ must have a co-located
// *.stories.tsx. Keeps "push a component → it's in Storybook" enforced.
//
//   node scripts/check-stories.mjs
//
// Exits non-zero (and lists the offenders) if any component lacks a story.

import { readdirSync, existsSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const componentsDir = join(root, "src", "components", "ui");

// Files that are not themselves components (barrels, helpers, etc.).
const IGNORE = new Set(["index.ts", "index.tsx"]);

if (!existsSync(componentsDir)) {
  console.log("No src/components/ui/ directory yet — nothing to check.");
  process.exit(0);
}

const missing = [];
let checked = 0;

for (const file of readdirSync(componentsDir)) {
  if (!file.endsWith(".tsx") || file.endsWith(".stories.tsx")) continue;
  if (IGNORE.has(file)) continue;

  checked++;
  const stem = basename(file, ".tsx");
  const story = join(componentsDir, `${stem}.stories.tsx`);
  if (!existsSync(story)) missing.push(`src/components/ui/${stem}.tsx`);
}

if (missing.length > 0) {
  console.error("\n✖ These components have no *.stories.tsx:\n");
  for (const m of missing) console.error(`   - ${m}`);
  console.error(
    `\nAdd a co-located story (e.g. ${missing[0].replace(/\.tsx$/, ".stories.tsx")}) so it shows up in Storybook.\n`
  );
  process.exit(1);
}

console.log(`✓ All ${checked} component(s) in src/components/ui/ have a story.`);
