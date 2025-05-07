const express = require('express');
const cors = require('cors');
const config = require('config');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const morgan = require('morgan');
const dotenv = require('dotenv');
// Initialize express app
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Error handling middleware
app.use(errorHandler);

// Set port
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));