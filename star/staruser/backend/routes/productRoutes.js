const express = require("express")
const router = express.Router()
const productController = require("../controllers/productController")
const { verifyToken } = require("../middleware/auth")
const upload = require("../middleware/upload")
const auth = require("../middleware/auth") // Import the auth module

// Get all products
router.get("/", productController.getAllProducts)

// Get product by ID
router.get("/:id", productController.getProductById)

// Get product types
router.get("/types/all", productController.getProductTypes)

// Get product brands
router.get("/brands/all", productController.getProductBrands)

// Update stock
router.patch("/:id/stock", auth.verifyToken, productController.updateStock)

// Patch update product
router.patch("/:id", auth.verifyToken, productController.updateProductPatch)

module.exports = router
