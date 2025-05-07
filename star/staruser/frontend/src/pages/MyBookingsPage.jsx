"use client"

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { bookingService } from "../services/api"
import toast from "react-hot-toast"

const BookingStatusBadge = ({ status }) => {
  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Confirmed: "bg-blue-100 text-blue-800",
    "In Progress": "bg-indigo-100 text-indigo-800",
    Completed: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  }

  const colorClass = statusColors[status] || "bg-gray-100 text-gray-800"

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {status}
    </span>
  )
}

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useContext(AuthContext)
  const [expandedBooking, setExpandedBooking] = useState(null)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        const response = await bookingService.getUserBookings()
        setBookings(response.data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching bookings:", err)
        setError("Failed to load bookings. Please try again.")
        setLoading(false)
      }
    }

    if (user) {
      fetchBookings()
    }
  }, [user])

  const toggleBookingDetails = (bookingId) => {
    if (expandedBooking === bookingId) {
      setExpandedBooking(null)
    } else {
      setExpandedBooking(bookingId)
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingService.cancelBooking(bookingId)

      // Update the booking status in the UI
      setBookings(
        bookings.map((booking) => (booking._id === bookingId ? { ...booking, status: "Cancelled" } : booking)),
      )

      toast.success("Booking cancelled successfully")
    } catch (err) {
      console.error("Error cancelling booking:", err)
      toast.error(err.response?.data?.message || "Failed to cancel booking")
    }
  }

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

  if (bookings.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6 text-purple-700">My Service Bookings</h1>
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600 mb-4">You haven't booked any services yet.</p>
          <Link
            to="/services"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded transition-colors"
          >
            Book a Service
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-purple-700">My Service Bookings</h1>

      <div className="space-y-6">
        {bookings.map((booking) => (
          <div key={booking._id} className="bg-white rounded-lg shadow overflow-hidden">
            <div
              className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer hover:bg-gray-50"
              onClick={() => toggleBookingDetails(booking._id)}
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-800">{booking.service.serviceType}</h3>
                  <BookingStatusBadge status={booking.status} />
                </div>
                <p className="text-sm text-gray-500 mt-1">Booked for {formatDate(booking.date)}</p>
              </div>

              <div className="mt-2 sm:mt-0 text-right">
                <p className="font-bold text-purple-700">{booking.worker.name}</p>
                <div className="flex items-center text-sm text-purple-600 mt-1">
                  {expandedBooking === booking._id ? (
                    <span>
                      Hide Details <i className="fas fa-chevron-up ml-1"></i>
                    </span>
                  ) : (
                    <span>
                      View Details <i className="fas fa-chevron-down ml-1"></i>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {expandedBooking === booking._id && (
              <div className="border-t border-gray-200 p-4">
                <div className="flex flex-col md:flex-row md:justify-between gap-6">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-700 mb-2">Booking Details</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Service:</span> {booking.service.serviceType}
                      </p>
                      <p>
                        <span className="font-medium">Worker:</span> {booking.worker.name}
                      </p>
                      <p>
                        <span className="font-medium">Date:</span> {formatDate(booking.date)}
                      </p>
                      <p>
                        <span className="font-medium">Time:</span>{" "}
                        {booking.fullDay ? "Full Day (9 AM - 6 PM)" : `${booking.startTime} - ${booking.endTime}`}
                      </p>
                      <p>
                        <span className="font-medium">Status:</span> {booking.status}
                      </p>
                      <p>
                        <span className="font-medium">Address:</span> {booking.address}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span> {booking.phone}
                      </p>
                      {booking.alternatePhone && (
                        <p>
                          <span className="font-medium">Alternate Phone:</span> {booking.alternatePhone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="min-w-[200px]">
                    <h4 className="font-semibold text-gray-700 mb-2">Worker Info</h4>
                    <div className="flex items-center mb-4">
                      <img
                        src={
                          booking.worker.image.startsWith("/uploads")
                            ? `http://localhost:3000${booking.worker.image}`
                            : booking.worker.image
                        }
                        alt={booking.worker.name}
                        className="w-12 h-12 rounded-full object-cover mr-3"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "/placeholder-worker.jpg"
                        }}
                      />
                      <div>
                        <p className="font-medium">{booking.worker.name}</p>
                        <p className="text-xs text-gray-500">{booking.worker.serviceType}</p>
                      </div>
                    </div>

                    <p className="text-sm mb-2">
                      <span className="font-medium">Fees:</span> ₹{booking.worker.feesPerDay} per day
                    </p>

                    {["Pending", "Confirmed"].includes(booking.status) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCancelBooking(booking._id)
                        }}
                        className="mt-4 w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-sm"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyBookingsPage
