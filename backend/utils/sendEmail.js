const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"Secure College Portal" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #0a192f;">Secure College Portal</h2>
        <p>You requested to enroll in a course. Here is your OTP:</p>
        <h1 style="color: #64ffda; background: #112240; display: inline-block; padding: 10px 20px; border-radius: 5px;">${options.otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
