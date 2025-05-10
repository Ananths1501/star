"use client"

import { useState, useEffect, useContext } from "react"
import { useParams } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import ServiceCard from "../components/ServiceCard"
import WorkerCard from "../components/WorkerCard"
import BookingForm from "../components/BookingForm"
import { serviceService } from "../services/api"

const ServicesPage = () => {
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [workers, setWorkers] = useState([])
  const [selectedWorker, setSelectedWorker] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const { user } = useContext(AuthContext)
  const { userId } = useParams()

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await serviceService.getAllServices()
        setServices(response.data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching services:", err)
        setError("Failed to load services. Please try again later.")
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  const handleServiceSelect = async (service) => {
    setSelectedService(service)
    setSelectedWorker(null)
    setSuccess(null)

    try {
      const response = await serviceService.getWorkersByService(service._id)
      setWorkers(response.data)
    } catch (err) {
      console.error("Error fetching workers:", err)
      setError("Failed to load workers. Please try again later.")
    }
  }

  const handleWorkerSelect = (worker) => {
    setSelectedWorker(worker)
    setShowBookingModal(true)
  }

  const handleCloseModal = () => {
    setShowBookingModal(false)
  }

  const goBack = () => {
    if (selectedWorker) {
      setSelectedWorker(null)
    } else if (selectedService) {
      setSelectedService(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-140px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (error && !selectedService) {
    return <div className="text-center text-pink-600 mt-24">{error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-2xl font-bold text-center text-purple-700 mb-6">Our Services</h1>

      {error && <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4">{error}</div>}
      {success && <div className="p-3 bg-green-100 text-green-700 rounded-md mb-4">{success}</div>}

      {(selectedService || selectedWorker) && (
        <button
          className="mb-4 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 hover:text-purple-700 transition-colors"
          onClick={goBack}
        >
          ← Back
        </button>
      )}

      {!selectedService ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {services.map((service) => (
            <ServiceCard key={service._id} service={service} onSelectService={handleServiceSelect} />
          ))}
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold text-purple-700 mb-4">{selectedService.serviceType} Workers</h2>

          {workers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {workers.map((worker) => (
                <WorkerCard key={worker._id} worker={worker} onBookWorker={handleWorkerSelect} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <p className="text-gray-600">No workers available for this service at the moment.</p>
            </div>
          )}
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedWorker && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/60 backdrop-blur-sm">
          <BookingForm worker={selectedWorker} service={selectedService} user={user} onClose={handleCloseModal} />
        </div>
      )}
    </div>
  )
}

export default ServicesPage
