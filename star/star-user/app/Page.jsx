"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

const Page = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // Fetch featured products
    axios
      .get("http://localhost:3000/api/products/all")
      .then((res) => {
        setFeaturedProducts(res.data.slice(0, 4)) // Show first 4 products
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching products:", err)
        setError("Failed to load products. Please try again later.")
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to Star Electricals</h1>
          <p className="text-xl mb-8 max-w-2xl">
            Your one-stop shop for quality electrical appliances and home electronics at the best prices.
          </p>
          <Link
            to="/products"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Featured Products */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>

        {loading ? (
          <div className="text-center py-8">Loading products...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => {
              const discountedPrice = product.price - product.price * (product.discount / 100)

              return (
                <div key={product.productId} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {product.discount > 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {product.discount}% OFF
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{product.brand}</p>
                    <div className="mb-3">
                      {product.discount > 0 ? (
                        <div className="flex items-center">
                          <p className="font-bold text-blue-600">₹{discountedPrice.toLocaleString()}</p>
                          <p className="text-gray-500 text-sm line-through ml-2">₹{product.price.toLocaleString()}</p>
                        </div>
                      ) : (
                        <p className="font-bold text-blue-600">₹{product.price.toLocaleString()}</p>
                      )}
                    </div>
                    <Link
                      to="/login"
                      className="block w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Why Choose Us */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Star Electricals?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-blue-600 text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
              <p className="text-gray-600">We offer only the best quality electrical appliances from trusted brands.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-blue-600 text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Get your products delivered to your doorstep within 24-48 hours.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-blue-600 text-4xl mb-4">🛠️</div>
              <h3 className="text-xl font-semibold mb-2">After-Sales Service</h3>
              <p className="text-gray-600">Enjoy excellent customer support and warranty service for all products.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
