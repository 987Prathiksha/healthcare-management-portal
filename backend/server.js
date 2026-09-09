const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// ➡️ IMPORT YOUR ROUTE FILES HERE (Make sure paths match your folder structure)
const authRoutes = require("./routes/auth"); 
const appointmentRoutes = require("./routes/appointments");

const app = express();

// Middlewares
app.use(express.json());

// Fixed CORS configuration to allow local development
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// MongoDB Connection with fallback for local instances
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/healthcare";
mongoose.connect(mongoURI, {
  tls: true,
  tlsAllowInvalidCertificates: true
})
.then(() => console.log("MongoDB Connected Successfully!"))
.catch((err) => console.error("Database connection failed:", err));

// Mount Routes
app.use("/auth", authRoutes);
app.use("/appointments", appointmentRoutes);

// Server Init
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running smoothly on port ${PORT}`));