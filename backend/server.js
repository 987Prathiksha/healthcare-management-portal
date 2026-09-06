const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const appointmentRoutes = require("./routes/appointments");

const app = express();
app.use(express.json());
app.use(cors());

// Locate your mongoose connection code and add these option flags
mongoose.connect(process.env.MONGO_URI, {
  tls: true,
  tlsAllowInvalidCertificates: true
})
.then(() => console.log("MongoDB Connected Successfully!"))
.catch((err) => console.error("Database connection failed:", err));

app.use("/auth", authRoutes);
app.use("/appointments", appointmentRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
