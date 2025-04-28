/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#8b5cf6", // Purple-500
          light: "#a78bfa", // Purple-400
          dark: "#7c3aed", // Purple-600
          blue: "#1e3a8a", // Dark blue from gradient
          purple: "#8b5cf6", // Purple-500
          red: "#ef4444", // Red from gradient
        },
        gradient: {
          blue: "#1e3a8a",
          purple: "#8b5cf6",
          red: "#ef4444",
        },
        secondary: {
          DEFAULT: "#6b7280", // Gray-500
          dark: "#4b5563", // Gray-600
          light: "#9ca3af", // Gray-400
        },
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(to bottom, #1e3a8a, #8b5cf6, #ef4444)",
        "gradient-primary-hover": "linear-gradient(to bottom, #1e40af, #7c3aed, #dc2626)",
        "gradient-sidebar": "linear-gradient(to bottom, #1e3a8a, #8b5cf6)",
        "gradient-card": "linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
        "gradient-modal":
          "linear-gradient(to bottom, rgba(30, 58, 138, 0.95), rgba(139, 92, 246, 0.95), rgba(239, 68, 68, 0.95))",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      boxShadow: {
        "blue-glow": "0 0 15px rgba(30, 58, 138, 0.5)",
        "purple-glow": "0 0 15px rgba(139, 92, 246, 0.5)",
        "red-glow": "0 0 15px rgba(239, 68, 68, 0.5)",
        "gradient-glow": "0 0 20px rgba(139, 92, 246, 0.6)",
      },
    },
  },
  plugins: [],
}
