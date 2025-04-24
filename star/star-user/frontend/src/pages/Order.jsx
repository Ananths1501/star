"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Header from "../components/Header"

const Order = () => {
  const [order, setOrder] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [address, setAddress] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/")
      return
    }

    const fetchData = async () => {
      try {
        // Fetch user's profile
        const userResponse = await axios.get("http://localhost:3000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUser(userResponse.data)
        setAddress(userResponse.data.address || "")

        // Fetch cart to show order summary
        const cartResponse = await axios.get("http://localhost:3000/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setOrder(cartResponse.data)

        if (cartResponse.data.items.length === 0) {
          navigate("/")
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err.response?.data?.message || "Failed to fetch order details")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [navigate])

  const placeOrder = async () => {
    if (!address.trim()) {
      setError("Please enter a shipping address")
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const response = await axios.post(
        "http://localhost:3000/api/orders",
        { address, paymentMethod },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      setOrderPlaced(true)
      setOrderSuccess(response.data)
      setLoading(false)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order")
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-8">Loading order details...</div>
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>

  if (orderPlaced && orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={user} setUser={setUser} />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
            <div className="text-green-600 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">Order Placed Successfully!</h2>
            <p className="mb-4">Your order has been placed and is being processed.</p>
            <p className="mb-6">Order ID: {orderSuccess._id}</p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Calculate order total with discounts
  const calculateTotal = () => {
    if (!order || !order.items) return 0

    return order.items.reduce((total, item) => {
      const price =
        item.product.discount > 0
          ? item.product.price - item.product.price * (item.product.discount / 100)
          : item.product.price
      return total + price * item.quantity
    }, 0)
  }

  const orderTotal = calculateTotal()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} setUser={setUser} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 border rounded mb-4"
                rows="4"
                placeholder="Enter your shipping address"
                required
              />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span>Cash on Delivery</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span>Credit/Debit Card</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={() => setPaymentMethod("upi")}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span>UPI Payment</span>
                </label>
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {order.items.map((item) => {
                  const discountedPrice =
                    item.product.discount > 0
                      ? item.product.price - item.product.price * (item.product.discount / 100)
                      : item.product.price

                  return (
                    <div key={item.product._id} className="flex justify-between">
                      <div>
                        <span className="font-medium">{item.product.name}</span>
                        <span className="text-gray-600 ml-2">x{item.quantity}</span>
                      </div>
                      <div>₹{(discountedPrice * item.quantity).toLocaleString()}</div>
                    </div>
                  )
                })}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between font-medium mb-2">
                  <span>Subtotal</span>
                  <span>₹{orderTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-4">
                  <span>Total</span>
                  <span>₹{orderTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={placeOrder}
                className="w-full bg-green-600 text-white py-3 rounded-lg mt-6 hover:bg-green-700"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Order
