const Cart = require("../models/Cart")
const Product = require("../models/Product")

exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate("items.product")

    if (!cart) {
      // Create an empty cart if none exists
      cart = new Cart({ user: req.user.id, items: [] })
      await cart.save()
    }

    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cart", error: error.message })
  }
}

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body

    const product = await Product.findOne({ productId })
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    let cart = await Cart.findOne({ user: req.user.id })

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] })
    }

    const existingItem = cart.items.find((item) => item.product.toString() === product._id.toString())

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.items.push({ product: product._id, quantity, price: product.price })
    }

    await cart.save()

    // Populate product details before sending response
    await cart.populate("items.product")

    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: "Failed to add to cart", error: error.message })
  }
}

exports.updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body

    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than 0" })
    }

    const cart = await Cart.findOne({ user: req.user.id })

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" })
    }

    const product = await Product.findOne({ productId })
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    const itemIndex = cart.items.findIndex((item) => item.product.toString() === product._id.toString())

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" })
    }

    cart.items[itemIndex].quantity = quantity
    await cart.save()

    await cart.populate("items.product")

    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: "Failed to update cart", error: error.message })
  }
}

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body

    const cart = await Cart.findOne({ user: req.user.id })

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" })
    }

    const product = await Product.findOne({ productId })
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== product._id.toString())
    await cart.save()

    await cart.populate("items.product")

    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: "Failed to remove from cart", error: error.message })
  }
}
