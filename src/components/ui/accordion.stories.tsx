import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

const meta = {
  title: "Components/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { type: "single", collapsible: true, className: "w-full max-w-md" },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { defaultValue: "item-1" },
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>اطلاعات محصول</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-muted-foreground">
          <p>
            محصول پرچم‌دار ما فناوری روز را با طراحی شکیل ترکیب می‌کند و با مواد
            مرغوب، عملکرد و پایداری بی‌نظیری ارائه می‌دهد.
          </p>
          <p>
            از ویژگی‌های کلیدی می‌توان به پردازش پیشرفته و رابط کاربری ساده برای
            تازه‌کارها و حرفه‌ای‌ها اشاره کرد.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>جزئیات ارسال</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-muted-foreground">
          <p>
            ارسال به سراسر کشور از طریق پست و پیک انجام می‌شود. ارسال عادی ۳ تا ۵
            روز کاری و ارسال سریع ۱ تا ۲ روز کاری زمان می‌برد.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>سیاست بازگشت کالا</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-muted-foreground">
          <p>
            تا ۷ روز پس از دریافت کالا، در صورت عدم رضایت می‌توانید کالا را در
            بسته‌بندی اصلی بازگردانید.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

// type="multiple": several items can stay open at once.
export const Multiple: Story = {
  args: { type: "multiple", defaultValue: ["item-1", "item-2"] },
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>پرسش اول</AccordionTrigger>
        <AccordionContent className="text-muted-foreground">پاسخ پرسش اول در این بخش نمایش داده می‌شود.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>پرسش دوم</AccordionTrigger>
        <AccordionContent className="text-muted-foreground">پاسخ پرسش دوم در این بخش نمایش داده می‌شود.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>پرسش سوم</AccordionTrigger>
        <AccordionContent className="text-muted-foreground">پاسخ پرسش سوم در این بخش نمایش داده می‌شود.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const WithDisabledItem: Story = {
  args: { defaultValue: "item-1" },
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>آیتم فعال</AccordionTrigger>
        <AccordionContent className="text-muted-foreground">این آیتم قابل باز و بسته شدن است.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" disabled>
        <AccordionTrigger>آیتم غیرفعال</AccordionTrigger>
        <AccordionContent className="text-muted-foreground">این محتوا قابل دسترسی نیست.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
