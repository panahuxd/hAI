# hAI Component Audit — Button

- **Component:** Button (component set)
- **Figma:** `DS - Shadcn` · node `37:931` (file `ykBaZL3k6ieWYjbWYx9TlM`)
- **Standard:** shadcn/ui `button` (current registry, `cva`)
- **Direction:** RTL (IranYekanX)
- **Date:** 2026-06-29
- **Scope:** read-only audit of the Figma component vs. the shadcn standard; correction steps are for a designer to apply in Figma. A token-aligned React build ships alongside (see `src/components/ui/button.tsx`).

## Variant matrix (as built in Figma)

| | default | sm | lg | icon | icon-sm |
|---|---|---|---|---|---|
| **Default** | ✅ D/H/F/L/X | ✅ D/H/F/L/X | ✅ D/H/F/L/X | ✅ D/H/F/X | ✅ D/H/F/X |
| **Secondary** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Destructive** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Outline** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Ghost** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Link** | ✅ D/H/F/L/X | ✅ | ✅ | — | — |

States: **D**=Default **H**=Hover **F**=Focus **L**=Loading **X**=Disabled. (Icon sizes & Link omit Loading; Link omits icon sizes — both correct.)

## Findings at a glance

| # | Sev | Issue (Figma vs shadcn / token) | Fix |
|---|-----|----------------------------------|-----|
| 1 | 🔴 Critical | `Size=icon-sm` is **24px**, but shadcn `icon-sm` is **32px** (`size-8`); shadcn's 24px size is **`icon-xs`** (`size-6`). Name collision → wrong-sized buttons in code. | Rename the 24px size `icon-sm` → **`icon-xs`**; if a 32px icon is needed add a separate `icon-sm`. |
| 2 | 🔴 Critical | Focus ring bound to `custom/outline` `#749dca80`, **not** the `ring` token; ring color ≈ **2.8:1** vs white — below the **3:1** WCAG floor for a focus indicator. | Bind the Focus ring to the `ring` token, and darken `ring` (`#9CB8DA` → e.g. a 3:1+ blue) so the indicator is perceivable. |
| 3 | 🟠 Major | Destructive bg bound to malformed `custom/destructive dark:destructive\60` (`#b91c1c`) instead of the semantic `destructive` token (value happens to equal our `--destructive #B91C1C`). | Rebind fill to `destructive` and text to `destructive-foreground`; delete the baked-`dark:`/backslash custom token. |
| 4 | 🟠 Major | Outline bg/hover bound to malformed `custom/background dark:input\30` (`#fff`) & `custom/accent dark:input\50` (`#f5f5f5`) instead of `background` / `accent`. | Rebind to `background` (fill) and `accent` (hover); keep `dark:` only as a real mode override, not in the token name. |
| 5 | 🟠 Major | Hover uses white overlays via **mis-named** alpha tokens — `alpha/90 = #ffffff1a` (~10%), `alpha/80 = #ffffff33` (~20%) — vs shadcn's `bg-primary/90` color-opacity approach. | Rename alpha tokens to their true value (`alpha/10`, `alpha/20`) **or** switch hover to a token-opacity step on the variant color. |
| 6 | 🟠 Major | Icon-only sizes (`icon`, `icon-sm`) have no text → no accessible name. | Design note: every icon-only instance needs an `aria-label` in code (enforced in the build). |
| 7 | 🟡 Minor | Property values are **capitalized** (`Default`, `Secondary`, `Hover`…) vs shadcn lowercase `cva` values (`default`, `secondary`). | Lowercase `Variant`/`State`/`Size` values to map 1:1 onto the code props. |
| 8 | 🟡 Minor | Default (primary) carries a 1px `primary-border` (= bg color) **and** `shadow/xs`; shadcn primary has **neither** (`shadow-xs` belongs to `outline`). | Remove the border + shadow from the Default variant; keep `shadow-xs` on Outline only. |
| 9 | 🟡 Minor | `icon-sm` 24×24 sits exactly on the WCAG 2.2 **24px** target floor (no margin); Link `sm` ≈ 16px is below it. | Acceptable for dense UIs/text links, but prefer ≥ 44px hit area where space allows. |
| 10 | 🟡 Minor | Icon slots named **physically** (`leftIcon`/`rightIcon`) in an RTL system. | Prefer logical **leading/trailing** (start/end) naming so RTL/LTR stay correct. |

## Detailed findings

### 1. 🔴 `icon-sm` size collision (24px vs 32px)
shadcn defines `icon-xs = size-6 (24px)`, `icon-sm = size-8 (32px)`, `icon = size-9 (36px)`, `icon-lg = size-10 (40px)`. Figma's `icon-sm` is **24×24**, i.e. shadcn's **`icon-xs`**. A developer wiring `size="icon-sm"` from the shadcn contract renders a 32px button, but the design shows 24px. **Fix:** rename the 24px size to `icon-xs`; add a real 32px `icon-sm` only if the DS needs it. *(The build ships the full canonical size set, so the 24px size lives at `icon-xs`.)*

