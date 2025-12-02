// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt =  require('jsonwebtoken')
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // parse JSON body

// MongoDB connection
const mongoConnectionString = process.env.MONGODB_CONNECTION_STRING;
mongoose.connect(mongoConnectionString)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  userName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema, 'users'); // collection name 'users'

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};


// Routes

// 1. Register User
app.post('/register', async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if ( !email || !password) {
      return res.status(400).json({ message: 'Email and Password are required fields' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({ userName, email, password: hashedPassword });
    const token = generateToken(newUser._id);

    res.status(201).json({ message: 'User registered successfully', userId: newUser._id,token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 2. Login User
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = generateToken(user._id);
    res.status(200).json({ message: 'Login successful', userId: user._id, userName: user.userName,token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
