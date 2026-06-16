/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./_layouts/**/*.html",
    "./_includes/**/*.html",
    "./_pages/**/*.{html,md}",
    "./_portfolio/**/*.md",
    "./_data/**/*.yml",
    "./assets/js/home.js",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--c-bg)", panel: "var(--c-panel)", panel2: "var(--c-panel2)", line: "var(--c-line)",
        fg: "var(--c-fg)", dim: "var(--c-dim)", dimmer: "var(--c-dimmer)",
        term: "var(--c-term)", link: "var(--c-link)", pink: "var(--c-pink)", amber: "var(--c-amber)",
      },
      fontFamily: {
        disp: ['"Space Grotesk"', "system-ui", "sans-serif"],
        body: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};
