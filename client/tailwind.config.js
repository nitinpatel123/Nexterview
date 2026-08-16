/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Primary — deep indigo-navy, the brand's core voice
        primary: {
          50: "#EEF0FC",
          100: "#DCE0F8",
          200: "#B9C0F0",
          300: "#8D95E0",
          400: "#5F63C4",
          500: "#3B3F9E",
          600: "#2E3180",
          700: "#232561",
          800: "#191A47",
        },
        // Accent — achievement gold, used sparingly for highlights/success moments
        accent: {
          50: "#FDF6E7",
          100: "#FBEAC4",
          400: "#E7A93E",
          500: "#D69324",
          600: "#B67816",
        },
        ink: "#171833",
        gray: {
          50: "#F7F7FB",
        },
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(23,24,51,0.05), 0 1px 3px 0 rgba(23,24,51,0.06)",
        md: "0 6px 20px -4px rgba(23,24,51,0.12), 0 2px 6px -2px rgba(23,24,51,0.08)",
        card: "0 1px 3px 0 rgba(23,24,51,0.06), 0 1px 2px -1px rgba(23,24,51,0.05)",
      },
    },
  },
  plugins: [],
};
