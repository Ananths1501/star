"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { ThemeProvider } from "./components/ThemeProvider"
import AdminLogin from "./pages/admin/AdminLogin"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminProducts from "./pages/admin/AdminProducts"
import AdminServices from "./pages/admin/AdminServices"
import AdminOrders from "./pages/admin/AdminOrders"
import AdminBill from "./pages/admin/AdminBill"
import AdminStocks from "./pages/admin/AdminStocks"
import NotFoundPage from "./pages/NotFoundPage"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminRoute from "./components/AdminRoute"
import LoadingScreen from "./components/LoadingScreen"
import "./App.css"

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Preload the video
    const videoPreload = new Image()
    videoPreload.src = "/star.mp4"
  }, [])

  const handleLoadingComplete = () => {
    setLoading(false)
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        {loading ? (
          <LoadingScreen onLoadingComplete={handleLoadingComplete} />
        ) : (
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
              <Routes>
                <Route path="/" element={<Navigate to="/admin/login" replace />} />
                <Route path="/admin/login" element={<AdminLogin />} />

                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminRoute />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="services" element={<AdminServices />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="bill" element={<AdminBill />} />
                  <Route path="stocks" element={<AdminStocks />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
          </Router>
        )}
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
