"use client"

import { useState, useEffect } from "react"
import { Package, Clock, Check, Truck, X, Calendar, Search, Filter } from "lucide-react"
import { toast } from "react-hot-toast"
import api from "../../utils/api"

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [currentOrder, setCurrentOrder] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [searchTerm, dateRange, orders])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const response = await api.get("/orders")
      setOrders(response.data)
      setFilteredOrders(response.data)
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast.error("Failed to load orders")
    } finally {
      setIsLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = [...orders]

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (order) =>
          (order.orderNumber && order.orderNumber.toLowerCase().includes(searchLower)) ||
          (order._id && order._id.toLowerCase().includes(searchLower)) ||
          (order.customer && order.customer.toLowerCase().includes(searchLower)) ||
          (order.user && order.user.name && order.user.name.toLowerCase().includes(searchLower)),
      )
    }

    // Apply date range filter
    if (dateRange.startDate) {
      const startDate = new Date(dateRange.startDate)
      startDate.setHours(0, 0, 0, 0)
      filtered = filtered.filter((order) => new Date(order.createdAt) >= startDate)
    }

    if (dateRange.endDate) {
      const endDate = new Date(dateRange.endDate)
      endDate.setHours(23, 59, 59, 999)
      filtered = filtered.filter((order) => new Date(order.createdAt) <= endDate)
    }

    setFilteredOrders(filtered)
  }

  const handleViewOrder = (order) => {
    setCurrentOrder(order)
    setShowOrderModal(true)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="text-yellow-500" />
      case "Processing":
        return <Package className="text-blue-500" />
      case "Shipped":
        return <Truck className="text-purple-500" />
      case "Delivered":
        return <Check className="text-green-500" />
      case "Cancelled":
        return <X className="text-red-500" />
      default:
        return <Clock className="text-gray-500" />
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders Management</h1>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by order number or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
          >
            <Filter size={18} className="mr-1" /> Filter by Date
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <Package className="mx-auto text-gray-400 text-5xl mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No orders found</h2>
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {order.orderNumber || order._id.substring(0, 8)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {order.user ? order.user.name : order.customer || "Walk-in Customer"}
                      </div>
                      {order.user && <div className="text-xs text-gray-500 dark:text-gray-400">{order.user.email}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700 dark:text-gray-300">{formatDate(order.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        ₹{order.totalAmount.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                            : order.status === "Processing"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                              : order.status === "Shipped"
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                                : order.status === "Delivered"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        }`}
                      >
                        <span className="flex items-center">
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status}</span>
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderModal && currentOrder && (
        <OrderDetailsModal order={currentOrder} onClose={() => setShowOrderModal(false)} onStatusUpdate={fetchOrders} />
      )}
    </div>
  )
}

// Update the OrderDetailsModal with gradient background
const OrderDetailsModal = ({ order, onClose, onStatusUpdate }) => {
  const [status, setStatus] = useState(order.status)
  const [isLoading, setIsLoading] = useState(false)

  const handleStatusChange = async () => {
    if (status === order.status) {
      return
    }

    setIsLoading(true)

    try {
      await api.put(`/orders/${order._id}/status`, { status })
      toast.success("Order status updated successfully")
      onStatusUpdate()
      onClose()
    } catch (error) {
      console.error("Error updating order status:", error)
      toast.error("Failed to update order status")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="fixed inset-0 bg-gradient-primary bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 modal-backdrop">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 bg-gradient-to-r from-primary-dark/10 to-primary/10 dark:from-primary-dark/20 dark:to-primary/20">
          <h2 className="text-xl font-bold text-primary-dark dark:text-white">Order Details</h2>
          <button
            onClick={onClose}
            className="text-primary hover:text-primary-pink dark:hover:text-primary-pink/80 transition-colors hover:scale-110"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Order Information</h3>
              <p className="text-sm mb-1 text-gray-700 dark:text-gray-300">
                Order ID: {order.orderNumber || order._id}
              </p>
              <p className="text-sm mb-1 text-gray-700 dark:text-gray-300">Date: {formatDate(order.createdAt)}</p>
              <p className="text-sm mb-1 text-gray-700 dark:text-gray-300">
                Status:
                <span
                  className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                      : order.status === "Processing"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                        : order.status === "Shipped"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                          : order.status === "Delivered"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                  }`}
                >
                  {order.status}
                </span>
              </p>
              <p className="text-sm mb-1 text-gray-700 dark:text-gray-300">
                Payment Method: {order.paymentMethod || "Cash"}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Payment Status: {order.paymentStatus || "Paid"}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Customer Information</h3>
              {order.user ? (
                <>
                  <p className="text-sm mb-1 text-gray-700 dark:text-gray-300">Name: {order.user.name}</p>
                  <p className="text-sm mb-1 text-gray-700 dark:text-gray-300">Email: {order.user.email}</p>
                  <p className="text-sm mb-1 text-gray-700 dark:text-gray-300">Phone: {order.user.phone}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">Address: {order.user.address}</p>
                </>
              ) : (
                <p className="text-sm text-gray-700 dark:text-gray-300">{order.customer || "Walk-in Customer"}</p>
              )}
            </div>
          </div>

          <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Order Items</h3>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden mb-6">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead className="bg-gray-100 dark:bg-gray-600">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={item.product?.image || "/placeholder.svg?height=40&width=40"}
                          alt={item.product?.name}
                          className="w-10 h-10 object-cover rounded-md mr-3"
                        />
                        <div>
                          <div className="font-medium text-sm text-gray-900 dark:text-white">{item.product?.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{item.product?.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-700 dark:text-gray-300">₹{item.price?.toFixed(2)}</div>
                      {item.discount > 0 && <div className="text-xs text-red-500">-{item.discount}%</div>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-700 dark:text-gray-300">{item.quantity}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        ₹{(item.price * (1 - item.discount / 100) * item.quantity).toFixed(2)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <td colSpan="3" className="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300">
                    Total:
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                    ₹{order.totalAmount.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-primary-dark/5 dark:from-primary/10 dark:to-primary-dark/10 border-t border-primary/10 dark:border-primary/5">
            <div className="w-1/2">
              <label htmlFor="status" className="block text-sm font-medium text-primary-dark dark:text-gray-300 mb-1">
                Update Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-primary/30 dark:border-primary/20 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-primary/30 dark:border-primary/20 rounded-md text-primary-dark dark:text-gray-300 hover:bg-primary/10 dark:hover:bg-primary/20 transition-all hover:-translate-y-1 active:translate-y-0"
              >
                Close
              </button>
              <button
                onClick={handleStatusChange}
                disabled={isLoading || status === order.status}
                className="px-4 py-2 bg-gradient-primary text-white rounded-md transition-all hover:-translate-y-1 active:translate-y-0 shadow-md hover:shadow-purple-glow disabled:opacity-70"
              >
                {isLoading ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminOrders
