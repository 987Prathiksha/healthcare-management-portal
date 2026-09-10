const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const Appointment = require("../models/Appointment");

// Patient appointments
router.get("/list/:userId", async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.params.userId });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

// Admin view
router.get("/admin/all", async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch all appointments" });
  }
});

// Cancel appointment
router.delete("/cancel/:appointmentId", async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.appointmentId);
    res.json({ message: "Appointment canceled successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to cancel appointment" });
  }
});

// Generate receipt
router.get("/receipt/:appointmentId", async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=receipt-${appointment._id}.pdf`
    );

    doc.pipe(res);

    // Header
    doc.fontSize(20).fillColor("#333").text("Healthcare Appointment Receipt", {
      align: "center",
    });
    doc.moveDown();

    // Appointment details
    doc.fontSize(12).fillColor("#000");
    doc.text(`Receipt ID: ${appointment._id}`);
    doc.text(`Patient ID: ${appointment.patientId}`);
    doc.text(`Doctor: ${appointment.doctorName}`);
    doc.text(`Date: ${new Date(appointment.date).toLocaleDateString()}`);
    doc.text(`Time Slot: ${appointment.timeSlot}`);
    doc.text(`Status: ${appointment.status}`);
    doc.moveDown();

    // Footer
    doc.fontSize(10).fillColor("#666").text(
      "Thank you for using Smart Healthcare System.",
      { align: "center" }
    );

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate receipt" });
  }
});

module.exports = router;
