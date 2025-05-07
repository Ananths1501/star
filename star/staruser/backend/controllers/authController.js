const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const path = require('path');
const fs = require('fs');

// Register user
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    user = await User.findOne({ phone });
    if (user) {
      return res.status(400).json({ message: 'User already exists with this phone number' });
    }

    // Generate user ID
    const userCount = await User.countDocuments();
    const userId = `USER${(userCount + 1).toString().padStart(4, '0')}`;

    // Create profile picture path if uploaded
    let profilePic = null;
    if (req.file) {
      // Ensure frontend uploads directory exists
      const frontendUploadsDir = path.join(__dirname, '../../frontend/uploads');
      if (!fs.existsSync(frontendUploadsDir)) {
        fs.mkdirSync(frontendUploadsDir, { recursive: true });
      }

      // Copy file to frontend uploads
      const sourceFile = path.join(__dirname, '../uploads', req.file.filename);
      const destFile = path.join(frontendUploadsDir, req.file.filename);

      fs.copyFileSync(sourceFile, destFile);
      profilePic = `/uploads/${req.file.filename}`;
    }

    // Create new user
    user = new User({
      userId,
      name,
      email,
      phone,
      password,
      address,
      profilePic
    });

    await user.save();

    // Create JWT token
    const payload = {
      userId: user.id
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || config.get('jwtSecret'),
      { expiresIn: process.env.JWT_EXPIRATION || config.get('jwtExpiration') }
    );

    res.status(201).json({
      token,
      user: {
        _id: user.id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        profilePic: user.profilePic
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const payload = {
      userId: user.id
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || config.get('jwtSecret'),
      { expiresIn: process.env.JWT_EXPIRATION || config.get('jwtExpiration') }
    );

    res.json({
      token,
      user: {
        _id: user.id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        profilePic: user.profilePic
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    
    // Find user
    const user = await User.findById(req.user.id);
    
    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    
    // Update profile picture if uploaded
    if (req.file) {
      // Delete previous profile picture if exists
      if (user.profilePic && !user.profilePic.includes('placeholder')) {
        const prevImagePath = path.join(__dirname, '../../frontend', user.profilePic);
        if (fs.existsSync(prevImagePath)) {
          fs.unlinkSync(prevImagePath);
        }
      }
      
      // Ensure frontend uploads directory exists
      const frontendUploadsDir = path.join(__dirname, '../../frontend/uploads');
      if (!fs.existsSync(frontendUploadsDir)) {
        fs.mkdirSync(frontendUploadsDir, { recursive: true });
      }

      // Copy file to frontend uploads
      const sourceFile = path.join(__dirname, '../uploads', req.file.filename);
      const destFile = path.join(frontendUploadsDir, req.file.filename);

      fs.copyFileSync(sourceFile, destFile);
      user.profilePic = `/uploads/${req.file.filename}`;
    }
    
    await user.save();
    
    res.json({
      user: {
        _id: user.id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        profilePic: user.profilePic
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};