"use client"

import { useContext, useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { CartContext } from "../context/CartContext"
import SearchBar from "./SearchBar"

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)
  const { cart } = useContext(CartContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const getProfileImageUrl = () => {
    if (!user || !user.profilePic) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}`
    }

    // Use a direct URL or import.meta.env for Vite projects
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000"
    return user.profilePic.startsWith("/uploads") ? `${apiUrl}${user.profilePic}` : user.profilePic
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-gradient-primary shadow-lg" : "bg-gradient-primary"}`}
    >
      <div className="container mx-auto px-4">
        {/* First row with logo and navigation */}
        <div className="flex justify-between items-center h-24">
          <Link to="/" className="flex items-center shrink-0">
            <span className="text-white text-3xl font-bold tracking-tight">
              <i className="fas fa-bolt mr-2"></i>
              Star Electricals
            </span>
          </Link>

          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
              <i className={`fas ${mobileMenuOpen ? "fa-times" : "fa-bars"} text-2xl`}></i>
            </button>
          </div>

          <ul className="hidden md:flex items-center space-x-6">
            <li>
              <Link
                to="/"
                className={`text-white hover:text-gray-200 transition-colors ${location.pathname === "/" ? "font-semibold border-b-2 border-white pb-1" : ""}`}
              >
                Home
              </Link>
            </li>

            {user ? (
              <>
                <li>
                  <Link
                    to={`/${user._id}/home`}
                    className={`text-white hover:text-gray-200 transition-colors ${location.pathname.includes("/home") ? "font-semibold border-b-2 border-white pb-1" : ""}`}
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/${user._id}/services`}
                    className={`text-white hover:text-gray-200 transition-colors ${location.pathname.includes("/services") ? "font-semibold border-b-2 border-white pb-1" : ""}`}
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/${user._id}/orders`}
                    className={`text-white hover:text-gray-200 transition-colors ${location.pathname.includes("/orders") ? "font-semibold border-b-2 border-white pb-1" : ""}`}
                  >
                    My Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/${user._id}/bookings`}
                    className={`text-white hover:text-gray-200 transition-colors ${location.pathname.includes("/bookings") ? "font-semibold border-b-2 border-white pb-1" : ""}`}
                  >
                    My Bookings
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/${user._id}/cart`}
                    className={`text-white hover:text-gray-200 transition-colors relative ${location.pathname.includes("/cart") ? "font-semibold border-b-2 border-white pb-1" : ""}`}
                  >
                    <i className="fas fa-shopping-cart mr-1"></i> Cart
                    {cart.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                </li>
                <li className="flex items-center">
                  <div className="flex items-center">
                    <img
                      src={getProfileImageUrl() || "/placeholder.svg"}
                      alt={user.name}
                      className="h-8 w-8 rounded-full border-2 border-white object-cover"
                    />
                    <span className="text-white ml-2 mr-4">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-white text-purple-600 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/user/login"
                  className="bg-white text-purple-600 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* Second row with search bar */}
        <div className="py-3 hidden md:block">
          <SearchBar className="w-full max-w-4xl mx-auto" />
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${mobileMenuOpen ? "max-h-screen" : "max-h-0"}`}
      >
        <div className="bg-gradient-to-b from-pink-500 to-purple-600 px-4 py-4">
          <div className="mb-4">
            <SearchBar />
          </div>

          <ul className="space-y-4">
            <li>
              <Link
                to="/"
                className={`block text-white hover:text-gray-200 py-2 ${location.pathname === "/" ? "font-semibold" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
            </li>

            {user ? (
              <>
                <li>
                  <Link
                    to={`/${user._id}/home`}
                    className={`block text-white hover:text-gray-200 py-2 ${location.pathname.includes("/home") ? "font-semibold" : ""}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/${user._id}/services`}
                    className={`block text-white hover:text-gray-200 py-2 ${location.pathname.includes("/services") ? "font-semibold" : ""}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/${user._id}/orders`}
                    className={`block text-white hover:text-gray-200 py-2 ${location.pathname.includes("/orders") ? "font-semibold" : ""}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/${user._id}/bookings`}
                    className={`block text-white hover:text-gray-200 py-2 ${location.pathname.includes("/bookings") ? "font-semibold" : ""}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/${user._id}/cart`}
                    className={`block text-white hover:text-gray-200 py-2 ${location.pathname.includes("/cart") ? "font-semibold" : ""}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <i className="fas fa-shopping-cart mr-1"></i> Cart
                    {cart.length > 0 && (
                      <span className="ml-2 bg-pink-500 text-white text-xs rounded-full px-2 py-1">{cart.length}</span>
                    )}
                  </Link>
                </li>
                <li className="pt-2 border-t border-gray-700">
                  <div className="flex items-center py-2">
                    <img
                      src={getProfileImageUrl() || "/placeholder.svg"}
                      alt={user.name}
                      className="h-8 w-8 rounded-full border-2 border-white object-cover"
                    />
                    <span className="text-white ml-2">{user.name}</span>
                  </div>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full bg-white text-purple-600 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/user/login"
                  className="block w-full text-center bg-white text-purple-600 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
