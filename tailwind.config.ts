import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        farm: {
          green: "#4CAF50",
          brown: "#8B5E3C",
          yellow: "#F4B400",
          light: "#F9F7F3",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;