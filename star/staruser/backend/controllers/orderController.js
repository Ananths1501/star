const Order = require("../models/Order")
const Product = require("../models/Product")
const User = require("../models/User")

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod, paymentStatus, customer, customerPhone, status, orderType } = req.body

    // Validate input
    if (!items || items.length === 0 || !totalAmount) {
      return res.status(400).json({ message: "Items and total amount are required" })
    }

    // Generate order number
    const count = await Order.countDocuments()
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    const orderNumber = `ORD-${year}${month}${day}-${(count + 1).toString().padStart(4, "0")}`

    // Create order with explicit orderNumber
    const order = new Order({
      orderNumber,
      user: req.user._id,
      customer: customer || req.user.name,
      customerPhone: customerPhone || req.user.phone,
      orderType: orderType || "Online",
      items,
      totalAmount,
      status: status || "Pending",
      paymentMethod: paymentMethod || "Cash",
      paymentStatus: paymentStatus || "Paid",
    })

    await order.save()

    // Update product stock
    for (const item of items) {
      const product = await Product.findById(item.product)
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity)
        await product.save()
      }
    }

    // Add order to user's orders
    await User.findByIdAndUpdate(req.user._id, { $push: { orders: order._id } })

    res.status(201).json({
      message: "Order created successfully",
      order,
    })
  } catch (error) {
    console.error("Create order error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate({
        path: "items.product",
        select: "name brand image price",
      })
      .sort({ createdAt: -1 })

    res.json(orders)
  } catch (error) {
    console.error("Get user orders error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate({
      path: "items.product",
      select: "name brand image price",
    })

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to access this order" })
    }

    res.json(order)
  } catch (error) {
    console.error("Get order error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body

    if (!status) {
      return res.status(400).json({ message: "Status is required" })
    }

    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this order" })
    }

    order.status = status
    await order.save()

    res.json({ message: "Order status updated successfully", order })
  } catch (error) {
    console.error("Update order status error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this order" })
    }

    // Check if order can be cancelled
    if (["Delivered", "Completed", "Cancelled"].includes(order.status)) {
      return res.status(400).json({ message: `Order is already ${order.status.toLowerCase()}` })
    }

    order.status = "Cancelled"
    await order.save()

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.product)
      if (product) {
        product.stock += item.quantity
        await product.save()
      }
    }

    res.json({ message: "Order cancelled successfully", order })
  } catch (error) {
    console.error("Cancel order error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}
