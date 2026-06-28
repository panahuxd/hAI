# Token audit — "DS - Shadcn"

**File:** DS - Shadcn (`ykBaZL3k6ieWYjbWYx9TlM`) · **Theme:** CE · **Mode:** Light
**Date:** 2026-06-28 · **Figma access:** read-only

## Verdict

Healthy, well-structured token system. **Canonical coverage is 31/31** — every shadcn
semantic token is present in the `3. Mode` collection (`base/` prefix). The aliasing is clean
(`base/* → colors/*-light → tailwind primitive`) and the radius scale matches shadcn's derived
formula exactly. Two real defects ship today: **two zero-contrast foreground pairs** (`warning`,
`info`) and a cluster of **malformed `custom/*` names**. Both are fixed or excluded in the emitted
token system; the rest are Figma-side hygiene recommendations.

## Structure discovered

| Collection | Role | Modes | Count |
|---|---|---|---|
| 1. TailwindCSS | Primitives (spacing, radius, color ramps, breakpoints) | Default | 462 |
| 2. Theme | Brand palette + radius + fonts | **CE**, Gold, B2E | 262 |
| 3. Mode | **Semantic layer (shadcn contract)** | **Light**, Dark | 76 |
| 4. Custom | Typography + layout spacing | Desktop, Mobile | 26 |

---

## HIGH — ships broken

**H1 · `warning-foreground` == `warning` (zero contrast).** Both resolve to `#A16207` (yellow-700).
Any text set on a warning surface is invisible. **Fixed** in output to `#FEFCE8` (yellow-50),
mirroring how `success-foreground` (green-50) and `destructive-foreground` (red-50) are built.

**H2 · `info-foreground` == `info` (zero contrast).** Both resolve to `#1D4ED8` (blue-700). Same bug.
**Fixed** in output to `#EFF6FF` (blue-50).

**H3 · Malformed `custom/*` token names.** Eleven tokens bake Tailwind variant logic, spaces, and
backslashes into names — they break DTCG `{references}` and Style Dictionary name resolution:

- `custom/background dark:input\30`, `custom/accent dark:input\50`, `custom/dark:input`
- `custom/destructive dark:destructive\70`, `\90`, `\60`
- `custom/input dark:input\80`, `custom/destructive\20 dark:destructive\40`,
  `custom/destructive\40 dark:destructive\60`
- `custom/outline`, `custom/outline\10 dark:outline\20`

Several are **duplicates** of canonical tokens (`…background…` = `#FFFFFF` = `background`;
`…accent…` = `accent`; the three `…destructive…` = `destructive`; `…input…` = `input`).
**Excluded** from the emitted system. Recommendation in Figma: delete the duplicates; for the genuinely
distinct ones (`custom/outline` `#749DCA80`, the destructive/outline alpha tints) rename to clean,
mode-agnostic names (e.g. `ring/alpha-50`, `destructive/alpha-20`) and let dark mode handle the
variant via the Light/Dark axis rather than the name.

---

## MEDIUM — correctness / hygiene

**M1 · `sidebar-background` → `sidebar`.** Canonical shadcn name is `sidebar`. **Renamed** in output.

**M2 · Scope hygiene — every color uses `ALL_SCOPES`.** All 76 semantic colors expose themselves in
every Figma property picker (text, fill, stroke, effect…). Recommend scoping surfaces to
`FRAME_FILL`/`SHAPE_FILL`, foregrounds to `TEXT_FILL`, and `border`/`input`/`ring` to `STROKE_COLOR`.
Figma-side only — does not change the CSS.

**M3 · Type tokens have empty scopes.** The `4. Custom` `heading-*` tokens carry `scopes: []`, so they
won't surface where expected. Recommend scoping `font-size`→`FONT_SIZE`, `line-height`→`LINE_HEIGHT`,
`font-weight`→`FONT_WEIGHT`, `font-family`→`FONT_FAMILY`.

**M4 · Layering leak — `ring-offset` aliases a primitive directly.** `base/ring-offset → tailwind
colors/base/white`, while every sibling routes through the theme tier (`colors/*-light`). This breaks
the moment a dark mode value is needed. Recommend routing it through a `colors/ring-offset-light`
theme token. (`ring-offset` is a shadcn extension, not part of the 31; not emitted by default.)

**M5 · Inverted alpha scales.** `alpha/10` resolves to `#FFFFFFE5` — i.e. ~90% opacity — so the number
is the inverse of the actual alpha. Same for `alpha black/*`. Misleads anyone reading the name.
Recommend renaming so the number matches the opacity (`alpha/90` for 90%).

---

## LOW — polish

**L1 · Comma decimals in primitive names.** `spacing/0,5`, `spacing/1,5`, `spacing/2,5`, `spacing/3,5`
use commas — unsafe for code references. Normalize to `spacing.0_5` etc. (handled on export).

**L2 · Double-encoded light/dark.** The `2. Theme` collection stores both `-light` and `-dark`
variants *and* the `3. Mode` collection has a separate Light/Dark axis — the same light/dark
information lives in two places, doubling variable count. Optional cleanup: keep one source of truth
(the Light/Dark mode axis) and drop the baked `-light`/`-dark` suffixes from Theme.

**L3 · `sidebar-primary` is neutral, not brand.** `sidebar-primary` = `#171717` (neutral-900) while
`primary` = `#093672` (navy). Likely intentional (neutral sidebar), but flagged as a decision to
confirm rather than a bug.

---

## Positives (preserve these)

- **31/31 canonical coverage** — no missing shadcn tokens.
- **Radius scale matches shadcn's derived formula exactly:** `sm 6 = base−4`, `md 8 = base−2`,
  `lg 10 = base`, `xl 14 = base+4` (base = `radius/lg` = 10px).
- **Clean three-tier aliasing** for the `base/` layer: semantic → theme (`colors/*-light`) → primitive
  (`tailwind colors/*`). Easy to retheme (CE/Gold/B2E) and add dark mode.
- **Coherent extension set:** `info` / `success` / `warning` each with `-foreground` + `-background`,
  plus `destructive-background`, `primary-border`, `secondary-border`. Documented in the README.
- **RTL + font setup present:** sans family is IranYekanX (Persian); `direction: rtl` wired into
  `globals.css`.

---

## Fixes table

| # | Token | Source | Delivered |
|---|---|---|---|
| H1 | warning-foreground | #A16207 (= warning) | #FEFCE8 (yellow-50) |
| H2 | info-foreground | #1D4ED8 (= info) | #EFF6FF (blue-50) |
| H3 | custom/* (11 tokens) | malformed names, many duplicates | excluded from export; rename/delete in Figma |
| M1 | sidebar-background | name | renamed → sidebar |
| M2 | all colors | ALL_SCOPES | scope recommendation (Figma-side) |
| M3 | heading-* type tokens | empty scopes | scope recommendation (Figma-side) |
| M4 | ring-offset | aliases primitive directly | route through theme tier (Figma-side) |
| M5 | alpha/*, alpha black/* | inverted numbering | rename so number = opacity (Figma-side) |
| L1 | spacing/0,5 … | comma decimals | normalize to dot/underscore on export |
| L2 | -light/-dark + Light/Dark axis | double-encoded | optional dedupe (Figma-side) |
