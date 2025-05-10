"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import Carousel from "../components/Carousel"
import ProductCard from "../components/ProductCard"
import { productService } from "../services/api"

const HomePage = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState("all")
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
      image: "/images/carousel-1.jpg",
      button: {
        text: "View Services",
        onClick: () => (window.location.href = `/${userId}/services`),
      },
    },
    {
      title: "Special Offers",
      description: "Check out our discounted products",
      image: "/images/carousel-2.jpg",
      button: {
        text: "Shop Now",
        onClick: () => document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" }),
      },
    },
    {
      title: "Need Help?",
      description: "Book a service with our professional electricians",
      image: "/images/carousel-3.jpg",
      button: {
        text: "Book Service",
        onClick: () => (window.location.href = `/${userId}/services`),
      },
    },
  ]

  const handleCategoryClick = (category) => {
    setActiveCategory(category)

    // Scroll to products section
    document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" })
  }

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

  // Filter products based on active category
  const filteredProducts =
    activeCategory === "all" ? products : products.filter((product) => product.type === activeCategory)

  return (
    <div className="container mx-auto px-4 py-8">
      <Carousel slides={carouselSlides} />

      {/* Category buttons - enhanced with better styling */}
      <div className="mt-8 mb-6 bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-purple-700 mb-3">Browse Categories</h3>
        <div className="flex flex-wrap gap-3">
          <button
            className={`px-4 py-2 rounded-md transition-colors ${
              activeCategory === "all"
                ? "bg-purple-600 text-white"
                : "border border-purple-300 text-purple-700 hover:bg-purple-50"
            }`}
            onClick={() => handleCategoryClick("all")}
          >
            All Products
          </button>

          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeCategory === category
                  ? "bg-purple-600 text-white"
                  : "border border-purple-300 text-purple-700 hover:bg-purple-50"
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div id="products-section" className="mt-8">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-8 relative after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:transform after:-translate-x-1/2 after:w-24 after:h-1 after:bg-gradient-to-r after:from-blue-600 after:via-purple-600 after:to-pink-600">
          {activeCategory === "all" ? "Our Products" : `${activeCategory} Products`}
        </h2>

        {activeCategory === "all" ? (
          // Show all categories with their products
          categories.map((category) => {
            const categoryProducts = products.filter((product) => product.type === category)
            const displayProducts = categoryProducts.slice(0, 5)
            const hasMoreProducts = categoryProducts.length > 5

            return (
              <div className="mb-12" key={category} id={category}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-purple-700 border-l-4 border-purple-500 pl-3">
                    {category}
                  </h3>
                  {hasMoreProducts && (
                    <Link
                      to={`/${userId}/category/${category}`}
                      className="text-purple-600 hover:text-purple-800 flex items-center bg-purple-50 px-3 py-1 rounded-md"
                    >
                      View All <i className="fas fa-arrow-right ml-1"></i>
                    </Link>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {displayProducts.map((product) => (
                    <div key={product._id}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            )
          })
        ) : (
          // Show products of the selected category
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredProducts.map((product) => (
                <div key={product._id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No products found in this category.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
