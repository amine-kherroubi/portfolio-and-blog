import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        white: "#FFFFFF",
        gray: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#E8E8E8",
          300: "#D4D4D4",
          400: "#A3A3A3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', "Helvetica", "Arial", "sans-serif"],
        mono: ['"Courier New"', "Courier", "monospace"],
      },
      spacing: {
        "0.5": "2px",
        "18": "72px",
        "128": "512px",
        "144": "576px",
      },
      fontSize: {
        "2xs": "0.6875rem", // 11px
        xs: "0.8125rem", // 13px
        sm: "0.9375rem", // 15px
        base: "1rem", // 16px
        lg: "1.125rem", // 18px
        xl: "1.25rem", // 20px
        "2xl": "1.5rem", // 24px
        "3xl": "1.75rem", // 28px
        "4xl": "2rem", // 32px
        "5xl": "2.25rem", // 36px
        "6xl": "2.75rem", // 44px
        "7xl": "3.5rem", // 56px
        "8xl": "4.5rem", // 72px
        "9xl": "6rem", // 96px
      },
      lineHeight: {
        none: "1",
        tight: "1.1",
        snug: "1.2",
        normal: "1.5",
        relaxed: "1.6",
        loose: "1.75",
      },
      letterSpacing: {
        tighter: "-0.03em",
        tight: "-0.02em",
        normal: "0",
        wide: "0.05em",
        wider: "0.1em",
        widest: "0.15em",
      },
      maxWidth: {
        "7xl": "1400px",
        "8xl": "1600px",
      },
      borderWidth: {
        "1": "1px",
        "3": "3px",
      },
      transitionDuration: {
        "200": "200ms",
      },
      transitionTimingFunction: {
        ease: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
