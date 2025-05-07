const mongoose = require('mongoose');
const config = require('config');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Models
const User = require('../models/User');
const Product = require('../models/Product');
const { Service, Worker } = require('../models/Service');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || config.get('mongoURI'), {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Seed data
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Service.deleteMany({});
    await Worker.deleteMany({});

    console.log('Database cleared');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      userId: 'ADMIN001',
      name: 'Admin User',
      email: 'admin@starelectricals.com',
      phone: '9876543210',
      password: adminPassword,
      address: '123 Admin Street, Admin City, 12345'
    });

    await admin.save();
    console.log('Admin user created');

    // Create test user
    const userPassword = await bcrypt.hash('user123', 10);
    const user = new User({
      userId: 'USER001',
      name: 'Test User',
      email: 'user@example.com',
      phone: '9876543211',
      password: userPassword,
      address: '456 User Street, User City, 12345'
    });

    await user.save();
    console.log('Test user created');

    // Create products
    const products = [
      {
        productId: 'LED0001',
        name: 'LED Bulb 9W',
        brand: 'Philips',
        type: 'Lighting',
        price: 199,
        discount: 10,
        stock: 50,
        minStock: 10,
        description: 'Energy efficient 9W LED bulb with cool daylight effect',
        warranty: 12,
        image: '/images/led-bulb.jpg'
      },
      {
        productId: 'FAN0001',
        name: 'Ceiling Fan',
        brand: 'Havells',
        type: 'Fans',
        price: 1499,
        discount: 5,
        stock: 20,
        minStock: 5,
        description: 'High-speed ceiling fan with 5-star energy rating',
        warranty: 24,
        image: '/images/ceiling-fan.jpg'
      },
      {
        productId: 'SWI0001',
        name: 'Modular Switch',
        brand: 'Legrand',
        type: 'Switches',
        price: 299,
        discount: 0,
        stock: 100,
        minStock: 20,
        description: 'Premium modular switch with elegant design',
        warranty: 12,
        image: '/images/modular-switch.jpg'
      },
      {
        productId: 'CAB0001',
        name: 'Electrical Cable (10m)',
        brand: 'Finolex',
        type: 'Cables',
        price: 599,
        discount: 0,
        stock: 30,
        minStock: 5,
        description: 'High-quality electrical cable for home wiring',
        warranty: 60,
        image: '/images/electrical-cable.jpg'
      },
      {
        productId: 'SOC0001',
        name: 'Power Socket',
        brand: 'Anchor',
        type: 'Sockets',
        price: 349,
        discount: 15,
        stock: 40,
        minStock: 10,
        description: 'Durable power socket with safety features',
        warranty: 12,
        image: '/images/power-socket.jpg'
      }
    ];

    await Product.insertMany(products);
    console.log('Products created');

    // Create services
    const electricalService = new Service({
      serviceType: 'Electrical Installation',
      description: 'Professional electrical installation services for homes and offices',
      image: '/images/electrical-installation.jpg',
      workers: []
    });

    const repairService = new Service({
      serviceType: 'Electrical Repair',
      description: 'Quick and reliable electrical repair services',
      image: '/images/electrical-repair.jpg',
      workers: []
    });

    const maintenanceService = new Service({
      serviceType: 'Maintenance',
      description: 'Regular maintenance services for all electrical systems',
      image: '/images/maintenance.jpg',
      workers: []
    });

    await electricalService.save();
    await repairService.save();
    await maintenanceService.save();
    console.log('Services created');

    // Create workers
    const workers = [
      {
        name: 'John Doe',
        phone: '9876543001',
        address: '789 Worker Street, Worker City, 12345',
        serviceType: 'Electrical Installation',
        feesPerDay: 1000,
        status: 'Available',
        image: '/images/worker1.jpg'
      },
      {
        name: 'Jane Smith',
        phone: '9876543002',
        address: '790 Worker Street, Worker City, 12345',
        serviceType: 'Electrical Installation',
        feesPerDay: 1200,
        status: 'Available',
        image: '/images/worker2.jpg'
      },
      {
        name: 'Robert Johnson',
        phone: '9876543003',
        address: '791 Worker Street, Worker City, 12345',
        serviceType: 'Electrical Repair',
        feesPerDay: 800,
        status: 'Available',
        image: '/images/worker3.jpg'
      },
      {
        name: 'Emily Davis',
        phone: '9876543004',
        address: '792 Worker Street, Worker City, 12345',
        serviceType: 'Electrical Repair',
        feesPerDay: 900,
        status: 'Available',
        image: '/images/worker4.jpg'
      },
      {
        name: 'Michael Wilson',
        phone: '9876543005',
        address: '793 Worker Street, Worker City, 12345',
        serviceType: 'Maintenance',
        feesPerDay: 700,
        status: 'Available',
        image: '/images/worker5.jpg'
      }
    ];

    for (const workerData of workers) {
      const worker = new Worker(workerData);
      await worker.save();

      // Add worker to corresponding service
      const service = await Service.findOne({ serviceType: workerData.serviceType });
      if (service) {
        service.workers.push(worker._id);
        await service.save();
      }
    }

    console.log('Workers created');
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();