"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import ProductCard from "../components/ProductCard"
import { productService } from "../services/api"

const CategoryPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { userId, category } = useParams()
  const { user } = useContext(AuthContext)
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getAllProducts({ type: category })
        setProducts(response.data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching products:", err)
        setError("Failed to load products. Please try again later.")
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category])

  const sortProducts = (products) => {
    switch (sortBy) {
      case "price-low":
        return [...products].sort((a, b) => a.price - b.price)
      case "price-high":
        return [...products].sort((a, b) => b.price - a.price)
      case "discount":
        return [...products].sort((a, b) => b.discount - a.discount)
      case "newest":
      default:
        return [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
  }

  const sortedProducts = sortProducts(products)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-pink-600 p-8">{error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-purple-700 mb-2">{category} Products</h2>
          <p className="text-gray-600">{products.length} products found</p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center">
          <label htmlFor="sort" className="mr-2 text-gray-700">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="discount">Highest Discount</option>
          </select>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex items-center">
          <Link to={`/${userId}/home`} className="text-purple-600 hover:text-purple-800">
            Home
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-700">{category}</span>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {sortedProducts.map((product) => (
            <div key={product._id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <p className="text-gray-700 mb-4">No products found in this category.</p>
          <Link
            to={`/${userId}/home`}
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            Back to Home
          </Link>
        </div>
      )}
    </div>
  )
}

export default CategoryPage
