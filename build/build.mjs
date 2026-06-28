/**
 * Build pipeline for the DS - Shadcn token system.
 *
 * The DTCG JSON in tokens/ is the SINGLE SOURCE OF TRUTH. This script feeds it
 * through Style Dictionary and emits src/styles/globals.css (shadcn / Tailwind
 * v4). Never hand-edit globals.css — edit the JSON and re-run `npm run build`.
 *
 *   npm run build     write src/styles/globals.css from the tokens
 *   npm run verify    fail if globals.css is out of date (CI guard)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import StyleDictionary from "style-dictionary";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(ROOT, "src/styles/globals.css");
const CHECK = process.argv.includes("--check");

const SOURCES = ["tokens/primitives.json", "tokens/semantic.light.json"];

/* Flatten DTCG JSON to a dotted-path -> $value map. Reading the files directly
 * (instead of Style Dictionary's merged tree) keeps the semantic `radius` token
 * and the primitive `radius.*` group from colliding on the same key. */
const flatten = (obj, prefix, out) => {
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    if (v && typeof v === "object" && "$value" in v) out.set([...prefix, k].join("."), v.$value);
    else if (v && typeof v === "object") flatten(v, [...prefix, k], out);
  }
};
const RAW = new Map();
for (const f of SOURCES) flatten(JSON.parse(readFileSync(resolve(ROOT, f), "utf8")), [], RAW);

/* IranYekanX ships these 11 weights; the woff2 files live in fonts/. */
const FONT_WEIGHTS = [
  [100, "Thin"], [200, "UltraLight"], [300, "Light"], [400, "Regular"],
  [500, "Medium"], [600, "DemiBold"], [700, "Bold"], [800, "ExtraBold"],
  [900, "Black"], [950, "ExtraBlack"], [1000, "Heavy"],
];

/* Canonical shadcn token order (the 31-token contract) + our extensions.
 * Each inner array is a visual group (blank line between groups in the output). */
const CANONICAL_GROUPS = [
  ["background", "foreground"],
  ["card", "card-foreground"],
  ["popover", "popover-foreground"],
  ["primary", "primary-foreground"],
  ["secondary", "secondary-foreground"],
  ["muted", "muted-foreground"],
  ["accent", "accent-foreground"],
  ["destructive", "destructive-foreground"],
  ["border", "input", "ring"],
  ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"],
  ["sidebar", "sidebar-foreground", "sidebar-primary", "sidebar-primary-foreground",
   "sidebar-accent", "sidebar-accent-foreground", "sidebar-border", "sidebar-ring"],
];
const EXTENSION_GROUPS = [
  ["info", "info-foreground", "info-background"],
  ["success", "success-foreground", "success-background"],
  ["warning", "warning-foreground", "warning-background"],
  ["destructive-background"],
  ["primary-border", "secondary-border"],
];
const CANONICAL = CANONICAL_GROUPS.flat();
const EXTENSIONS = EXTENSION_GROUPS.flat();

const pad = (s, n = 27) => (s.length >= n ? s + " " : (s + " ".repeat(n - s.length)));
const pxToRem = (px) => {
  const rem = parseFloat(px) / 16;
  return `${parseFloat(rem.toFixed(4))}rem`;
};
const fontStack = (name, value) => {
  const quoted = /\s/.test(value) || name === "sans" ? `"${value}"` : value;
  if (name === "sans") return `${quoted}, system-ui, sans-serif`;
  if (name === "serif") return `${quoted}, serif`;
  return `${quoted}, monospace`;
};

