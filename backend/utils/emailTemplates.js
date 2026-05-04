const getTemplate = (title, content, actionLink, actionText) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 30px 20px; text-align: center; }
        .footer { font-size: 12px; color: #666; text-align: center; margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px; }
        .btn { display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 20px; }
        .warning { color: #DC2626; font-weight: bold; }
        .success { color: #16A34A; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${title}</h1>
        </div>
        <div class="content">
            ${content}
            ${actionLink ? `<a href="${actionLink}" class="btn">${actionText}</a>` : ''}
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Secure College Portal. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

module.exports = {
    otpEmail: (otp, courseTitle) => getTemplate(
        'Enrollment Verification',
        `<p>You have requested to enroll in <strong>${courseTitle}</strong>.</p>
         <p>Your One-Time Password (OTP) is:</p>
         <h2 style="letter-spacing: 5px; font-size: 32px; color: #4F46E5;">${otp}</h2>
         <p>This OTP is valid for 10 minutes.</p>`,
        null, null
    ),
    enrollmentReceived: (courseTitle) => getTemplate(
        'Request Received',
        `<p>Your request to enroll in <strong>${courseTitle}</strong> has been received.</p>
         <p>An administrator will review your application shortly.</p>`,
        null, null
    ),
    enrollmentApproved: (courseTitle) => getTemplate(
        'Enrollment Approved! 🎉',
        `<p class="success">Congratulations!</p>
         <p>Your enrollment in <strong>${courseTitle}</strong> has been approved.</p>
         <p>You can now access the course materials and join sessions.</p>`,
        'http://localhost:5173/dashboard', 'Go to Dashboard'
    ),
    enrollmentRejected: (courseTitle) => getTemplate(
        'Enrollment Status Update',
        `<p class="warning">We're sorry.</p>
         <p>Your enrollment request for <strong>${courseTitle}</strong> could not be approved at this time.</p>
         <p>This may be due to capacity limits or prerequisite requirements.</p>`,
        null, null
    ),
    sessionReminder: (courseTitle, startTime) => getTemplate(
        'Upcoming Session Reminder ⏰',
        `<p>This is a reminder that your session for <strong>${courseTitle}</strong> is starting soon.</p>
         <p><strong>Start Time:</strong> ${new Date(startTime).toLocaleString()}</p>
         <p>Please be ready 5 minutes before the session starts.</p>`,
        'http://localhost:5173/dashboard', 'Join Session'
    )
};
