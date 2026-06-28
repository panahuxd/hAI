# DS - Shadcn — token system

A developer-ready token system generated from the Figma file **DS - Shadcn** (theme **CE**, **Light**
mode). Output conforms to the shadcn / Tailwind v4 theming standard. Figma was read-only; nothing was
written back.

## Contents

```
.
├── README.md                  # this file
├── TOKENS-AUDIT.md            # findings by severity + fixes table
├── tokens/
│   ├── $manifest.json         # collections, modes, shipped vs available
│   ├── primitives.json        # raw ramps, radius, spacing, fonts (DTCG)
│   └── semantic.light.json    # shadcn semantic layer, references primitives
└── src/styles/
    └── globals.css            # shadcn :root + @theme inline (drop-in)
```

## Consuming the tokens

`globals.css` is a drop-in shadcn / Tailwind v4 theme. Import it once at your app root:

```css
/* app entry CSS */
@import "./src/styles/globals.css";
```

Then use the standard shadcn utilities — `bg-background`, `text-foreground`, `bg-primary`,
`text-muted-foreground`, `border-border`, `ring-ring`, `bg-chart-1`, the `bg-sidebar*` family, and
`rounded-sm|md|lg|xl`. Every canonical token is wired through `@theme inline`, so Tailwind generates
the matching utility classes automatically.

The DTCG JSON (`tokens/`) is the source for build pipelines (Style Dictionary, etc.). Aliases are kept
as `{references}` so primitives resolve at build time. Run with the `light` set selected; add a
`semantic.dark.json` set if/when you ship dark mode.

## This is an RTL system

The sans family is **IranYekanX** (Persian). `globals.css` sets `html { direction: rtl }`. In the
consuming app:

- Set `dir="rtl"` on the root element.
- Supply the IranYekanX woff2 files at `/fonts/` (or edit the `@font-face` `src`).
- Use Tailwind/shadcn **logical** utilities (`ps-*`, `pe-*`, `ms-*`, `start-*`, `end-*`) — never
  hardcoded `left`/`right`. The type ramp itself is direction-agnostic.

## Extensions beyond stock shadcn

These tokens are part of DS - Shadcn but **not** in the 31-token shadcn contract. They're defined under
`:root` and exposed via `@theme inline` (so `bg-info`, `text-warning-foreground`, etc. work), and
grouped under `color.extensions` in the DTCG semantic set:

| Token | Light value | Notes |
|---|---|---|
| `info` / `info-foreground` / `info-background` | #1D4ED8 / #EFF6FF / #EFF6FF | `info-foreground` fixed (was = info) |
| `success` / `success-foreground` / `success-background` | #15803D / #F0FDF4 / #F0FDF4 | |
| `warning` / `warning-foreground` / `warning-background` | #A16207 / #FEFCE8 / #FEFCE8 | `warning-foreground` fixed (was = warning) |
| `destructive-background` | #FEF2F2 | |
| `primary-border` / `secondary-border` | #093672 / #F5F5F5 | |

## Fixes already applied in this output

- **`warning-foreground`** #A16207 → **#FEFCE8** (was identical to `warning` — invisible text).
- **`info-foreground`** #1D4ED8 → **#EFF6FF** (was identical to `info`).
- **`sidebar-background`** renamed to canonical **`sidebar`**.
- **11 malformed `custom/*` tokens excluded** (spaces / backslashes / baked `dark:` prefixes; many
  duplicates of canonical tokens). See TOKENS-AUDIT.md → H3.

## Not shipped in this run

- **Dark mode** (the `3. Mode` collection has a Dark mode) — add a `.dark { … }` block + `semantic.dark.json`.
- **Gold / B2E brands** (the `2. Theme` collection's other modes).
- **Mobile** breakpoint values (the `4. Custom` collection's Mobile mode).

Re-run the audit with the desired theme/mode to emit any of these. Several MEDIUM/LOW findings are
Figma-side hygiene (scopes, alpha naming, layering) — see TOKENS-AUDIT.md.
