const User = require('../models/User');
const Course = require('../models/Course');
const Otp = require('../models/Otp');
const sendEmail = require('../utils/sendEmail');

// @desc    Generate OTP for Course Enrollment
// @route   POST /api/enrollment/generate-otp
// @access  Private (Student)
const generateEnrollmentOtp = async (req, res) => {
    const { courseId } = req.body;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if (user.enrolledCourses.includes(courseId)) {
            return res.status(400).json({ message: 'Already enrolled in this course' });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Save/Update OTP in DB
        await Otp.findOneAndUpdate(
            { email: user.email },
            { email: user.email, otp: otpCode },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // Send Email
        await sendEmail({
            email: user.email,
            subject: `Course Enrollment OTP: ${course.title}`,
            message: `Your OTP for enrolling in ${course.title} is ${otpCode}`,
            otp: otpCode,
        });

        res.json({ message: 'OTP sent to your email' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify OTP and Create Enrollment Request
// @route   POST /api/enrollment/verify-otp
// @access  Private (Student)
const verifyEnrollmentOtp = async (req, res) => {
    const { courseId, otp } = req.body;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        const dbOtp = await Otp.findOne({ email: user.email });

        if (!dbOtp || dbOtp.otp !== otp) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Check if already requested
        const existingRequest = await EnrollmentRequest.findOne({ student: userId, course: courseId, status: 'pending' });
        if (existingRequest) {
            return res.status(400).json({ message: 'Enrollment request already pending' });
        }

        // Create Enrollment Request
        await EnrollmentRequest.create({
            student: userId,
            course: courseId,
            status: 'pending'
        });

        // Delete OTP after successful use
        await Otp.deleteOne({ _id: dbOtp._id });

        // Fetch course details for email
        const course = await Course.findById(courseId);

        // Send Request Received Email
        await sendEmail({
            email: user.email,
            subject: `Enrollment Request Received: ${course.title}`,
            message: `Your request to enroll in ${course.title} has been received and is waiting for Admin approval.`,
            otp: 'PENDING',
        });

        res.json({ message: 'Enrollment request sent. Waiting for approval.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Pending Enrollment Requests
// @route   GET /api/enrollment/requests
// @access  Private (Admin)
const getPendingRequests = async (req, res) => {
    try {
        const requests = await EnrollmentRequest.find({ status: 'pending' })
            .populate('student', 'name email')
            .populate('course', 'title code');
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Process Enrollment Request (Approve/Reject)
// @route   POST /api/enrollment/process
// @access  Private (Admin)
const processEnrollmentRequest = async (req, res) => {
    const { requestId, action } = req.body; // action: 'approve' or 'reject'

    try {
        const request = await EnrollmentRequest.findById(requestId).populate('student').populate('course');
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (action === 'approve') {
            request.status = 'approved';

            // Add to User's enrolled courses
            const user = await User.findById(request.student._id);
            if (!user.enrolledCourses.includes(request.course._id)) {
                user.enrolledCourses.push(request.course._id);
                await user.save();
            }

            await sendEmail({
                email: request.student.email,
                subject: `Enrollment Approved: ${request.course.title}`,
                message: `Congratulations! Your enrollment in ${request.course.title} has been approved.`,
                otp: 'APPROVED',
            });

        } else if (action === 'reject') {
            request.status = 'rejected';

            await sendEmail({
                email: request.student.email,
                subject: `Enrollment Rejected: ${request.course.title}`,
                message: `Your enrollment request for ${request.course.title} has been rejected. Contact admin for details.`,
                otp: 'REJECTED',
            });
        } else {
            return res.status(400).json({ message: 'Invalid action' });
        }

        await request.save();
        res.json({ message: `Request ${action}ed` });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { generateEnrollmentOtp, verifyEnrollmentOtp, getPendingRequests, processEnrollmentRequest };
