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
          50: "#fff4fa",
          100: "#ffe1ef",
          200: "#ffbfde",
          300: "#ff8cc3",
          400: "#ff52a8",
          500: "#ee2a8b",
          600: "#d11577",
          700: "#a81062",
          800: "#7d0c4a",
          900: "#520831",
        },
        powder: {
          50: "#fff8fb",
          100: "#ffe8f1",
          200: "#ffd0e1",
          300: "#ffb3cd",
        },
        champagne: {
          100: "#fff0e5",
          200: "#ffd9bd",
          300: "#f5b48a",
          400: "#e09464",
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
          50: "#fffafc",
          100: "#fff2f6",
          200: "#ffe3ec",
        },
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 60px -18px rgba(238, 42, 139, 0.22)",
        card: "0 12px 40px -16px rgba(238, 42, 139, 0.18)",
        luxe: "0 30px 80px -28px rgba(238, 42, 139, 0.45)",
        glow: "0 20px 60px -10px rgba(255, 82, 168, 0.55)",
        inset: "inset 0 0 0 1px rgba(10,10,12,0.06)",
      },
      backgroundImage: {
        "fuchsia-gradient": "linear-gradient(135deg, #ee2a8b 0%, #ff52a8 50%, #ff8cc3 100%)",
        "fuchsia-radial": "radial-gradient(circle at top right, #ff52a8 0%, #ee2a8b 45%, #a81062 100%)",
        "vivid-gradient": "linear-gradient(120deg, #ee2a8b 0%, #d11577 60%, #7d0c4a 100%)",
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