### 2. 🔴 Focus ring: wrong binding + sub-3:1 contrast
The `focus/default` effect uses `custom/outline #749dca80` (3px spread) rather than the `ring` token (`base/ring #9CB8DA` exists but is unused here). Resolved against white, `#749dca` ≈ **2.83:1** (`#9CB8DA` is lighter still, ≈ 2.4:1) — under the **3:1** minimum for non-text UI indicators (WCAG 1.4.11). A focus ring that can't be seen fails keyboard-a11y. **Fix:** bind Focus to `ring`, and darken the `ring` token so it clears 3:1 on both light surfaces.

### 3. 🟠 Destructive bound to a malformed custom token
Destructive fill = `custom/destructive dark:destructive\60` = `#b91c1c`. The value equals our `--destructive (#B91C1C)`, so it *looks* right, but it's bound through a token whose name bakes in a `dark:` prefix and a backslash escape — exactly the malformed `custom/*` class flagged in `TOKENS-AUDIT.md → H3`. **Fix:** rebind to the clean `destructive` / `destructive-foreground` tokens; express dark-mode shifts as a real mode, not in the name.

### 4. 🟠 Outline bg/hover bound to malformed custom tokens
Outline uses `custom/background dark:input\30 (#fff)` for fill and `custom/accent dark:input\50 (#f5f5f5)` for hover — both baked-`dark:` malformed names duplicating `background`/`accent`. **Fix:** rebind to `background` and `accent`.

### 5. 🟠 Mis-named alpha hover tokens
`alpha/90 = #ffffff1a` is ~10% white; `alpha/80 = #ffffff33` is ~20% white — the numbers in the names don't match the alpha. They're layered as white overlays for hover, whereas shadcn darkens the variant color itself (`hover:bg-primary/90`). **Fix:** rename to the true alpha (`alpha/10`, `alpha/20`) or move hover to a color-opacity step so it reads off the variant token.

### 6. 🟠 Accessible name for icon-only buttons
`icon` and `icon-sm` carry no text. Design can't enforce a name, but each instance needs an `aria-label`. The build warns/relies on the consumer passing one (documented in the story).

### 7. 🟡 Capitalized property values
`Variant=Default|Secondary|Destructive|Outline|Ghost|Link`, `State=Default|Hover|Focus|Loading|Disabled`, `Size=default|sm|lg|icon|icon-sm`. shadcn `cva` values are lowercase. Lowercasing the Figma values removes a translation step. (Sizes are already lowercase — good.)

### 8. 🟡 Default has a non-standard border + shadow
The Default (primary) variant applies a 1px `primary-border` (same hue as the fill, so invisible) and `shadow/xs`. shadcn's primary has no border and no shadow; `shadow-xs` is an Outline-only treatment. **Fix:** drop both from Default.

### 9. 🟡 Target sizes at the floor
`icon-sm` is exactly 24×24 (WCAG 2.2 minimum, no margin); Link `sm` ≈ 16px height. Fine for dense layouts and inline text links, but use larger hit areas where space allows.

### 10. 🟡 Physical icon-slot names in an RTL system
`leftIcon`/`rightIcon` are physical; in RTL they read backwards. Prefer **leading/trailing** (or start/end) so the same prop is correct in both directions.

## What's already right ✅

- **All six shadcn variants present:** default, secondary, destructive, outline, ghost, link.
- **Rich state coverage:** explicit Hover, **Focus**, **Disabled**, plus a **Loading** extension — more than the bare shadcn cva.
- **Typography fully tokenized:** IranYekanX `text-sm` / line-height 20 / weight 500 (`font-medium`) — matches shadcn `text-sm font-medium`. Link uses the underlined token.
- **Heights match shadcn:** default 36 (`h-9`), sm 32 (`h-8`), lg 40 (`h-10`); icon 36 (`size-9`).
- **Base colors correctly bound** to `primary`/`primary-foreground`/`secondary`/`accent`/`input`, and those values match our `globals.css` tokens.
- **Proper component API:** instance-swap `leftIcon`/`rightIcon`, `showLeftIcon`/`showRightIcon` booleans, `buttonText` text prop, radius `rounded-md` (8px), gap `spacing/2` (8px), padding `spacing/4` (16px).

## Prioritized fix list

1. **Rename `icon-sm` (24px) → `icon-xs`** (#1) — resolves the size-name collision with shadcn.
2. **Fix the focus ring** (#2) — bind to `ring` and darken it to ≥ 3:1; it's an a11y blocker.
3. **Rebind destructive / outline / hover off the malformed `custom/*` tokens** (#3–#5) onto clean semantic tokens.
4. **Lowercase property values; drop the Default border+shadow** (#7, #8).
5. **Address a11y notes** (#6, #9, #10): aria-labels on icon-only, mind target sizes, prefer leading/trailing naming.

---
*Read-only audit. Figma was not modified. The accompanying React build (`src/components/ui/button.tsx`) implements the corrected, token-aligned spec.*
