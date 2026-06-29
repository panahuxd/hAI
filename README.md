# DS - Shadcn — token system

A developer-ready token system generated from the Figma file **DS - Shadcn** (theme **CE**, **Light**
mode). Output conforms to the shadcn / Tailwind v4 theming standard. Figma was read-only; nothing was
written back.

## Contents

```
.
├── README.md                  # this file
├── TOKENS-AUDIT.md            # findings by severity + fixes table
├── package.json               # build scripts + Style Dictionary dep
├── build/
│   └── build.mjs              # compiles tokens/ → src/styles/globals.css
├── tokens/                    # ← SOURCE OF TRUTH (DTCG JSON, hand-edited)
│   ├── $manifest.json         # collections, modes, shipped vs available
│   ├── primitives.json        # raw ramps, radius, spacing, fonts, type scale
│   ├── semantic.light.json    # shadcn semantic layer, references primitives
│   └── typography.json        # shadcn typography roles → type-scale primitives
├── src/styles/
│   └── globals.css            # ← GENERATED (do not hand-edit)
└── fonts/                     # IranYekanX woff2 (see fonts/README.md)
```

## Build

The DTCG JSON in `tokens/` is the **single source of truth**. `src/styles/globals.css`
is **generated** from it by Style Dictionary — never hand-edit the CSS; edit the JSON
and rebuild.

```bash
npm install      # once
npm run build    # tokens/ → src/styles/globals.css
npm run verify   # CI guard: fails if globals.css is out of date with tokens/
```

## Components & Storybook

Components live in `src/components/ui/` (shadcn-style, consuming the tokens above) and are
documented in **Storybook** (React + Vite, RTL, IranYekanX).

```bash
npm install         # once
npm run storybook   # dev server at http://localhost:6006
npm run build-storybook   # static build → storybook-static/
```

Storybook auto-discovers any `src/**/*.stories.tsx`, and `.storybook/preview.tsx` wraps every
story in an RTL, token-themed surface, so components render exactly as in the app.

### Adding a component (the workflow)

1. Add the component, e.g. `src/components/ui/card.tsx`.
2. Add a co-located story, `src/components/ui/card.stories.tsx` (copy `logo.stories.tsx` as a
   template). It appears in Storybook automatically.
3. Push / open a PR.

CI enforces this contract:

- **`npm run check:stories`** — fails if any component in `src/components/ui/` has no matching
  `*.stories.tsx`. So **every component you push must come with a story.**
- On push to `main`, CI builds Storybook and **deploys it to GitHub Pages**
  (see [`.github/workflows/storybook.yml`](.github/workflows/storybook.yml)).

> **Enable Pages once:** repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
> The published URL is then shown on the workflow's `deploy` job.

Foundation stories under `src/foundations/` (Colors, Typography, Icons) document the token system itself.

### Icons

The DS uses [lucide](https://lucide.dev) icons through a **curated, governed surface**. Only icons
re-exported from [`src/lib/icons.ts`](src/lib/icons.ts) are approved; render them with the `<Icon>`
wrapper ([`src/components/ui/icon.tsx`](src/components/ui/icon.tsx)), which bakes in the DS defaults
(16px, `currentColor`, consistent stroke) and **auto-mirrors directional icons in RTL**.

```tsx
import { Icon } from "@/components/ui/icon";
import { Search, ChevronRight } from "@/lib/icons";

<Icon icon={Search} className="size-5 text-muted-foreground" />
<Icon icon={ChevronRight} />   {/* points the correct way in RTL */}
```

Named imports tree-shake, so only the icons you use are bundled. **Approve a new icon** by adding it
to the import + `iconRegistry` in `icons.ts`. The full approved set is browsable (with click-to-copy
imports) in the `Foundations/Icons` Storybook gallery.

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

The DTCG JSON (`tokens/`) drives the build (see [Build](#build)). Aliases are kept as `{references}`
so primitives resolve at build time. Add a `semantic.dark.json` set + a `.dark {}` block in the
generator if/when you ship dark mode.

## Typography

Typography follows the [shadcn typography](https://ui.shadcn.com/docs/components/typography) roles,
on IranYekanX, RTL-safe. It ships in two layers:

**1. Type-scale utilities** — `globals.css` emits the Tailwind v4 type scale, so the usual utilities
work and you compose roles the shadcn way:

```html
<h1 class="text-4xl font-extrabold tracking-tight lg:text-5xl">عنوان</h1>
<p class="text-xl text-muted-foreground">لید</p>            <!-- lead -->
<small class="text-sm font-medium">کوچک</small>             <!-- small -->
```

Generated tokens: `text-xs … text-5xl` (with paired line-heights), `font-normal … font-extrabold`,
`tracking-tight`.

**2. Prose container** — wrap long-form/rich content in `.typography` and the bare elements are
styled automatically (h1–h4, `p`, `blockquote`, `ul/ol`, `code`, `pre`, `table`), shadcn-style:

```html
<article class="typography">
  <h1>…</h1>     <!-- responsive: 4xl on mobile, 5xl from lg (64rem) up -->
  <p>…</p>
  <blockquote>…</blockquote>
</article>
```

The container uses `:where()` (zero specificity, so any utility overrides it) and **logical
properties** (`margin-block`, `border-inline-start`, …) so it's correct in both RTL and LTR.
Role → scale mappings live in [`tokens/typography.json`](tokens/typography.json); only `h1` is
responsive (Mobile 4xl → Desktop 5xl), matching the Figma component.

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
