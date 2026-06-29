import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";
import { Icon } from "./icon";
import { Plus, Download, ChevronLeft } from "@/lib/icons";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"],
    },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    asChild: { control: false },
  },
  args: { children: "دکمه", variant: "default", size: "default" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Secondary: Story = { args: { variant: "secondary" } };
export const Destructive: Story = { args: { variant: "destructive" } };
export const Outline: Story = { args: { variant: "outline" } };
export const Ghost: Story = { args: { variant: "ghost" } };
export const Link: Story = { args: { variant: "link" } };

// All six variants together.
export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} variant="default">پیش‌فرض</Button>
      <Button {...args} variant="secondary">ثانویه</Button>
      <Button {...args} variant="destructive">حذف</Button>
      <Button {...args} variant="outline">خطی</Button>
      <Button {...args} variant="ghost">شبح</Button>
      <Button {...args} variant="link">پیوند</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} size="sm">کوچک</Button>
      <Button {...args} size="default">معمولی</Button>
      <Button {...args} size="lg">بزرگ</Button>
    </div>
  ),
};

// Icons come from @/lib/icons. In RTL, directional icons mirror via <Icon>.
export const WithIcons: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args}>
        <Plus />
        افزودن
      </Button>
      <Button {...args} variant="outline">
        <Download />
        دانلود
      </Button>
      <Button {...args} variant="ghost">
        ادامه
        <Icon icon={ChevronLeft} />
      </Button>
    </div>
  ),
};

// Icon-only buttons MUST carry an accessible name (audit finding #6).
export const IconOnly: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} size="icon-xs" aria-label="افزودن"><Plus /></Button>
      <Button {...args} size="icon-sm" aria-label="افزودن"><Plus /></Button>
      <Button {...args} size="icon" aria-label="افزودن"><Plus /></Button>
      <Button {...args} size="icon-lg" aria-label="افزودن"><Plus /></Button>
    </div>
  ),
};

export const Loading: Story = {
  args: { loading: true, children: "در حال ارسال" },
};

export const Disabled: Story = {
  args: { disabled: true },
};
