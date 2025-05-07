"use client"
import { useState } from "react"

const ServiceCard = ({ service, onSelectService }) => {
  const [imageError, setImageError] = useState(false)

  const getImageUrl = () => {
    if (imageError) {
      return "/placeholder-service.jpg"
    }

    // Check if image path is from /images directory
    if (service.image && service.image.startsWith("/images/")) {
      return service.image
    }

    // Otherwise use the API URL for uploads
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000"
    return service.image && service.image.startsWith("/uploads")
      ? `${apiUrl}${service.image}`
      : service.image || "/placeholder-service.jpg"
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer h-full flex flex-col"
      onClick={() => onSelectService(service)}
    >
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={getImageUrl() || "/placeholder.svg"}
          alt={service.serviceType}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={() => setImageError(true)}
        />
      </div>
      <div className="p-4 flex flex-col flex-grow bg-gradient-card">
        <h3 className="text-lg font-semibold text-purple-700 mb-2">{service.serviceType}</h3>
        <p className="text-gray-600 mb-4 text-sm flex-grow">{service.description}</p>
        <div className="mt-auto">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
            <i className="fas fa-user-hard-hat mr-1"></i> {service.workers?.length || 0} Workers Available
          </span>
        </div>
      </div>
    </div>
  )
}

export default ServiceCard
