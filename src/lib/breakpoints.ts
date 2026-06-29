import * as React from "react";

/**
 * Breakpoint scale — the Tailwind v4 / shadcn standard.
 *
 * The CSS source of truth is `tokens/primitives.json` → `breakpoint.*`, emitted
 * as the `--breakpoint-*` theme vars in `globals.css` (so `sm:`/`md:`/`lg:`/
 * `xl:`/`2xl:` and `min-*`/`max-*` utilities all work). These px values are the
 * JS mirror of that scale for `matchMedia` / runtime checks — keep them in sync
 * with the token file.
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/** Mobile = narrower than the `md` breakpoint (shadcn's use-mobile standard). */
export const MOBILE_BREAKPOINT = BREAKPOINTS.md;

/**
 * `true` when the viewport is at or above `breakpoint` (a `min-width` match).
 * SSR-safe: returns `false` until mounted.
 *
 *   const isDesktop = useBreakpoint("lg");
 */
export function useBreakpoint(breakpoint: Breakpoint): boolean {
  const min = BREAKPOINTS[breakpoint];
  const [matches, setMatches] = React.useState(false);
  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${min}px)`);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [min]);
  return matches;
}

/**
 * `true` on viewports narrower than `md` (768px). Mirrors shadcn's `useIsMobile`
 * so behavior matches the standard `use-mobile` hook.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return !!isMobile;
}
