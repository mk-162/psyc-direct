import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // LMO King Brand Colors
        'lmo-navy': {
          DEFAULT: '#0D0D2B',
          light: '#0A0A1F',
        },
        'lmo-dark': {
          '50': '#f5f5f8',
          '100': '#e8e8f0',
          '600': '#0a0020',
          '700': '#080019',
          DEFAULT: '#0a0020',
        },
        'lmo-cyan': {
          DEFAULT: '#0a0020',
          light: '#080019',
        },
        'lmo-blue': {
          DEFAULT: '#4D7CFF',
          light: '#5B8AFF',
        },
        'lmo-pink': {
          DEFAULT: '#FF5C93',
          light: '#FF6B9D',
        },
        'lmo-magenta': {
          DEFAULT: '#D946FF',
          light: '#E355FF',
        },
        'lmo-purple': {
          DEFAULT: '#7B2CBF',
          light: '#8B3FD6',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0a0020 0%, #4D7CFF 100%)',
        'gradient-accent': 'linear-gradient(135deg, #FF5C93 0%, #D946FF 100%)',
        'gradient-full': 'linear-gradient(135deg, #0a0020 0%, #4D7CFF 25%, #FF5C93 50%, #D946FF 75%, #7B2CBF 100%)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
};

export default config;
