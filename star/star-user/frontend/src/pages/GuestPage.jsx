"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Carousel from "../components/Carousel"
import ProductCard from "../components/ProductCard"
import "./GuestPage.css"

const GuestPage = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/products")
        setProducts(response.data)

        // Extract unique categories (types)
        const uniqueTypes = [...new Set(response.data.map((product) => product.type))]
        setCategories(uniqueTypes)

        setLoading(false)
      } catch (err) {
        console.error("Error fetching products:", err)
        setError("Failed to load products. Please try again later.")
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const carouselSlides = [
    {
      title: "Welcome to Star Electricals",
      description: "Your one-stop shop for all electrical products and services",
      button: {
        text: "Shop Now",
        onClick: () => navigate("/user/login"),
      },
    },
    {
      title: "Professional Electrical Services",
      description: "Book skilled electricians for all your electrical needs",
      button: {
        text: "View Services",
        onClick: () => navigate("/user/login"),
      },
    },
    {
      title: "Quality Electrical Products",
      description: "Wide range of electrical products from top brands",
      button: {
        text: "Explore Products",
        onClick: () => navigate("/user/login"),
      },
    },
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (error) {
    return <div className="error text-pink-600">{error}</div>
  }

  return (
    <div className="guest-page">
      <Carousel slides={carouselSlides} />

      <div className="featured-products">
        <h2 className="section-title">Featured Products</h2>

        {categories.map((category) => (
          <div className="category-section" key={category}>
            <h3 className="category-title border-l-4 border-purple-500">{category}</h3>
            <div className="products-grid">
              {products
                .filter((product) => product.type === category)
                .slice(0, 4) // Show only first 4 products per category
                .map((product) => (
                  <div className="product-item" key={product._id}>
                    <ProductCard product={product} />
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GuestPage
