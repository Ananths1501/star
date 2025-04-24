const jwt = require("jsonwebtoken")
const Admin = require("../models/Admin")
const bcrypt = require("bcryptjs")

// Admin login
exports.adminLogin = async (req, res) => {
  try {
    const { adminId, password } = req.body

    // Simple hardcoded authentication for testing
    if (adminId === "admin" && password === "Admin@123") {
      return res.json({
        token: "test-token",
        admin: {
          id: "admin-id",
          adminId: "admin",
          name: "Admin User",
          email: "admin@example.com",
          role: "superadmin",
        },
      })
    }

    // If credentials don't match, return error
    return res.status(401).json({ message: "Invalid credentials" })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Register new admin (only for superadmin)
exports.registerAdmin = async (req, res) => {
  try {
    const { adminId, name, email, password, role } = req.body

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ $or: [{ adminId }, { email }] })
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists with this ID or email" })
    }

    // Create new admin
    const admin = new Admin({
      adminId,
      name,
      email,
      password,
      role: role || "admin",
    })

    await admin.save()

    res.status(201).json({ message: "Admin created successfully" })
  } catch (error) {
    console.error("Register error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get current admin profile
exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select("-password")
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" })
    }
    res.json(admin)
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Update admin profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body

    const admin = await Admin.findById(req.admin._id)
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" })
    }

    // Update fields
    if (name) admin.name = name
    if (email) admin.email = email

    await admin.save()

    res.json({ message: "Profile updated successfully", admin })
  } catch (error) {
    console.error("Update profile error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    const admin = await Admin.findById(req.admin._id)
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" })
    }

    // Check current password
    const isMatch = await admin.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" })
    }

    // Update password
    admin.password = newPassword
    await admin.save()

    res.json({ message: "Password updated successfully" })
  } catch (error) {
    console.error("Change password error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}
