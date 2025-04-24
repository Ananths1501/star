"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Header from "../components/Header"
import ProductCard from "../components/ProductCard"

const Home = () => {
  const [products, setProducts] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      axios
        .get("http://localhost:3000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch((err) => {
          console.error("Error fetching user profile:", err)
          localStorage.removeItem("token")
        })
    }

    axios
      .get("http://localhost:3000/api/products/all")
      .then((res) => {
        setProducts(res.data.slice(0, 8)) // Show first 8 products on homepage
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching products:", err)
        setError("Failed to load products. Please try again later.")
        setProducts([]) // Ensure products is always an array
        setLoading(false)
      })
  }, [])

  const handleAddToCart = (product) => {
    if (!user) {
      alert("Please login to add items to cart")
      return
    }

    axios
      .post(
        "http://localhost:3000/api/cart/add",
        { productId: product.productId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      )
      .then(() => alert(`${product.name} added to cart`))
      .catch((err) => alert(err.response?.data?.message || "Failed to add to cart"))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} setUser={setUser} />

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <h1 className="text-3xl font-bold mb-6">Featured Products</h1>

          {loading ? (
            <div className="text-center py-8">Loading products...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">No products available</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.productId} product={product} user={user} onAddToCart={handleAddToCart} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default Home
