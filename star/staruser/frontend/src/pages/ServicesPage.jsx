"use client"

import { useState, useEffect, useContext } from "react"
import { useParams } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import ServiceCard from "../components/ServiceCard"
import WorkerCard from "../components/WorkerCard"
import BookingForm from "../components/BookingForm"
import { serviceService } from "../services/api"
import "./ServicesPage.css"

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
    return <div className="error text-pink-600 text-center mt-24">{error}</div>
  }

  return (
    <div className="services-page mt-20">
      <h1 className="services-title text-purple-700">Our Services</h1>

      {error && <div className="error-message mb-4">{error}</div>}
      {success && <div className="success-message mb-4">{success}</div>}

      {(selectedService || selectedWorker) && (
        <button className="back-btn hover:bg-gray-100 hover:text-purple-700 mb-4" onClick={goBack}>
          ← Back
        </button>
      )}

      {!selectedService ? (
        <div className="services-grid">
          {services.map((service) => (
            <div className="service-item" key={service._id}>
              <ServiceCard service={service} onSelectService={handleServiceSelect} />
            </div>
          ))}
        </div>
      ) : (
        <div className="workers-section">
          <h2 className="text-xl font-bold text-purple-700 mb-4">{selectedService.serviceType} Workers</h2>

          {workers.length > 0 ? (
            <div className="workers-grid">
              {workers.map((worker) => (
                <div className="worker-item" key={worker._id}>
                  <WorkerCard worker={worker} onBookWorker={handleWorkerSelect} />
                </div>
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
