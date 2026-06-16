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
        bg: "#06080d", panel: "#0c1119", panel2: "#0f1622", line: "#172231",
        fg: "#d7e2ee", dim: "#5d6b7d", dimmer: "#3a4656",
        term: "#3ddc97", link: "#4d9fff", pink: "#ff5d73", amber: "#ffcf5c",
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
