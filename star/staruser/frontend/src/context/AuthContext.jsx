"use client"

import { createContext, useState, useEffect } from "react"
import { authService } from "../services/api"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check if user is logged in on component mount
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          const response = await authService.getCurrentUser()
          setUser(response.data)
        }
      } catch (err) {
        console.error("Auth check error:", err)
        localStorage.removeItem("token")
      } finally {
        setLoading(false)
      }
    }

    checkLoggedIn()
  }, [])

  const login = async (email, password) => {
    try {
      setError(null)
      const response = await authService.login({
        email,
        password,
      })

      const { token, user } = response.data
      localStorage.setItem("token", token)
      setUser(user)
      return user
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
      throw err
    }
  }

  const register = async (formData) => {
    try {
      setError(null)
      const response = await authService.register(formData)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
      throw err
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>{children}</AuthContext.Provider>
  )
}
