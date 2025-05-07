"use client"

import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CartContext } from "../context/CartContext"
import { AuthContext } from "../context/AuthContext"
import axios from "axios"
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

  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, Number.parseInt(newQuantity))
  }

  const handleRemoveItem = (productId) => {
    removeFromCart(productId)
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
        user: user._id,
        customer: user.name,
        items: cart.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount,
        })),
        totalAmount: total,
        paymentMethod: paymentMethod,
        paymentStatus: "Paid", // Assuming payment is made on delivery
      }

      const response = await axios.post("http://localhost:3000/api/orders", orderData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      setSuccess(`Order placed successfully! Order number: ${response.data.orderNumber}`)
      clearCart()

      // Redirect to home after 3 seconds
      setTimeout(() => {
        navigate(`/${user._id}/home`)
      }, 3000)
    } catch (err) {
      console.error("Checkout error:", err)
      setError(err.response?.data?.message || "Failed to place order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getImageUrl = (item) => {
    if (imageErrors[item._id]) {
      return "https://via.placeholder.com/80x80?text=Product"
    }
    return `http://localhost:3000/${item.image}`
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

          <button
            className="checkout-btn bg-gradient-primary hover:bg-gradient-primary-hover"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? "Processing..." : "Proceed to Checkout"}
          </button>

          <button
            className="continue-shopping-btn hover:border-purple-500 hover:text-purple-700"
            onClick={() => navigate(`/${user._id}/home`)}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartPage
