import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1D4ED8",
        success: "#059669",
        warning: "#D97706",
        danger: "#DC2626",
        surface: {
          50: "#F8F9FA",
          200: "#E5E7EB",
        }
      },
      borderRadius: {
        'md': '8px',
        'full': '9999px',
      },
      spacing: {
        'split-l': '60%',
        'split-r': '40%',
      }
    },
  },
  plugins: [],
};
export default config;