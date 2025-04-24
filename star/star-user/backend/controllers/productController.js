const Product = require("../models/Product")

exports.getProductsByType = async (req, res) => {
  try {
    const products = await Product.aggregate([{ $group: { _id: "$type", products: { $push: "$$ROOT" } } }])

    const result = {}
    products.forEach((type) => {
      result[type._id] = type.products
    })

    res.json(result)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error: error.message })
  }
}

exports.getFilteredProducts = async (req, res) => {
  try {
    const { type, brand, price } = req.query
    const filter = {}

    if (type) filter.type = type
    if (brand) filter.brand = brand

    if (price) {
      const [min, max] = price.split("-").map(Number)
      filter.price = { $gte: min }
      if (max) filter.price.$lte = max
    }

    const products = await Product.find(filter)
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: "Failed to filter products", error: error.message })
  }
}

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({})
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error: error.message })
  }
}

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.id })
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product", error: error.message })
  }
}
