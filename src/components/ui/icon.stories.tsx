import type { Meta, StoryObj } from "@storybook/react-vite";

import { Icon } from "./icon";
import { ChevronRight, Search, Bell, Settings } from "@/lib/icons";

const meta = {
  title: "Components/Icon",
  component: Icon,
  tags: ["autodocs"],
  args: { icon: Search },
  argTypes: {
    icon: { control: false },
    mirror: { control: "inline-radio", options: ["auto", true, false] },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4 text-foreground">
      <Icon {...args} icon={Settings} className="size-4" />
      <Icon {...args} icon={Settings} className="size-5" />
      <Icon {...args} icon={Settings} className="size-6" />
      <Icon {...args} icon={Settings} className="size-8" />
    </div>
  ),
};

// Icons use currentColor, so any text-* utility recolors them.
export const Colors: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Icon {...args} icon={Bell} className="size-6 text-foreground" />
      <Icon {...args} icon={Bell} className="size-6 text-muted-foreground" />
      <Icon {...args} icon={Bell} className="size-6 text-primary" />
      <Icon {...args} icon={Bell} className="size-6 text-destructive" />
    </div>
  ),
};

// In this RTL system, directional icons auto-mirror. The story canvas is RTL,
// so `mirror="auto"` points the chevron leftward (forward in RTL); forcing
// `mirror={false}` keeps the raw lucide orientation.
export const RtlMirroring: Story = {
  render: () => (
    <div className="flex items-center gap-8 text-foreground">
      <span className="flex items-center gap-1 text-sm">
        auto <Icon icon={ChevronRight} mirror="auto" className="size-5" />
      </span>
      <span className="flex items-center gap-1 text-sm">
        off <Icon icon={ChevronRight} mirror={false} className="size-5" />
      </span>
    </div>
  ),
};

export const InlineWithText: Story = {
  render: (args) => (
    <p className="flex items-center gap-2 text-base text-foreground">
      <Icon {...args} icon={Search} />
      جستجو در میان نتایج
    </p>
  ),
};
