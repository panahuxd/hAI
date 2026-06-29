import type { Meta, StoryObj } from "@storybook/react-vite";

import { BREAKPOINTS, type Breakpoint, useBreakpoint } from "@/lib/breakpoints";

// Documents the Tailwind v4 / shadcn breakpoint scale wired into the tokens.
const meta: Meta = {
  title: "Foundations/Breakpoints",
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

const ROWS: { name: Breakpoint; px: number }[] = (
  Object.keys(BREAKPOINTS) as Breakpoint[]
).map((name) => ({ name, px: BREAKPOINTS[name] }));

export const Scale: Story = {
  render: () => (
    <div className="p-6" dir="rtl">
      <table className="w-full max-w-xl border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            <th className="py-2 text-start font-medium">نام</th>
            <th className="py-2 text-start font-medium">حداقل عرض</th>
            <th className="py-2 text-start font-medium">rem</th>
            <th className="py-2 text-start font-medium">پیشوند Tailwind</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map(({ name, px }) => (
            <tr key={name} className="border-b border-border">
              <td className="py-2 font-medium">{name}</td>
              <td className="py-2" dir="ltr">{px}px</td>
              <td className="py-2 text-muted-foreground" dir="ltr">{px / 16}rem</td>
              <td className="py-2" dir="ltr">
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{name}:</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

function ActiveBadge({ name }: { name: Breakpoint }) {
  const active = useBreakpoint(name);
  return (
    <span
      dir="ltr"
      className={`rounded-md px-3 py-1 text-sm font-medium ${
        active
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground"
      }`}
    >
      {name} {active ? "✓" : ""}
    </span>
  );
}

// Resize the Storybook canvas/window to watch breakpoints activate live.
export const Live: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-6" dir="rtl">
      <p className="text-sm text-muted-foreground">
        پنجره را تغییر اندازه دهید تا بریک‌پوینت‌های فعال را ببینید (min-width).
      </p>
      <div className="flex flex-wrap gap-2">
        {ROWS.map(({ name }) => (
          <ActiveBadge key={name} name={name} />
        ))}
      </div>
    </div>
  ),
};
