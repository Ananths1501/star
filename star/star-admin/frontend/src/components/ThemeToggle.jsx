"use client"

import { useTheme } from "./ThemeProvider"
import { Moon, Sun } from "lucide-react"

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 hover:bg-white/20"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun className="h-5 w-5 text-white" /> : <Moon className="h-5 w-5 text-white" />}
    </button>
  )
}
