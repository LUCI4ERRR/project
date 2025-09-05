const Appointment = require('../models/Appointment');
const User = require('../models/User');

/**
 * @desc    Get a list of all available counselors
 * @route   GET /api/appointments/counselors
 * @access  Private (Logged-in users)
 */
exports.getAvailableCounselors = async (req, res) => {
    try {
        // Finds all users with the 'counselor' role and returns only their name and email.
        const counselors = await User.find({ role: 'counselor' }).select('name email');
        res.json(counselors);
    } catch (error) {
        console.error(`Get Counselors Error: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Book a new appointment
 * @route   POST /api/appointments/book
 * @access  Private (Students only)
 */
exports.bookAppointment = async (req, res) => {
    // Extracts booking details from the incoming request.
    const { counselor, appointmentDate, mode } = req.body;
    try {
        // Creates a new appointment document in the database.
        const newAppointment = await Appointment.create({
            student: req.user.id, // The student's ID comes from the auth token (middleware).
            counselor,
            appointmentDate,
            mode
        });
        res.status(201).json(newAppointment); // Sends the new appointment back as confirmation.
    } catch (error) {
        console.error(`Book Appointment Error: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Get appointments for the logged-in user (student or counselor)
 * @route   GET /api/appointments/my
 * @access  Private
 */
exports.getMyAppointments = async (req, res) => {
    try {
        let query = {};
        // Checks the user's role to fetch the correct appointments.
        if (req.user.role === 'student') {
            query = { student: req.user.id };
        } else if (req.user.role === 'counselor') {
            query = { counselor: req.user.id };
        } else {
            // If the user is not a student or counselor, they can't view appointments.
            return res.status(403).json({ message: 'User role cannot view appointments.' });
        }
        
        // Finds appointments based on the query.
        const appointments = await Appointment.find(query)
            // .populate() replaces the student/counselor IDs with their actual documents (name and email).
            .populate('counselor', 'name email') 
            .populate('student', 'name email')
            .sort({ appointmentDate: -1 }); // Sorts by date, newest first.
            
        res.json(appointments);
    } catch (error) {
        console.error(`Get My Appointments Error: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
};

