const User = require('../models/User');
const Course = require('../models/Course');
const EnrollmentRequest = require('../models/EnrollmentRequest');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/dashboard-stats
// @access  Private (Admin)
const getDashboardStats = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalCourses = await Course.countDocuments();
        const activeCourses = await Course.countDocuments({ status: 'active' });
        const pendingRequests = await EnrollmentRequest.countDocuments({ status: 'pending' });

        // Calculate Slot Utilization
        const courses = await Course.find({ status: 'active' });
        let totalSlots = 0;
        let filledSlots = 0;
        courses.forEach(c => {
            totalSlots += c.maxSeats;
            filledSlots += c.enrolledCount;
        });

        // Course Popularity (Top 5)
        const popularCourses = await Course.find({ status: 'active' })
            .sort({ enrolledCount: -1 })
            .limit(5)
            .select('title enrolledCount');

        // Student Registration Trend (Last 6 Months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const studentGrowth = await User.aggregate([
            {
                $match: {
                    role: 'student',
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // Map month numbers to names
        const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedGrowth = studentGrowth.map(item => ({
            name: monthNames[item._id],
            students: item.count
        }));

        // Request Trends (Status Distribution)
        const requestStatus = await EnrollmentRequest.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const statusMap = { pending: 0, approved: 0, rejected: 0 };
        requestStatus.forEach(s => statusMap[s._id] = s.count);

        res.json({
            stats: {
                totalStudents,
                totalCourses,
                activeCourses,
                pendingRequests,
                totalSlots,
                filledSlots
            },
            charts: {
                statusDistribution: [
                    { name: 'Pending', value: statusMap.pending },
                    { name: 'Approved', value: statusMap.approved },
                    { name: 'Rejected', value: statusMap.rejected },
                ],
                enrollmentTrends: formattedGrowth,
                coursePopularity: popularCourses.map(c => ({
                    name: c.title,
                    students: c.enrolledCount,
                    fullMark: c.maxSeats // Optional for a composed chart
                }))
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get All Students
// @route   GET /api/admin/students
// @access  Private (Admin)
const getAllStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' })
            .select('-password')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: students.length,
            students
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete Student
// @route   DELETE /api/admin/students/:id
// @access  Private (Admin)
const deleteStudent = async (req, res) => {
    try {
        const student = await User.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        if (student.role !== 'student') {
            return res.status(400).json({ message: 'Cannot delete non-student users' });
        }

        // Delete all enrollment requests associated with this student
        await EnrollmentRequest.deleteMany({ student: req.params.id });

        // Update course enrolled counts if student was enrolled
        if (student.enrolledCourses && student.enrolledCourses.length > 0) {
            for (const courseId of student.enrolledCourses) {
                await Course.findByIdAndUpdate(courseId, {
                    $inc: { enrolledCount: -1 }
                });
            }
        }

        // Delete the student
        await User.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Student deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats, getAllStudents, deleteStudent };
