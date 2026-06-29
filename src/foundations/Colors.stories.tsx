import type { Meta, StoryObj } from "@storybook/react-vite";

// Documents the semantic color tokens emitted by globals.css. Pairs are
// rendered foreground-on-background so contrast is visible at a glance.
const PAIRS: { name: string; bg: string; fg: string }[] = [
  { name: "background / foreground", bg: "bg-background", fg: "text-foreground" },
  { name: "card", bg: "bg-card", fg: "text-card-foreground" },
  { name: "popover", bg: "bg-popover", fg: "text-popover-foreground" },
  { name: "primary", bg: "bg-primary", fg: "text-primary-foreground" },
  { name: "secondary", bg: "bg-secondary", fg: "text-secondary-foreground" },
  { name: "muted", bg: "bg-muted", fg: "text-muted-foreground" },
  { name: "accent", bg: "bg-accent", fg: "text-accent-foreground" },
  { name: "destructive", bg: "bg-destructive", fg: "text-destructive-foreground" },
  { name: "info", bg: "bg-info", fg: "text-info-foreground" },
  { name: "success", bg: "bg-success", fg: "text-success-foreground" },
  { name: "warning", bg: "bg-warning", fg: "text-warning-foreground" },
  { name: "sidebar", bg: "bg-sidebar", fg: "text-sidebar-foreground" },
];

function Swatch({ name, bg, fg }: { name: string; bg: string; fg: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className={`${bg} ${fg} flex h-24 items-end p-3`}>
        <span className="text-sm font-medium">نمونه متن</span>
      </div>
      <div className="bg-background p-2 text-center text-xs text-muted-foreground">
        {name}
      </div>
    </div>
  );
}

const meta: Meta = {
  title: "Foundations/Colors",
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

export const Semantic: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-3 lg:grid-cols-4">
      {PAIRS.map((p) => (
        <Swatch key={p.name} {...p} />
      ))}
    </div>
  ),
};

// Class names are written as literals so Tailwind's source scanner emits them.
const CHARTS = [
  { n: 1, cls: "bg-chart-1" },
  { n: 2, cls: "bg-chart-2" },
  { n: 3, cls: "bg-chart-3" },
  { n: 4, cls: "bg-chart-4" },
  { n: 5, cls: "bg-chart-5" },
];

export const Charts: Story = {
  render: () => (
    <div className="flex gap-3 p-6">
      {CHARTS.map(({ n, cls }) => (
        <div key={n} className="flex flex-col items-center gap-2">
          <div className={`size-16 rounded-lg ${cls}`} />
          <span className="text-xs text-muted-foreground">chart-{n}</span>
        </div>
      ))}
    </div>
  ),
};
