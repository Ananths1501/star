"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

const SearchBar = ({ onSearch, className }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      // If there's a passed onSearch function, call it
      if (onSearch) {
        onSearch(searchTerm)
      } else {
        // Otherwise navigate to search results
        navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`relative flex-grow ${className || ""}`}>
      <div className="flex">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for electrical products..."
          className="w-full px-5 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
        />
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-r-md transition-colors"
        >
          <i className="fas fa-search"></i>
        </button>
      </div>
    </form>
  )
}

export default SearchBar
