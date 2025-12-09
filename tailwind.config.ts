import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"Courier New"', 'Courier', 'monospace'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      lineHeight: {
        'tight': '1.1',
        'snug': '1.3',
        'normal': '1.5',
        'relaxed': '1.7',
      },
      maxWidth: {
        '7xl': '1400px',
        '8xl': '1600px',
      },
    },
  },
  plugins: [],
} satisfies Config