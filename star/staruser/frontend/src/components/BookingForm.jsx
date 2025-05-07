"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { bookingService } from "../services/api"
import toast from "react-hot-toast"

const BookingForm = ({ worker, service, user, onClose }) => {
  const [step, setStep] = useState(1)
  const [bookingDetails, setBookingDetails] = useState({
    date: "",
    startTime: "",
    endTime: "",
    fullDay: false,
    address: user?.address || "",
    phone: user?.phone || "",
    alternatePhone: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [availability, setAvailability] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      setBookingDetails((prev) => ({
        ...prev,
        address: user.address || "",
        phone: user.phone || "",
      }))
    }
  }, [user])

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
    setLoading(true)

    if (!bookingDetails.date) {
      setError("Please select a date")
      setLoading(false)
      return
    }

    if (!bookingDetails.fullDay && (!bookingDetails.startTime || !bookingDetails.endTime)) {
      setError("Please select both start and end time")
      setLoading(false)
      return
    }

    try {
      const response = await bookingService.checkAvailability({
        workerId: worker._id,
        date: bookingDetails.date,
        startTime: bookingDetails.fullDay ? "09:00" : bookingDetails.startTime,
        endTime: bookingDetails.fullDay ? "18:00" : bookingDetails.endTime,
        fullDay: bookingDetails.fullDay,
      })

      setAvailability(response.data.available)

      if (response.data.available) {
        setStep(2)
      }
    } catch (err) {
      console.error("Error checking availability:", err)
      setError(err.response?.data?.message || "Failed to check availability")
    } finally {
      setLoading(false)
    }
  }

  const handleAddressChange = () => {
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
    setLoading(true)

    if (!bookingDetails.address) {
      setError("Please provide an address")
      setLoading(false)
      return
    }

    if (!bookingDetails.phone) {
      setError("Please provide a phone number")
      setLoading(false)
      return
    }

    try {
      await bookingService.createBooking({
        worker: worker._id,
        service: service._id,
        date: bookingDetails.date,
        startTime: bookingDetails.fullDay ? "09:00" : bookingDetails.startTime,
        endTime: bookingDetails.fullDay ? "18:00" : bookingDetails.endTime,
        fullDay: bookingDetails.fullDay,
        address: bookingDetails.address,
        phone: bookingDetails.phone,
        alternatePhone: bookingDetails.alternatePhone || null,
      })

      toast.success("Service booked successfully!")
      onClose()
    } catch (err) {
      console.error("Booking error:", err)
      setError(err.response?.data?.message || "Failed to book service")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-purple-700">{step === 1 ? "Check Availability" : "Confirm Booking"}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <i className="fas fa-times"></i>
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

      {step === 1 && (
        <>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-6">
            <img
              src={worker.image.startsWith("/uploads") ? `http://localhost:3000${worker.image}` : worker.image}
              alt={worker.name}
              className="w-16 h-16 rounded-full object-cover"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = "/placeholder-worker.jpg"
              }}
            />
            <div>
              <h3 className="font-medium text-purple-700">{worker.name}</h3>
              <p className="text-sm text-gray-600">{worker.serviceType}</p>
              <p className="text-sm font-semibold text-pink-600">₹{worker.feesPerDay} per day</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
              <input
                type="date"
                name="date"
                value={bookingDetails.date}
                onChange={handleInputChange}
                min={new Date().toISOString().split("T")[0]}
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="fullDay"
                name="fullDay"
                checked={bookingDetails.fullDay}
                onChange={handleInputChange}
                className="mr-2 rounded text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="fullDay" className="text-sm font-medium text-gray-700">
                Full Day (9 AM - 6 PM)
              </label>
            </div>

            {!bookingDetails.fullDay && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    value={bookingDetails.startTime}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    value={bookingDetails.endTime}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                  />
                </div>
              </div>
            )}

            {availability === false && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                Worker is not available at the selected time. Please choose a different time or date.
              </div>
            )}

            <button
              onClick={checkAvailability}
              disabled={loading}
              className="w-full py-2 px-4 bg-gradient-primary text-white rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-colors"
            >
              {loading ? "Checking..." : "Check Availability"}
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="border-b border-gray-200 pb-4 mb-4">
            <h3 className="font-medium text-gray-900 mb-2">Booking Details</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium">Service:</span> {service.serviceType}
              </p>
              <p>
                <span className="font-medium">Worker:</span> {worker.name}
              </p>
              <p>
                <span className="font-medium">Date:</span> {new Date(bookingDetails.date).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Time:</span>{" "}
                {bookingDetails.fullDay
                  ? "Full Day (9 AM - 6 PM)"
                  : `${bookingDetails.startTime} - ${bookingDetails.endTime}`}
              </p>
              <p>
                <span className="font-medium">Fees:</span> ₹{worker.feesPerDay}{" "}
                {bookingDetails.fullDay ? "(Full day)" : "(Hourly rate will apply)"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                name="address"
                value={bookingDetails.address}
                onChange={handleInputChange}
                rows="3"
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
              ></textarea>
              <button
                type="button"
                onClick={handleAddressChange}
                className="text-sm text-purple-600 hover:text-purple-800 mt-1"
              >
                {bookingDetails.address === user?.address ? "Use Different Address" : "Use My Address"}
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={bookingDetails.phone}
                onChange={handleInputChange}
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Phone (Optional)</label>
              <input
                type="tel"
                name="alternatePhone"
                value={bookingDetails.alternatePhone}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
              />
            </div>

            <div className="flex gap-4 pt-2">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={confirmBooking}
                disabled={loading}
                className="flex-1 py-2 px-4 bg-gradient-primary text-white rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-colors"
              >
                {loading ? "Processing..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default BookingForm
