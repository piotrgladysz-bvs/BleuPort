/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        // Bleu Venture Studios brand — electric ultramarine
        brand: {
          50: "#eef0ff",
          100: "#dfe2ff",
          200: "#c4c9ff",
          300: "#a0a6ff",
          400: "#7c84ff",
          500: "#5a5cff",
          600: "#3a37f5",
          700: "#1f1ad9", // primary logo blue
          800: "#1714ad",
          900: "#161589",
          950: "#0c0a52",
        },
        // Deep navy canvas — Alaskan night / maritime
        navy: {
          950: "#05060f",
          900: "#080a1c",
          850: "#0a0e26",
          800: "#0d1330",
          700: "#121a44",
          600: "#1a2456",
          500: "#243168",
        },
        // Glacier accent — icy teal/cyan for maritime touch
        glacier: {
          300: "#9fe9ff",
          400: "#5cd2f5",
          500: "#2bb8e6",
          600: "#1798c7",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(122,132,255,0.18), 0 18px 50px -12px rgba(31,26,217,0.55)",
        card: "0 1px 2px rgba(8,10,28,0.06), 0 12px 32px -16px rgba(8,10,28,0.25)",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #1f1ad9 0%, #3a37f5 45%, #5cd2f5 120%)",
        "hero-radial":
          "radial-gradient(120% 120% at 50% 0%, #11163f 0%, #080a1c 55%, #05060f 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-dot": {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        "slide-in": "slide-in 0.3s ease-out both",
        shimmer: "shimmer 2.2s linear infinite",
        "pulse-dot": "pulse-dot 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
