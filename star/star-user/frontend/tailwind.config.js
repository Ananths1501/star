/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
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
            pink: "#ec4899", // Pink for new gradient
            cyan: "#06b6d4", // Cyan from new gradient
          },
          gradient: {
            blue: "#1e3a8a",
            purple: "#8b5cf6",
            red: "#ef4444",
            pink: "#ec4899",
            cyan: "#06b6d4",
          },
          secondary: {
            DEFAULT: "#6b7280", // Gray-500
            dark: "#4b5563", // Gray-600
            light: "#9ca3af", // Gray-400
          },
        },
        backgroundImage: {
          "gradient-primary": "linear-gradient(to right, #ec4899, #8b5cf6, #06b6d4)",
          "gradient-primary-hover": "linear-gradient(to right, #db2777, #7c3aed, #0891b2)",
          "gradient-sidebar": "linear-gradient(to bottom, #ec4899, #8b5cf6)",
          "gradient-card":
            "linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(139, 92, 246, 0.1) 50%, rgba(6, 182, 212, 0.1) 100%)",
          "gradient-modal":
            "linear-gradient(to right, rgba(236, 72, 153, 0.95), rgba(139, 92, 246, 0.95), rgba(6, 182, 212, 0.95))",
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
          "pink-glow": "0 0 15px rgba(236, 72, 153, 0.5)",
          "purple-glow": "0 0 15px rgba(139, 92, 246, 0.5)",
          "cyan-glow": "0 0 15px rgba(6, 182, 212, 0.5)",
          "gradient-glow": "0 0 20px rgba(139, 92, 246, 0.6)",
        },
      },
    },
    plugins: [],
  }
  