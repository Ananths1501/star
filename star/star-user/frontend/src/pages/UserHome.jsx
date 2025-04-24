"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Header from "../components/Header"
import ProductCard from "../components/ProductCard"
import FilterSection from "../components/FilterSection"

const UserHome = () => {
  const { username } = useParams()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filters, setFilters] = useState({
    type: "",
    brand: "",
    price: "",
  })

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
      .then((res) => {
        setUser(res.data)
        // Redirect if username in URL doesn't match logged in user
        if (username !== res.data.username) {
          navigate(`/${res.data.username}/home`)
        }
      })
      .catch((err) => {
        console.error("Error fetching user profile:", err)
        localStorage.removeItem("token")
        navigate("/")
      })

    // Fetch products with filters
    fetchProducts()
  }, [username, navigate, filters])

  const fetchProducts = () => {
    setLoading(true)
    axios
      .get("http://localhost:3000/api/products/filter", { params: filters })
      .then((res) => {
        setProducts(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching products:", err)
        setError("Failed to load products. Please try again later.")
        setLoading(false)
      })
  }

  const handleAddToCart = (product) => {
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

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} setUser={setUser} />

      <main className="container mx-auto px-4 py-8">
        <FilterSection filters={filters} onChange={handleFilterChange} />

        {loading ? (
          <div className="text-center py-8">Loading products...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-8">No products found matching your filters</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.productId} product={product} user={user} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default UserHome
