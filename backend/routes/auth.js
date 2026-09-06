const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Make sure imports are present at the top
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

// ➡️ REGISTER ROUTE
router.post("/register", async (req, res) => {
  try {
    // FIXED: Added this line to extract form data from the request body
    const { name, email, password, role } = req.body; 

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    
    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➡️ LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // FIXED: Ensured options object is properly structured and closed
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;