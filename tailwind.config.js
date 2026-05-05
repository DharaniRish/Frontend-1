/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Playfair Display", "Georgia", "serif"]
      },
      colors: {
        ink: "#111827",
        pearl: "#f7f3ee",
        gold: "#b88936"
      },
      boxShadow: {
        premium: "0 24px 70px rgba(17,24,39,0.14)"
      }
    }
  },
  plugins: []
};
