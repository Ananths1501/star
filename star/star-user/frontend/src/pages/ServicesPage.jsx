"use client"

import { useState, useEffect, useContext } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { AuthContext } from "../context/AuthContext"
import ServiceCard from "../components/ServiceCard"
import WorkerCard from "../components/WorkerCard"
import "./ServicesPage.css"

const ServicesPage = () => {
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [workers, setWorkers] = useState([])
  const [selectedWorker, setSelectedWorker] = useState(null)
  const [bookingDetails, setBookingDetails] = useState({
    date: "",
    startTime: "",
    endTime: "",
    fullDay: false,
    address: "",
    phone: "",
    alternatePhone: "",
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [availability, setAvailability] = useState(null)
  const [step, setStep] = useState(1)
  const { user } = useContext(AuthContext)
  const { userId } = useParams()
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/services")
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

  useEffect(() => {
    if (user) {
      setBookingDetails((prev) => ({
        ...prev,
        address: user.address || "",
        phone: user.phone || "",
      }))
    }
  }, [user])

  const handleServiceSelect = async (service) => {
    setSelectedService(service)
    setSelectedWorker(null)
    setAvailability(null)
    setStep(2)

    try {
      const response = await axios.get(`http://localhost:3000/api/workers?serviceType=${service.serviceType}`)
      setWorkers(response.data)
    } catch (err) {
      console.error("Error fetching workers:", err)
      setError("Failed to load workers. Please try again later.")
    }
  }

  const handleWorkerSelect = (worker) => {
    setSelectedWorker(worker)
    setAvailability(null)
    setStep(3)

    // Reset booking form
    setBookingDetails((prev) => ({
      ...prev,
      date: "",
      startTime: "",
      endTime: "",
      fullDay: false,
    }))
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setBookingDetails((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Reset availability check when inputs change
    setAvailability(null)
  }

  const checkAvailability = async () => {
    setError(null)

    if (!bookingDetails.date) {
      setError("Please select a date")
      return
    }

    if (!bookingDetails.fullDay && (!bookingDetails.startTime || !bookingDetails.endTime)) {
      setError("Please select both start and end time")
      return
    }

    try {
      const response = await axios.post("http://localhost:3000/api/bookings/check-availability", {
        workerId: selectedWorker._id,
        date: bookingDetails.date,
        startTime: bookingDetails.fullDay ? "09:00" : bookingDetails.startTime,
        endTime: bookingDetails.fullDay ? "18:00" : bookingDetails.endTime,
        fullDay: bookingDetails.fullDay,
      })

      setAvailability(response.data.available)

      if (response.data.available) {
        setStep(4)
      }
    } catch (err) {
      console.error("Error checking availability:", err)
      setError(err.response?.data?.message || "Failed to check availability. Please try again.")
    }
  }

  const handleAddressChange = () => {
    // Toggle between user's address and custom address
    if (bookingDetails.address === user.address) {
      setBookingDetails((prev) => ({
        ...prev,
        address: "",
      }))
    } else {
      setBookingDetails((prev) => ({
        ...prev,
        address: user.address || "",
      }))
    }
  }

  const confirmBooking = async () => {
    setError(null)
    setSuccess(null)

    if (!bookingDetails.address) {
      setError("Please provide an address")
      return
    }

    if (!bookingDetails.phone) {
      setError("Please provide a phone number")
      return
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/bookings",
        {
          user: user._id,
          worker: selectedWorker._id,
          service: selectedService._id,
          date: bookingDetails.date,
          startTime: bookingDetails.fullDay ? "09:00" : bookingDetails.startTime,
          endTime: bookingDetails.fullDay ? "18:00" : bookingDetails.endTime,
          fullDay: bookingDetails.fullDay,
          address: bookingDetails.address,
          phone: bookingDetails.phone,
          alternatePhone: bookingDetails.alternatePhone || null,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )

      setSuccess("Service booked successfully!")

      // Reset form and go back to services list
      setTimeout(() => {
        setSelectedService(null)
        setSelectedWorker(null)
        setAvailability(null)
        setStep(1)
        setSuccess(null)
      }, 3000)
    } catch (err) {
      console.error("Booking error:", err)
      setError(err.response?.data?.message || "Failed to book service. Please try again.")
    }
  }

  const goBack = () => {
    if (step === 2) {
      setSelectedService(null)
      setStep(1)
    } else if (step === 3) {
      setSelectedWorker(null)
      setStep(2)
    } else if (step === 4) {
      setStep(3)
    }
  }

  const getWorkerImageUrl = () => {
    if (imageError) {
      return "/placeholder.svg"
    }
    return `http://localhost:3000/${selectedWorker.image}`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (error && !selectedService && !selectedWorker) {
    return <div className="error text-pink-600">{error}</div>
  }

  return (
    <div className="services-page">
      <h1 className="services-title text-purple-700">Our Services</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {step > 1 && (
        <button className="back-btn hover:bg-gray-100 hover:text-purple-700" onClick={goBack}>
          ← Back
        </button>
      )}

      {step === 1 && (
        <div className="services-grid">
          {services.map((service) => (
            <div className="service-item" key={service._id}>
              <ServiceCard service={service} onSelectService={handleServiceSelect} />
            </div>
          ))}
        </div>
      )}

      {step === 2 && selectedService && (
        <div className="workers-section">
          <h2 className="text-purple-700">Available {selectedService.serviceType} Workers</h2>
          <div className="workers-grid">
            {workers.length > 0 ? (
              workers.map((worker) => (
                <div className="worker-item" key={worker._id}>
                  <WorkerCard worker={worker} onBookWorker={handleWorkerSelect} />
                </div>
              ))
            ) : (
              <p className="no-workers">No workers available for this service at the moment.</p>
            )}
          </div>
        </div>
      )}

      {step === 3 && selectedWorker && (
        <div className="booking-section">
          <h2 className="text-purple-700">Check Availability</h2>
          <div className="booking-form bg-gradient-card">
            <div className="worker-preview">
              <img
                src={getWorkerImageUrl() || "/placeholder.svg"}
                alt={selectedWorker.name}
                onError={() => setImageError(true)}
                className="rounded-full object-cover"
              />
              <div className="worker-info">
                <h3 className="text-purple-700">{selectedWorker.name}</h3>
                <p className="text-cyan-600">{selectedWorker.serviceType}</p>
                <p className="text-pink-600 font-bold">₹{selectedWorker.feesPerDay} per day</p>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="date">Select Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={bookingDetails.date}
                onChange={handleInputChange}
                min={new Date().toISOString().split("T")[0]}
                required
                className="border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              />
            </div>

            <div className="form-group">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="fullDay"
                  checked={bookingDetails.fullDay}
                  onChange={handleInputChange}
                  className="mr-2 text-purple-600 focus:ring-purple-500"
                />
                Full Day (9 AM - 6 PM)
              </label>
            </div>

            {!bookingDetails.fullDay && (
              <div className="time-selection">
                <div className="form-group">
                  <label htmlFor="startTime">Start Time</label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={bookingDetails.startTime}
                    onChange={handleInputChange}
                    required
                    className="border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endTime">End Time</label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={bookingDetails.endTime}
                    onChange={handleInputChange}
                    required
                    className="border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                  />
                </div>
              </div>
            )}

            <button
              className="check-availability-btn bg-gradient-primary hover:bg-gradient-primary-hover"
              onClick={checkAvailability}
            >
              Check Availability
            </button>

            {availability === false && (
              <div className="availability-message not-available">
                Worker is not available at the selected time. Please choose a different time or date.
              </div>
            )}
          </div>
        </div>
      )}

      {step === 4 && selectedWorker && availability && (
        <div className="booking-confirmation bg-gradient-card">
          <h2 className="text-purple-700">Confirm Booking</h2>

          <div className="booking-summary">
            <h3>Booking Details</h3>
            <p>
              <strong>Service:</strong> {selectedService.serviceType}
            </p>
            <p>
              <strong>Worker:</strong> {selectedWorker.name}
            </p>
            <p>
              <strong>Date:</strong> {new Date(bookingDetails.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Time:</strong>{" "}
              {bookingDetails.fullDay
                ? "Full Day (9 AM - 6 PM)"
                : `${bookingDetails.startTime} - ${bookingDetails.endTime}`}
            </p>
            <p>
              <strong>Fees:</strong> ₹{selectedWorker.feesPerDay}{" "}
              {bookingDetails.fullDay ? "(Full day)" : "(Hourly rate will apply)"}
            </p>
          </div>

          <div className="contact-details">
            <h3>Contact Details</h3>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                value={bookingDetails.address}
                onChange={handleInputChange}
                required
                className="border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              ></textarea>
              <button
                className="change-address-btn text-purple-600 hover:text-purple-800"
                onClick={handleAddressChange}
              >
                {bookingDetails.address === user.address ? "Use Different Address" : "Use My Address"}
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={bookingDetails.phone}
                onChange={handleInputChange}
                required
                className="border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              />
            </div>

            <div className="form-group">
              <label htmlFor="alternatePhone">Alternate Phone (Optional)</label>
              <input
                type="tel"
                id="alternatePhone"
                name="alternatePhone"
                value={bookingDetails.alternatePhone}
                onChange={handleInputChange}
                className="border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              />
            </div>
          </div>

          <button
            className="confirm-booking-btn bg-gradient-primary hover:bg-gradient-primary-hover"
            onClick={confirmBooking}
          >
            Confirm Booking
          </button>
        </div>
      )}
    </div>
  )
}

export default ServicesPage
