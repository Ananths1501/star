"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    profilePic: null,
  })
  const [error, setError] = useState("")
  const [preview, setPreview] = useState(null)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({ ...prev, profilePic: file }))
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    const formDataToSend = new FormData()
    formDataToSend.append("name", formData.name)
    formDataToSend.append("email", formData.email)
    formDataToSend.append("password", formData.password)
    formDataToSend.append("phone", formData.phone)
    formDataToSend.append("address", formData.address)
    if (formData.profilePic) {
      formDataToSend.append("profilePic", formData.profilePic)
    }

    try {
      const response = await axios.post("http://localhost:3000/api/users/register", formDataToSend)
      console.log("Registration successful:", response.data)
      navigate("/user/login") // Redirect to login after successful registration
    } catch (error) {
      console.error("Registration error:", error)
      setError(error.response?.data?.message || "Registration failed. Please try again.")
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-70px)] p-5 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Star Electricals
          </h1>
          <h2 className="text-xl font-semibold text-gray-700">Create an Account</h2>
        </div>

        {error && <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full border-2 border-purple-500 overflow-hidden mb-2">
              {preview ? (
                <img src={preview || "/placeholder.svg"} alt="Profile Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 text-xs">
                  Upload Photo
                </div>
              )}
            </div>
            <input
              type="file"
              id="profilePic"
              name="profilePic"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm"
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

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
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            ></textarea>
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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-black rounded-md font-medium transition-colors shadow-md hover:shadow-lg"
          >
            Register
          </button>
        </form>

        <div className="text-center mt-6 text-gray-600">
          <p>
            Already have an account?{" "}
            <Link to="/user/login" className="text-purple-600 hover:text-purple-800 font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
