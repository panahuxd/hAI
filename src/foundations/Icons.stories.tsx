import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Icon } from "@/components/ui/icon";
import { iconRegistry, type IconName } from "@/lib/icons";

// The approved icon vocabulary. One gallery — not one story per icon. Click a
// tile to copy its import statement.
const meta: Meta = {
  title: "Foundations/Icons",
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

function IconTile({ name }: { name: IconName }) {
  const [copied, setCopied] = useState(false);
  const importLine = `import { ${name} } from "@/lib/icons";`;
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard?.writeText(importLine);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1200);
      }}
      title={importLine}
      className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-4 text-card-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      <Icon icon={iconRegistry[name]} className="size-6" />
      <span className="text-xs text-muted-foreground" dir="ltr">
        {copied ? "کپی شد!" : name}
      </span>
    </button>
  );
}

export const Gallery: Story = {
  render: () => {
    const names = Object.keys(iconRegistry) as IconName[];
    return (
      <div className="p-6">
        <p className="mb-4 text-sm text-muted-foreground">
          {names.length} آیکون تأییدشده. روی هر کدام بزنید تا دستور import کپی شود.
        </p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {names.map((name) => (
            <IconTile key={name} name={name} />
          ))}
        </div>
      </div>
    );
  },
};
