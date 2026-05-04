const mongoose = require('mongoose');
const Course = require('./models/Course');
const dotenv = require('dotenv');

dotenv.config();

const checkCourses = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        const courses = await Course.find();

        if (courses.length === 0) {
            console.log('❌ No courses found in database!');
            console.log('Please create courses from admin panel first.');
        } else {
            console.log(`✅ Found ${courses.length} course(s):`);
            courses.forEach((course, index) => {
                console.log(`\n${index + 1}. ${course.title} (${course.code})`);
                console.log(`   Status: ${course.status}`);
                console.log(`   Seats: ${course.enrolledCount}/${course.maxSeats}`);
                console.log(`   Deadline: ${course.enrollmentDeadline || 'No deadline'}`);
            });
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

checkCourses();
