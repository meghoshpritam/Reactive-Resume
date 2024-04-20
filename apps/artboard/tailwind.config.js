const { createGlobPatternsForDependencies } = require("@nx/react/tailwind");
const { join } = require("path");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    join(__dirname, "{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}"),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        text: "var(--color-text)",
        primary: "var(--color-primary)",
        background: "var(--color-background)",
      },
      fontSize: {
        15: "0.9375rem",
        17: "1.0625rem",
        18: "1.125rem",
        19: "1.1875rem",
        20: "1.25rem",
        21: "1.3125rem",
        22: "1.375rem",
        23: "1.4375rem",
        24: "1.5rem",
        26: "1.625rem",
        28: "1.75rem",
        30: "1.875rem",
        31: "1.9375rem",
        32: "2rem",
        33: "2.0625rem",
        34: "2.125rem",
      },
      lineHeight: {
        tight: "calc(var(--line-height) - 0.5)",
        snug: "calc(var(--line-height) - 0.3)",
        normal: "var(--line-height)",
        relaxed: "calc(var(--line-height) + 0.3)",
        loose: "calc(var(--line-height) + 0.5)",
      },
      spacing: { custom: "var(--margin)" },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
