const { generateEnrollmentOtp, verifyEnrollmentOtp, getPendingRequests, processEnrollmentRequest } = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.post('/generate-otp', protect, generateEnrollmentOtp);
router.post('/verify-otp', protect, verifyEnrollmentOtp);
router.get('/requests', protect, adminOnly, getPendingRequests);
router.post('/process', protect, adminOnly, processEnrollmentRequest);

module.exports = router;
