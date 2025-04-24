"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Package, ShoppingCart, Users, Wrench, AlertTriangle, ArrowUpRight, BarChart3 } from "lucide-react"
import { toast } from "react-hot-toast"
import api from "../../utils/api"

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    counts: {
      products: 0,
      orders: 0,
      users: 0,
      services: 0,
      workers: 0,
      admins: 0,
    },
    lowStockProducts: [],
    recentOrders: [],
    salesData: [],
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const response = await api.get("/admin/dashboard")
      setDashboardData(response.data)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast.error("Failed to load dashboard data")
    } finally {
      setIsLoading(false)
    }
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-blue-800 dark:text-white">Dashboard</h1>
        <p className="text-blue-600 dark:text-gray-400">Welcome to Star Electricals Admin Portal</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Products"
          value={dashboardData.counts.products}
          icon={<Package className="text-blue-500" />}
          linkTo="/admin/products"
        />
        <StatCard
          title="Total Orders"
          value={dashboardData.counts.orders}
          icon={<ShoppingCart className="text-green-500" />}
          linkTo="/admin/orders"
        />
        <StatCard
          title="Total Services"
          value={dashboardData.counts.services}
          icon={<Wrench className="text-orange-500" />}
          linkTo="/admin/services"
        />
        <StatCard
          title="Total Workers"
          value={dashboardData.counts.workers}
          icon={<Users className="text-purple-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Products */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-blue-800 dark:text-white">Low Stock Products</h2>
            <Link to="/admin/stocks" className="text-blue-600 hover:underline text-sm flex items-center">
              View All <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {dashboardData.lowStockProducts.length === 0 ? (
            <p className="text-blue-600 dark:text-gray-400">No products with low stock</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-blue-200 dark:border-gray-700">
                    <th className="py-2 px-3 text-left text-xs font-medium text-blue-700 dark:text-gray-400 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-blue-700 dark:text-gray-400 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-blue-700 dark:text-gray-400 uppercase tracking-wider">
                      Min Stock
                    </th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-blue-700 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-200 dark:divide-gray-700">
                  {dashboardData.lowStockProducts.map((product) => (
                    <tr key={product._id}>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={product.image || "/placeholder.svg?height=40&width=40"}
                            alt={product.name}
                            className="w-8 h-8 object-cover rounded mr-2"
                          />
                          <div>
                            <div className="font-medium text-blue-800 dark:text-white">{product.name}</div>
                            <div className="text-xs text-blue-600 dark:text-gray-400">{product.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-blue-700 dark:text-gray-300">{product.stock}</td>
                      <td className="py-3 px-3 whitespace-nowrap text-blue-700 dark:text-gray-300">
                        {product.minStock}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                          <AlertTriangle className="mr-1 h-4 w-4" /> Low Stock
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-blue-800 dark:text-white">Recent Orders</h2>
            <Link to="/admin/orders" className="text-blue-600 hover:underline text-sm flex items-center">
              View All <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {dashboardData.recentOrders.length === 0 ? (
            <p className="text-blue-600 dark:text-gray-400">No recent orders</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-blue-200 dark:border-gray-700">
                    <th className="py-2 px-3 text-left text-xs font-medium text-blue-700 dark:text-gray-400 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-blue-700 dark:text-gray-400 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-blue-700 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-blue-700 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-200 dark:divide-gray-700">
                  {dashboardData.recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-800 dark:text-white">
                          {order.orderNumber || order._id.substring(0, 8)}
                        </div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="text-sm text-blue-700 dark:text-gray-300">
                          {order.user ? order.user.name : order.customer || "Walk-in Customer"}
                        </div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-800 dark:text-white">
                          ₹{order.totalAmount.toFixed(2)}
                        </div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
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
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Sales Overview Chart */}
      <div className="mt-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-blue-800 dark:text-white">Sales Overview</h2>
          {dashboardData.salesData && dashboardData.salesData.length > 0 ? (
            <div className="h-64">
              {/* Chart would go here - simplified for this example */}
              <div className="grid grid-cols-7 h-full gap-2 items-end">
                {dashboardData.salesData.slice(-7).map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="bg-gradient-blue w-full rounded-t-md"
                      style={{
                        height: `${Math.max(20, (item.sales / Math.max(...dashboardData.salesData.map((d) => d.sales))) * 100)}%`,
                      }}
                    ></div>
                    <div className="text-xs mt-2 text-blue-600 dark:text-gray-400">
                      {new Date(item.date).toLocaleDateString(undefined, { weekday: "short" })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <BarChart3 size={64} className="text-blue-300" />
              <p className="ml-4 text-blue-500">No sales data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const StatCard = ({ title, value, icon, linkTo }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-blue-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold mt-1 text-blue-800 dark:text-white">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
      {linkTo && (
        <div className="mt-4">
          <Link to={linkTo} className="text-sm text-blue-600 hover:underline flex items-center">
            View Details <ArrowUpRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
