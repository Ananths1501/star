const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { verifyToken } = require('../middleware/auth');

// All routes require authentication
router.use(verifyToken);

// Check worker availability
router.post('/check-availability', bookingController.checkAvailability);

// Create booking
router.post('/', bookingController.createBooking);

// Get user bookings
router.get('/', bookingController.getUserBookings);

// Get booking by ID
router.get('/:id', bookingController.getBookingById);

// Update booking status
router.patch('/:id/status', bookingController.updateBookingStatus);

// Cancel booking
router.patch('/:id/cancel', bookingController.cancelBooking);

module.exports = router;