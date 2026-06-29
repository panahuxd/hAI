import type { Preview, Decorator } from "@storybook/react-vite";
import React from "react";

// The generated shadcn / Tailwind v4 theme. Brings in `@import "tailwindcss"`,
// the @font-face rules for IranYekanX, the :root token variables, and the
// `html { direction: rtl }` rule — so the whole canvas is themed + RTL.
import "../src/styles/globals.css";
// Relative-path font override so IranYekanX also resolves on a GitHub Pages
// subpath (see fonts.css). Must come AFTER globals.css to win per weight.
import "./fonts.css";

// Every story renders inside an RTL, IranYekanX, token-themed surface that
// mirrors the consuming app's root.
const withTheme: Decorator = (Story) => (
  <div
    dir="rtl"
    lang="fa"
    className="bg-background text-foreground font-sans antialiased p-6"
  >
    <Story />
  </div>
);

const preview: Preview = {
  decorators: [withTheme],
  parameters: {
    layout: "centered",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true }, // background comes from the token theme
    a11y: { test: "todo" },
  },
};

export default preview;
