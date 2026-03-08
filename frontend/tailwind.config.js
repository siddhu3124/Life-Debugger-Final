/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "ld-bg": "#020617",
        "ld-sidebar": "#020617",
        "ld-surface": "#020617",
        "ld-border": "#1e293b",
        "ld-accent": "#22c55e"
      }
    }
  },
  plugins: [],
};


