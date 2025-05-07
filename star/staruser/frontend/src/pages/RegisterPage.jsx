"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import "./RegisterPage.css"

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
    <div className="register-container bg-gradient-card">
      <div className="register-card">
        <div className="register-header">
          <h1 className="bg-gradient-primary bg-clip-text text-transparent">Star Electricals</h1>
          <h2>Create an Account</h2>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="profile-pic-upload">
            <div className="profile-pic-preview border-purple-500">
              {preview ? (
                <img src={preview || "/placeholder.svg"} alt="Profile Preview" />
              ) : (
                <div className="profile-pic-placeholder bg-gradient-card">
                  <span>Upload Photo</span>
                </div>
              )}
            </div>
            <input type="file" id="profilePic" name="profilePic" accept="image/*" onChange={handleImageChange} />
          </div>

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea id="address" name="address" value={formData.address} onChange={handleChange}></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="register-btn bg-gradient-primary hover:bg-gradient-primary-hover">
            Register
          </button>
        </form>

        <div className="register-footer">
          <p>
            Already have an account?{" "}
            <Link to="/user/login" className="text-purple-600 hover:text-purple-800">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
