import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#002215",
        "primary-container": "#173829",
        "on-primary": "#ffffff",
        "on-primary-container": "#7fa28e",
        "primary-fixed": "#c6ebd5",
        "primary-fixed-dim": "#aacfba",
        "on-primary-fixed": "#002114",
        "on-primary-fixed-variant": "#2d4d3d",
        "inverse-primary": "#aacfba",

        "secondary": "#2c694e",
        "secondary-container": "#aeeecb",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#316e52",
        "secondary-fixed": "#b1f0ce",
        "secondary-fixed-dim": "#95d4b3",
        "on-secondary-fixed": "#002114",
        "on-secondary-fixed-variant": "#0e5138",

        "tertiary": "#102117",
        "tertiary-container": "#25362b",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#8c9f90",
        "tertiary-fixed": "#d3e8d7",
        "tertiary-fixed-dim": "#b8cbbc",
        "on-tertiary-fixed": "#0e1f15",
        "on-tertiary-fixed-variant": "#394b3f",

        "surface": "#f9f9ff",
        "surface-dim": "#cfdaf2",
        "surface-bright": "#f9f9ff",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f0f3ff",
        "surface-container": "#e7eeff",
        "surface-container-high": "#dee8ff",
        "surface-container-highest": "#d8e3fb",
        "surface-tint": "#446554",
        "surface-variant": "#d8e3fb",

        "on-surface": "#111c2d",
        "on-surface-variant": "#414844",
        "on-background": "#111c2d",
        "background": "#f9f9ff",

        "inverse-surface": "#263143",
        "inverse-on-surface": "#ecf1ff",

        "outline": "#727973",
        "outline-variant": "#c1c8c2",

        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
      },
      fontFamily: {
        headline: ["'Plus Jakarta Sans'", "sans-serif"],
        body: ["Inter", "sans-serif"],
        "headline-xl": ["'Plus Jakarta Sans'", "sans-serif"],
        "headline-lg": ["'Plus Jakarta Sans'", "sans-serif"],
        "headline-md": ["'Plus Jakarta Sans'", "sans-serif"],
        "headline-sm": ["'Plus Jakarta Sans'", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"],
        "label-lg": ["Inter", "sans-serif"],
        "label-md": ["Inter", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
        full: "9999px",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      }
    },
  },
  plugins: [],
};

export default config;
