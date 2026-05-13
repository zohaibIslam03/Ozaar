import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg:       "#FFFFFF",
          surface:  "#F7F7F7",
          card:     "#FFFFFF",
          border:   "#E8E8E8",
          text:     "#111111",
          muted:    "#6B6B6B",
          red:      "#DF0A09",
          redLight: "#F5F5F5",
          redDark:  "#B30807",
        },
      },
      fontFamily: {
        sans:    ["var(--font-inter)",    "system-ui", "sans-serif"],
        heading: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
