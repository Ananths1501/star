"use client"

import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CartContext } from "../context/CartContext"
import { AuthContext } from "../context/AuthContext"
import { orderService } from "../services/api"

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
        status: "Pending", // Changed from "Confirmed" to "Pending" to match enum
        orderType: "Online", // Explicitly set orderType
      }

      const response = await orderService.createOrder(orderData)

      setSuccess(`Order placed successfully! Order number: ${response.data.order.orderNumber}`)
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
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-5">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-6">Add some products to your cart to see them here.</p>
        <button
          className="px-6 py-2 border border-gray-300 rounded-md hover:border-purple-500 hover:text-purple-700 transition-colors"
          onClick={() => navigate(`/${user._id}/home`)}
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center text-purple-700">Your Shopping Cart</h1>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">{success}</div>}

      <div className="flex flex-col md:flex-row gap-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex-grow">
          <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 font-medium text-gray-700">
            <div className="col-span-6">Product</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-2">Quantity</div>
            <div className="col-span-2">Total</div>
          </div>

          {cart.map((item) => {
            const itemTotal = (item.price - item.price * (item.discount / 100)) * item.quantity

            return (
              <div key={item._id} className="border-t border-gray-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="col-span-6 flex items-center">
                    <img
                      src={getImageUrl(item) || "/placeholder.svg"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded mr-4"
                      onError={() => handleImageError(item._id)}
                    />
                    <div>
                      <h3 className="font-medium text-purple-700">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.brand}</p>
                    </div>
                  </div>

                  <div className="col-span-2 md:text-left">
                    <div className="md:hidden font-medium text-gray-700 mb-1">Price:</div>
                    {item.discount > 0 ? (
                      <div>
                        <span className="font-bold text-pink-500">
                          ₹{(item.price - item.price * (item.discount / 100)).toFixed(2)}
                        </span>
                        <div className="text-sm text-gray-400 line-through">₹{item.price.toFixed(2)}</div>
                      </div>
                    ) : (
                      <span className="font-medium text-purple-700">₹{item.price.toFixed(2)}</span>
                    )}
                  </div>

                  <div className="col-span-2">
                    <div className="md:hidden font-medium text-gray-700 mb-1">Quantity:</div>
                    <div className="flex items-center">
                      <button
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-l-md"
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
                        className="w-12 h-8 text-center border-y border-gray-300"
                      />
                      <button
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-r-md"
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-2 flex justify-between items-center">
                    <div>
                      <div className="md:hidden font-medium text-gray-700 mb-1">Total:</div>
                      <span className="font-bold text-purple-700">₹{itemTotal.toFixed(2)}</span>
                    </div>
                    <button
                      className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 hover:bg-red-200 rounded-full"
                      onClick={() => handleRemoveItem(item._id)}
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 md:w-80 h-fit">
          <h2 className="text-xl font-bold mb-4 text-purple-700">Order Summary</h2>

          <div className="border-b border-gray-200 pb-4 mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Shipping</span>
              <span>Free</span>
            </div>
          </div>

          <div className="flex justify-between font-bold text-lg mb-6">
            <span className="text-gray-800">Total</span>
            <span className="text-purple-700">₹{total.toFixed(2)}</span>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="Cash">Cash on Delivery</option>
              <option value="Card">Card on Delivery</option>
              <option value="UPI">UPI on Delivery</option>
            </select>
          </div>

          <button
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-md font-medium mb-3 transition-colors"
            onClick={showPreview}
          >
            Proceed to Checkout
          </button>

          <button
            className="w-full py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md font-medium transition-colors"
            onClick={() => navigate(`/${user._id}/home`)}
          >
            Continue Shopping
          </button>
        </div>
      </div>

      {/* Order Preview Modal */}
      {showOrderPreview && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/60 backdrop-blur-sm">
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
                  className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-md font-medium transition-colors"
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
