const express = require('express');
const router = express.Router();
const { generateEnrollmentOtp, verifyEnrollmentOtp, getPendingRequests, getMyRequests, processEnrollmentRequest } = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.post('/generate-otp', protect, generateEnrollmentOtp);
router.post('/verify-otp', protect, verifyEnrollmentOtp);
router.get('/my-requests', protect, getMyRequests);
router.get('/requests', protect, adminOnly, getPendingRequests);
router.post('/process', protect, adminOnly, processEnrollmentRequest);

module.exports = router;
