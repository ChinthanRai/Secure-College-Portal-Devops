const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const resetPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        const email = 'salonq100@gmail.com';
        const newPassword = '1234';

        // Find the user
        const user = await User.findOne({ email });

        if (!user) {
            console.log('❌ User not found with email:', email);
            process.exit(1);
        }

        console.log('✅ User found:', user.name);

        // Update password
        user.password = newPassword;
        await user.save(); // This will trigger the pre-save hook to hash the password

        console.log('✅ Password has been reset to: 1234');
        console.log('You can now login with:');
        console.log('  Email:', email);
        console.log('  Password: 1234');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

resetPassword();
