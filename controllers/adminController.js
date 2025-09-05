const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Journal = require('../models/Journal');

/**
 * @desc    Get aggregated data for the admin dashboard
 * @route   GET /api/admin/stats
 * @access  Private (Admin only)
 */
exports.getDashboardStats = async (req, res) => {
    try {
        // Count total number of students and counselors
        const studentCount = await User.countDocuments({ role: 'student' });
        const counselorCount = await User.countDocuments({ role: 'counselor' });
        
        // Count total number of appointments
        const totalAppointments = await Appointment.countDocuments();
        
        // Aggregate appointments by their status (e.g., scheduled, completed)
        const appointmentsByStatus = await Appointment.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);
        
        // Aggregate journal entries to find mood trends
        const moodTrends = await Journal.aggregate([
            { $group: { _id: '$mood', count: { $sum: 1 } } },
            { $sort: { count: -1 } } // Sort by most frequent mood
        ]);

        // Send the compiled statistics as a JSON response
        res.json({
            userStats: { students: studentCount, counselors: counselorCount },
            appointmentStats: { total: totalAppointments, byStatus: appointmentsByStatus },
            wellbeingTrends: { moods: moodTrends }
        });

    } catch (error) {
        console.error(`Admin Stats Error: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
};