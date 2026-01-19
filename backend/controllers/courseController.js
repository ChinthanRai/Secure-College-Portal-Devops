const Course = require('../models/Course');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private (Student/Admin)
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({});
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private (Admin only)
const createCourse = async (req, res) => {
    const { title, code, description, credits, instructor } = req.body;

    try {
        const course = new Course({
            title,
            code,
            description,
            credits,
            instructor,
        });

        const createdCourse = await course.save();
        res.status(201).json(createdCourse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getCourses, createCourse };
