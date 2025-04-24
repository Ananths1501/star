/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3b82f6", // Blue-500
          dark: "#2563eb", // Blue-600
          light: "#60a5fa", // Blue-400
        },
        secondary: {
          DEFAULT: "#6b7280", // Gray-500
          dark: "#4b5563", // Gray-600
          light: "#9ca3af", // Gray-400
        },
      },
      backgroundImage: {
        'gradient-blue': 'linear-gradient(to right, #e0f7fa, #4fc3f7, #0288d1)',
        'gradient-blue-dark': 'linear-gradient(to right, #01579b, #0277bd, #0288d1)',
      },
    },
  },
  plugins: [],
}
