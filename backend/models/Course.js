const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    credits: {
        type: Number,
        required: true,
    },
    instructor: {
        type: String,
        required: true,
    },
    maxSeats: {
        type: Number,
        required: true,
        default: 50, // Default seat capacity
    },
    enrolledCount: {
        type: Number,
        default: 0,
    },
    enrollmentDeadline: {
        type: Date,
        required: true,
        default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000), // Default 7 days from now
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
    endDate: {
        type: Date,
        required: true,
        default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000), // Default 30 days
    },
    sessionTimings: {
        type: String,
        required: true,
        default: "Mon, Wed 10:00 AM - 11:30 AM",
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'completed'],
        default: 'active',
    },
    prerequisites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    }],
}, {
    timestamps: true,
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
