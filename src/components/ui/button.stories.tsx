import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus } from "lucide-react";

import { Button } from "./button";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
    },
    size: { control: "select", options: ["default", "sm", "lg", "icon"] },
  },
  args: { children: "دکمه" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Secondary: Story = { args: { variant: "secondary" } };

export const Destructive: Story = { args: { variant: "destructive" } };

export const Outline: Story = { args: { variant: "outline" } };

export const Ghost: Story = { args: { variant: "ghost" } };

export const Link: Story = { args: { variant: "link" } };

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Plus />
        افزودن
      </>
    ),
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Button {...args} size="sm">
        کوچک
      </Button>
      <Button {...args} size="default">
        معمولی
      </Button>
      <Button {...args} size="lg">
        بزرگ
      </Button>
    </div>
  ),
};
