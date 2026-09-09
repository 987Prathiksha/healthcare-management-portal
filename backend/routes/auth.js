const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

// ➡️ REGISTER ROUTE
router.post("/register", async (req, res) => {
  try {
    // FIX 1: Properly destructure user details out of the request body
    const { name, email, password } = req.body;

    // Validate that inputs are present
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all input fields" });
    }

    // Check if the user already exists in the local database instance
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    
    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➡️ LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Locate the user profile document
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 2. Properly compare incoming plain text against the encrypted hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3. Return the payload token along with user details
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET || 'fallback_local_secret', 
      { expiresIn: '1d' }
    );
    
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;