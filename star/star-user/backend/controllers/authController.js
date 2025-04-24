const User = require("../models/User")
const jwt = require("jsonwebtoken")

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" })
    }

    // Generate username from email
    const username = User.generateUsername(email)

    // Create new user
    const user = new User({
      name,
      email,
      password,
      phone,
      username,
    })

    await user.save()

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" })

    // Return user data without password
    const userData = user.toObject()
    delete userData.password

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: userData,
    })
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" })

    // Return user data without password
    const userData = user.toObject()
    delete userData.password

    res.json({
      message: "Login successful",
      token,
      user: userData,
    })
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message })
  }
}

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile", error: error.message })
  }
}
