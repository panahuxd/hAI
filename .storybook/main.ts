import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
  ],
  framework: "@storybook/react-vite",
  // Serve the committed IranYekanX woff2 files at /fonts so the @font-face
  // rules in globals.css (which use absolute /fonts/* URLs) resolve in dev.
  staticDirs: [{ from: "../fonts", to: "/fonts" }],
  // Emit relative asset URLs in the static build so Storybook (and the
  // bundled fonts) work when deployed under a GitHub Pages subpath (/hAI/).
  viteFinal: async (config, { configType }) => {
    if (configType === "PRODUCTION") config.base = "./";
    return config;
  },
};

export default config;
