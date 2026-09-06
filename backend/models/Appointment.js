const mongoose = require('mongoose');

// The structural blueprint template for saving slots in MongoDB Atlas
const AppointmentSchema = new mongoose.Schema({
  patientId: { 
    type: String, // Changed to String to accept testing mock IDs safely
    required: false 
  },
  doctorName: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  timeSlot: { 
    type: String, 
    default: "10:00 AM" 
  },
  status: { 
    type: String, 
    default: 'booked' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);