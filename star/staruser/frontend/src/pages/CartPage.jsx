"use client"

import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CartContext } from "../context/CartContext"
import { AuthContext } from "../context/AuthContext"
import { orderService } from "../services/api"
import "./CartPage.css"

const CartPage = () => {
  const { cart, total, updateQuantity, removeFromCart, clearCart } = useContext(CartContext)
  const { user } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState("Cash")
  const navigate = useNavigate()
  const [imageErrors, setImageErrors] = useState({})
  const [showOrderPreview, setShowOrderPreview] = useState(false)

  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, Number.parseInt(newQuantity))
  }

  const handleRemoveItem = (productId) => {
    removeFromCart(productId)
  }

  const showPreview = () => {
    if (cart.length === 0) {
      setError("Your cart is empty")
      return
    }
    setShowOrderPreview(true)
  }

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setError("Your cart is empty")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const orderData = {
        items: cart.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount,
        })),
        totalAmount: total,
        paymentMethod: paymentMethod,
        paymentStatus: "Paid", // Assuming payment is made on delivery
        customer: user.name,
        customerPhone: user.phone || "",
        status: "Confirmed",
        orderType: "Online",
      }

      const response = await orderService.createOrder(orderData)

      setSuccess(`Order placed successfully! Order number: ${response.data.orderNumber}`)
      clearCart()

      // Redirect to orders page after 3 seconds
      setTimeout(() => {
        navigate(`/${user._id}/orders`)
      }, 3000)
    } catch (err) {
      console.error("Checkout error:", err)
      setError(err.response?.data?.message || "Failed to place order. Please try again.")
    } finally {
      setLoading(false)
      setShowOrderPreview(false)
    }
  }

  const getImageUrl = (item) => {
    if (imageErrors[item._id]) {
      return "/placeholder-product.jpg"
    }
    // Use a direct URL or import.meta.env for Vite projects
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000"
    return item.image.startsWith("/uploads") ? `${apiUrl}${item.image}` : item.image
  }

  const handleImageError = (itemId) => {
    setImageErrors((prev) => ({
      ...prev,
      [itemId]: true,
    }))
  }

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <h2 className="text-purple-700">Your Cart is Empty</h2>
        <p>Add some products to your cart to see them here.</p>
        <button
          className="continue-shopping-btn hover:border-purple-500 hover:text-purple-700"
          onClick={() => navigate(`/${user._id}/home`)}
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <h1 className="cart-title text-purple-700">Your Shopping Cart</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="cart-container">
        <div className="cart-items">
          <div className="cart-header bg-gradient-card">
            <div className="cart-header-product">Product</div>
            <div className="cart-header-price">Price</div>
            <div className="cart-header-quantity">Quantity</div>
            <div className="cart-header-total">Total</div>
            <div className="cart-header-action"></div>
          </div>

          {cart.map((item) => {
            const itemTotal = (item.price - item.price * (item.discount / 100)) * item.quantity

            return (
              <div className="cart-item" key={item._id}>
                <div className="cart-item-product">
                  <img
                    src={getImageUrl(item) || "/placeholder.svg"}
                    alt={item.name}
                    onError={() => handleImageError(item._id)}
                  />
                  <div className="cart-item-details">
                    <h3 className="text-purple-700">{item.name}</h3>
                    <p>{item.brand}</p>
                  </div>
                </div>

                <div className="cart-item-price">
                  {item.discount > 0 ? (
                    <>
                      <span className="discounted-price text-pink-500">
                        ₹{(item.price - item.price * (item.discount / 100)).toFixed(2)}
                      </span>
                      <span className="original-price">₹{item.price.toFixed(2)}</span>
                    </>
                  ) : (
                    <span className="text-purple-700">₹{item.price.toFixed(2)}</span>
                  )}
                </div>

                <div className="cart-item-quantity">
                  <button
                    className="quantity-btn bg-gray-100 hover:bg-gray-200"
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                    className="border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                  />
                  <button
                    className="quantity-btn bg-gray-100 hover:bg-gray-200"
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <div className="cart-item-total text-purple-700">₹{itemTotal.toFixed(2)}</div>

                <div className="cart-item-action">
                  <button
                    className="remove-btn bg-pink-100 text-pink-600 hover:bg-pink-200"
                    onClick={() => handleRemoveItem(item._id)}
                  >
                    ×
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="cart-summary bg-gradient-card">
          <h2 className="text-purple-700">Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>

          <div className="summary-row total text-purple-700">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <div className="payment-method">
            <h3>Payment Method</h3>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
            >
              <option value="Cash">Cash on Delivery</option>
              <option value="Card">Card on Delivery</option>
              <option value="UPI">UPI on Delivery</option>
            </select>
          </div>

          <button className="checkout-btn bg-gradient-primary hover:bg-gradient-primary-hover" onClick={showPreview}>
            Proceed to Checkout
          </button>

          <button
            className="continue-shopping-btn hover:border-purple-500 hover:text-purple-700"
            onClick={() => navigate(`/${user._id}/home`)}
          >
            Continue Shopping
          </button>
        </div>
      </div>

      {/* Order Preview Modal */}
      {showOrderPreview && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/60">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-purple-700">Order Confirmation</h2>
                <button onClick={() => setShowOrderPreview(false)} className="text-gray-500 hover:text-gray-700">
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="border-b border-gray-200 pb-4 mb-4">
                <h3 className="font-medium text-lg text-gray-900 mb-2">Order Summary</h3>

                <div className="space-y-4">
                  {cart.map((item) => {
                    const itemPrice = item.price - item.price * (item.discount / 100)
                    const itemTotal = itemPrice * item.quantity

                    return (
                      <div key={item._id} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <img
                            src={getImageUrl(item) || "/placeholder.svg"}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded mr-3"
                            onError={() => handleImageError(item._id)}
                          />
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">₹{itemTotal.toFixed(2)}</p>
                          {item.discount > 0 && <p className="text-xs text-gray-500">(₹{itemPrice.toFixed(2)} each)</p>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-lg text-gray-900 mb-2">Shipping Details</h3>
                <p>
                  <span className="font-medium">Name:</span> {user.name}
                </p>
                {user.phone && (
                  <p>
                    <span className="font-medium">Phone:</span> {user.phone}
                  </p>
                )}
                {user.address && (
                  <p>
                    <span className="font-medium">Address:</span> {user.address}
                  </p>
                )}
                <p>
                  <span className="font-medium">Payment Method:</span> {paymentMethod}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowOrderPreview(false)}
                  className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="flex-1 py-2 px-4 bg-gradient-primary text-white rounded-md hover:opacity-90 transition-colors"
                >
                  {loading ? "Processing..." : "Confirm Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartPage
