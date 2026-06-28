# Fonts

The sans family for this token system is **IranYekanX** (Persian / RTL). The
`@font-face` rules in [`../src/styles/globals.css`](../src/styles/globals.css)
load these woff2 files. All 11 weights are committed here:

| `font-weight` | Style | File |
|---|---|---|
| 100 | Thin | `IRANYekanX-Thin.woff2` |
| 200 | UltraLight | `IRANYekanX-UltraLight.woff2` |
| 300 | Light | `IRANYekanX-Light.woff2` |
| 400 | Regular | `IRANYekanX-Regular.woff2` |
| 500 | Medium | `IRANYekanX-Medium.woff2` |
| 600 | DemiBold | `IRANYekanX-DemiBold.woff2` |
| 700 | Bold | `IRANYekanX-Bold.woff2` |
| 800 | ExtraBold | `IRANYekanX-ExtraBold.woff2` |
| 900 | Black | `IRANYekanX-Black.woff2` |
| 950 | ExtraBlack | `IRANYekanX-ExtraBlack.woff2` |
| 1000 | Heavy | `IRANYekanX-Heavy.woff2` |

## Serving

Serve this directory at `/fonts/` in the consuming app (e.g. copy these files to
the app's `public/fonts/`), or edit the `@font-face` `src` paths in
`globals.css` to point at your CDN / licensed host.

> **License:** IranYekanX is a licensed font. This repository is **private** —
> keep it private, and ensure your usage complies with your IranYekanX license.
