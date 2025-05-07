import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import GuestPage from "./pages/GuestPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import HomePage from "./pages/HomePage"
import CartPage from "./pages/CartPage"
import ServicesPage from "./pages/ServicesPage"
import MyOrdersPage from "./pages/MyOrdersPage"
import MyBookingsPage from "./pages/MyBookingsPage"
import SearchResultsPage from "./pages/SearchResultsPage"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"
import ProtectedRoute from "./components/ProtectedRoute"
import ErrorBoundary from "./components/ErrorBoundary"
import { Toaster } from "react-hot-toast"
import "./App.css"

function App() {
  return (
    <ErrorBoundary showDetails={false}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="app-container min-h-screen flex flex-col bg-gray-50">
              <Navbar />
              <main className="main-content flex-grow pt-20">
                <Routes>
                  <Route path="/" element={<GuestPage />} />
                  <Route path="/user/login" element={<LoginPage />} />
                  <Route path="/user/register" element={<RegisterPage />} />
                  <Route path="/search" element={<SearchResultsPage />} />
                  <Route
                    path="/:userId/home"
                    element={
                      <ProtectedRoute>
                        <HomePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/:userId/cart"
                    element={
                      <ProtectedRoute>
                        <CartPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/:userId/services"
                    element={
                      <ProtectedRoute>
                        <ServicesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/:userId/orders"
                    element={
                      <ProtectedRoute>
                        <MyOrdersPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/:userId/bookings"
                    element={
                      <ProtectedRoute>
                        <MyBookingsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
              <Toaster position="top-right" />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
