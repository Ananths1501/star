const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken } = require('../middleware/auth');

// All routes require authentication
router.use(verifyToken);

// Create order
router.post('/', orderController.createOrder);

// Get user orders
router.get('/', orderController.getUserOrders);

// Get order by ID
router.get('/:id', orderController.getOrderById);

// Update order status
router.patch('/:id/status', orderController.updateOrderStatus);

// Cancel order
router.patch('/:id/cancel', orderController.cancelOrder);

module.exports = router;