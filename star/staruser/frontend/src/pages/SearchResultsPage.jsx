"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { productService } from "../services/api"
import ProductCard from "../components/ProductCard"

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get("q") || ""
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await productService.getAllProducts({ search: query })
        setProducts(response.data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching search results:", err)
        setError("Failed to load search results. Please try again.")
        setLoading(false)
      }
    }

    if (query) {
      fetchProducts()
    } else {
      setProducts([])
      setLoading(false)
    }
  }, [query])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-140px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-2xl font-bold mb-6 text-purple-700">
        {products.length > 0 ? `Found ${products.length} results for "${query}"` : `No results found for "${query}"`}
      </h1>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-600 mb-4">No products match your search criteria.</p>
          <p className="text-gray-500">Try adjusting your search or browse our product categories.</p>
        </div>
      )}
    </div>
  )
}

export default SearchResultsPage