StyleDictionary.registerFormat({
  name: "shadcn/globals-css",
  format: () => {
    const resolve1 = (val) => {
      let v = String(val);
      let guard = 0;
      while (v.includes("{") && guard++ < 20) {
        v = v.replace(/\{([^}]+)\}/g, (_, ref) => {
          if (!RAW.has(ref)) throw new Error(`Unresolved reference: {${ref}}`);
          return String(RAW.get(ref));
        });
      }
      return v;
    };

    // shadcn var name -> semantic token: canonical lives at color.<name>,
    // extensions at color.extensions.<name>.
    const colorVal = (name) => {
      const ref = RAW.has(`color.${name}`) ? RAW.get(`color.${name}`) : RAW.get(`color.extensions.${name}`);
      if (ref === undefined) throw new Error(`Missing token: ${name}`);
      return resolve1(ref).toUpperCase();
    };

    const lines = [];
    const p = (s = "") => lines.push(s);

    // --- Header: Tailwind import + fonts + RTL ---
    p(`@import "tailwindcss";`);
    p();
    p(`/* ------------------------------------------------------------------ */`);
    p(`/* Fonts — DS - Shadcn uses IranYekanX (RTL / Persian) as the sans     */`);
    p(`/* family. woff2 files live in /fonts (serve the repo's fonts/ dir     */`);
    p(`/* at /fonts, or swap these src paths for your CDN).                   */`);
    p(`/* ------------------------------------------------------------------ */`);
    for (const [weight, style] of FONT_WEIGHTS) {
      p(`@font-face {`);
      p(`  font-family: "IranYekanX";`);
      p(`  src: url("/fonts/IRANYekanX-${style}.woff2") format("woff2");`);
      p(`  font-weight: ${weight};`);
      p(`  font-display: swap;`);
      p(`}`);
    }
    p();
    p(`/* This is an RTL design system — flow direction lives here, not in tokens. */`);
    p(`html { direction: rtl; }`);
    p();

    // --- :root values ---
    const radiusLg = resolve1("{radius.lg}");
    p(`:root {`);
    p(`  ${pad("--radius:")}${pxToRem(radiusLg)};   /* from radius/lg = ${radiusLg} */`);
    const emitGroups = (groups, render) => {
      for (const grp of groups) {
        p();
        for (const name of grp) p(render(name));
      }
    };
    emitGroups(CANONICAL_GROUPS, (name) => `  ${pad(`--${name}:`)}${colorVal(name)};`);
    p();
    p(`  /* --- Extensions (beyond stock shadcn) --- */`);
    for (const name of EXTENSIONS) p(`  ${pad(`--${name}:`)}${colorVal(name)};`);
    p(`}`);
    p();

    // --- @theme inline (maps tokens to Tailwind utilities) ---
    p(`@theme inline {`);
    let first = true;
    for (const grp of CANONICAL_GROUPS) {
      if (!first) p();
      first = false;
      for (const name of grp) p(`  --color-${name}: var(--${name});`);
    }
    p();
    p(`  /* Extensions */`);
    for (const name of EXTENSIONS) p(`  --color-${name}: var(--${name});`);
    p();

    // Radius scale — derived from --radius using each primitive's offset from lg.
    const lgPx = parseFloat(radiusLg);
    p(`  /* Radius scale — derived from --radius, matches the file's radius/* exactly */`);
    for (const key of ["sm", "md", "lg", "xl"]) {
      const px = parseFloat(resolve1(`{radius.${key}}`));
      const off = px - lgPx;
      const expr = off === 0 ? `var(--radius)` : `calc(var(--radius) ${off < 0 ? "-" : "+"} ${Math.abs(off)}px)`;
      p(`${pad(`  --radius-${key}: ${expr};`, 42)} /* ${px}px */`);
    }
    p();

    // Fonts
    for (const key of ["sans", "serif", "mono"]) {
      const fam = resolve1(`{font.${key}}`);
      p(`  --font-${key}: ${fontStack(key, fam)};`);
    }
    p(`}`);

    return lines.join("\n") + "\n";
  },
});

const sd = new StyleDictionary({
  source: [resolve(ROOT, "tokens/primitives.json"), resolve(ROOT, "tokens/semantic.light.json")],
  usesDtcg: true,
  log: { verbosity: "silent" },
  platforms: {
    css: {
      buildPath: "src/styles/",
      files: [{ destination: "globals.css", format: "shadcn/globals-css" }],
    },
  },
});

const [{ output }] = await sd.formatPlatform("css");

if (CHECK) {
  const current = readFileSync(OUT, "utf8");
  if (current !== output) {
    console.error("✗ globals.css is OUT OF DATE — run `npm run build` and commit the result.");
    process.exit(1);
  }
  console.log("✓ globals.css is up to date with tokens/.");
} else {
  writeFileSync(OUT, output);
  console.log(`✓ wrote ${OUT.replace(ROOT + "/", "")} from tokens/`);
}
