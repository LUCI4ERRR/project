const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    // Link to the User model for the student who booked the appointment
    student: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    // Link to the User model for the counselor
    counselor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    // The date and time for the scheduled appointment
    appointmentDate: {
        type: Date,
        required: [true, 'Please provide an appointment date'],
    },
    // The method of consultation
    mode: {
        type: String,
        enum: ['face-to-face', 'online', 'phone'],
        required: [true, 'Please specify the mode of consultation'],
    },
    // The current status of the appointment
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled'],
        default: 'scheduled',
    },
    // Optional notes that can be added by the student or counselor
    notes: { 
        type: String,
    }
}, { 
    // This option automatically adds `createdAt` and `updatedAt` fields
    timestamps: true 
});

module.exports = mongoose.model('Appointment', AppointmentSchema);

