const Booking = require("../models/Booking")
const { Service, Worker } = require("../models/Service")
const { isTimeSlotAvailable } = require("../utils/helpers")

// Check worker availability
exports.checkAvailability = async (req, res) => {
  try {
    const { workerId, date, startTime, endTime, fullDay } = req.body

    // Validate input
    if (!workerId || !date || (!fullDay && (!startTime || !endTime))) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    // Check if worker exists
    const worker = await Worker.findById(workerId)
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" })
    }

    // Check if worker is available (not on leave)
    if (worker.status === "On Leave") {
      return res.status(400).json({
        message: "Worker is on leave",
        available: false,
      })
    }

    // Set default times for full day booking
    const checkStartTime = fullDay ? "09:00" : startTime
    const checkEndTime = fullDay ? "18:00" : endTime

    // Check if time slot is available
    const available = await isTimeSlotAvailable(workerId, date, checkStartTime, checkEndTime)

    res.json({ available })
  } catch (error) {
    console.error("Check availability error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const {
      worker: workerId,
      service: serviceId,
      date,
      startTime,
      endTime,
      fullDay,
      address,
      phone,
      alternatePhone,
      notes,
    } = req.body

    // Validate input
    if (!workerId || !serviceId || !date || (!fullDay && (!startTime || !endTime)) || !address || !phone) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    // Check if worker exists
    const worker = await Worker.findById(workerId)
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" })
    }

    // Check if service exists
    const service = await Service.findById(serviceId)
    if (!service) {
      return res.status(404).json({ message: "Service not found" })
    }

    // Check if worker belongs to the service
    if (!service.workers.includes(workerId)) {
      return res.status(400).json({ message: "Worker does not provide this service" })
    }

    // Set default times for full day booking
    const bookingStartTime = fullDay ? "09:00" : startTime
    const bookingEndTime = fullDay ? "18:00" : endTime

    // Check if time slot is available
    const available = await isTimeSlotAvailable(workerId, date, bookingStartTime, bookingEndTime)

    if (!available) {
      return res.status(400).json({ message: "Worker is not available at the selected time" })
    }

    // Create booking
    const booking = new Booking({
      user: req.user._id,
      worker: workerId,
      service: serviceId,
      date: new Date(date),
      startTime: bookingStartTime,
      endTime: bookingEndTime,
      fullDay,
      address,
      phone,
      alternatePhone: alternatePhone || null,
      notes: notes || "",
      status: "Confirmed",
    })

    await booking.save()

    // Update worker status if needed
    if (worker.status === "Available") {
      worker.status = "Busy"
      await worker.save()
    }

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    })
  } catch (error) {
    console.error("Create booking error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get user bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("worker")
      .populate("service")
      .sort({ date: -1 })

    res.json(bookings)
  } catch (error) {
    console.error("Get user bookings error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("worker").populate("service")

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    // Check if booking belongs to user
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to access this booking" })
    }

    res.json(booking)
  } catch (error) {
    console.error("Get booking error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body

    if (!status) {
      return res.status(400).json({ message: "Status is required" })
    }

    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    // Check if booking belongs to user
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this booking" })
    }

    booking.status = status
    await booking.save()

    // Update worker status if booking is completed or cancelled
    if (status === "Completed" || status === "Cancelled") {
      const worker = await Worker.findById(booking.worker)
      if (worker) {
        // Check if worker has other active bookings
        const activeBookings = await Booking.countDocuments({
          worker: worker._id,
          status: { $nin: ["Completed", "Cancelled"] },
          _id: { $ne: booking._id },
        })

        if (activeBookings === 0) {
          worker.status = "Available"
          await worker.save()
        }
      }
    }

    res.json({ message: "Booking status updated successfully", booking })
  } catch (error) {
    console.error("Update booking status error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    // Check if booking belongs to user
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this booking" })
    }

    // Check if booking can be cancelled
    if (["Completed", "Cancelled"].includes(booking.status)) {
      return res.status(400).json({ message: `Booking is already ${booking.status.toLowerCase()}` })
    }

    booking.status = "Cancelled"
    await booking.save()

    // Update worker status if needed
    const worker = await Worker.findById(booking.worker)
    if (worker) {
      // Check if worker has other active bookings
      const activeBookings = await Booking.countDocuments({
        worker: worker._id,
        status: { $nin: ["Completed", "Cancelled"] },
        _id: { $ne: booking._id },
      })

      if (activeBookings === 0) {
        worker.status = "Available"
        await worker.save()
      }
    }

    res.json({ message: "Booking cancelled successfully", booking })
  } catch (error) {
    console.error("Cancel booking error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}
