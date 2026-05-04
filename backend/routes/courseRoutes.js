const express = require('express');
const router = express.Router();
const { getCourses, createCourse, deleteCourse } = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.route('/').get(protect, getCourses).post(protect, adminOnly, createCourse);
router.route('/:id').delete(protect, adminOnly, deleteCourse);

module.exports = router;
