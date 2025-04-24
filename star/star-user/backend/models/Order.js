const mongoose = require("mongoose")

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
})

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  address: { type: String, required: true },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["cod", "card", "upi"],
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

orderSchema.pre("save", function (next) {
  this.updatedAt = new Date()
  next()
})

module.exports = mongoose.model("Order", orderSchema)
