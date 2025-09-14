/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gray: {
          900: "#111827",
          800: "#1F2937",
          700: "#374151",
          600: "#4B5563",
          500: "#6B7280",
          400: "#9CA3AF",
          300: "#D1D5DB",
          200: "#E5E7EB",
          100: "#F3F4F6",
        },
        indigo: {
          500: "#6366F1",
          400: "#818CF8",
        },
        purple: {
          400: "#C084FC",
          500: "#A855F7",
          600: "#9333EA",
        },
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
      },
      animation: {
        blob: "blob 7s infinite",
      },
      transitionDelay: {
        2000: "2000ms",
        4000: "4000ms",
      },
      backgroundSize: {
        "300%": "300% 300%",
      },
    },
  },
  plugins: [],
};
