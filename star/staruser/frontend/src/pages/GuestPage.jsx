"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Carousel from "../components/Carousel"
import ProductCard from "../components/ProductCard"

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
      image: "/images/carousel-1.jpg",
      button: {
        text: "Shop Now",
        onClick: () => navigate("/user/login"),
      },
    },
    {
      title: "Professional Electrical Services",
      description: "Book skilled electricians for all your electrical needs",
      image: "/images/carousel-2.jpg",
      button: {
        text: "View Services",
        onClick: () => navigate("/user/login"),
      },
    },
    {
      title: "Quality Electrical Products",
      description: "Wide range of electrical products from top brands",
      image: "/images/carousel-3.jpg",
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
    return <div className="text-center text-pink-600 p-8">{error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Carousel slides={carouselSlides} />

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-8 relative after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:transform after:-translate-x-1/2 after:w-24 after:h-1 after:bg-gradient-to-r after:from-blue-600 after:via-purple-600 after:to-pink-600">
          Featured Products
        </h2>

        {categories.map((category) => (
          <div className="mb-12" key={category}>
            <h3 className="text-xl font-semibold text-purple-700 mb-4 border-l-4 border-purple-500 pl-3">{category}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products
                .filter((product) => product.type === category)
                .slice(0, 4) // Show only first 4 products per category
                .map((product) => (
                  <div key={product._id}>
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
