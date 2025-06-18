/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      colors: {
        primary: {
          DEFAULT: "#6366f1",
          foreground: "#fff",
        },
        secondary: {
          DEFAULT: "#a78bfa",
          foreground: "#fff",
        },
        background: "#181825",
        foreground: "#fff",
        border: "#232347",
        input: "#232347",
        ring: "#6d28d9",
      },
    },
  },
  plugins: [],
};