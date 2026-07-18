import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "accent-cyan": "var(--accent-cyan, #22d3ee)",
        "accent-emerald": "var(--accent-emerald, #10b981)",
        "accent-blue": "var(--accent-blue, #3b82f6)",
        "state-success": "var(--state-success, #10b981)",
        "state-warning": "var(--state-warning, #f59e0b)",
        "state-critical": "var(--state-critical, #ef4444)",
      },
      fontFamily: {
        mono: ["Courier New", "monospace"],
        display: ["system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
