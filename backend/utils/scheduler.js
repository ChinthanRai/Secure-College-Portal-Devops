const cron = require('node-cron');
const Course = require('../models/Course');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const { sessionReminder } = require('./emailTemplates');

const scheduleReminders = () => {
    // Run every minute
    cron.schedule('* * * * *', async () => {
        console.log('Running session reminder check...');
        const now = new Date();
        const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60000);

        try {
            // Logic: Find courses starting shortly.
            // Simplified for this demo: Check if current time + 30m matches a stored startDate (or session timing logic if complex)
            // For now, let's assume startDate is the next session for simplicity or add a specific 'nextSessionDate' field.
            // In a real app, you'd parse "Mon, Wed" vs dates. Here we'll just check `startDate` for one-off reliability or adding a new field.

            // Checking logical start dates within a 1-minute window of 30 mins from now
            const startWindow = new Date(thirtyMinutesFromNow.getTime() - 30000);
            const endWindow = new Date(thirtyMinutesFromNow.getTime() + 30000);

            const courses = await Course.find({
                startDate: { $gte: startWindow, $lte: endWindow },
                status: 'active'
            });

            for (const course of courses) {
                // Get enrolled students
                const students = await User.find({ enrolledCourses: course._id });

                for (const student of students) {
                    await sendEmail({
                        email: student.email,
                        subject: `Reminder: ${course.title} Session`,
                        html: sessionReminder(course.title, course.startDate),
                    });
                    console.log(`Reminder sent to ${student.email} for ${course.title}`);
                }
            }

        } catch (error) {
            console.error('Error in scheduler:', error);
        }
    });
};

module.exports = scheduleReminders;
