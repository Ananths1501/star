const mongoose = require("mongoose")
const config = require("config")
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/star"

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("MongoDB Connected...")
  } catch (err) {
    console.error("Database Connection Error:", err.message)
    process.exit(1)
  }
}

module.exports = connectDB
