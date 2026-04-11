import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./client/index.html", "./client/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Barlow Condensed"', '"Arial Narrow"', "sans-serif"],
        body: ['"Barlow"', '"Helvetica Neue"', "sans-serif"],
      },
      colors: {
        red: { DEFAULT: "#C8102E", bright: "#E8152F" },
        navy: "#0D1520",
        surface: { DEFAULT: "#141C26", "2": "#1A2436" },
        border: "#253044",
        muted: "#7A8FA8",
        faint: "#3D5068",
        text: "#E8EDF5",
      },
      borderRadius: {
        lg: "0.5625rem",
        md: "0.375rem",
        sm: "0.1875rem",
      },
    },
  },
  plugins: [],
};

export default config;
