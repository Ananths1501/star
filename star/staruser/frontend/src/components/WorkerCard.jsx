"use client"
import { useState } from "react"

const WorkerCard = ({ worker, onBookWorker }) => {
  const [imageError, setImageError] = useState(false)

  const getImageUrl = () => {
    if (imageError) {
      return "/placeholder-worker.jpg"
    }

    // Check if image path is from /images directory
    if (worker.image && worker.image.startsWith("/images/")) {
      return worker.image
    }

    // Otherwise use the API URL for uploads
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000"
    return worker.image && worker.image.startsWith("/uploads")
      ? `${apiUrl}${worker.image}`
      : worker.image || "/placeholder-worker.jpg"
  }

  const getStatusColor = () => {
    switch (worker.status.toLowerCase()) {
      case "available":
        return "bg-green-100 text-green-800"
      case "busy":
        return "bg-orange-100 text-orange-800"
      case "on leave":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer h-full flex flex-col"
      onClick={() => onBookWorker(worker)}
    >
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={getImageUrl() || "/placeholder.svg"}
          alt={worker.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={() => setImageError(true)}
        />
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-medium ${getStatusColor()}`}>
          {worker.status}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow bg-gradient-card">
        <h3 className="text-lg font-semibold text-purple-700 mb-1">{worker.name}</h3>
        <p className="text-cyan-700 font-medium text-sm mb-2">{worker.serviceType}</p>
        <p className="text-pink-700 font-bold mb-3">₹{worker.feesPerDay} per day</p>
        <div className="mt-auto space-y-2 text-sm text-gray-700">
          <p className="flex items-center">
            <i className="fas fa-phone-alt mr-2 text-purple-600"></i> {worker.phone}
          </p>
          <p className="flex items-center">
            <i className="fas fa-map-marker-alt mr-2 text-purple-600"></i> {worker.address}
          </p>
        </div>
      </div>
    </div>
  )
}

export default WorkerCard
