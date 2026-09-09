const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment'); 

// 🟩 1. Fetch appointments for a specific user
router.get('/list/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const userAppointments = await Appointment.find({
            $or: [{ patientId: userId }, { userId: userId }, { user: userId }]
        });
        return res.status(200).json(userAppointments);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

// 🟩 2. Fetch all appointments (Admin View)
router.get('/admin/all', async (req, res) => {
    try {
        const allAppointments = await Appointment.find({});
        return res.status(200).json(allAppointments);
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

// 🟩 3. Cancel an appointment
router.delete('/cancel/:id', async (req, res) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Canceled successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;