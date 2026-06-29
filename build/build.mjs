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

const SOURCES = ["tokens/primitives.json", "tokens/semantic.light.json", "tokens/typography.json"];

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

/* Tailwind v4 type-scale namespaces emitted into @theme inline. */
const TEXT_SIZES = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl"];
const WEIGHT_NAMES = ["normal", "medium", "semibold", "bold", "extrabold"];

/* Tailwind v4 / shadcn standard breakpoint scale (emitted as --breakpoint-*).
 * The responsive-h1 media query below derives its value from `breakpoint.lg`. */
const BREAKPOINTS = ["sm", "md", "lg", "xl", "2xl"];

/* Prose recipe: shadcn element styles for the .typography container. Font props
 * (size/weight/line-height/tracking/color/family) come from tokens/typography.json;
 * the structural rules below (margins, borders, list markers) are layout, expressed
 * with RTL-safe logical properties so the ramp stays direction-agnostic. Margin /
 * padding step numbers reference the `spacing.*` primitives. */
const PROSE = [
  { sel: "h1", role: "h1", responsive: true },
  { sel: "h2", role: "h2", mbs: "10", borderBlockEnd: true, pbe: "2" },
  { sel: "h3", role: "h3", mbs: "8" },
  { sel: "h4", role: "h4", mbs: "6" },
  { sel: "p:not(:first-child)", role: "p", mbs: "6" },
  { sel: "blockquote", role: "blockquote", mbs: "6", borderInlineStart: "2", pis: "6" },
  { sel: "ul", role: "list", listStyle: "disc", mb: "6", mis: "6" },
  { sel: "ol", role: "list", listStyle: "decimal", mb: "6", mis: "6" },
];

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

    // typography.<role>.<prop> -> the referenced primitive's leaf name
    // (e.g. "{fontSize.3xl}" -> "3xl", "{color.muted-foreground}" -> "muted-foreground").
    const refLeaf = (role, prop) => {
      const ref = RAW.get(`typography.${role}.${prop}`);
      const m = ref === undefined ? null : String(ref).match(/\.([^.}]+)\}?$/);
      return m ? m[1] : undefined;
    };
    const space = (step) => pxToRem(resolve1(`{spacing.${step}}`));
    // CSS declarations (theme-var references) for a typography role's font.
    const fontDecls = (role, mobile = false) => {
      const out = [];
      const fam = refLeaf(role, "font-family");
      if (fam) out.push(`font-family: var(--font-${fam})`);
      const size = refLeaf(role, mobile ? "font-size-mobile" : "font-size");
      if (size) out.push(`font-size: var(--text-${size})`);
      const lh = refLeaf(role, mobile ? "line-height-mobile" : "line-height");
      if (lh) out.push(`line-height: var(--text-${lh}--line-height)`);
      const fw = refLeaf(role, "font-weight");
      if (fw) out.push(`font-weight: var(--font-weight-${fw})`);
      const tr = refLeaf(role, "letter-spacing");
      if (tr) out.push(`letter-spacing: var(--tracking-${tr})`);
      const st = RAW.get(`typography.${role}.font-style`);
      if (st) out.push(`font-style: ${st}`);
      const col = refLeaf(role, "color");
      if (col) out.push(`color: var(--${col})`);
      return out;
    };

    const lines = [];
    const p = (s = "") => lines.push(s);

    // Responsive-h1 desktop breakpoint — derived from the `lg` breakpoint token.
    const LG_BREAKPOINT = pxToRem(resolve1("{breakpoint.lg}"));

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
    p();

    // Type scale — generates text-xs…text-5xl (with paired line-heights),
    // font-normal…font-extrabold, and tracking-tight.
    p(`  /* Type scale */`);
    for (const s of TEXT_SIZES) {
      p(`  --text-${s}: ${pxToRem(resolve1(`{fontSize.${s}}`))};`);
      p(`  --text-${s}--line-height: ${pxToRem(resolve1(`{lineHeight.${s}}`))};`);
    }
    p();
    for (const w of WEIGHT_NAMES) p(`  --font-weight-${w}: ${resolve1(`{fontWeight.${w}}`)};`);
    p();
    p(`  --tracking-tight: ${resolve1("{letterSpacing.tight}")};`);
    p();

    // Breakpoints — Tailwind v4 / shadcn standard scale. Generates the
    // sm:/md:/lg:/xl:/2xl: responsive variants and min-*/max-* utilities.
    p(`  /* Breakpoints — Tailwind v4 / shadcn standard scale */`);
    for (const b of BREAKPOINTS) {
      p(`  --breakpoint-${b}: ${pxToRem(resolve1(`{breakpoint.${b}}`))};`);
    }
    p(`}`);
    p();

    // --- @layer base: shadcn typography roles, RTL-safe ---
    p(`/* ------------------------------------------------------------------ */`);
    p(`/* Typography — shadcn roles on IranYekanX. Wrap rich text in          */`);
    p(`/* <div class="typography">…</div>. :where() keeps specificity at 0 so */`);
    p(`/* Tailwind utilities always override. Logical properties keep it RTL- */`);
    p(`/* and LTR-safe. h1 is responsive (mobile → ${LG_BREAKPOINT} desktop).            */`);
    p(`/* ------------------------------------------------------------------ */`);
    p(`@layer base {`);
    p(`  .typography {`);
    p(`    color: var(--foreground);`);
    p(`    font-family: var(--font-sans);`);
    p(`  }`);
    p(`  .typography > :first-child { margin-block-start: 0; }`);
    p();

    const ruleFor = (r) => {
      const decls = [...fontDecls(r.role, r.responsive)];
      if (r.mbs) decls.push(`margin-block-start: ${space(r.mbs)}`);
      if (r.mb) decls.push(`margin-block: ${space(r.mb)}`);
      if (r.mis) decls.push(`margin-inline-start: ${space(r.mis)}`);
      if (r.pbe) decls.push(`padding-block-end: ${space(r.pbe)}`);
      if (r.pis) decls.push(`padding-inline-start: ${space(r.pis)}`);
      if (r.borderBlockEnd) decls.push(`border-block-end: 1px solid var(--border)`);
      if (r.borderInlineStart) decls.push(`border-inline-start: ${r.borderInlineStart}px solid var(--border)`);
      if (r.listStyle) decls.push(`list-style: ${r.listStyle}`);
      p(`  .typography :where(${r.sel}) { ${decls.join("; ")}; }`);
      if (r.responsive) {
        p(`  @media (min-width: ${LG_BREAKPOINT}) {`);
        p(`    .typography :where(${r.sel}) { ${fontDecls(r.role, false).filter((d) => /font-size|line-height/.test(d)).join("; ")}; }`);
        p(`  }`);
      }
    };
    for (const r of PROSE) ruleFor(r);
    p(`  .typography :where(ul, ol) > li { margin-block-start: ${space("2")}; }`);
    p();

    // Inline + block code
    p(`  .typography :where(:not(pre) > code) {`);
    p(`    ${fontDecls("inline-code").join(";\n    ")};`);
    p(`    background: var(--muted);`);
    p(`    border-radius: var(--radius-sm);`);
    p(`    padding-inline: ${space("2")};`);
    p(`    padding-block: 0.125rem;`);
    p(`  }`);
    p(`  .typography :where(pre) {`);
    p(`    background: var(--muted);`);
    p(`    border-radius: var(--radius-lg);`);
    p(`    padding: ${space("4")};`);
    p(`    overflow-x: auto;`);
    p(`  }`);
    p(`  .typography :where(pre) code {`);
    p(`    ${fontDecls("code").join(";\n    ")};`);
    p(`    background: none;`);
    p(`    padding: 0;`);
    p(`  }`);
    p();

    // Table
    p(`  .typography :where(table) {`);
    p(`    width: 100%;`);
    p(`    border-collapse: collapse;`);
    p(`    margin-block: ${space("6")};`);
    p(`  }`);
    p(`  .typography :where(th, td) {`);
    p(`    border: 1px solid var(--border);`);
    p(`    padding-block: ${space("2")};`);
    p(`    padding-inline: ${space("4")};`);
    p(`    text-align: start;`);
    p(`  }`);
    p(`  .typography :where(th) { ${fontDecls("table-head").join("; ")}; }`);
    p(`  .typography :where(td) { ${fontDecls("table-cell").join("; ")}; }`);
    p(`  .typography :where(tr:nth-child(even)) td { background: var(--muted); }`);
    p(`}`);

    return lines.join("\n") + "\n";
  },
});

const sd = new StyleDictionary({
  source: SOURCES.map((f) => resolve(ROOT, f)),
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
