const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const cors=require('cors');
app.use(cors());

const app = express();
app.use(express.json());

// CORS Configuration - Allows local testing and prepares for deployment URL
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

// MongoDB Connection with secure TLS options
mongoose.connect(process.env.MONGO_URI, {
  tls: true,
  tlsAllowInvalidCertificates: true
})
.then(() => console.log("MongoDB Connected Successfully!"))
.catch((err) => console.error("Database connection failed:", err));

app.use("/auth", authRoutes);
app.use("/appointments", appointmentRoutes);

// Dynamic Port Assignment for Cloud Hosting Platforms
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running smoothly on port ${PORT}`));