"use client"

import { useEffect, useState } from "react"
import axios from "axios"

const FilterSection = ({ filters, onChange }) => {
  const [showFilters, setShowFilters] = useState(false)
  const [types, setTypes] = useState([])
  const [brands, setBrands] = useState([])

  useEffect(() => {
    // Fetch types and brands
    axios.get("http://localhost:3000/api/products/all").then((res) => {
      const products = res.data
      const uniqueTypes = [...new Set(products.map((p) => p.type).filter(Boolean))]
      const uniqueBrands = [...new Set(products.map((p) => p.brand).filter(Boolean))]

      setTypes(uniqueTypes)
      setBrands(uniqueBrands)
    })
  }, [])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    onChange({ ...filters, [name]: value })
  }

  const applyFilters = () => {
    onChange(filters)
  }

  const resetFilters = () => {
    onChange({
      type: "",
      brand: "",
      price: "",
    })
  }

  return (
    <div className="mb-6">
      <div className="flex items-center cursor-pointer mb-2" onClick={() => setShowFilters(!showFilters)}>
        <span className="font-medium">Filters</span>
        <svg
          className={`ml-2 w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <select
                name="brand"
                value={filters.brand}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <select
                name="price"
                value={filters.price}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
              >
                <option value="">All Prices</option>
                <option value="0-1000">Under ₹1,000</option>
                <option value="1000-5000">₹1,000 - ₹5,000</option>
                <option value="5000-10000">₹5,000 - ₹10,000</option>
                <option value="10000-20000">₹10,000 - ₹20,000</option>
                <option value="20000-50000">₹20,000 - ₹50,000</option>
                <option value="50000-100000">Above ₹50,000</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-2">
            <button onClick={applyFilters} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Apply Filters
            </button>
            <button onClick={resetFilters} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterSection
