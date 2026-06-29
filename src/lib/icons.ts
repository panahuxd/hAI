/**
 * Curated icon vocabulary for the design system.
 *
 * The DS uses [lucide](https://lucide.dev) icons. This module is the single,
 * governed surface: only icons re-exported here are "approved" for use. Import
 * them by name (tree-shakes — only what you use is bundled) and render through
 * the `<Icon>` wrapper for consistent size / stroke / RTL behavior:
 *
 *   import { Icon } from "@/components/ui/icon";
 *   import { Search, ChevronRight } from "@/lib/icons";
 *   <Icon icon={Search} />
 *   <Icon icon={ChevronRight} />   // auto-mirrors in RTL
 *
 * To approve a new icon: add it to the import + the `iconRegistry` below.
 * (This starter set is a common UI vocabulary — reconcile it against the icons
 * actually used in the Figma components over time.)
 */
import {
  // Navigation / chrome
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  MoreHorizontal,
  MoreVertical,
  // Actions
  Plus,
  Minus,
  Check,
  Search,
  Settings,
  Pencil,
  Trash2,
  Copy,
  Download,
  Upload,
  RefreshCw,
  Filter,
  Share2,
  LogIn,
  LogOut,
  // Status / feedback
  Info,
  Bell,
  CircleCheck,
  CircleAlert,
  TriangleAlert,
  CircleX,
  LoaderCircle,
  // Objects
  User,
  Calendar,
  Clock,
  Eye,
  EyeOff,
  Lock,
  Home,
  Mail,
  Star,
  Heart,
  type LucideIcon,
} from "lucide-react";

// Re-export for direct, tree-shakeable named imports.
export {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  MoreHorizontal,
  MoreVertical,
  Plus,
  Minus,
  Check,
  Search,
  Settings,
  Pencil,
  Trash2,
  Copy,
  Download,
  Upload,
  RefreshCw,
  Filter,
  Share2,
  LogIn,
  LogOut,
  Info,
  Bell,
  CircleCheck,
  CircleAlert,
  TriangleAlert,
  CircleX,
  LoaderCircle,
  User,
  Calendar,
  Clock,
  Eye,
  EyeOff,
  Lock,
  Home,
  Mail,
  Star,
  Heart,
};
export type { LucideIcon };

/**
 * Name → component map of the approved icons. Importing this pulls the whole
 * set into the bundle, so it's meant for the Storybook gallery and name-based
 * lookups — app code should prefer the named imports above.
 */
export const iconRegistry = {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  MoreHorizontal,
  MoreVertical,
  Plus,
  Minus,
  Check,
  Search,
  Settings,
  Pencil,
  Trash2,
  Copy,
  Download,
  Upload,
  RefreshCw,
  Filter,
  Share2,
  LogIn,
  LogOut,
  Info,
  Bell,
  CircleCheck,
  CircleAlert,
  TriangleAlert,
  CircleX,
  LoaderCircle,
  User,
  Calendar,
  Clock,
  Eye,
  EyeOff,
  Lock,
  Home,
  Mail,
  Star,
  Heart,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconRegistry;
