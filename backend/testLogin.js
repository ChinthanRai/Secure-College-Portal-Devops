const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const testLogin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        const email = 'salonq100@gmail.com';
        const password = '1234';

        // Find the user
        const user = await User.findOne({ email });

        if (!user) {
            console.log('❌ User not found with email:', email);
            process.exit(1);
        }

        console.log('✅ User found!');
        console.log('User details:', {
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
            createdAt: user.createdAt
        });

        // Test password
        const isMatch = await user.matchPassword(password);

        if (isMatch) {
            console.log('✅ Password is correct!');
            console.log('Login should work. Issue might be on frontend.');
        } else {
            console.log('❌ Password is incorrect!');
            console.log('The password in database does not match "1234"');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

testLogin();
