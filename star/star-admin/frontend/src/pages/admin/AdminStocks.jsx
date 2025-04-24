"use client"

import { useState, useEffect } from "react"
import { Edit, Filter, ArrowUp, ArrowDown, X, Check } from "lucide-react"
import { toast } from "react-hot-toast"
import api from "../../utils/api"

const AdminStocks = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [currentProduct, setCurrentProduct] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [filters, setFilters] = useState({
    type: "",
    brand: "",
    sortBy: "name",
    order: "asc",
  })
  const [types, setTypes] = useState([])
  const [brands, setBrands] = useState([])

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [filters, products])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const [productsRes, typesRes, brandsRes] = await Promise.all([
        api.get("/products"),
        api.get("/products/types"),
        api.get("/products/brands"),
      ])

      setProducts(productsRes.data)
      setTypes(typesRes.data)
      setBrands(brandsRes.data)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast.error("Failed to load products")
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let result = [...products]

    // Apply type filter
    if (filters.type) {
      result = result.filter((p) => p.type === filters.type)
    }

    // Apply brand filter
    if (filters.brand) {
      result = result.filter((p) => p.brand === filters.brand)
    }

    // Apply sorting
    result.sort((a, b) => {
      let valueA, valueB

      if (filters.sortBy === "stock") {
        valueA = a.stock
        valueB = b.stock
      } else if (filters.sortBy === "minStock") {
        valueA = a.minStock
        valueB = b.minStock
      } else if (filters.sortBy === "stockDiff") {
        valueA = a.stock - a.minStock
        valueB = b.stock - b.minStock
      } else if (filters.sortBy === "price") {
        valueA = a.price
        valueB = b.price
      } else {
        valueA = a.name.toLowerCase()
        valueB = b.name.toLowerCase()
      }

      if (filters.order === "asc") {
        return valueA > valueB ? 1 : -1
      } else {
        return valueA < valueB ? 1 : -1
      }
    })

    setFilteredProducts(result)
  }

  const resetFilters = () => {
    setFilters({
      type: "",
      brand: "",
      sortBy: "name",
      order: "asc",
    })
  }

  const handleUpdateStock = (product) => {
    setCurrentProduct(product)
    setShowUpdateModal(true)
  }

  const handleEditRow = (product) => {
    setEditingProduct({
      ...product,
      newStock: product.stock,
      newMinStock: product.minStock,
    })
  }

  const handleSaveRow = async () => {
    if (!editingProduct) return

    try {
      await api.patch(`/products/${editingProduct._id}/stock`, {
        stock: editingProduct.newStock,
        minStock: editingProduct.newMinStock,
      })

      // Update the product in the local state
      const updatedProducts = products.map((p) =>
        p._id === editingProduct._id
          ? { ...p, stock: editingProduct.newStock, minStock: editingProduct.newMinStock }
          : p,
      )

      setProducts(updatedProducts)
      setEditingProduct(null)
      toast.success("Stock updated successfully")
    } catch (error) {
      console.error("Error updating stock:", error)
      toast.error("Failed to update stock")
    }
  }

  const handleCancelEdit = () => {
    setEditingProduct(null)
  }

  const handleSort = (field) => {
    if (filters.sortBy === field) {
      setFilters({
        ...filters,
        order: filters.order === "asc" ? "desc" : "asc",
      })
    } else {
      setFilters({
        ...filters,
        sortBy: field,
        order: "asc",
      })
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stock Management</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center">
            <Filter size={18} className="mr-2 text-gray-500 dark:text-gray-400" />
            <span className="font-medium text-gray-900 dark:text-white">Filters:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 flex-1">
            <div>
              <select
                value={filters.type}
                onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Types</option>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={filters.brand}
                onChange={(e) => setFilters((prev) => ({ ...prev, brand: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Brands</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <button
                onClick={resetFilters}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Product
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("productId")}
                >
                  <div className="flex items-center">
                    Product ID
                    {filters.sortBy === "productId" &&
                      (filters.order === "asc" ? (
                        <ArrowUp size={14} className="ml-1" />
                      ) : (
                        <ArrowDown size={14} className="ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("type")}
                >
                  <div className="flex items-center">
                    Type
                    {filters.sortBy === "type" &&
                      (filters.order === "asc" ? (
                        <ArrowUp size={14} className="ml-1" />
                      ) : (
                        <ArrowDown size={14} className="ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("brand")}
                >
                  <div className="flex items-center">
                    Brand
                    {filters.sortBy === "brand" &&
                      (filters.order === "asc" ? (
                        <ArrowUp size={14} className="ml-1" />
                      ) : (
                        <ArrowDown size={14} className="ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("stock")}
                >
                  <div className="flex items-center">
                    Stock
                    {filters.sortBy === "stock" &&
                      (filters.order === "asc" ? (
                        <ArrowUp size={14} className="ml-1" />
                      ) : (
                        <ArrowDown size={14} className="ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("minStock")}
                >
                  <div className="flex items-center">
                    Min Stock
                    {filters.sortBy === "minStock" &&
                      (filters.order === "asc" ? (
                        <ArrowUp size={14} className="ml-1" />
                      ) : (
                        <ArrowDown size={14} className="ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("stockDiff")}
                >
                  <div className="flex items-center">
                    Status
                    {filters.sortBy === "stockDiff" &&
                      (filters.order === "asc" ? (
                        <ArrowUp size={14} className="ml-1" />
                      ) : (
                        <ArrowDown size={14} className="ml-1" />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={product.image || "/placeholder.svg?height=40&width=40"}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded-md mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                        <div className="text-gray-500 dark:text-gray-400 text-sm">
                          {product.description.substring(0, 30)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900 dark:text-white">{product.productId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900 dark:text-white">{product.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900 dark:text-white">{product.brand}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingProduct && editingProduct._id === product._id ? (
                      <input
                        type="number"
                        min="0"
                        value={editingProduct.newStock}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, newStock: Number.parseInt(e.target.value) })
                        }
                        className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <div className="text-gray-900 dark:text-white">{product.stock}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingProduct && editingProduct._id === product._id ? (
                      <input
                        type="number"
                        min="0"
                        value={editingProduct.newMinStock}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, newMinStock: Number.parseInt(e.target.value) })
                        }
                        className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <div className="text-gray-900 dark:text-white">{product.minStock}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900 dark:text-white">
                      {product.stock > product.minStock ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100">
                          In Stock
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100">
                          Low Stock
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editingProduct && editingProduct._id === product._id ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleSaveRow}
                          className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditRow(product)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Edit size={18} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminStocks
