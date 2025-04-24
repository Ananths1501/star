const Order = require("../models/Order")
const Cart = require("../models/Cart")

exports.createOrder = async (req, res) => {
  try {
    const { address, paymentMethod } = req.body

    if (!address) {
      return res.status(400).json({ message: "Shipping address is required" })
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product")

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" })
    }

    // Create order from cart
    const order = new Order({
      user: req.user.id,
      items: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price,
      })),
      total: cart.total,
      address,
      paymentMethod: paymentMethod || "cod",
    })

    await order.save()

    // Clear the cart after order is created
    cart.items = []
    await cart.save()

    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ message: "Failed to create order", error: error.message })
  }
}

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product", "name images price")
      .sort({ createdAt: -1 })

    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message })
  }
}

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate("items.product", "name images price brandName")

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order", error: error.message })
  }
}
