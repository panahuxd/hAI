import * as React from "react";
import type { LucideIcon, LucideProps } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * lucide icons whose meaning depends on reading direction. In this RTL system
 * they are mirrored horizontally so they point the correct way. Extend as new
 * directional icons are approved.
 */
export const DIRECTIONAL_ICONS = new Set<string>([
  "ArrowLeft",
  "ArrowRight",
  "ChevronLeft",
  "ChevronRight",
  "ChevronsLeft",
  "ChevronsRight",
  "CornerDownLeft",
  "CornerDownRight",
  "CornerUpLeft",
  "CornerUpRight",
  "Reply",
  "ReplyAll",
  "Forward",
  "Undo2",
  "Redo2",
  "LogIn",
  "LogOut",
  "PanelLeft",
  "PanelRight",
]);

export interface IconProps extends Omit<LucideProps, "ref"> {
  /** An approved lucide icon component, e.g. imported from `@/lib/icons`. */
  icon: LucideIcon;
  /**
   * Mirror horizontally in RTL. `"auto"` (default) flips only known
   * directional icons (chevrons, arrows, …); `true` / `false` force it.
   */
  mirror?: boolean | "auto";
}

/**
 * Design-system icon wrapper around lucide-react. Bakes in the DS defaults:
 * 16px (`size-4`), `currentColor` (inherits text color), no flex-shrink, a
 * consistent stroke width, and RTL mirroring for directional glyphs.
 *
 *   import { Icon } from "@/components/ui/icon";
 *   import { Search, ChevronRight } from "@/lib/icons";
 *
 *   <Icon icon={Search} />                  // 16px, currentColor
 *   <Icon icon={Search} className="size-5 text-muted-foreground" />
 *   <Icon icon={ChevronRight} />            // auto-mirrors in RTL
 *
 * Icons are decorative by default (`aria-hidden`). For a standalone meaningful
 * icon, pass `aria-hidden={false}` and an `aria-label`.
 */
export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  (
    { icon: IconComponent, mirror = "auto", strokeWidth = 2, className, ...props },
    ref
  ) => {
    const name =
      (IconComponent as { displayName?: string }).displayName ?? "";
    const shouldMirror =
      mirror === true || (mirror === "auto" && DIRECTIONAL_ICONS.has(name));
    return (
      <IconComponent
        ref={ref}
        aria-hidden
        strokeWidth={strokeWidth}
        className={cn(
          "inline-block size-4 shrink-0",
          shouldMirror && "rtl:-scale-x-100",
          className
        )}
        {...props}
      />
    );
  }
);
Icon.displayName = "Icon";
