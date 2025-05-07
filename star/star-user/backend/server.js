const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const path = require("path")
const multer = require("multer")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const fs = require("fs")

// Import models
const User = require("./models/User")
const Product = require("./models/Product")
const Order = require("./models/Order")
const { Service, Worker } = require("./models/Service")
const Booking = require("./models/Booking")

// Initialize express app
const app = express()
const PORT = process.env.PORT || 3000
const JWT_SECRET = process.env.JWT_SECRET || "star-electricals-secret-key"

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, file.fieldname + "-" + uniqueSuffix + ext)
  },
})

const upload = multer({ storage: storage })

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/star", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Authentication middleware
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: "Missing Authorization header" })
  }
  const parts = authHeader.split(" ")
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ error: "Invalid Authorization header format" })
  }
  const token = parts[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" })
  }
}

// User routes
app.post("/api/users/register", upload.single("profilePic"), async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      profilePic: req.file ? `uploads/${req.file.filename}` : null,
    })

    await user.save()

    res.status(201).json({ message: "User registered successfully" })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.post("/api/users/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" })

    // Remove password from response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      profilePic: user.profilePic,
    }

    res.json({ token, user: userResponse })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.get("/api/users/me", authenticate, async (req, res) => {
  try {
    const user = {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      address: req.user.address,
      profilePic: req.user.profilePic,
    }

    res.json(user)
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Product routes
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (error) {
    console.error("Get products error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }
    res.json(product)
  } catch (error) {
    console.error("Get product error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.post("/api/products", authenticate, upload.single("image"), async (req, res) => {
  try {
    const { name, brand, type, price, discount, stock, minStock, description, warranty } = req.body

    // Generate product ID
    const count = await Product.countDocuments()
    const productId = `PROD-${(count + 1).toString().padStart(4, "0")}`

    const product = new Product({
      productId,
      name,
      brand,
      type,
      price,
      discount: discount || 0,
      stock,
      minStock,
      description,
      warranty: warranty || 0,
      image: req.file ? `uploads/${req.file.filename}` : null,
    })

    await product.save()

    res.status(201).json(product)
  } catch (error) {
    console.error("Create product error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Order routes
app.post("/api/orders", authenticate, async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod, paymentStatus } = req.body

    const order = new Order({
      user: req.user._id,
      customer: req.user.name,
      items,
      totalAmount,
      paymentMethod,
      paymentStatus,
    })

    await order.save()

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } })
    }

    res.status(201).json(order)
  } catch (error) {
    console.error("Create order error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.get("/api/orders", authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("items.product").sort({ createdAt: -1 })

    res.json(orders)
  } catch (error) {
    console.error("Get orders error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Service routes
app.get("/api/services", async (req, res) => {
  try {
    const services = await Service.find()
    res.json(services)
  } catch (error) {
    console.error("Get services error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.get("/api/workers", async (req, res) => {
  try {
    const { serviceType } = req.query

    const query = serviceType ? { serviceType } : {}
    const workers = await Worker.find(query)

    res.json(workers)
  } catch (error) {
    console.error("Get workers error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Booking routes
app.post("/api/bookings/check-availability", async (req, res) => {
  try {
    const { workerId, date, startTime, endTime, fullDay } = req.body

    // Check if worker exists and is available
    const worker = await Worker.findById(workerId)
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" })
    }

    if (worker.status !== "Available") {
      return res.json({ available: false, message: "Worker is not available" })
    }

    // Check for existing bookings
    const bookingDate = new Date(date)
    const existingBookings = await Booking.find({
      worker: workerId,
      date: bookingDate,
      status: { $nin: ["Cancelled", "Completed"] },
    })

    if (existingBookings.length === 0) {
      return res.json({ available: true })
    }

    // Check time conflicts
    const requestStart = startTime
    const requestEnd = endTime

    for (const booking of existingBookings) {
      const bookingStart = booking.startTime
      const bookingEnd = booking.endTime

      // Check if times overlap
      if (
        (requestStart >= bookingStart && requestStart < bookingEnd) ||
        (requestEnd > bookingStart && requestEnd <= bookingEnd) ||
        (requestStart <= bookingStart && requestEnd >= bookingEnd)
      ) {
        return res.json({ available: false, message: "Worker is already booked during this time" })
      }
    }

    res.json({ available: true })
  } catch (error) {
    console.error("Check availability error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.post("/api/bookings", authenticate, async (req, res) => {
  try {
    const { worker, service, date, startTime, endTime, fullDay, address, phone, alternatePhone } = req.body

    // Check availability again
    const workerObj = await Worker.findById(worker)
    if (!workerObj) {
      return res.status(404).json({ message: "Worker not found" })
    }

    if (workerObj.status !== "Available") {
      return res.status(400).json({ message: "Worker is not available" })
    }

    // Create booking
    const booking = new Booking({
      user: req.user._id,
      worker,
      service,
      date: new Date(date),
      startTime,
      endTime,
      fullDay,
      address,
      phone,
      alternatePhone: alternatePhone || null,
      status: "Pending",
    })

    await booking.save()

    // Update worker status to Busy
    workerObj.status = "Busy"
    await workerObj.save()

    res.status(201).json(booking)
  } catch (error) {
    console.error("Create booking error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.get("/api/bookings", authenticate, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("worker").populate("service").sort({ date: 1 })

    res.json(bookings)
  } catch (error) {
    console.error("Get bookings error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
