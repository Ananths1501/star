const mongoose = require("mongoose");

// MongoDB connection URI
const MONGODB_URI = "mongodb://127.0.0.1:27017/star";

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected!");
  insertProducts();
}).catch((err) => {
  console.error("Connection error:", err);
});

// Define the schema
const productSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  stock: { type: Number, required: true },
  minStock: { type: Number, required: true },
  description: { type: String, required: true },
  warranty: { type: Number, default: 0 },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save hook to update updatedAt
productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Product = mongoose.model("Product", productSchema);

// Insert Products
async function insertProducts() {
  try {
    const products = [
      {
        productId: "P001",
        name: "LED Bulb 12W",
        brand: "Philips",
        type: "Lighting",
        price: 120,
        discount: 10,
        stock: 150,
        minStock: 20,
        description: "Energy efficient 12W LED bulb with B22 base",
        warranty: 12,
        image: "/uploads/ledbulb12w.jpg",
      },
      {
        productId: "P002",
        name: "Ceiling Fan 48\"",
        brand: "Havells",
        type: "Fan",
        price: 2400,
        discount: 5,
        stock: 60,
        minStock: 10,
        description: "High-speed ceiling fan with 3 blades and 48-inch sweep",
        warranty: 24,
        image: "/uploads/ceilingfan.jpg",
      },
      {
        productId: "P003",
        name: "Modular Switch",
        brand: "Legrand",
        type: "Switches",
        price: 45,
        discount: 0,
        stock: 300,
        minStock: 50,
        description: "Stylish modular switch with smooth operation",
        warranty: 6,
        image: "/uploads/switch.jpg",
      },
      {
        productId: "P004",
        name: "LED Tube Light 22W",
        brand: "Syska",
        type: "Lighting",
        price: 350,
        discount: 15,
        stock: 100,
        minStock: 20,
        description: "22W LED tube light with uniform brightness",
        warranty: 18,
        image: "/uploads/tubelightsyska.jpg",
      },
      {
        productId: "P005",
        name: "Power Extension Box",
        brand: "Anchor",
        type: "Electrical Accessories",
        price: 280,
        discount: 5,
        stock: 80,
        minStock: 15,
        description: "Extension box with 4 sockets and surge protection",
        warranty: 12,
        image: "/uploads/extensionbox.jpg",
      },
      {
        productId: "P006",
        name: "Electric Kettle",
        brand: "Bajaj",
        type: "Appliance",
        price: 950,
        discount: 10,
        stock: 40,
        minStock: 5,
        description: "1.5L electric kettle with auto shut-off",
        warranty: 12,
        image: "/uploads/kettle.jpg",
      },
      {
        productId: "P007",
        name: "Iron Box",
        brand: "Morphy Richards",
        type: "Appliance",
        price: 1300,
        discount: 8,
        stock: 55,
        minStock: 10,
        description: "Dry iron with non-stick soleplate and temperature control",
        warranty: 24,
        image: "/uploads/ironbox.jpg",
      },
      {
        productId: "P008",
        name: "Door Bell",
        brand: "GM",
        type: "Security",
        price: 180,
        discount: 5,
        stock: 90,
        minStock: 15,
        description: "Electronic door bell with loud chime",
        warranty: 6,
        image: "/uploads/doorbell.jpg",
      },
      {
        productId: "P009",
        name: "3-Pin Plug",
        brand: "Havells",
        type: "Plug",
        price: 35,
        discount: 0,
        stock: 500,
        minStock: 100,
        description: "3-pin plug top with durable build quality",
        warranty: 6,
        image: "/uploads/plugtop.jpg",
      },
      {
        productId: "P010",
        name: "Electric Wire 90m",
        brand: "Polycab",
        type: "Wiring",
        price: 1450,
        discount: 7,
        stock: 25,
        minStock: 5,
        description: "FR insulated copper wire 90m coil",
        warranty: 60,
        image: "/uploads/polygreenwire.jpg",
      },
      {
        productId: "P011",
        name: "LED Flood Light 50W",
        brand: "Wipro",
        type: "Outdoor Lighting",
        price: 1850,
        discount: 10,
        stock: 30,
        minStock: 5,
        description: "Bright 50W LED floodlight for outdoor lighting",
        warranty: 24,
        image: "/uploads/floodlight.jpg",
      },
      {
        productId: "P012",
        name: "MCB 16A SP",
        brand: "L&T",
        type: "Circuit Protection",
        price: 160,
        discount: 5,
        stock: 100,
        minStock: 20,
        description: "16A single pole MCB for circuit protection",
        warranty: 12,
        image: "/uploads/mcb.jpg",
      },
      {
        productId: "P013",
        name: "LED Downlight 9W",
        brand: "Crompton",
        type: "Lighting",
        price: 290,
        discount: 8,
        stock: 70,
        minStock: 10,
        description: "9W round LED downlight with backlit panel",
        warranty: 18,
        image: "/uploads/downlight.jpg",
      },
      {
        productId: "P014",
        name: "Electric Heater Rod",
        brand: "Usha",
        type: "Heating",
        price: 370,
        discount: 10,
        stock: 40,
        minStock: 10,
        description: "1000W immersion water heater rod",
        warranty: 12,
        image: "/uploads/heaterrod.jpg",
      },
      {
        productId: "P015",
        name: "2-Way Switch",
        brand: "GM",
        type: "Switches",
        price: 65,
        discount: 0,
        stock: 120,
        minStock: 20,
        description: "Modular 2-way switch with soft touch",
        warranty: 6,
        image: "/uploads/2wayswitch.jpg",
      },
      {
        productId: "P016",
        name: "LED Strip Light 5m",
        brand: "Eveready",
        type: "Decorative Lighting",
        price: 450,
        discount: 15,
        stock: 45,
        minStock: 10,
        description: "Waterproof flexible LED strip light for decor",
        warranty: 6,
        image: "/uploads/striplight.jpg",
      },
      {
        productId: "P017",
        name: "Socket with Indicator",
        brand: "Anchor",
        type: "Socket",
        price: 90,
        discount: 5,
        stock: 200,
        minStock: 40,
        description: "Socket with power indicator for added safety",
        warranty: 6,
        image: "/uploads/socket.jpg",
      },
      {
        productId: "P018",
        name: "Digital Multimeter",
        brand: "Mastech",
        type: "Tool",
        price: 1250,
        discount: 12,
        stock: 20,
        minStock: 5,
        description: "Multimeter for voltage, current, resistance testing",
        warranty: 12,
        image: "/uploads/multimeter.jpg",
      },
      {
        productId: "P019",
        name: "Soldering Iron 25W",
        brand: "Soldron",
        type: "Tool",
        price: 250,
        discount: 0,
        stock: 50,
        minStock: 10,
        description: "25W soldering iron for electronics projects",
        warranty: 6,
        image: "/uploads/solderingiron.jpg",
      },
      {
        productId: "P020",
        name: "Electrical Tape (Red)",
        brand: "Steelgrip",
        type: "Accessory",
        price: 25,
        discount: 0,
        stock: 300,
        minStock: 50,
        description: "Insulation tape for electrical work",
        warranty: 0,
        image: "/uploads/electrictape.jpg",
      }
    ];

    await Product.insertMany(products);
    console.log("20 products inserted successfully.");
  } catch (err) {
    console.error("Insert failed:", err);
  } finally {
    mongoose.connection.close();
  }
}
