const express = require("express");
const Appointment = require("../models/Appointment");
const router = express.Router();

// ➡️ 1. POST: Book an appointment & Simulate email notification triggers
router.post("/book", async (req, res) => {
  try {
    const { patientId, doctorName, date, timeSlot } = req.body;
    const appointment = new Appointment({ 
      patientId, 
      doctorName, 
      date, 
      timeSlot: timeSlot || "09:00 AM" 
    });
    await appointment.save();

    // 📬 ENHANCEMENT 1: Simulated Email Notification Log
    console.log("=================================================");
    console.log(`✉️ EMAIL SENT TO USER ASSOCIATED WITH ID: ${patientId}`);
    console.log(`Subject: Appointment Confirmed with ${doctorName}`);
    console.log(`Time: ${timeSlot || "09:00 AM"} on ${new Date(date).toLocaleDateString()}`);
    console.log("=================================================");

    res.json({ message: "Appointment booked successfully", appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➡️ 2. GET: Admin Universal Dashboard List View (Admin Gate Mode)
router.get("/admin/all", async (req, res) => {
  try {
    // Fetches every file row entry inside MongoDB Atlas for clinical reviews
    const appointments = await Appointment.find({});
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➡️ 3. GET: Standard regular user lookup file path listing
// 3. GET: Standard regular user lookup file path listing
router.get("/list/:userId", async (req, res) => {
    try {
        // Extract the user ID sent from the frontend URL parameter
        const { userId } = req.params; 

        // ONLY fetch appointments where the patientId matches this specific user
        const appointments = await Appointment.find({ patientId: userId });
        
        res.json(appointments);
    } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➡️ 4. DELETE: Cancel/Remove an appointment slot
router.delete("/cancel/:id", async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;