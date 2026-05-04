const User = require('../models/User');
const Course = require('../models/Course');
const Otp = require('../models/Otp');
const EnrollmentRequest = require('../models/EnrollmentRequest');
const sendEmail = require('../utils/sendEmail');
const { otpEmail, enrollmentReceived, enrollmentApproved, enrollmentRejected } = require('../utils/emailTemplates');

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

        // Check Logic: Deadline
        if (course.enrollmentDeadline && new Date() > new Date(course.enrollmentDeadline)) {
            return res.status(400).json({ message: 'Enrollment deadline has passed' });
        }

        // Check Logic: Seats
        if (course.enrolledCount >= course.maxSeats) {
            return res.status(400).json({ message: 'Course is full' });
        }

        // Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Save/Update OTP in DB
        await Otp.findOneAndUpdate(
            { email: user.email },
            { email: user.email, otp: otpCode },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // Send Email asynchronously to prevent UI lag
        sendEmail({
            email: user.email,
            subject: `Course Enrollment OTP: ${course.title}`,
            html: otpEmail(otpCode, course.title),
        }).then(() => {
            console.log(`✅ OTP sent successfully to ${user.email}`);
        }).catch((emailError) => {
            console.error('❌ Email sending failed:', emailError.message);
        });

        res.json({ message: 'OTP sent to your email', otp: otpCode }); // Include OTP in response for testing
    } catch (error) {
        console.error('❌ Enrollment OTP Error:', error);
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

        // Send Request Received Email asynchronously
        sendEmail({
            email: user.email,
            subject: `Enrollment Request Received: ${course.title}`,
            html: enrollmentReceived(course.title),
        }).catch(err => console.error('Email error:', err.message));

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

// @desc    Get My Pending Enrollment Requests
// @route   GET /api/enrollment/my-requests
// @access  Private (Student)
const getMyRequests = async (req, res) => {
    try {
        const requests = await EnrollmentRequest.find({ student: req.user._id, status: 'pending' });
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
            // Re-check Seat Availability
            const course = await Course.findById(request.course._id);
            if (course.enrolledCount >= course.maxSeats) {
                return res.status(400).json({ message: 'Course is full. Cannot approve.' });
            }

            request.status = 'approved';

            // Atomic Increment of Seat Count
            await Course.findByIdAndUpdate(course._id, { $inc: { enrolledCount: 1 } });

            // Add to User's enrolled courses
            const user = await User.findById(request.student._id);
            if (!user.enrolledCourses.includes(request.course._id)) {
                user.enrolledCourses.push(request.course._id);
                await user.save();
            }

            sendEmail({
                email: request.student.email,
                subject: `Enrollment Approved: ${request.course.title}`,
                html: enrollmentApproved(request.course.title),
            }).catch(err => console.error('Email error:', err.message));

        } else if (action === 'reject') {
            request.status = 'rejected';

            sendEmail({
                email: request.student.email,
                subject: `Enrollment Rejected: ${request.course.title}`,
                html: enrollmentRejected(request.course.title),
            }).catch(err => console.error('Email error:', err.message));
        } else {
            return res.status(400).json({ message: 'Invalid action' });
        }

        await request.save();
        res.json({ message: `Request ${action}ed` });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { generateEnrollmentOtp, verifyEnrollmentOtp, getPendingRequests, getMyRequests, processEnrollmentRequest };
