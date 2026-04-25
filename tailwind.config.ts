import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          50: "#fbf3f4",
          100: "#f6e4e8",
          200: "#edc8d1",
          300: "#dfa6b5",
          400: "#c98299",
          500: "#b06681",
          600: "#8f4f68",
          700: "#744054",
          800: "#5d3443",
          900: "#4a2a37",
        },
        powder: {
          50: "#fdf7f8",
          100: "#faeaee",
          200: "#f3d4dc",
          300: "#ebbac6",
        },
        champagne: {
          100: "#f7eddf",
          200: "#e9d6bd",
          300: "#cdb08a",
          400: "#b08f64",
        },
        ink: {
          950: "#060608",
          900: "#0a0a0c",
          800: "#141416",
          700: "#1f1f22",
          600: "#353539",
          500: "#55555a",
        },
        bone: {
          50: "#fcfaf7",
          100: "#f7f2ec",
          200: "#ece3d8",
        },
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 60px -18px rgba(74, 42, 55, 0.18)",
        card: "0 12px 40px -16px rgba(10, 10, 12, 0.14)",
        luxe: "0 30px 80px -28px rgba(143, 79, 104, 0.32)",
        inset: "inset 0 0 0 1px rgba(10,10,12,0.06)",
      },
      letterSpacing: {
        luxe: "0.24em",
        editorial: "0.32em",
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        shimmer: "shimmer 2.5s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%,100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
