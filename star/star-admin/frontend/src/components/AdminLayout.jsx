"use client"

import { useState } from "react"
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "./ThemeProvider"
import { toast } from "react-hot-toast"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Wrench,
  FileText,
  BarChart,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  User,
} from "lucide-react"

const AdminLayout = () => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success("Logged out successfully")
    navigate("/admin/login")
  }

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/admin/products", label: "Products", icon: <Package size={20} /> },
    { path: "/admin/stocks", label: "Stocks", icon: <BarChart size={20} /> },
    { path: "/admin/services", label: "Services", icon: <Wrench size={20} /> },
    { path: "/admin/orders", label: "Orders", icon: <ShoppingCart size={20} /> },
    { path: "/admin/bill", label: "Billing", icon: <FileText size={20} /> },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 sidebar-gradient dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 border-b border-blue-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-blue-800 dark:text-white">Star Electricals</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md md:hidden hover:bg-blue-100 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                  location.pathname === item.path
                    ? "bg-gradient-blue text-white"
                    : "text-blue-800 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700"
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-blue-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 rounded-md text-blue-800 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors"
          >
            <LogOut size={20} />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="header-gradient dark:bg-gray-800 shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md md:hidden hover:bg-blue-100 dark:hover:bg-gray-700"
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-gray-700"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun size={20} className="text-yellow-400" />
                ) : (
                  <Moon size={20} className="text-blue-800" />
                )}
              </button>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-blue flex items-center justify-center text-white">
                  <User size={18} />
                </div>
                <span className="font-medium text-blue-800 dark:text-white">{user?.adminId || "Admin"}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
