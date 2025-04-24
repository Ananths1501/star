// backend/routes/authRoutes.js
const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")
const { authenticate } = require("../middlewares/auth")

// POST routes
router.post("/register", authController.register)
router.post("/login", authController.login)

// GET route for profile (protected)
router.get("/profile", authenticate, authController.getProfile)

module.exports = router
