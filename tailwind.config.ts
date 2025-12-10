import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        white: "#FFFFFF",
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', "Helvetica", "Arial", "sans-serif"],
        mono: ['"Courier New"', "Courier", "monospace"],
      },
      maxWidth: {
        "screen-2xl": "1536px",
      },
    },
  },
  plugins: [],
} satisfies Config;
