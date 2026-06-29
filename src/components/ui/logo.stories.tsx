import type { Meta, StoryObj } from "@storybook/react-vite";

import { Logo } from "./logo";

const meta = {
  title: "Components/Logo",
  component: Logo,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["full", "standalone"],
      description: "`full` includes the Digikala wordmark; `standalone` omits it.",
    },
    title: { control: "text" },
  },
  args: { variant: "full" },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Full: Story = {
  args: { variant: "full" },
};

export const Standalone: Story = {
  args: { variant: "standalone" },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-4">
      <Logo {...args} className="h-6 w-auto text-primary" />
      <Logo {...args} className="h-8 w-auto text-primary" />
      <Logo {...args} className="h-12 w-auto text-primary" />
    </div>
  ),
};

// The logo is monochrome and uses currentColor, so any text-* utility recolors it.
export const OnDarkSurface: Story = {
  args: { variant: "full" },
  parameters: { layout: "fullscreen" },
  render: (args) => (
    <div className="flex items-center justify-center bg-primary p-10">
      <Logo {...args} className="h-10 w-auto text-primary-foreground" />
    </div>
  ),
};
