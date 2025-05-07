"use client"

import { useState, useEffect, useContext } from "react"
import { useParams } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import Carousel from "../components/Carousel"
import ProductCard from "../components/ProductCard"
import { productService } from "../services/api"
import "./HomePage.css"

const HomePage = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useContext(AuthContext)
  const { userId } = useParams()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getAllProducts()
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
      title: `Welcome back, ${user?.name || "User"}!`,
      description: "Explore our latest products and services",
      button: {
        text: "View Services",
        onClick: () => (window.location.href = `/${userId}/services`),
      },
    },
    {
      title: "Special Offers",
      description: "Check out our discounted products",
      button: {
        text: "Shop Now",
        onClick: () => document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" }),
      },
    },
    {
      title: "Need Help?",
      description: "Book a service with our professional electricians",
      button: {
        text: "Book Service",
        onClick: () => (window.location.href = `/${userId}/services`),
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
    <div className="home-page">
      <Carousel slides={carouselSlides} />

      <div id="products-section" className="products-container">
        <h2 className="section-title">Our Products</h2>

        {categories.map((category) => (
          <div className="category-section" key={category}>
            <h3 className="category-title border-l-4 border-purple-500">{category}</h3>
            <div className="products-grid">
              {products
                .filter((product) => product.type === category)
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

export default HomePage
