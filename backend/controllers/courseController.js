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
    const {
        title, code, description, credits, instructor,
        maxSeats, startDate, endDate, enrollmentDeadline, sessionTimings
    } = req.body;

    try {
        if (!title || !code || !description || !credits || !instructor) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const course = new Course({
            title,
            code,
            description,
            credits,
            instructor,
            maxSeats: maxSeats || 50,
            startDate: startDate || new Date(),
            endDate: endDate,
            enrollmentDeadline: enrollmentDeadline,
            sessionTimings: sessionTimings || "TBA",
        });

        const createdCourse = await course.save();
        res.status(201).json(createdCourse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private (Admin only)
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (course) {
            await Course.deleteOne({ _id: course._id });
            res.json({ message: 'Course removed' });
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getCourses, createCourse, deleteCourse };
