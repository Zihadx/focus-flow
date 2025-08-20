import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef9ff",
          100: "#d7f0ff",
          200: "#aee0ff",
          300: "#7ccaff",
          400: "#4ab2ff",
          500: "#1f98ff",
          600: "#0c7ae6",
          700: "#075eb4",
          800: "#064b8e",
          900: "#073f73",
        },
      },
      boxShadow: {
        soft: "0 4px 30px rgba(0,0,0,0.06)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
        pop: {
          "0%": { transform: "scale(0.9)", opacity: "0.6" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        pop: "pop 250ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
