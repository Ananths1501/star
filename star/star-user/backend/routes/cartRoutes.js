const express = require("express")
const router = express.Router()
const cartController = require("../controllers/cartController")
const { authenticate } = require("../middlewares/auth")

router.get("/", authenticate, cartController.getCart)
router.post("/add", authenticate, cartController.addToCart)
router.put("/update", authenticate, cartController.updateCart)
router.delete("/remove", authenticate, cartController.removeFromCart)

module.exports = router
