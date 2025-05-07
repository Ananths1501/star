const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const auth = require("../middleware/auth")
const upload = require("../middleware/upload")

// Get user profile
router.get("/profile", auth, userController.getUserProfile)

// Update user profile
router.put("/profile", auth, upload.single("profilePic"), userController.updateUserProfile)

// Cart routes
router.get("/cart", auth, userController.getCart)
router.post("/cart", auth, userController.addToCart)
router.put("/cart", auth, userController.updateCartItem)
router.delete("/cart", auth, userController.clearCart)

module.exports = router
