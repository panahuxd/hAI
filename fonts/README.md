# Fonts

The sans family for this token system is **IranYekanX** (Persian / RTL). The
`@font-face` rules in [`../src/styles/globals.css`](../src/styles/globals.css)
load the files from this directory by these exact names:

| Weight | Expected file |
|---|---|
| 400 (Regular) | `IRANYekanX-Regular.woff2` |
| 700 (Bold) | `IRANYekanX-Bold.woff2` |

## Adding the files

Drop the licensed `IRANYekanX-Regular.woff2` and `IRANYekanX-Bold.woff2` files
into this folder, then serve it at `/fonts/` in the consuming app (e.g. copy to
the app's `public/fonts/`).

> The font binaries are **not committed** — `*.woff2` is git-ignored so licensed
> fonts aren't published in this public repo. Either supply the files locally, or
> edit the `@font-face` `src` in `globals.css` to point at your CDN / licensed host.
