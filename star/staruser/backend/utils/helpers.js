const Product = require("../models/Product")
const Booking = require("../models/Booking")

// Generate unique product ID
exports.generateProductId = async (type, name) => {
  // Create a prefix from the type (first 3 letters)
  const prefix = type.substring(0, 3).toUpperCase()

  // Count existing products of this type
  const count = await Product.countDocuments({ type })

  // Generate a sequential number
  const sequentialNumber = (count + 1).toString().padStart(4, "0")

  // Create product ID
  return `${prefix}${sequentialNumber}`
}

// Generate verification code for registration
exports.generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Check if a time slot is available for a worker
exports.isTimeSlotAvailable = async (workerId, date, startTime, endTime) => {
  // Convert date string to Date object
  const bookingDate = new Date(date)
  bookingDate.setHours(0, 0, 0, 0)

  // Find bookings for the worker on the given date
  const bookings = await Booking.find({
    worker: workerId,
    date: bookingDate,
    status: { $nin: ["Cancelled"] },
  })

  // If no bookings, the worker is available
  if (bookings.length === 0) {
    return true
  }

  // Convert times to minutes for easier comparison
  const requestStartMinutes = timeToMinutes(startTime)
  const requestEndMinutes = timeToMinutes(endTime)

  // Check for overlap with existing bookings
  for (const booking of bookings) {
    const bookingStartMinutes = timeToMinutes(booking.startTime)
    const bookingEndMinutes = timeToMinutes(booking.endTime)

    // Check if there's an overlap
    if (
      (requestStartMinutes >= bookingStartMinutes && requestStartMinutes < bookingEndMinutes) ||
      (requestEndMinutes > bookingStartMinutes && requestEndMinutes <= bookingEndMinutes) ||
      (requestStartMinutes <= bookingStartMinutes && requestEndMinutes >= bookingEndMinutes)
    ) {
      return false
    }
  }

  return true
}

// Helper to convert time string (HH:MM) to minutes
const timeToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(":").map(Number)
  return hours * 60 + minutes
}
