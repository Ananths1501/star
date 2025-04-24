// backend/seed.js
require("dotenv").config()
const mongoose = require("mongoose")
const connectDB = require("./config/db")
const Product = require("./models/Product")

// Sample product data with updated schema
const products = [
  {
    productId: "TV001",
    name: 'LED Smart TV 55"',
    description: "4K Ultra HD Smart LED TV with HDR",
    price: 45999,
    brand: "Samsung",
    type: "Television",
    discount: 10,
    stock: 15,
    minStock: 5,
    warranty: 24,
    image: "https://via.placeholder.com/300x200?text=Samsung+TV",
  },
  {
    productId: "REF001",
    name: "Refrigerator Double Door",
    description: "300L Double Door Frost Free Refrigerator",
    price: 32999,
    brand: "LG",
    type: "Refrigerator",
    discount: 5,
    stock: 10,
    minStock: 3,
    warranty: 12,
    image: "https://via.placeholder.com/300x200?text=LG+Refrigerator",
  },
  {
    productId: "WM001",
    name: "Washing Machine Front Load",
    description: "8kg Front Load Washing Machine with Steam",
    price: 35999,
    brand: "Bosch",
    type: "Washing Machine",
    discount: 8,
    stock: 8,
    minStock: 2,
    warranty: 24,
    image: "https://via.placeholder.com/300x200?text=Bosch+Washing+Machine",
  },
  {
    productId: "AC001",
    name: "Air Conditioner 1.5 Ton",
    description: "1.5 Ton Split AC with Inverter Technology",
    price: 38999,
    brand: "Daikin",
    type: "Air Conditioner",
    discount: 12,
    stock: 12,
    minStock: 4,
    warranty: 36,
    image: "https://via.placeholder.com/300x200?text=Daikin+AC",
  },
  {
    productId: "MW001",
    name: "Microwave Oven",
    description: "28L Convection Microwave Oven",
    price: 12999,
    brand: "IFB",
    type: "Microwave",
    discount: 5,
    stock: 20,
    minStock: 5,
    warranty: 12,
    image: "https://via.placeholder.com/300x200?text=IFB+Microwave",
  },
  {
    productId: "WP001",
    name: "Water Purifier",
    description: "RO+UV+UF Water Purifier with TDS Controller",
    price: 15999,
    brand: "Kent",
    type: "Water Purifier",
    discount: 7,
    stock: 18,
    minStock: 6,
    warranty: 12,
    image: "https://via.placeholder.com/300x200?text=Kent+Water+Purifier",
  },
  {
    productId: "MG001",
    name: "Mixer Grinder",
    description: "750W Mixer Grinder with 3 Jars",
    price: 3999,
    brand: "Philips",
    type: "Small Appliances",
    discount: 15,
    stock: 25,
    minStock: 8,
    warranty: 24,
    image: "https://via.placeholder.com/300x200?text=Philips+Mixer",
  },
  {
    productId: "IC001",
    name: "Induction Cooktop",
    description: "2000W Induction Cooktop with Auto Shut-off",
    price: 2999,
    brand: "Prestige",
    type: "Small Appliances",
    discount: 10,
    stock: 30,
    minStock: 10,
    warranty: 12,
    image: "https://via.placeholder.com/300x200?text=Prestige+Induction",
  },
  {
    productId: "LB001",
    name: "LED Bulb Pack",
    description: "9W LED Bulbs (Pack of 4)",
    price: 599,
    brand: "Philips",
    type: "Lighting",
    discount: 5,
    stock: 50,
    minStock: 15,
    warranty: 6,
    image: "https://via.placeholder.com/300x200?text=Philips+LED+Bulbs",
  },
  {
    productId: "CF001",
    name: "Ceiling Fan",
    description: "1200mm High Speed Ceiling Fan",
    price: 1999,
    brand: "Havells",
    type: "Fans",
    discount: 8,
    stock: 22,
    minStock: 7,
    warranty: 24,
    image: "https://via.placeholder.com/300x200?text=Havells+Fan",
  },
  {
    productId: "EK001",
    name: "Electric Kettle",
    description: "1.5L Electric Kettle with Auto Shut-off",
    price: 1299,
    brand: "Morphy Richards",
    type: "Small Appliances",
    discount: 12,
    stock: 35,
    minStock: 10,
    warranty: 12,
    image: "https://via.placeholder.com/300x200?text=Morphy+Richards+Kettle",
  },
  {
    productId: "RH001",
    name: "Room Heater",
    description: "2000W Oil Filled Room Heater",
    price: 7999,
    brand: "Bajaj",
    type: "Seasonal",
    discount: 15,
    stock: 15,
    minStock: 5,
    warranty: 12,
    image: "https://via.placeholder.com/300x200?text=Bajaj+Heater",
  },
]

const seedProducts = async () => {
  try {
    // Connect to database
    await connectDB()

    // Delete existing products
    await Product.deleteMany({})
    console.log("Deleted existing products")

    // Insert new products
    await Product.insertMany(products)
    console.log("Added sample products to database")

    // Disconnect from database
    mongoose.connection.close()
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

// Run the seed function
seedProducts()
