"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import Header from "../components/Header"

const Cart = () => {
  const [cart, setCart] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/")
      return
    }

    // Fetch user profile
    axios
      .get("http://localhost:3000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error("Error fetching user profile:", err)
        localStorage.removeItem("token")
        navigate("/")
      })

    // Fetch cart
    fetchCart()
  }, [navigate])

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("http://localhost:3000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCart(response.data)
      setLoading(false)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch cart")
      setLoading(false)
    }
  }

  const updateQuantity = async (productId, newQuantity) => {
    try {
      if (newQuantity < 1) return

      const token = localStorage.getItem("token")
      await axios.put(
        "http://localhost:3000/api/cart/update",
        { productId, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      // Refresh cart after update
      fetchCart()
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update quantity")
    }
  }

  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem("token")
      await axios.delete("http://localhost:3000/api/cart/remove", {
        headers: { Authorization: `Bearer ${token}` },
        data: { productId },
      })

      // Refresh cart after removal
      fetchCart()
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove item")
    }
  }

  if (loading) return <div className="text-center py-8">Loading cart...</div>
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={user} setUser={setUser} />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} setUser={setUser} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-100 p-4 font-medium">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-center">Total</div>
          </div>

          {cart.items.map((item) => {
            // Calculate discounted price
            const discountedPrice = item.product.price - item.product.price * (item.product.discount / 100)

            return (
              <div key={item.product._id} className="grid grid-cols-12 p-4 border-b items-center">
                <div className="col-span-6 flex items-center">
                  <img
                    src={item.product.image || "/placeholder-product.jpg"}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-gray-600 text-sm">{item.product.brand}</p>
                  </div>
                </div>
                <div className="col-span-2 text-center">
                  {item.product.discount > 0 ? (
                    <div>
                      <p>₹{discountedPrice.toLocaleString()}</p>
                      <p className="text-gray-500 text-sm line-through">₹{item.product.price.toLocaleString()}</p>
                    </div>
                  ) : (
                    <p>₹{item.product.price.toLocaleString()}</p>
                  )}
                </div>
                <div className="col-span-2 text-center">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => updateQuantity(item.product.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="px-2 py-1 bg-gray-200 rounded-l disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border-t border-b">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.productId, item.quantity + 1)}
                      className="px-2 py-1 bg-gray-200 rounded-r"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="col-span-2 text-center">
                  ₹
                  {(
                    (item.product.discount > 0 ? discountedPrice : item.product.price) * item.quantity
                  ).toLocaleString()}
                  <button
                    onClick={() => removeItem(item.product.productId)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              </div>
            )
          })}

          <div className="p-4 flex justify-between items-center">
            <Link to="/" className="text-blue-600 hover:underline">
              Continue Shopping
            </Link>
            <div className="text-right">
              <div className="text-xl font-bold mb-2">Total: ₹{cart.total.toLocaleString()}</div>
              <button
                onClick={() => navigate("/order")}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
