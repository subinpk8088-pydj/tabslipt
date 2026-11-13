/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: { tab: { 50: "#fff1f2", 100: "#ffe4e6", 500: "#f43f5e", 600: "#e11d48", 700: "#be123c" }, paper: "#fbfaf8" },
      fontFamily: { sans: ["Outfit", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
};
