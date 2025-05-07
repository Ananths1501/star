"use client"

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { orderService } from "../services/api"

const OrderStatusBadge = ({ status }) => {
  const statusColors = {
    Pending: "bg-blue-100 text-blue-800",
    Processing: "bg-yellow-100 text-yellow-800",
    Shipped: "bg-indigo-100 text-indigo-800",
    Delivered: "bg-green-100 text-green-800",
    Completed: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  }

  const colorClass = statusColors[status] || "bg-gray-100 text-gray-800"

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {status}
    </span>
  )
}

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useContext(AuthContext)
  const [expandedOrder, setExpandedOrder] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const response = await orderService.getUserOrders()
        setOrders(response.data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching orders:", err)
        setError("Failed to load orders. Please try again.")
        setLoading(false)
      }
    }

    if (user) {
      fetchOrders()
    }
  }, [user])

  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null)
    } else {
      setExpandedOrder(orderId)
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-140px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        <p>{error}</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6 text-purple-700">My Orders</h1>
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
          <Link
            to="/"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-purple-700">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow overflow-hidden">
            <div
              className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer hover:bg-gray-50"
              onClick={() => toggleOrderDetails(order._id)}
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-800">{order.orderNumber}</h3>
                  <OrderStatusBadge status={order.status} />
                </div>
                <p className="text-sm text-gray-500 mt-1">Ordered on {formatDate(order.createdAt)}</p>
              </div>

              <div className="mt-2 sm:mt-0 text-right">
                <p className="font-bold text-purple-700">₹{order.totalAmount.toFixed(2)}</p>
                <div className="flex items-center text-sm text-purple-600 mt-1">
                  {expandedOrder === order._id ? (
                    <span>
                      Hide Details <i className="fas fa-chevron-up ml-1"></i>
                    </span>
                  ) : (
                    <span>
                      View Details <i className="fas fa-chevron-down ml-1"></i>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {expandedOrder === order._id && (
              <div className="border-t border-gray-200 p-4">
                <div className="flex flex-col md:flex-row md:justify-between gap-6">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-700 mb-2">Items</h4>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <div className="flex items-start">
                            {item.product.image && (
                              <img
                                src={
                                  item.product.image.startsWith("/uploads")
                                    ? `http://localhost:3000${item.product.image}`
                                    : item.product.image
                                }
                                alt={item.product.name}
                                className="w-12 h-12 object-cover rounded mr-3"
                                onError={(e) => {
                                  e.target.onerror = null
                                  e.target.src = "/placeholder-product.jpg"
                                }}
                              />
                            )}
                            <div>
                              <p className="text-sm font-medium">{item.product.name}</p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              ₹{(item.price * (1 - item.discount / 100)).toFixed(2)}
                            </p>
                            {item.discount > 0 && (
                              <p className="text-xs text-gray-500 line-through">₹{item.price.toFixed(2)}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="min-w-[200px]">
                    <h4 className="font-semibold text-gray-700 mb-2">Order Summary</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{order.totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>Free</span>
                      </div>
                      <div className="flex justify-between font-bold pt-2 border-t border-gray-200 mt-2">
                        <span>Total:</span>
                        <span>₹{order.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-700 mb-2">Shipping Info</h4>
                      <p className="text-sm">{order.customer || "Walk-in Customer"}</p>
                      {order.customerPhone && <p className="text-sm">{order.customerPhone}</p>}
                      <p className="text-sm mt-2">Payment: {order.paymentMethod}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyOrdersPage
