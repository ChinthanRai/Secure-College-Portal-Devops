const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllStudents, deleteStudent } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.get('/dashboard-stats', protect, adminOnly, getDashboardStats);
router.get('/students', protect, adminOnly, getAllStudents);
router.delete('/students/:id', protect, adminOnly, deleteStudent);

module.exports = router;
