import type { Meta, StoryObj } from "@storybook/react-vite";

// Showcases the shadcn typography roles emitted by globals.css, on IranYekanX,
// RTL. The type scale (text-xs … text-5xl), weights, and the `.typography`
// prose container all come from the token build.
const meta: Meta = {
  title: "Foundations/Typography",
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj;

export const Scale: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-6">
      <p className="text-5xl font-extrabold tracking-tight">۵xl — تیتر بزرگ</p>
      <p className="text-4xl font-extrabold tracking-tight">۴xl — تیتر</p>
      <p className="text-3xl font-semibold">۳xl — زیرتیتر</p>
      <p className="text-2xl font-semibold">۲xl — بخش</p>
      <p className="text-xl text-muted-foreground">xl — لید</p>
      <p className="text-base">base — متن اصلی</p>
      <p className="text-sm font-medium">sm — کوچک</p>
      <p className="text-xs text-muted-foreground">xs — توضیح</p>
    </div>
  ),
};

export const Weights: Story = {
  render: () => (
    <div className="flex flex-col gap-2 p-6 text-2xl">
      <p className="font-normal">font-normal — وزن معمولی</p>
      <p className="font-medium">font-medium — وزن متوسط</p>
      <p className="font-semibold">font-semibold — وزن نیمه‌ضخیم</p>
      <p className="font-bold">font-bold — وزن ضخیم</p>
      <p className="font-extrabold">font-extrabold — وزن خیلی ضخیم</p>
    </div>
  ),
};

export const Prose: Story = {
  render: () => (
    <article className="typography max-w-2xl p-6">
      <h1>عنوان اصلی مقاله</h1>
      <p>
        این یک پاراگراف نمونه است که داخل ظرف <code>.typography</code> قرار گرفته و
        به‌صورت خودکار بر اساس توکن‌ها استایل می‌گیرد.
      </p>
      <h2>زیرعنوان</h2>
      <blockquote>یک نقل‌قول نمونه برای نمایش استایل بلوک‌کوت.</blockquote>
      <ul>
        <li>مورد اول فهرست</li>
        <li>مورد دوم فهرست</li>
      </ul>
    </article>
  ),
};
