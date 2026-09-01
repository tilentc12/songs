import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#090b0e",
        surface: "#11151a",
        card: "#161b22",
        "card-hover": "#1c232c",
        border: "#232a35",
        "border-muted": "#1a2029",
        foreground: "#f0f6fc",
        "muted-foreground": "#8b949e",
        primary: {
          DEFAULT: "#10b981", // Vibrant emerald
          foreground: "#000000",
          hover: "#059669",
          glow: "rgba(16, 185, 129, 0.25)",
        },
        accent: {
          DEFAULT: "#06b6d4",
          foreground: "#000000",
        },
        difficulty: {
          easy: "#10b981",
          medium: "#f59e0b",
          hard: "#f97316",
          expert: "#ef4444",
          impossible: "#a855f7",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "monospace",
        ],
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        wave: {
          "0%, 100%": { height: "4px" },
          "50%": { height: "24px" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
        wave: "wave 1.2s ease-in-out infinite",
        shimmer: "shimmer 1.5s infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
