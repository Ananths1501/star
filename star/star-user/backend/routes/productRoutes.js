const express = require("express")
const router = express.Router()
const productController = require("../controllers/productController")

router.get("/type", productController.getProductsByType)
router.get("/filter", productController.getFilteredProducts)
router.get("/all", productController.getAllProducts)
router.get("/:id", productController.getProductById)

module.exports = router
