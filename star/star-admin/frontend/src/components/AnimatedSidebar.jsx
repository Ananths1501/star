"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Wrench,
  FileText,
  BarChart,
  LogOut,
  X,
  ChevronRight,
} from "lucide-react"

const AnimatedSidebar = ({ sidebarOpen, setSidebarOpen, handleLogout, user }) => {
  const location = useLocation()
  const [activeItem, setActiveItem] = useState(null)
  const [hoveredItem, setHoveredItem] = useState(null)

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/admin/products", label: "Products", icon: <Package size={20} /> },
    { path: "/admin/stocks", label: "Stocks", icon: <BarChart size={20} /> },
    { path: "/admin/services", label: "Services", icon: <Wrench size={20} /> },
    { path: "/admin/orders", label: "Orders", icon: <ShoppingCart size={20} /> },
    { path: "/admin/bill", label: "Billing", icon: <FileText size={20} /> },
  ]

  useEffect(() => {
    // Set active item based on current location
    const currentItem = menuItems.find((item) => item.path === location.pathname)
    setActiveItem(currentItem?.path || null)
  }, [location.pathname])

  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden ${sidebarOpen ? "block" : "hidden"}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-900 via-purple-800 to-red-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <h1 className="text-xl font-bold text-white">Star Electricals</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md md:hidden text-white hover:bg-white/10"
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
                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-300 relative overflow-hidden group ${
                  location.pathname === item.path
                    ? "text-white bg-white/20"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
                onMouseEnter={() => setHoveredItem(item.path)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Animated background glow */}
                {(hoveredItem === item.path || location.pathname === item.path) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-red-600/30 rounded-lg blur-sm transform scale-105 transition-transform duration-300"></div>
                )}

                <div className="relative z-10 flex items-center w-full">
                  <div
                    className={`transition-all duration-300 ${location.pathname === item.path ? "text-white" : "text-white/80 group-hover:text-white"}`}
                  >
                    {item.icon}
                  </div>
                  <span className="ml-3">{item.label}</span>

                  {location.pathname === item.path && <ChevronRight className="ml-auto h-4 w-4 text-white" />}
                </div>
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-white/20">
          <div className="flex items-center mb-4 px-4 py-2 rounded-lg bg-white/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 flex items-center justify-center text-white">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user?.name || "Admin User"}</p>
              <p className="text-xs text-white/70">{user?.role || "Administrator"}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-red-600/20 hover:from-blue-600/30 hover:via-purple-600/30 hover:to-red-600/30 text-white transition-all duration-300"
          >
            <LogOut size={20} />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default AnimatedSidebar
