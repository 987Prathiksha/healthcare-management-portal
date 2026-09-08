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
 //  CORRECT LOGIC
const bcrypt = require('bcryptjs'); // or 'bcrypt' depending on your package.json

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Locate the user profile document
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // 2. Properly compare incoming plain text against the encrypted hash in Atlas
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // 3. Return the payload token along with user details
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        
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