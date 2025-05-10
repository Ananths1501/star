"use client"

import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const user = await login(formData.email, formData.password)
      navigate(`/${user._id}/home`)
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.")
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-70px)] p-5 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Star Electricals
          </h1>
          <h2 className="text-xl font-semibold text-gray-700">Login to Your Account</h2>
        </div>

        {error && <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-md font-medium transition-colors shadow-md hover:shadow-lg"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-6 text-gray-600">
          <p>
            Don't have an account?{" "}
            <Link to="/user/register" className="text-purple-600 hover:text-purple-800 font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
